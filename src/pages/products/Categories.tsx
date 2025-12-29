import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { Edit, FolderTree, MoreHorizontal, Plus, Search, Trash2 } from "lucide-react";
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
  | { type: "DELETE_CATEGORY"; payload: string };

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
    default:
      return state;
  }
};

const Categories = () => {
  const [state, dispatch] = useReducer(reducer, {
    categories: initialCategories,
    searchQuery: "",
  });

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
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Button>
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
                      <DropdownMenuItem><Edit className="h-4 w-4 mr-2" />Edit</DropdownMenuItem>
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
