import { useReducer } from "react";
import { ArrowUpDown, Search, Filter, ArrowUp, ArrowDown, ArrowRightLeft, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  { id: "1", timestamp: "2024-01-15 14:30:00", type: "in", referenceNo: "SI-2024-001", sku: "WGT-A123", productName: "Widget A-123", fromLocation: null, toLocation: "A-01-02-03", quantity: 100, unit: "pcs", performedBy: "John Smith", notes: "PO received" },
  { id: "2", timestamp: "2024-01-15 14:15:00", type: "out", referenceNo: "SO-2024-002", sku: "CMP-B456", productName: "Component B-456", fromLocation: "B-02-01-01", toLocation: null, quantity: 50, unit: "pcs", performedBy: "Jane Doe", notes: "Order fulfillment" },
  { id: "3", timestamp: "2024-01-15 13:45:00", type: "transfer", referenceNo: "TRF-2024-003", sku: "ELC-E345", productName: "Electronic E-345", fromLocation: "A-03-01-01", toLocation: "B-01-01-02", quantity: 25, unit: "pcs", performedBy: "Mike Johnson", notes: "Location optimization" },
  { id: "4", timestamp: "2024-01-15 12:30:00", type: "adjustment", referenceNo: "ADJ-2024-001", sku: "RAW-C789", productName: "Raw Material C-789", fromLocation: "C-01-03-02", toLocation: null, quantity: -15, unit: "kg", performedBy: "Sarah Wilson", notes: "Damaged goods" },
  { id: "5", timestamp: "2024-01-15 11:00:00", type: "in", referenceNo: "SI-2024-002", sku: "MCH-F678", productName: "Machine Part F-678", fromLocation: null, toLocation: "D-01-02-01", quantity: 50, unit: "pcs", performedBy: "John Smith", notes: "Supplier delivery" },
  { id: "6", timestamp: "2024-01-15 10:30:00", type: "out", referenceNo: "SO-2024-003", sku: "PKG-H234", productName: "Packaging H-234", fromLocation: "E-02-01-03", toLocation: null, quantity: 200, unit: "pcs", performedBy: "Jane Doe", notes: "Bulk order" },
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

  const filteredMovements = state.movements.filter((m) => {
    const matchesSearch =
      m.sku.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
      m.productName.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
      m.referenceNo.toLowerCase().includes(state.searchQuery.toLowerCase());
    const matchesType = state.typeFilter === "all" || m.type === state.typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      <div className="page-header">
        <h1 className="page-title">Stock Movements</h1>
        <p className="page-description">Track all inventory movements and changes</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success/10">
              <ArrowDown className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="stat-label">Stock In Today</p>
              <p className="stat-value">150</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-destructive/10">
              <ArrowUp className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="stat-label">Stock Out Today</p>
              <p className="stat-value">250</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <ArrowRightLeft className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="stat-label">Transfers Today</p>
              <p className="stat-value">12</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-warning/10">
              <Minus className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="stat-label">Adjustments</p>
              <p className="stat-value">3</p>
            </div>
          </div>
        </div>
      </div>

      <div className="content-section">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative flex-1 min-w-[250px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by SKU, product, or reference..."
              value={state.searchQuery}
              onChange={(e) => dispatch({ type: "SET_SEARCH", payload: e.target.value })}
              className="pl-10"
            />
          </div>
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

      <div className="table-container">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>
                <Button variant="ghost" size="sm" className="-ml-3 h-8">
                  Timestamp
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Reference</TableHead>
              <TableHead>SKU / Product</TableHead>
              <TableHead>From</TableHead>
              <TableHead>To</TableHead>
              <TableHead className="text-right">Quantity</TableHead>
              <TableHead>Performed By</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMovements.map((movement) => (
              <TableRow key={movement.id} className="hover:bg-muted/30">
                <TableCell className="text-muted-foreground text-sm">{movement.timestamp}</TableCell>
                <TableCell>{getTypeIcon(movement.type)}</TableCell>
                <TableCell className="font-mono text-sm">{movement.referenceNo}</TableCell>
                <TableCell>
                  <div>
                    <span className="font-mono text-sm">{movement.sku}</span>
                    <p className="text-sm text-muted-foreground">{movement.productName}</p>
                  </div>
                </TableCell>
                <TableCell>
                  {movement.fromLocation ? (
                    <span className="font-mono text-sm bg-muted px-2 py-1 rounded">{movement.fromLocation}</span>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell>
                  {movement.toLocation ? (
                    <span className="font-mono text-sm bg-muted px-2 py-1 rounded">{movement.toLocation}</span>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <span className={`font-semibold ${movement.quantity > 0 ? "text-success" : "text-destructive"}`}>
                    {movement.quantity > 0 ? "+" : ""}{movement.quantity} {movement.unit}
                  </span>
                </TableCell>
                <TableCell>{movement.performedBy}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default StockMovements;
