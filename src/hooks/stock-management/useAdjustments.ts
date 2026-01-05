/**
 * Stock Adjustments Hooks - Custom hooks for stock adjustment operations
 * Provides data fetching, caching, and mutations for stock adjustments
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Adjustment } from '@/types/wms';

// ============================================================================
// MOCK DATA - Replace with your backend API calls later
// ============================================================================

const mockAdjustments: Adjustment[] = [
  {
    id: "1",
    stockItemId: "PSC-1001",
    adjustmentType: "decrease",
    quantity: 5,
    reason: "damaged",
    notes: "Items damaged during transport",
    reference: "ADJ-001",
    warehouseId: "WH-MAIN",
    performedBy: "admin",
    performedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    approvedBy: "manager",
    approvedAt: new Date(Date.now() - 43200000).toISOString(), // 12 hours ago
  },
  {
    id: "2",
    stockItemId: "PSC-1003",
    adjustmentType: "increase",
    quantity: 10,
    reason: "correction",
    notes: "Inventory count correction",
    reference: "ADJ-002",
    warehouseId: "WH-MAIN",
    performedBy: "operator",
    performedAt: new Date().toISOString(),
    // No approval yet - pending
  },
];

// ============================================================================
// MOCK API FUNCTIONS - Replace with real API calls later
// ============================================================================

const mockDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const mockGetAdjustments = async (params: any) => {
  await mockDelay(500);
  let filteredItems = [...mockAdjustments];

  // Apply filters
  if (params.stockItemId) {
    filteredItems = filteredItems.filter(item => item.stockItemId === params.stockItemId);
  }

  if (params.warehouseId) {
    filteredItems = filteredItems.filter(item => item.warehouseId === params.warehouseId);
  }

  if (params.adjustmentType) {
    filteredItems = filteredItems.filter(item => item.adjustmentType === params.adjustmentType);
  }

  if (params.reason) {
    filteredItems = filteredItems.filter(item => item.reason === params.reason);
  }

  if (params.performedBy) {
    filteredItems = filteredItems.filter(item => item.performedBy === params.performedBy);
  }

  // Apply pagination
  const page = params.page || 1;
  const limit = params.limit || 20;
  const startIndex = (page - 1) * limit;
  const paginatedItems = filteredItems.slice(startIndex, startIndex + limit);

  return {
    data: paginatedItems,
    total: filteredItems.length,
    page,
    limit,
    total_pages: Math.ceil(filteredItems.length / limit),
  };
};

const mockGetAdjustment = async (id: string) => {
  await mockDelay(300);
  const adjustment = mockAdjustments.find(adj => adj.id === id);
  if (!adjustment) throw new Error('Adjustment not found');
  return adjustment;
};

const mockCreateAdjustment = async (adjustment: Omit<Adjustment, 'id' | 'performedAt' | 'performedBy'>) => {
  await mockDelay(500);
  const newAdjustment: Adjustment = {
    ...adjustment,
    id: Date.now().toString(),
    performedBy: 'current-user', // Replace with actual user ID
    performedAt: new Date().toISOString(),
  };
  mockAdjustments.push(newAdjustment);
  return newAdjustment;
};

const mockApproveAdjustment = async (id: string) => {
  await mockDelay(500);
  const index = mockAdjustments.findIndex(adj => adj.id === id);
  if (index === -1) throw new Error('Adjustment not found');

  mockAdjustments[index] = {
    ...mockAdjustments[index],
    approvedBy: 'current-user',
    approvedAt: new Date().toISOString(),
  };
  return mockAdjustments[index];
};

const mockRejectAdjustment = async (id: string, reason: string) => {
  await mockDelay(500);
  const index = mockAdjustments.findIndex(adj => adj.id === id);
  if (index === -1) throw new Error('Adjustment not found');

  mockAdjustments[index] = {
    ...mockAdjustments[index],
    approvedBy: 'rejected',
    approvedAt: new Date().toISOString(),
    notes: `${mockAdjustments[index].notes || ''}\nRejected: ${reason}`.trim(),
  };
  return mockAdjustments[index];
};

const mockGetAdjustmentHistory = async (stockItemId: string, limit: number = 50) => {
  await mockDelay(300);
  return mockAdjustments
    .filter(adj => adj.stockItemId === stockItemId)
    .sort((a, b) => new Date(b.performedAt).getTime() - new Date(a.performedAt).getTime())
    .slice(0, limit);
};

const mockGetPendingAdjustments = async (warehouseId?: string) => {
  await mockDelay(300);
  let pending = mockAdjustments.filter(adj => !adj.approvedBy);

  if (warehouseId) {
    pending = pending.filter(adj => adj.warehouseId === warehouseId);
  }

  return pending;
};

// ============================================================================
// QUERY KEYS
// ============================================================================

export const adjustmentKeys = {
  all: ['adjustments'] as const,
  lists: () => [...adjustmentKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...adjustmentKeys.lists(), filters] as const,
  details: () => [...adjustmentKeys.all, 'detail'] as const,
  detail: (id: string) => [...adjustmentKeys.details(), id] as const,
  history: (stockItemId: string) => [...adjustmentKeys.all, 'history', stockItemId] as const,
  pending: () => [...adjustmentKeys.all, 'pending'] as const,
};

// ============================================================================
// ADJUSTMENT QUERY HOOKS
// ============================================================================

/**
 * Hook to fetch paginated stock adjustments
 * @param params - Query parameters for filtering and pagination
 * @returns Query object with adjustments data
 */
export const useAdjustments = (params: {
  page?: number;
  limit?: number;
  stockItemId?: string;
  warehouseId?: string;
  adjustmentType?: 'increase' | 'decrease';
  reason?: string;
  performedBy?: string;
  dateFrom?: string;
  dateTo?: string;
} = {}) => {
  return useQuery({
    queryKey: adjustmentKeys.list(params),
    queryFn: () => mockGetAdjustments(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to fetch a single adjustment by ID
 * @param id - Adjustment ID
 * @returns Query object with adjustment data
 */
export const useAdjustment = (id: string) => {
  return useQuery({
    queryKey: adjustmentKeys.detail(id),
    queryFn: () => mockGetAdjustment(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook to fetch adjustment history for a stock item
 * @param stockItemId - Stock item ID
 * @param limit - Maximum number of records
 * @returns Query object with adjustment history
 */
export const useAdjustmentHistory = (stockItemId: string, limit: number = 50) => {
  return useQuery({
    queryKey: adjustmentKeys.history(stockItemId),
    queryFn: () => mockGetAdjustmentHistory(stockItemId, limit),
    enabled: !!stockItemId,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook to fetch pending adjustments that require approval
 * @param warehouseId - Optional warehouse filter
 * @returns Query object with pending adjustments
 */
export const usePendingAdjustments = (warehouseId?: string) => {
  return useQuery({
    queryKey: [...adjustmentKeys.pending(), warehouseId],
    queryFn: () => mockGetPendingAdjustments(warehouseId),
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

// ============================================================================
// ADJUSTMENT MUTATION HOOKS
// ============================================================================

/**
 * Hook to create a new stock adjustment
 * @returns Mutation object for creating adjustments
 */
export const useCreateAdjustment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mockCreateAdjustment,
    onSuccess: (newAdjustment) => {
      // Invalidate and refetch adjustment lists
      queryClient.invalidateQueries({ queryKey: adjustmentKeys.lists() });

      // Add to pending adjustments if it needs approval
      queryClient.invalidateQueries({ queryKey: adjustmentKeys.pending() });

      // Update adjustment history for the stock item
      queryClient.invalidateQueries({
        queryKey: adjustmentKeys.history(newAdjustment.stockItemId)
      });

      toast.success('Stock adjustment created successfully');
    },
    onError: (error) => {
      toast.error(`Failed to create adjustment: ${error.message}`);
    },
  });
};

/**
 * Hook to approve a stock adjustment
 * @returns Mutation object for approving adjustments
 */
export const useApproveAdjustment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mockApproveAdjustment,
    onSuccess: (approvedAdjustment) => {
      // Update the adjustment in cache
      queryClient.setQueryData(
        adjustmentKeys.detail(approvedAdjustment.id),
        approvedAdjustment
      );

      // Invalidate lists and pending adjustments
      queryClient.invalidateQueries({ queryKey: adjustmentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: adjustmentKeys.pending() });

      // Update adjustment history
      queryClient.invalidateQueries({
        queryKey: adjustmentKeys.history(approvedAdjustment.stockItemId)
      });

      toast.success('Adjustment approved successfully');
    },
    onError: (error) => {
      toast.error(`Failed to approve adjustment: ${error.message}`);
    },
  });
};

/**
 * Hook to reject a stock adjustment
 * @returns Mutation object for rejecting adjustments
 */
export const useRejectAdjustment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      mockRejectAdjustment(id, reason),
    onSuccess: (_, { id }) => {
      // Remove from pending adjustments
      queryClient.invalidateQueries({ queryKey: adjustmentKeys.pending() });

      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: adjustmentKeys.lists() });

      toast.success('Adjustment rejected');
    },
    onError: (error) => {
      toast.error(`Failed to reject adjustment: ${error.message}`);
    },
  });
};
