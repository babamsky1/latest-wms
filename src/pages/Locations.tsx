import { useReducer } from "react";
import { MapPin, Plus, Search, Filter, Edit, Trash2, MoreHorizontal } from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface Location {
  id: string;
  code: string;
  warehouse: string;
  zone: string;
  rack: string;
  shelf: string;
  bin: string;
  type: "picking" | "storage" | "staging" | "receiving";
  capacity: number;
  usedCapacity: number;
  status: "available" | "full" | "reserved";
}

type State = {
  locations: Location[];
  searchQuery: string;
  warehouseFilter: string;
};

type Action =
  | { type: "SET_SEARCH"; payload: string }
  | { type: "SET_WAREHOUSE_FILTER"; payload: string }
  | { type: "DELETE_LOCATION"; payload: string };

const initialLocations: Location[] = [
  { id: "1", code: "A-01-02-03", warehouse: "Main Warehouse", zone: "A", rack: "01", shelf: "02", bin: "03", type: "picking", capacity: 500, usedCapacity: 250, status: "available" },
  { id: "2", code: "A-01-02-04", warehouse: "Main Warehouse", zone: "A", rack: "01", shelf: "02", bin: "04", type: "picking", capacity: 500, usedCapacity: 500, status: "full" },
  { id: "3", code: "B-02-01-01", warehouse: "Main Warehouse", zone: "B", rack: "02", shelf: "01", bin: "01", type: "storage", capacity: 1000, usedCapacity: 280, status: "available" },
  { id: "4", code: "C-01-03-02", warehouse: "Secondary Warehouse", zone: "C", rack: "01", shelf: "03", bin: "02", type: "storage", capacity: 2000, usedCapacity: 1200, status: "available" },
  { id: "5", code: "STG-001", warehouse: "Main Warehouse", zone: "Staging", rack: "-", shelf: "-", bin: "-", type: "staging", capacity: 5000, usedCapacity: 1500, status: "available" },
  { id: "6", code: "RCV-001", warehouse: "Main Warehouse", zone: "Receiving", rack: "-", shelf: "-", bin: "-", type: "receiving", capacity: 3000, usedCapacity: 0, status: "available" },
  { id: "7", code: "D-01-02-01", warehouse: "Main Warehouse", zone: "D", rack: "01", shelf: "02", bin: "01", type: "picking", capacity: 300, usedCapacity: 300, status: "reserved" },
];

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_SEARCH":
      return { ...state, searchQuery: action.payload };
    case "SET_WAREHOUSE_FILTER":
      return { ...state, warehouseFilter: action.payload };
    case "DELETE_LOCATION":
      return { ...state, locations: state.locations.filter((l) => l.id !== action.payload) };
    default:
      return state;
  }
};

const Locations = () => {
  const [state, dispatch] = useReducer(reducer, {
    locations: initialLocations,
    searchQuery: "",
    warehouseFilter: "all",
  });

  const getCapacityColor = (percentage: number) => {
    if (percentage >= 90) return "bg-destructive";
    if (percentage >= 70) return "bg-warning";
    return "bg-success";
  };

  const getStatusBadge = (status: Location["status"]) => {
    const config = {
      available: "status-active",
      full: "status-error",
      reserved: "status-warning",
    };
    return <span className={`status-badge ${config[status]}`}>{status}</span>;
  };

  const getTypeBadge = (type: Location["type"]) => {
    const config = {
      picking: "bg-primary/10 text-primary",
      storage: "bg-info/10 text-info",
      staging: "bg-warning/10 text-warning",
      receiving: "bg-success/10 text-success",
    };
    return <Badge variant="outline" className={cn("font-normal", config[type])}>{type}</Badge>;
  };

  const filteredLocations = state.locations.filter((loc) => {
    const matchesSearch = loc.code.toLowerCase().includes(state.searchQuery.toLowerCase());
    const matchesWarehouse = state.warehouseFilter === "all" || loc.warehouse.toLowerCase().includes(state.warehouseFilter.toLowerCase());
    return matchesSearch && matchesWarehouse;
  });

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title">Locations</h1>
            <p className="page-description">Manage warehouse locations, zones, racks, and bins</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Location
          </Button>
        </div>
      </div>

      <div className="content-section">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative flex-1 min-w-[250px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by location code..."
              value={state.searchQuery}
              onChange={(e) => dispatch({ type: "SET_SEARCH", payload: e.target.value })}
              className="pl-10"
            />
          </div>
          <Select
            value={state.warehouseFilter}
            onValueChange={(v) => dispatch({ type: "SET_WAREHOUSE_FILTER", payload: v })}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Warehouse" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Warehouses</SelectItem>
              <SelectItem value="main">Main Warehouse</SelectItem>
              <SelectItem value="secondary">Secondary Warehouse</SelectItem>
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
              <TableHead>Location Code</TableHead>
              <TableHead>Warehouse</TableHead>
              <TableHead>Zone</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Capacity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLocations.map((location) => {
              const usagePercent = Math.round((location.usedCapacity / location.capacity) * 100);
              return (
                <TableRow key={location.id} className="hover:bg-muted/30">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span className="font-mono font-medium">{location.code}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-normal">{location.warehouse}</Badge>
                  </TableCell>
                  <TableCell>{location.zone}</TableCell>
                  <TableCell>{getTypeBadge(location.type)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Progress
                        value={usagePercent}
                        className={cn("h-2 w-20", getCapacityColor(usagePercent))}
                      />
                      <span className="text-sm text-muted-foreground w-16">
                        {location.usedCapacity}/{location.capacity}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(location.status)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem><Edit className="h-4 w-4 mr-2" />Edit</DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => dispatch({ type: "DELETE_LOCATION", payload: location.id })}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Locations;
