/**
 * Comprehensive Validation System
 * Provides validation for all WMS entities with business rules
 */

import {
  ValidationError,
  BusinessRuleError,
  InsufficientStockError,
  DuplicateEntryError,
  InvalidStateError,
  PermissionError
} from './ValidationError';
import { ItemMasterRecord, PurchaseOrderRecord, DeliveryRecord } from '@/types/wms';
import { stockLedger } from './StockLedger';
import { auditTrail } from './AuditTrail';
import { globalEventEmitter, WMSEvents } from './EventEmitter';

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: string[];
}

export class ValidationService {
  /**
   * Validate Item Master Record
   */
  validateItemMaster(item: Partial<ItemMasterRecord>): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: string[] = [];

    // Required fields
    if (!item.psc?.trim()) {
      errors.push(new ValidationError('PSC is required', 'psc'));
    } else if (!/^[A-Z0-9-]+$/.test(item.psc)) {
      errors.push(new ValidationError('PSC must contain only uppercase letters, numbers, and hyphens', 'psc'));
    }

    if (!item.shortDescription?.trim()) {
      errors.push(new ValidationError('Short description is required', 'shortDescription'));
    }

    if (!item.barcode?.trim()) {
      errors.push(new ValidationError('Barcode is required', 'barcode'));
    }

    if (!item.brand) {
      errors.push(new ValidationError('Brand is required', 'brand'));
    }

    if (item.cost !== undefined && item.cost < 0) {
      errors.push(new ValidationError('Cost cannot be negative', 'cost'));
    }

    if (item.srp !== undefined && item.srp < 0) {
      errors.push(new ValidationError('SRP cannot be negative', 'srp'));
    }

    if (item.cost !== undefined && item.srp !== undefined && item.cost > item.srp) {
      warnings.push('Cost is higher than SRP - potential pricing issue');
    }

    // Business rules
    if (item.psc && item.barcode) {
      // Check for duplicate PSC or barcode
      // This would typically check against a database
      // For now, we'll emit a validation event
      globalEventEmitter.emit(WMSEvents.VALIDATION_FAILED, {
        entityType: 'item',
        field: 'psc',
        value: item.psc
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Validate Purchase Order
   */
  validatePurchaseOrder(po: Partial<PurchaseOrderRecord>): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: string[] = [];

    // Required fields
    if (!po.poNumber?.trim()) {
      errors.push(new ValidationError('PO Number is required', 'poNumber'));
    }

    if (!po.supplierName?.trim()) {
      errors.push(new ValidationError('Supplier name is required', 'supplierName'));
    }

    if (!po.itemCode?.trim()) {
      errors.push(new ValidationError('Item code is required', 'itemCode'));
    }

    if (po.quantity === undefined || po.quantity <= 0) {
      errors.push(new ValidationError('Quantity must be greater than 0', 'quantity'));
    }

    if (po.unitPrice === undefined || po.unitPrice < 0) {
      errors.push(new ValidationError('Unit price cannot be negative', 'unitPrice'));
    }

    // Date validations
    if (po.orderDate && !this.isValidDate(po.orderDate)) {
      errors.push(new ValidationError('Invalid order date format', 'orderDate'));
    }

    if (po.expectedDate && po.orderDate && po.expectedDate < po.orderDate) {
      errors.push(new ValidationError('Expected date cannot be before order date', 'expectedDate'));
    }

    // Business rules
    if (po.quantity && po.unitPrice) {
      const calculatedTotal = po.quantity * po.unitPrice;
      if (po.totalAmount && Math.abs(po.totalAmount - calculatedTotal) > 0.01) {
        errors.push(new ValidationError('Total amount does not match quantity * unit price', 'totalAmount'));
      }
    }

    // Priority validation
    if (po.priority && !['Low', 'Medium', 'High'].includes(po.priority)) {
      errors.push(new ValidationError('Invalid priority level', 'priority'));
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Validate Delivery
   */
  validateDelivery(delivery: Partial<DeliveryRecord>): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: string[] = [];

    // Required fields
    if (!delivery.referenceNo?.trim()) {
      errors.push(new ValidationError('Reference number is required', 'referenceNo'));
    }

    if (!delivery.supplierCode?.trim()) {
      errors.push(new ValidationError('Supplier code is required', 'supplierCode'));
    }

    if (!delivery.itemCode?.trim()) {
      errors.push(new ValidationError('Item code is required', 'itemCode'));
    }

    if (delivery.quantity === undefined || delivery.quantity <= 0) {
      errors.push(new ValidationError('Quantity must be greater than 0', 'quantity'));
    }

    if (!delivery.warehouse?.trim()) {
      errors.push(new ValidationError('Warehouse is required', 'warehouse'));
    }

    // Date validation
    if (delivery.transferDate && !this.isValidDate(delivery.transferDate)) {
      errors.push(new ValidationError('Invalid transfer date format', 'transferDate'));
    }

    // Status validation
    if (delivery.status && !['Open', 'Pending', 'Done', 'Received', 'For Approval'].includes(delivery.status)) {
      errors.push(new ValidationError('Invalid status', 'status'));
    }

    // Transfer type validation
    if (delivery.transferType && !['Local', 'International'].includes(delivery.transferType)) {
      errors.push(new ValidationError('Invalid transfer type', 'transferType'));
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Validate Stock Operation (e.g., withdrawal, adjustment)
   */
  validateStockOperation(
    productId: string,
    warehouseId: string,
    quantity: number,
    operation: 'withdraw' | 'adjust',
    locationId?: string
  ): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: string[] = [];

    // Check if product exists and has stock
    const balance = locationId
      ? stockLedger.getStockBalance(productId, warehouseId, locationId)
      : stockLedger.getTotalStockBalance(productId, warehouseId);

    if (!balance) {
      errors.push(new ValidationError(`No stock balance found for product ${productId}`, 'productId'));
      return { isValid: false, errors, warnings };
    }

    // For withdrawals, check sufficient stock
    if (operation === 'withdraw') {
      if (balance.availableQuantity < quantity) {
        errors.push(new InsufficientStockError(productId, quantity, balance.availableQuantity));
      }
    }

    // Quantity validation
    if (quantity <= 0) {
      errors.push(new ValidationError('Quantity must be greater than 0', 'quantity'));
    }

    // Business rules
    if (quantity > balance.totalQuantity * 0.8) {
      warnings.push('Operation will reduce stock to less than 20% of current balance');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Validate State Transition
   */
  validateStateTransition(
    entityType: string,
    entityId: string,
    currentState: string,
    newState: string,
    allowedTransitions: Record<string, string[]>
  ): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: string[] = [];

    const allowedNewStates = allowedTransitions[currentState];
    if (!allowedNewStates) {
      errors.push(new InvalidStateError(
        `Invalid current state: ${currentState}`,
        entityType,
        entityId,
        currentState,
        'any valid state'
      ));
    } else if (!allowedNewStates.includes(newState)) {
      errors.push(new InvalidStateError(
        `Cannot transition from ${currentState} to ${newState}`,
        entityType,
        entityId,
        currentState,
        allowedNewStates.join(', ')
      ));
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Validate User Permissions
   */
  validatePermissions(userId: string, requiredPermissions: string[], action?: string): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: string[] = [];

    // This would typically check against a user permission system
    // For now, we'll assume basic validation
    if (!userId) {
      errors.push(new PermissionError(userId, requiredPermissions.join(', '), action));
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Validate Bulk Operations
   */
  validateBulkOperation<T>(
    items: T[],
    validator: (item: T) => ValidationResult,
    maxBatchSize = 100
  ): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: string[] = [];

    if (items.length > maxBatchSize) {
      errors.push(new ValidationError(`Batch size exceeds maximum of ${maxBatchSize} items`, 'batchSize'));
      return { isValid: false, errors, warnings };
    }

    if (items.length === 0) {
      errors.push(new ValidationError('Batch cannot be empty', 'batchSize'));
      return { isValid: false, errors, warnings };
    }

    // Validate each item
    items.forEach((item, index) => {
      const result = validator(item);
      if (!result.isValid) {
        result.errors.forEach(error => {
          // Add batch index to field name for clarity
          const batchError = new ValidationError(
            error.message,
            `item[${index}].${error.field}`,
            error.code,
            error.details
          );
          errors.push(batchError);
        });
      }
      warnings.push(...result.warnings.map(w => `Item ${index}: ${w}`));
    });

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Validate Date Format
   */
  private isValidDate(dateString: string): boolean {
    const date = new Date(dateString);
    return !isNaN(date.getTime()) && dateString.match(/^\d{4}-\d{2}-\d{2}$/) !== null;
  }

  /**
   * Sanitize and validate input data
   */
  sanitizeInput<T extends Record<string, any>>(data: T, schema: Record<string, 'string' | 'number' | 'boolean'>): T {
    const sanitized: any = {};

    for (const [key, type] of Object.entries(schema)) {
      if (data[key] !== undefined) {
        switch (type) {
          case 'string':
            sanitized[key] = String(data[key]).trim();
            break;
          case 'number':
            const num = Number(data[key]);
            sanitized[key] = isNaN(num) ? 0 : num;
            break;
          case 'boolean':
            sanitized[key] = Boolean(data[key]);
            break;
          default:
            sanitized[key] = data[key];
        }
      }
    }

    return sanitized as T;
  }
}

// Global validation service instance
export const validationService = new ValidationService();

// Error handling utility
export function handleValidationError(error: unknown, context?: string): ValidationResult {
  const contextMsg = context ? ` (${context})` : '';

  if (error instanceof ValidationError) {
    auditTrail.logError(`Validation error${contextMsg}: ${error.message}`, {
      field: error.field,
      code: error.code,
      details: error.details
    });

    globalEventEmitter.emit(WMSEvents.VALIDATION_FAILED, {
      error: error.message,
      field: error.field,
      code: error.code,
      context
    });

    return {
      isValid: false,
      errors: [error],
      warnings: []
    };
  }

  if (error instanceof BusinessRuleError) {
    auditTrail.logError(`Business rule violation${contextMsg}: ${error.message}`, {
      rule: error.rule,
      entityType: error.entityType,
      entityId: error.entityId
    });

    return {
      isValid: false,
      errors: [new ValidationError(error.message, undefined, 'BUSINESS_RULE_VIOLATION')],
      warnings: []
    };
  }

  // Generic error handling
  const message = error instanceof Error ? error.message : 'Unknown error occurred';
  auditTrail.logError(`Unexpected error${contextMsg}: ${message}`, { originalError: error });

  return {
    isValid: false,
    errors: [new ValidationError(message, undefined, 'SYSTEM_ERROR')],
    warnings: []
  };
}
