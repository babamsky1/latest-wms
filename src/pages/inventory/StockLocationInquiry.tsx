
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
import { Edit, Eye, MoreHorizontal, Plus, Search, Trash2, MapPin } from "lucide-react";
import AddModal, { AddField } from "../../components/modals/AddModal";
import EditModal, { EditField } from "../../components/modals/EditModal";

interface LocationRecord {
  id: string;
  location: string;
  sku: string;
  name: string;
  batch: string;
  onHand: number;
  reserved: number;
  lastMove: string;
  [key: string]: unknown;
}

type State = {
  records: LocationRecord[];
  searchQuery: string;
};

type Action =
  | { type: "SET_SEARCH"; payload: string }
  | { type: "DELETE_RECORD"; payload: string }
  | { type: "ADD_RECORD"; payload: LocationRecord }
  | { type: "UPDATE_RECORD"; payload: LocationRecord };

const initialRecords: LocationRecord[] = [
  { id: "1", location: "A1", sku: "SKU123", name: "Widget A", batch: "BATCH1", onHand: 50, reserved: 10, lastMove: "2025-12-30" },
  { id: "2", location: "B2", sku: "SKU456", name: "Widget B", batch: "BATCH2", onHand: 75, reserved: 15, lastMove: "2025-12-31" },
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

export default function StockLocationInquiry() {
  const [state, dispatch] = useReducer(reducer, {
    records: initialRecords,
    searchQuery: "",
  });

  const filteredRecords = state.records.filter(
    r =>
      r.location.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
      r.sku.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
      r.name.toLowerCase().includes(state.searchQuery.toLowerCase())
  );

  const editLocationFields: EditField<LocationRecord>[] = [
    { label: "Location", name: "location", type: "text", required: true },
    { label: "SKU", name: "sku", type: "text", required: true },
    { label: "Product Name", name: "name", type: "text", required: true },
    { label: "Batch", name: "batch", type: "text", required: false },
    { label: "On Hand", name: "onHand", type: "number", required: true },
    { label: "Reserved", name: "reserved", type: "number", required: false },
    { label: "Last Move", name: "lastMove", type: "text", required: false },
  ];

  const totalLocations = state.records.length;
  const totalOnHand = state.records.reduce((sum, r) => sum + r.onHand, 0);
  const totalReserved = state.records.reduce((sum, r) => sum + r.reserved, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title">Stock Location Inquiry</h1>
            <p className="page-description">Track inventory by location and batch</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Location
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="stat-label">Locations</p>
              <p className="stat-value">{totalLocations}</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success/10">
              <MapPin className="h-5 w-5 text-success" />
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
              <MapPin className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="stat-label">Total Reserved</p>
              <p className="stat-value">{totalReserved.toLocaleString()}</p>
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
              placeholder="Search by location, SKU or name..."
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
              <TableHead>Location</TableHead>
              <TableHead>Item SKU</TableHead>
              <TableHead>Item Name</TableHead>
              <TableHead>Batch / Lot</TableHead>
              <TableHead>On Hand</TableHead>
              <TableHead>Reserved</TableHead>
              <TableHead>Last Movement Date</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRecords.map(record => (
              <TableRow key={record.id} className="hover:bg-muted/30">
                <TableCell className="font-mono font-medium">{record.location}</TableCell>
                <TableCell className="font-mono">{record.sku}</TableCell>
                <TableCell>{record.name}</TableCell>
                <TableCell className="font-mono text-muted-foreground">{record.batch}</TableCell>
                <TableCell className="text-left font-semibold">{record.onHand.toLocaleString()}</TableCell>
                <TableCell className="text-left text-warning">{record.reserved.toLocaleString()}</TableCell>
                <TableCell className="text-muted-foreground">{record.lastMove}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <EditModal<LocationRecord>
                          title="Edit Stock Location"
                          description="Update location record"
                          fields={editLocationFields}
                          data={record}
                          onSubmit={(data) => dispatch({ type: "UPDATE_RECORD", payload: data as LocationRecord })}
                          triggerLabel="Edit"
                          triggerSize="sm"
                          submitLabel="Update Location"
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
