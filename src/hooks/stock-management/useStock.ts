/**
 * Stock Management Hooks - Custom hooks for stock operations using React Query
 * Provides data fetching, caching, and mutations for stock items
 *
 * Note: Using mock data for now - implement your backend endpoints later
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useMemo } from 'react';
import { debounce } from 'lodash';
import { StockItem } from '@/types/wms';

// ============================================================================
// MOCK DATA - Replace with your backend API calls later
// ============================================================================

const mockStockItems: StockItem[] = [
  {
    id: "1",
    psc: "PSC-1001",
    barcode: "480012345678",
    shortDescription: "Acrylic Paint Set",
    longDescription: "Professional Acrylic Paint Set - 12 Colors, 12ml each",
    productType: "Finished Goods",
    category: "Paint",
    subCategory: "Acrylic",
    brand: "KLIK",
    size: "12x12ml",
    color: "Multi",
    isSaleable: true,
    cost: 150.00,
    srp: 299.75,
    currentStock: 25,
    minStock: 10,
    maxStock: 100,
    location: "A-01-01",
    warehouseId: "WH-MAIN",
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: "system",
    updatedBy: "system",
  },
  {
    id: "2",
    psc: "PSC-1002",
    barcode: "480012345679",
    shortDescription: "Wireless Mouse",
    longDescription: "Optical Wireless Mouse with USB Receiver",
    productType: "Finished Goods",
    category: "Electronics",
    subCategory: "Computer Accessories",
    brand: "BW",
    size: "Standard",
    color: "Black",
    isSaleable: true,
    cost: 45.00,
    srp: 89.99,
    currentStock: 150,
    minStock: 20,
    maxStock: 200,
    location: "B-02-05",
    warehouseId: "WH-MAIN",
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: "system",
    updatedBy: "system",
  },
  {
    id: "3",
    psc: "PSC-1003",
    barcode: "480012345680",
    shortDescription: "A4 Paper Ream",
    longDescription: "Premium A4 Copy Paper - 500 sheets per ream",
    productType: "Finished Goods",
    category: "Stationery",
    subCategory: "Paper",
    brand: "OMG",
    size: "A4",
    color: "White",
    isSaleable: true,
    cost: 120.00,
    srp: 199.99,
    currentStock: 5, // Low stock
    minStock: 10,
    maxStock: 50,
    location: "C-03-02",
    warehouseId: "WH-MAIN",
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: "system",
    updatedBy: "system",
  },
];

// ============================================================================
// MOCK API FUNCTIONS - Replace with real API calls later
// ============================================================================

const mockDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const mockGetStockItems = async (params: any) => {
  await mockDelay(500); // Simulate network delay
  let filteredItems = [...mockStockItems];

  // Apply filters
  if (params.search) {
    const search = params.search.toLowerCase();
    filteredItems = filteredItems.filter(item =>
      item.psc.toLowerCase().includes(search) ||
      item.shortDescription.toLowerCase().includes(search) ||
      item.barcode?.toLowerCase().includes(search)
    );
  }

  if (params.category) {
    filteredItems = filteredItems.filter(item => item.category === params.category);
  }

  if (params.warehouseId) {
    filteredItems = filteredItems.filter(item => item.warehouseId === params.warehouseId);
  }

  if (params.status) {
    filteredItems = filteredItems.filter(item => item.status === params.status);
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

const mockGetStockItem = async (id: string) => {
  await mockDelay(300);
  const item = mockStockItems.find(item => item.id === id);
  if (!item) throw new Error('Stock item not found');
  return item;
};

const mockCreateStockItem = async (stockItem: Omit<StockItem, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>) => {
  await mockDelay(500);
  const newItem: StockItem = {
    ...stockItem,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'current-user', // Replace with actual user ID
    updatedBy: 'current-user',
  };
  mockStockItems.push(newItem);
  return newItem;
};

const mockUpdateStockItem = async (id: string, updates: Partial<StockItem>) => {
  await mockDelay(500);
  const index = mockStockItems.findIndex(item => item.id === id);
  if (index === -1) throw new Error('Stock item not found');

  mockStockItems[index] = {
    ...mockStockItems[index],
    ...updates,
    updatedAt: new Date().toISOString(),
    updatedBy: 'current-user',
  };
  return mockStockItems[index];
};

const mockDeleteStockItem = async (id: string) => {
  await mockDelay(500);
  const index = mockStockItems.findIndex(item => item.id === id);
  if (index === -1) throw new Error('Stock item not found');
  mockStockItems.splice(index, 1);
};

const mockGetLowStockAlerts = async () => {
  await mockDelay(300);
  return mockStockItems.filter(item =>
    item.minStock && item.currentStock <= item.minStock
  );
};

const mockGetStockByWarehouse = async (warehouseId: string) => {
  await mockDelay(300);
  return mockStockItems.filter(item => item.warehouseId === warehouseId);
};

const mockSearchStockItems = async (query: string, limit: number = 10) => {
  await mockDelay(200);
  const searchTerm = query.toLowerCase();
  return mockStockItems
    .filter(item =>
      item.psc.toLowerCase().includes(searchTerm) ||
      item.shortDescription.toLowerCase().includes(searchTerm) ||
      item.barcode?.toLowerCase().includes(searchTerm)
    )
    .slice(0, limit);
};

// ============================================================================
// QUERY KEYS
// ============================================================================

export const stockKeys = {
  all: ['stock'] as const,
  lists: () => [...stockKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...stockKeys.lists(), filters] as const,
  details: () => [...stockKeys.all, 'detail'] as const,
  detail: (id: string) => [...stockKeys.details(), id] as const,
  lowStock: () => [...stockKeys.all, 'low-stock'] as const,
  warehouse: (warehouseId: string) => [...stockKeys.all, 'warehouse', warehouseId] as const,
  search: (query: string) => [...stockKeys.all, 'search', query] as const,
};

// ============================================================================
// STOCK ITEMS HOOKS
// ============================================================================

/**
 * Hook to fetch paginated stock items with filtering and search
 * @param params - Query parameters for filtering and pagination
 * @returns Query object with stock items data
 */
export const useStockItems = (params: {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  warehouseId?: string;
  status?: 'active' | 'inactive' | 'discontinued';
} = {}) => {
  return useQuery({
    queryKey: stockKeys.list(params),
    queryFn: () => mockGetStockItems(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook to fetch a single stock item by ID
 * @param id - Stock item ID
 * @returns Query object with stock item data
 */
export const useStockItem = (id: string) => {
  return useQuery({
    queryKey: stockKeys.detail(id),
    queryFn: () => mockGetStockItem(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook to search stock items with debouncing
 * @param query - Search query
 * @param limit - Maximum number of results
 * @returns Query object with search results
 */
export const useSearchStockItems = (query: string, limit: number = 10) => {
  const debouncedQuery = useMemo(
    () => debounce(() => query, 300),
    [query]
  );

  return useQuery({
    queryKey: stockKeys.search(query),
    queryFn: () => mockSearchStockItems(query, limit),
    enabled: query.length > 2,
    staleTime: 30 * 1000, // 30 seconds for search results
  });
};

/**
 * Hook to fetch low stock alerts
 * @returns Query object with low stock items
 */
export const useLowStockAlerts = () => {
  return useQuery({
    queryKey: stockKeys.lowStock(),
    queryFn: mockGetLowStockAlerts,
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Hook to fetch stock items by warehouse
 * @param warehouseId - Warehouse ID
 * @returns Query object with warehouse stock
 */
export const useStockByWarehouse = (warehouseId: string) => {
  return useQuery({
    queryKey: stockKeys.warehouse(warehouseId),
    queryFn: () => mockGetStockByWarehouse(warehouseId),
    enabled: !!warehouseId,
    staleTime: 5 * 60 * 1000,
  });
};

// ============================================================================
// STOCK MUTATION HOOKS
// ============================================================================

/**
 * Hook to create a new stock item
 * @returns Mutation object for creating stock items
 */
export const useCreateStockItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mockCreateStockItem,
    onSuccess: (newStockItem) => {
      // Invalidate and refetch stock lists
      queryClient.invalidateQueries({ queryKey: stockKeys.lists() });

      // Add the new item to the cache
      queryClient.setQueryData(stockKeys.detail(newStockItem.id), newStockItem);

      toast.success(`Stock item ${newStockItem.psc} created successfully`);
    },
    onError: (error) => {
      toast.error(`Failed to create stock item: ${error.message}`);
    },
  });
};

/**
 * Hook to update an existing stock item
 * @returns Mutation object for updating stock items
 */
export const useUpdateStockItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<StockItem> }) =>
      mockUpdateStockItem(id, updates),
    onSuccess: (updatedStockItem) => {
      // Update the item in cache
      queryClient.setQueryData(stockKeys.detail(updatedStockItem.id), updatedStockItem);

      // Invalidate lists to ensure consistency
      queryClient.invalidateQueries({ queryKey: stockKeys.lists() });

      toast.success(`Stock item ${updatedStockItem.psc} updated successfully`);
    },
    onError: (error) => {
      toast.error(`Failed to update stock item: ${error.message}`);
    },
  });
};

/**
 * Hook to delete a stock item
 * @returns Mutation object for deleting stock items
 */
export const useDeleteStockItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mockDeleteStockItem,
    onSuccess: (_, deletedId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: stockKeys.detail(deletedId) });

      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: stockKeys.lists() });

      toast.success('Stock item deleted successfully');
    },
    onError: (error) => {
      toast.error(`Failed to delete stock item: ${error.message}`);
    },
  });
};

// ============================================================================
// STOCK COMPUTED VALUES
// ============================================================================

/**
 * Hook to get stock statistics from cached data
 * @param warehouseId - Optional warehouse filter
 * @returns Computed stock statistics
 */
export const useStockStats = (warehouseId?: string) => {
  const { data: stockItems } = useStockItems({ warehouseId });

  return useMemo(() => {
    if (!stockItems?.data) {
      return {
        totalItems: 0,
        totalValue: 0,
        lowStockItems: 0,
        outOfStockItems: 0,
        activeItems: 0,
      };
    }

    const items = stockItems.data;
    const totalItems = items.length;
    const totalValue = items.reduce((sum, item) => sum + (item.cost * item.currentStock), 0);
    const lowStockItems = items.filter(item => item.minStock && item.currentStock <= item.minStock).length;
    const outOfStockItems = items.filter(item => item.currentStock === 0).length;
    const activeItems = items.filter(item => item.status === 'active').length;

    return {
      totalItems,
      totalValue,
      lowStockItems,
      outOfStockItems,
      activeItems,
    };
  }, [stockItems]);
};
