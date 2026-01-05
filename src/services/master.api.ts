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

const MOCK_DELAY = 300;
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const categoriesApi = {
    async getAll(): Promise<ApiResponse<Category[]>> {
        await delay(MOCK_DELAY);
        return { success: true, data: [] };
    },
    async getById(id: number): Promise<ApiResponse<Category>> {
        await delay(MOCK_DELAY);
        return { success: false, message: 'Category not found' };
    },
};

export const productsApi = {
    async getAll(page: number = 1, limit: number = 10): Promise<ApiResponse<PaginatedResponse<Product>>> {
        await delay(MOCK_DELAY);
        return {
            success: true,
            data: {
                data: [],
                total: 0,
                page,
                limit,
                total_pages: 0,
            },
        };
    },
    async getById(id: number): Promise<ApiResponse<Product>> {
        await delay(MOCK_DELAY);
        return { success: false, message: 'Product not found' };
    },
    async searchBySku(sku: string): Promise<ApiResponse<Product>> {
        await delay(MOCK_DELAY);
        return { success: false, message: 'Product not found' };
    },
};

export const warehousesApi = {
    async getAll(): Promise<ApiResponse<Warehouse[]>> {
        await delay(MOCK_DELAY);
        return { success: true, data: [] };
    },
    async getById(id: number): Promise<ApiResponse<Warehouse>> {
        await delay(MOCK_DELAY);
        return { success: false, message: 'Warehouse not found' };
    },
};

export const locationsApi = {
    async getByWarehouse(warehouseId: number): Promise<ApiResponse<Location[]>> {
        await delay(MOCK_DELAY);
        return { success: true, data: [] };
    },
    async getById(id: number): Promise<ApiResponse<Location>> {
        await delay(MOCK_DELAY);
        return { success: false, message: 'Location not found' };
    },
};

export const suppliersApi = {
    async getAll(): Promise<ApiResponse<Supplier[]>> {
        await delay(MOCK_DELAY);
        return { success: true, data: [] };
    },
    async getById(id: number): Promise<ApiResponse<Supplier>> {
        await delay(MOCK_DELAY);
        return { success: false, message: 'Supplier not found' };
    },
};

export const usersApi = {
    async getAll(): Promise<ApiResponse<User[]>> {
        await delay(MOCK_DELAY);
        return { success: true, data: [] };
    },
    async getById(id: number): Promise<ApiResponse<User>> {
        await delay(MOCK_DELAY);
        return { success: false, message: 'User not found' };
    },
};
