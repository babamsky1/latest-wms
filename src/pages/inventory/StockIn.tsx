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
  Package,
  Plus,
  Search,
  Trash2
} from "lucide-react";
import { useReducer, useState } from "react";
import AddModal, { AddField } from "../../components/modals/AddModal";
import EditModal, { EditField } from "../../components/modals/EditModal";

interface StockInRecord {
  id: string;
  referenceNo: string;
  source: string;
  orderRef: string;
  itemCount: number;
  totalQuantity: number;
  status: "pending" | "received" | "processing";
  receivedDate: string;
  processedBy: string;
  [key: string]: unknown;
}

type State = {
  records: StockInRecord[];
  searchQuery: string;
};

type Action =
  | { type: "SET_SEARCH"; payload: string }
  | { type: "DELETE_RECORD"; payload: string }
  | { type: "ADD_RECORD"; payload: StockInRecord }
  | { type: "UPDATE_RECORD"; payload: StockInRecord };

const initialRecords: StockInRecord[] = [
  { id: "1", referenceNo: "SI-2024-001", source: "Supplier A", orderRef: "ORD-1001", itemCount: 10, totalQuantity: 500, status: "received", receivedDate: "2024-01-15", processedBy: "John Smith" },
  { id: "2", referenceNo: "SI-2024-002", source: "Supplier B", orderRef: "ORD-1002", itemCount: 5, totalQuantity: 250, status: "processing", receivedDate: "2024-01-15", processedBy: "Jane Doe" },
  { id: "3", referenceNo: "SI-2024-003", source: "Supplier C", orderRef: "ORD-1003", itemCount: 12, totalQuantity: 1200, status: "pending", receivedDate: "2024-01-16", processedBy: "-" },
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

const StockIn = () => {
  const [state, dispatch] = useReducer(reducer, {
    records: initialRecords,
    searchQuery: "",
  });
  const [addOpen, setAddOpen] = useState(false);

  const getStatusBadge = (status: StockInRecord["status"]) => {
    const config = {
      received: { class: "status-active", icon: CheckCircle },
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

  const editStockInFields: EditField<StockInRecord>[] = [
    { label: "Reference No", name: "referenceNo", type: "text", disabled: true },
    { label: "Source", name: "source", type: "text", placeholder: "Enter source", required: true },
    { label: "Order Reference", name: "orderRef", type: "text", placeholder: "e.g., ORD-1001", required: true },
    { label: "Item Count", name: "itemCount", type: "number", placeholder: "0", required: true },
    { label: "Total Quantity", name: "totalQuantity", type: "number", placeholder: "0", required: true },
    { label: "Received Date", name: "receivedDate", type: "text", placeholder: "YYYY-MM-DD", required: true },
    { label: "Processed By", name: "processedBy", type: "text", placeholder: "e.g., John Smith", required: false },
  ];

  const filteredRecords = state.records.filter(
    r =>
      r.referenceNo.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
      r.source.toLowerCase().includes(state.searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Stock In</h1>
          <p className="page-description">Manage inbound inventory and receipts</p>
        </div>
        {/* Add Modal */}
        <AddModal<StockInRecord>
          title="New Stock In"
          description="Create a new stock in receipt"
          fields={[
            { label: "Reference No", name: "referenceNo", type: "text", placeholder: "Auto-generated", disabled: true },
            { label: "Source", name: "source", type: "text", placeholder: "e.g., Supplier A", required: true },
            { label: "Order Reference", name: "orderRef", type: "text", placeholder: "e.g., ORD-1001", required: true },
            { label: "Item Count", name: "itemCount", type: "number", placeholder: "0", required: true },
            { label: "Total Quantity", name: "totalQuantity", type: "number", placeholder: "0", required: true },
            { label: "Processed By", name: "processedBy", type: "text", placeholder: "Your name", required: true }
          ]}
          initialData={{ id: "", referenceNo: "", source: "", orderRef: "", itemCount: 0, totalQuantity: 0, status: "pending", receivedDate: new Date().toISOString().split('T')[0], processedBy: "" }}
          onSubmit={() => setAddOpen(false)}
          onOpenChange={setAddOpen}
          triggerLabel="New Stock In"
          submitLabel="Create Record"
        />
      </div>


      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Package className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="stat-label">Today's Received</p>
              <p className="stat-value">500</p>
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
              placeholder="Search by reference or source..."
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
              <TableHead variant="inventory">Source</TableHead>
              <TableHead variant="inventory">Order Ref</TableHead>
              <TableHead variant="inventory">Items</TableHead>
              <TableHead variant="inventory">Total Qty</TableHead>
              <TableHead variant="inventory">Status</TableHead>
              <TableHead variant="inventory">Received Date</TableHead>
              <TableHead variant="inventory">Processed By</TableHead>
              <TableHead variant="inventory" className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody variant="inventory">
            {filteredRecords.map(record => (
              <TableRow key={record.id} variant="inventory" className="hover:bg-muted/30">
                <TableCell variant="inventory" className="font-mono font-medium">{record.referenceNo}</TableCell>
                <TableCell variant="inventory">{record.source}</TableCell>
                <TableCell variant="inventory" className="font-mono text-sm">{record.orderRef}</TableCell>
                <TableCell variant="inventory">{record.itemCount}</TableCell>
                <TableCell variant="inventory" className="font-semibold">{record.totalQuantity.toLocaleString()}</TableCell>
                <TableCell variant="inventory">{getStatusBadge(record.status)}</TableCell>
                <TableCell variant="inventory" className="text-muted-foreground">{record.receivedDate}</TableCell>
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
                        <EditModal<StockInRecord>
                          title="Edit Stock In"
                          description="Update stock in record"
                          fields={editStockInFields}
                          data={record}
                          onSubmit={(data) => dispatch({ type: "UPDATE_RECORD", payload: data as StockInRecord })}
                          triggerLabel="Edit"
                          triggerSize="sm"
                          submitLabel="Update Stock In"
                          size="lg"
                        />
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Eye className="h-4 w-4 mr-2" /> View
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

export default StockIn;
