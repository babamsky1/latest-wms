import { useReducer } from "react";
import { PackageMinus, Plus, Search, Eye, CheckCircle, Clock, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
}

type State = {
  records: StockOutRecord[];
  searchQuery: string;
};

type Action = { type: "SET_SEARCH"; payload: string };

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
    default:
      return state;
  }
};

const StockOut = () => {
  const [state, dispatch] = useReducer(reducer, {
    records: initialRecords,
    searchQuery: "",
  });

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

  const filteredRecords = state.records.filter(
    (r) =>
      r.referenceNo.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
      r.destination.toLowerCase().includes(state.searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title">Stock Out</h1>
            <p className="page-description">Manage outbound inventory and dispatches</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Stock Out
          </Button>
        </div>
      </div>

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

      <div className="table-container">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Reference No.</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead>Order Ref</TableHead>
              <TableHead className="text-right">Items</TableHead>
              <TableHead className="text-right">Total Qty</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Dispatch Date</TableHead>
              <TableHead>Processed By</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRecords.map((record) => (
              <TableRow key={record.id} className="hover:bg-muted/30">
                <TableCell className="font-mono font-medium">{record.referenceNo}</TableCell>
                <TableCell>{record.destination}</TableCell>
                <TableCell className="font-mono text-sm">{record.orderRef}</TableCell>
                <TableCell className="text-right">{record.itemCount}</TableCell>
                <TableCell className="text-right font-semibold">{record.totalQuantity.toLocaleString()}</TableCell>
                <TableCell>{getStatusBadge(record.status)}</TableCell>
                <TableCell className="text-muted-foreground">{record.dispatchDate}</TableCell>
                <TableCell>{record.processedBy}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon">
                    <Eye className="h-4 w-4" />
                  </Button>
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
