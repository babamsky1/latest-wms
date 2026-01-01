import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableCellWide, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
import { useReducer, useState } from "react";
import AddModal, { AddField } from "../../components/modals/AddModal";
import EditModal, { EditField } from "../../components/modals/EditModal";


interface Transfer {
  [key: string]: unknown;
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
  | { type: "DELETE_TRANSFER"; payload: string }
  | { type: "ADD_TRANSFER"; payload: Transfer }
  | { type: "UPDATE_TRANSFER"; payload: Transfer };

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
    case "ADD_TRANSFER":
      return { ...state, transfers: [{ ...action.payload, status: "pending", completedDate: null }, ...state.transfers] };
    case "UPDATE_TRANSFER":
      return { ...state, transfers: state.transfers.map(t => t.id === action.payload.id ? action.payload : t) };
    default:
      return state;
  }
};

const Transfers = () => {
  const [state, dispatch] = useReducer(reducer, {
    transfers: initialTransfers,
    searchQuery: "",
  });
  const [addOpen, setAddOpen] = useState(false);

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

  const editTransferFields: EditField<Transfer>[] = [
    { label: "Reference No", name: "referenceNo", type: "text", disabled: true },
    { label: "From Location", name: "fromLocation", type: "text", required: true },
    { label: "To Location", name: "toLocation", type: "text", required: true },
    { label: "Item Count", name: "itemCount", type: "number", required: true },
    { label: "Total Quantity", name: "totalQuantity", type: "number", required: true },
    { label: "Initiated Date", name: "initiatedDate", type: "text", required: true },
    { label: "Initiated By", name: "initiatedBy", type: "text", required: false },
  ];

  const filteredTransfers = state.transfers.filter(
    t =>
      t.referenceNo.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
      t.fromLocation.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
      t.toLocation.toLowerCase().includes(state.searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Transfers</h1>
          <p className="page-description">Manage stock transfers between locations</p>
        </div>
      {/* Add Modal */}
      <AddModal<Transfer>
        title="New Transfer"
        description="Create a new stock transfer"
        fields={[
          { label: "Reference No", name: "referenceNo", type: "text", placeholder: "Auto-generated", disabled: true },
          { label: "From Location", name: "fromLocation", type: "text", placeholder: "e.g., Main Warehouse - A-01", required: true },
          { label: "To Location", name: "toLocation", type: "text", placeholder: "e.g., Secondary Warehouse - B-02", required: true },
          { label: "Item Count", name: "itemCount", type: "number", placeholder: "0", required: true },
          { label: "Total Quantity", name: "totalQuantity", type: "number", placeholder: "0", required: true },
          { label: "Initiated By", name: "initiatedBy", type: "text", placeholder: "Your name", required: true }
        ]}
        initialData={{ id: "", referenceNo: "", fromLocation: "", toLocation: "", itemCount: 0, totalQuantity: 0, status: "pending", initiatedDate: new Date().toISOString().split('T')[0], completedDate: null, initiatedBy: "" }}
        onSubmit={() => setAddOpen(false)}
        onOpenChange={setAddOpen}
        triggerLabel="New Transfer"
        submitLabel="Create Transfer"
      />
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
        <Table variant="inventory">
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

          <TableHeader variant="inventory">
            <TableRow variant="inventory" className="bg-muted/50">
              <TableHead variant="inventory">Reference No.</TableHead>
              <TableHead variant="inventory">From → To</TableHead>
              <TableHead variant="inventory">Items</TableHead>
              <TableHead variant="inventory">Total Qty</TableHead>
              <TableHead variant="inventory">Status</TableHead>
              <TableHead variant="inventory">Initiated</TableHead>
              <TableHead variant="inventory">Initiated By</TableHead>
              <TableHead variant="inventory">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody variant="inventory">
            {filteredTransfers.map(transfer => (
              <TableRow key={transfer.id} variant="inventory" className="hover:bg-muted/30">
                <TableCell variant="inventory" className="font-mono font-medium">{transfer.referenceNo}</TableCell>
                <TableCellWide variant="inventory">
                  <div className="flex items-center gap-2 text-sm">
                    <Badge variant="outline" className="font-normal">{transfer.fromLocation}</Badge>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    <Badge variant="outline" className="font-normal">{transfer.toLocation}</Badge>
                  </div>
                </TableCellWide>
                <TableCell variant="inventory">{transfer.itemCount}</TableCell>
                <TableCell variant="inventory" className="font-semibold">{transfer.totalQuantity.toLocaleString()}</TableCell>
                <TableCell variant="inventory">{getStatusBadge(transfer.status)}</TableCell>
                <TableCell variant="inventory" className="text-muted-foreground">{transfer.initiatedDate}</TableCell>
                <TableCell variant="inventory">{transfer.initiatedBy}</TableCell>
                <TableCell variant="inventory">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <EditModal<Transfer>
                          title="Edit Transfer"
                          description="Update transfer details"
                          fields={editTransferFields}
                          data={transfer}
                          onSubmit={(data) => dispatch({ type: "UPDATE_TRANSFER", payload: data as Transfer })}
                          triggerLabel="Edit"
                          triggerSize="sm"
                          submitLabel="Update Transfer"
                          size="lg"
                        />
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Eye className="h-4 w-4 mr-2" />View
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
