import { useReducer } from "react";
import { Building2, Plus, Search, Edit, Phone, Mail, MoreHorizontal, Trash2 } from "lucide-react";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Supplier {
  id: string;
  code: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  productCount: number;
  lastOrder: string;
  status: "active" | "inactive";
  rating: number;
}

type State = {
  suppliers: Supplier[];
  searchQuery: string;
};

type Action =
  | { type: "SET_SEARCH"; payload: string }
  | { type: "DELETE_SUPPLIER"; payload: string };

const initialSuppliers: Supplier[] = [
  { id: "1", code: "SUP-001", name: "Tech Supplies Co.", contactPerson: "John Smith", email: "john@techsupplies.com", phone: "+1-555-0101", address: "123 Tech Park, CA", productCount: 145, lastOrder: "2024-01-15", status: "active", rating: 4.8 },
  { id: "2", code: "SUP-002", name: "Global Parts Ltd.", contactPerson: "Jane Doe", email: "jane@globalparts.com", phone: "+1-555-0102", address: "456 Industrial Ave, TX", productCount: 89, lastOrder: "2024-01-14", status: "active", rating: 4.5 },
  { id: "3", code: "SUP-003", name: "Raw Materials Inc.", contactPerson: "Mike Johnson", email: "mike@rawmaterials.com", phone: "+1-555-0103", address: "789 Factory Rd, NY", productCount: 234, lastOrder: "2024-01-13", status: "active", rating: 4.2 },
  { id: "4", code: "SUP-004", name: "Electronic World", contactPerson: "Sarah Wilson", email: "sarah@electronicworld.com", phone: "+1-555-0104", address: "321 Circuit Blvd, WA", productCount: 67, lastOrder: "2024-01-10", status: "inactive", rating: 3.8 },
  { id: "5", code: "SUP-005", name: "Pack & Ship Co.", contactPerson: "David Brown", email: "david@packship.com", phone: "+1-555-0105", address: "654 Logistics Way, FL", productCount: 45, lastOrder: "2024-01-12", status: "active", rating: 4.6 },
];

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_SEARCH":
      return { ...state, searchQuery: action.payload };
    case "DELETE_SUPPLIER":
      return { ...state, suppliers: state.suppliers.filter((s) => s.id !== action.payload) };
    default:
      return state;
  }
};

const Suppliers = () => {
  const [state, dispatch] = useReducer(reducer, {
    suppliers: initialSuppliers,
    searchQuery: "",
  });

  const filteredSuppliers = state.suppliers.filter(
    (s) =>
      s.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
      s.code.toLowerCase().includes(state.searchQuery.toLowerCase())
  );

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return "text-success";
    if (rating >= 4.0) return "text-warning";
    return "text-destructive";
  };

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title">Suppliers</h1>
            <p className="page-description">Manage vendor relationships and contacts</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Supplier
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="stat-label">Total Suppliers</p>
              <p className="stat-value">{state.suppliers.length}</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success/10">
              <Building2 className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="stat-label">Active</p>
              <p className="stat-value">{state.suppliers.filter(s => s.status === "active").length}</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-warning/10">
              <Building2 className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="stat-label">Avg. Rating</p>
              <p className="stat-value">4.4</p>
            </div>
          </div>
        </div>
      </div>

      <div className="content-section">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search suppliers..."
              value={state.searchQuery}
              onChange={(e) => dispatch({ type: "SET_SEARCH", payload: e.target.value })}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      <div className="table-container">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Code</TableHead>
              <TableHead>Supplier Name</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead className="text-right">Products</TableHead>
              <TableHead>Last Order</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSuppliers.map((supplier) => (
              <TableRow key={supplier.id} className="hover:bg-muted/30">
                <TableCell className="font-mono font-medium">{supplier.code}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-primary" />
                    <span className="font-medium">{supplier.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1 text-sm">
                    <div className="font-medium">{supplier.contactPerson}</div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-3 w-3" />
                      {supplier.email}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-3 w-3" />
                      {supplier.phone}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right font-semibold">{supplier.productCount}</TableCell>
                <TableCell className="text-muted-foreground">{supplier.lastOrder}</TableCell>
                <TableCell>
                  <span className={`font-semibold ${getRatingColor(supplier.rating)}`}>
                    ★ {supplier.rating}
                  </span>
                </TableCell>
                <TableCell>
                  <span className={`status-badge ${supplier.status === "active" ? "status-active" : "status-inactive"}`}>
                    {supplier.status}
                  </span>
                </TableCell>
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
                        onClick={() => dispatch({ type: "DELETE_SUPPLIER", payload: supplier.id })}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />Delete
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

export default Suppliers;
