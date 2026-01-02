import { StatCard } from "@/components/dashboard/StatCard";
import { ColumnDef, DataTable } from "@/components/table/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { AlertTriangle, Filter, ShoppingCart, TrendingDown } from "lucide-react";
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

  const columns: ColumnDef<LowStockItem>[] = [
    {
      key: "sku",
      label: "SKU",
      className: "font-mono font-medium",
    },
    {
      key: "name",
      label: "Product Name",
      className: "font-medium",
    },
    {
      key: "category",
      label: "Category",
      render: (row) => (
        <Badge variant="outline" className="font-normal">{row.category}</Badge>
      ),
    },
    {
      key: "stockLevel",
      label: "Stock Level",
      render: (row) => getStockLevel(row.currentStock, row.reorderLevel),
    },
    {
      key: "status",
      label: "Status",
      render: (row) => getStatusBadge(row.status),
    },
    {
      key: "reorderQty",
      label: "Reorder Qty",
      className: "text-left font-semibold",
      render: (row) => `${row.reorderQty} ${row.unit}`,
    },
    {
      key: "supplier",
      label: "Supplier",
      className: "text-muted-foreground",
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <Button variant="outline" size="sm">
          <ShoppingCart className="h-3 w-3 mr-1" />
          Reorder
        </Button>
      ),
    },
  ];

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
        <StatCard
          label="Low Stock"
          value={lowCount}
          icon={TrendingDown}
          variant="warning"
        />
        <StatCard
          label="Critical"
          value={criticalCount}
          icon={AlertTriangle}
          variant="destructive"
        />
        <StatCard
          label="Out of Stock"
          value={outCount}
          icon={AlertTriangle}
          variant="destructive"
        />
      </div>

      <div className="content-section">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative flex-1 min-w-[250px]">
            {/* Search handled by DataTable */}
            <div className="flex items-center gap-2">
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
        </div>
      </div>

      <DataTable
        data={filteredItems}
        columns={columns}
        searchPlaceholder="Search by SKU or product name..."
      />
    </div>
  );
};

export default LowStocks;
