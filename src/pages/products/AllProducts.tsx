import AddModal, { AddField } from "@/components/modals/AddModal";
import DeleteModal from "@/components/modals/DeleteModal";
import EditModal, { EditField } from "@/components/modals/EditModal";
import { ColumnDef, DataTable } from "@/components/table/DataTable";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { useReducer } from "react";

const CURRENT_USER = "Admin";

interface Product {
  id: string;
  name: string;
  sku: string;
  barcode: string;
  brand: string;
  category: string;
  stock: number;
  status: "active" | "inactive";
  createdAt: string;
  updatedBy: string;
}

type State = { products: Product[] };
type Action =
  | { type: "DELETE_PRODUCT"; payload: string }
  | { type: "ADD_PRODUCT"; payload: Product }
  | { type: "UPDATE_PRODUCT"; payload: Product };

const initialProducts: Product[] = [
  {
    id: "1",
    name: "iPhone 15",
    sku: "IP15",
    barcode: "123456789012",
    brand: "Apple",
    category: "Smartphones",
    stock: 50,
    status: "active",
    createdAt: "2024-01-10",
    updatedBy: "-",
  },
];

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_PRODUCT":
      return { products: [{ ...action.payload, updatedBy: CURRENT_USER }, ...state.products] };
    case "UPDATE_PRODUCT":
      return {
        products: state.products.map((p) =>
          p.id === action.payload.id ? { ...action.payload, updatedBy: CURRENT_USER } : p
        ),
      };
    case "DELETE_PRODUCT":
      return { products: state.products.filter((p) => p.id !== action.payload) };
    default:
      return state;
  }
};

export default function AllProducts() {
  const [state, dispatch] = useReducer(reducer, { products: initialProducts });

  const productFields: AddField<Product>[] = [
    { label: "Product Name", name: "name", type: "text", required: true },
    { label: "SKU", name: "sku", type: "text", required: true },
    { label: "Barcode", name: "barcode", type: "text" },
    { label: "Brand", name: "brand", type: "text" },
    { label: "Category", name: "category", type: "text" },
    { label: "Stock", name: "stock", type: "number" },
    {
      label: "Status",
      name: "status",
      type: "select",
      options: [
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
      ],
    },
  ];

  const editProductFields: EditField<Product>[] = productFields;

  const columns: ColumnDef<Product>[] = [
    { key: "name", label: "Product Name" },
    { key: "sku", label: "SKU" },
    { key: "barcode", label: "Barcode" },
    { key: "brand", label: "Brand" },
    { key: "category", label: "Category" },
    { key: "stock", label: "Stock" },
    { key: "status", label: "Status" },
    { key: "createdAt", label: "Created" },
    { key: "updatedBy", label: "Updated By" },
  ];

  const renderActions = (product: Product) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <EditModal<Product>
          title="Edit Product"
          fields={editProductFields}
          data={product}
          onSubmit={(data) => dispatch({ type: "UPDATE_PRODUCT", payload: data })}
          triggerLabel="Edit"
          submitLabel="Update"
        />
        <DeleteModal
          title="Delete Product"
          description={`Delete "${product.name}"?`}
          onSubmit={() => dispatch({ type: "DELETE_PRODUCT", payload: product.id })}
          triggerLabel="Delete"
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );

  // Stat cards data
  const totalProducts = state.products.length;
  const activeProducts = state.products.filter((p) => p.status === "active").length;
  const inactiveProducts = state.products.filter((p) => p.status === "inactive").length;
  const totalStock = state.products.reduce((sum, p) => sum + p.stock, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">All Products</h1>
          <p className="page-description">Manage your products inventory</p>
        </div>
        <AddModal<Product>
          title="Add New Product"
          fields={productFields}
          initialData={{
            id: crypto.randomUUID(),
            name: "",
            sku: "",
            barcode: "",
            brand: "",
            category: "",
            stock: 0,
            status: "active",
            createdAt: new Date().toISOString().split("T")[0],
            updatedBy: CURRENT_USER,
          }}
          onSubmit={(data) => dispatch({ type: "ADD_PRODUCT", payload: data })}
          triggerLabel="Add Product"
          submitLabel="Create"
          size="lg"
        />
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="stat-card">
          <p className="stat-label">Total Products</p>
          <p className="stat-value">{totalProducts}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Active</p>
          <p className="stat-value">{activeProducts}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Inactive</p>
          <p className="stat-value">{inactiveProducts}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Total Stock</p>
          <p className="stat-value">{totalStock}</p>
        </div>
      </div>

      {/* DataTable */}
      <DataTable data={state.products} columns={columns} actions={renderActions} pageSize={10} />
    </div>
  );
}
