import AddModal, { AddField } from "@/components/modals/AddModal";
import DeleteModal from "@/components/modals/DeleteModal";
import EditModal, { EditField } from "@/components/modals/EditModal";
import { ColumnDef, DataTable } from "@/components/table/DataTable"; // your DataTable
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { FolderTree, MoreHorizontal, Settings } from "lucide-react";
import { useReducer } from "react";

interface Category {
  id: string;
  name: string;
  productCount: number;
  status: "active" | "inactive";
  createdAt: string;
  [key: string]: string | number | null;
}

type State = {
  categories: Category[];
  searchQuery: string;
};

type Action =
  | { type: "SET_SEARCH"; payload: string }
  | { type: "DELETE_CATEGORY"; payload: string }
  | { type: "ADD_CATEGORY"; payload: Category }
  | { type: "UPDATE_CATEGORY"; payload: Category };

const initialCategories: Category[] = [
  { id: "1", name: "Electronics", productCount: 245, status: "active", createdAt: "2024-01-10" },
  { id: "2", name: "Smartphones", productCount: 89, status: "active", createdAt: "2024-01-10" },
  { id: "3", name: "Laptops", productCount: 56, status: "active", createdAt: "2024-01-11" },
  { id: "4", name: "Raw Materials", productCount: 312, status: "active", createdAt: "2024-01-08" },
  { id: "5", name: "Packaging", productCount: 78, status: "active", createdAt: "2024-01-09" },
  { id: "6", name: "Machinery Parts", productCount: 156, status: "active", createdAt: "2024-01-12" },
  { id: "7", name: "Obsolete Items", productCount: 23, status: "inactive", createdAt: "2024-01-05" },
];

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_SEARCH":
      return { ...state, searchQuery: action.payload };
    case "DELETE_CATEGORY":
      return { ...state, categories: state.categories.filter((c) => c.id !== action.payload) };
    case "ADD_CATEGORY":
      return {
        ...state,
        categories: [
          { ...action.payload, status: "active", productCount: 0, createdAt: new Date().toISOString().split("T")[0] },
          ...state.categories,
        ],
      };
    case "UPDATE_CATEGORY":
      return {
        ...state,
        categories: state.categories.map((c) => (c.id === action.payload.id ? action.payload : c)),
      };
    default:
      return state;
  }
};

const Categories = () => {
  const [state, dispatch] = useReducer(reducer, { categories: initialCategories, searchQuery: "" });

  // Form fields for Add/Edit
  const categoryFields: AddField<Category>[] = [
    { label: "Category Name", name: "name", type: "text", placeholder: "Enter category name", required: true },
  ];

  const editCategoryFields: EditField<Category>[] = [
    ...categoryFields,
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

  // Define columns for DataTable
  const columns: ColumnDef<Category>[] = [
    {
      key: "name",
      label: "Category Name",
      sortable: true,
      filterable: true,
      filterType: "text",
      render: (row) => (
        <div className="flex items-center gap-2">
          <FolderTree className="h-4 w-4 text-primary" />
          <span className="font-medium">{row.name}</span>
        </div>
      ),
    },
    { key: "productCount", label: "Products", sortable: true },
    {
      key: "status",
      label: "Status",
      sortable: true,
      filterable: true,
      filterType: "select",
      filterOptions: [
        { value: "", label: "All" },
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
      ],
      render: (row) => (
        <span className={`status-badge ${row.status === "active" ? "status-active" : "status-inactive"}`}>
          {row.status}
        </span>
      ),
    },
    {
      key: "createdAt",
      label: "Created",
      sortable: true,
      filterable: true,
      filterType: "date", // will show date picker
    },
  ];

  // Actions column
  const actions = (category: Category) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="p-2 w-auto min-w-[120px]">
        <div className="flex flex-col gap-2 w-full">
          <EditModal<Category>
            title="Edit Category"
            description="Update category details"
            fields={editCategoryFields}
            data={category}
            onSubmit={(data) => dispatch({ type: "UPDATE_CATEGORY", payload: data })}
            triggerLabel="Edit"
            triggerSize="default"
            submitLabel="Update Category"
            size="lg"
          />
          <DeleteModal
            title="Delete Category"
            description={`Are you sure you want to delete "${category.name}"? This action cannot be undone.`}
            onSubmit={() => dispatch({ type: "DELETE_CATEGORY", payload: category.id })}
            triggerLabel="Delete"
            triggerSize="default"
          />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <div className="space-y-6">
      {/* Header + Add Button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Categories</h1>
          <p className="page-description">Organize products into categories</p>
        </div>

        <AddModal<Category>
          title="Add New Category"
          description="Create a new product category"
          fields={categoryFields}
          initialData={{
            id: String(Date.now()),
            name: "",
            productCount: 0,
            status: "active",
            createdAt: new Date().toISOString().split("T")[0],
          }}
          onSubmit={(data) => dispatch({ type: "ADD_CATEGORY", payload: data })}
          triggerLabel="Add Category"
          submitLabel="Create Category"
          size="lg"
        />
      </div>

      {/* Stat card */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <Settings className="h-5 w-5 text-primary" />
            <div>
              <p className="stat-label">Total Categories</p>
              <p className="stat-value">{state.categories.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* DataTable with search, filters, and actions */}
      <DataTable<Category>
        data={state.categories}
        columns={columns}
        searchPlaceholder="Search categories..."
        actions={actions}
        pageSize={10}
      />
    </div>
  );
};

export default Categories;
