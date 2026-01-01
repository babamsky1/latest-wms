import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import AddModal, { AddField } from "@/components/modals/AddModal";
import EditModal, { EditField } from "@/components/modals/EditModal";
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
import { FolderTree, MoreHorizontal, Search, Trash2 } from "lucide-react";
import { useReducer } from "react";

interface Category {
  id: string;
  name: string;
  parentCategory: string | null;
  productCount: number;
  status: "active" | "inactive";
  createdAt: string;
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
  { id: "1", name: "Electronics", parentCategory: null, productCount: 245, status: "active", createdAt: "2024-01-10" },
  { id: "2", name: "Smartphones", parentCategory: "Electronics", productCount: 89, status: "active", createdAt: "2024-01-10" },
  { id: "3", name: "Laptops", parentCategory: "Electronics", productCount: 56, status: "active", createdAt: "2024-01-11" },
  { id: "4", name: "Raw Materials", parentCategory: null, productCount: 312, status: "active", createdAt: "2024-01-08" },
  { id: "5", name: "Packaging", parentCategory: null, productCount: 78, status: "active", createdAt: "2024-01-09" },
  { id: "6", name: "Machinery Parts", parentCategory: null, productCount: 156, status: "active", createdAt: "2024-01-12" },
  { id: "7", name: "Obsolete Items", parentCategory: null, productCount: 23, status: "inactive", createdAt: "2024-01-05" },
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
          { ...action.payload, status: "active", productCount: 0, createdAt: new Date().toISOString().split('T')[0] },
          ...state.categories,
        ],
      };
    case "UPDATE_CATEGORY":
      return {
        ...state,
        categories: state.categories.map((c) => c.id === action.payload.id ? action.payload : c),
      };
    default:
      return state;
  }
};

const Categories = () => {
  const [state, dispatch] = useReducer(reducer, {
    categories: initialCategories,
    searchQuery: "",
  });

  // Form fields configuration
  const categoryFields: AddField<Category>[] = [
    { label: "Category Name", name: "name", type: "text", placeholder: "Enter category name", required: true },
    { 
      label: "Parent Category", 
      name: "parentCategory", 
      type: "select",
      options: [
        { value: "", label: "None (Root)" },
        { value: "Electronics", label: "Electronics" },
        { value: "Raw Materials", label: "Raw Materials" },
        { value: "Packaging", label: "Packaging" },
        { value: "Machinery Parts", label: "Machinery Parts" }
      ]
    },
  ];

  const editCategoryFields: EditField<Category>[] = [
    { label: "Category Name", name: "name", type: "text", placeholder: "Enter category name", required: true },
    { 
      label: "Parent Category", 
      name: "parentCategory", 
      type: "select",
      options: [
        { value: "", label: "None (Root)" },
        { value: "Electronics", label: "Electronics" },
        { value: "Raw Materials", label: "Raw Materials" },
        { value: "Packaging", label: "Packaging" },
        { value: "Machinery Parts", label: "Machinery Parts" }
      ]
    },
    { 
      label: "Status", 
      name: "status", 
      type: "select",
      options: [
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" }
      ]
    },
  ];

  const filteredCategories = state.categories.filter((cat) =>
    cat.name.toLowerCase().includes(state.searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title">Categories</h1>
            <p className="page-description">Organize products into categories and subcategories</p>
          </div>
          <AddModal<Category>
            title="Add New Category"
            description="Create a new product category"
            fields={categoryFields}
            initialData={{
              id: String(Date.now()),
              name: "",
              parentCategory: null,
              productCount: 0,
              status: "active",
              createdAt: new Date().toISOString().split('T')[0],
            }}
            onSubmit={(data) => dispatch({ type: "ADD_CATEGORY", payload: { ...data, parentCategory: data.parentCategory || null } as Category })}
            triggerLabel="Add Category"
            submitLabel="Create Category"
            size="lg"
          />
        </div>
      </div>

      <div className="content-section">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search categories..."
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
              <TableHead>Category Name</TableHead>
              <TableHead>Parent Category</TableHead>
              <TableHead>Products</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCategories.map((category) => (
              <TableRow key={category.id} className="hover:bg-muted/30">
                <TableCell>
                  <div className="flex items-center gap-2">
                    <FolderTree className="h-4 w-4 text-primary" />
                    <span className="font-medium">{category.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-left gap-2">
                  {category.parentCategory ? (
                    <Badge variant="default">{category.parentCategory}</Badge>
                  ) : (
                    <span className="text-muted-foreground">Root</span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="font-semibold">{category.productCount}</TableCell>
                <TableCell>
                  <span className={`status-badge ${category.status === "active" ? "status-active" : "status-inactive"}`}>
                    {category.status}
                  </span>
                </TableCell>
                <TableCell className="text-muted-foreground">{category.createdAt}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <EditModal<Category>
                          title="Edit Category"
                          description="Update category details"
                          fields={editCategoryFields}
                          data={category}
                          onSubmit={(data) => dispatch({ type: "UPDATE_CATEGORY", payload: data as Category })}
                          triggerLabel="Edit"
                          triggerSize="sm"
                          submitLabel="Update Category"
                          size="lg"
                        />
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => dispatch({ type: "DELETE_CATEGORY", payload: category.id })}
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

export default Categories;
