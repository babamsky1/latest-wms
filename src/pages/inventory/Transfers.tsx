import AddModal from "@/components/modals/AddModal";
import DeleteModal from "@/components/modals/DeleteModal";
import EditModal, { EditField } from "@/components/modals/EditModal";
import { ColumnDef, DataTable } from "@/components/table/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { ArrowRight, ArrowRightLeft, CheckCircle, Clock, MoreHorizontal } from "lucide-react";
import { useReducer } from "react";

interface Transfer {
  id: string;
  referenceNo: string;
  transferDate: string;
  neededDate: string;
  sourceWarehouse: string;
  destinationWarehouse: string;
  requestedBy: string;
  status: "pending" | "in-transit" | "completed" | "cancelled";
  updatedBy: string;
  updatedAt: string;
  [key: string]: unknown;
}

type State = {
  records: Transfer[];
};

type Action =
  | { type: "DELETE_RECORD"; payload: string }
  | { type: "ADD_RECORD"; payload: Transfer }
  | { type: "UPDATE_RECORD"; payload: Transfer };

const warehouseOptions = [
  { value: "main", label: "Main Warehouse" },
  { value: "secondary", label: "Secondary Warehouse" },
  { value: "outlet", label: "Outlet Store" },
  { value: "distribution", label: "Distribution Center" },
];

const statusOptions = [
  { value: "pending", label: "Pending" },
  { value: "in-transit", label: "In Transit" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

const initialRecords: Transfer[] = [
  { id: "1", referenceNo: "TRF-2025-001", transferDate: "2025-12-31", neededDate: "2026-01-02", sourceWarehouse: "main", destinationWarehouse: "secondary", requestedBy: "John Smith", status: "completed", updatedBy: "manager", updatedAt: "2025-12-31 16:00" },
  { id: "2", referenceNo: "TRF-2025-002", transferDate: "2025-12-30", neededDate: "2026-01-05", sourceWarehouse: "secondary", destinationWarehouse: "outlet", requestedBy: "Jane Doe", status: "in-transit", updatedBy: "warehouse_user", updatedAt: "2025-12-30 14:00" },
  { id: "3", referenceNo: "TRF-2025-003", transferDate: "2025-12-29", neededDate: "2026-01-03", sourceWarehouse: "distribution", destinationWarehouse: "main", requestedBy: "Mike Johnson", status: "pending", updatedBy: "staff", updatedAt: "2025-12-29 10:00" },
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

export default function Transfers() {
  const [state, dispatch] = useReducer(reducer, { records: initialRecords });

  const getStatusBadge = (status: Transfer["status"]) => {
    const config = {
      completed: { class: "bg-success/20 text-success", icon: CheckCircle },
      pending: { class: "bg-warning/20 text-warning", icon: Clock },
      "in-transit": { class: "bg-primary/20 text-primary", icon: ArrowRightLeft },
      cancelled: { class: "bg-destructive/20 text-destructive", icon: Clock },
    };
    const { class: className, icon: Icon } = config[status];
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${className}`}>
        <Icon className="h-3 w-3" />
        {status.replace("-", " ")}
      </span>
    );
  };

  const editFields: EditField<Transfer>[] = [
    { label: "Reference No", name: "referenceNo", type: "text", disabled: true },
    { label: "Transfer Date", name: "transferDate", type: "text", required: true },
    { label: "Needed Date", name: "neededDate", type: "text", required: true },
    { label: "Source Warehouse", name: "sourceWarehouse", type: "select", required: true, options: warehouseOptions },
    { label: "Destination Warehouse", name: "destinationWarehouse", type: "select", required: true, options: warehouseOptions },
    { label: "Requested By", name: "requestedBy", type: "text", required: true },
    { label: "Status", name: "status", type: "select", required: true, options: statusOptions },
  ];

  const columns: ColumnDef<Transfer>[] = [
    { key: "referenceNo", label: "Reference No", sortable: true, filterable: true, className: "font-mono font-medium" },
    { key: "transferDate", label: "Transfer Date", sortable: true, filterable: true },
    { key: "neededDate", label: "Needed Date", sortable: true, filterable: true },
    { 
      key: "sourceWarehouse", 
      label: "Source Warehouse", 
      sortable: true, 
      filterable: true,
      filterType: "select",
      filterOptions: warehouseOptions,
      render: (row) => (
        <Badge variant="outline" className="font-normal">
          {warehouseOptions.find(w => w.value === row.sourceWarehouse)?.label || row.sourceWarehouse}
        </Badge>
      )
    },
    { 
      key: "destinationWarehouse", 
      label: "Destination Warehouse", 
      sortable: true, 
      filterable: true,
      filterType: "select",
      filterOptions: warehouseOptions,
      render: (row) => (
        <Badge variant="outline" className="font-normal">
          {warehouseOptions.find(w => w.value === row.destinationWarehouse)?.label || row.destinationWarehouse}
        </Badge>
      )
    },
    { key: "requestedBy", label: "Requested By", sortable: true, filterable: true },
    { 
      key: "status", 
      label: "Status", 
      sortable: true, 
      filterable: true,
      filterType: "select",
      filterOptions: statusOptions,
      render: (row) => getStatusBadge(row.status)
    },
    { key: "updatedBy", label: "Updated By", sortable: true, filterable: true },
    { key: "updatedAt", label: "Updated At", sortable: true, className: "text-muted-foreground text-sm" },
  ];

  const renderActions = (record: Transfer) => (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="p-2">
                      <div className="flex flex-col gap-2 w-full">
                        {/* Edit Button */}
                        <EditModal<Transfer>
                          title="Edit Transfer"
                          description="Update transfer details"
                          fields={editFields}
                          data={record}
                          onSubmit={(data) => dispatch({ type: "UPDATE_RECORD", payload: { ...data, updatedAt: format(new Date(), "yyyy-MM-dd HH:mm"), updatedBy: "admin" } as Transfer })}
                          triggerLabel="Edit"
                          triggerSize="default"
                          submitLabel="Update Transfer"
                          size="lg"
                        />

                        {/* Delete Button */}
                        <DeleteModal
                          title="Delete Transfer"
                          description={`Are you sure you want to delete the transfer "${record.referenceNo}"? This action cannot be undone.`}
                          onSubmit={() => dispatch({ type: "DELETE_RECORD", payload: record.id })}
                          triggerLabel="Delete"
                          triggerSize="default"
                        />
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
  );

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title">Transfers</h1>
            <p className="page-description">Manage stock transfers between warehouses</p>
          </div>
          <AddModal<Transfer>
            title="New Transfer"
            description="Create a new stock transfer"
            fields={[
              { label: "Transfer Date", name: "transferDate", type: "text", required: true, placeholder: "YYYY-MM-DD" },
              { label: "Needed Date", name: "neededDate", type: "text", required: true, placeholder: "YYYY-MM-DD" },
              { label: "Source Warehouse", name: "sourceWarehouse", type: "select", required: true, options: warehouseOptions },
              { label: "Destination Warehouse", name: "destinationWarehouse", type: "select", required: true, options: warehouseOptions },
              { label: "Requested By", name: "requestedBy", type: "text", required: true, placeholder: "Your name" },
            ]}
            onSubmit={(data) => {
              const now = format(new Date(), "yyyy-MM-dd HH:mm");
              dispatch({ 
                type: "ADD_RECORD", 
                payload: { 
                  ...data, 
                  id: crypto.randomUUID(), 
                  referenceNo: `TRF-${new Date().getFullYear()}-${String(state.records.length + 1).padStart(3, '0')}`,
                  status: "pending",
                  updatedBy: "admin",
                  updatedAt: now,
                } as Transfer 
              });
            }}
            triggerLabel="New Transfer"
            submitLabel="Create Transfer"
            size="lg"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <ArrowRightLeft className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="stat-label">Total Transfers</p>
              <p className="stat-value">{state.records.length}</p>
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
              <p className="stat-value">{state.records.filter(r => r.status === "pending").length}</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <ArrowRight className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="stat-label">In Transit</p>
              <p className="stat-value">{state.records.filter(r => r.status === "in-transit").length}</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success/10">
              <CheckCircle className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="stat-label">Completed</p>
              <p className="stat-value">{state.records.filter(r => r.status === "completed").length}</p>
            </div>
          </div>
        </div>
      </div>

      <DataTable
        data={state.records}
        columns={columns}
        searchPlaceholder="Search transfers..."
        actions={renderActions}
        pageSize={10}
      />
    </div>
  );
}
