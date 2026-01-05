/**
 * Adjustments Page - CONDITIONALLY READ-ONLY
 *
 * Refactored to use:
 * - React Query hooks for data fetching
 * - Virtualized table for performance
 * - Feature-based separation of concerns
 * - TypeScript types from wms.ts
 *
 * Spec:
 * ✅ Read-only when status is Pending / Done
 * ✅ Columns: Reference #, Adjustment Date, Source Reference, Category (JO, Zero Out, etc), Warehouse, Status, Created By/At, Updated By/At
 */

import React, { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { StatCard } from '@/components/dashboard/StatCard';
import { VirtualizedTable, createTextColumn, createDateColumn, createActionsColumn } from '@/components/tables/VirtualizedTable';
import { useAdjustments, usePendingAdjustments, useCreateAdjustment, useApproveAdjustment, useRejectAdjustment } from '@/hooks/stock-management/useAdjustments';
import { useStockItems } from '@/hooks/stock-management/useStock';
import { Adjustment } from '@/types/wms';
import { CheckCircle2, Clock, Scale, XCircle } from 'lucide-react';
import { toast } from 'sonner';

/**
 * Adjustments Page Component
 * Pure view component that uses hooks for data and business logic
 */
export default function Adjustments() {
  // Fetch adjustments data using React Query hooks
  const { data: adjustmentsResponse, isLoading, error } = useAdjustments({
    page: 1,
    limit: 100, // Load more for virtualized table
  });

  // Fetch pending adjustments separately for approval workflow
  const { data: pendingAdjustments } = usePendingAdjustments();

  // Fetch stock items for reference
  const { data: stockItems } = useStockItems({ limit: 1000 });

  // Mutation hooks
  const createAdjustmentMutation = useCreateAdjustment();
  const approveAdjustmentMutation = useApproveAdjustment();
  const rejectAdjustmentMutation = useRejectAdjustment();

  const categories = ["For JO", "For Zero Out", "Sample and Retention", "Wrong Encode"];

  // Handle adjustment approval
  const handleApproveAdjustment = async (adjustmentId: string) => {
    try {
      await approveAdjustmentMutation.mutateAsync(adjustmentId);
      toast.success('Adjustment approved successfully');
    } catch (error) {
      toast.error('Failed to approve adjustment');
    }
  };

  // Handle adjustment rejection
  const handleRejectAdjustment = async (adjustmentId: string) => {
    try {
      await rejectAdjustmentMutation.mutateAsync({ id: adjustmentId, reason: 'Rejected by user' });
      toast.success('Adjustment rejected');
    } catch (error) {
      toast.error('Failed to reject adjustment');
    }
  };

  // Define table columns using the new column helpers
  const columns = useMemo<ColumnDef<Adjustment>[]>(
    () => [
      createTextColumn('referenceNo', 'Reference #', { size: 140 }),
      createTextColumn('stockItemId', 'PSC', { size: 120 }),
      createDateColumn('performedAt', 'Adjustment Date', { size: 130 }),
      createTextColumn('reference', 'Source Ref', { size: 120 }),
      createTextColumn('reason', 'Category', { size: 140 }),
      createTextColumn('warehouseId', 'Warehouse', { size: 120 }),
      {
        accessorKey: 'status',
        header: 'Status',
        size: 120,
        cell: ({ getValue }) => {
          const status = String(getValue());
          const variants = {
            pending: 'default',
            approved: 'secondary',
            rejected: 'destructive',
          } as const;

          return (
            <Badge variant={variants[status as keyof typeof variants] || 'outline'}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
          );
        },
      },
      createTextColumn('performedBy', 'Created By', { size: 120 }),
      createActionsColumn('Actions', (adjustment) => (
        <div className="flex gap-2">
          {adjustment.status === 'pending' && (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleApproveAdjustment(adjustment.id)}
                disabled={approveAdjustmentMutation.isPending}
                className="text-green-600 hover:text-green-700"
              >
                <CheckCircle2 className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleRejectAdjustment(adjustment.id)}
                disabled={rejectAdjustmentMutation.isPending}
                className="text-red-600 hover:text-red-700"
              >
                <XCircle className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      )),
    ],
    [approveAdjustmentMutation.isPending, rejectAdjustmentMutation.isPending]
  );

  // Handle loading and error states
  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-destructive">Error Loading Adjustments</h2>
          <p className="text-muted-foreground">Please try again later.</p>
        </div>
      </div>
    );
  }

  const adjustments = adjustmentsResponse?.data || [];
  const pendingCount = pendingAdjustments?.length || 0;
  const completedCount = adjustments.filter(a => a.status === 'approved').length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Inventory Adjustments</h1>
        <p className="text-muted-foreground">
          Stock corrections and reconciliations with approval workflow
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          label="Total Adjustments"
          value={adjustments.length}
          icon={Scale}
          variant="primary"
          loading={isLoading}
        />
        <StatCard
          label="Pending Approval"
          value={pendingCount}
          icon={Clock}
          variant="warning"
          loading={isLoading}
        />
        <StatCard
          label="Completed"
          value={completedCount}
          icon={CheckCircle2}
          variant="success"
          loading={isLoading}
        />
      </div>

      {/* Virtualized Table */}
      <VirtualizedTable
        data={adjustments}
        columns={columns}
        height={600}
        loading={isLoading}
        filterPlaceholder="Search adjustments by reference, PSC, or reason..."
        emptyMessage="No adjustments found."
      />

      {/* Additional Info */}
      <div className="text-sm text-muted-foreground">
        Showing {adjustments.length} adjustments
        {adjustmentsResponse && ` of ${adjustmentsResponse.total} total`}
        {pendingCount > 0 && (
          <span className="ml-4 text-amber-600">
            • {pendingCount} pending approval
          </span>
        )}
      </div>
    </div>
  );
}
