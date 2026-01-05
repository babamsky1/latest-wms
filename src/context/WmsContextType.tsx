import { createContext } from "react";
import {
  ItemMasterRecord,
  PurchaseOrderRecord,
  AdjustmentRecord,
  WithdrawalRecord,
  CustomerReturnRecord,
  DeliveryRecord,
  SupplierRecord,
  WarehouseMasterRecord,
  CustomerMasterRecord,
  TransferRecord,
  OrderMonitorRecord,
  PickerRecord,
  BarcoderRecord,
  TaggerRecord,
  CheckerRecord,
  TransferAssignmentRecord
} from "@/types";

// --- Context Types ---

export interface WmsContextType {
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

  // Item actions
  addItem: (item: ItemMasterRecord) => void;
  updateItem: (id: string, data: Partial<ItemMasterRecord>) => void;
  deleteItem: (id: string) => void;

  // Purchase Order actions
  addPO: (po: PurchaseOrderRecord) => void;
  updatePO: (id: string, data: Partial<PurchaseOrderRecord>) => void;
  deletePO: (id: string) => void;

  // Adjustment actions
  addAdjustment: (adj: AdjustmentRecord) => void;
  updateAdjustment: (id: string, data: Partial<AdjustmentRecord>) => void;
  deleteAdjustment: (id: string) => void;

  // Withdrawal actions
  addWithdrawal: (withdrawal: WithdrawalRecord) => void;
  updateWithdrawal: (id: string, data: Partial<WithdrawalRecord>) => void;
  deleteWithdrawal: (id: string) => void;

  // Delivery actions
  addDelivery: (delivery: DeliveryRecord) => void;
  updateDelivery: (id: string, data: Partial<DeliveryRecord>) => void;
  deleteDelivery: (id: string) => void;

  // Supplier actions
  addSupplier: (supplier: SupplierRecord) => void;
  updateSupplier: (id: string, data: Partial<SupplierRecord>) => void;
  deleteSupplier: (id: string) => void;

  // Transfer actions
  addTransfer: (transfer: TransferRecord) => void;
  updateTransfer: (id: string, data: Partial<TransferRecord>) => void;
  deleteTransfer: (id: string) => void;

  // Order actions
  addOrder: (order: OrderMonitorRecord) => void;
  updateOrder: (id: string, data: Partial<OrderMonitorRecord>) => void;
  deleteOrder: (id: string) => void;

  // Assignment actions
  addPicker: (picker: PickerRecord) => void;
  addBarcoder: (barcoder: BarcoderRecord) => void;
  addTagger: (tagger: TaggerRecord) => void;
  addChecker: (checker: CheckerRecord) => void;
  updatePicker: (id: string, data: Partial<PickerRecord>) => void;
  updateBarcoder: (id: string, data: Partial<BarcoderRecord>) => void;
  updateTagger: (id: string, data: Partial<TaggerRecord>) => void;
  updateChecker: (id: string, data: Partial<CheckerRecord>) => void;
  addTransferAssignment: (ta: TransferAssignmentRecord) => void;
  updateTransferAssignment: (id: string, data: Partial<TransferAssignmentRecord>) => void;

  // Customer Return actions
  addCustomerReturn: (cr: CustomerReturnRecord) => void;
  updateCustomerReturn: (id: string, data: Partial<CustomerReturnRecord>) => void;
  deleteCustomerReturn: (id: string) => void;

  // Warehouse actions
  addWarehouse: (warehouse: WarehouseMasterRecord) => void;
  updateWarehouse: (id: string, data: Partial<WarehouseMasterRecord>) => void;
  deleteWarehouse: (id: string) => void;

  // Customer actions
  addCustomer: (customer: CustomerMasterRecord) => void;
  updateCustomer: (id: string, data: Partial<CustomerMasterRecord>) => void;
  deleteCustomer: (id: string) => void;

  // User helpers
  getCurrentUserName: () => string;
}

export const WmsContext = createContext<WmsContextType | undefined>(undefined);
