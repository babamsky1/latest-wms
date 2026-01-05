/**
 * Validation Error Classes and Utilities
 */

export class ValidationError extends Error {
  public readonly field?: string;
  public readonly code: string;
  public readonly details?: Record<string, any>;

  constructor(message: string, field?: string, code = 'VALIDATION_ERROR', details?: Record<string, any>) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
    this.code = code;
    this.details = details;
  }
}

export class BusinessRuleError extends Error {
  public readonly rule: string;
  public readonly entityType: string;
  public readonly entityId?: string;

  constructor(message: string, rule: string, entityType: string, entityId?: string) {
    super(message);
    this.name = 'BusinessRuleError';
    this.rule = rule;
    this.entityType = entityType;
    this.entityId = entityId;
  }
}

export class InsufficientStockError extends BusinessRuleError {
  constructor(productId: string, requested: number, available: number) {
    super(
      `Insufficient stock for product ${productId}. Requested: ${requested}, Available: ${available}`,
      'INSUFFICIENT_STOCK',
      'stock',
      productId
    );
    this.name = 'InsufficientStockError';
  }
}

export class DuplicateEntryError extends ValidationError {
  constructor(field: string, value: any, entityType: string) {
    super(
      `${entityType} with ${field} '${value}' already exists`,
      field,
      'DUPLICATE_ENTRY',
      { value, entityType }
    );
    this.name = 'DuplicateEntryError';
  }
}

export class InvalidStateError extends BusinessRuleError {
  constructor(message: string, entityType: string, entityId: string, currentState: string, requiredState: string) {
    super(
      `${message}. Current state: ${currentState}, Required state: ${requiredState}`,
      'INVALID_STATE_TRANSITION',
      entityType,
      entityId
    );
    this.name = 'InvalidStateError';
  }
}

export class PermissionError extends Error {
  public readonly userId: string;
  public readonly requiredPermission: string;

  constructor(userId: string, requiredPermission: string, action?: string) {
    super(`User ${userId} does not have permission to ${action || 'perform this action'}`);
    this.name = 'PermissionError';
    this.userId = userId;
    this.requiredPermission = requiredPermission;
  }
}
