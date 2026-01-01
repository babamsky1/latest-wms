/**
 * WMS Database Schema Types
 * Generated from normalized database design
 */

// ============================================================================
// CORE MASTER TABLES
// ============================================================================

export interface Category {
  id: number;
  name: string;
  description?: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: number;
  sku: string;
  name: string;
  category_id: number;
  unit: string;
  barcode?: string;
  cost_price: number;
  selling_price: number;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface Warehouse {
  id: number;
  code: string;
  name: string;
  address: string;
  contact_person: string;
  status: 'active' | 'inactive';
  created_at: string;
}

export interface Location {
  id: number;
  warehouse_id: number;
  rack: string;
  bin: string;
  description?: string;
  status: 'active' | 'inactive';
  created_at: string;
}

export interface Supplier {
  id: number;
  code: string;
  name: string;
  contact_person: string;
  phone: string;
  email: string;
  address: string;
  status: 'active' | 'inactive';
  created_at: string;
}

export interface User {
  id: number;
  full_name: string;
  email: string;
  role: 'admin' | 'warehouse_manager' | 'operator' | 'viewer';
  assigned_warehouse_id?: number;
  status: 'active' | 'inactive';
  last_login?: string;
  created_at: string;
}

// ============================================================================
// INVENTORY CORE
// ============================================================================

export interface Stock {
  id: number;
  product_id: number;
  warehouse_id: number;
  location_id: number;
  quantity: number;
  updated_at: string;
}

// ============================================================================
// OPERATIONS MODULE - RECEIVING
// ============================================================================

export interface Receiving {
  id: number;
  receiving_no: string;
  supplier_id: number;
  warehouse_id: number;
  received_by: number;
  received_date: string;
  status: 'pending' | 'completed' | 'cancelled';
  remarks?: string;
  created_at: string;
}

export interface ReceivingItem {
  id: number;
  receiving_id: number;
  product_id: number;
  location_id: number;
  quantity: number;
  unit: string;
}

// ============================================================================
// OPERATIONS MODULE - RETURNS
// ============================================================================

export interface Return {
  id: number;
  return_no: string;
  return_type: 'customer' | 'internal';
  warehouse_id: number;
  processed_by: number;
  return_date: string;
  remarks?: string;
  created_at: string;
}

export interface ReturnItem {
  id: number;
  return_id: number;
  product_id: number;
  location_id: number;
  quantity: number;
  condition: 'good' | 'damaged' | 'defective';
}

// ============================================================================
// OPERATIONS MODULE - SHIPPING
// ============================================================================

export interface Shipment {
  id: number;
  shipment_no: string;
  order_id: number;
  warehouse_id: number;
  destination: string;
  courier: string;
  shipped_by: number;
  shipped_date: string;
  status: 'pending' | 'in_transit' | 'delivered' | 'cancelled';
  created_at: string;
}

export interface ShipmentItem {
  id: number;
  shipment_id: number;
  product_id: number;
  quantity: number;
  unit: string;
}

// ============================================================================
// INVENTORY TRANSACTIONS
// ============================================================================

export interface StockIn {
  id: number;
  reference_no: string;
  warehouse_id: number;
  performed_by: number;
  date: string;
  remarks?: string;
}

export interface StockOut {
  id: number;
  reference_no: string;
  warehouse_id: number;
  performed_by: number;
  date: string;
  reason?: string;
}

export interface Adjustment {
  id: number;
  product_id: number;
  warehouse_id: number;
  location_id: number;
  previous_qty: number;
  adjusted_qty: number;
  adjustment_type: 'increase' | 'decrease';
  reason: string;
  adjusted_by: number;
  created_at: string;
}

export interface Transfer {
  id: number;
  transfer_no: string;
  product_id: number;
  from_warehouse_id: number;
  from_location_id: number;
  to_warehouse_id: number;
  to_location_id: number;
  quantity: number;
  transferred_by: number;
  transfer_date: string;
  remarks?: string;
}

// ============================================================================
// INQUIRIES & BUFFERING
// ============================================================================

export interface StockInquiryView {
  stock_id: number;
  product_id: number;
  sku: string;
  product_name: string;
  warehouse: string;
  location: string;
  quantity: number;
}

export interface StockLocationInquiryView {
  product_id: number;
  warehouse: string;
  rack: string;
  bin: string;
  quantity: number;
}

export interface StockBuffer {
  id: number;
  product_id: number;
  minimum_stock: number;
  maximum_stock: number;
  reorder_point: number;
  updated_at: string;
}

// ============================================================================
// REPORTS MODULE
// ============================================================================

export interface InventoryReportView {
  product_id: number;
  sku: string;
  product_name: string;
  warehouse: string;
  location: string;
  quantity: number;
}

export interface LowStockReportView {
  product_id: number;
  product_name: string;
  minimum_stock: number;
  current_quantity: number;
  shortage: number;
}

export interface StockMovement {
  id: number;
  product_id: number;
  movement_type: 'in' | 'out' | 'transfer' | 'adjustment' | 'return';
  reference_table: string;
  reference_id: number;
  quantity: number;
  from_location_id?: number;
  to_location_id?: number;
  performed_by: number;
  movement_date: string;
}

// ============================================================================
// ORDERS MODULE
// ============================================================================

export interface Order {
  id: number;
  order_no: string;
  customer_name: string;
  order_type: 'sales' | 'purchase' | 'transfer';
  warehouse_id: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  order_date: string;
  created_at: string;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  unit: string;
}

// ============================================================================
// SETTINGS MODULE
// ============================================================================

export interface Setting {
  id: number;
  setting_key: string;
  setting_value: string;
  updated_by: number;
  updated_at: string;
}

// ============================================================================
// COMPOSITE TYPES (API RESPONSES)
// ============================================================================

export interface ReceivingWithItems extends Receiving {
  items: ReceivingItem[];
  supplier?: Supplier;
  warehouse?: Warehouse;
  received_by_user?: User;
}

export interface ReturnWithItems extends Return {
  items: ReturnItem[];
  warehouse?: Warehouse;
  processed_by_user?: User;
}

export interface ShipmentWithItems extends Shipment {
  items: ShipmentItem[];
  warehouse?: Warehouse;
  shipped_by_user?: User;
  order?: Order;
}

export interface OrderWithItems extends Order {
  items: OrderItem[];
  warehouse?: Warehouse;
}

export interface StockWithDetails extends Stock {
  product?: Product;
  warehouse?: Warehouse;
  location?: Location;
}

export interface AdjustmentWithDetails extends Adjustment {
  product?: Product;
  warehouse?: Warehouse;
  location?: Location;
  adjusted_by_user?: User;
}

export interface TransferWithDetails extends Transfer {
  product?: Product;
  from_warehouse?: Warehouse;
  from_location?: Location;
  to_warehouse?: Warehouse;
  to_location?: Location;
  transferred_by_user?: User;
}

// ============================================================================
// PAGINATION & FILTERS
// ============================================================================

export interface PaginationParams {
  page: number;
  limit: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

// ============================================================================
// API RESPONSES
// ============================================================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}
