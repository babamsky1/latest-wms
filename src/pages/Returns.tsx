import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckCircle, Clock, Edit, Eye, MoreHorizontal, Package, Plus, Search, Trash2 } from "lucide-react";
import { useReducer } from "react";

interface ReturnRecord {
  id: string;
  referenceNo: string;
  customer: string;
  orderRef: string;
  itemCount: number;
  totalQuantity: number;
  status: "pending" | "processed" | "approved";
  returnDate: string;
  processedBy: string;
}

type State = {
  records: ReturnRecord[];
  searchQuery: string;
};

type Action =
  | { type: "SET_SEARCH"; payload: string }
  | { type: "DELETE_RECORD"; payload: string };

const initialRecords: ReturnRecord[] = [
  { id: "1", referenceNo: "RT-2024-001", customer: "Customer A", orderRef: "ORD-5001", itemCount: 2, totalQuantity: 100, status: "processed", returnDate: "2024-01-15", processedBy: "John Smith" },
  { id: "2", referenceNo: "RT-2024-002", customer: "Customer B", orderRef: "ORD-5002", itemCount: 1, totalQuantity: 50, status: "pending", returnDate: "2024-01-16", processedBy: "-" },
  { id: "3", referenceNo: "RT-2024-003", customer: "Customer C", orderRef: "ORD-5003", itemCount: 5, totalQuantity: 300, status: "approved", returnDate: "2024-01-14", processedBy: "Jane Doe" },
];

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_SEARCH":
      return { ...state, searchQuery: action.payload };
    case "DELETE_RECORD":
      return { ...state, records: state.records.filter(r => r.id !== action.payload) };
    default:
      return state;
  }
};

const Returns = () => {
  const [state, dispatch] = useReducer(reducer, {
    records: initialRecords,
    searchQuery: "",
  });

  const getStatusBadge = (status: ReturnRecord["status"]) => {
    const config = {
      processed: { class: "status-active", icon: CheckCircle },
      pending: { class: "status-warning", icon: Clock },
      approved: { class: "status-success", icon: CheckCircle },
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
    r =>
      r.referenceNo.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
      r.customer.toLowerCase().includes(state.searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title">Returns</h1>
            <p className="page-description">Manage returned items and customer returns</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Return
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Package className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="stat-label">Today's Returns</p>
              <p className="stat-value">50</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-warning/10">
              <Clock className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="stat-label">Pending</p>
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
              <p className="stat-label">Approved</p>
              <p className="stat-value">45</p>
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
              placeholder="Search by reference or customer..."
              value={state.searchQuery}
              onChange={(e) => dispatch({ type: "SET_SEARCH", payload: e.target.value })}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Reference No.</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Order Ref</TableHead>
              <TableHead className="text-right">Items</TableHead>
              <TableHead className="text-right">Total Qty</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Return Date</TableHead>
              <TableHead>Processed By</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRecords.map(record => (
              <TableRow key={record.id} className="hover:bg-muted/30">
                <TableCell className="font-mono font-medium">{record.referenceNo}</TableCell>
                <TableCell>{record.customer}</TableCell>
                <TableCell className="font-mono text-sm">{record.orderRef}</TableCell>
                <TableCell className="text-right">{record.itemCount}</TableCell>
                <TableCell className="text-right font-semibold">{record.totalQuantity.toLocaleString()}</TableCell>
                <TableCell>{getStatusBadge(record.status)}</TableCell>
                <TableCell className="text-muted-foreground">{record.returnDate}</TableCell>
                <TableCell>{record.processedBy}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="h-4 w-4 mr-2" /> View
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => dispatch({ type: "DELETE_RECORD", payload: record.id })}
                      >
                        <Trash2 className="h-4 w-4 mr-2" /> Delete
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

export default Returns;
