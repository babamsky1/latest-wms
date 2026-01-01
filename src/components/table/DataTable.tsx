import { useState, useMemo, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDown, ChevronUp, ChevronsUpDown, Filter, X, ChevronLeft, ChevronRight } from "lucide-react";

export interface ColumnDef<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  filterType?: "text" | "select" | "date";
  filterOptions?: { value: string; label: string }[];
  render?: (row: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  searchable?: boolean;
  searchPlaceholder?: string;
  pageSize?: number;
  actions?: (row: T) => ReactNode;
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
}

type SortDirection = "asc" | "desc" | null;

export function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  searchable = true,
  searchPlaceholder = "Search...",
  pageSize = 10,
  actions,
  onRowClick,
  emptyMessage = "No data found",
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});
  const [currentPage, setCurrentPage] = useState(1);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      if (sortDirection === "asc") setSortDirection("desc");
      else if (sortDirection === "desc") {
        setSortDirection(null);
        setSortKey(null);
      }
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  const handleColumnFilter = (key: string, value: string) => {
    setColumnFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
    setCurrentPage(1);
  };

  const clearColumnFilter = (key: string) => {
    setColumnFilters((prev) => {
      const { [key]: _, ...rest } = prev;
      return rest;
    });
  };

  const filteredAndSortedData = useMemo(() => {
    let result = [...data];

    // Global search
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter((row) =>
        columns.some((col) => {
          const value = row[col.key as keyof T];
          return String(value ?? "").toLowerCase().includes(searchLower);
        })
      );
    }

    // Column filters
    Object.entries(columnFilters).forEach(([key, value]) => {
      if (value) {
        result = result.filter((row) => {
          const rowValue = row[key as keyof T];
          return String(rowValue ?? "").toLowerCase().includes(value.toLowerCase());
        });
      }
    });

    // Sorting
    if (sortKey && sortDirection) {
      result.sort((a, b) => {
        const aVal = a[sortKey as keyof T];
        const bVal = b[sortKey as keyof T];
        
        if (aVal == null) return 1;
        if (bVal == null) return -1;
        
        const comparison = String(aVal).localeCompare(String(bVal), undefined, { numeric: true });
        return sortDirection === "asc" ? comparison : -comparison;
      });
    }

    return result;
  }, [data, search, columnFilters, sortKey, sortDirection, columns]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedData.length / pageSize);
  const paginatedData = filteredAndSortedData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const getSortIcon = (key: string) => {
    if (sortKey !== key) return <ChevronsUpDown className="h-4 w-4 ml-1 opacity-50" />;
    if (sortDirection === "asc") return <ChevronUp className="h-4 w-4 ml-1" />;
    return <ChevronDown className="h-4 w-4 ml-1" />;
  };

  return (
    <div className="space-y-4">
      {/* Search and active filters */}
      {searchable && (
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 max-w-sm">
            <Input
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-4"
            />
          </div>
          {Object.entries(columnFilters).map(([key, value]) => {
            const col = columns.find((c) => c.key === key);
            return (
              <div
                key={key}
                className="flex items-center gap-1 px-2 py-1 bg-muted rounded-md text-sm"
              >
                <span className="text-muted-foreground">{col?.label}:</span>
                <span className="font-medium">{value}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0 ml-1"
                  onClick={() => clearColumnFilter(key)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            );
          })}
        </div>
      )}

      {/* Table */}
      <div className="table-container">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              {columns.map((col) => (
                <TableHead key={String(col.key)} className={col.className}>
                  <div className="flex items-center gap-1">
                    {col.sortable ? (
                      <button
                        className="flex items-center font-medium hover:text-foreground transition-colors"
                        onClick={() => handleSort(String(col.key))}
                      >
                        {col.label}
                        {getSortIcon(String(col.key))}
                      </button>
                    ) : (
                      <span>{col.label}</span>
                    )}
                    
                    {col.filterable && (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className={`h-6 w-6 ${columnFilters[String(col.key)] ? "text-primary" : "opacity-50"}`}
                          >
                            <Filter className="h-3 w-3" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-64 p-3 bg-popover" align="start">
                          <div className="space-y-2">
                            <p className="text-sm font-medium">Filter {col.label}</p>
                            {col.filterType === "select" && col.filterOptions ? (
                              <Select
                                value={columnFilters[String(col.key)] || ""}
                                onValueChange={(value) => handleColumnFilter(String(col.key), value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select..." />
                                </SelectTrigger>
                                <SelectContent>
                                  {col.filterOptions.map((opt) => (
                                    <SelectItem key={opt.value} value={opt.value}>
                                      {opt.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            ) : (
                              <Input
                                placeholder={`Filter by ${col.label.toLowerCase()}...`}
                                value={columnFilters[String(col.key)] || ""}
                                onChange={(e) => handleColumnFilter(String(col.key), e.target.value)}
                              />
                            )}
                            {columnFilters[String(col.key)] && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="w-full"
                                onClick={() => clearColumnFilter(String(col.key))}
                              >
                                Clear filter
                              </Button>
                            )}
                          </div>
                        </PopoverContent>
                      </Popover>
                    )}
                  </div>
                </TableHead>
              ))}
              {actions && <TableHead className="w-[80px]">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (actions ? 1 : 0)}
                  className="text-center text-muted-foreground py-8"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row, idx) => (
                <TableRow
                  key={(row.id as string) || idx}
                  className={`hover:bg-muted/30 ${onRowClick ? "cursor-pointer" : ""}`}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((col) => (
                    <TableCell key={String(col.key)} className={col.className}>
                      {col.render ? col.render(row) : String(row[col.key as keyof T] ?? "")}
                    </TableCell>
                  ))}
                  {actions && (
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      {actions(row)}
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-2">
          <p className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * pageSize + 1} to{" "}
            {Math.min(currentPage * pageSize, filteredAndSortedData.length)} of{" "}
            {filteredAndSortedData.length} entries
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let page: number;
                if (totalPages <= 5) {
                  page = i + 1;
                } else if (currentPage <= 3) {
                  page = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  page = totalPages - 4 + i;
                } else {
                  page = currentPage - 2 + i;
                }
                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    className="w-8"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                );
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
