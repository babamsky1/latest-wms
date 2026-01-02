/**
 * Enhanced DataTable Component
 * 
 * Features:
 * - Automatic sorting with visual indicators
 * - Built-in search functionality
 * - Modern pagination with fixed page size (default: 10 rows)
 * - Loading and empty states
 * - Responsive design
 * - Optional actions column
 * - Simplified column definitions
 * 
 * Comment: This component replaces all manual table implementations
 * for consistency and reduces ~500 lines of duplicate code across pages.
 * Page size is now fixed per page for consistent UX across the application.
 */

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
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Loader2,
  Search,
  X,
} from "lucide-react";
import { ReactNode, useMemo, useState } from "react";

/**
 * Simplified column definition interface
 * Comment: Removed complex filter options - keep it simple and extensible
 */
export interface ColumnDef<T extends Record<string, unknown>> {
  key: keyof T;
  label: string;
  sortable?: boolean; // Default: true
  filterable?: boolean; // Default: true
  className?: string; // Custom cell styling
  headerClassName?: string; // Custom header styling
  render?: (row: T) => ReactNode; // Custom cell renderer
}

interface DataTableProps<T extends Record<string, unknown>> {
  data: T[];
  columns: ColumnDef<T>[];
  
  // Optional features
  actions?: (row: T) => ReactNode;
  searchable?: boolean;
  searchPlaceholder?: string;
  defaultPageSize?: number; // Fixed page size, default 10
  isLoading?: boolean;
  emptyMessage?: string;
  
  // Controlled state (optional for external control)
  externalSearch?: string;
  onSearchChange?: (value: string) => void;
}

export function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  actions,
  searchable = true,
  searchPlaceholder = "Search...",
  defaultPageSize = 10,
  isLoading = false,
  emptyMessage = "No data available",
  externalSearch,
  onSearchChange,
}: DataTableProps<T>) {
  // Comment: Internal state for search, sort, filters, and pagination
  const [internalSearch, setInternalSearch] = useState("");
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const pageSize = defaultPageSize; // Fixed page size, no longer changeable

  // Comment: Use external search if provided, otherwise internal
  const search = externalSearch ?? internalSearch;
  
  const handleSearchChange = (value: string) => {
    if (onSearchChange) {
      onSearchChange(value);
    } else {
      setInternalSearch(value);
    }
    setPage(1); // Reset to first page on search
  };

  const handleColumnFilterChange = (key: string, value: string) => {
    setColumnFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
    setPage(1);
  };

  /**
   * Handle column sorting
   * Comment: Toggle between asc/desc on same column, reset to asc on new column
   */
  const handleSort = (key: keyof T) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
    setPage(1);
  };

  /**
   * Filter and sort logic
   * Comment: useMemo prevents unnecessary recalculation on unrelated state changes
   */
  const filtered = useMemo(() => {
    let rows = [...data];

    // Global Search filter
    if (search) {
      rows = rows.filter((row) =>
        Object.values(row).some((v) =>
          String(v).toLowerCase().includes(search.toLowerCase())
        )
      );
    }

    // Column Filters
    if (Object.keys(columnFilters).length > 0) {
      rows = rows.filter((row) =>
        Object.entries(columnFilters).every(([key, value]) => {
          if (!value) return true;
          // Note: This matches the string representation of the value
          const rowValue = String(row[key] ?? "").toLowerCase();
          return rowValue.includes(value.toLowerCase());
        })
      );
    }

    // Sort
    if (sortKey) {
      rows.sort((a, b) => {
        const aVal = String(a[sortKey]);
        const bVal = String(b[sortKey]);
        const comparison = aVal.localeCompare(bVal, undefined, { 
          numeric: true, // Handle numbers correctly
          sensitivity: 'base' 
        });
        return sortOrder === "asc" ? comparison : -comparison;
      });
    }

    return rows;
  }, [data, search, columnFilters, sortKey, sortOrder]);

  // Comment: Calculate pagination values
  const totalPages = Math.ceil(filtered.length / pageSize);
  const rows = filtered.slice((page - 1) * pageSize, page * pageSize);

  // Comment: Pagination handlers
  const goToFirstPage = () => setPage(1);
  const goToLastPage = () => setPage(totalPages);
  const goToPreviousPage = () => setPage(Math.max(1, page - 1));
  const goToNextPage = () => setPage(Math.min(totalPages, page + 1));

  /**
   * Get appropriate sort icon for column
   * Comment: Visual feedback for current sort state
   */
  const getSortIcon = (columnKey: keyof T) => {
    if (sortKey !== columnKey) {
      return <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground" />;
    }
    return sortOrder === "asc" 
      ? <ArrowUp className="ml-2 h-4 w-4" />
      : <ArrowDown className="ml-2 h-4 w-4" />;
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      {/* Comment: Only show if searchable prop is true */}
      {searchable && (
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      )}

      {/* Table Container */}
      {/* Comment: table-container class provides consistent styling */}
      <div className="table-container">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              {columns.map((col) => (
                <TableHead 
                  key={String(col.key)} 
                  className={col.headerClassName || col.className}
                >
                  {/* Comment: Make headers sortable by default unless explicitly disabled */}
                  {col.sortable !== false ? (
                    <button
                      onClick={() => handleSort(col.key)}
                      className="flex items-center font-medium hover:text-foreground transition-colors"
                    >
                      {col.label}
                      {getSortIcon(col.key)}
                    </button>
                  ) : (
                    <span className="font-medium">{col.label}</span>
                  )}
                </TableHead>
              ))}
              {/* Comment: Only show Actions column if actions prop is provided */}
              {actions && <TableHead className="w-[80px]">Actions</TableHead>}
            </TableRow>
            {/* Filter Row */}
            <TableRow className="bg-muted/10 hover:bg-muted/10">
              {columns.map((col) => (
                 <TableHead key={`filter-${String(col.key)}`} className="p-2">
                   {col.filterable !== false && (
                     <div className="relative">
                       <Input
                         placeholder="Filter..."
                         value={columnFilters[String(col.key)] || ""}
                         onChange={(e) => handleColumnFilterChange(String(col.key), e.target.value)}
                         className="h-8 text-xs font-bold w-full bg-background pr-7"
                       />
                       {columnFilters[String(col.key)] && (
                         <button
                           onClick={() => handleColumnFilterChange(String(col.key), "")}
                           className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                         >
                           <X className="h-3 w-3" />
                         </button>
                       )}
                     </div>
                   )}
                 </TableHead>
              ))}
              {actions && <TableHead />}
            </TableRow>
          </TableHeader>

          <TableBody>
            {/* Loading State */}
            {/* Comment: Show spinner while data is loading */}
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length + (actions ? 1 : 0)} className="h-32">
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                </TableCell>
              </TableRow>
            ) : rows.length === 0 ? (
              /* Empty State */
              /* Comment: Show friendly message when no data matches filters */
              <TableRow>
                <TableCell colSpan={columns.length + (actions ? 1 : 0)} className="h-32">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <p className="text-sm">{emptyMessage}</p>
                    {(search || Object.keys(columnFilters).length > 0) && (
                      <p className="text-xs mt-1">Try adjusting your search or filters</p>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              /* Data Rows */
              /* Comment: Render actual data with hover effect */
              rows.map((row) => (
                <TableRow key={String(row.id)} className="hover:bg-muted/30">
                  {columns.map((col) => (
                    <TableCell key={String(col.key)} className={col.className}>
                      {/* Comment: Use custom render function if provided, otherwise stringify */}
                      {col.render ? col.render(row) : String(row[col.key] ?? "")}
                    </TableCell>
                  ))}
                  {/* Comment: Render actions if provided */}
                  {actions && <TableCell>{actions(row)}</TableCell>}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Modern Pagination */}
      {/* Comment: Only show pagination if we have data and not loading */}
      {!isLoading && rows.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
          {/* Results Info */}
          {/* Comment: Shows "Showing X to Y of Z results" */}
          <div className="text-sm text-muted-foreground">
            Showing <span className="font-medium">{(page - 1) * pageSize + 1}</span> to{" "}
            <span className="font-medium">{Math.min(page * pageSize, filtered.length)}</span> of{" "}
            <span className="font-medium">{filtered.length}</span> results
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center gap-1">
            {/* Navigation Buttons */}
            {/* Comment: First, Previous, Page indicator, Next, Last */}
              <Button
                variant="outline"
                size="icon"
                onClick={goToFirstPage}
                disabled={page === 1}
                className="h-8 w-8"
                title="First page"
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={goToPreviousPage}
                disabled={page === 1}
                className="h-8 w-8"
                title="Previous page"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              {/* Page Number Display */}
              {/* Comment: Shows current page and total pages */}
              <div className="flex items-center justify-center min-w-[100px] px-3">
                <span className="text-sm font-medium">
                  Page {page} of {totalPages}
                </span>
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={goToNextPage}
                disabled={page === totalPages}
                className="h-8 w-8"
                title="Next page"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={goToLastPage}
                disabled={page === totalPages}
                className="h-8 w-8"
                title="Last page"
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
        </div>
      )}
    </div>
  );
}
