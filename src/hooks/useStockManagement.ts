/**
 * Stock Management Hooks
 * Custom hooks for stock-related data fetching and mutations using React Query
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  getAdjustments,
  createAdjustment,
  updateAdjustment,
  deleteAdjustment,
  getWithdrawals,
  createWithdrawal,
  updateWithdrawal,
  deleteWithdrawal,
  getCustomerReturns,
  createCustomerReturn,
  updateCustomerReturn,
  deleteCustomerReturn,
  getTransfers,
  createTransfer,
  updateTransfer,
  deleteTransfer,
  searchStock,
  getStockLevels,
  getLowStockAlerts,
} from '@/api/stock-management.api';
import {
  AdjustmentRecord,
  WithdrawalRecord,
  CustomerReturnRecord,
  TransferRecord
} from '@/types';

// ============================================================================
// ADJUSTMENTS HOOKS
// ============================================================================

/**
 * Hook for fetching adjustments with pagination and filtering
 */
export const useAdjustments = (params?: {
  page?: number;
  limit?: number;
  status?: string;
  warehouse?: string;
  dateFrom?: string;
  dateTo?: string;
}) => {
  return useQuery({
    queryKey: ['adjustments', params],
    queryFn: () => getAdjustments(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook for creating a new adjustment
 */
export const useCreateAdjustment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAdjustment,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['adjustments'] });
      toast.success('Adjustment created successfully');
      return data;
    },
    onError: (error: any) => {
      toast.error(`Failed to create adjustment: ${error.message || 'Unknown error'}`);
    },
  });
};

/**
 * Hook for updating an adjustment
 */
export const useUpdateAdjustment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<AdjustmentRecord> }) =>
      updateAdjustment(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['adjustments'] });
      toast.success('Adjustment updated successfully');
      return data;
    },
    onError: (error: any) => {
      toast.error(`Failed to update adjustment: ${error.message || 'Unknown error'}`);
    },
  });
};

/**
 * Hook for deleting an adjustment
 */
export const useDeleteAdjustment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAdjustment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adjustments'] });
      toast.success('Adjustment deleted successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to delete adjustment: ${error.message || 'Unknown error'}`);
    },
  });
};

// ============================================================================
// WITHDRAWALS HOOKS
// ============================================================================

/**
 * Hook for fetching withdrawals with pagination and filtering
 */
export const useWithdrawals = (params?: {
  page?: number;
  limit?: number;
  status?: string;
  warehouse?: string;
  category?: string;
  dateFrom?: string;
  dateTo?: string;
}) => {
  return useQuery({
    queryKey: ['withdrawals', params],
    queryFn: () => getWithdrawals(params),
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook for creating a new withdrawal
 */
export const useCreateWithdrawal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createWithdrawal,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['withdrawals'] });
      toast.success('Withdrawal created successfully');
      return data;
    },
    onError: (error: any) => {
      toast.error(`Failed to create withdrawal: ${error.message || 'Unknown error'}`);
    },
  });
};

/**
 * Hook for updating a withdrawal
 */
export const useUpdateWithdrawal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<WithdrawalRecord> }) =>
      updateWithdrawal(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['withdrawals'] });
      toast.success('Withdrawal updated successfully');
      return data;
    },
    onError: (error: any) => {
      toast.error(`Failed to update withdrawal: ${error.message || 'Unknown error'}`);
    },
  });
};

/**
 * Hook for deleting a withdrawal
 */
export const useDeleteWithdrawal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteWithdrawal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['withdrawals'] });
      toast.success('Withdrawal deleted successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to delete withdrawal: ${error.message || 'Unknown error'}`);
    },
  });
};

// ============================================================================
// CUSTOMER RETURNS HOOKS
// ============================================================================

/**
 * Hook for fetching customer returns with pagination and filtering
 */
export const useCustomerReturns = (params?: {
  page?: number;
  limit?: number;
  status?: string;
  warehouse?: string;
  customerCode?: string;
  dateFrom?: string;
  dateTo?: string;
}) => {
  return useQuery({
    queryKey: ['customer-returns', params],
    queryFn: () => getCustomerReturns(params),
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook for creating a new customer return
 */
export const useCreateCustomerReturn = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCustomerReturn,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['customer-returns'] });
      toast.success('Customer return created successfully');
      return data;
    },
    onError: (error: any) => {
      toast.error(`Failed to create customer return: ${error.message || 'Unknown error'}`);
    },
  });
};

/**
 * Hook for updating a customer return
 */
export const useUpdateCustomerReturn = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CustomerReturnRecord> }) =>
      updateCustomerReturn(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['customer-returns'] });
      toast.success('Customer return updated successfully');
      return data;
    },
    onError: (error: any) => {
      toast.error(`Failed to update customer return: ${error.message || 'Unknown error'}`);
    },
  });
};

/**
 * Hook for deleting a customer return
 */
export const useDeleteCustomerReturn = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCustomerReturn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer-returns'] });
      toast.success('Customer return deleted successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to delete customer return: ${error.message || 'Unknown error'}`);
    },
  });
};

// ============================================================================
// TRANSFERS HOOKS
// ============================================================================

/**
 * Hook for fetching transfers with pagination and filtering
 */
export const useTransfers = (params?: {
  page?: number;
  limit?: number;
  status?: string;
  fromWarehouse?: string;
  toWarehouse?: string;
  dateFrom?: string;
  dateTo?: string;
}) => {
  return useQuery({
    queryKey: ['transfers', params],
    queryFn: () => getTransfers(params),
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook for creating a new transfer
 */
export const useCreateTransfer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTransfer,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['transfers'] });
      toast.success('Transfer created successfully');
      return data;
    },
    onError: (error: any) => {
      toast.error(`Failed to create transfer: ${error.message || 'Unknown error'}`);
    },
  });
};

/**
 * Hook for updating a transfer
 */
export const useUpdateTransfer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<TransferRecord> }) =>
      updateTransfer(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['transfers'] });
      toast.success('Transfer updated successfully');
      return data;
    },
    onError: (error: any) => {
      toast.error(`Failed to update transfer: ${error.message || 'Unknown error'}`);
    },
  });
};

/**
 * Hook for deleting a transfer
 */
export const useDeleteTransfer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTransfer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transfers'] });
      toast.success('Transfer deleted successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to delete transfer: ${error.message || 'Unknown error'}`);
    },
  });
};

// ============================================================================
// STOCK INQUIRY HOOKS
// ============================================================================

/**
 * Hook for searching stock items
 */
export const useStockSearch = (params: {
  query?: string;
  warehouse?: string;
  category?: string;
  brand?: string;
  page?: number;
  limit?: number;
}, enabled = true) => {
  return useQuery({
    queryKey: ['stock-search', params],
    queryFn: () => searchStock(params),
    enabled,
    staleTime: 2 * 60 * 1000, // 2 minutes for search results
  });
};

/**
 * Hook for getting stock levels for a specific item
 */
export const useStockLevels = (itemId: string, enabled = true) => {
  return useQuery({
    queryKey: ['stock-levels', itemId],
    queryFn: () => getStockLevels(itemId),
    enabled: enabled && !!itemId,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

/**
 * Hook for getting low stock alerts
 */
export const useLowStockAlerts = () => {
  return useQuery({
    queryKey: ['low-stock-alerts'],
    queryFn: getLowStockAlerts,
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
};
