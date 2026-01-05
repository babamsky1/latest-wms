/**
 * Supplier Management Hooks
 * Custom hooks for supplier-related data fetching and mutations using React Query
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  getSuppliers,
  getSupplier,
  createSupplier,
  updateSupplier,
  deleteSupplier,
  getPurchaseOrders,
  getPurchaseOrder,
  createPurchaseOrder,
  updatePurchaseOrder,
  deletePurchaseOrder,
  approvePurchaseOrder,
  getDeliveries,
  getDelivery,
  createDelivery,
  updateDelivery,
  deleteDelivery,
  receiveDelivery,
  getDeliveriesByPO,
  getSupplierPerformance,
  getSupplierDeliveryHistory,
} from '@/api/supplier.api';
import {
  SupplierRecord,
  PurchaseOrderRecord,
  DeliveryRecord
} from '@/types';

// ============================================================================
// SUPPLIER PROFILE HOOKS
// ============================================================================

/**
 * Hook for fetching suppliers with pagination and filtering
 */
export const useSuppliers = (params?: {
  page?: number;
  limit?: number;
  status?: string;
  supplierType?: string;
  search?: string;
}) => {
  return useQuery({
    queryKey: ['suppliers', params],
    queryFn: () => getSuppliers(params),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook for fetching a single supplier
 */
export const useSupplier = (id: string, enabled = true) => {
  return useQuery({
    queryKey: ['supplier', id],
    queryFn: () => getSupplier(id),
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook for creating a new supplier
 */
export const useCreateSupplier = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSupplier,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      toast.success('Supplier created successfully');
      return data;
    },
    onError: (error: any) => {
      toast.error(`Failed to create supplier: ${error.message || 'Unknown error'}`);
    },
  });
};

/**
 * Hook for updating a supplier
 */
export const useUpdateSupplier = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SupplierRecord> }) =>
      updateSupplier(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      queryClient.invalidateQueries({ queryKey: ['supplier', variables.id] });
      toast.success('Supplier updated successfully');
      return data;
    },
    onError: (error: any) => {
      toast.error(`Failed to update supplier: ${error.message || 'Unknown error'}`);
    },
  });
};

/**
 * Hook for deleting a supplier
 */
export const useDeleteSupplier = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSupplier,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      toast.success('Supplier deleted successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to delete supplier: ${error.message || 'Unknown error'}`);
    },
  });
};

// ============================================================================
// PURCHASE ORDER HOOKS
// ============================================================================

/**
 * Hook for fetching purchase orders with pagination and filtering
 */
export const usePurchaseOrders = (params?: {
  page?: number;
  limit?: number;
  status?: string;
  supplierName?: string;
  priority?: string;
  dateFrom?: string;
  dateTo?: string;
}) => {
  return useQuery({
    queryKey: ['purchase-orders', params],
    queryFn: () => getPurchaseOrders(params),
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook for fetching a single purchase order
 */
export const usePurchaseOrder = (id: string, enabled = true) => {
  return useQuery({
    queryKey: ['purchase-order', id],
    queryFn: () => getPurchaseOrder(id),
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook for creating a new purchase order
 */
export const useCreatePurchaseOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPurchaseOrder,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['purchase-orders'] });
      toast.success('Purchase order created successfully');
      return data;
    },
    onError: (error: any) => {
      toast.error(`Failed to create purchase order: ${error.message || 'Unknown error'}`);
    },
  });
};

/**
 * Hook for updating a purchase order
 */
export const useUpdatePurchaseOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PurchaseOrderRecord> }) =>
      updatePurchaseOrder(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['purchase-orders'] });
      queryClient.invalidateQueries({ queryKey: ['purchase-order', variables.id] });
      toast.success('Purchase order updated successfully');
      return data;
    },
    onError: (error: any) => {
      toast.error(`Failed to update purchase order: ${error.message || 'Unknown error'}`);
    },
  });
};

/**
 * Hook for deleting a purchase order
 */
export const useDeletePurchaseOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePurchaseOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchase-orders'] });
      toast.success('Purchase order deleted successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to delete purchase order: ${error.message || 'Unknown error'}`);
    },
  });
};

/**
 * Hook for approving a purchase order
 */
export const useApprovePurchaseOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, approvalData }: { id: string; approvalData: { approvedBy: string; comments?: string } }) =>
      approvePurchaseOrder(id, approvalData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['purchase-orders'] });
      queryClient.invalidateQueries({ queryKey: ['purchase-order', variables.id] });
      toast.success('Purchase order approved successfully');
      return data;
    },
    onError: (error: any) => {
      toast.error(`Failed to approve purchase order: ${error.message || 'Unknown error'}`);
    },
  });
};

// ============================================================================
// DELIVERY HOOKS
// ============================================================================

/**
 * Hook for fetching deliveries with pagination and filtering
 */
export const useDeliveries = (params?: {
  page?: number;
  limit?: number;
  status?: string;
  supplierCode?: string;
  warehouse?: string;
  poNumber?: string;
  dateFrom?: string;
  dateTo?: string;
}) => {
  return useQuery({
    queryKey: ['deliveries', params],
    queryFn: () => getDeliveries(params),
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook for fetching a single delivery
 */
export const useDelivery = (id: string, enabled = true) => {
  return useQuery({
    queryKey: ['delivery', id],
    queryFn: () => getDelivery(id),
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook for creating a new delivery
 */
export const useCreateDelivery = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createDelivery,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['deliveries'] });
      toast.success('Delivery created successfully');
      return data;
    },
    onError: (error: any) => {
      toast.error(`Failed to create delivery: ${error.message || 'Unknown error'}`);
    },
  });
};

/**
 * Hook for updating a delivery
 */
export const useUpdateDelivery = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<DeliveryRecord> }) =>
      updateDelivery(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['deliveries'] });
      queryClient.invalidateQueries({ queryKey: ['delivery', variables.id] });
      toast.success('Delivery updated successfully');
      return data;
    },
    onError: (error: any) => {
      toast.error(`Failed to update delivery: ${error.message || 'Unknown error'}`);
    },
  });
};

/**
 * Hook for deleting a delivery
 */
export const useDeleteDelivery = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteDelivery,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deliveries'] });
      toast.success('Delivery deleted successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to delete delivery: ${error.message || 'Unknown error'}`);
    },
  });
};

/**
 * Hook for receiving a delivery
 */
export const useReceiveDelivery = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, receiveData }: { id: string; receiveData: { receivedBy: string; notes?: string } }) =>
      receiveDelivery(id, receiveData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['deliveries'] });
      queryClient.invalidateQueries({ queryKey: ['delivery', variables.id] });
      toast.success('Delivery received successfully');
      return data;
    },
    onError: (error: any) => {
      toast.error(`Failed to receive delivery: ${error.message || 'Unknown error'}`);
    },
  });
};

/**
 * Hook for fetching deliveries by purchase order
 */
export const useDeliveriesByPO = (poNumber: string, enabled = true) => {
  return useQuery({
    queryKey: ['deliveries-by-po', poNumber],
    queryFn: () => getDeliveriesByPO(poNumber),
    enabled: enabled && !!poNumber,
    staleTime: 5 * 60 * 1000,
  });
};

// ============================================================================
// SUPPLIER ANALYTICS HOOKS
// ============================================================================

/**
 * Hook for fetching supplier performance metrics
 */
export const useSupplierPerformance = (supplierId: string, dateRange?: { from: string; to: string }, enabled = true) => {
  return useQuery({
    queryKey: ['supplier-performance', supplierId, dateRange],
    queryFn: () => getSupplierPerformance(supplierId, dateRange),
    enabled: enabled && !!supplierId,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};

/**
 * Hook for fetching supplier delivery history
 */
export const useSupplierDeliveryHistory = (supplierId: string, params?: { page?: number; limit?: number; status?: string }, enabled = true) => {
  return useQuery({
    queryKey: ['supplier-delivery-history', supplierId, params],
    queryFn: () => getSupplierDeliveryHistory(supplierId, params),
    enabled: enabled && !!supplierId,
    staleTime: 10 * 60 * 1000,
  });
};
