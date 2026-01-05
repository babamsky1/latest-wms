/**
 * Order Completion Hooks
 * Custom hooks for order completion workflow data fetching and mutations using React Query
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  getPendingAllocations,
  allocateOrder,
  getAllocationSummary,
  getPickerAssignments,
  createPickerAssignment,
  updatePickerAssignment,
  assignPicker,
  completePickerAssignment,
  getBarcoderAssignments,
  createBarcoderAssignment,
  updateBarcoderAssignment,
  assignBarcoder,
  completeBarcoderAssignment,
  getTaggerAssignments,
  createTaggerAssignment,
  updateTaggerAssignment,
  assignTagger,
  completeTaggerAssignment,
  getCheckerAssignments,
  createCheckerAssignment,
  updateCheckerAssignment,
  assignChecker,
  completeCheckerAssignment,
  getTransferAssignments,
  createTransferAssignment,
  updateTransferAssignment,
  assignTransfer,
  completeTransferAssignment,
  getOrderProcessingStatus,
  bulkAssignOrders,
  getAssignmentQueue,
} from '@/api/order-completion.api';
import {
  PickerRecord,
  BarcoderRecord,
  TaggerRecord,
  CheckerRecord,
  TransferAssignmentRecord
} from '@/types';

// ============================================================================
// ALLOCATION HOOKS
// ============================================================================

/**
 * Hook for fetching pending allocations
 */
export const usePendingAllocations = (params?: {
  page?: number;
  limit?: number;
  priority?: string;
  warehouse?: string;
}) => {
  return useQuery({
    queryKey: ['pending-allocations', params],
    queryFn: () => getPendingAllocations(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Hook for allocating items for an order
 */
export const useAllocateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: allocateOrder,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['pending-allocations'] });
      toast.success('Order allocated successfully');
      return data;
    },
    onError: (error: any) => {
      toast.error(`Failed to allocate order: ${error.message || 'Unknown error'}`);
    },
  });
};

/**
 * Hook for fetching allocation summary for an order
 */
export const useAllocationSummary = (orderId: string, enabled = true) => {
  return useQuery({
    queryKey: ['allocation-summary', orderId],
    queryFn: () => getAllocationSummary(orderId),
    enabled: enabled && !!orderId,
    staleTime: 5 * 60 * 1000,
  });
};

// ============================================================================
// PICKER ASSIGNMENT HOOKS
// ============================================================================

/**
 * Hook for fetching picker assignments with pagination and filtering
 */
export const usePickerAssignments = (params?: {
  page?: number;
  limit?: number;
  status?: string;
  assignedStaff?: string;
  dateFrom?: string;
  dateTo?: string;
}) => {
  return useQuery({
    queryKey: ['picker-assignments', params],
    queryFn: () => getPickerAssignments(params),
    staleTime: 2 * 60 * 1000,
  });
};

/**
 * Hook for creating a new picker assignment
 */
export const useCreatePickerAssignment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPickerAssignment,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['picker-assignments'] });
      queryClient.invalidateQueries({ queryKey: ['order-processing-status'] });
      toast.success('Picker assignment created successfully');
      return data;
    },
    onError: (error: any) => {
      toast.error(`Failed to create picker assignment: ${error.message || 'Unknown error'}`);
    },
  });
};

/**
 * Hook for updating a picker assignment
 */
export const useUpdatePickerAssignment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PickerRecord> }) =>
      updatePickerAssignment(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['picker-assignments'] });
      queryClient.invalidateQueries({ queryKey: ['order-processing-status'] });
      toast.success('Picker assignment updated successfully');
      return data;
    },
    onError: (error: any) => {
      toast.error(`Failed to update picker assignment: ${error.message || 'Unknown error'}`);
    },
  });
};

/**
 * Hook for assigning staff to a picker task
 */
export const useAssignPicker = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, staffId }: { id: string; staffId: string }) =>
      assignPicker(id, staffId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['picker-assignments'] });
      queryClient.invalidateQueries({ queryKey: ['assignment-queue', 'picker'] });
      toast.success('Picker assigned successfully');
      return data;
    },
    onError: (error: any) => {
      toast.error(`Failed to assign picker: ${error.message || 'Unknown error'}`);
    },
  });
};

/**
 * Hook for completing a picker assignment
 */
export const useCompletePickerAssignment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, completionData }: { id: string; completionData: { countedQty: number; notes?: string } }) =>
      completePickerAssignment(id, completionData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['picker-assignments'] });
      queryClient.invalidateQueries({ queryKey: ['order-processing-status'] });
      toast.success('Picker assignment completed successfully');
      return data;
    },
    onError: (error: any) => {
      toast.error(`Failed to complete picker assignment: ${error.message || 'Unknown error'}`);
    },
  });
};

// ============================================================================
// BARCODER ASSIGNMENT HOOKS
// ============================================================================

/**
 * Hook for fetching barcoder assignments with pagination and filtering
 */
export const useBarcoderAssignments = (params?: {
  page?: number;
  limit?: number;
  status?: string;
  assignedStaff?: string;
  dateFrom?: string;
  dateTo?: string;
}) => {
  return useQuery({
    queryKey: ['barcoder-assignments', params],
    queryFn: () => getBarcoderAssignments(params),
    staleTime: 2 * 60 * 1000,
  });
};

/**
 * Hook for creating a new barcoder assignment
 */
export const useCreateBarcoderAssignment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBarcoderAssignment,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['barcoder-assignments'] });
      queryClient.invalidateQueries({ queryKey: ['order-processing-status'] });
      toast.success('Barcoder assignment created successfully');
      return data;
    },
    onError: (error: any) => {
      toast.error(`Failed to create barcoder assignment: ${error.message || 'Unknown error'}`);
    },
  });
};

/**
 * Hook for updating a barcoder assignment
 */
export const useUpdateBarcoderAssignment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<BarcoderRecord> }) =>
      updateBarcoderAssignment(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['barcoder-assignments'] });
      queryClient.invalidateQueries({ queryKey: ['order-processing-status'] });
      toast.success('Barcoder assignment updated successfully');
      return data;
    },
    onError: (error: any) => {
      toast.error(`Failed to update barcoder assignment: ${error.message || 'Unknown error'}`);
    },
  });
};

/**
 * Hook for assigning staff to a barcoder task
 */
export const useAssignBarcoder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, staffId }: { id: string; staffId: string }) =>
      assignBarcoder(id, staffId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['barcoder-assignments'] });
      queryClient.invalidateQueries({ queryKey: ['assignment-queue', 'barcoder'] });
      toast.success('Barcoder assigned successfully');
      return data;
    },
    onError: (error: any) => {
      toast.error(`Failed to assign barcoder: ${error.message || 'Unknown error'}`);
    },
  });
};

/**
 * Hook for completing a barcoder assignment
 */
export const useCompleteBarcoderAssignment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, completionData }: { id: string; completionData: { processedQty: number; notes?: string } }) =>
      completeBarcoderAssignment(id, completionData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['barcoder-assignments'] });
      queryClient.invalidateQueries({ queryKey: ['order-processing-status'] });
      toast.success('Barcoder assignment completed successfully');
      return data;
    },
    onError: (error: any) => {
      toast.error(`Failed to complete barcoder assignment: ${error.message || 'Unknown error'}`);
    },
  });
};

// ============================================================================
// TAGGER ASSIGNMENT HOOKS
// ============================================================================

/**
 * Hook for fetching tagger assignments with pagination and filtering
 */
export const useTaggerAssignments = (params?: {
  page?: number;
  limit?: number;
  status?: string;
  assignedStaff?: string;
  dateFrom?: string;
  dateTo?: string;
}) => {
  return useQuery({
    queryKey: ['tagger-assignments', params],
    queryFn: () => getTaggerAssignments(params),
    staleTime: 2 * 60 * 1000,
  });
};

/**
 * Hook for creating a new tagger assignment
 */
export const useCreateTaggerAssignment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTaggerAssignment,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['tagger-assignments'] });
      queryClient.invalidateQueries({ queryKey: ['order-processing-status'] });
      toast.success('Tagger assignment created successfully');
      return data;
    },
    onError: (error: any) => {
      toast.error(`Failed to create tagger assignment: ${error.message || 'Unknown error'}`);
    },
  });
};

/**
 * Hook for updating a tagger assignment
 */
export const useUpdateTaggerAssignment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<TaggerRecord> }) =>
      updateTaggerAssignment(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tagger-assignments'] });
      queryClient.invalidateQueries({ queryKey: ['order-processing-status'] });
      toast.success('Tagger assignment updated successfully');
      return data;
    },
    onError: (error: any) => {
      toast.error(`Failed to update tagger assignment: ${error.message || 'Unknown error'}`);
    },
  });
};

/**
 * Hook for assigning staff to a tagger task
 */
export const useAssignTagger = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, staffId }: { id: string; staffId: string }) =>
      assignTagger(id, staffId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tagger-assignments'] });
      queryClient.invalidateQueries({ queryKey: ['assignment-queue', 'tagger'] });
      toast.success('Tagger assigned successfully');
      return data;
    },
    onError: (error: any) => {
      toast.error(`Failed to assign tagger: ${error.message || 'Unknown error'}`);
    },
  });
};

/**
 * Hook for completing a tagger assignment
 */
export const useCompleteTaggerAssignment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, completionData }: { id: string; completionData: { processedQty: number; notes?: string } }) =>
      completeTaggerAssignment(id, completionData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tagger-assignments'] });
      queryClient.invalidateQueries({ queryKey: ['order-processing-status'] });
      toast.success('Tagger assignment completed successfully');
      return data;
    },
    onError: (error: any) => {
      toast.error(`Failed to complete tagger assignment: ${error.message || 'Unknown error'}`);
    },
  });
};

// ============================================================================
// CHECKER ASSIGNMENT HOOKS
// ============================================================================

/**
 * Hook for fetching checker assignments with pagination and filtering
 */
export const useCheckerAssignments = (params?: {
  page?: number;
  limit?: number;
  status?: string;
  assignedStaff?: string;
  dateFrom?: string;
  dateTo?: string;
}) => {
  return useQuery({
    queryKey: ['checker-assignments', params],
    queryFn: () => getCheckerAssignments(params),
    staleTime: 2 * 60 * 1000,
  });
};

/**
 * Hook for creating a new checker assignment
 */
export const useCreateCheckerAssignment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCheckerAssignment,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['checker-assignments'] });
      queryClient.invalidateQueries({ queryKey: ['order-processing-status'] });
      toast.success('Checker assignment created successfully');
      return data;
    },
    onError: (error: any) => {
      toast.error(`Failed to create checker assignment: ${error.message || 'Unknown error'}`);
    },
  });
};

/**
 * Hook for updating a checker assignment
 */
export const useUpdateCheckerAssignment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CheckerRecord> }) =>
      updateCheckerAssignment(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['checker-assignments'] });
      queryClient.invalidateQueries({ queryKey: ['order-processing-status'] });
      toast.success('Checker assignment updated successfully');
      return data;
    },
    onError: (error: any) => {
      toast.error(`Failed to update checker assignment: ${error.message || 'Unknown error'}`);
    },
  });
};

/**
 * Hook for assigning staff to a checker task
 */
export const useAssignChecker = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, staffId }: { id: string; staffId: string }) =>
      assignChecker(id, staffId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['checker-assignments'] });
      queryClient.invalidateQueries({ queryKey: ['assignment-queue', 'checker'] });
      toast.success('Checker assigned successfully');
      return data;
    },
    onError: (error: any) => {
      toast.error(`Failed to assign checker: ${error.message || 'Unknown error'}`);
    },
  });
};

/**
 * Hook for completing a checker assignment
 */
export const useCompleteCheckerAssignment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, completionData }: { id: string; completionData: { verifiedQty: number; discrepancies?: string; notes?: string } }) =>
      completeCheckerAssignment(id, completionData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['checker-assignments'] });
      queryClient.invalidateQueries({ queryKey: ['order-processing-status'] });
      toast.success('Checker assignment completed successfully');
      return data;
    },
    onError: (error: any) => {
      toast.error(`Failed to complete checker assignment: ${error.message || 'Unknown error'}`);
    },
  });
};

// ============================================================================
// TRANSFER ASSIGNMENT HOOKS
// ============================================================================

/**
 * Hook for fetching transfer assignments with pagination and filtering
 */
export const useTransferAssignments = (params?: {
  page?: number;
  limit?: number;
  status?: string;
  assignedStaff?: string;
  dateFrom?: string;
  dateTo?: string;
}) => {
  return useQuery({
    queryKey: ['transfer-assignments', params],
    queryFn: () => getTransferAssignments(params),
    staleTime: 2 * 60 * 1000,
  });
};

/**
 * Hook for creating a new transfer assignment
 */
export const useCreateTransferAssignment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTransferAssignment,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['transfer-assignments'] });
      queryClient.invalidateQueries({ queryKey: ['order-processing-status'] });
      toast.success('Transfer assignment created successfully');
      return data;
    },
    onError: (error: any) => {
      toast.error(`Failed to create transfer assignment: ${error.message || 'Unknown error'}`);
    },
  });
};

/**
 * Hook for updating a transfer assignment
 */
export const useUpdateTransferAssignment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<TransferAssignmentRecord> }) =>
      updateTransferAssignment(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['transfer-assignments'] });
      queryClient.invalidateQueries({ queryKey: ['order-processing-status'] });
      toast.success('Transfer assignment updated successfully');
      return data;
    },
    onError: (error: any) => {
      toast.error(`Failed to update transfer assignment: ${error.message || 'Unknown error'}`);
    },
  });
};

/**
 * Hook for assigning staff to a transfer task
 */
export const useAssignTransfer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, staffId }: { id: string; staffId: string }) =>
      assignTransfer(id, staffId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['transfer-assignments'] });
      queryClient.invalidateQueries({ queryKey: ['assignment-queue', 'transfer'] });
      toast.success('Transfer assigned successfully');
      return data;
    },
    onError: (error: any) => {
      toast.error(`Failed to assign transfer: ${error.message || 'Unknown error'}`);
    },
  });
};

/**
 * Hook for completing a transfer assignment
 */
export const useCompleteTransferAssignment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, completionData }: { id: string; completionData: { transferredQty: number; destinationWarehouse: string; notes?: string } }) =>
      completeTransferAssignment(id, completionData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['transfer-assignments'] });
      queryClient.invalidateQueries({ queryKey: ['order-processing-status'] });
      toast.success('Transfer assignment completed successfully');
      return data;
    },
    onError: (error: any) => {
      toast.error(`Failed to complete transfer assignment: ${error.message || 'Unknown error'}`);
    },
  });
};

// ============================================================================
// WORKFLOW MANAGEMENT HOOKS
// ============================================================================

/**
 * Hook for fetching order processing status overview
 */
export const useOrderProcessingStatus = (params?: {
  dateFrom?: string;
  dateTo?: string;
  warehouse?: string;
}) => {
  return useQuery({
    queryKey: ['order-processing-status', params],
    queryFn: () => getOrderProcessingStatus(params),
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

/**
 * Hook for bulk assigning orders to staff
 */
export const useBulkAssignOrders = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bulkAssignOrders,
    onSuccess: (data) => {
      // Invalidate all assignment queries
      queryClient.invalidateQueries({ queryKey: ['picker-assignments'] });
      queryClient.invalidateQueries({ queryKey: ['barcoder-assignments'] });
      queryClient.invalidateQueries({ queryKey: ['tagger-assignments'] });
      queryClient.invalidateQueries({ queryKey: ['checker-assignments'] });
      queryClient.invalidateQueries({ queryKey: ['transfer-assignments'] });
      queryClient.invalidateQueries({ queryKey: ['assignment-queue'] });
      queryClient.invalidateQueries({ queryKey: ['order-processing-status'] });
      toast.success('Orders assigned successfully');
      return data;
    },
    onError: (error: any) => {
      toast.error(`Failed to assign orders: ${error.message || 'Unknown error'}`);
    },
  });
};

/**
 * Hook for fetching assignment queue for a specific role
 */
export const useAssignmentQueue = (role: string, staffId?: string) => {
  return useQuery({
    queryKey: ['assignment-queue', role, staffId],
    queryFn: () => getAssignmentQueue(role, staffId),
    staleTime: 30 * 1000, // 30 seconds
  });
};
