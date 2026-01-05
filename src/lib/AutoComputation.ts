/**
 * Automated Computation System
 * Handles automatic date fields and total calculations
 */

import { PurchaseOrderRecord, DeliveryRecord } from '@/types/wms';

export interface ComputationRule<T = any> {
  field: keyof T;
  dependencies: (keyof T)[];
  compute: (data: Partial<T>) => any;
  autoUpdate?: boolean; // Whether to recompute when dependencies change
  validate?: (value: any) => boolean;
}

export class AutoComputationService {
  private rules: Map<string, ComputationRule[]> = new Map();

  constructor() {
    this.registerDefaultRules();
  }

  /**
   * Register computation rules for an entity type
   */
  registerRules<T>(entityType: string, rules: ComputationRule<T>[]): void {
    this.rules.set(entityType, rules as ComputationRule[]);
  }

  /**
   * Apply all computation rules for an entity
   */
  applyComputations<T extends Record<string, any>>(
    entityType: string,
    data: Partial<T>,
    options: { skipValidation?: boolean } = {}
  ): Partial<T> {
    const rules = this.rules.get(entityType);
    if (!rules) return data;

    const result = { ...data };
    const computedFields = new Set<keyof T>();

    // Apply computations in dependency order
    let hasChanges = true;
    let iterations = 0;
    const maxIterations = 10; // Prevent infinite loops

    while (hasChanges && iterations < maxIterations) {
      hasChanges = false;
      iterations++;

      for (const rule of rules) {
        // Skip if already computed and not set to auto-update
        if (computedFields.has(rule.field) && !rule.autoUpdate) continue;

        // Check if all dependencies are available
        const hasAllDeps = rule.dependencies.every(dep => result[dep] !== undefined);

        if (hasAllDeps) {
          try {
            const computedValue = rule.compute(result);

            // Validate if validation function provided and not skipping validation
            if (rule.validate && !options.skipValidation) {
              if (!rule.validate(computedValue)) {
                console.warn(`Computed value for ${String(rule.field)} failed validation:`, computedValue);
                continue;
              }
            }

            // Only update if value changed
            if (result[rule.field] !== computedValue) {
              result[rule.field] = computedValue;
              computedFields.add(rule.field);
              hasChanges = true;
            }
          } catch (error) {
            console.error(`Error computing ${String(rule.field)}:`, error);
          }
        }
      }
    }

    if (iterations >= maxIterations) {
      console.warn(`Computation for ${entityType} reached maximum iterations (${maxIterations})`);
    }

    return result;
  }

  /**
   * Get computation rules for an entity type
   */
  getRules(entityType: string): ComputationRule[] {
    return this.rules.get(entityType) || [];
  }

  /**
   * Remove computation rules for an entity type
   */
  removeRules(entityType: string): void {
    this.rules.delete(entityType);
  }

  /**
   * Register default computation rules for WMS entities
   */
  private registerDefaultRules(): void {
    // Purchase Order Rules
    this.registerRules<PurchaseOrderRecord>('purchase_order', [
      {
        field: 'totalAmount',
        dependencies: ['quantity', 'unitPrice'],
        compute: (data) => {
          const qty = Number(data.quantity) || 0;
          const price = Number(data.unitPrice) || 0;
          return Math.round((qty * price) * 100) / 100; // Round to 2 decimal places
        },
        autoUpdate: true,
        validate: (value) => typeof value === 'number' && value >= 0
      },
      {
        field: 'expectedDate',
        dependencies: ['orderDate'],
        compute: (data) => {
          if (!data.orderDate) return undefined;

          // Default to 14 days from order date if not specified
          const orderDate = new Date(data.orderDate);
          orderDate.setDate(orderDate.getDate() + 14);
          return orderDate.toISOString().split('T')[0];
        },
        autoUpdate: false,
        validate: (value) => !value || /^\d{4}-\d{2}-\d{2}$/.test(value)
      },
      {
        field: 'createdAt',
        dependencies: [],
        compute: () => new Date().toISOString(),
        autoUpdate: false
      },
      {
        field: 'updatedAt',
        dependencies: [],
        compute: () => new Date().toISOString(),
        autoUpdate: true
      }
    ]);

    // Delivery Rules
    this.registerRules<DeliveryRecord>('delivery', [
      {
        field: 'transferDate',
        dependencies: [],
        compute: () => new Date().toISOString().split('T')[0],
        autoUpdate: false,
        validate: (value) => /^\d{4}-\d{2}-\d{2}$/.test(value)
      },
      {
        field: 'createdAt',
        dependencies: [],
        compute: () => new Date().toISOString(),
        autoUpdate: false
      },
      {
        field: 'updatedAt',
        dependencies: [],
        compute: () => new Date().toISOString(),
        autoUpdate: true
      }
    ]);

    // Stock Adjustment Rules
    this.registerRules('adjustment', [
      {
        field: 'adjustmentDate',
        dependencies: [],
        compute: () => new Date().toISOString().split('T')[0],
        autoUpdate: false,
        validate: (value) => /^\d{4}-\d{2}-\d{2}$/.test(value)
      },
      {
        field: 'createdAt',
        dependencies: [],
        compute: () => new Date().toISOString(),
        autoUpdate: false
      },
      {
        field: 'updatedAt',
        dependencies: [],
        compute: () => new Date().toISOString(),
        autoUpdate: true
      }
    ]);

    // Customer Return Rules
    this.registerRules('customer_return', [
      {
        field: 'createdAt',
        dependencies: [],
        compute: () => new Date().toISOString(),
        autoUpdate: false
      }
    ]);

    // Transfer Rules
    this.registerRules('transfer', [
      {
        field: 'transferDate',
        dependencies: [],
        compute: () => new Date().toISOString().split('T')[0],
        autoUpdate: false,
        validate: (value) => /^\d{4}-\d{2}-\d{2}$/.test(value)
      },
      {
        field: 'neededDate',
        dependencies: ['transferDate'],
        compute: (data) => {
          if (!data.transferDate) return undefined;

          // Default to 3 days from transfer date
          const transferDate = new Date(data.transferDate);
          transferDate.setDate(transferDate.getDate() + 3);
          return transferDate.toISOString().split('T')[0];
        },
        autoUpdate: false,
        validate: (value) => !value || /^\d{4}-\d{2}-\d{2}$/.test(value)
      },
      {
        field: 'updatedAt',
        dependencies: [],
        compute: () => new Date().toISOString(),
        autoUpdate: true
      }
    ]);
  }
}

// Utility functions for common computations
export const ComputationUtils = {
  /**
   * Calculate total amount from quantity and unit price
   */
  calculateTotal: (quantity: number, unitPrice: number, discountPercent = 0): number => {
    const subtotal = quantity * unitPrice;
    const discount = subtotal * (discountPercent / 100);
    return Math.round((subtotal - discount) * 100) / 100;
  },

  /**
   * Calculate line total for order items
   */
  calculateLineTotal: (
    quantity: number,
    unitPrice: number,
    discountPercent = 0,
    taxPercent = 0
  ): number => {
    const subtotal = quantity * unitPrice;
    const discount = subtotal * (discountPercent / 100);
    const taxableAmount = subtotal - discount;
    const tax = taxableAmount * (taxPercent / 100);
    return Math.round((taxableAmount + tax) * 100) / 100;
  },

  /**
   * Generate next business day
   */
  getNextBusinessDay: (fromDate: Date = new Date(), businessDays = 1): Date => {
    const result = new Date(fromDate);
    let daysAdded = 0;

    while (daysAdded < businessDays) {
      result.setDate(result.getDate() + 1);
      const dayOfWeek = result.getDay();
      // Skip weekends (0 = Sunday, 6 = Saturday)
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        daysAdded++;
      }
    }

    return result;
  },

  /**
   * Format date for display
   */
  formatDate: (date: Date | string): string => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  },

  /**
   * Format date for input fields (YYYY-MM-DD)
   */
  formatDateForInput: (date: Date | string): string => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toISOString().split('T')[0];
  },

  /**
   * Check if date is in the past
   */
  isPastDate: (date: Date | string): boolean => {
    const d = typeof date === 'string' ? new Date(date) : date;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    d.setHours(0, 0, 0, 0);
    return d < today;
  },

  /**
   * Calculate age in days
   */
  getAgeInDays: (fromDate: Date | string): number => {
    const from = typeof fromDate === 'string' ? new Date(fromDate) : fromDate;
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - from.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
};

// Global auto computation service instance
export const autoComputation = new AutoComputationService();
