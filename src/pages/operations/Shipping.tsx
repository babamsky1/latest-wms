import AddModal, { AddField } from "@/components/modals/AddModal";
import DeleteModal from "@/components/modals/DeleteModal";
import EditModal, { EditField } from "@/components/modals/EditModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
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
import { CheckCircle, Clock, MapPin, MoreHorizontal, Package, Search, Truck } from "lucide-react";
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
  { id: "1", shipmentNo: "SHP-2024-001", orderRef: "ORD-5001", customer: "Acme Corp", carrier: "FedEx", destination: "New York, NY", packages: 3, weight: "15.5 kg", status: "shipped", shipDate: "2024-01-15", trackingNo: "FX123456789" },
  { id: "2", shipmentNo: "SHP-2024-002", orderRef: "ORD-5002", customer: "Tech Solutions", carrier: "UPS", destination: "Los Angeles, CA", packages: 1, weight: "8.2 kg", status: "delivered", shipDate: "2024-01-14", trackingNo: "1Z999999999" },
  { id: "3", shipmentNo: "SHP-2024-003", orderRef: "ORD-5003", customer: "Global Trade Inc", carrier: "DHL", destination: "Chicago, IL", packages: 5, weight: "45.0 kg", status: "packed", shipDate: "2024-01-16", trackingNo: "-" },
  { id: "4", shipmentNo: "SHP-2024-004", orderRef: "ORD-5004", customer: "Retail Plus", carrier: "FedEx", destination: "Miami, FL", packages: 2, weight: "12.3 kg", status: "picked", shipDate: "2024-01-16", trackingNo: "-" },
  { id: "5", shipmentNo: "SHP-2024-005", orderRef: "ORD-5005", customer: "Distribution Co", carrier: "UPS", destination: "Seattle, WA", packages: 8, weight: "67.8 kg", status: "pending", shipDate: "2024-01-17", trackingNo: "-" },
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
          { ...action.payload, status: "pending", trackingNo: "-" },
          ...state.records,
        ],
      };    case "UPDATE_RECORD":
      return {
        ...state,
        records: state.records.map((r) => r.id === action.payload.id ? action.payload : r),
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

  const filteredRecords = state.records.filter(
    r =>
      r.shipmentNo.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
      r.customer.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
      r.orderRef.toLowerCase().includes(state.searchQuery.toLowerCase())
  );

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
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-warning/10">
              <Package className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="stat-label">Pending Pick</p>
              <p className="stat-value">8</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Package className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="stat-label">Ready to Ship</p>
              <p className="stat-value">5</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-info/10">
              <Truck className="h-5 w-5 text-info" />
            </div>
            <div>
              <p className="stat-label">In Transit</p>
              <p className="stat-value">12</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success/10">
              <CheckCircle className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="stat-label">Delivered Today</p>
              <p className="stat-value">23</p>
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
              placeholder="Search by shipment, order, or customer..."
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
              <TableHead>Shipment No.</TableHead>
              <TableHead>Order Ref</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Carrier</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead className="text-right">Packages</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Tracking</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRecords.map(record => (
              <TableRow key={record.id} className="hover:bg-muted/30">
                <TableCell className="font-mono font-medium">{record.shipmentNo}</TableCell>
                <TableCell className="font-mono text-sm">{record.orderRef}</TableCell>
                <TableCell>{record.customer}</TableCell>
                <TableCell>
                  <Badge variant="outline">{record.carrier}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-sm">
                    <MapPin className="h-3 w-3 text-muted-foreground" />
                    {record.destination}
                  </div>
                </TableCell>
                <TableCell className="text-right">{record.packages}</TableCell>
                <TableCell>{getStatusBadge(record.status)}</TableCell>
                <TableCell className="font-mono text-sm">
                  {record.trackingNo !== "-" ? record.trackingNo : <span className="text-muted-foreground">-</span>}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="p-2">
                      <div className="flex flex-col gap-2 w-full">
                        {/* Edit Button */}
                        <EditModal<ShippingRecord>
                          title="Edit Shipping"
                          description="Update shipping record"
                          fields={editShippingFields}
                          data={record}
                          onSubmit={(data) => dispatch({ type: "UPDATE_RECORD", payload: data as ShippingRecord })}
                          triggerLabel="Edit"
                          triggerSize="default"
                          submitLabel="Update Shipping"
                          size="lg"
                        />

                        {/* Delete Button */}
                        <DeleteModal
                          title="Delete Shipping"
                          description={`Are you sure you want to delete the shipping record "${record.shipmentNo}"? This action cannot be undone.`}
                          onSubmit={() => dispatch({ type: "DELETE_RECORD", payload: record.id })}
                          triggerLabel="Delete"
                          triggerSize="default"
                        />
                      </div>
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
};

export default Shipping;
