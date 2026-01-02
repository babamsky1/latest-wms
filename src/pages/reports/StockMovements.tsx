import { StatCard } from "@/components/dashboard/StatCard";
import { ColumnDef, DataTable } from "@/components/table/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowDown, ArrowRightLeft, ArrowUp, Filter, Minus } from "lucide-react";
import { useReducer } from "react";

interface Movement {
  id: string;
  timestamp: string;
  type: "in" | "out" | "transfer" | "adjustment";
  referenceNo: string;
  sku: string;
  productName: string;
  fromLocation: string | null;
  toLocation: string | null;
  quantity: number;
  unit: string;
  performedBy: string;
  notes: string;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
  [key: string]: unknown;
}

type State = {
  movements: Movement[];
  searchQuery: string;
  typeFilter: string;
};

type Action =
  | { type: "SET_SEARCH"; payload: string }
  | { type: "SET_TYPE_FILTER"; payload: string };

const initialMovements: Movement[] = [
  { id: "1", timestamp: "2024-01-15 14:30:00", type: "in", referenceNo: "SI-2024-001", sku: "WGT-A123", productName: "Widget A-123", fromLocation: null, toLocation: "A-01-02-03", quantity: 100, unit: "pcs", performedBy: "John Smith", notes: "PO received", created_at: "2024-01-15T14:30:00Z", created_by: "John Smith" },
  { id: "2", timestamp: "2024-01-15 14:15:00", type: "out", referenceNo: "SO-2024-002", sku: "CMP-B456", productName: "Component B-456", fromLocation: "B-02-01-01", toLocation: null, quantity: 50, unit: "pcs", performedBy: "Jane Doe", notes: "Order fulfillment", created_at: "2024-01-15T14:15:00Z", created_by: "Jane Doe" },
  { id: "3", timestamp: "2024-01-15 13:45:00", type: "transfer", referenceNo: "TRF-2024-003", sku: "ELC-E345", productName: "Electronic E-345", fromLocation: "A-03-01-01", toLocation: "B-01-01-02", quantity: 25, unit: "pcs", performedBy: "Mike Johnson", notes: "Location optimization", created_at: "2024-01-15T13:45:00Z", created_by: "Mike Johnson" },
  { id: "4", timestamp: "2024-01-15 12:30:00", type: "adjustment", referenceNo: "ADJ-2024-001", sku: "RAW-C789", productName: "Raw Material C-789", fromLocation: "C-01-03-02", toLocation: null, quantity: -15, unit: "kg", performedBy: "Sarah Wilson", notes: "Damaged goods", created_at: "2024-01-15T12:30:00Z", created_by: "Sarah Wilson" },
  { id: "5", timestamp: "2024-01-15 11:00:00", type: "in", referenceNo: "SI-2024-002", sku: "MCH-F678", productName: "Machine Part F-678", fromLocation: null, toLocation: "D-01-02-01", quantity: 50, unit: "pcs", performedBy: "John Smith", notes: "Supplier delivery", created_at: "2024-01-15T11:00:00Z", created_by: "John Smith" },
  { id: "6", timestamp: "2024-01-15 10:30:00", type: "out", referenceNo: "SO-2024-003", sku: "PKG-H234", productName: "Packaging H-234", fromLocation: "E-02-01-03", toLocation: null, quantity: 200, unit: "pcs", performedBy: "Jane Doe", notes: "Bulk order", created_at: "2024-01-15T10:30:00Z", created_by: "Jane Doe" },
];

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_SEARCH":
      return { ...state, searchQuery: action.payload };
    case "SET_TYPE_FILTER":
      return { ...state, typeFilter: action.payload };
    default:
      return state;
  }
};

const StockMovements = () => {
  const [state, dispatch] = useReducer(reducer, {
    movements: initialMovements,
    searchQuery: "",
    typeFilter: "all",
  });

  const getTypeIcon = (type: Movement["type"]) => {
    const config = {
      in: { icon: ArrowDown, color: "text-success", bg: "bg-success/10" },
      out: { icon: ArrowUp, color: "text-destructive", bg: "bg-destructive/10" },
      transfer: { icon: ArrowRightLeft, color: "text-primary", bg: "bg-primary/10" },
      adjustment: { icon: Minus, color: "text-warning", bg: "bg-warning/10" },
    };
    const { icon: Icon, color, bg } = config[type];
    return (
      <div className={`flex items-center gap-2`}>
        <div className={`p-1.5 rounded ${bg}`}>
          <Icon className={`h-4 w-4 ${color}`} />
        </div>
        <Badge variant="outline" className="capitalize">{type}</Badge>
      </div>
    );
  };

  const columns: ColumnDef<Movement>[] = [
    {
      key: "timestamp",
      label: "Timestamp",
      className: "text-muted-foreground text-sm",
    },
    {
      key: "type",
      label: "Type",
      render: (row) => getTypeIcon(row.type),
    },
    {
      key: "referenceNo",
      label: "Reference",
      className: "font-mono text-sm",
    },
    {
      key: "sku",
      label: "SKU / Product",
      render: (row) => (
        <div>
          <span className="font-mono text-sm">{row.sku}</span>
          <p className="text-sm text-muted-foreground">{row.productName}</p>
        </div>
      ),
    },
    {
      key: "fromLocation",
      label: "From",
      render: (row) => (
        row.fromLocation ? (
          <span className="font-mono text-sm bg-muted px-2 py-1 rounded">{row.fromLocation}</span>
        ) : (
          <span className="text-muted-foreground">-</span>
        )
      ),
    },
    {
      key: "toLocation",
      label: "To",
      render: (row) => (
        row.toLocation ? (
          <span className="font-mono text-sm bg-muted px-2 py-1 rounded">{row.toLocation}</span>
        ) : (
          <span className="text-muted-foreground">-</span>
        )
      ),
    },
    {
      key: "quantity",
      label: "Quantity",
      className: "text-left",
      render: (row) => (
        <span className={`font-semibold ${row.quantity > 0 ? "text-success" : "text-destructive"}`}>
          {row.quantity > 0 ? "+" : ""}{row.quantity} {row.unit}
        </span>
      ),
    },
    { key: "performedBy", label: "Performed By" },
    {
      key: "created_at",
      label: "Time Recorded",
      className: "hidden xl:table-cell text-sm text-muted-foreground",
      render: (row) => row.created_at ? new Date(row.created_at).toLocaleTimeString() : "-",
    },
  ];

  const filteredMovements = state.movements.filter(m => state.typeFilter === 'all' || m.type === state.typeFilter);

  return (
    <div className="space-y-6">
      <div className="page-header">
        <h1 className="page-title">Stock Movements</h1>
        <p className="page-description">Track all inventory movements and changes</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          label="Stock In Today"
          value="150"
          icon={ArrowDown}
          variant="success"
        />
        <StatCard
          label="Stock Out Today"
          value="250"
          icon={ArrowUp}
          variant="destructive"
        />
        <StatCard
          label="Transfers Today"
          value="12"
          icon={ArrowRightLeft}
          variant="primary"
        />
        <StatCard
          label="Adjustments"
          value="3"
          icon={Minus}
          variant="warning"
        />
      </div>

      <div className="content-section">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative flex-1 min-w-[250px]">
            {/* Search and Filter */}
             <div className="flex items-center gap-2">
               <Select
                value={state.typeFilter}
                onValueChange={(v) => dispatch({ type: "SET_TYPE_FILTER", payload: v })}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="in">Stock In</SelectItem>
                  <SelectItem value="out">Stock Out</SelectItem>
                  <SelectItem value="transfer">Transfer</SelectItem>
                  <SelectItem value="adjustment">Adjustment</SelectItem>
                </SelectContent>
              </Select>
               <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <DataTable
        data={filteredMovements}
        columns={columns}
        searchPlaceholder="Search by SKU, product, or reference..."
      />
    </div>
  );
};

export default StockMovements;
