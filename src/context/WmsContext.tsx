import { createContext, ReactNode, useContext, useState } from "react";
import { CUSTOMERS, SUPPLIERS, WAREHOUSES } from "@/constants";

// --- Interfaces ---

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
  createdBy: string;
  createdAt: string;
  approvedAt?: string;
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
}

export interface CustomerMasterRecord {
  id: string;
  code: string;
  name: string;
  company: string;
  address: string;
  type: "Retail" | "Wholesale" | "Distributor";
  status: "Active" | "Inactive";
}

export interface TransferRecord {
  id: string;
  psc: string;
  referenceNo: string;
  transferDate: string;
  neededDate: string;
  sourceWarehouse: string;
  destinationWarehouse: string;
  requestedBy: string;
  status: "Open" | "For Approval" | "For Withdrawal" | "In Transit" | "Done" | "Cancelled";
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
  isTestData?: boolean;
}

// --- Context Types ---

interface WmsContextType {
  // Data
  items: ItemMasterRecord[];
  purchaseOrders: PurchaseOrderRecord[];
  adjustments: AdjustmentRecord[];
  withdrawals: WithdrawalRecord[];
  deliveries: DeliveryRecord[];
  suppliers: SupplierRecord[];
  transfers: TransferRecord[];
  orders: OrderMonitorRecord[];
  pickers: PickerRecord[];
  barcoders: BarcoderRecord[];
  taggers: TaggerRecord[];
  checkers: CheckerRecord[];
  transferAssignments: TransferAssignmentRecord[];
  customerReturns: CustomerReturnRecord[];

  // Master Data Lists
  warehouses: WarehouseMasterRecord[];
  customers: CustomerMasterRecord[];

  // Actions
  addItem: (item: ItemMasterRecord) => void;
  updateItem: (id: string, data: Partial<ItemMasterRecord>) => void;
  deleteItem: (id: string) => void;

  addPO: (po: PurchaseOrderRecord) => void;
  updatePO: (id: string, data: Partial<PurchaseOrderRecord>) => void;
  deletePO: (id: string) => void;

  addAdjustment: (adj: AdjustmentRecord) => void;
  updateAdjustment: (id: string, data: Partial<AdjustmentRecord>) => void;
  deleteAdjustment: (id: string) => void;

  addWithdrawal: (withdrawal: WithdrawalRecord) => void;
  updateWithdrawal: (id: string, data: Partial<WithdrawalRecord>) => void;
  deleteWithdrawal: (id: string) => void;

  addDelivery: (delivery: DeliveryRecord) => void;
  updateDelivery: (id: string, data: Partial<DeliveryRecord>) => void;
  deleteDelivery: (id: string) => void;

  addSupplier: (supplier: SupplierRecord) => void;
  updateSupplier: (id: string, data: Partial<SupplierRecord>) => void;
  deleteSupplier: (id: string) => void;

  addTransfer: (transfer: TransferRecord) => void;
  updateTransfer: (id: string, data: Partial<TransferRecord>) => void;
  deleteTransfer: (id: string) => void;

  addOrder: (order: OrderMonitorRecord) => void;
  updateOrder: (id: string, data: Partial<OrderMonitorRecord>) => void;
  deleteOrder: (id: string) => void;

  updatePicker: (id: string, data: Partial<PickerRecord>) => void;
  updateBarcoder: (id: string, data: Partial<BarcoderRecord>) => void;
  updateTagger: (id: string, data: Partial<TaggerRecord>) => void;
  updateChecker: (id: string, data: Partial<CheckerRecord>) => void;
  updateTransferAssignment: (id: string, data: Partial<TransferAssignmentRecord>) => void;

  addCustomerReturn: (cr: CustomerReturnRecord) => void;
  updateCustomerReturn: (id: string, data: Partial<CustomerReturnRecord>) => void;
  deleteCustomerReturn: (id: string) => void;
}

const WmsContext = createContext<WmsContextType | undefined>(undefined);

// --- Provider ---

export const WmsProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<ItemMasterRecord[]>([
    {
      id: "1",
      psc: "PSC-1001",
      shortDescription: "Acr Paint Prim",
      longDescription: "Acrylic Paint Primary Set 12 Colors",
      invoiceDescription: "ACRYLIC PAINT PRIMARY 12S",
      picklistCode: "PK-A1",
      barcode: "480012345678",
      productType: "Finished Goods",
      igDescription: "School Supplies",
      subId: "SUB-001",
      brand: "KLIK",
      group: "Stationery",
      category: "Paint",
      subCategory: "Acrylic",
      size: "12x12ml",
      color: "Multi",
      isSaleable: true,
      cost: 150.00,
      srp: 299.75,
    }
  ]);

  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrderRecord[]>([
    {
      id: "1",
      poNumber: "PO-24001",
      orderDate: "2024-01-05",
      supplierName: "Global Tech Supplies",
      expectedDate: "2024-01-15",
      totalAmount: 12500.50,
      status: "Approved",
      priority: "High",
      createdBy: "Admin",
      createdAt: "2024-01-05 09:00",
      updatedBy: "Admin",
      updatedAt: "2024-01-05 10:30",
    }
  ]);

  const [adjustments, setAdjustments] = useState<AdjustmentRecord[]>([
    {
      id: "1",
      psc: "PSC-1001",
      referenceNo: "ADJ-001",
      adjustmentDate: "2024-01-02",
      sourceReference: "PO-8821",
      category: "For JO",
      warehouse: "POS Warehouse",
      status: "Done",
      createdBy: "Admin",
      createdAt: "2024-01-02 09:00",
      updatedBy: "Admin",
      updatedAt: "2024-01-02 10:00",
    }
  ]);

  const [withdrawals, setWithdrawals] = useState<WithdrawalRecord[]>([
    {
      id: "1",
      psc: "PSC-1001",
      referenceNo: "WTH-001",
      transferDate: "2024-01-02",
      category: "Acetone",
      warehouse: "TSD / Production",
      status: "Done",
      createdBy: "Admin",
      createdAt: "2024-01-02 08:30",
      updatedBy: "Admin",
      updatedAt: "2024-01-02 09:30",
    }
  ]);

  const [deliveries, setDeliveries] = useState<DeliveryRecord[]>([
    {
      id: "1",
      referenceNo: "DEL-8801",
      transferDate: "2024-01-02",
      supplierCode: "SUP-101",
      packingNo: "PK-99120",
      containerNo: "CONT-112",
      transferType: "International",
      status: "Done",
      warehouse: "Main Warehouse",
      createdBy: "Admin",
      createdAt: "2024-01-01 14:00",
      updatedBy: "Admin",
      updatedAt: "2024-01-02 10:00",
    }
  ]);

  const [suppliers, setSuppliers] = useState<SupplierRecord[]>(
    SUPPLIERS.map((sup, index) => ({
      id: (index + 1).toString(),
      supplierCode: sup.code,
      supplierName: sup.name,
      companyName: sup.companyName,
      supplierType: sup.type,
      company: sup.company,
      status: "Active" as const,
    }))
  );

  const [transfers, setTransfers] = useState<TransferRecord[]>([
    {
      id: "1",
      psc: "PSC-1001",
      referenceNo: "TRF-001",
      transferDate: "2024-01-04",
      neededDate: "2024-01-06",
      sourceWarehouse: "Main Warehouse",
      destinationWarehouse: "Retail Outlet",
      requestedBy: "Admin",
      status: "Done",
      updatedBy: "Admin",
      updatedAt: "2024-01-04 11:30",
    }
  ]);

  const [orders, setOrders] = useState<OrderMonitorRecord[]>([
    {
      id: "1",
      poNo: "PO-77120",
      seriesNo: "S-101",
      customerName: "SM Supermarket",
      brand: "KLIK",
      pickerStatus: "Done",
      barcoderStatus: "Done",
      taggerStatus: "Done",
      checkerStatus: "Done",
      overallStatus: "Ready",
      deliverySchedule: "2024-01-05",
      updatedAt: "2024-01-03 10:00",
    }
  ]);

  const [pickers, setPickers] = useState<PickerRecord[]>([
    {
      id: "1",
      seriesNo: "P-1001",
      poNo: "PO-9921",
      deliveryReference: "DEL-8801",
      poBrand: "KLIK",
      customerName: "SM Supermarket",
      routeCode: "RT-01",
      dateApproved: "2024-01-03",
      approvedTime: "08:30:00",
      deliverySchedule: "2024-01-05",
      priorityLevel: "High" as "High", // <-- explicitly cast
      transferType: "Standard",
      receivedBy: "John Picker",
      assignedStaff: "", // No staff assigned
      status: "No Assignment" as "No Assignment", // <-- explicitly cast
      totalQty: 1500,
      countedQty: 0,
      whReceiveDate: "2024-01-03",
      approvedBy: "Admin",
      plRemarks: "Handle with care",
      stockSource: "Supplier Delivery",
      sourceReference: "DEL-8801",
    },
    {
      id: "2",
      seriesNo: "P-1002",
      poNo: "PO-9922",
      deliveryReference: "DEL-8802",
      poBrand: "OMG",
      customerName: "Robinsons Retail",
      routeCode: "RT-02",
      dateApproved: "2024-01-03",
      approvedTime: "09:00:00",
      deliverySchedule: "2024-01-06",
      priorityLevel: "Medium",
      transferType: "Standard",
      receivedBy: "Jane Picker",
      assignedStaff: "Alice Williams",
      status: "Assigned",
      totalQty: 800,
      countedQty: 0,
      whReceiveDate: "2024-01-03",
      approvedBy: "Admin",
      plRemarks: "Standard handling",
      stockSource: "Internal Transfer",
      sourceReference: "TRF-001",
    },
    {
      id: "3",
      seriesNo: "P-1003",
      poNo: "PO-9923",
      deliveryReference: "DEL-8803",
      poBrand: "BW",
      customerName: "Puregold Price Club",
      routeCode: "RT-03",
      dateApproved: "2024-01-03",
      approvedTime: "10:15:00",
      deliverySchedule: "2024-01-07",
      priorityLevel: "Low",
      transferType: "Standard",
      receivedBy: "Bob Picker",
      assignedStaff: "",
      status: "No Assignment",
      totalQty: 1200,
      countedQty: 0,
      whReceiveDate: "2024-01-03",
      approvedBy: "Admin",
      plRemarks: "Bulk order",
      stockSource: "Adjustment",
      sourceReference: "ADJ-001",
    }
  ]);



  const [barcoders, setBarcoders] = useState<BarcoderRecord[]>([
    {
      id: "1",
      seriesNo: "B-2001",
      poNo: "PO-7712",
      deliveryReference: "DEL-8802",
      poBrand: "OMG",
      customerName: "Robinsons Retail",
      routeCode: "RT-05",
      barcoderName: "Jane Barcoder",
      deliverySchedule: "2024-01-06",
      dateApproved: "2024-01-03",
      approvedTime: "09:45:00",
      priorityLevel: "Medium",
      transferType: "Urgent",
      approvedBy: "Manager",
      receivedBy: "John Doe",
      status: "Pending",
      assignedStaff: "",
      stockSource: "Supplier Delivery",
      sourceReference: "DEL-8802",
      totalQty: 600,
      countedQty: 0,
    },
    {
      id: "2",
      seriesNo: "B-2002",
      poNo: "PO-7713",
      deliveryReference: "DEL-8804",
      poBrand: "KLIK",
      customerName: "SM Supermarket",
      routeCode: "RT-01",
      barcoderName: "Bob Barcoder",
      deliverySchedule: "2024-01-05",
      dateApproved: "2024-01-03",
      approvedTime: "10:30:00",
      priorityLevel: "High",
      transferType: "Standard",
      approvedBy: "Admin",
      receivedBy: "Jane Smith",
      status: "Pending",
      assignedStaff: "Michael Brown",
      stockSource: "Internal Transfer",
      sourceReference: "TRF-002",
      totalQty: 450,
      countedQty: 0,
    }
  ]);

  const [taggers, setTaggers] = useState<TaggerRecord[]>([
    {
      id: "1",
      seriesNo: "T-3001",
      poNo: "PO-6621",
      deliveryReference: "DEL-8803",
      poBrand: "ORO",
      customerName: "SM Supermarket",
      routeCode: "RT-02",
      priorityLevel: "High",
      deliverySchedule: "2024-01-05",
      dateApproved: "2024-01-03",
      status: "Pending",
      approvedBy: "Admin",
      assignedStaff: "",
      stockSource: "Supplier Delivery",
      sourceReference: "DEL-8803",
      totalQty: 300,
      countedQty: 0,
    },
    {
      id: "2",
      seriesNo: "T-3002",
      poNo: "PO-6622",
      deliveryReference: "DEL-8805",
      poBrand: "BW",
      customerName: "Robinsons Galleria",
      routeCode: "RT-03",
      priorityLevel: "Medium",
      deliverySchedule: "2024-01-06",
      dateApproved: "2024-01-03",
      status: "Pending",
      approvedBy: "Manager",
      assignedStaff: "Alice Williams",
      stockSource: "Customer Return",
      sourceReference: "CR-1001",
      totalQty: 150,
      countedQty: 0,
    }
  ]);

  const [checkers, setCheckers] = useState<CheckerRecord[]>([
    {
      id: "1",
      seriesNo: "SER-CHK-001",
      poNo: "PO-77120",
      deliveryReference: "DEL-8801",
      customerName: "SM Supermarket",
      status: "Pending",
      assignedStaff: "",
      stockSource: "Supplier Delivery",
      sourceReference: "DEL-8801",
      totalQty: 1500,
      countedQty: 0,
    },
    {
      id: "2",
      seriesNo: "SER-CHK-002",
      poNo: "PO-77121",
      deliveryReference: "DEL-8802",
      customerName: "Robinsons Retail",
      status: "Pending",
      assignedStaff: "Robert Garcia",
      stockSource: "Internal Transfer",
      sourceReference: "TRF-001",
      totalQty: 800,
      countedQty: 0,
    },
    {
      id: "3",
      seriesNo: "SER-CHK-003",
      poNo: "PO-77122",
      deliveryReference: "DEL-8803",
      customerName: "Puregold Price Club",
      status: "Pending",
      assignedStaff: "",
      stockSource: "Adjustment",
      sourceReference: "ADJ-001",
      totalQty: 1200,
      countedQty: 0,
    }
  ]);

  const [transferAssignments, setTransferAssignments] = useState<TransferAssignmentRecord[]>([
    {
      id: "1",
      transferId: "TRF-ASSIGN-001",
      fromWarehouse: "Main Warehouse",
      toWarehouse: "Regional Hub",
      driverName: "Robert Garcia",
      status: "Assigned",
    }
  ]);

  const [warehouses] = useState<WarehouseMasterRecord[]>(
    WAREHOUSES.map((wh, index) => ({
      id: (index + 1).toString(),
      code: wh.code,
      name: wh.name,
      type: wh.type,
      location: wh.location,
      status: "Active" as const
    }))
  );

  const [customers] = useState<CustomerMasterRecord[]>(
    CUSTOMERS.map((cust, index) => ({
      id: (index + 1).toString(),
      code: cust.code,
      name: cust.name,
      company: cust.company,
      address: cust.address,
      type: cust.type,
      status: "Active" as const
    }))
  );

  const [customerReturns, setCustomerReturns] = useState<CustomerReturnRecord[]>([
    {
      id: "1",
      psc: "PSC-1001",
      referenceNo: "CR-1001",
      customerCode: "CUST-001",
      customerName: "SM Megamall",
      company: "SM Prime Holdings",
      warehouse: "Main Warehouse",
      status: "Open",
      amountTotal: 5000.00,
      reason: ["DAMAGED"],
      createdBy: "Admin",
      createdAt: "2024-01-05 10:00",
    }
  ]);

  // --- Actions Implementation ---

  const addItem = (item: ItemMasterRecord) => setItems(p => [item, ...p]);
  const updateItem = (id: string, data: Partial<ItemMasterRecord>) => setItems(p => p.map(i => i.id === id ? { ...i, ...data } : i));
  const deleteItem = (id: string) => setItems(p => p.filter(i => i.id !== id));

  const addPO = (po: PurchaseOrderRecord) => setPurchaseOrders(p => [po, ...p]);
  const updatePO = (id: string, data: Partial<PurchaseOrderRecord>) => setPurchaseOrders(p => p.map(i => i.id === id ? { ...i, ...data } : i));
  const deletePO = (id: string) => setPurchaseOrders(p => p.filter(i => i.id !== id));

  const addAdjustment = (adj: AdjustmentRecord) => setAdjustments(p => [adj, ...p]);
  const updateAdjustment = (id: string, data: Partial<AdjustmentRecord>) => setAdjustments(p => p.map(i => i.id === id ? { ...i, ...data } : i));
  const deleteAdjustment = (id: string) => setAdjustments(p => p.filter(i => i.id !== id));

  const addWithdrawal = (w: WithdrawalRecord) => setWithdrawals(p => [w, ...p]);
  const updateWithdrawal = (id: string, data: Partial<WithdrawalRecord>) => setWithdrawals(p => p.map(i => i.id === id ? { ...i, ...data } : i));
  const deleteWithdrawal = (id: string) => setWithdrawals(p => p.filter(i => i.id !== id));

  // Actions for Customer Returns
  const addCustomerReturn = (cr: CustomerReturnRecord) => setCustomerReturns(p => [cr, ...p]);
  const updateCustomerReturn = (id: string, data: Partial<CustomerReturnRecord>) => setCustomerReturns(p => p.map(i => i.id === id ? { ...i, ...data } : i));
  const deleteCustomerReturn = (id: string) => setCustomerReturns(p => p.filter(i => i.id !== id));

  const addDelivery = (d: DeliveryRecord) => setDeliveries(p => [d, ...p]);
  const updateDelivery = (id: string, data: Partial<DeliveryRecord>) => setDeliveries(p => p.map(i => i.id === id ? { ...i, ...data } : i));
  const deleteDelivery = (id: string) => setDeliveries(p => p.filter(i => i.id !== id));

  const addSupplier = (s: SupplierRecord) => setSuppliers(p => [s, ...p]);
  const updateSupplier = (id: string, data: Partial<SupplierRecord>) => setSuppliers(p => p.map(i => i.id === id ? { ...i, ...data } : i));
  const deleteSupplier = (id: string) => setSuppliers(p => p.filter(i => i.id !== id));

  const addTransfer = (t: TransferRecord) => setTransfers(p => [t, ...p]);
  const updateTransfer = (id: string, data: Partial<TransferRecord>) => setTransfers(p => p.map(i => i.id === id ? { ...i, ...data } : i));
  const deleteTransfer = (id: string) => setTransfers(p => p.filter(i => i.id !== id));

  const addOrder = (o: OrderMonitorRecord) => setOrders(p => [o, ...p]);
  const updateOrder = (id: string, data: Partial<OrderMonitorRecord>) => setOrders(p => p.map(i => i.id === id ? { ...i, ...data } : i));
  const deleteOrder = (id: string) => setOrders(p => p.filter(i => i.id !== id));

  const updatePicker = (id: string, data: Partial<PickerRecord>) => setPickers(p => p.map(i => i.id === id ? { ...i, ...data } : i));
  const updateBarcoder = (id: string, data: Partial<BarcoderRecord>) => setBarcoders(p => p.map(i => i.id === id ? { ...i, ...data } : i));
  const updateTagger = (id: string, data: Partial<TaggerRecord>) => setTaggers(p => p.map(i => i.id === id ? { ...i, ...data } : i));
  const updateChecker = (id: string, data: Partial<CheckerRecord>) => setCheckers(p => p.map(i => i.id === id ? { ...i, ...data } : i));
  const updateTransferAssignment = (id: string, data: Partial<TransferAssignmentRecord>) => setTransferAssignments(p => p.map(i => i.id === id ? { ...i, ...data } : i));

  return (
    <WmsContext.Provider value={{
      items, purchaseOrders, adjustments, withdrawals, deliveries, suppliers, transfers, orders,
      pickers, barcoders, taggers, checkers, transferAssignments, customerReturns,
      warehouses, customers,
      addItem, updateItem, deleteItem,
      addPO, updatePO, deletePO,
      addAdjustment, updateAdjustment, deleteAdjustment,
      addWithdrawal, updateWithdrawal, deleteWithdrawal,
      // Customer Return actions
      addCustomerReturn, updateCustomerReturn, deleteCustomerReturn,
      addDelivery, updateDelivery, deleteDelivery,
      addSupplier, updateSupplier, deleteSupplier,
      addTransfer, updateTransfer, deleteTransfer,
      addOrder, updateOrder, deleteOrder,
      updatePicker, updateBarcoder, updateTagger, updateChecker, updateTransferAssignment
    }}>
      {children}
    </WmsContext.Provider>
  );
};

export const useWms = () => {
  const context = useContext(WmsContext);
  if (context === undefined) {
    throw new Error("useWms must be used within a WmsProvider");
  }
  return context;
};
