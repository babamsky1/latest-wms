import type {
    Adjustment,
    ApiResponse,
    PaginatedResponse,
    Stock,
    StockBuffer,
    Transfer,
} from '@/types/database';

const MOCK_DELAY = 300;
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const stocksApi = {
    async getAll(page: number = 1, limit: number = 10): Promise<ApiResponse<PaginatedResponse<Stock>>> {
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
    async getByWarehouse(warehouseId: number): Promise<ApiResponse<Stock[]>> {
        await delay(MOCK_DELAY);
        return { success: true, data: [] };
    },
    async getByProduct(productId: number): Promise<ApiResponse<Stock[]>> {
        await delay(MOCK_DELAY);
        return { success: true, data: [] };
    },
    async getLowStock(): Promise<ApiResponse<Stock[]>> {
        await delay(MOCK_DELAY);
        return { success: true, data: [] };
    },
};

export const stockBuffersApi = {
    async getAll(): Promise<ApiResponse<StockBuffer[]>> {
        await delay(MOCK_DELAY);
        return { success: true, data: [] };
    },
    async getByProduct(productId: number): Promise<ApiResponse<StockBuffer | null>> {
        await delay(MOCK_DELAY);
        return { success: true, data: null };
    },
};

export const adjustmentsApi = {
    async getAll(page: number = 1, limit: number = 10): Promise<ApiResponse<PaginatedResponse<Adjustment>>> {
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
};

export const transfersApi = {
    async getAll(page: number = 1, limit: number = 10): Promise<ApiResponse<PaginatedResponse<Transfer>>> {
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
};
