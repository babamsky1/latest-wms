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
import { CheckCircle, Clock, Edit, Eye, MoreHorizontal, Package, Plus, Search, Trash2, Truck } from "lucide-react";
import { useReducer } from "react";

interface OrderRecord {
  id: string;
  orderNo: string;
  customer: string;
  itemCount: number;
  totalQuantity: number;
  status: "pending" | "processed" | "shipped";
  orderDate: string;
  handledBy: string;
}

type State = {
  records: OrderRecord[];
  searchQuery: string;
};

type Action =
  | { type: "SET_SEARCH"; payload: string }
  | { type: "DELETE_RECORD"; payload: string };

const initialRecords: OrderRecord[] = [
  { id: "1", orderNo: "ORD-5001", customer: "Customer A", itemCount: 3, totalQuantity: 150, status: "shipped", orderDate: "2024-01-15", handledBy: "John Smith" },
  { id: "2", orderNo: "ORD-5002", customer: "Customer B", itemCount: 8, totalQuantity: 420, status: "processed", orderDate: "2024-01-15", handledBy: "Jane Doe" },
  { id: "3", orderNo: "ORD-5003", customer: "Customer C", itemCount: 15, totalQuantity: 2300, status: "pending", orderDate: "2024-01-16", handledBy: "-" },
  { id: "4", orderNo: "ORD-5004", customer: "Customer D", itemCount: 5, totalQuantity: 800, status: "shipped", orderDate: "2024-01-16", handledBy: "Mike Johnson" },
  { id: "5", orderNo: "ORD-5005", customer: "Customer E", itemCount: 2, totalQuantity: 50, status: "processed", orderDate: "2024-01-14", handledBy: "Sarah Wilson" },
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

const Orders = () => {
  const [state, dispatch] = useReducer(reducer, {
    records: initialRecords,
    searchQuery: "",
  });

  const getStatusBadge = (status: OrderRecord["status"]) => {
    const config = {
      shipped: { class: "status-active", icon: Truck },
      processed: { class: "status-success", icon: CheckCircle },
      pending: { class: "status-warning", icon: Clock },
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
      r.orderNo.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
      r.customer.toLowerCase().includes(state.searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title">Orders</h1>
            <p className="page-description">Manage customer orders and their statuses</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Order
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
              <p className="stat-label">Today's Orders</p>
              <p className="stat-value">75</p>
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
              <p className="stat-value">10</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success/10">
              <CheckCircle className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="stat-label">Processed / Shipped</p>
              <p className="stat-value">65</p>
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
              placeholder="Search by order number or customer..."
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
              <TableHead>Order No.</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total Qty</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Order Date</TableHead>
              <TableHead>Handled By</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRecords.map(record => (
              <TableRow key={record.id} className="hover:bg-muted/30">
                <TableCell className="font-mono font-medium">{record.orderNo}</TableCell>
                <TableCell>{record.customer}</TableCell>
                <TableCell className="text-left">{record.itemCount}</TableCell>
                <TableCell className="text-left font-semibold">{record.totalQuantity.toLocaleString()}</TableCell>
                <TableCell>{getStatusBadge(record.status)}</TableCell>
                <TableCell className="text-muted-foreground">{record.orderDate}</TableCell>
                <TableCell>{record.handledBy}</TableCell>
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

export default Orders;
