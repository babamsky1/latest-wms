
import { useReducer } from "react";
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
import { Edit, Eye, MoreHorizontal, Plus, Search, Trash2, AlertTriangle } from "lucide-react";
import AddModal, { AddField } from "../../components/modals/AddModal";
import EditModal, { EditField } from "../../components/modals/EditModal";

interface BufferRecord {
  id: string;
  sku: string;
  name: string;
  location: string;
  buffer: number;
  onHand: number;
  status: "below" | "above" | "safe";
  lastUpdated: string;
  [key: string]: unknown;
}

type State = {
  records: BufferRecord[];
  searchQuery: string;
};

type Action =
  | { type: "SET_SEARCH"; payload: string }
  | { type: "DELETE_RECORD"; payload: string }
  | { type: "ADD_RECORD"; payload: BufferRecord }
  | { type: "UPDATE_RECORD"; payload: BufferRecord };

const initialRecords: BufferRecord[] = [
  { id: "1", sku: "SKU123", name: "Widget A", location: "A1", buffer: 20, onHand: 18, status: "below", lastUpdated: "2025-12-30" },
  { id: "2", sku: "SKU456", name: "Widget B", location: "B2", buffer: 50, onHand: 75, status: "above", lastUpdated: "2025-12-31" },
];

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_SEARCH":
      return { ...state, searchQuery: action.payload };
    case "DELETE_RECORD":
      return { ...state, records: state.records.filter(r => r.id !== action.payload) };
    case "ADD_RECORD":
      return { ...state, records: [action.payload, ...state.records] };
    case "UPDATE_RECORD":
      return { ...state, records: state.records.map(r => r.id === action.payload.id ? action.payload : r) };
    default:
      return state;
  }
};

export default function StockBuffering() {
  const [state, dispatch] = useReducer(reducer, {
    records: initialRecords,
    searchQuery: "",
  });

  const getStatusBadge = (status: BufferRecord["status"]) => {
    const config = {
      below: { class: "status-warning", text: "Below Buffer" },
      safe: { class: "status-active", text: "Safe Stock" },
      above: { class: "status-success", text: "Above Buffer" },
    };
    const { class: className, text } = config[status];
    return (
      <span className={`status-badge ${className}`}>
        {text}
      </span>
    );
  };

  const editBufferFields: EditField<BufferRecord>[] = [
    { label: "SKU", name: "sku", type: "text", disabled: true },
    { label: "Product Name", name: "name", type: "text", required: true },
    { label: "Location", name: "location", type: "text", required: true },
    { label: "Buffer Level", name: "buffer", type: "number", required: true },
    { label: "On Hand", name: "onHand", type: "number", required: true },
    { label: "Last Updated", name: "lastUpdated", type: "text", required: false },
  ];

  const filteredRecords = state.records.filter(
    r =>
      r.sku.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
      r.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
      r.location.toLowerCase().includes(state.searchQuery.toLowerCase())
  );

  const belowBufferCount = state.records.filter(r => r.status === "below").length;
  const totalBufferItems = state.records.length;
  const avgBufferUtilization = Math.round(
    (state.records.reduce((sum, r) => sum + (r.onHand / r.buffer), 0) / state.records.length) * 100
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title">Stock Buffering</h1>
            <p className="page-description">Monitor inventory buffer levels and stock safety</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Buffer
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="stat-label">Below Buffer</p>
              <p className="stat-value">{belowBufferCount}</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <AlertTriangle className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="stat-label">Total Buffered Items</p>
              <p className="stat-value">{totalBufferItems}</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success/10">
              <AlertTriangle className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="stat-label">Avg Buffer Utilization</p>
              <p className="stat-value">{avgBufferUtilization}%</p>
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
              placeholder="Search by SKU, name or location..."
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
              <TableHead>Item SKU</TableHead>
              <TableHead>Item Name</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Buffer Level</TableHead>
              <TableHead>On Hand</TableHead>
              <TableHead>Buffer Status</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRecords.map(record => (
              <TableRow key={record.id} className="hover:bg-muted/30">
                <TableCell className="font-mono font-medium">{record.sku}</TableCell>
                <TableCell>{record.name}</TableCell>
                <TableCell className="font-mono">{record.location}</TableCell>
                <TableCell className="text-left font-semibold">{record.buffer}</TableCell>
                <TableCell className="text-left font-semibold">{record.onHand}</TableCell>
                <TableCell>{getStatusBadge(record.status)}</TableCell>
                <TableCell className="text-muted-foreground">{record.lastUpdated}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <EditModal<BufferRecord>
                          title="Edit Buffer Setting"
                          description="Update buffer record"
                          fields={editBufferFields}
                          data={record}
                          onSubmit={(data) => dispatch({ type: "UPDATE_RECORD", payload: data as BufferRecord })}
                          triggerLabel="Edit"
                          triggerSize="sm"
                          submitLabel="Update Buffer"
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
}
