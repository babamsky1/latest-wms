import type {
    Adjustment,
    ApiResponse,
    PaginatedResponse,
    Stock,
    StockBuffer,
    Transfer,
} from '@/types/database';

import {
    mockAdjustments,
    mockStockBuffers,
    mockStocks,
    mockTransfers,
} from './mockData';

const MOCK_DELAY = 300;
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const stocksApi = {
    async getAll(page: number = 1, limit: number = 10): Promise<ApiResponse<PaginatedResponse<Stock>>> {
        await delay(MOCK_DELAY);
        const start = (page - 1) * limit;
        const data = mockStocks.slice(start, start + limit);
        return {
            success: true,
            data: {
                data,
                total: mockStocks.length,
                page,
                limit,
                total_pages: Math.ceil(mockStocks.length / limit),
            },
        };
    },
    async getByWarehouse(warehouseId: number): Promise<ApiResponse<Stock[]>> {
        await delay(MOCK_DELAY);
        return { success: true, data: mockStocks.filter((s) => s.warehouse_id === warehouseId) };
    },
    async getByProduct(productId: number): Promise<ApiResponse<Stock[]>> {
        await delay(MOCK_DELAY);
        return { success: true, data: mockStocks.filter((s) => s.product_id === productId) };
    },
    async getLowStock(): Promise<ApiResponse<Stock[]>> {
        await delay(MOCK_DELAY);
        const lowStocks = mockStocks.filter((stock) => {
            const buffer = mockStockBuffers.find((b) => b.product_id === stock.product_id);
            return buffer && stock.quantity <= buffer.minimum_stock;
        });
        return { success: true, data: lowStocks };
    },
};

export const stockBuffersApi = {
    async getAll(): Promise<ApiResponse<StockBuffer[]>> {
        await delay(MOCK_DELAY);
        return { success: true, data: mockStockBuffers };
    },
    async getByProduct(productId: number): Promise<ApiResponse<StockBuffer | null>> {
        await delay(MOCK_DELAY);
        const buffer = mockStockBuffers.find((b) => b.product_id === productId);
        return { success: true, data: buffer || null };
    },
};

export const adjustmentsApi = {
    async getAll(page: number = 1, limit: number = 10): Promise<ApiResponse<PaginatedResponse<Adjustment>>> {
        await delay(MOCK_DELAY);
        const start = (page - 1) * limit;
        const data = mockAdjustments.slice(start, start + limit);
        return {
            success: true,
            data: {
                data,
                total: mockAdjustments.length,
                page,
                limit,
                total_pages: Math.ceil(mockAdjustments.length / limit),
            },
        };
    },
};

export const transfersApi = {
    async getAll(page: number = 1, limit: number = 10): Promise<ApiResponse<PaginatedResponse<Transfer>>> {
        await delay(MOCK_DELAY);
        const start = (page - 1) * limit;
        const data = mockTransfers.slice(start, start + limit);
        return {
            success: true,
            data: {
                data,
                total: mockTransfers.length,
                page,
                limit,
                total_pages: Math.ceil(mockTransfers.length / limit),
            },
        };
    },
};
