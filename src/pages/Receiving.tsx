import { Badge } from "@/components/ui/badge";
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

interface ReceivingRecord {
  id: string;
  poNumber: string;
  supplier: string;
  expectedDate: string;
  receivedDate: string | null;
  itemCount: number;
  expectedQty: number;
  receivedQty: number;
  status: "pending" | "receiving" | "completed" | "partial";
  dock: string;
}

type State = {
  records: ReceivingRecord[];
  searchQuery: string;
};

type Action =
  | { type: "SET_SEARCH"; payload: string }
  | { type: "DELETE_RECORD"; payload: string };

const initialRecords: ReceivingRecord[] = [
  { id: "1", poNumber: "PO-2024-001", supplier: "Tech Supplies Co.", expectedDate: "2024-01-15", receivedDate: "2024-01-15", itemCount: 5, expectedQty: 500, receivedQty: 500, status: "completed", dock: "Dock A" },
  { id: "2", poNumber: "PO-2024-002", supplier: "Global Parts Ltd.", expectedDate: "2024-01-16", receivedDate: null, itemCount: 12, expectedQty: 1200, receivedQty: 0, status: "pending", dock: "Dock B" },
  { id: "3", poNumber: "PO-2024-003", supplier: "Raw Materials Inc.", expectedDate: "2024-01-15", receivedDate: "2024-01-15", itemCount: 3, expectedQty: 2500, receivedQty: 2000, status: "partial", dock: "Dock A" },
  { id: "4", poNumber: "PO-2024-004", supplier: "Electronic World", expectedDate: "2024-01-16", receivedDate: null, itemCount: 8, expectedQty: 340, receivedQty: 150, status: "receiving", dock: "Dock C" },
  { id: "5", poNumber: "PO-2024-005", supplier: "Pack & Ship Co.", expectedDate: "2024-01-14", receivedDate: "2024-01-14", itemCount: 2, expectedQty: 5000, receivedQty: 5000, status: "completed", dock: "Dock B" },
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

const Receiving = () => {
  const [state, dispatch] = useReducer(reducer, {
    records: initialRecords,
    searchQuery: "",
  });

  const getStatusBadge = (status: ReceivingRecord["status"]) => {
    const config = {
      completed: { class: "status-active", icon: CheckCircle },
      pending: { class: "status-warning", icon: Clock },
      receiving: { class: "status-warning", icon: Package },
      partial: { class: "status-warning", icon: Package },
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
      r.poNumber.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
      r.supplier.toLowerCase().includes(state.searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title">Receiving</h1>
            <p className="page-description">Manage incoming deliveries and put-away operations</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Receiving
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-warning/10">
              <Clock className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="stat-label">Expected Today</p>
              <p className="stat-value">5</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Truck className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="stat-label">At Dock</p>
              <p className="stat-value">2</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success/10">
              <CheckCircle className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="stat-label">Completed Today</p>
              <p className="stat-value">8</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-destructive/10">
              <Package className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="stat-label">Pending Put-away</p>
              <p className="stat-value">12</p>
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
              placeholder="Search by PO or supplier..."
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
              <TableHead>PO Number</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead>Expected Date</TableHead>
              <TableHead>Dock</TableHead>
              <TableHead className="text-right">Items</TableHead>
              <TableHead className="text-right">Received / Expected</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRecords.map(record => (
              <TableRow key={record.id} className="hover:bg-muted/30">
                <TableCell className="font-mono font-medium">{record.poNumber}</TableCell>
                <TableCell>{record.supplier}</TableCell>
                <TableCell className="text-muted-foreground">{record.expectedDate}</TableCell>
                <TableCell>
                  <Badge variant="outline">{record.dock}</Badge>
                </TableCell>
                <TableCell className="text-right">{record.itemCount}</TableCell>
                <TableCell className="text-right">
                  <span className="font-semibold">{record.receivedQty.toLocaleString()}</span>
                  <span className="text-muted-foreground"> / {record.expectedQty.toLocaleString()}</span>
                </TableCell>
                <TableCell>{getStatusBadge(record.status)}</TableCell>
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

export default Receiving;
