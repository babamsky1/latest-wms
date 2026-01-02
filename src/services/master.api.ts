import type {
    ApiResponse,
    Category,
    Location,
    PaginatedResponse,
    Product,
    Supplier,
    User,
    Warehouse,
} from '@/types/database';

import {
    mockCategories,
    mockLocations,
    mockProducts,
    mockSuppliers,
    mockUsers,
    mockWarehouses,
} from './mockData';

const MOCK_DELAY = 300;
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const categoriesApi = {
    async getAll(): Promise<ApiResponse<Category[]>> {
        await delay(MOCK_DELAY);
        return { success: true, data: mockCategories };
    },
    async getById(id: number): Promise<ApiResponse<Category>> {
        await delay(MOCK_DELAY);
        const category = mockCategories.find((c) => c.id === id);
        return category ? { success: true, data: category } : { success: false, message: 'Category not found' };
    },
};

export const productsApi = {
    async getAll(page: number = 1, limit: number = 10): Promise<ApiResponse<PaginatedResponse<Product>>> {
        await delay(MOCK_DELAY);
        const start = (page - 1) * limit;
        const data = mockProducts.slice(start, start + limit);
        return {
            success: true,
            data: {
                data,
                total: mockProducts.length,
                page,
                limit,
                total_pages: Math.ceil(mockProducts.length / limit),
            },
        };
    },
    async getById(id: number): Promise<ApiResponse<Product>> {
        await delay(MOCK_DELAY);
        const product = mockProducts.find((p) => p.id === id);
        return product ? { success: true, data: product } : { success: false, message: 'Product not found' };
    },
    async searchBySku(sku: string): Promise<ApiResponse<Product>> {
        await delay(MOCK_DELAY);
        const product = mockProducts.find((p) => p.sku.includes(sku));
        return product ? { success: true, data: product } : { success: false, message: 'Product not found' };
    },
};

export const warehousesApi = {
    async getAll(): Promise<ApiResponse<Warehouse[]>> {
        await delay(MOCK_DELAY);
        return { success: true, data: mockWarehouses };
    },
    async getById(id: number): Promise<ApiResponse<Warehouse>> {
        await delay(MOCK_DELAY);
        const warehouse = mockWarehouses.find((w) => w.id === id);
        return warehouse ? { success: true, data: warehouse } : { success: false, message: 'Warehouse not found' };
    },
};

export const locationsApi = {
    async getByWarehouse(warehouseId: number): Promise<ApiResponse<Location[]>> {
        await delay(MOCK_DELAY);
        return { success: true, data: mockLocations.filter((l) => l.warehouse_id === warehouseId) };
    },
    async getById(id: number): Promise<ApiResponse<Location>> {
        await delay(MOCK_DELAY);
        const location = mockLocations.find((l) => l.id === id);
        return location ? { success: true, data: location } : { success: false, message: 'Location not found' };
    },
};

export const suppliersApi = {
    async getAll(): Promise<ApiResponse<Supplier[]>> {
        await delay(MOCK_DELAY);
        return { success: true, data: mockSuppliers };
    },
    async getById(id: number): Promise<ApiResponse<Supplier>> {
        await delay(MOCK_DELAY);
        const supplier = mockSuppliers.find((s) => s.id === id);
        return supplier ? { success: true, data: supplier } : { success: false, message: 'Supplier not found' };
    },
};

export const usersApi = {
    async getAll(): Promise<ApiResponse<User[]>> {
        await delay(MOCK_DELAY);
        return { success: true, data: mockUsers };
    },
    async getById(id: number): Promise<ApiResponse<User>> {
        await delay(MOCK_DELAY);
        const user = mockUsers.find((u) => u.id === id);
        return user ? { success: true, data: user } : { success: false, message: 'User not found' };
    },
};
