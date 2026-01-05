import { auditTrail } from "@/lib/AuditTrail";
import { autoComputation } from "@/lib/AutoComputation";
import { globalEventEmitter, WMSEvents } from "@/lib/EventEmitter";
import { stockLedger } from "@/lib/StockLedger";
import { handleValidationError, validationService } from "@/lib/Validation";
import { useAuth } from "@/providers/AuthProvider";
import {
    AdjustmentRecord,
    BarcoderRecord,
    CheckerRecord,
    CustomerMasterRecord,
    CustomerReturnRecord,
    DeliveryRecord,
    ItemMasterRecord,
    OrderMonitorRecord,
    PickerRecord,
    PurchaseOrderRecord,
    STORAGE_KEYS,
    SupplierRecord,
    TaggerRecord,
    TransferAssignmentRecord,
    TransferRecord,
    WarehouseMasterRecord,
    WithdrawalRecord
} from "@/types";
import { ReactNode, useEffect, useReducer } from "react";
import { WmsContext } from "./WmsContextType";

// ============================================================================
// STATE MANAGEMENT WITH useReducer
// ============================================================================

// State structure
interface WmsState {
  items: ItemMasterRecord[];
  purchaseOrders: PurchaseOrderRecord[];
  adjustments: AdjustmentRecord[];
  withdrawals: WithdrawalRecord[];
  customerReturns: CustomerReturnRecord[];
  deliveries: DeliveryRecord[];
  suppliers: SupplierRecord[];
  transfers: TransferRecord[];
  orders: OrderMonitorRecord[];
  pickers: PickerRecord[];
  barcoders: BarcoderRecord[];
  taggers: TaggerRecord[];
  checkers: CheckerRecord[];
  transferAssignments: TransferAssignmentRecord[];
  warehouses: WarehouseMasterRecord[];
  customers: CustomerMasterRecord[];
}

// Action types
type WmsAction =
  // Items
  | { type: 'SET_ITEMS'; payload: ItemMasterRecord[] }
  | { type: 'ADD_ITEM'; payload: ItemMasterRecord }
  | { type: 'UPDATE_ITEM'; payload: { id: string; data: Partial<ItemMasterRecord> } }
  | { type: 'DELETE_ITEM'; payload: string }

  // Purchase Orders
  | { type: 'SET_PURCHASE_ORDERS'; payload: PurchaseOrderRecord[] }
  | { type: 'ADD_PURCHASE_ORDER'; payload: PurchaseOrderRecord }
  | { type: 'UPDATE_PURCHASE_ORDER'; payload: { id: string; data: Partial<PurchaseOrderRecord> } }
  | { type: 'DELETE_PURCHASE_ORDER'; payload: string }

  // Adjustments
  | { type: 'SET_ADJUSTMENTS'; payload: AdjustmentRecord[] }
  | { type: 'ADD_ADJUSTMENT'; payload: AdjustmentRecord }
  | { type: 'UPDATE_ADJUSTMENT'; payload: { id: string; data: Partial<AdjustmentRecord> } }
  | { type: 'DELETE_ADJUSTMENT'; payload: string }

  // Withdrawals
  | { type: 'SET_WITHDRAWALS'; payload: WithdrawalRecord[] }
  | { type: 'ADD_WITHDRAWAL'; payload: WithdrawalRecord }
  | { type: 'UPDATE_WITHDRAWAL'; payload: { id: string; data: Partial<WithdrawalRecord> } }
  | { type: 'DELETE_WITHDRAWAL'; payload: string }

  // Customer Returns
  | { type: 'SET_CUSTOMER_RETURNS'; payload: CustomerReturnRecord[] }
  | { type: 'ADD_CUSTOMER_RETURN'; payload: CustomerReturnRecord }
  | { type: 'UPDATE_CUSTOMER_RETURN'; payload: { id: string; data: Partial<CustomerReturnRecord> } }
  | { type: 'DELETE_CUSTOMER_RETURN'; payload: string }

  // Deliveries
  | { type: 'SET_DELIVERIES'; payload: DeliveryRecord[] }
  | { type: 'ADD_DELIVERY'; payload: DeliveryRecord }
  | { type: 'UPDATE_DELIVERY'; payload: { id: string; data: Partial<DeliveryRecord> } }
  | { type: 'DELETE_DELIVERY'; payload: string }

  // Suppliers
  | { type: 'SET_SUPPLIERS'; payload: SupplierRecord[] }
  | { type: 'ADD_SUPPLIER'; payload: SupplierRecord }
  | { type: 'UPDATE_SUPPLIER'; payload: { id: string; data: Partial<SupplierRecord> } }
  | { type: 'DELETE_SUPPLIER'; payload: string }

  // Transfers
  | { type: 'SET_TRANSFERS'; payload: TransferRecord[] }
  | { type: 'ADD_TRANSFER'; payload: TransferRecord }
  | { type: 'UPDATE_TRANSFER'; payload: { id: string; data: Partial<TransferRecord> } }
  | { type: 'DELETE_TRANSFER'; payload: string }

  // Orders
  | { type: 'SET_ORDERS'; payload: OrderMonitorRecord[] }
  | { type: 'ADD_ORDER'; payload: OrderMonitorRecord }
  | { type: 'UPDATE_ORDER'; payload: { id: string; data: Partial<OrderMonitorRecord> } }
  | { type: 'DELETE_ORDER'; payload: string }

  // Assignments
  | { type: 'SET_PICKERS'; payload: PickerRecord[] }
  | { type: 'ADD_PICKER'; payload: PickerRecord }
  | { type: 'UPDATE_PICKER'; payload: { id: string; data: Partial<PickerRecord> } }

  | { type: 'SET_BARCODERS'; payload: BarcoderRecord[] }
  | { type: 'ADD_BARCODER'; payload: BarcoderRecord }
  | { type: 'UPDATE_BARCODER'; payload: { id: string; data: Partial<BarcoderRecord> } }

  | { type: 'SET_TAGGERS'; payload: TaggerRecord[] }
  | { type: 'ADD_TAGGER'; payload: TaggerRecord }
  | { type: 'UPDATE_TAGGER'; payload: { id: string; data: Partial<TaggerRecord> } }

  | { type: 'SET_CHECKERS'; payload: CheckerRecord[] }
  | { type: 'ADD_CHECKER'; payload: CheckerRecord }
  | { type: 'UPDATE_CHECKER'; payload: { id: string; data: Partial<CheckerRecord> } }

  | { type: 'SET_TRANSFER_ASSIGNMENTS'; payload: TransferAssignmentRecord[] }
  | { type: 'ADD_TRANSFER_ASSIGNMENT'; payload: TransferAssignmentRecord }
  | { type: 'UPDATE_TRANSFER_ASSIGNMENT'; payload: { id: string; data: Partial<TransferAssignmentRecord> } }

  // Warehouses & Customers
  | { type: 'SET_WAREHOUSES'; payload: WarehouseMasterRecord[] }
  | { type: 'ADD_WAREHOUSE'; payload: WarehouseMasterRecord }
  | { type: 'UPDATE_WAREHOUSE'; payload: { id: string; data: Partial<WarehouseMasterRecord> } }
  | { type: 'DELETE_WAREHOUSE'; payload: string }

  | { type: 'SET_CUSTOMERS'; payload: CustomerMasterRecord[] }
  | { type: 'ADD_CUSTOMER'; payload: CustomerMasterRecord }
  | { type: 'UPDATE_CUSTOMER'; payload: { id: string; data: Partial<CustomerMasterRecord> } }
  | { type: 'DELETE_CUSTOMER'; payload: string };

// Reducer function
function wmsReducer(state: WmsState, action: WmsAction): WmsState {
  switch (action.type) {
    // Items
    case 'SET_ITEMS':
      return { ...state, items: action.payload };
    case 'ADD_ITEM':
      return { ...state, items: [action.payload, ...state.items] };
    case 'UPDATE_ITEM':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id ? { ...item, ...action.payload.data } : item
        )
      };
    case 'DELETE_ITEM':
      return { ...state, items: state.items.filter(item => item.id !== action.payload) };

    // Purchase Orders
    case 'SET_PURCHASE_ORDERS':
      return { ...state, purchaseOrders: action.payload };
    case 'ADD_PURCHASE_ORDER':
      return { ...state, purchaseOrders: [action.payload, ...state.purchaseOrders] };
    case 'UPDATE_PURCHASE_ORDER':
      return {
        ...state,
        purchaseOrders: state.purchaseOrders.map(po =>
          po.id === action.payload.id ? { ...po, ...action.payload.data } : po
        )
      };
    case 'DELETE_PURCHASE_ORDER':
      return { ...state, purchaseOrders: state.purchaseOrders.filter(po => po.id !== action.payload) };

    // Adjustments
    case 'SET_ADJUSTMENTS':
      return { ...state, adjustments: action.payload };
    case 'ADD_ADJUSTMENT':
      return { ...state, adjustments: [action.payload, ...state.adjustments] };
    case 'UPDATE_ADJUSTMENT':
      return {
        ...state,
        adjustments: state.adjustments.map(adj =>
          adj.id === action.payload.id ? { ...adj, ...action.payload.data } : adj
        )
      };
    case 'DELETE_ADJUSTMENT':
      return { ...state, adjustments: state.adjustments.filter(adj => adj.id !== action.payload) };

    // Withdrawals
    case 'SET_WITHDRAWALS':
      return { ...state, withdrawals: action.payload };
    case 'ADD_WITHDRAWAL':
      return { ...state, withdrawals: [action.payload, ...state.withdrawals] };
    case 'UPDATE_WITHDRAWAL':
      return {
        ...state,
        withdrawals: state.withdrawals.map(w =>
          w.id === action.payload.id ? { ...w, ...action.payload.data } : w
        )
      };
    case 'DELETE_WITHDRAWAL':
      return { ...state, withdrawals: state.withdrawals.filter(w => w.id !== action.payload) };

    // Customer Returns
    case 'SET_CUSTOMER_RETURNS':
      return { ...state, customerReturns: action.payload };
    case 'ADD_CUSTOMER_RETURN':
      return { ...state, customerReturns: [action.payload, ...state.customerReturns] };
    case 'UPDATE_CUSTOMER_RETURN':
      return {
        ...state,
        customerReturns: state.customerReturns.map(cr =>
          cr.id === action.payload.id ? { ...cr, ...action.payload.data } : cr
        )
      };
    case 'DELETE_CUSTOMER_RETURN':
      return { ...state, customerReturns: state.customerReturns.filter(cr => cr.id !== action.payload) };

    // Deliveries
    case 'SET_DELIVERIES':
      return { ...state, deliveries: action.payload };
    case 'ADD_DELIVERY':
      return { ...state, deliveries: [action.payload, ...state.deliveries] };
    case 'UPDATE_DELIVERY':
      return {
        ...state,
        deliveries: state.deliveries.map(d =>
          d.id === action.payload.id ? { ...d, ...action.payload.data } : d
        )
      };
    case 'DELETE_DELIVERY':
      return { ...state, deliveries: state.deliveries.filter(d => d.id !== action.payload) };

    // Suppliers
    case 'SET_SUPPLIERS':
      return { ...state, suppliers: action.payload };
    case 'ADD_SUPPLIER':
      return { ...state, suppliers: [action.payload, ...state.suppliers] };
    case 'UPDATE_SUPPLIER':
      return {
        ...state,
        suppliers: state.suppliers.map(s =>
          s.id === action.payload.id ? { ...s, ...action.payload.data } : s
        )
      };
    case 'DELETE_SUPPLIER':
      return { ...state, suppliers: state.suppliers.filter(s => s.id !== action.payload) };

    // Transfers
    case 'SET_TRANSFERS':
      return { ...state, transfers: action.payload };
    case 'ADD_TRANSFER':
      return { ...state, transfers: [action.payload, ...state.transfers] };
    case 'UPDATE_TRANSFER':
      return {
        ...state,
        transfers: state.transfers.map(t =>
          t.id === action.payload.id ? { ...t, ...action.payload.data } : t
        )
      };
    case 'DELETE_TRANSFER':
      return { ...state, transfers: state.transfers.filter(t => t.id !== action.payload) };

    // Orders
    case 'SET_ORDERS':
      return { ...state, orders: action.payload };
    case 'ADD_ORDER':
      return { ...state, orders: [action.payload, ...state.orders] };
    case 'UPDATE_ORDER':
      return {
        ...state,
        orders: state.orders.map(o =>
          o.id === action.payload.id ? { ...o, ...action.payload.data } : o
        )
      };
    case 'DELETE_ORDER':
      return { ...state, orders: state.orders.filter(o => o.id !== action.payload) };

    // Assignments
    case 'SET_PICKERS':
      return { ...state, pickers: action.payload };
    case 'ADD_PICKER':
      return { ...state, pickers: [action.payload, ...state.pickers] };
    case 'UPDATE_PICKER':
      return {
        ...state,
        pickers: state.pickers.map(p =>
          p.id === action.payload.id ? { ...p, ...action.payload.data } : p
        )
      };

    case 'SET_BARCODERS':
      return { ...state, barcoders: action.payload };
    case 'ADD_BARCODER':
      return { ...state, barcoders: [action.payload, ...state.barcoders] };
    case 'UPDATE_BARCODER':
      return {
        ...state,
        barcoders: state.barcoders.map(b =>
          b.id === action.payload.id ? { ...b, ...action.payload.data } : b
        )
      };

    case 'SET_TAGGERS':
      return { ...state, taggers: action.payload };
    case 'ADD_TAGGER':
      return { ...state, taggers: [action.payload, ...state.taggers] };
    case 'UPDATE_TAGGER':
      return {
        ...state,
        taggers: state.taggers.map(t =>
          t.id === action.payload.id ? { ...t, ...action.payload.data } : t
        )
      };

    case 'SET_CHECKERS':
      return { ...state, checkers: action.payload };
    case 'ADD_CHECKER':
      return { ...state, checkers: [action.payload, ...state.checkers] };
    case 'UPDATE_CHECKER':
      return {
        ...state,
        checkers: state.checkers.map(c =>
          c.id === action.payload.id ? { ...c, ...action.payload.data } : c
        )
      };

    case 'SET_TRANSFER_ASSIGNMENTS':
      return { ...state, transferAssignments: action.payload };
    case 'ADD_TRANSFER_ASSIGNMENT':
      return { ...state, transferAssignments: [action.payload, ...state.transferAssignments] };
    case 'UPDATE_TRANSFER_ASSIGNMENT':
      return {
        ...state,
        transferAssignments: state.transferAssignments.map(ta =>
          ta.id === action.payload.id ? { ...ta, ...action.payload.data } : ta
        )
      };

    // Warehouses
    case 'SET_WAREHOUSES':
      return { ...state, warehouses: action.payload };
    case 'ADD_WAREHOUSE':
      return { ...state, warehouses: [action.payload, ...state.warehouses] };
    case 'UPDATE_WAREHOUSE':
      return {
        ...state,
        warehouses: state.warehouses.map(w =>
          w.id === action.payload.id ? { ...w, ...action.payload.data } : w
        )
      };
    case 'DELETE_WAREHOUSE':
      return { ...state, warehouses: state.warehouses.filter(w => w.id !== action.payload) };

    // Customers
    case 'SET_CUSTOMERS':
      return { ...state, customers: action.payload };
    case 'ADD_CUSTOMER':
      return { ...state, customers: [action.payload, ...state.customers] };
    case 'UPDATE_CUSTOMER':
      return {
        ...state,
        customers: state.customers.map(c =>
          c.id === action.payload.id ? { ...c, ...action.payload.data } : c
        )
      };
    case 'DELETE_CUSTOMER':
      return { ...state, customers: state.customers.filter(c => c.id !== action.payload) };

    default:
      return state;
  }
}

// Initial state with audit fields
const getInitialState = (): WmsState => ({
  items: loadFromStorage(STORAGE_KEYS.ITEMS, [
    {
      id: "1",
      psc: "PSC-1001",
      shortDescription: "Acrylic Paint Set",
      longDescription: "Professional Acrylic Paint Set - 12 Colors, 12ml each",
      invoiceDescription: "ACRYLIC PAINT SET 12S",
      picklistCode: "PK-A1",
      barcode: "480012345678",
      productType: "Finished Goods",
      igDescription: "Art Supplies",
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
      createdBy: 'system',
      createdAt: new Date().toISOString(),
      updatedBy: 'system',
      updatedAt: new Date().toISOString(),
    },
    {
      id: "2",
      psc: "PSC-1002",
      shortDescription: "Wireless Mouse",
      longDescription: "Optical Wireless Mouse with USB Receiver",
      invoiceDescription: "WIRELESS MOUSE USB",
      picklistCode: "PK-B2",
      barcode: "480012345679",
      productType: "Finished Goods",
      igDescription: "Computer Accessories",
      subId: "SUB-002",
      brand: "BW",
      group: "Electronics",
      category: "Hardware",
      subCategory: "Computer Accessories",
      size: "Standard",
      color: "Black",
      isSaleable: true,
      cost: 45.00,
      srp: 89.99,
      createdBy: 'system',
      createdAt: new Date().toISOString(),
      updatedBy: 'system',
      updatedAt: new Date().toISOString(),
    },
    {
      id: "3",
      psc: "PSC-1003",
      shortDescription: "A4 Paper Ream",
      longDescription: "Premium A4 Copy Paper - 500 sheets per ream",
      invoiceDescription: "A4 PAPER 500S",
      picklistCode: "PK-C3",
      barcode: "480012345680",
      productType: "Finished Goods",
      igDescription: "Office Supplies",
      subId: "SUB-003",
      brand: "OMG",
      group: "Stationery",
      category: "Paper",
      subCategory: "Copy Paper",
      size: "A4",
      color: "White",
      isSaleable: true,
      cost: 120.00,
      srp: 199.99,
      createdBy: 'system',
      createdAt: new Date().toISOString(),
      updatedBy: 'system',
      updatedAt: new Date().toISOString(),
    }
  ]),
  purchaseOrders: loadFromStorage(STORAGE_KEYS.PURCHASE_ORDERS, [
    {
      id: "1",
      poNumber: "PO-24001",
      orderDate: "2024-01-05",
      supplierName: "TechPro Solutions",
      itemCode: "ITEM-001",
      quantity: 100,
      unitPrice: 125.00,
      totalAmount: 12500.50,
      status: "Approved",
      priority: "High",
      expectedDate: "2024-01-15",
      createdBy: 'system',
      createdAt: "2024-01-05T09:00:00.000Z",
      updatedBy: 'system',
      updatedAt: "2024-01-05T10:30:00.000Z",
      approvedBy: 'system',
      approvedAt: "2024-01-05T10:30:00.000Z"
    },
    {
      id: "2",
      poNumber: "PO-24002",
      orderDate: "2024-01-08",
      supplierName: "Global Supplies Ltd",
      itemCode: "ITEM-002",
      quantity: 50,
      unitPrice: 45.00,
      expectedDate: "2024-01-18",
      totalAmount: 2250.00,
      status: "Approved",
      priority: "Medium",
      createdBy: 'system',
      createdAt: "2024-01-08T14:00:00.000Z",
      updatedBy: 'system',
      updatedAt: "2024-01-08T14:00:00.000Z",
      approvedBy: 'system',
      approvedAt: "2024-01-08T14:00:00.000Z"
    },
    {
      id: "3",
      poNumber: "PO-24003",
      orderDate: "2024-01-10",
      supplierName: "Local Distributors Inc",
      itemCode: "ITEM-003",
      quantity: 200,
      unitPrice: 120.00,
      expectedDate: "2024-01-20",
      totalAmount: 24000.00,
      status: "Pending",
      priority: "Low",
      createdBy: 'system',
      createdAt: "2024-01-10T11:00:00.000Z",
      updatedBy: 'system',
      updatedAt: "2024-01-10T11:00:00.000Z"
    }
  ]),
  adjustments: loadFromStorage(STORAGE_KEYS.ADJUSTMENTS, []),
  withdrawals: loadFromStorage(STORAGE_KEYS.WITHDRAWALS, []),
  customerReturns: loadFromStorage(STORAGE_KEYS.CUSTOMER_RETURNS, [
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
      createdBy: 'system',
      createdAt: new Date().toISOString(),
      updatedBy: 'system',
      updatedAt: new Date().toISOString(),
    },
    {
      id: "2",
      psc: "PSC-1002",
      referenceNo: "CR-1002",
      customerCode: "CUST-002",
      customerName: "Robinsons Galleria",
      company: "Robinsons Land",
      warehouse: "Retail Outlet",
      status: "For Segregation",
      amountTotal: 1250.00,
      reason: ["EXPIRED", "BAD ORDER"],
      createdBy: 'system',
      createdAt: new Date().toISOString(),
      updatedBy: 'system',
      updatedAt: new Date().toISOString(),
    }
  ]),
  deliveries: loadFromStorage(STORAGE_KEYS.DELIVERIES, [
    {
      id: "1",
      referenceNo: "DEL-8801",
      poNumber: "PO-24001",
      transferDate: "2024-01-12",
      supplierCode: "SUP-001",
      itemCode: "PSC-1001",
      quantity: 100,
      packingNo: "PK-99120",
      containerNo: "CONT-112",
      transferType: "International",
      status: "Done",
      warehouse: "Main Warehouse",
      createdBy: 'system',
      createdAt: "2024-01-12T14:00:00.000Z",
      updatedBy: 'system',
      updatedAt: "2024-01-12T16:00:00.000Z",
      approvedBy: 'system',
      approvedAt: "2024-01-12T16:00:00.000Z"
    },
    {
      id: "2",
      referenceNo: "DEL-8802",
      poNumber: "PO-24002",
      transferDate: "2024-01-15",
      supplierCode: "SUP-002",
      itemCode: "PSC-1002",
      quantity: 50,
      packingNo: "PK-99121",
      containerNo: "CONT-113",
      transferType: "Local",
      status: "Done",
      warehouse: "TSD / Production",
      createdBy: 'system',
      createdAt: "2024-01-15T09:00:00.000Z",
      updatedBy: 'system',
      updatedAt: "2024-01-15T11:00:00.000Z",
      approvedBy: 'system',
      approvedAt: "2024-01-15T11:00:00.000Z"
    },
    {
      id: "3",
      referenceNo: "DEL-8803",
      poNumber: "PO-24003",
      transferDate: "2024-01-18",
      supplierCode: "SUP-003",
      itemCode: "PSC-1003",
      quantity: 200,
      packingNo: "PK-99122",
      containerNo: "CONT-114",
      transferType: "Local",
      status: "For Approval",
      warehouse: "Retail Outlet",
      createdBy: 'system',
      createdAt: "2024-01-18T10:00:00.000Z",
      updatedBy: 'system',
      updatedAt: "2024-01-18T10:00:00.000Z"
    },
    {
      id: "4",
      referenceNo: "DEL-8804",
      poNumber: "PO-24004",
      transferDate: "2024-01-20",
      supplierCode: "SUP-001",
      itemCode: "ITEM-001",
      quantity: 75,
      packingNo: "PK-99123",
      containerNo: "CONT-115",
      transferType: "Local",
      status: "Open",
      warehouse: "Main Warehouse",
      createdBy: 'system',
      createdAt: "2024-01-20T09:00:00.000Z",
      updatedBy: 'system',
      updatedAt: "2024-01-20T09:00:00.000Z"
    }
  ]),
  suppliers: loadFromStorage(STORAGE_KEYS.SUPPLIERS, [
    {
      id: "1",
      supplierCode: "SUP-001",
      supplierName: "TechPro Solutions",
      companyName: "TechPro Corp",
      supplierType: "International",
      company: "TechPro",
      status: "Active",
      createdBy: 'system',
      createdAt: new Date().toISOString(),
      updatedBy: 'system',
      updatedAt: new Date().toISOString(),
    },
    {
      id: "2",
      supplierCode: "SUP-002",
      supplierName: "Global Supplies Ltd",
      companyName: "Global Supplies Inc",
      supplierType: "Local",
      company: "Global Supplies",
      status: "Active",
      createdBy: 'system',
      createdAt: new Date().toISOString(),
      updatedBy: 'system',
      updatedAt: new Date().toISOString(),
    },
    {
      id: "3",
      supplierCode: "SUP-003",
      supplierName: "Local Distributors Inc",
      companyName: "Local Distributors Corp",
      supplierType: "Local",
      company: "Local Distributors",
      status: "Active",
      createdBy: 'system',
      createdAt: new Date().toISOString(),
      updatedBy: 'system',
      updatedAt: new Date().toISOString(),
    }
  ]),
  transfers: loadFromStorage(STORAGE_KEYS.TRANSFERS, []),
  orders: loadFromStorage(STORAGE_KEYS.ORDERS, []),
  pickers: loadFromStorage(STORAGE_KEYS.PICKERS, [
    {
      id: "1",
      seriesNo: "P-1001",
      poNo: "PO-24001",
      deliveryReference: "DEL-8801",
      poBrand: "KLIK",
      customerName: "SM Supermarket",
      routeCode: "RT-01",
      dateApproved: "2024-01-12",
      approvedTime: "14:30:00",
      deliverySchedule: "2024-01-15",
      priorityLevel: "High",
      transferType: "Standard",
      receivedBy: "John Picker",
      assignedStaff: "Alice Williams",
      status: "Assigned",
      totalQty: 100,
      countedQty: 0,
      whReceiveDate: "2024-01-12",
      approvedBy: "Admin",
      plRemarks: "Handle with care - fragile items",
      stockSource: "Supplier Delivery",
      sourceReference: "DEL-8801",
      createdBy: 'system',
      createdAt: new Date().toISOString(),
      updatedBy: 'system',
      updatedAt: new Date().toISOString(),
    },
    {
      id: "2",
      seriesNo: "P-1002",
      poNo: "PO-24002",
      deliveryReference: "DEL-8802",
      poBrand: "BW",
      customerName: "Robinsons Retail",
      routeCode: "RT-02",
      dateApproved: "2024-01-15",
      approvedTime: "09:15:00",
      deliverySchedule: "2024-01-18",
      priorityLevel: "Medium",
      transferType: "Standard",
      receivedBy: "Jane Picker",
      assignedStaff: "",
      status: "No Assignment",
      totalQty: 50,
      countedQty: 0,
      whReceiveDate: "2024-01-15",
      approvedBy: "Manager",
      plRemarks: "Standard handling required",
      stockSource: "Supplier Delivery",
      sourceReference: "DEL-8802",
      createdBy: 'system',
      createdAt: new Date().toISOString(),
      updatedBy: 'system',
      updatedAt: new Date().toISOString(),
    },
    {
      id: "3",
      seriesNo: "P-1003",
      poNo: "PO-24003",
      deliveryReference: "DEL-8803",
      poBrand: "OMG",
      customerName: "Puregold Price Club",
      routeCode: "RT-03",
      dateApproved: "2024-01-18",
      approvedTime: "10:30:00",
      deliverySchedule: "2024-01-20",
      priorityLevel: "Low",
      transferType: "Standard",
      receivedBy: "Bob Picker",
      assignedStaff: "Michael Brown",
      status: "Picking",
      totalQty: 200,
      countedQty: 85,
      whReceiveDate: "2024-01-18",
      approvedBy: "Operator",
      plRemarks: "Bulk order - use pallet jack",
      stockSource: "Supplier Delivery",
      sourceReference: "DEL-8803",
      createdBy: 'system',
      createdAt: new Date().toISOString(),
      updatedBy: 'system',
      updatedAt: new Date().toISOString(),
    }
  ]),
  barcoders: loadFromStorage(STORAGE_KEYS.BARCODERS, []),
  taggers: loadFromStorage(STORAGE_KEYS.TAGGERS, []),
  checkers: loadFromStorage(STORAGE_KEYS.CHECKERS, []),
  transferAssignments: loadFromStorage(STORAGE_KEYS.TRANSFER_ASSIGNMENTS, []),
  warehouses: loadFromStorage('wms_warehouses', [
    {
      id: "1",
      code: "WH-MAIN",
      name: "Main Warehouse",
      type: "Main",
      location: "Taguig",
      status: "Active",
      createdBy: 'system',
      createdAt: new Date().toISOString(),
      updatedBy: 'system',
      updatedAt: new Date().toISOString(),
    },
    {
      id: "2",
      code: "WH-PROD",
      name: "TSD / Production",
      type: "Production",
      location: "Cavite",
      status: "Active",
      createdBy: 'system',
      createdAt: new Date().toISOString(),
      updatedBy: 'system',
      updatedAt: new Date().toISOString(),
    },
    {
      id: "3",
      code: "WH-RET",
      name: "Retail Outlet",
      type: "Branch",
      location: "Makati",
      status: "Active",
      createdBy: 'system',
      createdAt: new Date().toISOString(),
      updatedBy: 'system',
      updatedAt: new Date().toISOString(),
    },
    {
      id: "4",
      code: "WH-BULK",
      name: "Bulk Storage",
      type: "Branch",
      location: "Mandaue",
      status: "Active",
      createdBy: 'system',
      createdAt: new Date().toISOString(),
      updatedBy: 'system',
      updatedAt: new Date().toISOString(),
    }
  ]),
  customers: loadFromStorage('wms_customers', [])
});

const loadFromStorage = <T,>(key: string, defaultValue: T): T => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error);
    return defaultValue;
  }
};

const saveToStorage = <T,>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
};

// --- Provider ---

// --- Provider ---

export const WmsProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();

  // Get current user identifier for audit fields
  const getCurrentUserId = () => user?.id || 'system';
  const getCurrentUserName = () => user?.fullName || 'System User';

  // Initialize state with useReducer
  const [state, dispatch] = useReducer(wmsReducer, getInitialState());

  // Extract state properties for backward compatibility
  const {
    items,
    purchaseOrders,
    adjustments,
    withdrawals,
    customerReturns,
    deliveries,
    suppliers,
    transfers,
    orders,
    pickers,
    barcoders,
    taggers,
    checkers,
    transferAssignments,
    warehouses,
    customers
  } = state;

  // Legacy functions for backward compatibility - now dispatch actions
  const setItems = (items: ItemMasterRecord[]) => dispatch({ type: 'SET_ITEMS', payload: items });

  // --- Local Storage Persistence ---
  useEffect(() => saveToStorage(STORAGE_KEYS.ITEMS, items), [items]);
  useEffect(() => saveToStorage(STORAGE_KEYS.PURCHASE_ORDERS, purchaseOrders), [purchaseOrders]);
  useEffect(() => saveToStorage(STORAGE_KEYS.ADJUSTMENTS, adjustments), [adjustments]);
  useEffect(() => saveToStorage(STORAGE_KEYS.WITHDRAWALS, withdrawals), [withdrawals]);
  useEffect(() => saveToStorage(STORAGE_KEYS.CUSTOMER_RETURNS, customerReturns), [customerReturns]);
  useEffect(() => saveToStorage(STORAGE_KEYS.DELIVERIES, deliveries), [deliveries]);
  useEffect(() => saveToStorage(STORAGE_KEYS.SUPPLIERS, suppliers), [suppliers]);
  useEffect(() => saveToStorage(STORAGE_KEYS.TRANSFERS, transfers), [transfers]);
  useEffect(() => saveToStorage(STORAGE_KEYS.ORDERS, orders), [orders]);
  useEffect(() => saveToStorage(STORAGE_KEYS.PICKERS, pickers), [pickers]);
  useEffect(() => saveToStorage(STORAGE_KEYS.BARCODERS, barcoders), [barcoders]);
  useEffect(() => saveToStorage(STORAGE_KEYS.TAGGERS, taggers), [taggers]);
  useEffect(() => saveToStorage(STORAGE_KEYS.CHECKERS, checkers), [checkers]);
  useEffect(() => saveToStorage(STORAGE_KEYS.TRANSFER_ASSIGNMENTS, transferAssignments), [transferAssignments]);
  useEffect(() => saveToStorage('wms_warehouses', warehouses), [warehouses]);

  // --- Actions Implementation ---

  const addItem = (item: ItemMasterRecord) => {
    try {
      // Validate the item
      const validation = validationService.validateItemMaster(item);
      if (!validation.isValid) {
        throw validation.errors[0]; // Throw first error
      }

      // Apply auto computations
      const computedItem = autoComputation.applyComputations('item', item);

      // Add audit fields
      const itemWithAudit = {
        ...computedItem,
        createdBy: getCurrentUserId(),
        createdAt: new Date().toISOString(),
        updatedBy: getCurrentUserId(),
        updatedAt: new Date().toISOString()
      };

      dispatch({ type: 'ADD_ITEM', payload: itemWithAudit as ItemMasterRecord });

      // Log audit trail
      auditTrail.logAction('create', 'item', item.id, undefined, item.shortDescription);

      // Emit event
      globalEventEmitter.emit(WMSEvents.ASSIGNMENT_COMPLETED, {
        type: 'item_created',
        item: itemWithAudit
      });

      return itemWithAudit;
    } catch (error) {
      handleValidationError(error, 'addItem');
      throw error;
    }
  };

  const updateItem = (id: string, data: Partial<ItemMasterRecord>) => {
    try {
      // Validate the update data
      const validation = validationService.validateItemMaster(data);
      if (!validation.isValid) {
        throw validation.errors[0];
      }

      // Apply auto computations
      const computedData = autoComputation.applyComputations('item', data);

      // Add update timestamp
      const updateData = {
        ...computedData,
        updatedAt: new Date().toISOString(),
        updatedBy: getCurrentUserId()
      };

      dispatch({ type: 'UPDATE_ITEM', payload: { id, data: updateData } });

      // Log audit trail
      auditTrail.logAction('update', 'item', id, undefined, `Updated item ${id}`);

      return updateData;
    } catch (error) {
      handleValidationError(error, 'updateItem');
      throw error;
    }
  };

  const deleteItem = (id: string) => {
    try {
      const itemToDelete = items.find(i => i.id === id);
      dispatch({ type: 'DELETE_ITEM', payload: id });

      // Log audit trail
      auditTrail.logAction('delete', 'item', id, undefined, itemToDelete?.shortDescription || `Item ${id}`);

      return true;
    } catch (error) {
      handleValidationError(error, 'deleteItem');
      throw error;
    }
  };

  const addPO = (po: PurchaseOrderRecord) => {
    try {
      // Validate the PO
      const validation = validationService.validatePurchaseOrder(po);
      if (!validation.isValid) {
        throw validation.errors[0];
      }

      // Apply auto computations (will calculate totalAmount from quantity * unitPrice)
      const computedPO = autoComputation.applyComputations('purchase_order', po);

      // Add audit fields
      const poWithAudit = {
        ...computedPO,
        createdBy: getCurrentUserId(),
        createdAt: new Date().toISOString(),
        updatedBy: getCurrentUserId(),
        updatedAt: new Date().toISOString(),
        // Set approval fields if status is Approved
        ...(computedPO.status === 'Approved' && {
          approvedBy: getCurrentUserId(),
          approvedAt: new Date().toISOString()
        })
      };

      dispatch({ type: 'ADD_PURCHASE_ORDER', payload: poWithAudit as PurchaseOrderRecord });

      // Log audit trail
      auditTrail.logAction('create', 'purchase_order', po.id, undefined, po.poNumber);

      // Record stock ledger entry (expected incoming stock)
      stockLedger.recordTransaction({
        productId: po.itemCode,
        location: {
          warehouseId: 'WH-MAIN', // Default warehouse, should be configurable
        },
        transactionType: 'in',
        referenceType: 'purchase_order',
        referenceId: po.id,
        quantity: po.quantity,
        unitCost: po.unitPrice,
        totalCost: computedPO.totalAmount,
        performedBy: getCurrentUserId()
      });

      return computedPO;
    } catch (error) {
      handleValidationError(error, 'addPO');
      throw error;
    }
  };

  const updatePO = (id: string, data: Partial<PurchaseOrderRecord>) => {
    try {
      // Get existing PO to check for status changes
      const existingPO = purchaseOrders.find(po => po.id === id);
      if (!existingPO) {
        throw new Error(`Purchase order ${id} not found`);
      }

      // Validate the update data
      const validation = validationService.validatePurchaseOrder(data);
      if (!validation.isValid) {
        throw validation.errors[0];
      }

      // Apply auto computations
      const computedData = autoComputation.applyComputations('purchase_order', data);

      // Always set updated timestamp on edit
      const updateData = {
        ...computedData,
        updatedAt: new Date().toISOString(),
        updatedBy: getCurrentUserId()
      };

      // Set approval fields if status is changing to Approved
      if (computedData.status === 'Approved' && existingPO.status !== 'Approved') {
        updateData.approvedBy = 'getCurrentUserId()';
        updateData.approvedAt = new Date().toISOString();
      }

      dispatch({ type: 'UPDATE_PURCHASE_ORDER', payload: { id, data: updateData } });

      // Log audit trail
      auditTrail.logAction('update', 'purchase_order', id, undefined, `Updated PO ${id}`);

      return updateData;
    } catch (error) {
      handleValidationError(error, 'updatePO');
      throw error;
    }
  };

  const deletePO = (id: string) => {
    try {
      const poToDelete = purchaseOrders.find(p => p.id === id);
      dispatch({ type: 'DELETE_PURCHASE_ORDER', payload: id });

      // Log audit trail
      auditTrail.logAction('delete', 'purchase_order', id, undefined, poToDelete?.poNumber || `PO ${id}`);

      return true;
    } catch (error) {
      handleValidationError(error, 'deletePO');
      throw error;
    }
  };

  const addAdjustment = (adj: AdjustmentRecord) => {
    try {
      // Apply auto computations
      const computedAdj = autoComputation.applyComputations('adjustment', adj);

      // Add audit fields
      const adjWithAudit = {
        ...computedAdj,
        createdBy: 'getCurrentUserId()',
        createdAt: new Date().toISOString(),
        updatedBy: getCurrentUserId(),
        updatedAt: new Date().toISOString()
      };

      dispatch({ type: 'ADD_ADJUSTMENT', payload: adjWithAudit as AdjustmentRecord });

      // Log audit trail
      auditTrail.logAction('create', 'adjustment', adj.id, undefined, `Created adjustment ${adj.id}`);

      return adjWithAudit;
    } catch (error) {
      handleValidationError(error, 'addAdjustment');
      throw error;
    }
  };
  const updateAdjustment = (id: string, data: Partial<AdjustmentRecord>) => {
    try {
      // Apply auto computations
      const computedData = autoComputation.applyComputations('adjustment', data);

      // Always set updated timestamp on edit
      const updateData = {
        ...computedData,
        updatedAt: new Date().toISOString(),
        updatedBy: getCurrentUserId()
      };

      dispatch({ type: 'UPDATE_ADJUSTMENT', payload: { id, data: updateData } });

      // Log audit trail
      auditTrail.logAction('update', 'adjustment', id, undefined, `Updated adjustment ${id}`);

      return updateData;
    } catch (error) {
      handleValidationError(error, 'updateAdjustment');
      throw error;
    }
  };
  const deleteAdjustment = (id: string) => {
    dispatch({ type: 'DELETE_ADJUSTMENT', payload: id });
  };

  const addWithdrawal = (w: WithdrawalRecord) => {
    try {
      // Apply auto computations
      const computedW = autoComputation.applyComputations('withdrawal', w);

      // Add audit fields
      const wWithAudit = {
        ...computedW,
        createdBy: 'getCurrentUserId()',
        createdAt: new Date().toISOString(),
        updatedBy: getCurrentUserId(),
        updatedAt: new Date().toISOString()
      };

      dispatch({ type: 'ADD_WITHDRAWAL', payload: wWithAudit as WithdrawalRecord });

      // Log audit trail
      auditTrail.logAction('create', 'withdrawal', w.id, undefined, `Created withdrawal ${w.id}`);

      return wWithAudit;
    } catch (error) {
      handleValidationError(error, 'addWithdrawal');
      throw error;
    }
  };
  const updateWithdrawal = (id: string, data: Partial<WithdrawalRecord>) => {
    try {
      // Apply auto computations
      const computedData = autoComputation.applyComputations('withdrawal', data);

      // Always set updated timestamp on edit
      const updateData = {
        ...computedData,
        updatedAt: new Date().toISOString(),
        updatedBy: getCurrentUserId()
      };

      dispatch({ type: 'UPDATE_WITHDRAWAL', payload: { id, data: updateData } });

      // Log audit trail
      auditTrail.logAction('update', 'withdrawal', id, undefined, `Updated withdrawal ${id}`);

      return updateData;
    } catch (error) {
      handleValidationError(error, 'updateWithdrawal');
      throw error;
    }
  };
  const deleteWithdrawal = (id: string) => {
    dispatch({ type: 'DELETE_WITHDRAWAL', payload: id });
  };

  // Actions for Customer Returns
  const addCustomerReturn = (cr: CustomerReturnRecord) => {
    try {
      // Apply auto computations
      const computedCR = autoComputation.applyComputations('customer_return', cr);

      // Add audit fields
      const crWithAudit = {
        ...computedCR,
        createdBy: 'getCurrentUserId()',
        createdAt: new Date().toISOString(),
        updatedBy: getCurrentUserId(),
        updatedAt: new Date().toISOString()
      };

      dispatch({ type: 'ADD_CUSTOMER_RETURN', payload: crWithAudit as CustomerReturnRecord });

      // Log audit trail
      auditTrail.logAction('create', 'customer_return', cr.id, undefined, `Created customer return ${cr.id}`);

      return crWithAudit;
    } catch (error) {
      handleValidationError(error, 'addCustomerReturn');
      throw error;
    }
  };
  const updateCustomerReturn = (id: string, data: Partial<CustomerReturnRecord>) => {
    try {
      // Apply auto computations
      const computedData = autoComputation.applyComputations('customer_return', data);

      // Always set updated timestamp on edit
      const updateData = {
        ...computedData,
        updatedAt: new Date().toISOString(),
        updatedBy: getCurrentUserId()
      };

      dispatch({ type: 'UPDATE_CUSTOMER_RETURN', payload: { id, data: updateData } });

      // Log audit trail
      auditTrail.logAction('update', 'customer_return', id, updateData, `Updated customer return ${id}`);

      return updateData;
    } catch (error) {
      handleValidationError(error, 'updateCustomerReturn');
      throw error;
    }
  };
  const deleteCustomerReturn = (id: string) => {
    dispatch({ type: 'DELETE_CUSTOMER_RETURN', payload: id });
  };

  const addDelivery = (d: DeliveryRecord) => {
    try {
      // Validate the delivery
      const validation = validationService.validateDelivery(d);
      if (!validation.isValid) {
        throw validation.errors[0];
      }

      // Apply auto computations
      const computedDelivery = autoComputation.applyComputations('delivery', d);

      // Add audit fields
      const deliveryWithAudit = {
        ...computedDelivery,
        createdBy: getCurrentUserId(),
        createdAt: new Date().toISOString(),
        updatedBy: getCurrentUserId(),
        updatedAt: new Date().toISOString(),
        // Set approval fields if status is Done/Received (approved)
        ...((computedDelivery.status === 'Done' || computedDelivery.status === 'Received') && {
          approvedBy: getCurrentUserId(),
          approvedAt: new Date().toISOString()
        })
      };

      dispatch({ type: 'ADD_DELIVERY', payload: deliveryWithAudit as DeliveryRecord });

      // If delivery is marked as Done/Received, update stock ledger
      if (computedDelivery.status === 'Done' || computedDelivery.status === 'Received') {
        stockLedger.recordTransaction({
          productId: computedDelivery.itemCode,
          location: {
            warehouseId: computedDelivery.warehouse,
          },
          transactionType: 'in',
          referenceType: 'purchase_order',
          referenceId: computedDelivery.poNumber || '',
          quantity: computedDelivery.quantity,
          performedBy: computedDelivery.createdBy,
          notes: `Delivery from ${computedDelivery.supplierCode}`
        });
      }

      // Log audit trail
      auditTrail.logAction('create', 'delivery', d.id, computedDelivery, d.referenceNo);

      return computedDelivery;
    } catch (error) {
      handleValidationError(error, 'addDelivery');
      throw error;
    }
  };

  const updateDelivery = (id: string, data: Partial<DeliveryRecord>) => {
    try {
      const existingDelivery = deliveries.find(d => d.id === id);
      if (!existingDelivery) {
        throw new Error(`Delivery ${id} not found`);
      }

      // Validate status transition
      if (data.status && data.status !== existingDelivery.status) {
        const allowedTransitions = {
          'Open': ['Pending', 'For Approval', 'Done'],
          'Pending': ['For Approval', 'Done', 'Open'],
          'For Approval': ['Done', 'Open'],
          'Done': [], // Final state
          'Received': [] // Final state
        };

        const transitionValidation = validationService.validateStateTransition(
          'delivery',
          id,
          existingDelivery.status,
          data.status,
          allowedTransitions
        );

        if (!transitionValidation.isValid) {
          throw transitionValidation.errors[0];
        }
      }

      // Apply auto computations
      const computedData = autoComputation.applyComputations('delivery', data);

      // Always set updated timestamp on edit
      const updateData = {
        ...computedData,
        updatedAt: new Date().toISOString(),
        updatedBy: getCurrentUserId()
      };

      // Set approval fields if status is changing to Done/Received
      if ((computedData.status === 'Done' || computedData.status === 'Received') &&
          (existingDelivery.status !== 'Done' && existingDelivery.status !== 'Received')) {
        updateData.approvedBy = 'getCurrentUserId()';
        updateData.approvedAt = new Date().toISOString();
      }

      const updatedDelivery = { ...existingDelivery, ...updateData };
      dispatch({ type: 'UPDATE_DELIVERY', payload: { id, data: updatedDelivery } });

      // If status changed to Done/Received, update stock ledger
      if ((computedData.status === 'Done' || computedData.status === 'Received') &&
          existingDelivery.status !== computedData.status) {
        stockLedger.recordTransaction({
          productId: updatedDelivery.itemCode,
          location: {
            warehouseId: updatedDelivery.warehouse,
          },
          transactionType: 'in',
          referenceType: 'purchase_order',
          referenceId: updatedDelivery.poNumber || '',
          quantity: updatedDelivery.quantity,
          performedBy: updatedDelivery.updatedBy,
          notes: `Delivery status changed to ${computedData.status}`
        });
      }

      // Log audit trail
      auditTrail.logAction('update', 'delivery', id, computedData, `Updated delivery ${updatedDelivery.referenceNo}`);

      return updatedDelivery;
    } catch (error) {
      handleValidationError(error, 'updateDelivery');
      throw error;
    }
  };

  const deleteDelivery = (id: string) => {
    try {
      const deliveryToDelete = deliveries.find(d => d.id === id);
      dispatch({ type: 'DELETE_DELIVERY', payload: id });

      // Log audit trail
      auditTrail.logAction('delete', 'delivery', id, {}, deliveryToDelete?.referenceNo || `Delivery ${id}`);

      return true;
    } catch (error) {
      handleValidationError(error, 'deleteDelivery');
      throw error;
    }
  };

  const addSupplier = (s: SupplierRecord) => {
    try {
      // Add audit fields
      const sWithAudit = {
        ...s,
        createdBy: 'getCurrentUserId()',
        createdAt: new Date().toISOString(),
        updatedBy: getCurrentUserId(),
        updatedAt: new Date().toISOString()
      };

      dispatch({ type: 'ADD_SUPPLIER', payload: sWithAudit as SupplierRecord });

      // Log audit trail
      auditTrail.logAction('create', 'supplier', s.id, sWithAudit, `Created supplier ${s.id}`);

      return sWithAudit;
    } catch (error) {
      handleValidationError(error, 'addSupplier');
      throw error;
    }
  };
  const updateSupplier = (id: string, data: Partial<SupplierRecord>) => {
    try {
      // Always set updated timestamp on edit
      const updateData = {
        ...data,
        updatedAt: new Date().toISOString(),
        updatedBy: getCurrentUserId()
      };

      dispatch({ type: 'UPDATE_SUPPLIER', payload: { id, data: updateData } });

      // Log audit trail
      auditTrail.logAction('update', 'supplier', id, updateData, `Updated supplier ${id}`);

      return updateData;
    } catch (error) {
      handleValidationError(error, 'updateSupplier');
      throw error;
    }
  };
  const deleteSupplier = (id: string) => {
    dispatch({ type: 'DELETE_SUPPLIER', payload: id });
  };

  const addTransfer = (t: TransferRecord) => {
    try {
      // Apply auto computations
      const computedT = autoComputation.applyComputations('transfer', t);

      // Add audit fields
      const tWithAudit = {
        ...computedT,
        createdBy: 'getCurrentUserId()',
        createdAt: new Date().toISOString(),
        updatedBy: getCurrentUserId(),
        updatedAt: new Date().toISOString(),
        // Set approval fields if status is Approved
        ...(computedT.status === 'Approved' && {
          approvedBy: getCurrentUserId(),
          approvedAt: new Date().toISOString()
        })
      };

      dispatch({ type: 'ADD_TRANSFER', payload: tWithAudit as TransferRecord });

      // Log audit trail
      auditTrail.logAction('create', 'transfer', t.id, tWithAudit, `Created transfer ${t.id}`);

      return tWithAudit;
    } catch (error) {
      handleValidationError(error, 'addTransfer');
      throw error;
    }
  };
  const updateTransfer = (id: string, data: Partial<TransferRecord>) => {
    try {
      // Get existing transfer to check for status changes
      const existingTransfer = transfers.find(t => t.id === id);
      if (!existingTransfer) {
        throw new Error(`Transfer ${id} not found`);
      }

      // Apply auto computations
      const computedData = autoComputation.applyComputations('transfer', data);

      // Always set updated timestamp on edit
      const updateData = {
        ...computedData,
        updatedAt: new Date().toISOString(),
        updatedBy: getCurrentUserId()
      };

      // Set approval fields if status is changing to Approved
      if (computedData.status === 'Approved' && existingTransfer.status !== 'Approved') {
        updateData.approvedBy = 'getCurrentUserId()';
        updateData.approvedAt = new Date().toISOString();
      }

      dispatch({ type: 'UPDATE_TRANSFER', payload: { id, data: updateData } });

      // Log audit trail
      auditTrail.logAction('update', 'transfer', id, updateData, `Updated transfer ${id}`);

      return updateData;
    } catch (error) {
      handleValidationError(error, 'updateTransfer');
      throw error;
    }
  };
  const deleteTransfer = (id: string) => {
    dispatch({ type: 'DELETE_TRANSFER', payload: id });
  };

  const addOrder = (o: OrderMonitorRecord) => {
    try {
      // Add audit fields
      const oWithAudit = {
        ...o,
        createdBy: 'getCurrentUserId()',
        createdAt: new Date().toISOString(),
        updatedBy: getCurrentUserId(),
        updatedAt: new Date().toISOString()
      };

      dispatch({ type: 'ADD_ORDER', payload: oWithAudit as OrderMonitorRecord });

      // Log audit trail
      auditTrail.logAction('create', 'order', o.id, oWithAudit, `Created order ${o.id}`);

      return oWithAudit;
    } catch (error) {
      handleValidationError(error, 'addOrder');
      throw error;
    }
  };
  const updateOrder = (id: string, data: Partial<OrderMonitorRecord>) => {
    try {
      // Always set updated timestamp on edit
      const updateData = {
        ...data,
        updatedAt: new Date().toISOString()
      };

      dispatch({ type: 'UPDATE_ORDER', payload: { id, data: updateData } });

      // Log audit trail
      auditTrail.logAction('update', 'order', id, updateData, `Updated order ${id}`);

      return updateData;
    } catch (error) {
      handleValidationError(error, 'updateOrder');
      throw error;
    }
  };
  const deleteOrder = (id: string) => {
    dispatch({ type: 'DELETE_ORDER', payload: id });
  };

  // Missing methods that pages are trying to call
  const addPicker = (picker: PickerRecord) => {
    try {
      // Add audit fields
      const pickerWithAudit = {
        ...picker,
        createdBy: 'getCurrentUserId()',
        createdAt: new Date().toISOString(),
        updatedBy: getCurrentUserId(),
        updatedAt: new Date().toISOString()
      };

      dispatch({ type: 'ADD_PICKER', payload: pickerWithAudit as PickerRecord });

      // Log audit trail
      auditTrail.logAction('create', 'picker', picker.id, pickerWithAudit, `Created picker assignment ${picker.id}`);

      return pickerWithAudit;
    } catch (error) {
      handleValidationError(error, 'addPicker');
      throw error;
    }
  };

  const addBarcoder = (barcoder: BarcoderRecord) => {
    try {
      // Add audit fields
      const barcoderWithAudit = {
        ...barcoder,
        createdBy: 'getCurrentUserId()',
        createdAt: new Date().toISOString(),
        updatedBy: getCurrentUserId(),
        updatedAt: new Date().toISOString()
      };

      dispatch({ type: 'ADD_BARCODER', payload: barcoderWithAudit as BarcoderRecord });

      // Log audit trail
      auditTrail.logAction('create', 'barcoder', barcoder.id, barcoderWithAudit, `Created barcoder assignment ${barcoder.id}`);

      return barcoderWithAudit;
    } catch (error) {
      handleValidationError(error, 'addBarcoder');
      throw error;
    }
  };

  const addTagger = (tagger: TaggerRecord) => {
    try {
      // Add audit fields
      const taggerWithAudit = {
        ...tagger,
        createdBy: 'getCurrentUserId()',
        createdAt: new Date().toISOString(),
        updatedBy: getCurrentUserId(),
        updatedAt: new Date().toISOString()
      };

      dispatch({ type: 'ADD_TAGGER', payload: taggerWithAudit as TaggerRecord });

      // Log audit trail
      auditTrail.logAction('create', 'tagger', tagger.id, taggerWithAudit, `Created tagger assignment ${tagger.id}`);

      return taggerWithAudit;
    } catch (error) {
      handleValidationError(error, 'addTagger');
      throw error;
    }
  };

  const addChecker = (checker: CheckerRecord) => {
    try {
      // Add audit fields
      const checkerWithAudit = {
        ...checker,
        createdBy: 'getCurrentUserId()',
        createdAt: new Date().toISOString(),
        updatedBy: getCurrentUserId(),
        updatedAt: new Date().toISOString()
      };

      dispatch({ type: 'ADD_CHECKER', payload: checkerWithAudit as CheckerRecord });

      // Log audit trail
      auditTrail.logAction('create', 'checker', checker.id, checkerWithAudit, `Created checker assignment ${checker.id}`);

      return checkerWithAudit;
    } catch (error) {
      handleValidationError(error, 'addChecker');
      throw error;
    }
  };

  const updatePicker = (id: string, data: Partial<PickerRecord>) => {
    try {
      // Always set updated timestamp on edit
      const updateData = {
        ...data,
        updatedAt: new Date().toISOString()
      };

      dispatch({ type: 'UPDATE_PICKER', payload: { id, data: updateData } });

      // Log audit trail
      auditTrail.logAction('update', 'picker', id, updateData, `Updated picker assignment ${id}`);

      return updateData;
    } catch (error) {
      handleValidationError(error, 'updatePicker');
      throw error;
    }
  };

  const updateBarcoder = (id: string, data: Partial<BarcoderRecord>) => {
    try {
      // Always set updated timestamp on edit
      const updateData = {
        ...data,
        updatedAt: new Date().toISOString()
      };

      dispatch({ type: 'UPDATE_BARCODER', payload: { id, data: updateData } });

      // Log audit trail
      auditTrail.logAction('update', 'barcoder', id, updateData, `Updated barcoder assignment ${id}`);

      return updateData;
    } catch (error) {
      handleValidationError(error, 'updateBarcoder');
      throw error;
    }
  };

  const updateTagger = (id: string, data: Partial<TaggerRecord>) => {
    try {
      // Always set updated timestamp on edit
      const updateData = {
        ...data,
        updatedAt: new Date().toISOString()
      };

      dispatch({ type: 'UPDATE_TAGGER', payload: { id, data: updateData } });

      // Log audit trail
      auditTrail.logAction('update', 'tagger', id, updateData, `Updated tagger assignment ${id}`);

      return updateData;
    } catch (error) {
      handleValidationError(error, 'updateTagger');
      throw error;
    }
  };

  const updateChecker = (id: string, data: Partial<CheckerRecord>) => {
    try {
      // Always set updated timestamp on edit
      const updateData = {
        ...data,
        updatedAt: new Date().toISOString()
      };

      dispatch({ type: 'UPDATE_CHECKER', payload: { id, data: updateData } });

      // Log audit trail
      auditTrail.logAction('update', 'checker', id, updateData, `Updated checker assignment ${id}`);

      return updateData;
    } catch (error) {
      handleValidationError(error, 'updateChecker');
      throw error;
    }
  };
  const addTransferAssignment = (ta: TransferAssignmentRecord) => {
    try {
      // Add audit fields
      const taWithAudit = {
        ...ta,
        createdBy: 'getCurrentUserId()',
        createdAt: new Date().toISOString(),
        updatedBy: getCurrentUserId(),
        updatedAt: new Date().toISOString()
      };

      dispatch({ type: 'ADD_TRANSFER_ASSIGNMENT', payload: taWithAudit as TransferAssignmentRecord });

      // Log audit trail
      auditTrail.logAction('create', 'transfer_assignment', ta.id, taWithAudit, `Created transfer assignment ${ta.id}`);

      return taWithAudit;
    } catch (error) {
      handleValidationError(error, 'addTransferAssignment');
      throw error;
    }
  };
  const updateTransferAssignment = (id: string, data: Partial<TransferAssignmentRecord>) => {
    try {
      // Always set updated timestamp on edit
      const updateData = {
        ...data,
        updatedAt: new Date().toISOString()
      };

      dispatch({ type: 'UPDATE_TRANSFER_ASSIGNMENT', payload: { id, data: updateData } });

      // Log audit trail
      auditTrail.logAction('update', 'transfer_assignment', id, updateData, `Updated transfer assignment ${id}`);

      return updateData;
    } catch (error) {
      handleValidationError(error, 'updateTransferAssignment');
      throw error;
    }
  };

  // Warehouse CRUD methods
  const addWarehouse = (warehouse: WarehouseMasterRecord) => {
    try {
      // Add audit fields
      const warehouseWithAudit = {
        ...warehouse,
        createdBy: 'getCurrentUserId()',
        createdAt: new Date().toISOString(),
        updatedBy: getCurrentUserId(),
        updatedAt: new Date().toISOString()
      };

      dispatch({ type: 'ADD_WAREHOUSE', payload: warehouseWithAudit as WarehouseMasterRecord });

      // Log audit trail
      auditTrail.logAction('create', 'warehouse', warehouse.id, warehouseWithAudit, `Created warehouse ${warehouse.id}`);

      return warehouseWithAudit;
    } catch (error) {
      handleValidationError(error, 'addWarehouse');
      throw error;
    }
  };
  const updateWarehouse = (id: string, data: Partial<WarehouseMasterRecord>) => {
    try {
      // Always set updated timestamp on edit
      const updateData = {
        ...data,
        updatedAt: new Date().toISOString(),
        updatedBy: getCurrentUserId()
      };

      dispatch({ type: 'UPDATE_WAREHOUSE', payload: { id, data: updateData } });

      // Log audit trail
      auditTrail.logAction('update', 'warehouse', id, updateData, `Updated warehouse ${id}`);

      return updateData;
    } catch (error) {
      handleValidationError(error, 'updateWarehouse');
      throw error;
    }
  };
  const deleteWarehouse = (id: string) => {
    dispatch({ type: 'DELETE_WAREHOUSE', payload: id });
  };

  // Customer CRUD methods
  const addCustomer = (customer: CustomerMasterRecord) => {
    try {
      // Add audit fields
      const customerWithAudit = {
        ...customer,
        createdBy: 'getCurrentUserId()',
        createdAt: new Date().toISOString(),
        updatedBy: getCurrentUserId(),
        updatedAt: new Date().toISOString()
      };

      dispatch({ type: 'ADD_CUSTOMER', payload: customerWithAudit as CustomerMasterRecord });

      // Log audit trail
      auditTrail.logAction('create', 'customer', customer.id, customerWithAudit, `Created customer ${customer.id}`);

      return customerWithAudit;
    } catch (error) {
      handleValidationError(error, 'addCustomer');
      throw error;
    }
  };
  const updateCustomer = (id: string, data: Partial<CustomerMasterRecord>) => {
    try {
      // Always set updated timestamp on edit
      const updateData = {
        ...data,
        updatedAt: new Date().toISOString(),
        updatedBy: getCurrentUserId()
      };

      dispatch({ type: 'UPDATE_CUSTOMER', payload: { id, data: updateData } });

      // Log audit trail
      auditTrail.logAction('update', 'customer', id, updateData, `Updated customer ${id}`);

      return updateData;
    } catch (error) {
      handleValidationError(error, 'updateCustomer');
      throw error;
    }
  };
  const deleteCustomer = (id: string) => {
    dispatch({ type: 'DELETE_CUSTOMER', payload: id });
  };

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
      // Assignment actions
      addPicker, addBarcoder, addTagger, addChecker,
      updatePicker, updateBarcoder, updateTagger, updateChecker, addTransferAssignment, updateTransferAssignment,
      // Warehouse actions
      addWarehouse, updateWarehouse, deleteWarehouse,
      // Customer actions
      addCustomer, updateCustomer, deleteCustomer
    }}>
      {children}
    </WmsContext.Provider>
  );
};

