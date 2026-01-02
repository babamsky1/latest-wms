import type {
    ApiResponse,
    PaginatedResponse,
    StockMovement,
} from '@/types/database';

import {
    mockOrders,
    mockProducts,
    mockStockBuffers,
    mockStockMovements,
    mockStocks,
    mockWarehouses,
} from './mockData';

const MOCK_DELAY = 300;
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const reportsApi = {
    async getStockMovements(page: number = 1, limit: number = 10): Promise<ApiResponse<PaginatedResponse<StockMovement>>> {
        await delay(MOCK_DELAY);
        const start = (page - 1) * limit;
        const data = mockStockMovements.slice(start, start + limit);
        return {
            success: true,
            data: {
                data,
                total: mockStockMovements.length,
                page,
                limit,
                total_pages: Math.ceil(mockStockMovements.length / limit),
            },
        };
    },
    async getInventorySummary() {
        await delay(MOCK_DELAY);
        return {
            success: true,
            data: {
                total_products: mockProducts.length,
                total_warehouses: mockWarehouses.length,
                total_stock_value: mockStocks.reduce((sum, stock) => {
                    const product = mockProducts.find((p) => p.id === stock.product_id);
                    return sum + (product?.cost_price || 0) * stock.quantity;
                }, 0),
                low_stock_items: mockStocks.filter((stock) => {
                    const buffer = mockStockBuffers.find((b) => b.product_id === stock.product_id);
                    return buffer && stock.quantity <= buffer.minimum_stock;
                }).length,
            },
        };
    },
    async getLowStockReport() {
        await delay(MOCK_DELAY);
        const lowStocks = mockStocks.filter((stock) => {
            const buffer = mockStockBuffers.find((b) => b.product_id === stock.product_id);
            return buffer && stock.quantity <= buffer.minimum_stock;
        });
        return {
            success: true,
            data: lowStocks.map((stock) => {
                const product = mockProducts.find((p) => p.id === stock.product_id);
                const buffer = mockStockBuffers.find((b) => b.product_id === stock.product_id);
                return {
                    product_id: stock.product_id,
                    product_name: product?.name || 'Unknown',
                    minimum_stock: buffer?.minimum_stock || 0,
                    current_quantity: stock.quantity,
                    shortage: Math.max(0, (buffer?.minimum_stock || 0) - stock.quantity),
                };
            }),
        };
    },
};

export const dashboardApi = {
    async getSummary() {
        await delay(MOCK_DELAY);
        const totalValue = mockStocks.reduce((sum, stock) => {
            const product = mockProducts.find((p) => p.id === stock.product_id);
            return sum + (product?.cost_price || 0) * stock.quantity;
        }, 0);
        return {
            success: true,
            data: {
                total_stock_value: totalValue,
                total_products: mockProducts.length,
                total_warehouses: mockWarehouses.length,
                total_orders: mockOrders.length,
                pending_orders: mockOrders.filter((o) => o.status === 'pending').length,
                low_stock_items: mockStocks.filter((stock) => {
                    const buffer = mockStockBuffers.find((b) => b.product_id === stock.product_id);
                    return buffer && stock.quantity <= buffer.minimum_stock;
                }).length,
                recent_movements: mockStockMovements.slice(0, 5),
            },
        };
    },
};
