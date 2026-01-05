/**
 * Core WMS Types - Main business objects
 * These types represent the core entities in the Warehouse Management System
 */

import { z } from 'zod';

// ============================================================================
// STOCK MANAGEMENT TYPES
// ============================================================================

/**
 * StockItem - Represents an inventory item in the warehouse
 */
export interface StockItem {
  id: string;
  psc: string; // Product Stock Code
  barcode?: string;
  shortDescription: string;
  longDescription?: string;
  productType: 'Finished Goods' | 'Raw Materials' | 'Packaging' | 'Equipment';
  category: string;
  subCategory?: string;
  brand?: string;
  size?: string;
  color?: string;
  isSaleable: boolean;
  cost: number;
  srp: number; // Suggested Retail Price
  currentStock: number;
  minStock?: number;
  maxStock?: number;
  location?: string;
  warehouseId: string;
  status: 'active' | 'inactive' | 'discontinued';
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

/**
 * Adjustment - Stock quantity adjustments
 */
export interface Adjustment {
  id: string;
  stockItemId: string;
  adjustmentType: 'increase' | 'decrease';
  quantity: number;
  reason: 'damaged' | 'expired' | 'theft' | 'correction' | 'transfer' | 'other';
  notes?: string;
  reference?: string;
  warehouseId: string;
  performedBy: string;
  performedAt: string;
  approvedBy?: string;
  approvedAt?: string;
}

/**
 * Withdrawal - Stock withdrawals for orders/usage
 */
export interface Withdrawal {
  id: string;
  stockItemId: string;
  quantity: number;
  reason: 'order' | 'transfer' | 'damaged' | 'expired' | 'sample' | 'other';
  reference?: string;
  warehouseId: string;
  destination?: string;
  performedBy: string;
  performedAt: string;
}

/**
 * Transfer - Stock transfers between locations/warehouses
 */
export interface Transfer {
  id: string;
  stockItemId: string;
  fromWarehouseId: string;
  toWarehouseId: string;
  fromLocation?: string;
  toLocation?: string;
  quantity: number;
  reason: 'replenishment' | 'optimization' | 'emergency' | 'other';
  status: 'pending' | 'approved' | 'in_transit' | 'completed' | 'cancelled';
  reference?: string;
  requestedBy: string;
  requestedAt: string;
  approvedBy?: string;
  approvedAt?: string;
  completedBy?: string;
  completedAt?: string;
}

// ============================================================================
// SUPPLIER MANAGEMENT TYPES
// ============================================================================

/**
 * Supplier - Vendor information
 */
export interface Supplier {
  id: string;
  code: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  city?: string;
  country?: string;
  taxId?: string;
  paymentTerms?: string;
  leadTimeDays?: number;
  minimumOrderValue?: number;
  rating?: number; // 1-5 stars
  status: 'active' | 'inactive' | 'blocked';
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

/**
 * PurchaseOrder - Purchase orders from suppliers
 */
export interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplierId: string;
  orderDate: string;
  expectedDate: string;
  status: 'draft' | 'pending' | 'approved' | 'ordered' | 'partial' | 'received' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  items: PurchaseOrderItem[];
  totalAmount: number;
  notes?: string;
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

/**
 * PurchaseOrderItem - Individual items in a purchase order
 */
export interface PurchaseOrderItem {
  id: string;
  purchaseOrderId: string;
  stockItemId: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  receivedQuantity: number;
  status: 'pending' | 'partial' | 'received';
}

/**
 * SupplierDelivery - Goods received from suppliers
 */
export interface SupplierDelivery {
  id: string;
  referenceNo: string;
  purchaseOrderId: string;
  supplierId: string;
  deliveryDate: string;
  items: SupplierDeliveryItem[];
  status: 'open' | 'receiving' | 'partial' | 'completed' | 'cancelled';
  packingNo?: string;
  containerNo?: string;
  transferType: 'local' | 'international';
  receivedBy?: string;
  inspectedBy?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

// ============================================================================
// ORDER COMPLETION TYPES
// ============================================================================

/**
 * Order - Customer orders to be fulfilled
 */
export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  orderDate: string;
  requiredDate: string;
  status: 'pending' | 'picking' | 'packing' | 'shipping' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

/**
 * OrderItem - Individual items in an order
 */
export interface OrderItem {
  id: string;
  orderId: string;
  stockItemId: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  pickedQuantity: number;
  packedQuantity: number;
  shippedQuantity: number;
}

/**
 * PickerAssignment - Assignment of items to pickers
 */
export interface PickerAssignment {
  id: string;
  orderId: string;
  pickerId: string;
  assignedItems: PickerAssignmentItem[];
  status: 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  assignedAt: string;
  startedAt?: string;
  completedAt?: string;
  notes?: string;
}

/**
 * PickerAssignmentItem - Specific items assigned to a picker
 */
export interface PickerAssignmentItem {
  id: string;
  pickerAssignmentId: string;
  stockItemId: string;
  location: string;
  requiredQuantity: number;
  pickedQuantity: number;
  status: 'pending' | 'in_progress' | 'completed';
}

/**
 * BarcoderAssignment - Assignment for barcode labeling
 */
export interface BarcoderAssignment {
  id: string;
  orderId: string;
  barcoderId: string;
  assignedItems: BarcoderAssignmentItem[];
  status: 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  assignedAt: string;
  startedAt?: string;
  completedAt?: string;
}

/**
 * BarcoderAssignmentItem - Items for barcode processing
 */
export interface BarcoderAssignmentItem {
  id: string;
  barcoderAssignmentId: string;
  stockItemId: string;
  quantity: number;
  barcodeStatus: 'pending' | 'printed' | 'verified';
}

// ============================================================================
// CUSTOMER RETURNS TYPES
// ============================================================================

/**
 * CustomerReturn - Returns from customers
 */
export interface CustomerReturn {
  id: string;
  returnNumber: string;
  customerId: string;
  orderId?: string;
  returnDate: string;
  status: 'open' | 'receiving' | 'inspection' | 'processing' | 'completed' | 'cancelled';
  items: CustomerReturnItem[];
  totalAmount: number;
  reason: string[];
  notes?: string;
  processedBy?: string;
  inspectedBy?: string;
  approvedBy?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

/**
 * CustomerReturnItem - Individual items in a customer return
 */
export interface CustomerReturnItem {
  id: string;
  customerReturnId: string;
  stockItemId: string;
  quantity: number;
  condition: 'new' | 'used' | 'damaged' | 'defective';
  reason: string;
  disposition: 'restock' | 'repair' | 'scrap' | 'return_to_supplier';
  unitPrice: number;
  totalAmount: number;
}

// ============================================================================
// ORDER MONITORING TYPES
// ============================================================================

/**
 * OrderMonitoring - Real-time order tracking
 */
export interface OrderMonitoring {
  id: string;
  orderId: string;
  currentStage: 'order_received' | 'picking' | 'packing' | 'quality_check' | 'shipping' | 'delivered';
  stageStartTime: string;
  estimatedCompletionTime?: string;
  assignedStaff?: string;
  progress: number; // 0-100
  issues?: string[];
  priority: 'low' | 'medium' | 'high' | 'urgent';
  slaStatus: 'on_track' | 'at_risk' | 'delayed';
  lastUpdated: string;
}

// ============================================================================
// WAREHOUSE & LOCATION TYPES
// ============================================================================

/**
 * Warehouse - Physical warehouse locations
 */
export interface Warehouse {
  id: string;
  code: string;
  name: string;
  type: 'main' | 'branch' | 'satellite';
  location: string;
  capacity?: number;
  status: 'active' | 'inactive' | 'maintenance';
  manager?: string;
  contactPhone?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

/**
 * Location - Specific storage locations within warehouses
 */
export interface Location {
  id: string;
  warehouseId: string;
  zone: 'receiving' | 'storage' | 'picking' | 'shipping' | 'quarantine';
  aisle?: string;
  rack: string;
  bin: string;
  level?: number;
  code: string;
  barcode?: string;
  capacity?: number;
  currentUtilization?: number;
  description?: string;
  status: 'active' | 'inactive' | 'maintenance';
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

/**
 * Customer - Customer information for orders and returns
 */
export interface Customer {
  id: string;
  code: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  city?: string;
  country?: string;
  taxId?: string;
  creditLimit?: number;
  paymentTerms?: string;
  status: 'active' | 'inactive' | 'blocked';
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

// ============================================================================
// ZOD SCHEMAS FOR VALIDATION
// ============================================================================

export const StockItemSchema = z.object({
  id: z.string(),
  psc: z.string().min(1, "PSC is required"),
  barcode: z.string().optional(),
  shortDescription: z.string().min(1, "Short description is required"),
  longDescription: z.string().optional(),
  productType: z.enum(['Finished Goods', 'Raw Materials', 'Packaging', 'Equipment']),
  category: z.string().min(1, "Category is required"),
  subCategory: z.string().optional(),
  brand: z.string().optional(),
  size: z.string().optional(),
  color: z.string().optional(),
  isSaleable: z.boolean(),
  cost: z.number().min(0, "Cost must be non-negative"),
  srp: z.number().min(0, "SRP must be non-negative"),
  currentStock: z.number().min(0, "Stock must be non-negative"),
  minStock: z.number().min(0).optional(),
  maxStock: z.number().min(0).optional(),
  location: z.string().optional(),
  warehouseId: z.string().min(1, "Warehouse is required"),
  status: z.enum(['active', 'inactive', 'discontinued']),
  createdAt: z.string(),
  updatedAt: z.string(),
  createdBy: z.string(),
  updatedBy: z.string(),
});

export const SupplierSchema = z.object({
  id: z.string(),
  code: z.string().min(1, "Supplier code is required"),
  name: z.string().min(1, "Supplier name is required"),
  contactPerson: z.string().min(1, "Contact person is required"),
  phone: z.string().min(1, "Phone is required"),
  email: z.string().email("Invalid email format"),
  address: z.string().min(1, "Address is required"),
  city: z.string().optional(),
  country: z.string().optional(),
  taxId: z.string().optional(),
  paymentTerms: z.string().optional(),
  leadTimeDays: z.number().min(0).optional(),
  minimumOrderValue: z.number().min(0).optional(),
  rating: z.number().min(1).max(5).optional(),
  status: z.enum(['active', 'inactive', 'blocked']),
  createdAt: z.string(),
  updatedAt: z.string(),
  createdBy: z.string(),
  updatedBy: z.string(),
});

export const OrderSchema = z.object({
  id: z.string(),
  orderNumber: z.string().min(1, "Order number is required"),
  customerId: z.string().min(1, "Customer is required"),
  orderDate: z.string().min(1, "Order date is required"),
  requiredDate: z.string().min(1, "Required date is required"),
  status: z.enum(['pending', 'picking', 'packing', 'shipping', 'completed', 'cancelled']),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  items: z.array(z.object({
    id: z.string(),
    orderId: z.string(),
    stockItemId: z.string(),
    quantity: z.number().min(1, "Quantity must be at least 1"),
    unitPrice: z.number().min(0, "Unit price must be non-negative"),
    totalAmount: z.number().min(0),
    pickedQuantity: z.number().min(0),
    packedQuantity: z.number().min(0),
    shippedQuantity: z.number().min(0),
  })),
  totalAmount: z.number().min(0),
  shippingAddress: z.string().min(1, "Shipping address is required"),
  notes: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  createdBy: z.string(),
  updatedBy: z.string(),
});

export const CustomerReturnSchema = z.object({
  id: z.string(),
  returnNumber: z.string().min(1, "Return number is required"),
  customerId: z.string().min(1, "Customer is required"),
  orderId: z.string().optional(),
  returnDate: z.string().min(1, "Return date is required"),
  status: z.enum(['open', 'receiving', 'inspection', 'processing', 'completed', 'cancelled']),
  items: z.array(z.object({
    id: z.string(),
    customerReturnId: z.string(),
    stockItemId: z.string(),
    quantity: z.number().min(1, "Quantity must be at least 1"),
    condition: z.enum(['new', 'used', 'damaged', 'defective']),
    reason: z.string().min(1, "Reason is required"),
    disposition: z.enum(['restock', 'repair', 'scrap', 'return_to_supplier']),
    unitPrice: z.number().min(0),
    totalAmount: z.number().min(0),
  })),
  totalAmount: z.number().min(0),
  reason: z.array(z.string()),
  notes: z.string().optional(),
  processedBy: z.string().optional(),
  inspectedBy: z.string().optional(),
  approvedBy: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  createdBy: z.string(),
  updatedBy: z.string(),
});

// Type inference from schemas
export type StockItemForm = z.infer<typeof StockItemSchema>;
export type SupplierForm = z.infer<typeof SupplierSchema>;
export type OrderForm = z.infer<typeof OrderSchema>;
export type CustomerReturnForm = z.infer<typeof CustomerReturnSchema>;