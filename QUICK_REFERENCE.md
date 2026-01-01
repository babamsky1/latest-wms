# Quick Reference - UI Components & Design System

## Button Component Usage

### Valid Variants
```tsx
// All valid Button variants:
<Button variant="default">Primary Action</Button>          // Default (primary color)
<Button variant="secondary">Secondary</Button>            // Secondary color
<Button variant="destructive">Delete</Button>             // Red/danger color
<Button variant="outline">Outlined</Button>               // Border only
<Button variant="ghost">Ghost</Button>                    // No background
<Button variant="link">Link</Button>                      // Text link style
```

### With Icons
```tsx
import { Plus, Search, Edit, Trash2, MoreHorizontal } from "lucide-react";

<Button><Plus className="h-4 w-4 mr-2" />Add Item</Button>
<Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
```

### Sizes
```tsx
<Button size="default">Default</Button>  // h-10 px-4
<Button size="sm">Small</Button>         // h-9 rounded-md px-3
<Button size="lg">Large</Button>         // h-11 rounded-md px-8
<Button size="icon">Icon</Button>        // h-10 w-10 (for icon-only buttons)
```

## Page Layout Template

```tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search } from "lucide-react";
import { useReducer } from "react";

const YourPage = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title">Page Title</h1>
            <p className="page-description">Description of the page</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add New
          </Button>
        </div>
      </div>

      {/* Stats Cards (Optional) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <IconComponent className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="stat-label">Stat Label</p>
              <p className="stat-value">123</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search/Filter Section */}
      <div className="content-section">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={state.searchQuery}
              onChange={(e) => dispatch({ type: "SET_SEARCH", payload: e.target.value })}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="table-container">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Column 1</TableHead>
              <TableHead>Column 2</TableHead>
              <TableHead>Column 3</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((item) => (
              <TableRow key={item.id} className="hover:bg-muted/30">
                <TableCell className="font-mono font-medium">{item.code}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.value}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem><Edit className="h-4 w-4 mr-2" />Edit</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
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

export default YourPage;
```

## Status Badges

```tsx
// Status Badge Pattern
const getStatusBadge = (status: string) => {
  const config = {
    active: { class: "status-active", icon: CheckCircle },
    pending: { class: "status-warning", icon: Clock },
    inactive: { class: "status-inactive", icon: X },
  };
  const { class: className, icon: Icon } = config[status];
  return (
    <span className={`status-badge ${className}`}>
      <Icon className="h-3 w-3 mr-1" />
      {status}
    </span>
  );
};
```

## Common Icon Imports

```tsx
import {
  Plus,              // Add button
  Search,            // Search input
  Edit,              // Edit action
  Trash2,            // Delete action
  MoreHorizontal,    // Action menu
  Eye,               // View action
  Download,          // Export/Download
  Upload,            // Import/Upload
  Filter,            // Filter action
  ChevronRight,      // Navigation
  Clock,             // Status - pending
  CheckCircle,       // Status - active/completed
  AlertTriangle,     // Status - warning
  Package,           // Inventory item
  Warehouse,         // Location
  Building2,         // Company/Supplier
  Users,             // User management
  Settings,          // Configuration
} from "lucide-react";
```

## Reducer Pattern (useReducer)

```tsx
type State = {
  items: Item[];
  searchQuery: string;
};

type Action =
  | { type: "SET_SEARCH"; payload: string }
  | { type: "DELETE_ITEM"; payload: string }
  | { type: "ADD_ITEM"; payload: Item };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_SEARCH":
      return { ...state, searchQuery: action.payload };
    case "DELETE_ITEM":
      return { ...state, items: state.items.filter(i => i.id !== action.payload) };
    case "ADD_ITEM":
      return { ...state, items: [action.payload, ...state.items] };
    default:
      return state;
  }
};
```

## CSS Classes Reference

### Layout
- `space-y-6` - Vertical spacing between sections
- `page-header` - Main page header container
- `content-section` - Content/filter section with border
- `table-container` - Table wrapper

### Typography
- `page-title` - Large page title (text-2xl font-bold)
- `page-description` - Subtitle text (muted-foreground)
- `stat-label` - Stat card label
- `stat-value` - Stat card value (large number)

### Cards
- `stat-card` - Statistics card styling
- Hover effect: `hover:bg-muted/30`

### Colors
- `text-primary` - Primary color
- `text-destructive` - Red/danger color
- `text-warning` - Warning/orange color
- `text-success` - Green/success color
- `text-muted-foreground` - Muted gray text
- `bg-primary/10` - Light primary background
- `bg-destructive/10` - Light red background
- `bg-warning/10` - Light warning background
- `bg-success/10` - Light green background

## Don't Use
❌ `variant="primary"` - Use `variant="default"` instead
❌ Custom inline styles - Use Tailwind classes
❌ Multiple different component systems - Use UI components only
❌ Custom button classes - Use Button component with variants
