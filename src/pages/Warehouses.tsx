import { useReducer } from "react";
import { Warehouse, Plus, Search, Edit, MapPin, Boxes, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface WarehouseData {
  id: string;
  name: string;
  code: string;
  address: string;
  manager: string;
  zones: number;
  totalLocations: number;
  capacity: number;
  usedCapacity: number;
  status: "active" | "inactive";
}

type State = {
  warehouses: WarehouseData[];
  searchQuery: string;
};

type Action = { type: "SET_SEARCH"; payload: string };

const initialWarehouses: WarehouseData[] = [
  { id: "1", name: "Main Warehouse", code: "WH-001", address: "123 Industrial Park, City A", manager: "John Smith", zones: 5, totalLocations: 250, capacity: 50000, usedCapacity: 32500, status: "active" },
  { id: "2", name: "Secondary Warehouse", code: "WH-002", address: "456 Logistics Ave, City B", manager: "Jane Doe", zones: 3, totalLocations: 150, capacity: 30000, usedCapacity: 21000, status: "active" },
  { id: "3", name: "Cold Storage", code: "WH-003", address: "789 Refrigeration Blvd, City A", manager: "Mike Johnson", zones: 2, totalLocations: 80, capacity: 10000, usedCapacity: 8500, status: "active" },
  { id: "4", name: "Overflow Facility", code: "WH-004", address: "321 Expansion Rd, City C", manager: "Sarah Wilson", zones: 2, totalLocations: 100, capacity: 20000, usedCapacity: 4000, status: "inactive" },
];

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_SEARCH":
      return { ...state, searchQuery: action.payload };
    default:
      return state;
  }
};

const Warehouses = () => {
  const [state, dispatch] = useReducer(reducer, {
    warehouses: initialWarehouses,
    searchQuery: "",
  });

  const getCapacityColor = (percentage: number) => {
    if (percentage >= 90) return "bg-destructive";
    if (percentage >= 70) return "bg-warning";
    return "bg-success";
  };

  const filteredWarehouses = state.warehouses.filter(
    (w) =>
      w.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
      w.code.toLowerCase().includes(state.searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title">Warehouses</h1>
            <p className="page-description">Manage warehouse facilities and capacity</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Warehouse
          </Button>
        </div>
      </div>

      <div className="content-section">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search warehouses..."
              value={state.searchQuery}
              onChange={(e) => dispatch({ type: "SET_SEARCH", payload: e.target.value })}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredWarehouses.map((warehouse) => {
          const utilizationPercent = Math.round((warehouse.usedCapacity / warehouse.capacity) * 100);
          return (
            <div
              key={warehouse.id}
              className="content-section hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-primary/10 text-primary">
                    <Warehouse className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{warehouse.name}</h3>
                      <Badge variant={warehouse.status === "active" ? "default" : "secondary"}>
                        {warehouse.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground font-mono">{warehouse.code}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {warehouse.address}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Manager:</span>
                  <span className="font-medium">{warehouse.manager}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Zones / Locations:</span>
                  <span className="font-medium">{warehouse.zones} / {warehouse.totalLocations}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Boxes className="h-4 w-4" />
                    Capacity Utilization
                  </span>
                  <span className="font-medium">
                    {warehouse.usedCapacity.toLocaleString()} / {warehouse.capacity.toLocaleString()} ({utilizationPercent}%)
                  </span>
                </div>
                <Progress
                  value={utilizationPercent}
                  className={cn("h-2", getCapacityColor(utilizationPercent))}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Warehouses;
