import { StatCard } from "@/components/dashboard/StatCard";
import AddModal, { AddField } from "@/components/modals/AddModal";
import DeleteModal from "@/components/modals/DeleteModal";
import EditModal, { EditField } from "@/components/modals/EditModal";
import { ActionMenu } from "@/components/table/ActionMenu";
import { ColumnDef, DataTable } from "@/components/table/DataTable";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, Package, Truck } from "lucide-react";
import { useReducer } from "react";

interface ReceivingRecord {
  id: string;
  poNumber: string;
  supplier: string;
  expectedDate: string;
  receivedDate: string | null;
  itemCount: number;
  expectedQty: number;
  receivedQty: number;
  status: "pending" | "receiving" | "completed" | "partial";
  dock: string;
  created_by?: string;
  created_at?: string;
  updated_by?: string;
  updated_at?: string;
  [key: string]: unknown;
}

type State = {
  records: ReceivingRecord[];
  searchQuery: string;
};

type Action =
  | { type: "SET_SEARCH"; payload: string }
  | { type: "DELETE_RECORD"; payload: string }
  | { type: "ADD_RECORD"; payload: ReceivingRecord }
  | { type: "UPDATE_RECORD"; payload: ReceivingRecord };

const initialRecords: ReceivingRecord[] = [
  { id: "1", poNumber: "PO-2024-001", supplier: "Tech Supplies Co.", expectedDate: "2024-01-15", receivedDate: "2024-01-15", itemCount: 5, expectedQty: 500, receivedQty: 500, status: "completed", dock: "Dock A", created_by: "Admin", created_at: "2024-01-10T10:00:00Z", updated_at: "2024-01-15T14:30:00Z" },
  { id: "2", poNumber: "PO-2024-002", supplier: "Global Parts Ltd.", expectedDate: "2024-01-16", receivedDate: null, itemCount: 12, expectedQty: 1200, receivedQty: 0, status: "pending", dock: "Dock B", created_by: "John Doe", created_at: "2024-01-12T09:00:00Z", updated_at: "2024-01-12T09:00:00Z" },
  { id: "3", poNumber: "PO-2024-003", supplier: "Raw Materials Inc.", expectedDate: "2024-01-15", receivedDate: "2024-01-15", itemCount: 3, expectedQty: 2500, receivedQty: 2000, status: "partial", dock: "Dock A", created_by: "Jane Smith", created_at: "2024-01-11T16:20:00Z", updated_at: "2024-01-15T16:00:00Z" },
  { id: "4", poNumber: "PO-2024-004", supplier: "Electronic World", expectedDate: "2024-01-16", receivedDate: null, itemCount: 8, expectedQty: 340, receivedQty: 150, status: "receiving", dock: "Dock C", created_by: "Mike Ross", created_at: "2024-01-14T08:30:00Z", updated_at: "2024-01-16T11:00:00Z" },
  { id: "5", poNumber: "PO-2024-005", supplier: "Pack & Ship Co.", expectedDate: "2024-01-14", receivedDate: "2024-01-14", itemCount: 2, expectedQty: 5000, receivedQty: 5000, status: "completed", dock: "Dock B", created_by: "Admin", created_at: "2024-01-09T13:45:00Z", updated_at: "2024-01-14T15:20:00Z" },
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
            receivedQty: 0, 
            receivedDate: null,
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

const Receiving = () => {
  const [state, dispatch] = useReducer(reducer, {
    records: initialRecords,
    searchQuery: "",
  });

  // Generate next PO number
  const nextPONumber = state.records.length > 0
    ? Math.max(...state.records.map(r => parseInt(r.poNumber.split('-')[2] || "0"))) + 1
    : 1;
  const generatedPONumber = `PO-2024-${nextPONumber.toString().padStart(3, "0")}`;

  // Form fields configuration
  const receivingFields: AddField<ReceivingRecord>[] = [
    { label: "PO Number (Auto)", name: "poNumber", type: "text", disabled: true },
    { label: "Supplier", name: "supplier", type: "text", placeholder: "Enter supplier name", required: true },
    { label: "Expected Date", name: "expectedDate", type: "text", placeholder: "YYYY-MM-DD", required: true },
    { label: "Dock", name: "dock", type: "text", placeholder: "e.g., Dock A", required: true },
    { label: "Item Count", name: "itemCount", type: "number", placeholder: "0", required: true },
    { label: "Expected Quantity", name: "expectedQty", type: "number", placeholder: "0", required: true },
  ];

  const editReceivingFields: EditField<ReceivingRecord>[] = [
    { label: "PO Number", name: "poNumber", type: "text", disabled: true },
    { label: "Supplier", name: "supplier", type: "text", placeholder: "Enter supplier name", required: true },
    { label: "Expected Date", name: "expectedDate", type: "text", placeholder: "YYYY-MM-DD", required: true },
    { label: "Dock", name: "dock", type: "text", placeholder: "e.g., Dock A", required: true },
    { label: "Item Count", name: "itemCount", type: "number", placeholder: "0", required: true },
    { label: "Expected Quantity", name: "expectedQty", type: "number", placeholder: "0", required: true },
    { label: "Received Quantity", name: "receivedQty", type: "number", placeholder: "0", required: true },
  ];

  const getStatusBadge = (status: ReceivingRecord["status"]) => {
    const config = {
      completed: { class: "status-active", icon: CheckCircle },
      pending: { class: "status-warning", icon: Clock },
      receiving: { class: "status-warning", icon: Package },
      partial: { class: "status-warning", icon: Package },
    };
    const { class: className, icon: Icon } = config[status];
    return (
      <span className={`status-badge ${className}`}>
        <Icon className="h-3 w-3 mr-1" />
        {status}
      </span>
    );
  };

  const columns: ColumnDef<ReceivingRecord>[] = [
    {
      key: "poNumber",
      label: "PO Number",
      className: "font-mono font-medium",
    },
    { key: "supplier", label: "Supplier" },
    {
      key: "expectedDate",
      label: "Expected Date",
      className: "text-muted-foreground",
    },
    {
      key: "dock",
      label: "Dock",
      render: (row) => <Badge variant="outline">{row.dock}</Badge>,
    },
    { key: "itemCount", label: "Items" },
    {
      key: "receivedQty",
      label: "Received / Expected",
      render: (row) => (
        <span>
          <span className="font-semibold">{row.receivedQty.toLocaleString()}</span>
          <span className="text-muted-foreground"> / {row.expectedQty.toLocaleString()}</span>
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row) => getStatusBadge(row.status),
    },
    {
      key: "created_by",
      label: "Receiver",
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
            <h1 className="page-title">Receiving</h1>
            <p className="page-description">Manage incoming deliveries and put-away operations</p>
          </div>
          <AddModal<ReceivingRecord>
            title="Add New Receiving"
            description="Create a new receiving record"
            fields={receivingFields}
            initialData={{
              id: String(Date.now()),
              poNumber: generatedPONumber,
              supplier: "",
              expectedDate: "",
              receivedDate: null,
              itemCount: 0,
              expectedQty: 0,
              receivedQty: 0,
              status: "pending",
              dock: "",
            }}
            onSubmit={(data) => dispatch({ type: "ADD_RECORD", payload: data as ReceivingRecord })}
            triggerLabel="New Receiving"
            submitLabel="Create Receiving"
            size="lg"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          label="Expected Today"
          value="5"
          icon={Clock}
          variant="warning"
        />
        <StatCard
          label="At Dock"
          value="2"
          icon={Truck}
          variant="primary"
        />
        <StatCard
          label="Completed Today"
          value="8"
          icon={CheckCircle}
          variant="success"
        />
        <StatCard
          label="Pending Put-away"
          value="12"
          icon={Package}
          variant="destructive"
        />
      </div>

      <DataTable
        data={state.records}
        columns={columns}
        searchPlaceholder="Search by PO or supplier..."
        actions={(record) => (
          <ActionMenu>
            <EditModal<ReceivingRecord>
              title="Edit Receiving"
              description="Update receiving record"
              fields={editReceivingFields}
              data={record}
              onSubmit={(data) => dispatch({ type: "UPDATE_RECORD", payload: data as ReceivingRecord })}
              triggerLabel="Edit"
              submitLabel="Update Receiving"
              size="lg"
            />
            <DeleteModal
              title="Delete Receiving Record"
              description={`Are you sure you want to delete the receiving record "${record.poNumber}"? This action cannot be undone.`}
              onSubmit={() => dispatch({ type: "DELETE_RECORD", payload: record.id })}
              triggerLabel="Delete"
            />
          </ActionMenu>
        )}
      />
    </div>
  );
};

export default Receiving;
