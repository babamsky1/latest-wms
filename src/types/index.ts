/**
 * Central exports for all WMS types
 */

export * from './database';
export * from './wms';

// ============================================================================
// STORAGE KEYS - For localStorage persistence
// ============================================================================

export const STORAGE_KEYS = {
  ITEMS: 'wms_items',
  PURCHASE_ORDERS: 'wms_purchase_orders',
  ADJUSTMENTS: 'wms_adjustments',
  WITHDRAWALS: 'wms_withdrawals',
  CUSTOMER_RETURNS: 'wms_customer_returns',
  DELIVERIES: 'wms_deliveries',
  SUPPLIERS: 'wms_suppliers',
  TRANSFERS: 'wms_transfers',
  ORDERS: 'wms_orders',
  PICKERS: 'wms_pickers',
  BARCODERS: 'wms_barcoders',
  TAGGERS: 'wms_taggers',
  CHECKERS: 'wms_checkers',
  TRANSFER_ASSIGNMENTS: 'wms_transfer_assignments',
  WAREHOUSES: 'wms_warehouses',
  CUSTOMERS: 'wms_customers',
} as const;