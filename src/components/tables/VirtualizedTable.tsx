/**
 * Virtualized Table Component - High-performance table with virtualization
 * Uses TanStack Table for handling datasets efficiently
 *
 * Note: Virtualization temporarily disabled - implement react-window later if needed
 */

import React, { useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  flexRender,
} from '@tanstack/react-table';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface VirtualizedTableProps<T> {
  /** Table data array */
  data: T[];
  /** Column definitions */
  columns: ColumnDef<T, any>[];
  /** Table height in pixels */
  height?: number;
  /** Row height in pixels */
  rowHeight?: number;
  /** Enable sorting */
  enableSorting?: boolean;
  /** Enable filtering */
  enableFiltering?: boolean;
  /** Global filter placeholder */
  filterPlaceholder?: string;
  /** Additional CSS classes */
  className?: string;
  /** Loading state */
  loading?: boolean;
  /** Empty state message */
  emptyMessage?: string;
}

/**
 * Virtualized table component for handling large datasets efficiently
 * Features: sorting, filtering, virtualization, and customizable columns
 */
export function VirtualizedTable<T extends Record<string, any>>({
  data,
  columns,
  height = 400,
  rowHeight = 48,
  enableSorting = true,
  enableFiltering = true,
  filterPlaceholder = 'Search...',
  className,
  loading = false,
  emptyMessage = 'No data available',
}: VirtualizedTableProps<T>) {
  // Table state
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = React.useState('');

  // Table instance
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
    getFilteredRowModel: enableFiltering ? getFilteredRowModel() : undefined,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
  });

  // Memoized table rows
  const rows = useMemo(() => table.getRowModel().rows, [table]);

  // Calculate column sizes
  const columnSizes = useMemo(() => {
    return table.getVisibleLeafColumns().map((column) => ({
      id: column.id,
      size: column.getSize(),
    }));
  }, [table]);

  // Loading state
  if (loading) {
    return (
      <div
        className={cn('border rounded-md', className)}
        style={{ height }}
      >
        <div className="flex items-center justify-center h-full">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      </div>
    );
  }

  // Empty state
  if (rows.length === 0) {
    return (
      <div
        className={cn('border rounded-md', className)}
        style={{ height }}
      >
        <div className="flex items-center justify-center h-full">
          <div className="text-muted-foreground">{emptyMessage}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('border rounded-md overflow-hidden', className)}>
      {/* Table Controls */}
      {enableFiltering && (
        <div className="p-4 border-b bg-muted/20">
          <div className="flex items-center space-x-4">
            {/* Global Filter */}
            <div className="flex-1 max-w-sm">
              <Input
                placeholder={filterPlaceholder}
                value={globalFilter ?? ''}
                onChange={(event) => setGlobalFilter(String(event.target.value))}
                className="w-full"
              />
            </div>

            {/* Items per page selector could be added here */}
            <div className="text-sm text-muted-foreground">
              {rows.length} of {data.length} items
            </div>
          </div>
        </div>
      )}

      {/* Regular Table */}
      <div className="overflow-auto border rounded-md">
        <table className="w-full">
          <thead className="bg-muted/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  const isSorted = header.column.getIsSorted();

                  return (
                    <th
                      key={header.id}
                      className={cn(
                        'px-4 py-3 text-left font-medium border-b',
                        canSort && 'cursor-pointer select-none hover:bg-muted'
                      )}
                      onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                      style={{ width: header.getSize() }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="truncate">
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}
                        </span>
                        {canSort && (
                          <div className="flex flex-col ml-1">
                            <ChevronUp
                              className={cn(
                                'h-3 w-3',
                                isSorted === 'asc' ? 'text-foreground' : 'text-muted-foreground/50'
                              )}
                            />
                            <ChevronDown
                              className={cn(
                                'h-3 w-3 -mt-1',
                                isSorted === 'desc' ? 'text-foreground' : 'text-muted-foreground/50'
                              )}
                            />
                          </div>
                        )}
                      </div>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr
                key={row.id}
                className={cn(
                  'border-b hover:bg-muted/50 transition-colors',
                  index % 2 === 0 ? 'bg-background' : 'bg-muted/20'
                )}
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-4 py-3 truncate"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============================================================================
// TABLE COLUMN HELPERS
// ============================================================================

/**
 * Create a sortable text column
 */
export function createTextColumn<T>(
  accessorKey: keyof T,
  header: string,
  options?: {
    size?: number;
    sortable?: boolean;
    filterable?: boolean;
  }
): ColumnDef<T> {
  return {
    accessorKey: accessorKey as string,
    header,
    size: options?.size || 150,
    enableSorting: options?.sortable ?? true,
    enableColumnFilter: options?.filterable ?? false,
    cell: ({ getValue }) => (
      <span className="truncate" title={String(getValue())}>
        {String(getValue())}
      </span>
    ),
  };
}

/**
 * Create a number column with formatting
 */
export function createNumberColumn<T>(
  accessorKey: keyof T,
  header: string,
  options?: {
    size?: number;
    sortable?: boolean;
    decimals?: number;
    prefix?: string;
    suffix?: string;
  }
): ColumnDef<T> {
  return {
    accessorKey: accessorKey as string,
    header,
    size: options?.size || 120,
    enableSorting: options?.sortable ?? true,
    cell: ({ getValue }) => {
      const value = getValue() as number;
      if (value == null) return '-';

      const formatted = value.toFixed(options?.decimals || 2);
      return (
        <span className="font-mono text-right">
          {options?.prefix}{formatted}{options?.suffix}
        </span>
      );
    },
  };
}

/**
 * Create a date column with formatting
 */
export function createDateColumn<T>(
  accessorKey: keyof T,
  header: string,
  options?: {
    size?: number;
    sortable?: boolean;
    format?: string;
  }
): ColumnDef<T> {
  return {
    accessorKey: accessorKey as string,
    header,
    size: options?.size || 120,
    enableSorting: options?.sortable ?? true,
    cell: ({ getValue }) => {
      const value = getValue() as string;
      if (!value) return '-';

      try {
        const date = new Date(value);
        return date.toLocaleDateString();
      } catch {
        return value;
      }
    },
  };
}

/**
 * Create an actions column with buttons
 */
export function createActionsColumn<T>(
  header: string,
  renderActions: (row: T) => React.ReactNode,
  options?: {
    size?: number;
  }
): ColumnDef<T> {
  return {
    id: 'actions',
    header,
    size: options?.size || 120,
    enableSorting: false,
    enableColumnFilter: false,
    cell: ({ row }) => renderActions(row.original),
  };
}