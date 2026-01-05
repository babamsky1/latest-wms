/**
 * Stock Inquiry Page - READ-ONLY
 *
 * Refactored to use:
 * - React Query hooks for data fetching
 * - Virtualized table for performance
 * - Feature-based separation of concerns
 * - TypeScript types from wms.ts
 *
 * Spec:
 * ✅ READ-ONLY (No create/update/delete)
 * ✅ Columns: PSC, AN #, Barcode, Description, Brand (BW, KLIK, OMG, ORO), Item Group, Color
 * ✅ Rule: No editing, no posting, no manual quantity changes
 */

import React, { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { StatCard } from '@/components/dashboard/StatCard';
import { VirtualizedTable, createTextColumn, createNumberColumn } from '@/components/tables/VirtualizedTable';
import { useStockItems, useStockStats } from '@/hooks/stock-management/useStock';
import { StockItem } from '@/types/wms';
import { Layers, Package, Tag } from 'lucide-react';

/**
 * Stock Inquiry Page Component
 * Pure view component that uses hooks for data and business logic
 */
export default function StockInquiry() {
  // Fetch stock data using React Query hooks
  const { data: stockResponse, isLoading, error } = useStockItems({
    page: 1,
    limit: 100, // Load more for virtualized table
  });

  // Get computed statistics
  const stats = useStockStats();

  // Define table columns using the new column helpers
  const columns = useMemo<ColumnDef<StockItem>[]>(
    () => [
      createTextColumn('psc', 'PSC', { size: 120 }),
      createTextColumn('subId', 'Sub ID', { size: 100 }),
      createTextColumn('barcode', 'Barcode', { size: 140 }),
      {
        accessorKey: 'shortDescription',
        header: 'Description',
        size: 250,
        cell: ({ getValue }) => (
          <span className="font-medium truncate" title={String(getValue())}>
            {String(getValue())}
          </span>
        ),
      },
      {
        accessorKey: 'brand',
        header: 'Brand',
        size: 100,
        cell: ({ getValue }) => (
          <Badge variant="outline" className="font-bold">
            {String(getValue())}
          </Badge>
        ),
      },
      createTextColumn('group', 'Group', { size: 120 }),
      {
        accessorKey: 'color',
        header: 'Color',
        size: 120,
        cell: ({ getValue }) => {
          const color = String(getValue()).toLowerCase();
          return (
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full border border-muted"
                style={{
                  backgroundColor: color === 'multi' ? 'transparent' : color
                }}
              />
              <span className="capitalize">{color}</span>
            </div>
          );
        },
      },
      createNumberColumn('cost', 'Cost', { prefix: '₱', decimals: 2 }),
      createNumberColumn('srp', 'SRP', { prefix: '₱', decimals: 2 }),
      createTextColumn('status', 'Status', { size: 100 }),
    ],
    []
  );

  // Handle loading and error states
  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-destructive">Error Loading Stock Data</h2>
          <p className="text-muted-foreground">Please try again later.</p>
        </div>
      </div>
    );
  }

  const stockItems = stockResponse?.data || [];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Stock Inquiry</h1>
        <p className="text-muted-foreground">
          View and search stock items with real-time data
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          label="Total Items"
          value={stats.totalItems}
          icon={Package}
          variant="primary"
          loading={isLoading}
        />
        <StatCard
          label="Active Items"
          value={stats.activeItems}
          icon={Tag}
          variant="success"
          loading={isLoading}
        />
        <StatCard
          label="Total Value"
          value={`₱${stats.totalValue.toLocaleString()}`}
          icon={Layers}
          variant="info"
          loading={isLoading}
        />
      </div>

      {/* Virtualized Table */}
      <VirtualizedTable
        data={stockItems}
        columns={columns}
        height={600}
        loading={isLoading}
        filterPlaceholder="Search by PSC, barcode, description, or brand..."
        emptyMessage="No stock items found."
      />

      {/* Additional Info */}
      <div className="text-sm text-muted-foreground">
        Showing {stockItems.length} items
        {stockResponse && ` of ${stockResponse.total} total`}
      </div>
    </div>
  );
}
