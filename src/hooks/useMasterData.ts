/**
 * Master Data Hooks
 * Custom hooks for master data management using React Query
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  getItems,
  getItem,
  searchItems,
  createItem,
  updateItem,
  deleteItem,
  bulkImportItems,
  getWarehouses,
  getWarehouse,
  createWarehouse,
  updateWarehouse,
  deleteWarehouse,
  getCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getSuppliersMaster,
  getSupplierMetrics,
  getMasterDataStats,
  getItemsByCategory,
  getWarehouseUtilization,
  bulkUpdateItems,
  bulkUpdateWarehouses,
  exportMasterData,
} from '@/api/master-data.api';
import {
  ItemMasterRecord,
  WarehouseMasterRecord,
  CustomerMasterRecord,
  SupplierRecord
} from '@/types';

// ============================================================================
// ITEM MASTER HOOKS
// ============================================================================

/**
 * Hook for fetching items with pagination and filtering
 */
export const useItems = (params?: {
  page?: number;
  limit?: number;
  search?: string;
  brand?: string;
  category?: string;
  subCategory?: string;
  isSaleable?: boolean;
  group?: string;
}) => {
  return useQuery({
    queryKey: ['items', params],
    queryFn: () => getItems(params),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook for fetching a single item
 */
export const useItem = (id: string, enabled = true) => {
  return useQuery({
    queryKey: ['item', id],
    queryFn: () => getItem(id),
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook for searching items by various criteria
 */
export const useItemSearch = (query: string, filters?: {
  brand?: string;
  category?: string;
  isSaleable?: boolean;
}, enabled = true) => {
  return useQuery({
    queryKey: ['item-search', query, filters],
    queryFn: () => searchItems(query, filters),
    enabled: enabled && !!query,
    staleTime: 2 * 60 * 1000, // 2 minutes for search results
  });
};

/**
 * Hook for creating a new item
 */
export const useCreateItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createItem,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      toast.success('Item created successfully');
      return data;
    },
    onError: (error: any) => {
      toast.error(`Failed to create item: ${error.message || 'Unknown error'}`);
    },
  });
};

/**
 * Hook for updating an item
 */
export const useUpdateItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ItemMasterRecord> }) =>
      updateItem(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      queryClient.invalidateQueries({ queryKey: ['item', variables.id] });
      toast.success('Item updated successfully');
      return data;
    },
    onError: (error: any) => {
      toast.error(`Failed to update item: ${error.message || 'Unknown error'}`);
    },
  });
};

/**
 * Hook for deleting an item
 */
export const useDeleteItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      toast.success('Item deleted successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to delete item: ${error.message || 'Unknown error'}`);
    },
  });
};

/**
 * Hook for bulk importing items
 */
export const useBulkImportItems = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bulkImportItems,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      toast.success('Items imported successfully');
      return data;
    },
    onError: (error: any) => {
      toast.error(`Failed to import items: ${error.message || 'Unknown error'}`);
    },
  });
};

// ============================================================================
// WAREHOUSE MASTER HOOKS
// ============================================================================

/**
 * Hook for fetching warehouses with pagination and filtering
 */
export const useWarehouses = (params?: {
  page?: number;
  limit?: number;
  status?: string;
  type?: string;
  location?: string;
}) => {
  return useQuery({
    queryKey: ['warehouses', params],
    queryFn: () => getWarehouses(params),
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
};

/**
 * Hook for fetching a single warehouse
 */
export const useWarehouse = (id: string, enabled = true) => {
  return useQuery({
    queryKey: ['warehouse', id],
    queryFn: () => getWarehouse(id),
    enabled: enabled && !!id,
    staleTime: 10 * 60 * 1000,
  });
};

/**
 * Hook for creating a new warehouse
 */
export const useCreateWarehouse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createWarehouse,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['warehouses'] });
      queryClient.invalidateQueries({ queryKey: ['master-data-stats'] });
      toast.success('Warehouse created successfully');
      return data;
    },
    onError: (error: any) => {
      toast.error(`Failed to create warehouse: ${error.message || 'Unknown error'}`);
    },
  });
};

/**
 * Hook for updating a warehouse
 */
export const useUpdateWarehouse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<WarehouseMasterRecord> }) =>
      updateWarehouse(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['warehouses'] });
      queryClient.invalidateQueries({ queryKey: ['warehouse', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['warehouse-utilization'] });
      toast.success('Warehouse updated successfully');
      return data;
    },
    onError: (error: any) => {
      toast.error(`Failed to update warehouse: ${error.message || 'Unknown error'}`);
    },
  });
};

/**
 * Hook for deleting a warehouse
 */
export const useDeleteWarehouse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteWarehouse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['warehouses'] });
      queryClient.invalidateQueries({ queryKey: ['master-data-stats'] });
      toast.success('Warehouse deleted successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to delete warehouse: ${error.message || 'Unknown error'}`);
    },
  });
};

// ============================================================================
// CUSTOMER MASTER HOOKS
// ============================================================================

/**
 * Hook for fetching customers with pagination and filtering
 */
export const useCustomers = (params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  type?: string;
}) => {
  return useQuery({
    queryKey: ['customers', params],
    queryFn: () => getCustomers(params),
    staleTime: 10 * 60 * 1000,
  });
};

/**
 * Hook for fetching a single customer
 */
export const useCustomer = (id: string, enabled = true) => {
  return useQuery({
    queryKey: ['customer', id],
    queryFn: () => getCustomer(id),
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook for creating a new customer
 */
export const useCreateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCustomer,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['master-data-stats'] });
      toast.success('Customer created successfully');
      return data;
    },
    onError: (error: any) => {
      toast.error(`Failed to create customer: ${error.message || 'Unknown error'}`);
    },
  });
};

/**
 * Hook for updating a customer
 */
export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CustomerMasterRecord> }) =>
      updateCustomer(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['customer', variables.id] });
      toast.success('Customer updated successfully');
      return data;
    },
    onError: (error: any) => {
      toast.error(`Failed to update customer: ${error.message || 'Unknown error'}`);
    },
  });
};

/**
 * Hook for deleting a customer
 */
export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['master-data-stats'] });
      toast.success('Customer deleted successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to delete customer: ${error.message || 'Unknown error'}`);
    },
  });
};

// ============================================================================
// SUPPLIER MASTER HOOKS (for master data operations)
// ============================================================================

/**
 * Hook for fetching suppliers (master data view) with pagination and filtering
 */
export const useSuppliersMaster = (params?: {
  page?: number;
  limit?: number;
  status?: string;
  supplierType?: string;
  search?: string;
}) => {
  return useQuery({
    queryKey: ['suppliers-master', params],
    queryFn: () => getSuppliersMaster(params),
    staleTime: 10 * 60 * 1000,
  });
};

/**
 * Hook for fetching supplier metrics
 */
export const useSupplierMetrics = (supplierId: string, enabled = true) => {
  return useQuery({
    queryKey: ['supplier-metrics', supplierId],
    queryFn: () => getSupplierMetrics(supplierId),
    enabled: enabled && !!supplierId,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};

// ============================================================================
// ANALYTICS & REPORTING HOOKS
// ============================================================================

/**
 * Hook for fetching master data statistics
 */
export const useMasterDataStats = () => {
  return useQuery({
    queryKey: ['master-data-stats'],
    queryFn: getMasterDataStats,
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
};

/**
 * Hook for fetching items by category breakdown
 */
export const useItemsByCategory = () => {
  return useQuery({
    queryKey: ['items-by-category'],
    queryFn: getItemsByCategory,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};

/**
 * Hook for fetching warehouse utilization
 */
export const useWarehouseUtilization = () => {
  return useQuery({
    queryKey: ['warehouse-utilization'],
    queryFn: getWarehouseUtilization,
    staleTime: 15 * 60 * 1000,
  });
};

// ============================================================================
// BULK OPERATIONS HOOKS
// ============================================================================

/**
 * Hook for bulk updating items
 */
export const useBulkUpdateItems = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bulkUpdateItems,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      toast.success('Items updated successfully');
      return data;
    },
    onError: (error: any) => {
      toast.error(`Failed to update items: ${error.message || 'Unknown error'}`);
    },
  });
};

/**
 * Hook for bulk updating warehouses
 */
export const useBulkUpdateWarehouses = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bulkUpdateWarehouses,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['warehouses'] });
      toast.success('Warehouses updated successfully');
      return data;
    },
    onError: (error: any) => {
      toast.error(`Failed to update warehouses: ${error.message || 'Unknown error'}`);
    },
  });
};

// ============================================================================
// EXPORT HOOKS
// ============================================================================

/**
 * Hook for exporting master data
 */
export const useExportMasterData = () => {
  return useMutation({
    mutationFn: ({ type, format }: { type: 'items' | 'warehouses' | 'customers' | 'suppliers'; format?: 'csv' | 'excel' | 'json' }) =>
      exportMasterData(type, format),
    onSuccess: (data) => {
      toast.success('Data export initiated successfully');
      return data;
    },
    onError: (error: any) => {
      toast.error(`Failed to export data: ${error.message || 'Unknown error'}`);
    },
  });
};
