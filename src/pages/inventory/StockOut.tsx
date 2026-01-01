import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  CheckCircle,
  Clock,
  Edit,
  Eye,
  MoreHorizontal,
  PackageMinus,
  Plus,
  Search,
  Trash2,
  Truck
} from "lucide-react";
import { useReducer, useState } from "react";
import AddModal, { AddField } from "../../components/modals/AddModal";
import EditModal, { EditField } from "../../components/modals/EditModal";


interface StockOutRecord {
  id: string;
  referenceNo: string;
  destination: string;
  orderRef: string;
  itemCount: number;
  totalQuantity: number;
  status: "pending" | "dispatched" | "processing";
  dispatchDate: string;
  processedBy: string;
  [key: string]: unknown;
}

type State = {
  records: StockOutRecord[];
  searchQuery: string;
};

type Action =
  | { type: "SET_SEARCH"; payload: string }
  | { type: "DELETE_RECORD"; payload: string }
  | { type: "ADD_RECORD"; payload: StockOutRecord }
  | { type: "UPDATE_RECORD"; payload: StockOutRecord };

const initialRecords: StockOutRecord[] = [
  { id: "1", referenceNo: "SO-2024-001", destination: "Customer A", orderRef: "ORD-5001", itemCount: 3, totalQuantity: 150, status: "dispatched", dispatchDate: "2024-01-15", processedBy: "John Smith" },
  { id: "2", referenceNo: "SO-2024-002", destination: "Retail Store B", orderRef: "ORD-5002", itemCount: 8, totalQuantity: 420, status: "dispatched", dispatchDate: "2024-01-15", processedBy: "Jane Doe" },
  { id: "3", referenceNo: "SO-2024-003", destination: "Distributor C", orderRef: "ORD-5003", itemCount: 15, totalQuantity: 2300, status: "processing", dispatchDate: "2024-01-16", processedBy: "Mike Johnson" },
  { id: "4", referenceNo: "SO-2024-004", destination: "Warehouse D", orderRef: "TRF-1001", itemCount: 5, totalQuantity: 800, status: "pending", dispatchDate: "2024-01-16", processedBy: "-" },
  { id: "5", referenceNo: "SO-2024-005", destination: "Customer E", orderRef: "ORD-5004", itemCount: 2, totalQuantity: 50, status: "dispatched", dispatchDate: "2024-01-14", processedBy: "Sarah Wilson" },
];

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_SEARCH":
      return { ...state, searchQuery: action.payload };
    case "DELETE_RECORD":
      return { ...state, records: state.records.filter(r => r.id !== action.payload) };
    case "ADD_RECORD":
      return { ...state, records: [{ ...action.payload, status: "pending", processedBy: "-" }, ...state.records] };
    case "UPDATE_RECORD":
      return { ...state, records: state.records.map(r => r.id === action.payload.id ? action.payload : r) };
    default:
      return state;
  }
};

const StockOut = () => {
  const [state, dispatch] = useReducer(reducer, {
    records: initialRecords,
    searchQuery: "",
  });
  const [addOpen, setAddOpen] = useState(false);

  const getStatusBadge = (status: StockOutRecord["status"]) => {
    const config = {
      dispatched: { class: "status-active", icon: Truck },
      pending: { class: "status-warning", icon: Clock },
      processing: { class: "status-warning", icon: Clock },
    };
    const { class: className, icon: Icon } = config[status];
    return (
      <span className={`status-badge ${className}`}>
        <Icon className="h-3 w-3 mr-1" />
        {status}
      </span>
    );
  };

  const editStockOutFields: EditField<StockOutRecord>[] = [
    { label: "Reference No", name: "referenceNo", type: "text", disabled: true },
    { label: "Destination", name: "destination", type: "text", placeholder: "Enter destination", required: true },
    { label: "Order Reference", name: "orderRef", type: "text", placeholder: "e.g., ORD-5001", required: true },
    { label: "Item Count", name: "itemCount", type: "number", placeholder: "0", required: true },
    { label: "Total Quantity", name: "totalQuantity", type: "number", placeholder: "0", required: true },
    { label: "Dispatch Date", name: "dispatchDate", type: "text", placeholder: "YYYY-MM-DD", required: true },
    { label: "Processed By", name: "processedBy", type: "text", placeholder: "e.g., John Smith", required: false },
  ];

  const filteredRecords = state.records.filter(
    r =>
      r.referenceNo.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
      r.destination.toLowerCase().includes(state.searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Stock Out</h1>
          <p className="page-description">Manage outbound inventory and dispatches</p>
        </div>
      {/* Add Modal */}
      <AddModal<StockOutRecord>
        title="New Stock Out"
        description="Create a new stock out record"
        fields={[
          { label: "Reference No", name: "referenceNo", type: "text", placeholder: "Auto-generated", disabled: true },
          { label: "Destination", name: "destination", type: "text", placeholder: "e.g., Customer A", required: true },
          { label: "Order Reference", name: "orderRef", type: "text", placeholder: "e.g., ORD-5001", required: true },
          { label: "Item Count", name: "itemCount", type: "number", placeholder: "0", required: true },
          { label: "Total Quantity", name: "totalQuantity", type: "number", placeholder: "0", required: true },
          { label: "Processed By", name: "processedBy", type: "text", placeholder: "Your name", required: true }
        ]}
        initialData={{ id: "", referenceNo: "", destination: "", orderRef: "", itemCount: 0, totalQuantity: 0, status: "pending", dispatchDate: new Date().toISOString().split('T')[0], processedBy: "" }}
        onSubmit={() => setAddOpen(false)}
        onOpenChange={setAddOpen}
        triggerLabel="New Stock Out"
        submitLabel="Create Record"
      />
      </div>



      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <PackageMinus className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="stat-label">Today's Dispatched</p>
              <p className="stat-value">892</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-warning/10">
              <Clock className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="stat-label">Processing</p>
              <p className="stat-value">5</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success/10">
              <CheckCircle className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="stat-label">This Week</p>
              <p className="stat-value">4,230</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="content-section">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by reference or destination..."
              value={state.searchQuery}
              onChange={(e) => dispatch({ type: "SET_SEARCH", payload: e.target.value })}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        <Table variant="inventory">
          <TableHeader variant="inventory">
            <TableRow variant="inventory" className="bg-muted/50">
              <TableHead variant="inventory">Reference No.</TableHead>
              <TableHead variant="inventory">Destination</TableHead>
              <TableHead variant="inventory">Order Ref</TableHead>
              <TableHead variant="inventory">Items</TableHead>
              <TableHead variant="inventory">Total Qty</TableHead>
              <TableHead variant="inventory">Status</TableHead>
              <TableHead variant="inventory">Dispatch Date</TableHead>
              <TableHead variant="inventory">Processed By</TableHead>
              <TableHead variant="inventory" className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody variant="inventory">
            {filteredRecords.map(record => (
              <TableRow key={record.id} variant="inventory" className="hover:bg-muted/30">
                <TableCell variant="inventory" className="font-mono font-medium">{record.referenceNo}</TableCell>
                <TableCell variant="inventory">{record.destination}</TableCell>
                <TableCell variant="inventory" className="font-mono text-sm">{record.orderRef}</TableCell>
                <TableCell variant="inventory">{record.itemCount}</TableCell>
                <TableCell variant="inventory" className="font-semibold">{record.totalQuantity.toLocaleString()}</TableCell>
                <TableCell variant="inventory">{getStatusBadge(record.status)}</TableCell>
                <TableCell variant="inventory" className="text-muted-foreground">{record.dispatchDate}</TableCell>
                <TableCell variant="inventory">{record.processedBy}</TableCell>
                <TableCell variant="inventory">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <EditModal<StockOutRecord>
                          title="Edit Stock Out"
                          description="Update stock out record"
                          fields={editStockOutFields}
                          data={record}
                          onSubmit={(data) => dispatch({ type: "UPDATE_RECORD", payload: data as StockOutRecord })}
                          triggerLabel="Edit"
                          triggerSize="sm"
                          submitLabel="Update Stock Out"
                          size="lg"
                        />
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Eye className="h-4 w-4 mr-2" />View
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => dispatch({ type: "DELETE_RECORD", payload: record.id })}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default StockOut;
