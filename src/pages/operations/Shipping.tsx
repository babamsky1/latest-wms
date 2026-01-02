import { StatCard } from "@/components/dashboard/StatCard";
import AddModal, { AddField } from "@/components/modals/AddModal";
import DeleteModal from "@/components/modals/DeleteModal";
import EditModal, { EditField } from "@/components/modals/EditModal";
import { ActionMenu } from "@/components/table/ActionMenu";
import { ColumnDef, DataTable } from "@/components/table/DataTable";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, MapPin, Package, Truck } from "lucide-react";
import { useReducer } from "react";

interface ShippingRecord {
  [key: string]: unknown;
  id: string;
  shipmentNo: string;
  orderRef: string;
  customer: string;
  carrier: string;
  destination: string;
  packages: number;
  weight: string;
  status: "pending" | "picked" | "packed" | "shipped" | "delivered";
  shipDate: string;
  trackingNo: string;
  created_by?: string;
  created_at?: string;
  updated_by?: string;
  updated_at?: string;
}

type State = {
  records: ShippingRecord[];
  searchQuery: string;
};

type Action =
  | { type: "SET_SEARCH"; payload: string }
  | { type: "DELETE_RECORD"; payload: string }
  | { type: "ADD_RECORD"; payload: ShippingRecord }
  | { type: "UPDATE_RECORD"; payload: ShippingRecord };

const initialRecords: ShippingRecord[] = [
  { id: "1", shipmentNo: "SHP-2024-001", orderRef: "ORD-5001", customer: "Acme Corp", carrier: "FedEx", destination: "New York, NY", packages: 3, weight: "15.5 kg", status: "shipped", shipDate: "2024-01-15", trackingNo: "FX123456789", created_by: "Admin", created_at: "2024-01-14T09:00:00Z", updated_at: "2024-01-15T10:00:00Z" },
  { id: "2", shipmentNo: "SHP-2024-002", orderRef: "ORD-5002", customer: "Tech Solutions", carrier: "UPS", destination: "Los Angeles, CA", packages: 1, weight: "8.2 kg", status: "delivered", shipDate: "2024-01-14", trackingNo: "1Z999999999", created_by: "John Doe", created_at: "2024-01-13T14:20:00Z", updated_at: "2024-01-14T16:00:00Z" },
  { id: "3", shipmentNo: "SHP-2024-003", orderRef: "ORD-5003", customer: "Global Trade Inc", carrier: "DHL", destination: "Chicago, IL", packages: 5, weight: "45.0 kg", status: "packed", shipDate: "2024-01-16", trackingNo: "-", created_by: "Jane Smith", created_at: "2024-01-15T08:00:00Z", updated_at: "2024-01-16T09:00:00Z" },
  { id: "4", shipmentNo: "SHP-2024-004", orderRef: "ORD-5004", customer: "Retail Plus", carrier: "FedEx", destination: "Miami, FL", packages: 2, weight: "12.3 kg", status: "picked", shipDate: "2024-01-16", trackingNo: "-", created_by: "Mike Ross", created_at: "2024-01-16T08:30:00Z", updated_at: "2024-01-16T09:15:00Z" },
  { id: "5", shipmentNo: "SHP-2024-005", orderRef: "ORD-5005", customer: "Distribution Co", carrier: "UPS", destination: "Seattle, WA", packages: 8, weight: "67.8 kg", status: "pending", shipDate: "2024-01-17", trackingNo: "-", created_by: "Admin", created_at: "2024-01-16T15:45:00Z", updated_at: "2024-01-16T15:45:00Z" },
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
            trackingNo: "-",
            created_at: new Date().toISOString(),
            created_by: "Current User",
            updated_at: new Date().toISOString()
          },
          ...state.records,
        ],
      };    case "UPDATE_RECORD":
      return {
        ...state,
        records: state.records.map((r) => r.id === action.payload.id ? {
          ...action.payload,
          updated_at: new Date().toISOString(),
          updated_by: "Current User"
        } : r),
      };    default:
      return state;
  }
};

const Shipping = () => {
  const [state, dispatch] = useReducer(reducer, {
    records: initialRecords,
    searchQuery: "",
  });

  // Generate next Shipment number
  const nextShipmentNumber = state.records.length > 0
    ? Math.max(...state.records.map(r => parseInt(r.shipmentNo.split('-')[2] || "0"))) + 1
    : 1;
  const generatedShipmentNumber = `SHP-2024-${nextShipmentNumber.toString().padStart(3, "0")}`;

  // Form fields configuration
  const shippingFields: AddField<ShippingRecord>[] = [
    { label: "Shipment No (Auto)", name: "shipmentNo", type: "text", disabled: true },
    { label: "Order Reference", name: "orderRef", type: "text", placeholder: "e.g., ORD-5001", required: true },
    { label: "Customer", name: "customer", type: "text", placeholder: "Enter customer name", required: true },
    { label: "Carrier", name: "carrier", type: "text", placeholder: "e.g., FedEx", required: true },
    { label: "Destination", name: "destination", type: "text", placeholder: "e.g., New York, NY", required: true },
    { label: "Packages", name: "packages", type: "number", placeholder: "0", required: true },
    { label: "Weight", name: "weight", type: "text", placeholder: "e.g., 15.5 kg", required: true },
    { label: "Ship Date", name: "shipDate", type: "text", placeholder: "YYYY-MM-DD", required: true },
  ];

  const editShippingFields: EditField<ShippingRecord>[] = [
    { label: "Shipment No", name: "shipmentNo", type: "text", disabled: true },
    { label: "Order Reference", name: "orderRef", type: "text", placeholder: "e.g., ORD-5001", required: true },
    { label: "Customer", name: "customer", type: "text", placeholder: "Enter customer name", required: true },
    { label: "Carrier", name: "carrier", type: "text", placeholder: "e.g., FedEx", required: true },
    { label: "Destination", name: "destination", type: "text", placeholder: "e.g., New York, NY", required: true },
    { label: "Packages", name: "packages", type: "number", placeholder: "0", required: true },
    { label: "Weight", name: "weight", type: "text", placeholder: "e.g., 15.5 kg", required: true },
    { label: "Ship Date", name: "shipDate", type: "text", placeholder: "YYYY-MM-DD", required: true },
    { label: "Tracking No", name: "trackingNo", type: "text", placeholder: "e.g., FX123456789", required: false },
  ];

  const getStatusBadge = (status: ShippingRecord["status"]) => {
    const config = {
      pending: { class: "status-warning", icon: Clock },
      picked: { class: "status-warning", icon: Package },
      packed: { class: "status-warning", icon: Package },
      shipped: { class: "status-active", icon: Truck },
      delivered: { class: "status-active", icon: CheckCircle },
    };
    const { class: className, icon: Icon } = config[status];
    return (
      <span className={`status-badge ${className}`}>
        <Icon className="h-3 w-3 mr-1" />
        {status}
      </span>
    );
  };

  const columns: ColumnDef<ShippingRecord>[] = [
    {
      key: "shipmentNo",
      label: "Shipment No.",
      className: "font-mono font-medium",
    },
    {
      key: "orderRef",
      label: "Order Ref",
      className: "font-mono text-sm",
    },
    { key: "customer", label: "Customer" },
    {
      key: "carrier",
      label: "Carrier",
      render: (row) => <Badge variant="outline">{row.carrier}</Badge>,
    },
    {
      key: "destination",
      label: "Destination",
      render: (row) => (
        <div className="flex items-center gap-1 text-sm">
          <MapPin className="h-3 w-3 text-muted-foreground" />
          {row.destination}
        </div>
      ),
    },
    { key: "packages", label: "Packages" },
    {
      key: "status",
      label: "Status",
      render: (row) => getStatusBadge(row.status),
    },
    {
      key: "trackingNo",
      label: "Tracking",
      className: "font-mono text-sm",
      render: (row) => (row.trackingNo !== "-" ? row.trackingNo : <span className="text-muted-foreground">-</span>),
    },
    {
      key: "created_by",
      label: "Shipped By",
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
            <h1 className="page-title">Shipping</h1>
            <p className="page-description">Manage outbound shipments and carrier assignments</p>
          </div>
          <AddModal<ShippingRecord>
            title="Add New Shipment"
            description="Create a new shipping record"
            fields={shippingFields}
            initialData={{
              id: String(Date.now()),
              shipmentNo: generatedShipmentNumber,
              orderRef: "",
              customer: "",
              carrier: "",
              destination: "",
              packages: 0,
              weight: "",
              status: "pending",
              shipDate: "",
              trackingNo: "-",
            }}
            onSubmit={(data) => dispatch({ type: "ADD_RECORD", payload: data as ShippingRecord })}
            triggerLabel="New Shipment"
            submitLabel="Create Shipment"
            size="lg"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          label="Pending Pick"
          value="8"
          icon={Package}
          variant="warning"
        />
        <StatCard
          label="Ready to Ship"
          value="5"
          icon={Package}
          variant="primary"
        />
        <StatCard
          label="In Transit"
          value="12"
          icon={Truck}
          variant="info"
        />
        <StatCard
          label="Delivered Today"
          value="23"
          icon={CheckCircle}
          variant="success"
        />
      </div>

      <DataTable
        data={state.records}
        columns={columns}
        searchPlaceholder="Search by shipment, order, or customer..."
        actions={(record) => (
          <ActionMenu>
            <EditModal<ShippingRecord>
              title="Edit Shipping"
              description="Update shipping record"
              fields={editShippingFields}
              data={record}
              onSubmit={(data) => dispatch({ type: "UPDATE_RECORD", payload: data as ShippingRecord })}
              triggerLabel="Edit"
              submitLabel="Update Shipping"
              size="lg"
            />
            <DeleteModal
              title="Delete Shipping"
              description={`Are you sure you want to delete the shipping record "${record.shipmentNo}"? This action cannot be undone.`}
              onSubmit={() => dispatch({ type: "DELETE_RECORD", payload: record.id })}
              triggerLabel="Delete"
            />
          </ActionMenu>
        )}
      />
    </div>
  );
};

export default Shipping;
