
import { useState, useReducer } from "react";
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
import { Edit, Eye, MoreHorizontal, Plus, Search, Trash2, Settings } from "lucide-react";
import AddModal, { AddField } from "../../components/modals/AddModal";
import EditModal, { EditField } from "../../components/modals/EditModal";

interface AdjustmentRecord {
  id: string;
  date: string;
  ref: string;
  sku: string;
  name: string;
  type: "cycle-count" | "correction" | "damaged" | "shrinkage";
  qty: number;
  reason: string;
  user: string;
}

type State = {
  records: AdjustmentRecord[];
  searchQuery: string;
};

type Action =
  | { type: "SET_SEARCH"; payload: string }
  | { type: "DELETE_RECORD"; payload: string }
  | { type: "ADD_RECORD"; payload: AdjustmentRecord }
  | { type: "UPDATE_RECORD"; payload: AdjustmentRecord };

const initialRecords: AdjustmentRecord[] = [
  { id: "1", date: "2025-12-31", ref: "ADJ-001", sku: "SKU123", name: "Widget A", type: "cycle-count", qty: 10, reason: "Counted", user: "admin" },
  { id: "2", date: "2025-12-30", ref: "ADJ-002", sku: "SKU456", name: "Widget B", type: "correction", qty: -5, reason: "System Error", user: "manager" },
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

export default function Adjustments() {
  const [state, dispatch] = useReducer(reducer, {
    records: initialRecords,
    searchQuery: "",
  });

  const getTypeBadge = (type: AdjustmentRecord["type"]) => {
    const config = {
      "cycle-count": "bg-blue-100 text-blue-800",
      "correction": "bg-yellow-100 text-yellow-800",
      "damaged": "bg-red-100 text-red-800",
      "shrinkage": "bg-orange-100 text-orange-800",
    };
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config[type]}`}>
        {type.replace("-", " ")}
      </span>
    );
  };

  const editAdjustmentFields: EditField<AdjustmentRecord>[] = [
    { label: "Reference", name: "ref", type: "text", disabled: true },
    { label: "Date", name: "date", type: "text", required: true },
    { label: "SKU", name: "sku", type: "text", required: true },
    { label: "Product Name", name: "name", type: "text", required: true },
    { label: "Type", name: "type", type: "select", required: true, options: [
      { value: "cycle-count", label: "Cycle Count" },
      { value: "correction", label: "Correction" },
      { value: "damaged", label: "Damaged" },
      { value: "shrinkage", label: "Shrinkage" }
    ]},
    { label: "Quantity", name: "qty", type: "number", required: true },
    { label: "Reason", name: "reason", type: "textarea", required: false },
    { label: "User", name: "user", type: "text", required: false },
  ];

  const filteredRecords = state.records.filter(
    r =>
      r.ref.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
      r.sku.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
      r.name.toLowerCase().includes(state.searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title">Inventory Adjustments</h1>
            <p className="page-description">Manage stock adjustments and inventory corrections</p>
          </div>
          <AddModal<AdjustmentRecord>
            title="New Adjustment"
            description="Create a new inventory adjustment record"
            fields={[
              { label: "Date", name: "date", type: "text", required: true, placeholder: "YYYY-MM-DD" },
              { label: "SKU", name: "sku", type: "text", required: true, placeholder: "e.g. SKU123" },
              { label: "Product Name", name: "name", type: "text", required: true },
              { label: "Type", name: "type", type: "select", required: true, options: [
                { value: "cycle-count", label: "Cycle Count" },
                { value: "correction", label: "Correction" },
                { value: "damaged", label: "Damaged" },
                { value: "shrinkage", label: "Shrinkage" }
              ]},
              { label: "Quantity", name: "qty", type: "number", required: true },
              { label: "Reason", name: "reason", type: "textarea", required: false },
            ]}
            onSubmit={(data) => dispatch({ 
              type: "ADD_RECORD", 
              payload: { 
                ...data, 
                id: crypto.randomUUID(), 
                ref: `ADJ-${String(state.records.length + 1).padStart(3, '0')}`,
                user: "admin"
              } as AdjustmentRecord 
            })}
            triggerLabel="New Adjustment"
            submitLabel="Create Adjustment"
            size="lg"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Settings className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="stat-label">Today's Adjustments</p>
              <p className="stat-value">{filteredRecords.length}</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-warning/10">
              <Settings className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="stat-label">Total Adjustments</p>
              <p className="stat-value">{state.records.length}</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success/10">
              <Settings className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="stat-label">Items Adjusted</p>
              <p className="stat-value">{state.records.length}</p>
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
              placeholder="Search by reference, SKU or name..."
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
              <TableHead>Date</TableHead>
              <TableHead>Reference</TableHead>
              <TableHead>Item SKU</TableHead>
              <TableHead>Item Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>User</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRecords.map(record => (
              <TableRow key={record.id} className="hover:bg-muted/30">
                <TableCell className="text-muted-foreground">{record.date}</TableCell>
                <TableCell className="font-mono font-medium">{record.ref}</TableCell>
                <TableCell className="font-mono">{record.sku}</TableCell>
                <TableCell>{record.name}</TableCell>
                <TableCell>{getTypeBadge(record.type)}</TableCell>
                <TableCell className="text-left font-semibold">{record.qty > 0 ? "+" : ""}{record.qty}</TableCell>
                <TableCell>{record.reason}</TableCell>
                <TableCell className="text-muted-foreground">{record.user}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <EditModal<AdjustmentRecord>
                          title="Edit Adjustment"
                          description="Update adjustment record"
                          fields={editAdjustmentFields}
                          data={record}
                          onSubmit={(data) => dispatch({ type: "UPDATE_RECORD", payload: data as AdjustmentRecord })}
                          triggerLabel="Edit"
                          triggerSize="sm"
                          submitLabel="Update Adjustment"
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
