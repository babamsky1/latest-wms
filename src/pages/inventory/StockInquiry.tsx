

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
import { Edit, Eye, MoreHorizontal, Plus, Search, Trash2, Search as SearchIcon } from "lucide-react";
import AddModal, { AddField } from "../../components/modals/AddModal";
import EditModal, { EditField } from "../../components/modals/EditModal";

interface StockRecord {
  id: string;
  sku: string;
  name: string;
  location: string;
  onHand: number;
  allocated: number;
  available: number;
  unit: string;
  [key: string]: string | number; // Index signature to satisfy Record<string, unknown>
}

type State = {
  records: StockRecord[];
  searchQuery: string;
};

type Action =
  | { type: "SET_SEARCH"; payload: string }
  | { type: "DELETE_RECORD"; payload: string }
  | { type: "ADD_RECORD"; payload: StockRecord }
  | { type: "UPDATE_RECORD"; payload: StockRecord };

const initialRecords: StockRecord[] = [
  { id: "1", sku: "SKU123", name: "Widget A", location: "A1", onHand: 100, allocated: 20, available: 80, unit: "pcs" },
  { id: "2", sku: "SKU456", name: "Widget B", location: "B2", onHand: 250, allocated: 50, available: 200, unit: "pcs" },
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

export default function StockInquiry() {
  const [state, dispatch] = useReducer(reducer, {
    records: initialRecords,
    searchQuery: "",
  });

  const filteredRecords = state.records.filter(
    r =>
      r.sku.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
      r.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
      r.location.toLowerCase().includes(state.searchQuery.toLowerCase())
  );

  const editStockFields: EditField<StockRecord>[] = [
    { label: "SKU", name: "sku", type: "text", disabled: true },
    { label: "Product Name", name: "name", type: "text", required: true },
    { label: "Location", name: "location", type: "text", required: true },
    { label: "On Hand", name: "onHand", type: "number", required: true },
    { label: "Allocated", name: "allocated", type: "number", required: false },
    { label: "Available", name: "available", type: "number", required: false },
    { label: "Unit", name: "unit", type: "text", required: false },
  ];

  const totalOnHand = state.records.reduce((sum, r) => sum + r.onHand, 0);
  const totalAllocated = state.records.reduce((sum, r) => sum + r.allocated, 0);
  const totalAvailable = state.records.reduce((sum, r) => sum + r.available, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title">Stock Inquiry</h1>
            <p className="page-description">View current stock levels and availability</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Inquiry
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <SearchIcon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="stat-label">Total On Hand</p>
              <p className="stat-value">{totalOnHand.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-warning/10">
              <SearchIcon className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="stat-label">Total Allocated</p>
              <p className="stat-value">{totalAllocated.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success/10">
              <SearchIcon className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="stat-label">Total Available</p>
              <p className="stat-value">{totalAvailable.toLocaleString()}</p>
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
              <TableHead>On Hand</TableHead>
              <TableHead>Allocated</TableHead>
              <TableHead>Available</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRecords.map(record => (
              <TableRow key={record.id} className="hover:bg-muted/30">
                <TableCell className="font-mono font-medium">{record.sku}</TableCell>
                <TableCell>{record.name}</TableCell>
                <TableCell className="font-mono">{record.location}</TableCell>
                <TableCell className="text-left font-semibold">{record.onHand.toLocaleString()}</TableCell>
                <TableCell className="text-left text-warning">{record.allocated.toLocaleString()}</TableCell>
                <TableCell className="text-left text-success">{record.available.toLocaleString()}</TableCell>
                <TableCell>{record.unit}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <EditModal<StockRecord>
                          title="Edit Stock"
                          description="Update stock record"
                          fields={editStockFields}
                          data={record}
                          onSubmit={(data) => dispatch({ type: "UPDATE_RECORD", payload: data as StockRecord })}
                          triggerLabel="Edit"
                          triggerSize="sm"
                          submitLabel="Update Stock"
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
