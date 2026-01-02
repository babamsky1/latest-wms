/**
 * Stock Out Page - Refactored
 * 
 * Features:
 * ✅ Standardized StatCards with icons
 * ✅ DataTable with ActionMenu
 * ✅ Status badges
 * ✅ Outbound inventory management
 */

import { StatCard } from "@/components/dashboard/StatCard";
import AddModal, { AddField } from "@/components/modals/AddModal";
import DeleteModal from "@/components/modals/DeleteModal";
import EditModal, { EditField } from "@/components/modals/EditModal";
import { ActionMenu } from "@/components/table/ActionMenu";
import { ColumnDef, DataTable } from "@/components/table/DataTable";
import { Badge } from "@/components/ui/badge";
import { useReducer } from "react";

interface StockOutRecord {
  id: string;
  referenceNo: string;
  destination: string;
  orderRef: string;
  itemCount: number;
  totalQuantity: number;
  status: "pending" | "dispatched" | "processing";
  dispatchDate: string;
  processedBy: string;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
  [key: string]: unknown;
}

type State = {
  records: StockOutRecord[];
};

type Action =
  | { type: "DELETE_RECORD"; payload: string }
  | { type: "ADD_RECORD"; payload: StockOutRecord }
  | { type: "UPDATE_RECORD"; payload: StockOutRecord };

const initialRecords: StockOutRecord[] = [
  { id: "1", referenceNo: "SO-2024-001", destination: "Customer A", orderRef: "ORD-5001", itemCount: 3, totalQuantity: 150, status: "dispatched", dispatchDate: "2024-01-15", processedBy: "John Smith", created_by: "Admin", created_at: "2024-01-15T08:00:00Z", updated_at: "2024-01-15T14:30:00Z" },
  { id: "2", referenceNo: "SO-2024-002", destination: "Retail Store B", orderRef: "ORD-5002", itemCount: 8, totalQuantity: 420, status: "dispatched", dispatchDate: "2024-01-15", processedBy: "Jane Doe", created_by: "Admin", created_at: "2024-01-15T09:00:00Z", updated_at: "2024-01-15T12:00:00Z" },
  { id: "3", referenceNo: "SO-2024-003", destination: "Distributor C", orderRef: "ORD-5003", itemCount: 15, totalQuantity: 2300, status: "processing", dispatchDate: "2024-01-16", processedBy: "Mike Johnson", created_by: "Admin", created_at: "2024-01-16T10:00:00Z", updated_at: "2024-01-16T10:00:00Z" },
  { id: "4", referenceNo: "SO-2024-004", destination: "Warehouse D", orderRef: "TRF-1001", itemCount: 5, totalQuantity: 800, status: "pending", dispatchDate: "2024-01-16", processedBy: "-", created_by: "Admin", created_at: "2024-01-16T11:00:00Z", updated_at: "2024-01-16T11:00:00Z" },
  { id: "5", referenceNo: "SO-2024-005", destination: "Customer E", orderRef: "ORD-5004", itemCount: 2, totalQuantity: 50, status: "dispatched", dispatchDate: "2024-01-14", processedBy: "Sarah Wilson", created_by: "Admin", created_at: "2024-01-14T10:00:00Z", updated_at: "2024-01-14T10:00:00Z" },
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
            status: "pending", 
            processedBy: "-",
            created_at: new Date().toISOString(),
            created_by: "Current User",
            updated_at: new Date().toISOString()
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

export default function StockOut() {
  const [state, dispatch] = useReducer(reducer, { records: initialRecords });

  const addFields: AddField<StockOutRecord>[] = [
    { label: "Reference No", name: "referenceNo", type: "text", placeholder: "Auto-generated", disabled: true },
    { label: "Destination", name: "destination", type: "text", placeholder: "e.g., Customer A", required: true },
    { label: "Order Reference", name: "orderRef", type: "text", placeholder: "e.g., ORD-5001", required: true },
    { label: "Item Count", name: "itemCount", type: "number", placeholder: "0", required: true },
    { label: "Total Quantity", name: "totalQuantity", type: "number", placeholder: "0", required: true },
    { label: "Processed By", name: "processedBy", type: "text", placeholder: "Your name", required: true }
  ];

  const editFields: EditField<StockOutRecord>[] = [
    { label: "Reference No", name: "referenceNo", type: "text", disabled: true },
    { label: "Destination", name: "destination", type: "text", placeholder: "Enter destination", required: true },
    { label: "Order Reference", name: "orderRef", type: "text", placeholder: "e.g., ORD-5001", required: true },
    { label: "Item Count", name: "itemCount", type: "number", placeholder: "0", required: true },
    { label: "Total Quantity", name: "totalQuantity", type: "number", placeholder: "0", required: true },
    { label: "Dispatch Date", name: "dispatchDate", type: "text", placeholder: "YYYY-MM-DD", required: true },
    { label: "Processed By", name: "processedBy", type: "text", placeholder: "e.g., John Smith", required: false },
    { 
      label: "Status", 
      name: "status", 
      type: "select", 
      required: true,
      options: [
        { value: "pending", label: "Pending" },
        { value: "processing", label: "Processing" },
        { value: "dispatched", label: "Dispatched" }
      ]
    }
  ];

  const columns: ColumnDef<StockOutRecord>[] = [
    { 
      key: "referenceNo", 
      label: "Reference No", 
      className: "font-mono font-medium" 
    },
    { 
      key: "destination", 
      label: "Destination" 
    },
    { 
      key: "orderRef", 
      label: "Order Ref",
      className: "font-mono text-sm"
    },
    { 
      key: "itemCount", 
      label: "Items",
      className: "text-left" 
    },
    { 
      key: "totalQuantity", 
      label: "Total Qty",
      className: "text-left font-bold",
      render: (row) => row.totalQuantity.toLocaleString()
    },
    { 
      key: "status", 
      label: "Status",
      render: (row) => {
        const variants: Record<string, any> = {
          dispatched: "success",
          pending: "warning",
          processing: "info"
        };
        const statusLabel = row.status.charAt(0).toUpperCase() + row.status.slice(1);
        return <Badge variant={variants[row.status] || "default"}>{statusLabel}</Badge>;
      }
    },
    { 
      key: "dispatchDate", 
      label: "Dispatched",
      className: "text-muted-foreground text-sm"
    },
    { 
      key: "processedBy", 
      label: "Processed By" 
    },
    {
      key: "created_by",
      label: "Created By",
      className: "hidden xl:table-cell text-sm text-muted-foreground",
    },
    {
      key: "updated_at",
      label: "Updated At",
      className: "hidden xl:table-cell text-sm text-muted-foreground",
      render: (row) => row.updated_at ? new Date(row.updated_at).toLocaleDateString() : "-",
    },
  ];

  const renderActions = (record: StockOutRecord) => (
    <ActionMenu>
      <EditModal<StockOutRecord>
        title="Edit Stock Out"
        description="Update stock out record"
        fields={editFields}
        data={record}
        onSubmit={(data) => dispatch({ type: "UPDATE_RECORD", payload: data as StockOutRecord })}
        triggerLabel="Edit"
        submitLabel="Update Stock Out"
      />
      <DeleteModal
        title="Delete Stock Out"
        description={`Are you sure you want to delete the stock out record "${record.referenceNo}"? This action cannot be undone.`}
        onSubmit={() => dispatch({ type: "DELETE_RECORD", payload: record.id })}
        triggerLabel="Delete"
      />
    </ActionMenu>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Stock Out</h1>
          <p className="page-description">Manage outbound inventory and dispatches</p>
        </div>
        <AddModal<StockOutRecord>
          title="New Stock Out"
          description="Create a new stock out record"
          fields={addFields}
          initialData={{} as StockOutRecord}
          onSubmit={(data) => dispatch({
            type: "ADD_RECORD",
            payload: {
              ...data,
              id: Date.now().toString(),
              status: "pending",
              dispatchDate: new Date().toISOString().split('T')[0]
            } as StockOutRecord
          })}
          triggerLabel="New Stock Out"
          submitLabel="Create Record"
          size="lg"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          label="Today's Dispatched"
          value="892"
          contentType="shipping"
          variant="primary"
        />
        <StatCard
          label="Processing"
          value="5"
          contentType="clock"
          variant="warning"
        />
        <StatCard
          label="This Week"
          value="4,230"
          contentType="calendar"
          variant="success"
        />
      </div>

      <DataTable
        data={state.records}
        columns={columns}
        searchPlaceholder="Search by reference or destination..."
        actions={renderActions}
        defaultPageSize={10}
      />
    </div>
  );
}
