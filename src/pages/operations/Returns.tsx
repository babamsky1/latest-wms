import { StatCard } from "@/components/dashboard/StatCard";
import AddModal, { AddField } from "@/components/modals/AddModal";
import DeleteModal from "@/components/modals/DeleteModal";
import EditModal, { EditField } from "@/components/modals/EditModal";
import { ActionMenu } from "@/components/table/ActionMenu";
import { ColumnDef, DataTable } from "@/components/table/DataTable";
import { CheckCircle, Clock, Package } from "lucide-react";
import { useReducer } from "react";

interface ReturnRecord {
  [key: string]: unknown;
  id: string;
  referenceNo: string;
  customer: string;
  orderRef: string;
  itemCount: number;
  totalQuantity: number;
  status: "pending" | "processed" | "approved";
  returnDate: string;
  processedBy: string;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
}

type State = {
  records: ReturnRecord[];
  searchQuery: string;
};

type Action =
  | { type: "SET_SEARCH"; payload: string }
  | { type: "DELETE_RECORD"; payload: string }
  | { type: "ADD_RECORD"; payload: ReturnRecord }
  | { type: "UPDATE_RECORD"; payload: ReturnRecord };

const initialRecords: ReturnRecord[] = [
  { id: "1", referenceNo: "RT-2024-001", customer: "Customer A", orderRef: "ORD-5001", itemCount: 2, totalQuantity: 100, status: "processed", returnDate: "2024-01-15", processedBy: "John Smith", created_by: "Admin", created_at: "2024-01-14T10:00:00Z", updated_at: "2024-01-15T11:00:00Z" },
  { id: "2", referenceNo: "RT-2024-002", customer: "Customer B", orderRef: "ORD-5002", itemCount: 1, totalQuantity: 50, status: "pending", returnDate: "2024-01-16", processedBy: "-", created_by: "Jane Doe", created_at: "2024-01-16T09:00:00Z", updated_at: "2024-01-16T09:00:00Z" },
  { id: "3", referenceNo: "RT-2024-003", customer: "Customer C", orderRef: "ORD-5003", itemCount: 5, totalQuantity: 300, status: "approved", returnDate: "2024-01-14", processedBy: "Jane Doe", created_by: "Admin", created_at: "2024-01-12T14:20:00Z", updated_at: "2024-01-14T15:00:00Z" },
];

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_SEARCH":
      return { ...state, searchQuery: action.payload };
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
            updated_at: new Date().toISOString(),
          },
          ...state.records,
        ],
      };
    case "UPDATE_RECORD":
      return {
        ...state,
        records: state.records.map((r) => r.id === action.payload.id ? {
          ...action.payload,
          updated_at: new Date().toISOString(),
          updated_by: "Current User"
        } : r),
      };
    default:
      return state;
  }
};

const Returns = () => {
  const [state, dispatch] = useReducer(reducer, {
    records: initialRecords,
    searchQuery: "",
  });

  // Generate next Reference number
  const nextRefNumber = state.records.length > 0
    ? Math.max(...state.records.map(r => parseInt(r.referenceNo.split('-')[2] || "0"))) + 1
    : 1;
  const generatedRefNumber = `RT-2024-${nextRefNumber.toString().padStart(3, "0")}`;

  // Form fields configuration
  const returnFields: AddField<ReturnRecord>[] = [
    { label: "Reference No (Auto)", name: "referenceNo", type: "text", disabled: true },
    { label: "Customer", name: "customer", type: "text", placeholder: "Enter customer name", required: true },
    { label: "Order Reference", name: "orderRef", type: "text", placeholder: "e.g., ORD-5001", required: true },
    { label: "Item Count", name: "itemCount", type: "number", placeholder: "0", required: true },
    { label: "Total Quantity", name: "totalQuantity", type: "number", placeholder: "0", required: true },
    { label: "Return Date", name: "returnDate", type: "text", placeholder: "YYYY-MM-DD", required: true },
  ];

  const editReturnFields: EditField<ReturnRecord>[] = [
    { label: "Reference No", name: "referenceNo", type: "text", disabled: true },
    { label: "Customer", name: "customer", type: "text", placeholder: "Enter customer name", required: true },
    { label: "Order Reference", name: "orderRef", type: "text", placeholder: "e.g., ORD-5001", required: true },
    { label: "Item Count", name: "itemCount", type: "number", placeholder: "0", required: true },
    { label: "Total Quantity", name: "totalQuantity", type: "number", placeholder: "0", required: true },
    { label: "Return Date", name: "returnDate", type: "text", placeholder: "YYYY-MM-DD", required: true },
    { label: "Processed By", name: "processedBy", type: "text", placeholder: "e.g., John Smith", required: false },
  ];

  const getStatusBadge = (status: ReturnRecord["status"]) => {
    const config = {
      processed: { class: "status-active", icon: CheckCircle },
      pending: { class: "status-warning", icon: Clock },
      approved: { class: "status-success", icon: CheckCircle },
    };
    const { class: className, icon: Icon } = config[status];
    return (
      <span className={`status-badge ${className}`}>
        <Icon className="h-3 w-3 mr-1" />
        {status}
      </span>
    );
  };

  const columns: ColumnDef<ReturnRecord>[] = [
    {
      key: "referenceNo",
      label: "Reference No.",
      className: "font-mono font-medium",
    },
    { key: "customer", label: "Customer" },
    {
      key: "orderRef",
      label: "Order Ref",
      className: "font-mono text-sm",
    },
    { key: "itemCount", label: "Items" },
    {
      key: "totalQuantity",
      label: "Total Qty",
      className: "font-semibold",
      render: (row) => row.totalQuantity.toLocaleString(),
    },
    {
      key: "status",
      label: "Status",
      render: (row) => getStatusBadge(row.status),
    },
    {
      key: "returnDate",
      label: "Return Date",
      className: "text-muted-foreground",
    },
    { key: "processedBy", label: "Processed By" },
    {
      key: "created_by",
      label: "Created By",
      className: "hidden xl:table-cell text-sm text-muted-foreground",
    },
    {
      key: "updated_at",
      label: "Updated",
      className: "hidden xl:table-cell text-sm text-muted-foreground",
      render: (row) => row.updated_at ? new Date(row.updated_at).toLocaleDateString() : "-",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title">Returns</h1>
            <p className="page-description">Manage returned items and customer returns</p>
          </div>
          <AddModal<ReturnRecord>
            title="Add New Return"
            description="Create a new return record"
            fields={returnFields}
            initialData={{
              id: String(Date.now()),
              referenceNo: generatedRefNumber,
              customer: "",
              orderRef: "",
              itemCount: 0,
              totalQuantity: 0,
              status: "pending",
              returnDate: "",
              processedBy: "-",
            }}
            onSubmit={(data) => dispatch({ type: "ADD_RECORD", payload: data as ReturnRecord })}
            triggerLabel="New Return"
            submitLabel="Create Return"
            size="lg"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          label="Today's Returns"
          value="50"
          icon={Package}
          variant="primary"
        />
        <StatCard
          label="Pending"
          value="5"
          icon={Clock}
          variant="warning"
        />
        <StatCard
          label="Approved"
          value="45"
          icon={CheckCircle}
          variant="success"
        />
      </div>

      <DataTable
        data={state.records}
        columns={columns}
        searchPlaceholder="Search by reference or customer..."
        actions={(record) => (
          <ActionMenu>
            <EditModal<ReturnRecord>
              title="Edit Return"
              description="Update return record"
              fields={editReturnFields}
              data={record}
              onSubmit={(data) => dispatch({ type: "UPDATE_RECORD", payload: data as ReturnRecord })}
              triggerLabel="Edit"
              submitLabel="Update Return"
              size="lg"
            />
            <DeleteModal
              title="Delete Return"
              description={`Are you sure you want to delete the return record "${record.referenceNo}"? This action cannot be undone.`}
              onSubmit={() => dispatch({ type: "DELETE_RECORD", payload: record.id })}
              triggerLabel="Delete"
            />
          </ActionMenu>
        )}
      />
    </div>
  );
};

export default Returns;
