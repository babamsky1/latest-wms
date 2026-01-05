/**
 * WMS-specific types and interfaces for frontend state management
 */

// --- Local Storage Keys ---
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
} as const;

// --- Item Master Interfaces ---
export interface ItemMasterRecord {
  id: string;
  psc: string;
  shortDescription: string;
  longDescription: string;
  invoiceDescription: string;
  picklistCode: string;
  barcode: string;
  productType: string;
  igDescription: string;
  subId: string;
  brand: "BW" | "KLIK" | "OMG" | "ORO";
  group: string;
  category: string;
  subCategory: string;
  size: string;
  color: string;
  isSaleable: boolean;
  cost: number;
  srp: number;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
  isTestData?: boolean;
}

export interface PurchaseOrderRecord {
  id: string;
  poNumber: string;
  orderDate: string;
  supplierName: string;
  itemCode: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  status: "Draft" | "Pending" | "Approved" | "Received";
  priority: "Low" | "Medium" | "High";
  expectedDate?: string;
  approvedBy?: string;
  approvedAt?: string;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
  isTestData?: boolean;
}

export interface AdjustmentRecord {
  id: string;
  psc: string;
  referenceNo: string;
  adjustmentDate: string;
  sourceReference: string;
  category: "For JO" | "For Zero Out" | "Sample and Retention" | "Wrong Encode";
  warehouse: string;
  status: "Open" | "Pending" | "Done";
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
  isTestData?: boolean;
}

export interface WithdrawalRecord {
  id: string;
  psc: string;
  referenceNo: string;
  transferDate: string;
  category: "Acetone" | "Industrial" | "Consumables";
  warehouse: string;
  status: "Open" | "Pending" | "Done";
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
  isTestData?: boolean;
}

// New Customer Return Record interface
export interface CustomerReturnRecord {
  id: string;
  psc: string;
  referenceNo: string;
  customerCode: string;
  customerName: string;
  company: string;
  warehouse: string;
  status: "Done" | "Open" | "For Segregation";
  amountTotal: number;
  reason: ("OVERSTOCK" | "DAMAGED" | "EXPIRED" | "BAD ORDER" | "PULL OUT")[];
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
  isTestData?: boolean;
}

export interface DeliveryRecord {
  id: string;
  referenceNo: string;
  poNumber?: string; // Original PO number for linking assignments
  transferDate: string;
  supplierCode: string;
  itemCode: string;
  quantity: number;
  packingNo: string;
  containerNo: string;
  transferType: "Local" | "International";
  status: "Open" | "Pending" | "Done" | "Received" | "For Approval";
  warehouse: string;
  approvedBy?: string;
  approvedAt?: string;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
  isTestData?: boolean;
}

export interface SupplierRecord {
  id: string;
  supplierCode: string;
  supplierName: string;
  companyName: string;
  supplierType: "Local" | "International";
  company: string;
  status: "Active" | "Inactive";
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
  isTestData?: boolean;
}

export interface WarehouseMasterRecord {
  id: string;
  code: string;
  name: string;
  type: "Main" | "Branch" | "Production" | "Third Party";
  location: string;
  capacity?: number;
  status: "Active" | "Inactive";
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
}

export interface CustomerMasterRecord {
  id: string;
  code: string;
  name: string;
  company: string;
  address: string;
  type: "Retail" | "Wholesale" | "Distributor";
  status: "Active" | "Inactive";
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
}

export interface TransferItem {
  id: string;
  psc: string;
  quantity: number;
  unit: string;
}

export interface TransferRecord {
  id: string;
  items: TransferItem[];
  referenceNo: string;
  transferDate: string;
  neededDate: string;
  sourceWarehouse: string;
  destinationWarehouse: string;
  requestedBy: string;
  status: "Open" | "Approved" | "In Transit" | "Done" | "Cancelled";
  approvedBy?: string;
  approvedAt?: string;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
  isTestData?: boolean;
}

export interface OrderMonitorRecord {
  id: string;
  poNo: string;
  seriesNo: string;
  customerName: string;
  brand: string;
  pickerStatus: "Done" | "In Progress" | "Pending";
  barcoderStatus: "Done" | "In Progress" | "Pending";
  taggerStatus: "Done" | "In Progress" | "Pending";
  checkerStatus: "Done" | "In Progress" | "Pending";
  overallStatus: "Shipped" | "Ready" | "Processing" | "Delayed";
  deliverySchedule: string;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
  isTestData?: boolean;
}

export interface PickerRecord {
  id: string;
  seriesNo: string;
  poNo: string;
  deliveryReference?: string; // Delivery reference number from Supplier Delivery
  poBrand: string;
  customerName: string;
  routeCode: string;
  dateApproved: string;
  approvedTime: string;
  deliverySchedule: string;
  priorityLevel: "High" | "Medium" | "Low";
  transferType: string;
  receivedBy: string;
  // Status type now allows "No Assignment" for display purposes
  status: "No Assignment" | "Assigned" | "Picking" | "Picked";
  totalQty: number; // Required quantity
  countedQty: number; // Actually counted/picked quantity
  whReceiveDate: string;
  approvedBy: string;
  assignedStaff?: string;
  plRemarks: string;
  // Stock source tracking - assignments not limited to supplier deliveries
  stockSource: "Supplier Delivery" | "Internal Transfer" | "Adjustment" | "Customer Return";
  sourceReference: string; // PO #, Transfer ID, etc.
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
  isTestData?: boolean;
}


export interface BarcoderRecord {
  id: string;
  seriesNo: string;
  poNo: string;
  deliveryReference?: string; // Delivery reference number from Supplier Delivery
  poBrand: string;
  customerName: string;
  routeCode: string;
  barcoderName: string;
  deliverySchedule: string;
  dateApproved: string;
  approvedTime: string;
  priorityLevel: "High" | "Medium" | "Low";
  transferType: string;
  approvedBy: string;
  receivedBy: string;
  status: "Pending" | "Scanning" | "Scanned";
  assignedStaff?: string;
  // Stock source tracking
  stockSource: "Supplier Delivery" | "Internal Transfer" | "Adjustment" | "Customer Return";
  sourceReference: string;
  totalQty: number; // Required quantity
  countedQty: number; // Actually scanned quantity
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
  isTestData?: boolean;
}

export interface TaggerRecord {
  id: string;
  seriesNo: string;
  poNo: string;
  deliveryReference?: string; // Delivery reference number from Supplier Delivery
  poBrand: string;
  customerName: string;
  routeCode: string;
  priorityLevel: "High" | "Medium" | "Low";
  deliverySchedule: string;
  dateApproved: string;
  status: "Pending" | "Tagging" | "Tagged";
  approvedBy: string;
  assignedStaff?: string;
  // Stock source tracking
  stockSource: "Supplier Delivery" | "Internal Transfer" | "Adjustment" | "Customer Return";
  sourceReference: string;
  totalQty: number; // Required quantity
  countedQty: number; // Actually tagged quantity
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
  isTestData?: boolean;
}

export interface CheckerRecord {
  id: string;
  seriesNo: string;
  poNo: string;
  deliveryReference?: string; // Delivery reference number from Supplier Delivery
  customerName: string;
  status: "Pending" | "Checking" | "Checked";
  assignedStaff?: string;
  lastVerified?: string;
  // Stock source tracking
  stockSource: "Supplier Delivery" | "Internal Transfer" | "Adjustment" | "Customer Return";
  sourceReference: string;
  totalQty: number; // Required quantity
  countedQty: number; // Actually verified quantity
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
  isTestData?: boolean;
}

export interface TransferAssignmentRecord {
  id: string;
  transferId: string;
  fromWarehouse: string;
  toWarehouse: string;
  driverName: string;
  assignedStaff?: string;
  status: "Assigned" | "On Delivery" | "Delivered";
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
  isTestData?: boolean;
}

// ============================================================================
// AUDIT TRAIL SYSTEM
// ============================================================================

export interface AuditLogEntry {
  id: string;
  userId: string;
  userName: string;
  action: 'create' | 'update' | 'delete' | 'view' | 'export' | 'login' | 'logout' | 'approve' | 'reject';
  entityType: 'item' | 'purchase_order' | 'adjustment' | 'withdrawal' | 'customer_return' | 'delivery' | 'supplier' | 'transfer' | 'order' | 'picker' | 'barcoder' | 'tagger' | 'checker' | 'transfer_assignment' | 'warehouse' | 'customer' | 'stock' | 'reservation';
  entityId: string;
  entityName?: string; // Human-readable name
  changes?: Record<string, any> | any;
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
  sessionId?: string;
  success: boolean;
  errorMessage?: string;
  metadata?: Record<string, any>; // Additional context
  isTestData?: boolean;
}

export interface UserSession {
  id: string;
  userId: string;
  userName: string;
  loginTime: string;
  logoutTime?: string;
  ipAddress?: string;
  userAgent?: string;
  isActive: boolean;
}

// ============================================================================
// STOCK LEDGER SYSTEM
// ============================================================================

export interface StockLocation {
  warehouseId: string;
  locationId?: string; // Specific location within warehouse
  zone?: string; // receiving, storage, picking, shipping
  aisle?: string;
  rack?: string;
  bin?: string;
}

export interface StockLedgerEntry {
  id: string;
  productId: string; // PSC code
  location: StockLocation;
  transactionType: 'in' | 'out' | 'transfer_in' | 'transfer_out' | 'adjustment' | 'count';
  referenceType: 'purchase_order' | 'sales_order' | 'transfer' | 'adjustment' | 'physical_count' | 'return';
  referenceId: string; // ID of the referencing document
  quantity: number;
  previousBalance: number;
  newBalance: number;
  unitCost?: number;
  totalCost?: number;
  lotNumber?: string;
  expiryDate?: string;
  performedBy: string; // User who performed the transaction
  transactionDate: string;
  notes?: string;
  isTestData?: boolean;
}

export interface StockBalance {
  productId: string;
  warehouseId: string;
  locationId?: string;
  availableQuantity: number;
  reservedQuantity: number;
  totalQuantity: number;
  lastUpdated: string;
  lastUpdatedBy: string;
}

export interface StockReservation {
  id: string;
  productId: string;
  location: StockLocation;
  quantity: number;
  referenceType: string; // 'order', 'transfer', etc.
  referenceId: string;
  reservedBy: string;
  reservedAt: string;
  expiresAt?: string;
  status: 'active' | 'released' | 'expired';
}