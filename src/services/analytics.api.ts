import type {
    ApiResponse,
    PaginatedResponse,
    StockMovement,
} from '@/types/database';

const MOCK_DELAY = 300;
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const reportsApi = {
    async getStockMovements(page: number = 1, limit: number = 10): Promise<ApiResponse<PaginatedResponse<StockMovement>>> {
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
    async getInventorySummary() {
        await delay(MOCK_DELAY);
        return {
            success: true,
            data: {
                total_products: 0,
                total_warehouses: 0,
                total_stock_value: 0,
                low_stock_items: 0,
            },
        };
    },
    async getLowStockReport() {
        await delay(MOCK_DELAY);
        return {
            success: true,
            data: [],
        };
    },
};

export const dashboardApi = {
    async getSummary() {
        await delay(MOCK_DELAY);
        return {
            success: true,
            data: {
                total_stock_value: 0,
                total_products: 0,
                total_warehouses: 0,
                total_orders: 0,
                pending_orders: 0,
                low_stock_items: 0,
                recent_movements: [],
            },
        };
    },
};
