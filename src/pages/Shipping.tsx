import { Badge } from "@/components/ui/badge";
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
import { CheckCircle, Clock, Edit, Eye, MapPin, MoreHorizontal, Package, Plus, Search, Trash2, Truck } from "lucide-react";
import { useReducer } from "react";

interface ShippingRecord {
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
  | { type: "DELETE_RECORD"; payload: string };

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
    default:
      return state;
  }
};

const Shipping = () => {
  const [state, dispatch] = useReducer(reducer, {
    records: initialRecords,
    searchQuery: "",
  });

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
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Shipment
          </Button>
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
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="h-4 w-4 mr-2" /> View
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" /> Edit
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
};

export default Shipping;
