/**
 * Supplier Management Hooks - Custom hooks for supplier operations
 * Provides data fetching, caching, and mutations for suppliers
 *
 * Note: Using mock data for now - implement your backend endpoints later
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useMemo } from 'react';
import { Supplier } from '@/types/wms';

// ============================================================================
// MOCK DATA - Replace with your backend API calls later
// ============================================================================

const mockSuppliers: Supplier[] = [
  {
    id: "1",
    code: "SUP-001",
    name: "TechPro Solutions",
    contactPerson: "John Smith",
    phone: "+63-2-123-4567",
    email: "john@techpro.com",
    address: "123 Business District, Makati City",
    city: "Makati",
    country: "Philippines",
    taxId: "TAX001234",
    paymentTerms: "Net 30",
    leadTimeDays: 7,
    minimumOrderValue: 5000,
    rating: 4.5,
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: "system",
    updatedBy: "system",
  },
  {
    id: "2",
    code: "SUP-002",
    name: "Global Supplies Ltd",
    contactPerson: "Maria Garcia",
    phone: "+63-2-987-6543",
    email: "maria@globalsupplies.com",
    address: "456 Commerce Ave, BGC, Taguig",
    city: "Taguig",
    country: "Philippines",
    taxId: "TAX005678",
    paymentTerms: "Net 15",
    leadTimeDays: 14,
    minimumOrderValue: 10000,
    rating: 4.2,
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: "system",
    updatedBy: "system",
  },
  {
    id: "3",
    code: "SUP-003",
    name: "Local Distributors Inc",
    contactPerson: "Pedro Santos",
    phone: "+63-2-555-7890",
    email: "pedro@localdist.com",
    address: "789 Industrial Park, Quezon City",
    city: "Quezon City",
    country: "Philippines",
    taxId: "TAX009012",
    paymentTerms: "COD",
    leadTimeDays: 3,
    minimumOrderValue: 2000,
    rating: 3.8,
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

const mockGetSuppliers = async (params: any) => {
  await mockDelay(500);
  let filteredItems = [...mockSuppliers];

  // Apply filters
  if (params.search) {
    const search = params.search.toLowerCase();
    filteredItems = filteredItems.filter(supplier =>
      supplier.name.toLowerCase().includes(search) ||
      supplier.code.toLowerCase().includes(search) ||
      supplier.contactPerson.toLowerCase().includes(search)
    );
  }

  if (params.status) {
    filteredItems = filteredItems.filter(supplier => supplier.status === params.status);
  }

  if (params.supplierType) {
    filteredItems = filteredItems.filter(supplier => supplier.supplierType === params.supplierType);
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

const mockGetSupplier = async (id: string) => {
  await mockDelay(300);
  const supplier = mockSuppliers.find(s => s.id === id);
  if (!supplier) throw new Error('Supplier not found');
  return supplier;
};

const mockCreateSupplier = async (supplier: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>) => {
  await mockDelay(500);
  const newSupplier: Supplier = {
    ...supplier,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'current-user',
    updatedBy: 'current-user',
  };
  mockSuppliers.push(newSupplier);
  return newSupplier;
};

const mockUpdateSupplier = async (id: string, updates: Partial<Supplier>) => {
  await mockDelay(500);
  const index = mockSuppliers.findIndex(s => s.id === id);
  if (index === -1) throw new Error('Supplier not found');

  mockSuppliers[index] = {
    ...mockSuppliers[index],
    ...updates,
    updatedAt: new Date().toISOString(),
    updatedBy: 'current-user',
  };
  return mockSuppliers[index];
};

const mockDeleteSupplier = async (id: string) => {
  await mockDelay(500);
  const index = mockSuppliers.findIndex(s => s.id === id);
  if (index === -1) throw new Error('Supplier not found');
  mockSuppliers.splice(index, 1);
};

const mockSearchSuppliers = async (query: string, limit: number = 10) => {
  await mockDelay(200);
  const searchTerm = query.toLowerCase();
  return mockSuppliers
    .filter(supplier =>
      supplier.name.toLowerCase().includes(searchTerm) ||
      supplier.code.toLowerCase().includes(searchTerm) ||
      supplier.contactPerson.toLowerCase().includes(searchTerm)
    )
    .slice(0, limit);
};

const mockGetSupplierPerformance = async (supplierId: string) => {
  await mockDelay(400);
  const supplier = mockSuppliers.find(s => s.id === supplierId);
  if (!supplier) throw new Error('Supplier not found');

  // Mock performance data
  return {
    totalOrders: 145,
    totalValue: 125000,
    onTimeDelivery: 96,
    qualityRating: supplier.rating || 4.0,
    leadTimeDays: supplier.leadTimeDays || 7,
  };
};

const mockUpdateSupplierRating = async (supplierId: string, rating: number) => {
  await mockDelay(300);
  const index = mockSuppliers.findIndex(s => s.id === supplierId);
  if (index === -1) throw new Error('Supplier not found');

  mockSuppliers[index] = {
    ...mockSuppliers[index],
    rating,
    updatedAt: new Date().toISOString(),
    updatedBy: 'current-user',
  };
  return mockSuppliers[index];
};

// ============================================================================
// QUERY KEYS
// ============================================================================

export const supplierKeys = {
  all: ['suppliers'] as const,
  lists: () => [...supplierKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...supplierKeys.lists(), filters] as const,
  details: () => [...supplierKeys.all, 'detail'] as const,
  detail: (id: string) => [...supplierKeys.details(), id] as const,
  search: (query: string) => [...supplierKeys.all, 'search', query] as const,
  performance: (id: string, filters: Record<string, unknown>) =>
    [...supplierKeys.all, 'performance', id, filters] as const,
};

// ============================================================================
// SUPPLIER QUERY HOOKS
// ============================================================================

/**
 * Hook to fetch paginated suppliers with filtering
 * @param params - Query parameters for filtering and pagination
 * @returns Query object with suppliers data
 */
export const useSuppliers = (params: {
  page?: number;
  limit?: number;
  search?: string;
  status?: 'active' | 'inactive' | 'blocked';
  supplierType?: 'local' | 'international';
} = {}) => {
  return useQuery({
    queryKey: supplierKeys.list(params),
    queryFn: () => mockGetSuppliers(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook to fetch a single supplier by ID
 * @param id - Supplier ID
 * @returns Query object with supplier data
 */
export const useSupplier = (id: string) => {
  return useQuery({
    queryKey: supplierKeys.detail(id),
    queryFn: () => mockGetSupplier(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook to search suppliers
 * @param query - Search query
 * @param limit - Maximum number of results
 * @returns Query object with search results
 */
export const useSearchSuppliers = (query: string, limit: number = 10) => {
  return useQuery({
    queryKey: supplierKeys.search(query),
    queryFn: () => mockSearchSuppliers(query, limit),
    enabled: query.length > 2,
    staleTime: 30 * 1000, // 30 seconds for search results
  });
};

/**
 * Hook to fetch supplier performance metrics
 * @param supplierId - Supplier ID
 * @param dateFrom - Start date for metrics
 * @param dateTo - End date for metrics
 * @returns Query object with performance data
 */
export const useSupplierPerformance = (
  supplierId: string,
  dateFrom?: string,
  dateTo?: string
) => {
  return useQuery({
    queryKey: supplierKeys.performance(supplierId, { dateFrom, dateTo }),
    queryFn: () => mockGetSupplierPerformance(supplierId),
    enabled: !!supplierId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// ============================================================================
// SUPPLIER MUTATION HOOKS
// ============================================================================

/**
 * Hook to create a new supplier
 * @returns Mutation object for creating suppliers
 */
export const useCreateSupplier = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mockCreateSupplier,
    onSuccess: (newSupplier) => {
      // Invalidate and refetch supplier lists
      queryClient.invalidateQueries({ queryKey: supplierKeys.lists() });

      // Add the new supplier to the cache
      queryClient.setQueryData(supplierKeys.detail(newSupplier.id), newSupplier);

      toast.success(`Supplier ${newSupplier.name} created successfully`);
    },
    onError: (error) => {
      toast.error(`Failed to create supplier: ${error.message}`);
    },
  });
};

/**
 * Hook to update an existing supplier
 * @returns Mutation object for updating suppliers
 */
export const useUpdateSupplier = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Supplier> }) =>
      mockUpdateSupplier(id, updates),
    onSuccess: (updatedSupplier) => {
      // Update the supplier in cache
      queryClient.setQueryData(supplierKeys.detail(updatedSupplier.id), updatedSupplier);

      // Invalidate lists to ensure consistency
      queryClient.invalidateQueries({ queryKey: supplierKeys.lists() });

      toast.success(`Supplier ${updatedSupplier.name} updated successfully`);
    },
    onError: (error) => {
      toast.error(`Failed to update supplier: ${error.message}`);
    },
  });
};

/**
 * Hook to delete a supplier
 * @returns Mutation object for deleting suppliers
 */
export const useDeleteSupplier = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mockDeleteSupplier,
    onSuccess: (_, deletedId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: supplierKeys.detail(deletedId) });

      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: supplierKeys.lists() });

      toast.success('Supplier deleted successfully');
    },
    onError: (error) => {
      toast.error(`Failed to delete supplier: ${error.message}`);
    },
  });
};

/**
 * Hook to update supplier rating
 * @returns Mutation object for updating supplier ratings
 */
export const useUpdateSupplierRating = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ supplierId, rating, feedback }: {
      supplierId: string;
      rating: number;
      feedback?: string;
    }) => mockUpdateSupplierRating(supplierId, rating),
    onSuccess: (updatedSupplier, { supplierId }) => {
      // Update the supplier in cache
      queryClient.setQueryData(supplierKeys.detail(supplierId), updatedSupplier);

      // Invalidate performance data
      queryClient.invalidateQueries({
        queryKey: supplierKeys.performance(supplierId, {}),
      });

      toast.success('Supplier rating updated successfully');
    },
    onError: (error) => {
      toast.error(`Failed to update rating: ${error.message}`);
    },
  });
};

// ============================================================================
// SUPPLIER COMPUTED VALUES
// ============================================================================

/**
 * Hook to get supplier statistics from cached data
 * @returns Computed supplier statistics
 */
export const useSupplierStats = () => {
  const { data: suppliers } = useSuppliers();

  return useMemo(() => {
    if (!suppliers?.data) {
      return {
        totalSuppliers: 0,
        activeSuppliers: 0,
        localSuppliers: 0,
        internationalSuppliers: 0,
        averageRating: 0,
      };
    }

    const items = suppliers.data;
    const totalSuppliers = items.length;
    const activeSuppliers = items.filter(s => s.status === 'active').length;
    const localSuppliers = items.filter(s => s.supplierType === 'local').length;
    const internationalSuppliers = items.filter(s => s.supplierType === 'international').length;
    const ratedSuppliers = items.filter(s => s.rating !== undefined && s.rating > 0);
    const averageRating = ratedSuppliers.length > 0
      ? ratedSuppliers.reduce((sum, s) => sum + (s.rating || 0), 0) / ratedSuppliers.length
      : 0;

    return {
      totalSuppliers,
      activeSuppliers,
      localSuppliers,
      internationalSuppliers,
      averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
    };
  }, [suppliers]);
};
