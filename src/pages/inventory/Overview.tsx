import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { ArrowUpDown, Filter, MapPin, Search, Warehouse, Plus } from "lucide-react";
import { useReducer, useState } from "react";
import AddModal, { AddField } from "@/components/modals/AddModal";

/* ================= TYPES ================= */

interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  warehouse: string;
  location: string;
  quantity: number;
  capacity: number;
  unit: string;
  lastUpdated: string;
  [key: string]: unknown;
}

/* ================= DATA ================= */

const inventoryItems: InventoryItem[] = [
  {
    id: "1",
    sku: "WGT-A123",
    name: "Widget A-123",
    warehouse: "Main Warehouse",
    location: "A-01-02-03",
    quantity: 250,
    capacity: 500,
    unit: "pcs",
    lastUpdated: "2024-01-15 14:30",
  },
  {
    id: "2",
    sku: "WGT-A123",
    name: "Widget A-123",
    warehouse: "Main Warehouse",
    location: "A-01-02-04",
    quantity: 200,
    capacity: 500,
    unit: "pcs",
    lastUpdated: "2024-01-15 14:30",
  },
  {
    id: "3",
    sku: "CMP-B456",
    name: "Component B-456",
    warehouse: "Main Warehouse",
    location: "B-02-01-01",
    quantity: 28,
    capacity: 100,
    unit: "pcs",
    lastUpdated: "2024-01-15 10:15",
  },
  {
    id: "4",
    sku: "RAW-C789",
    name: "Raw Material C-789",
    warehouse: "Secondary Warehouse",
    location: "C-01-03-02",
    quantity: 1200,
    capacity: 2000,
    unit: "kg",
    lastUpdated: "2024-01-14 16:45",
  },
];

/* ================= REDUCER (SAME AS CATEGORIES) ================= */

type State = {
  searchQuery: string;
};

type Action = {
  type: "SET_SEARCH";
  payload: string;
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_SEARCH":
      return { ...state, searchQuery: action.payload };
    default:
      return state;
  }
};

/* ================= COMPONENT ================= */


const Overview = () => {
  const [state, dispatch] = useReducer(reducer, { searchQuery: "" });
  const [addOpen, setAddOpen] = useState(false);

  const filteredInventory = inventoryItems.filter((item) => {
    const q = state.searchQuery.toLowerCase();
    return (
      item.sku.toLowerCase().includes(q) ||
      item.name.toLowerCase().includes(q) ||
      item.location.toLowerCase().includes(q)
    );
  });

  const getCapacityColor = (percentage: number) => {
    if (percentage >= 90) return "bg-destructive";
    if (percentage >= 70) return "bg-warning";
    return "bg-success";
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Inventory Overview</h1>
          <p className="page-description">View and manage stock levels across all locations</p>
        </div>
      </div>



      {/* Filters */}
      <div className="content-section">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative flex-1 min-w-[250px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by SKU, product name, or location..."
              value={state.searchQuery}
              onChange={(e) => dispatch({ type: "SET_SEARCH", payload: e.target.value })}
              className="pl-10"
            />
          </div>

          <Select defaultValue="all">
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

      {/* Table */}
      <div className="table-container">
        <Table variant="inventory">
          <TableHeader variant="inventory">
            <TableRow variant="inventory" className="bg-muted/50">
              <TableHead variant="inventory">
                <Button variant="ghost" size="sm" className="-ml-3 h-8">
                  SKU
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead variant="inventory">Product Name</TableHead>
              <TableHead variant="inventory">
                <div className="flex items-center gap-2">
                  <Warehouse className="h-4 w-4 text-muted-foreground" />
                  Warehouse
                </div>
              </TableHead>
              <TableHead variant="inventory">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  Location
                </div>
              </TableHead>
              <TableHead variant="inventory">Quantity</TableHead>
              <TableHead variant="inventory">Capacity</TableHead>
              <TableHead variant="inventory">Last Updated</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody variant="inventory">
            {filteredInventory.map((item) => {
              const usage = Math.round((item.quantity / item.capacity) * 100);
              return (
                <TableRow key={item.id} variant="inventory" className="hover:bg-muted/30">
                  <TableCell variant="inventory" className="font-mono text-sm">
                    {item.sku}
                  </TableCell>
                  <TableCell variant="inventory" className="font-medium">
                    {item.name}
                  </TableCell>
                  <TableCell variant="inventory">
                    <Badge variant="outline">{item.warehouse}</Badge>
                  </TableCell>
                  <TableCell variant="inventory">
                    <span className="font-mono text-sm bg-muted px-2 py-1 rounded">
                      {item.location}
                    </span>
                  </TableCell>
                  <TableCell variant="inventory">
                    <span className="font-semibold">{item.quantity.toLocaleString()}</span>{" "}
                    <span className="text-muted-foreground">{item.unit}</span>
                  </TableCell>
                  <TableCell variant="inventory">
                    <div className="flex items-center gap-3">
                      <Progress value={usage} className={cn("h-2 w-24", getCapacityColor(usage))} />
                      <span className="text-sm text-muted-foreground">{usage}%</span>
                    </div>
                  </TableCell>
                  <TableCell variant="inventory" className="text-muted-foreground text-sm">
                    {item.lastUpdated}
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

export default Overview;
