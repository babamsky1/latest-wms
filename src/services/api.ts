/**
 * Mock API Service
 * Simulates API calls using mock data
 * In production, replace with real API endpoints
 */

import type {
  Category,
  Product,
  Warehouse,
  Location,
  Supplier,
  User,
  Stock,
  Order,
  OrderItem,
  Receiving,
  Return,
  Shipment,
  StockMovement,
  Adjustment,
  Transfer,
  StockBuffer,
  PaginatedResponse,
  ApiResponse,
} from '@/types/database';

import {
  mockCategories,
  mockProducts,
  mockWarehouses,
  mockLocations,
  mockSuppliers,
  mockUsers,
  mockStocks,
  mockOrders,
  mockOrderItems,
  mockReceivings,
  mockReceivingItems,
  mockReturns,
  mockReturnItems,
  mockShipments,
  mockShipmentItems,
  mockStockMovements,
  mockAdjustments,
  mockTransfers,
  mockStockBuffers,
  generateStocks,
  generateOrders,
} from './mockData';

// Delay to simulate network latency
const MOCK_DELAY = 300;

const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// ============================================================================
// MASTER DATA ENDPOINTS
// ============================================================================

export const categoriesApi = {
  async getAll(): Promise<ApiResponse<Category[]>> {
    await delay(MOCK_DELAY);
    return {
      success: true,
      data: mockCategories,
    };
  },

  async getById(id: number): Promise<ApiResponse<Category>> {
    await delay(MOCK_DELAY);
    const category = mockCategories.find((c) => c.id === id);
    if (!category) {
      return {
        success: false,
        message: 'Category not found',
      };
    }
    return { success: true, data: category };
  },
};

export const productsApi = {
  async getAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<ApiResponse<PaginatedResponse<Product>>> {
    await delay(MOCK_DELAY);
    const start = (page - 1) * limit;
    const end = start + limit;
    const data = mockProducts.slice(start, end);
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
    if (!product) {
      return {
        success: false,
        message: 'Product not found',
      };
    }
    return { success: true, data: product };
  },

  async searchBySku(sku: string): Promise<ApiResponse<Product>> {
    await delay(MOCK_DELAY);
    const product = mockProducts.find((p) => p.sku.includes(sku));
    if (!product) {
      return {
        success: false,
        message: 'Product not found',
      };
    }
    return { success: true, data: product };
  },
};

export const warehousesApi = {
  async getAll(): Promise<ApiResponse<Warehouse[]>> {
    await delay(MOCK_DELAY);
    return {
      success: true,
      data: mockWarehouses,
    };
  },

  async getById(id: number): Promise<ApiResponse<Warehouse>> {
    await delay(MOCK_DELAY);
    const warehouse = mockWarehouses.find((w) => w.id === id);
    if (!warehouse) {
      return {
        success: false,
        message: 'Warehouse not found',
      };
    }
    return { success: true, data: warehouse };
  },
};

export const locationsApi = {
  async getByWarehouse(warehouseId: number): Promise<ApiResponse<Location[]>> {
    await delay(MOCK_DELAY);
    const locations = mockLocations.filter((l) => l.warehouse_id === warehouseId);
    return {
      success: true,
      data: locations,
    };
  },

  async getById(id: number): Promise<ApiResponse<Location>> {
    await delay(MOCK_DELAY);
    const location = mockLocations.find((l) => l.id === id);
    if (!location) {
      return {
        success: false,
        message: 'Location not found',
      };
    }
    return { success: true, data: location };
  },
};

export const suppliersApi = {
  async getAll(): Promise<ApiResponse<Supplier[]>> {
    await delay(MOCK_DELAY);
    return {
      success: true,
      data: mockSuppliers,
    };
  },

  async getById(id: number): Promise<ApiResponse<Supplier>> {
    await delay(MOCK_DELAY);
    const supplier = mockSuppliers.find((s) => s.id === id);
    if (!supplier) {
      return {
        success: false,
        message: 'Supplier not found',
      };
    }
    return { success: true, data: supplier };
  },
};

export const usersApi = {
  async getAll(): Promise<ApiResponse<User[]>> {
    await delay(MOCK_DELAY);
    return {
      success: true,
      data: mockUsers,
    };
  },

  async getById(id: number): Promise<ApiResponse<User>> {
    await delay(MOCK_DELAY);
    const user = mockUsers.find((u) => u.id === id);
    if (!user) {
      return {
        success: false,
        message: 'User not found',
      };
    }
    return { success: true, data: user };
  },
};

// ============================================================================
// INVENTORY ENDPOINTS
// ============================================================================

export const stocksApi = {
  async getAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<ApiResponse<PaginatedResponse<Stock>>> {
    await delay(MOCK_DELAY);
    const start = (page - 1) * limit;
    const end = start + limit;
    const data = mockStocks.slice(start, end);
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
    const stocks = mockStocks.filter((s) => s.warehouse_id === warehouseId);
    return {
      success: true,
      data: stocks,
    };
  },

  async getByProduct(productId: number): Promise<ApiResponse<Stock[]>> {
    await delay(MOCK_DELAY);
    const stocks = mockStocks.filter((s) => s.product_id === productId);
    return {
      success: true,
      data: stocks,
    };
  },

  async getLowStock(): Promise<ApiResponse<Stock[]>> {
    await delay(MOCK_DELAY);
    const lowStocks = mockStocks.filter((stock) => {
      const buffer = mockStockBuffers.find((b) => b.product_id === stock.product_id);
      return buffer && stock.quantity <= buffer.minimum_stock;
    });
    return {
      success: true,
      data: lowStocks,
    };
  },
};

export const stockBuffersApi = {
  async getAll(): Promise<ApiResponse<StockBuffer[]>> {
    await delay(MOCK_DELAY);
    return {
      success: true,
      data: mockStockBuffers,
    };
  },

  async getByProduct(productId: number): Promise<ApiResponse<StockBuffer | null>> {
    await delay(MOCK_DELAY);
    const buffer = mockStockBuffers.find((b) => b.product_id === productId);
    return {
      success: true,
      data: buffer || null,
    };
  },
};

// ============================================================================
// OPERATIONS ENDPOINTS
// ============================================================================

export const receivingsApi = {
  async getAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<ApiResponse<PaginatedResponse<Receiving>>> {
    await delay(MOCK_DELAY);
    const start = (page - 1) * limit;
    const end = start + limit;
    const data = mockReceivings.slice(start, end);
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
    if (!receiving) {
      return {
        success: false,
        message: 'Receiving not found',
      };
    }
    const items = mockReceivingItems.filter((i) => i.receiving_id === id);
    return {
      success: true,
      data: { ...receiving, items },
    };
  },
};

export const shipmentsApi = {
  async getAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<ApiResponse<PaginatedResponse<Shipment>>> {
    await delay(MOCK_DELAY);
    const start = (page - 1) * limit;
    const end = start + limit;
    const data = mockShipments.slice(start, end);
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
    if (!shipment) {
      return {
        success: false,
        message: 'Shipment not found',
      };
    }
    const items = mockShipmentItems.filter((i) => i.shipment_id === id);
    return {
      success: true,
      data: { ...shipment, items },
    };
  },
};

export const returnsApi = {
  async getAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<ApiResponse<PaginatedResponse<Return>>> {
    await delay(MOCK_DELAY);
    const start = (page - 1) * limit;
    const end = start + limit;
    const data = mockReturns.slice(start, end);
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
    if (!returnRecord) {
      return {
        success: false,
        message: 'Return not found',
      };
    }
    const items = mockReturnItems.filter((i) => i.return_id === id);
    return {
      success: true,
      data: { ...returnRecord, items },
    };
  },
};

export const adjustmentsApi = {
  async getAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<ApiResponse<PaginatedResponse<Adjustment>>> {
    await delay(MOCK_DELAY);
    const start = (page - 1) * limit;
    const end = start + limit;
    const data = mockAdjustments.slice(start, end);
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
  async getAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<ApiResponse<PaginatedResponse<Transfer>>> {
    await delay(MOCK_DELAY);
    const start = (page - 1) * limit;
    const end = start + limit;
    const data = mockTransfers.slice(start, end);
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

// ============================================================================
// ORDERS ENDPOINTS
// ============================================================================

export const ordersApi = {
  async getAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<ApiResponse<PaginatedResponse<Order>>> {
    await delay(MOCK_DELAY);
    const start = (page - 1) * limit;
    const end = start + limit;
    const data = mockOrders.slice(start, end);
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
    if (!order) {
      return {
        success: false,
        message: 'Order not found',
      };
    }
    const items = mockOrderItems.filter((i) => i.order_id === id);
    return {
      success: true,
      data: { ...order, items },
    };
  },
};

// ============================================================================
// REPORTS ENDPOINTS
// ============================================================================

export const reportsApi = {
  async getStockMovements(
    page: number = 1,
    limit: number = 10,
  ): Promise<ApiResponse<PaginatedResponse<StockMovement>>> {
    await delay(MOCK_DELAY);
    const start = (page - 1) * limit;
    const end = start + limit;
    const data = mockStockMovements.slice(start, end);
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

// ============================================================================
// DASHBOARD ENDPOINTS
// ============================================================================

export const dashboardApi = {
  async getSummary() {
    await delay(MOCK_DELAY);
    
    const totalValue = mockStocks.reduce((sum, stock) => {
      const product = mockProducts.find((p) => p.id === stock.product_id);
      return sum + (product?.cost_price || 0) * stock.quantity;
    }, 0);

    const totalOrders = mockOrders.length;
    const pendingOrders = mockOrders.filter((o) => o.status === 'pending').length;
    const lowStockItems = mockStocks.filter((stock) => {
      const buffer = mockStockBuffers.find((b) => b.product_id === stock.product_id);
      return buffer && stock.quantity <= buffer.minimum_stock;
    }).length;

    return {
      success: true,
      data: {
        total_stock_value: totalValue,
        total_products: mockProducts.length,
        total_warehouses: mockWarehouses.length,
        total_orders: totalOrders,
        pending_orders: pendingOrders,
        low_stock_items: lowStockItems,
        recent_movements: mockStockMovements.slice(0, 5),
      },
    };
  },
};
