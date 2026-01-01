import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { AlertTriangle, Filter, Search, ShoppingCart, TrendingDown } from "lucide-react";
import { useReducer } from "react";

interface LowStockItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  currentStock: number;
  reorderLevel: number;
  reorderQty: number;
  unit: string;
  supplier: string;
  lastOrdered: string;
  status: "low" | "critical" | "out";
}

type State = {
  items: LowStockItem[];
  searchQuery: string;
  statusFilter: string;
};

type Action =
  | { type: "SET_SEARCH"; payload: string }
  | { type: "SET_STATUS_FILTER"; payload: string };

const initialItems: LowStockItem[] = [
  { id: "1", sku: "CMP-B456", name: "Component B-456", category: "Components", currentStock: 28, reorderLevel: 50, reorderQty: 100, unit: "pcs", supplier: "Tech Supplies Co.", lastOrdered: "2024-01-05", status: "low" },
  { id: "2", sku: "ELC-D890", name: "Electronic D-890", category: "Electronics", currentStock: 5, reorderLevel: 30, reorderQty: 50, unit: "pcs", supplier: "Electronic World", lastOrdered: "2024-01-10", status: "critical" },
  { id: "3", sku: "RAW-G111", name: "Raw Material G-111", category: "Raw Materials", currentStock: 0, reorderLevel: 200, reorderQty: 500, unit: "kg", supplier: "Raw Materials Inc.", lastOrdered: "2024-01-02", status: "out" },
  { id: "4", sku: "PKG-J456", name: "Packaging J-456", category: "Packaging", currentStock: 150, reorderLevel: 200, reorderQty: 500, unit: "pcs", supplier: "Pack & Ship Co.", lastOrdered: "2024-01-08", status: "low" },
  { id: "5", sku: "MCH-K789", name: "Machine Part K-789", category: "Machinery", currentStock: 8, reorderLevel: 25, reorderQty: 50, unit: "pcs", supplier: "Global Parts Ltd.", lastOrdered: "2024-01-12", status: "critical" },
  { id: "6", sku: "WGT-L012", name: "Widget L-012", category: "Electronics", currentStock: 0, reorderLevel: 100, reorderQty: 200, unit: "pcs", supplier: "Tech Supplies Co.", lastOrdered: "2024-01-01", status: "out" },
];

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_SEARCH":
      return { ...state, searchQuery: action.payload };
    case "SET_STATUS_FILTER":
      return { ...state, statusFilter: action.payload };
    default:
      return state;
  }
};

const LowStocks = () => {
  const [state, dispatch] = useReducer(reducer, {
    items: initialItems,
    searchQuery: "",
    statusFilter: "all",
  });

  const getStatusBadge = (status: LowStockItem["status"]) => {
    const config = {
      low: "status-warning",
      critical: "status-error",
      out: "status-error",
    };
    return (
      <span className={`status-badge ${config[status]}`}>
        {status === "out" ? "Out of Stock" : status}
      </span>
    );
  };

  const getStockLevel = (current: number, reorder: number) => {
    const percentage = (current / reorder) * 100;
    return (
      <div className="flex items-center gap-3">
        <Progress
          value={Math.min(percentage, 100)}
          className={cn(
            "h-2 w-20",
            percentage === 0 ? "bg-destructive" : percentage <= 30 ? "bg-destructive" : "bg-warning"
          )}
        />
        <span className="text-sm font-medium w-16">
          {current} / {reorder}
        </span>
      </div>
    );
  };

  const filteredItems = state.items.filter((item) => {
    const matchesSearch =
      item.sku.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
      item.name.toLowerCase().includes(state.searchQuery.toLowerCase());
    const matchesStatus = state.statusFilter === "all" || item.status === state.statusFilter;
    return matchesSearch && matchesStatus;
  });

  const lowCount = state.items.filter((i) => i.status === "low").length;
  const criticalCount = state.items.filter((i) => i.status === "critical").length;
  const outCount = state.items.filter((i) => i.status === "out").length;

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title">Low Stock Items</h1>
            <p className="page-description">Items requiring attention or reorder</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-warning/10">
              <TrendingDown className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="stat-label">Low Stock</p>
              <p className="stat-value">{lowCount}</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="stat-label">Critical</p>
              <p className="stat-value">{criticalCount}</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="stat-label">Out of Stock</p>
              <p className="stat-value">{outCount}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="content-section">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative flex-1 min-w-[250px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by SKU or product name..."
              value={state.searchQuery}
              onChange={(e) => dispatch({ type: "SET_SEARCH", payload: e.target.value })}
              className="pl-10"
            />
          </div>
          <Select
            value={state.statusFilter}
            onValueChange={(v) => dispatch({ type: "SET_STATUS_FILTER", payload: v })}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="low">Low Stock</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="out">Out of Stock</SelectItem>
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
              <TableHead>SKU</TableHead>
              <TableHead>Product Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Stock Level</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Reorder Qty</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead className="w-[120px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredItems.map((item) => (
              <TableRow key={item.id} className="hover:bg-muted/30">
                <TableCell className="font-mono font-medium">{item.sku}</TableCell>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-normal">{item.category}</Badge>
                </TableCell>
                <TableCell>{getStockLevel(item.currentStock, item.reorderLevel)}</TableCell>
                <TableCell>{getStatusBadge(item.status)}</TableCell>
                <TableCell className="text-left font-semibold">
                  {item.reorderQty} {item.unit}
                </TableCell>
                <TableCell className="text-muted-foreground">{item.supplier}</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm">
                    <ShoppingCart className="h-3 w-3 mr-1" />
                    Reorder
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default LowStocks;
