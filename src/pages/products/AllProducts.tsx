import AddModal, { AddField } from "@/components/modals/AddModal";
import EditModal, { EditField } from "@/components/modals/EditModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import {
  Download,
  Edit,
  MoreHorizontal,
  Search,
  Trash2,
  Upload,
} from "lucide-react";
import { useReducer } from "react";

// 1. Define Product Type (SKU is the unique key)
type Product = {
  sku: string;
  name: string;
  category: string;
  unit: string;
  currentStock: number;
  reorderLevel: number;
  price: number;
  status: "active" | "inactive";
};

type State = {
  products: Product[];
  searchQuery: string;
  selectedProducts: string[]; // Array of SKUs
};

type Action =
  | { type: "SET_SEARCH"; payload: string }
  | { type: "TOGGLE_SELECT"; payload: string }
  | { type: "TOGGLE_SELECT_ALL" }
  | { type: "DELETE_PRODUCT"; payload: string }
  | { type: "ADD_PRODUCT"; payload: Product }
  | { type: "UPDATE_PRODUCT"; payload: Product };

const initialProducts: Product[] = [
  { sku: "SKU-001", name: "Widget A-123", category: "Electronics", unit: "pcs", currentStock: 450, reorderLevel: 50, price: 24.99, status: "active" },
  { sku: "SKU-002", name: "Component B-456", category: "Machinery", unit: "pcs", currentStock: 28, reorderLevel: 40, price: 89.5, status: "active" },
];

// 2. Reducer Logic
const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_SEARCH":
      return { ...state, searchQuery: action.payload };
    case "TOGGLE_SELECT":
      return {
        ...state,
        selectedProducts: state.selectedProducts.includes(action.payload)
          ? state.selectedProducts.filter((sku) => sku !== action.payload)
          : [...state.selectedProducts, action.payload],
      };
    case "TOGGLE_SELECT_ALL":
      return {
        ...state,
        selectedProducts:
          state.selectedProducts.length === state.products.length
            ? []
            : state.products.map((p) => p.sku),
      };
    case "DELETE_PRODUCT":
      return {
        ...state,
        products: state.products.filter((p) => p.sku !== action.payload),
        selectedProducts: state.selectedProducts.filter((sku) => sku !== action.payload),
      };
    case "ADD_PRODUCT":
      return {
        ...state,
        products: [
          { ...action.payload, status: "active", unit: "pcs" },
          ...state.products,
        ],
      };
    case "UPDATE_PRODUCT":
      return {
        ...state,
        products: state.products.map((p) => p.sku === action.payload.sku ? action.payload : p),
      };
    default:
      return state;
  }
};

const AllProducts = () => {
  const [state, dispatch] = useReducer(reducer, {
    products: initialProducts,
    searchQuery: "",
    selectedProducts: [],
  });

  // 3. Auto-SKU Logic (Finds the highest existing number and increments)
  const nextNumber = state.products.length > 0 
    ? Math.max(...state.products.map(p => parseInt(p.sku.split('-')[1] || "0"))) + 1 
    : 1;
  const generatedSku = `SKU-${nextNumber.toString().padStart(3, "0")}`;

  // 4. Modal Field Configuration
  const productFields: AddField<Product>[] = [
    { label: "SKU (Auto)", name: "sku", type: "text", disabled: true },
    { label: "Product Name", name: "name", type: "text", placeholder: "Enter name", required: true },
    { 
      label: "Category", 
      name: "category", 
      type: "select", 
      required: true,
      options: [
        { value: "Electronics", label: "Electronics" },
        { value: "Machinery", label: "Machinery" },
        { value: "Raw Materials", label: "Raw Materials" },
        { value: "Packaging", label: "Packaging" }
      ]
    },
    { label: "Current Stock", name: "currentStock", type: "number", placeholder: "0", required: true },
    { label: "Reorder Level", name: "reorderLevel", type: "number", placeholder: "0", required: true },
    { label: "Price ($)", name: "price", type: "number", placeholder: "0.00", required: true },
  ];

  const editProductFields: EditField<Product>[] = [
    { label: "SKU", name: "sku", type: "text", disabled: true },
    { label: "Product Name", name: "name", type: "text", placeholder: "Enter name", required: true },
    { 
      label: "Category", 
      name: "category", 
      type: "select", 
      required: true,
      options: [
        { value: "Electronics", label: "Electronics" },
        { value: "Machinery", label: "Machinery" },
        { value: "Raw Materials", label: "Raw Materials" },
        { value: "Packaging", label: "Packaging" }
      ]
    },
    { label: "Current Stock", name: "currentStock", type: "number", placeholder: "0", required: true },
    { label: "Reorder Level", name: "reorderLevel", type: "number", placeholder: "0", required: true },
    { label: "Price ($)", name: "price", type: "number", placeholder: "0.00", required: true },
  ];

  const filteredProducts = state.products.filter((p) =>
    [p.sku, p.name, p.category].join(" ").toLowerCase().includes(state.searchQuery.toLowerCase())
  );

  const getStockStatus = (current: number, reorder: number) => {
    if (current === 0) return { label: "Out of Stock", variant: "destructive" as const };
    if (current <= reorder) return { label: "Low Stock", variant: "outline" as const };
    return { label: "In Stock", variant: "secondary" as const };
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory</h1>
          <p className="text-muted-foreground">Manage products with automated SKU generation.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm"><Upload className="h-4 w-4 mr-2" />Import</Button>
          <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-2" />Export</Button>
          <AddModal<Product>
            title="Add New Product"
            description="Fill in the details to create a new product in inventory"
            fields={productFields}
            initialData={{ 
                sku: generatedSku, 
                currentStock: 0, 
                reorderLevel: 0,
                category: "Electronics",
                name: "",
                price: 0,
                unit: "pcs",
                status: "active"
            }}
            onSubmit={(data) => dispatch({ type: "ADD_PRODUCT", payload: data })}
            triggerLabel="Add Product"
            triggerSize="sm"
            submitLabel="Create Product"
            size="lg"
          />
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          className="pl-10"
          placeholder="Search products..."
          value={state.searchQuery}
          onChange={(e) => dispatch({ type: "SET_SEARCH", payload: e.target.value })}
        />
      </div>

      <div className="rounded-md border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={state.selectedProducts.length === state.products.length && state.products.length > 0}
                  onCheckedChange={() => dispatch({ type: "TOGGLE_SELECT_ALL" })}
                />
              </TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((p) => {
              const stock = getStockStatus(p.currentStock, p.reorderLevel);
              return (
                <TableRow key={p.sku}>
                  <TableCell>
                    <Checkbox
                      checked={state.selectedProducts.includes(p.sku)}
                      onCheckedChange={() => dispatch({ type: "TOGGLE_SELECT", payload: p.sku })}
                    />
                  </TableCell>
                  <TableCell className="font-mono font-medium">{p.sku}</TableCell>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell>{p.category}</TableCell>
                  <TableCell>{p.currentStock}</TableCell>
                  <TableCell>${Number(p.price).toFixed(2)}</TableCell>
                  <TableCell><Badge variant={stock.variant}>{stock.label}</Badge></TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <EditModal<Product>
                            title="Edit Product"
                            description="Update product information"
                            fields={editProductFields}
                            data={p}
                            onSubmit={(data) => dispatch({ type: "UPDATE_PRODUCT", payload: data as Product })}
                            triggerLabel="Edit"
                            triggerSize="sm"
                            submitLabel="Update Product"
                            size="lg"
                          />
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-destructive"
                          onClick={() => dispatch({ type: "DELETE_PRODUCT", payload: p.sku })}
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

export default AllProducts;