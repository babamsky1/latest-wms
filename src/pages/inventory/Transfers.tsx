/**
 * Stock Transfers Page - Refactored
 * 
 * Features:
 * ✅ Standardized StatCards
 * ✅ DataTable with ActionMenu
 * ✅ Status badges
 * ✅ Comprehensive Transfer management
 */

import { StatCard } from "@/components/dashboard/StatCard";
import AddModal, { AddField } from "@/components/modals/AddModal";
import DeleteModal from "@/components/modals/DeleteModal";
import EditModal, { EditField } from "@/components/modals/EditModal";
import { ActionMenu } from "@/components/table/ActionMenu";
import { ColumnDef, DataTable } from "@/components/table/DataTable";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
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
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
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
  { id: "1", referenceNo: "TRF-2025-001", transferDate: "2025-12-31", neededDate: "2026-01-02", sourceWarehouse: "main", destinationWarehouse: "secondary", requestedBy: "John Smith", status: "completed", created_by: "Admin", created_at: "2025-12-30T10:00:00Z", updated_at: "2025-12-31T16:00:00Z" },
  { id: "2", referenceNo: "TRF-2025-002", transferDate: "2025-12-30", neededDate: "2026-01-05", sourceWarehouse: "secondary", destinationWarehouse: "outlet", requestedBy: "Jane Doe", status: "in-transit", created_by: "Manager", created_at: "2025-12-28T14:00:00Z", updated_at: "2025-12-30T14:00:00Z" },
  { id: "3", referenceNo: "TRF-2025-003", transferDate: "2025-12-29", neededDate: "2026-01-03", sourceWarehouse: "distribution", destinationWarehouse: "main", requestedBy: "Mike Johnson", status: "pending", created_by: "Staff", created_at: "2025-12-29T10:00:00Z", updated_at: "2025-12-29T10:00:00Z" },
];

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "DELETE_RECORD":
      return { ...state, records: state.records.filter(r => r.id !== action.payload) };
    case "ADD_RECORD":
      return { 
        ...state, 
        records: [
          {
            ...action.payload,
            created_at: new Date().toISOString(),
            created_by: "Current User",
            updated_at: new Date().toISOString(),
          }, 
          ...state.records
        ] 
      };
    case "UPDATE_RECORD":
      return { 
        ...state, 
        records: state.records.map(r => r.id === action.payload.id ? {
          ...action.payload,
          updated_at: new Date().toISOString(),
          updated_by: "Current User"
        } : r) 
      };
    default:
      return state;
  }
};

export default function Transfers() {
  const [state, dispatch] = useReducer(reducer, { records: initialRecords });

  const addFields: AddField<Transfer>[] = [
    { label: "Transfer Date", name: "transferDate", type: "text", required: true, placeholder: "YYYY-MM-DD" },
    { label: "Needed Date", name: "neededDate", type: "text", required: true, placeholder: "YYYY-MM-DD" },
    { label: "Source Warehouse", name: "sourceWarehouse", type: "select", required: true, options: warehouseOptions },
    { label: "Destination Warehouse", name: "destinationWarehouse", type: "select", required: true, options: warehouseOptions },
    { label: "Requested By", name: "requestedBy", type: "text", required: true, placeholder: "Your name" },
  ];

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
    { 
      key: "referenceNo", 
      label: "Reference No", 
      sortable: true, 
      className: "font-mono font-medium" 
    },
    { 
      key: "transferDate", 
      label: "Transfer Date", 
      sortable: true, 
      className: "text-muted-foreground"
    },
    { 
      key: "sourceWarehouse", 
      label: "Source", 
      sortable: true, 
      render: (row) => (
        <Badge variant="outline" className="font-normal text-muted-foreground">
          {warehouseOptions.find(w => w.value === row.sourceWarehouse)?.label || row.sourceWarehouse}
        </Badge>
      )
    },
    { 
      key: "destinationWarehouse", 
      label: "Destination", 
      sortable: true, 
      render: (row) => (
        <Badge variant="outline" className="font-normal text-muted-foreground">
          {warehouseOptions.find(w => w.value === row.destinationWarehouse)?.label || row.destinationWarehouse}
        </Badge>
      )
    },
    { 
      key: "status", 
      label: "Status", 
      sortable: true, 
      render: (row) => {
        const variants: Record<string, any> = {
          completed: "success",
          pending: "warning",
          "in-transit": "info",
          cancelled: "destructive",
        };
        return (
          <Badge variant={variants[row.status]}>
            {row.status.replace("-", " ")}
          </Badge>
        );
      }
    },
    { key: "requestedBy", label: "Requested By", sortable: true },
    {
      key: "created_by",
      label: "Created By",
      className: "hidden xl:table-cell text-sm text-muted-foreground",
    },
    {
      key: "updated_at",
      label: "Updated At",
      className: "hidden xl:table-cell text-sm text-muted-foreground",
      render: (row) => row.updated_at ? format(new Date(row.updated_at), "yyyy-MM-dd HH:mm") : "-",
    },
  ];

  const renderActions = (record: Transfer) => (
    <ActionMenu>
      <EditModal<Transfer>
        title="Edit Transfer"
        description="Update transfer details"
        fields={editFields}
        data={record}
        onSubmit={(data) => dispatch({ type: "UPDATE_RECORD", payload: { ...data, updatedAt: format(new Date(), "yyyy-MM-dd HH:mm"), updatedBy: "admin" } as Transfer })}
        triggerLabel="Edit"
        submitLabel="Update Transfer"
      />
      <DeleteModal
        title="Delete Transfer"
        description={`Are you sure you want to delete the transfer "${record.referenceNo}"? This action cannot be undone.`}
        onSubmit={() => dispatch({ type: "DELETE_RECORD", payload: record.id })}
        triggerLabel="Delete"
      />
    </ActionMenu>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Transfers</h1>
          <p className="page-description">Manage stock transfers between warehouses</p>
        </div>
        <AddModal<Transfer>
          title="New Transfer"
          description="Create a new stock transfer"
          fields={addFields}
          initialData={{} as Transfer}
          onSubmit={(data) => {
            const now = format(new Date(), "yyyy-MM-dd HH:mm");
            dispatch({ 
              type: "ADD_RECORD", 
              payload: { 
                ...data, 
                id: Date.now().toString(), 
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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          label="Total Transfers"
          value={state.records.length}
          contentType="transfers"
          variant="primary"
        />
        <StatCard
          label="Pending"
          value={state.records.filter(r => r.status === "pending").length}
          contentType="pending"
          variant="warning"
        />
        <StatCard
          label="In Transit"
          value={state.records.filter(r => r.status === "in-transit").length}
          contentType="in-transit"
          variant="primary"
        />
        <StatCard
          label="Completed"
          value={state.records.filter(r => r.status === "completed").length}
          contentType="completed"
          variant="success"
        />
      </div>

      <DataTable
        data={state.records}
        columns={columns}
        searchPlaceholder="Search transfers..."
        actions={renderActions}
        defaultPageSize={10}
      />
    </div>
  );
}
