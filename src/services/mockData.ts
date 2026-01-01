/**
 * Mock Data Generator
 * Generates realistic fake data for all WMS entities
 */

import type {
  Category,
  Product,
  Warehouse,
  Location,
  Supplier,
  User,
  Stock,
  Receiving,
  ReceivingItem,
  Return,
  ReturnItem,
  Shipment,
  ShipmentItem,
  StockIn,
  StockOut,
  Adjustment,
  Transfer,
  StockBuffer,
  Order,
  OrderItem,
  StockMovement,
} from '@/types/database';

// Utility functions
const randomId = () => Math.floor(Math.random() * 10000) + 1;
const randomDate = (daysBack: number = 30) => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysBack));
  return date.toISOString();
};

const randomElement = <T,>(array: T[]): T =>
  array[Math.floor(Math.random() * array.length)];

const randomBetween = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

// ============================================================================
// MASTER DATA
// ============================================================================

export const mockCategories: Category[] = [
  {
    id: 1,
    name: 'Electronics',
    description: 'Electronic devices and components',
    status: 'active',
    created_at: randomDate(60),
    updated_at: randomDate(30),
  },
  {
    id: 2,
    name: 'Clothing',
    description: 'Apparel and textiles',
    status: 'active',
    created_at: randomDate(60),
    updated_at: randomDate(30),
  },
  {
    id: 3,
    name: 'Furniture',
    description: 'Office and home furniture',
    status: 'active',
    created_at: randomDate(60),
    updated_at: randomDate(30),
  },
  {
    id: 4,
    name: 'Office Supplies',
    description: 'Stationery and office equipment',
    status: 'active',
    created_at: randomDate(60),
    updated_at: randomDate(30),
  },
];

export const mockProducts: Product[] = [
  {
    id: 1,
    sku: 'ELEC-001',
    name: 'Wireless Mouse',
    category_id: 1,
    unit: 'pcs',
    barcode: '1234567890123',
    cost_price: 15.0,
    selling_price: 29.99,
    status: 'active',
    created_at: randomDate(90),
    updated_at: randomDate(30),
  },
  {
    id: 2,
    sku: 'ELEC-002',
    name: 'USB-C Cable',
    category_id: 1,
    unit: 'pcs',
    barcode: '1234567890124',
    cost_price: 3.5,
    selling_price: 9.99,
    status: 'active',
    created_at: randomDate(90),
    updated_at: randomDate(30),
  },
  {
    id: 3,
    sku: 'CLOTH-001',
    name: 'Cotton T-Shirt',
    category_id: 2,
    unit: 'pcs',
    barcode: '1234567890125',
    cost_price: 8.0,
    selling_price: 19.99,
    status: 'active',
    created_at: randomDate(90),
    updated_at: randomDate(30),
  },
  {
    id: 4,
    sku: 'FURN-001',
    name: 'Office Chair',
    category_id: 3,
    unit: 'pcs',
    barcode: '1234567890126',
    cost_price: 80.0,
    selling_price: 199.99,
    status: 'active',
    created_at: randomDate(90),
    updated_at: randomDate(30),
  },
  {
    id: 5,
    sku: 'SUPP-001',
    name: 'A4 Paper Ream',
    category_id: 4,
    unit: 'reams',
    barcode: '1234567890127',
    cost_price: 4.0,
    selling_price: 7.99,
    status: 'active',
    created_at: randomDate(90),
    updated_at: randomDate(30),
  },
];

export const mockWarehouses: Warehouse[] = [
  {
    id: 1,
    code: 'WH-001',
    name: 'Main Warehouse',
    address: '123 Industrial Ave, City, State',
    contact_person: 'John Smith',
    status: 'active',
    created_at: randomDate(120),
  },
  {
    id: 2,
    code: 'WH-002',
    name: 'Secondary Warehouse',
    address: '456 Commerce St, City, State',
    contact_person: 'Jane Doe',
    status: 'active',
    created_at: randomDate(120),
  },
  {
    id: 3,
    code: 'WH-003',
    name: 'Regional Hub',
    address: '789 Logistics Blvd, City, State',
    contact_person: 'Mike Johnson',
    status: 'active',
    created_at: randomDate(120),
  },
];

export const mockLocations: Location[] = [
  {
    id: 1,
    warehouse_id: 1,
    rack: 'A',
    bin: '1',
    description: 'Ground level, front section',
    status: 'active',
    created_at: randomDate(90),
  },
  {
    id: 2,
    warehouse_id: 1,
    rack: 'A',
    bin: '2',
    description: 'Ground level, front section',
    status: 'active',
    created_at: randomDate(90),
  },
  {
    id: 3,
    warehouse_id: 1,
    rack: 'B',
    bin: '1',
    description: 'Ground level, middle section',
    status: 'active',
    created_at: randomDate(90),
  },
  {
    id: 4,
    warehouse_id: 2,
    rack: 'C',
    bin: '1',
    description: 'Elevated storage',
    status: 'active',
    created_at: randomDate(90),
  },
  {
    id: 5,
    warehouse_id: 2,
    rack: 'D',
    bin: '1',
    description: 'Cold storage area',
    status: 'active',
    created_at: randomDate(90),
  },
];

export const mockSuppliers: Supplier[] = [
  {
    id: 1,
    code: 'SUP-001',
    name: 'Tech Supplies Inc',
    contact_person: 'Bob Wilson',
    phone: '555-0101',
    email: 'contact@techsupplies.com',
    address: '100 Tech Park, Tech City',
    status: 'active',
    created_at: randomDate(120),
  },
  {
    id: 2,
    code: 'SUP-002',
    name: 'Fashion Wholesale Ltd',
    contact_person: 'Sarah Lee',
    phone: '555-0102',
    email: 'sales@fashionwholesale.com',
    address: '200 Fashion Ave, Style City',
    status: 'active',
    created_at: randomDate(120),
  },
  {
    id: 3,
    code: 'SUP-003',
    name: 'Furniture Distributors',
    contact_person: 'Robert Brown',
    phone: '555-0103',
    email: 'info@furnituredist.com',
    address: '300 Furniture Lane, Furnish City',
    status: 'active',
    created_at: randomDate(120),
  },
];

export const mockUsers: User[] = [
  {
    id: 1,
    full_name: 'Admin User',
    email: 'admin@wms.com',
    role: 'admin',
    assigned_warehouse_id: 1,
    status: 'active',
    last_login: randomDate(1),
    created_at: randomDate(180),
  },
  {
    id: 2,
    full_name: 'Warehouse Manager',
    email: 'manager@wms.com',
    role: 'warehouse_manager',
    assigned_warehouse_id: 1,
    status: 'active',
    last_login: randomDate(1),
    created_at: randomDate(180),
  },
  {
    id: 3,
    full_name: 'Operator 1',
    email: 'operator1@wms.com',
    role: 'operator',
    assigned_warehouse_id: 1,
    status: 'active',
    last_login: randomDate(2),
    created_at: randomDate(180),
  },
  {
    id: 4,
    full_name: 'Operator 2',
    email: 'operator2@wms.com',
    role: 'operator',
    assigned_warehouse_id: 2,
    status: 'active',
    last_login: randomDate(3),
    created_at: randomDate(180),
  },
  {
    id: 5,
    full_name: 'Viewer User',
    email: 'viewer@wms.com',
    role: 'viewer',
    assigned_warehouse_id: 1,
    status: 'active',
    last_login: randomDate(5),
    created_at: randomDate(180),
  },
];

// ============================================================================
// INVENTORY CORE
// ============================================================================

export const mockStocks: Stock[] = [
  {
    id: 1,
    product_id: 1,
    warehouse_id: 1,
    location_id: 1,
    quantity: 150,
    updated_at: randomDate(7),
  },
  {
    id: 2,
    product_id: 1,
    warehouse_id: 1,
    location_id: 2,
    quantity: 200,
    updated_at: randomDate(7),
  },
  {
    id: 3,
    product_id: 2,
    warehouse_id: 1,
    location_id: 1,
    quantity: 500,
    updated_at: randomDate(7),
  },
  {
    id: 4,
    product_id: 3,
    warehouse_id: 1,
    location_id: 3,
    quantity: 75,
    updated_at: randomDate(7),
  },
  {
    id: 5,
    product_id: 4,
    warehouse_id: 1,
    location_id: 2,
    quantity: 25,
    updated_at: randomDate(7),
  },
  {
    id: 6,
    product_id: 5,
    warehouse_id: 2,
    location_id: 4,
    quantity: 1200,
    updated_at: randomDate(7),
  },
];

export const mockStockBuffers: StockBuffer[] = [
  {
    id: 1,
    product_id: 1,
    minimum_stock: 50,
    maximum_stock: 500,
    reorder_point: 100,
    updated_at: randomDate(30),
  },
  {
    id: 2,
    product_id: 2,
    minimum_stock: 100,
    maximum_stock: 1000,
    reorder_point: 300,
    updated_at: randomDate(30),
  },
  {
    id: 3,
    product_id: 3,
    minimum_stock: 20,
    maximum_stock: 200,
    reorder_point: 50,
    updated_at: randomDate(30),
  },
  {
    id: 4,
    product_id: 4,
    minimum_stock: 10,
    maximum_stock: 100,
    reorder_point: 30,
    updated_at: randomDate(30),
  },
  {
    id: 5,
    product_id: 5,
    minimum_stock: 200,
    maximum_stock: 2000,
    reorder_point: 500,
    updated_at: randomDate(30),
  },
];

// ============================================================================
// OPERATIONS - RECEIVING
// ============================================================================

export const mockReceivings: Receiving[] = [
  {
    id: 1,
    receiving_no: 'RCV-2025-001',
    supplier_id: 1,
    warehouse_id: 1,
    received_by: 2,
    received_date: randomDate(15),
    status: 'completed',
    remarks: 'All items received in good condition',
    created_at: randomDate(15),
  },
  {
    id: 2,
    receiving_no: 'RCV-2025-002',
    supplier_id: 2,
    warehouse_id: 1,
    received_by: 3,
    received_date: randomDate(10),
    status: 'completed',
    remarks: 'Minor damage on one box',
    created_at: randomDate(10),
  },
  {
    id: 3,
    receiving_no: 'RCV-2025-003',
    supplier_id: 3,
    warehouse_id: 2,
    received_by: 4,
    received_date: randomDate(5),
    status: 'pending',
    remarks: 'Waiting for verification',
    created_at: randomDate(5),
  },
];

export const mockReceivingItems: ReceivingItem[] = [
  {
    id: 1,
    receiving_id: 1,
    product_id: 1,
    location_id: 1,
    quantity: 100,
    unit: 'pcs',
  },
  {
    id: 2,
    receiving_id: 1,
    product_id: 2,
    location_id: 1,
    quantity: 200,
    unit: 'pcs',
  },
  {
    id: 3,
    receiving_id: 2,
    product_id: 3,
    location_id: 3,
    quantity: 50,
    unit: 'pcs',
  },
  {
    id: 4,
    receiving_id: 3,
    product_id: 4,
    location_id: 4,
    quantity: 20,
    unit: 'pcs',
  },
];

// ============================================================================
// OPERATIONS - RETURNS
// ============================================================================

export const mockReturns: Return[] = [
  {
    id: 1,
    return_no: 'RET-2025-001',
    return_type: 'customer',
    warehouse_id: 1,
    processed_by: 2,
    return_date: randomDate(10),
    remarks: 'Defective unit',
    created_at: randomDate(10),
  },
  {
    id: 2,
    return_no: 'RET-2025-002',
    return_type: 'internal',
    warehouse_id: 1,
    processed_by: 3,
    return_date: randomDate(5),
    remarks: 'Inventory adjustment',
    created_at: randomDate(5),
  },
];

export const mockReturnItems: ReturnItem[] = [
  {
    id: 1,
    return_id: 1,
    product_id: 1,
    location_id: 1,
    quantity: 5,
    condition: 'defective',
  },
  {
    id: 2,
    return_id: 2,
    product_id: 2,
    location_id: 2,
    quantity: 10,
    condition: 'damaged',
  },
];

// ============================================================================
// OPERATIONS - SHIPPING
// ============================================================================

export const mockShipments: Shipment[] = [
  {
    id: 1,
    shipment_no: 'SHIP-2025-001',
    order_id: 1,
    warehouse_id: 1,
    destination: '100 Main St, Customer City',
    courier: 'FastShip Express',
    shipped_by: 2,
    shipped_date: randomDate(5),
    status: 'delivered',
    created_at: randomDate(10),
  },
  {
    id: 2,
    shipment_no: 'SHIP-2025-002',
    order_id: 2,
    warehouse_id: 1,
    destination: '200 Oak Ave, Buyer Town',
    courier: 'QuickDeliver',
    shipped_by: 3,
    shipped_date: randomDate(3),
    status: 'in_transit',
    created_at: randomDate(5),
  },
  {
    id: 3,
    shipment_no: 'SHIP-2025-003',
    order_id: 3,
    warehouse_id: 2,
    destination: '300 Pine Rd, Recipient Village',
    courier: 'ReliableShip',
    shipped_by: 4,
    shipped_date: randomDate(1),
    status: 'pending',
    created_at: randomDate(2),
  },
];

export const mockShipmentItems: ShipmentItem[] = [
  {
    id: 1,
    shipment_id: 1,
    product_id: 1,
    quantity: 50,
    unit: 'pcs',
  },
  {
    id: 2,
    shipment_id: 1,
    product_id: 2,
    quantity: 100,
    unit: 'pcs',
  },
  {
    id: 3,
    shipment_id: 2,
    product_id: 3,
    quantity: 25,
    unit: 'pcs',
  },
  {
    id: 4,
    shipment_id: 3,
    product_id: 4,
    quantity: 10,
    unit: 'pcs',
  },
];

// ============================================================================
// INVENTORY TRANSACTIONS
// ============================================================================

export const mockStockIns: StockIn[] = [
  {
    id: 1,
    reference_no: 'STK-IN-001',
    warehouse_id: 1,
    performed_by: 2,
    date: randomDate(10),
    remarks: 'Transfer from secondary warehouse',
  },
  {
    id: 2,
    reference_no: 'STK-IN-002',
    warehouse_id: 2,
    performed_by: 4,
    date: randomDate(5),
    remarks: 'New stock received',
  },
];

export const mockStockOuts: StockOut[] = [
  {
    id: 1,
    reference_no: 'STK-OUT-001',
    warehouse_id: 1,
    performed_by: 3,
    date: randomDate(8),
    reason: 'Customer order fulfillment',
  },
  {
    id: 2,
    reference_no: 'STK-OUT-002',
    warehouse_id: 1,
    performed_by: 2,
    date: randomDate(3),
    reason: 'Transfer to regional hub',
  },
];

export const mockAdjustments: Adjustment[] = [
  {
    id: 1,
    product_id: 1,
    warehouse_id: 1,
    location_id: 1,
    previous_qty: 150,
    adjusted_qty: 145,
    adjustment_type: 'decrease',
    reason: 'Damaged during inspection',
    adjusted_by: 2,
    created_at: randomDate(5),
  },
  {
    id: 2,
    product_id: 2,
    warehouse_id: 1,
    location_id: 1,
    previous_qty: 500,
    adjusted_qty: 520,
    adjustment_type: 'increase',
    reason: 'Recount discrepancy resolved',
    adjusted_by: 3,
    created_at: randomDate(3),
  },
];

export const mockTransfers: Transfer[] = [
  {
    id: 1,
    transfer_no: 'TRF-2025-001',
    product_id: 1,
    from_warehouse_id: 1,
    from_location_id: 1,
    to_warehouse_id: 2,
    to_location_id: 4,
    quantity: 50,
    transferred_by: 2,
    transfer_date: randomDate(7),
    remarks: 'Rebalancing stock levels',
  },
  {
    id: 2,
    transfer_no: 'TRF-2025-002',
    product_id: 3,
    from_warehouse_id: 1,
    from_location_id: 3,
    to_warehouse_id: 2,
    to_location_id: 5,
    quantity: 30,
    transferred_by: 3,
    transfer_date: randomDate(4),
    remarks: 'Seasonal redistribution',
  },
];

// ============================================================================
// STOCK MOVEMENTS
// ============================================================================

export const mockStockMovements: StockMovement[] = [
  {
    id: 1,
    product_id: 1,
    movement_type: 'in',
    reference_table: 'receivings',
    reference_id: 1,
    quantity: 100,
    to_location_id: 1,
    performed_by: 2,
    movement_date: randomDate(15),
  },
  {
    id: 2,
    product_id: 2,
    movement_type: 'in',
    reference_table: 'receivings',
    reference_id: 1,
    quantity: 200,
    to_location_id: 1,
    performed_by: 2,
    movement_date: randomDate(15),
  },
  {
    id: 3,
    product_id: 1,
    movement_type: 'out',
    reference_table: 'shipments',
    reference_id: 1,
    quantity: 50,
    from_location_id: 1,
    performed_by: 2,
    movement_date: randomDate(5),
  },
  {
    id: 4,
    product_id: 1,
    movement_type: 'transfer',
    reference_table: 'transfers',
    reference_id: 1,
    quantity: 50,
    from_location_id: 1,
    to_location_id: 4,
    performed_by: 2,
    movement_date: randomDate(7),
  },
  {
    id: 5,
    product_id: 1,
    movement_type: 'adjustment',
    reference_table: 'adjustments',
    reference_id: 1,
    quantity: 5,
    from_location_id: 1,
    performed_by: 2,
    movement_date: randomDate(5),
  },
];

// ============================================================================
// ORDERS
// ============================================================================

export const mockOrders: Order[] = [
  {
    id: 1,
    order_no: 'ORD-2025-001',
    customer_name: 'Acme Corp',
    order_type: 'sales',
    warehouse_id: 1,
    status: 'completed',
    order_date: randomDate(15),
    created_at: randomDate(15),
  },
  {
    id: 2,
    order_no: 'ORD-2025-002',
    customer_name: 'Tech Solutions LLC',
    order_type: 'sales',
    warehouse_id: 1,
    status: 'processing',
    order_date: randomDate(10),
    created_at: randomDate(10),
  },
  {
    id: 3,
    order_no: 'ORD-2025-003',
    customer_name: 'Fashion Retail Inc',
    order_type: 'sales',
    warehouse_id: 2,
    status: 'pending',
    order_date: randomDate(5),
    created_at: randomDate(5),
  },
];

export const mockOrderItems: OrderItem[] = [
  {
    id: 1,
    order_id: 1,
    product_id: 1,
    quantity: 50,
    unit: 'pcs',
  },
  {
    id: 2,
    order_id: 1,
    product_id: 2,
    quantity: 100,
    unit: 'pcs',
  },
  {
    id: 3,
    order_id: 2,
    product_id: 3,
    quantity: 25,
    unit: 'pcs',
  },
  {
    id: 4,
    order_id: 3,
    product_id: 4,
    quantity: 10,
    unit: 'pcs',
  },
];

// ============================================================================
// GENERATOR FUNCTIONS
// ============================================================================

/**
 * Get a random selection of products
 */
export const generateProducts = (count: number = 5): Product[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: randomId(),
    sku: `SKU-${String(i + 1).padStart(4, '0')}`,
    name: `Product ${i + 1}`,
    category_id: randomElement(mockCategories).id,
    unit: randomElement(['pcs', 'kg', 'liters', 'boxes']),
    barcode: String(Math.random()).substring(2, 15),
    cost_price: parseFloat((Math.random() * 100).toFixed(2)),
    selling_price: parseFloat((Math.random() * 200).toFixed(2)),
    status: 'active',
    created_at: randomDate(90),
    updated_at: randomDate(30),
  }));
};

/**
 * Get a random selection of stocks
 */
export const generateStocks = (count: number = 10): Stock[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: randomId(),
    product_id: randomElement(mockProducts).id,
    warehouse_id: randomElement(mockWarehouses).id,
    location_id: randomElement(mockLocations).id,
    quantity: randomBetween(10, 1000),
    updated_at: randomDate(7),
  }));
};

/**
 * Get a random selection of orders
 */
export const generateOrders = (count: number = 10): Order[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: randomId(),
    order_no: `ORD-${new Date().getFullYear()}-${String(i + 1).padStart(4, '0')}`,
    customer_name: `Customer ${i + 1}`,
    order_type: randomElement<Order['order_type']>(['sales', 'purchase', 'transfer']),
    warehouse_id: randomElement(mockWarehouses).id,
    status: randomElement<Order['status']>(['pending', 'processing', 'completed', 'cancelled']),
    order_date: randomDate(30),
    created_at: randomDate(30),
  }));
};
