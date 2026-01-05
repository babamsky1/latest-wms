import type {
    ApiResponse,
    Order,
    PaginatedResponse,
    Receiving,
    Return,
    Shipment,
} from '@/types/database';

const MOCK_DELAY = 300;
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const receivingsApi = {
    async getAll(page: number = 1, limit: number = 10): Promise<ApiResponse<PaginatedResponse<Receiving>>> {
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
    async getById(id: number) {
        await delay(MOCK_DELAY);
        return { success: false, message: 'Receiving not found' };
    },
};

export const shipmentsApi = {
    async getAll(page: number = 1, limit: number = 10): Promise<ApiResponse<PaginatedResponse<Shipment>>> {
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
    async getById(id: number) {
        await delay(MOCK_DELAY);
        return { success: false, message: 'Shipment not found' };
    },
};

export const returnsApi = {
    async getAll(page: number = 1, limit: number = 10): Promise<ApiResponse<PaginatedResponse<Return>>> {
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
    async getById(id: number) {
        await delay(MOCK_DELAY);
        return { success: false, message: 'Return not found' };
    },
};

export const ordersApi = {
    async getAll(page: number = 1, limit: number = 10): Promise<ApiResponse<PaginatedResponse<Order>>> {
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
    async getById(id: number) {
        await delay(MOCK_DELAY);
        return { success: false, message: 'Order not found' };
    },
};
