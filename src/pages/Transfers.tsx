import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableCellWide,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowRight,
  ArrowRightLeft,
  CheckCircle,
  Clock,
  Edit,
  Eye,
  MoreHorizontal,
  Plus,
  Search,
  Trash2
} from "lucide-react";
import { useReducer } from "react";

interface Transfer {
  id: string;
  referenceNo: string;
  fromLocation: string;
  toLocation: string;
  itemCount: number;
  totalQuantity: number;
  status: "pending" | "in-transit" | "completed";
  initiatedDate: string;
  completedDate: string | null;
  initiatedBy: string;
}

type State = {
  transfers: Transfer[];
  searchQuery: string;
};

type Action =
  | { type: "SET_SEARCH"; payload: string }
  | { type: "DELETE_TRANSFER"; payload: string };

const initialTransfers: Transfer[] = [
  { id: "1", referenceNo: "TRF-2024-001", fromLocation: "Main Warehouse - A-01", toLocation: "Secondary Warehouse - B-02", itemCount: 5, totalQuantity: 500, status: "completed", initiatedDate: "2024-01-14", completedDate: "2024-01-15", initiatedBy: "John Smith" },
  { id: "2", referenceNo: "TRF-2024-002", fromLocation: "Zone A - Rack 3", toLocation: "Zone B - Rack 1", itemCount: 12, totalQuantity: 240, status: "in-transit", initiatedDate: "2024-01-15", completedDate: null, initiatedBy: "Jane Doe" },
  { id: "3", referenceNo: "TRF-2024-003", fromLocation: "Secondary Warehouse - C-01", toLocation: "Main Warehouse - D-02", itemCount: 8, totalQuantity: 1600, status: "pending", initiatedDate: "2024-01-16", completedDate: null, initiatedBy: "Mike Johnson" },
  { id: "4", referenceNo: "TRF-2024-004", fromLocation: "Main Warehouse - E-03", toLocation: "Outlet Store", itemCount: 3, totalQuantity: 75, status: "completed", initiatedDate: "2024-01-13", completedDate: "2024-01-13", initiatedBy: "Sarah Wilson" },
];

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_SEARCH":
      return { ...state, searchQuery: action.payload };
    case "DELETE_TRANSFER":
      return { ...state, transfers: state.transfers.filter(t => t.id !== action.payload) };
    default:
      return state;
  }
};

const Transfers = () => {
  const [state, dispatch] = useReducer(reducer, {
    transfers: initialTransfers,
    searchQuery: "",
  });

  const getStatusBadge = (status: Transfer["status"]) => {
    const config = {
      completed: { class: "status-active", icon: CheckCircle },
      pending: { class: "status-warning", icon: Clock },
      "in-transit": { class: "status-warning", icon: ArrowRightLeft },
    };
    const { class: className, icon: Icon } = config[status];
    return (
      <span className={`status-badge ${className}`}>
        <Icon className="h-3 w-3 mr-1" />
        {status}
      </span>
    );
  };

  const filteredTransfers = state.transfers.filter(
    t =>
      t.referenceNo.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
      t.fromLocation.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
      t.toLocation.toLowerCase().includes(state.searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title">Transfers</h1>
            <p className="page-description">Manage stock transfers between locations</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Transfer
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="content-section">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search transfers..."
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
          {/* Colgroup for fixed widths */}
          <colgroup>
            <col className="w-24" /> {/* Reference No */}
            <col className="w-[300px]" /> {/* From → To wide column */}
            <col className="w-20" /> {/* Items */}
            <col className="w-20" /> {/* Total Qty */}
            <col className="w-32" /> {/* Status */}
            <col className="w-24" /> {/* Initiated */}
            <col className="w-32" /> {/* Initiated By */}
            <col className="w-20" /> {/* Actions */}
          </colgroup>

          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Reference No.</TableHead>
              <TableHead>From → To</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total Qty</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Initiated</TableHead>
              <TableHead>Initiated By</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredTransfers.map(transfer => (
              <TableRow key={transfer.id} className="hover:bg-muted/30">
                <TableCell className="font-mono font-medium">{transfer.referenceNo}</TableCell>
                <TableCellWide>
                  <div className="flex items-center gap-2 text-sm">
                    <Badge variant="outline" className="font-normal">{transfer.fromLocation}</Badge>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    <Badge variant="outline" className="font-normal">{transfer.toLocation}</Badge>
                  </div>
                </TableCellWide>
                <TableCell>{transfer.itemCount}</TableCell>
                <TableCell className="font-semibold">{transfer.totalQuantity.toLocaleString()}</TableCell>
                <TableCell>{getStatusBadge(transfer.status)}</TableCell>
                <TableCell className="text-muted-foreground">{transfer.initiatedDate}</TableCell>
                <TableCell>{transfer.initiatedBy}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="h-4 w-4 mr-2" />View
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => dispatch({ type: "DELETE_TRANSFER", payload: transfer.id })}
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

export default Transfers;
