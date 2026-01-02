/**
 * Stock In Page - Refactored
 * 
 * Features:
 * ✅ Standardized StatCards
 * ✅ DataTable with ActionMenu
 * ✅ Status badges with correct variants
 * ✅ Inbound inventory management
 */

import { StatCard } from "@/components/dashboard/StatCard";
import AddModal, { AddField } from "@/components/modals/AddModal";
import DeleteModal from "@/components/modals/DeleteModal";
import EditModal, { EditField } from "@/components/modals/EditModal";
import { ActionMenu } from "@/components/table/ActionMenu";
import { ColumnDef, DataTable } from "@/components/table/DataTable";
import { Badge } from "@/components/ui/badge";
import { useReducer } from "react";

interface StockInRecord {
  id: string;
  referenceNo: string;
  source: string;
  orderRef: string;
  itemCount: number;
  totalQuantity: number;
  status: "pending" | "received" | "processing";
  receivedDate: string;
  processedBy: string;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
  [key: string]: unknown;
}

type State = {
  records: StockInRecord[];
};

type Action =
  | { type: "DELETE_RECORD"; payload: string }
  | { type: "ADD_RECORD"; payload: StockInRecord }
  | { type: "UPDATE_RECORD"; payload: StockInRecord };

const initialRecords: StockInRecord[] = [
  { id: "1", referenceNo: "SI-2024-001", source: "Supplier A", orderRef: "ORD-1001", itemCount: 10, totalQuantity: 500, status: "received", receivedDate: "2024-01-15", processedBy: "John Smith", created_by: "Admin", created_at: "2024-01-15T08:00:00Z", updated_at: "2024-01-15T14:30:00Z" },
  { id: "2", referenceNo: "SI-2024-002", source: "Supplier B", orderRef: "ORD-1002", itemCount: 5, totalQuantity: 250, status: "processing", receivedDate: "2024-01-15", processedBy: "Jane Doe", created_by: "Admin", created_at: "2024-01-15T09:00:00Z", updated_at: "2024-01-15T12:00:00Z" },
  { id: "3", referenceNo: "SI-2024-003", source: "Supplier C", orderRef: "ORD-1003", itemCount: 12, totalQuantity: 1200, status: "pending", receivedDate: "2024-01-16", processedBy: "-", created_by: "Admin", created_at: "2024-01-16T10:00:00Z", updated_at: "2024-01-16T10:00:00Z" },
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

export default function StockIn() {
  const [state, dispatch] = useReducer(reducer, { records: initialRecords });

  const addFields: AddField<StockInRecord>[] = [
    { label: "Reference No", name: "referenceNo", type: "text", placeholder: "Auto-generated", disabled: true },
    { label: "Source", name: "source", type: "text", placeholder: "e.g., Supplier A", required: true },
    { label: "Order Reference", name: "orderRef", type: "text", placeholder: "e.g., ORD-1001", required: true },
    { label: "Item Count", name: "itemCount", type: "number", placeholder: "0", required: true },
    { label: "Total Quantity", name: "totalQuantity", type: "number", placeholder: "0", required: true },
    { label: "Processed By", name: "processedBy", type: "text", placeholder: "Your name", required: true }
  ];

  const editFields: EditField<StockInRecord>[] = [
    { label: "Reference No", name: "referenceNo", type: "text", disabled: true },
    { label: "Source", name: "source", type: "text", placeholder: "Enter source", required: true },
    { label: "Order Reference", name: "orderRef", type: "text", placeholder: "e.g., ORD-1001", required: true },
    { label: "Item Count", name: "itemCount", type: "number", placeholder: "0", required: true },
    { label: "Total Quantity", name: "totalQuantity", type: "number", placeholder: "0", required: true },
    { label: "Received Date", name: "receivedDate", type: "text", placeholder: "YYYY-MM-DD", required: true },
    { label: "Processed By", name: "processedBy", type: "text", placeholder: "e.g., John Smith", required: false },
    { 
      label: "Status", 
      name: "status", 
      type: "select", 
      required: true,
      options: [
        { value: "pending", label: "Pending" },
        { value: "processing", label: "Processing" },
        { value: "received", label: "Received" }
      ]
    }
  ];

  const columns: ColumnDef<StockInRecord>[] = [
    { 
      key: "referenceNo", 
      label: "Reference No", 
      className: "font-mono font-medium" 
    },
    { 
      key: "source", 
      label: "Source" 
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
          received: "success",
          pending: "warning",
          processing: "info"
        };
        const statusLabel = row.status.charAt(0).toUpperCase() + row.status.slice(1);
        return <Badge variant={variants[row.status] || "default"}>{statusLabel}</Badge>;
      }
    },
    { 
      key: "receivedDate", 
      label: "Received",
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

  const renderActions = (record: StockInRecord) => (
    <ActionMenu>
      <EditModal<StockInRecord>
        title="Edit Stock In"
        description="Update stock in record"
        fields={editFields}
        data={record}
        onSubmit={(data) => dispatch({ type: "UPDATE_RECORD", payload: data as StockInRecord })}
        triggerLabel="Edit"
        submitLabel="Update Stock In"
      />
      <DeleteModal
        title="Delete Stock In"
        description={`Are you sure you want to delete the stock in record "${record.referenceNo}"? This action cannot be undone.`}
        onSubmit={() => dispatch({ type: "DELETE_RECORD", payload: record.id })}
        triggerLabel="Delete"
      />
    </ActionMenu>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Stock In</h1>
          <p className="page-description">Manage inbound inventory and receipts</p>
        </div>
        <AddModal<StockInRecord>
          title="New Stock In"
          description="Create a new stock in receipt"
          fields={addFields}
           initialData={{} as StockInRecord}
          onSubmit={(data) => dispatch({
            type: "ADD_RECORD",
            payload: {
              ...data,
              id: Date.now().toString(),
              status: "pending",
              receivedDate: new Date().toISOString().split('T')[0]
            } as StockInRecord
          })}
          triggerLabel="New Stock In"
          submitLabel="Create Record"
          size="lg"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          label="Today's Received"
          value="500"
          contentType="receiving"
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
        searchPlaceholder="Search by reference or source..."
        actions={renderActions}
        defaultPageSize={10}
      />
    </div>
  );
}
