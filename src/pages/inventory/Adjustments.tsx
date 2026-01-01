import { useReducer } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTable, ColumnDef } from "@/components/table/DataTable";
import { Edit, Eye, MoreHorizontal, Trash2, Settings } from "lucide-react";
import AddModal from "@/components/modals/AddModal";
import EditModal, { EditField } from "@/components/modals/EditModal";
import { format } from "date-fns";

interface AdjustmentRecord {
  id: string;
  referenceNo: string;
  adjDate: string;
  sourceRefNo: string;
  category: string;
  warehouse: string;
  status: "draft" | "pending" | "approved" | "rejected";
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
  [key: string]: unknown;
}

type State = {
  records: AdjustmentRecord[];
};

type Action =
  | { type: "DELETE_RECORD"; payload: string }
  | { type: "ADD_RECORD"; payload: AdjustmentRecord }
  | { type: "UPDATE_RECORD"; payload: AdjustmentRecord };

const warehouseOptions = [
  { value: "main", label: "Main Warehouse" },
  { value: "secondary", label: "Secondary Warehouse" },
  { value: "outlet", label: "Outlet Store" },
];

const categoryOptions = [
  { value: "electronics", label: "Electronics" },
  { value: "furniture", label: "Furniture" },
  { value: "clothing", label: "Clothing" },
  { value: "food", label: "Food & Beverage" },
];

const statusOptions = [
  { value: "draft", label: "Draft" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

const initialRecords: AdjustmentRecord[] = [
  { id: "1", referenceNo: "ADJ-2025-001", adjDate: "2025-12-31", sourceRefNo: "PO-2025-100", category: "electronics", warehouse: "main", status: "approved", createdBy: "admin", createdAt: "2025-12-30 09:00", updatedBy: "manager", updatedAt: "2025-12-31 10:00" },
  { id: "2", referenceNo: "ADJ-2025-002", adjDate: "2025-12-30", sourceRefNo: "SO-2025-050", category: "furniture", warehouse: "secondary", status: "pending", createdBy: "warehouse_user", createdAt: "2025-12-29 14:00", updatedBy: "warehouse_user", updatedAt: "2025-12-30 08:00" },
  { id: "3", referenceNo: "ADJ-2025-003", adjDate: "2025-12-29", sourceRefNo: "RET-2025-010", category: "clothing", warehouse: "outlet", status: "draft", createdBy: "staff", createdAt: "2025-12-28 11:00", updatedBy: "staff", updatedAt: "2025-12-29 15:00" },
];

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
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
  const [state, dispatch] = useReducer(reducer, { records: initialRecords });

  const getStatusBadge = (status: AdjustmentRecord["status"]) => {
    const config = {
      draft: "bg-muted text-muted-foreground",
      pending: "bg-warning/20 text-warning",
      approved: "bg-success/20 text-success",
      rejected: "bg-destructive/20 text-destructive",
    };
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const editFields: EditField<AdjustmentRecord>[] = [
    { label: "Reference No", name: "referenceNo", type: "text", disabled: true },
    { label: "Adjustment Date", name: "adjDate", type: "text", required: true },
    { label: "Source Ref #", name: "sourceRefNo", type: "text", required: false },
    { label: "Category", name: "category", type: "select", required: true, options: categoryOptions },
    { label: "Warehouse", name: "warehouse", type: "select", required: true, options: warehouseOptions },
    { label: "Status", name: "status", type: "select", required: true, options: statusOptions },
  ];

  const columns: ColumnDef<AdjustmentRecord>[] = [
    { key: "referenceNo", label: "Reference No", sortable: true, filterable: true, className: "font-mono font-medium" },
    { key: "adjDate", label: "Adj Date", sortable: true, filterable: true },
    { key: "sourceRefNo", label: "Source Ref #", sortable: true, filterable: true, className: "font-mono" },
    { 
      key: "category", 
      label: "Category", 
      sortable: true, 
      filterable: true, 
      filterType: "select",
      filterOptions: categoryOptions,
      render: (row) => categoryOptions.find(c => c.value === row.category)?.label || row.category
    },
    { 
      key: "warehouse", 
      label: "Warehouse", 
      sortable: true, 
      filterable: true,
      filterType: "select",
      filterOptions: warehouseOptions,
      render: (row) => warehouseOptions.find(w => w.value === row.warehouse)?.label || row.warehouse
    },
    { 
      key: "status", 
      label: "Status", 
      sortable: true, 
      filterable: true,
      filterType: "select",
      filterOptions: statusOptions,
      render: (row) => getStatusBadge(row.status)
    },
    { key: "createdBy", label: "Created By", sortable: true, filterable: true },
    { key: "createdAt", label: "Created At", sortable: true, className: "text-muted-foreground text-sm" },
    { key: "updatedBy", label: "Updated By", sortable: true, filterable: true },
    { key: "updatedAt", label: "Updated At", sortable: true, className: "text-muted-foreground text-sm" },
  ];

  const renderActions = (record: AdjustmentRecord) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-popover">
        <DropdownMenuItem asChild>
          <EditModal<AdjustmentRecord>
            title="Edit Adjustment"
            description="Update adjustment record"
            fields={editFields}
            data={record}
            onSubmit={(data) => dispatch({ type: "UPDATE_RECORD", payload: { ...data, updatedAt: format(new Date(), "yyyy-MM-dd HH:mm"), updatedBy: "admin" } as AdjustmentRecord })}
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
  );

  return (
    <div className="space-y-6">
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
              { label: "Adjustment Date", name: "adjDate", type: "text", required: true, placeholder: "YYYY-MM-DD" },
              { label: "Source Ref #", name: "sourceRefNo", type: "text", required: false, placeholder: "e.g. PO-2025-100" },
              { label: "Category", name: "category", type: "select", required: true, options: categoryOptions },
              { label: "Warehouse", name: "warehouse", type: "select", required: true, options: warehouseOptions },
              { label: "Status", name: "status", type: "select", required: true, options: statusOptions },
            ]}
            onSubmit={(data) => {
              const now = format(new Date(), "yyyy-MM-dd HH:mm");
              dispatch({ 
                type: "ADD_RECORD", 
                payload: { 
                  ...data, 
                  id: crypto.randomUUID(), 
                  referenceNo: `ADJ-${new Date().getFullYear()}-${String(state.records.length + 1).padStart(3, '0')}`,
                  createdBy: "admin",
                  createdAt: now,
                  updatedBy: "admin",
                  updatedAt: now,
                } as AdjustmentRecord 
              });
            }}
            triggerLabel="New Adjustment"
            submitLabel="Create Adjustment"
            size="lg"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Settings className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="stat-label">Total Adjustments</p>
              <p className="stat-value">{state.records.length}</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-warning/10">
              <Settings className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="stat-label">Pending</p>
              <p className="stat-value">{state.records.filter(r => r.status === "pending").length}</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success/10">
              <Settings className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="stat-label">Approved</p>
              <p className="stat-value">{state.records.filter(r => r.status === "approved").length}</p>
            </div>
          </div>
        </div>
      </div>

      <DataTable
        data={state.records}
        columns={columns}
        searchPlaceholder="Search adjustments..."
        actions={renderActions}
        pageSize={10}
      />
    </div>
  );
}
