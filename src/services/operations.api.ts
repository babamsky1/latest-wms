import type {
    ApiResponse,
    Order,
    PaginatedResponse,
    Receiving,
    Return,
    Shipment,
} from '@/types/database';

import {
    mockOrderItems,
    mockOrders,
    mockReceivingItems,
    mockReceivings,
    mockReturnItems,
    mockReturns,
    mockShipmentItems,
    mockShipments,
} from './mockData';

const MOCK_DELAY = 300;
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const receivingsApi = {
    async getAll(page: number = 1, limit: number = 10): Promise<ApiResponse<PaginatedResponse<Receiving>>> {
        await delay(MOCK_DELAY);
        const start = (page - 1) * limit;
        const data = mockReceivings.slice(start, start + limit);
        return {
            success: true,
            data: {
                data,
                total: mockReceivings.length,
                page,
                limit,
                total_pages: Math.ceil(mockReceivings.length / limit),
            },
        };
    },
    async getById(id: number) {
        await delay(MOCK_DELAY);
        const receiving = mockReceivings.find((r) => r.id === id);
        if (!receiving) return { success: false, message: 'Receiving not found' };
        const items = mockReceivingItems.filter((i) => i.receiving_id === id);
        return { success: true, data: { ...receiving, items } };
    },
};

export const shipmentsApi = {
    async getAll(page: number = 1, limit: number = 10): Promise<ApiResponse<PaginatedResponse<Shipment>>> {
        await delay(MOCK_DELAY);
        const start = (page - 1) * limit;
        const data = mockShipments.slice(start, start + limit);
        return {
            success: true,
            data: {
                data,
                total: mockShipments.length,
                page,
                limit,
                total_pages: Math.ceil(mockShipments.length / limit),
            },
        };
    },
    async getById(id: number) {
        await delay(MOCK_DELAY);
        const shipment = mockShipments.find((s) => s.id === id);
        if (!shipment) return { success: false, message: 'Shipment not found' };
        const items = mockShipmentItems.filter((i) => i.shipment_id === id);
        return { success: true, data: { ...shipment, items } };
    },
};

export const returnsApi = {
    async getAll(page: number = 1, limit: number = 10): Promise<ApiResponse<PaginatedResponse<Return>>> {
        await delay(MOCK_DELAY);
        const start = (page - 1) * limit;
        const data = mockReturns.slice(start, start + limit);
        return {
            success: true,
            data: {
                data,
                total: mockReturns.length,
                page,
                limit,
                total_pages: Math.ceil(mockReturns.length / limit),
            },
        };
    },
    async getById(id: number) {
        await delay(MOCK_DELAY);
        const returnRecord = mockReturns.find((r) => r.id === id);
        if (!returnRecord) return { success: false, message: 'Return not found' };
        const items = mockReturnItems.filter((i) => i.return_id === id);
        return { success: true, data: { ...returnRecord, items } };
    },
};

export const ordersApi = {
    async getAll(page: number = 1, limit: number = 10): Promise<ApiResponse<PaginatedResponse<Order>>> {
        await delay(MOCK_DELAY);
        const start = (page - 1) * limit;
        const data = mockOrders.slice(start, start + limit);
        return {
            success: true,
            data: {
                data,
                total: mockOrders.length,
                page,
                limit,
                total_pages: Math.ceil(mockOrders.length / limit),
            },
        };
    },
    async getById(id: number) {
        await delay(MOCK_DELAY);
        const order = mockOrders.find((o) => o.id === id);
        if (!order) return { success: false, message: 'Order not found' };
        const items = mockOrderItems.filter((i) => i.order_id === id);
        return { success: true, data: { ...order, items } };
    },
};
