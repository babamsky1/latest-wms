/**
 * All Products Page - Refactored
 * 
 * Features:
 * ✅ Standardized StatCards with content-aware icons
 * ✅ DataTable with fixed pagination
 * ✅ Complete Product schema with audit columns
 * ✅ ActionMenu for operations
 * ✅ Consistent UI layout
 */

import { StatCard } from "@/components/dashboard/StatCard";
import AddModal, { AddField } from "@/components/modals/AddModal";
import DeleteModal from "@/components/modals/DeleteModal";
import EditModal, { EditField } from "@/components/modals/EditModal";
import { ActionMenu } from "@/components/table/ActionMenu";
import { ColumnDef, DataTable } from "@/components/table/DataTable";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/types/database";
import { useState } from "react";

/**
 * Extended Product interface for UI display
 */
interface ProductDisplay extends Product {
  category_name?: string;
  created_by_name?: string;
  updated_by_name?: string;
  quantity?: number; // Joined from stock table in real app
  [key: string]: unknown;
}

export default function AllProducts() {
  const [products, setProducts] = useState<ProductDisplay[]>([
    {
      id: 1,
      sku: "IP15-128-BLK",
      barcode: "194253408123",
      name: "iPhone 15",
      description: "Apple iPhone 15, 128GB, Midnight Black",
      category_id: 101,
      category_name: "Smartphones",
      brand: "Apple",
      group: "Mobile Devices",
      unit: "pcs",
      cost_price: 699.00,
      selling_price: 799.00,
      minimum_stock: 10,
      maximum_stock: 100,
      reorder_point: 20,
      primary_supplier_id: 501,
      weight: 0.171,
      status: "active",
      quantity: 45,
      created_by: 1,
      created_by_name: "Admin User",
      updated_by: 1,
      updated_by_name: "Admin User",
      created_at: "2024-01-10T08:00:00Z",
      updated_at: "2024-01-15T14:30:00Z",
    },
    {
      id: 2,
      sku: "SAM-S24-ULTRA",
      barcode: "880609431234",
      name: "Samsung Galaxy S24 Ultra",
      description: "Samsung Galaxy S24 Ultra, 512GB, Titanium Gray",
      category_id: 101,
      category_name: "Smartphones",
      brand: "Samsung",
      group: "Mobile Devices",
      unit: "pcs",
      cost_price: 950.00,
      selling_price: 1299.00,
      minimum_stock: 15,
      maximum_stock: 80,
      reorder_point: 25,
      primary_supplier_id: 502,
      weight: 0.232,
      status: "active",
      quantity: 12,
      created_by: 2,
      created_by_name: "John Doe",
      updated_by: 2,
      updated_by_name: "John Doe",
      created_at: "2024-01-20T09:15:00Z",
      updated_at: "2024-01-20T09:15:00Z",
    },
    {
      id: 3,
      sku: "MBA-M3-13",
      barcode: "194253409999",
      name: "MacBook Air M3",
      description: "13-inch MacBook Air with M3 chip, 8GB RAM, 256GB SSD",
      category_id: 102,
      category_name: "Laptops",
      brand: "Apple",
      group: "Computers",
      unit: "pcs",
      cost_price: 999.00,
      selling_price: 1099.00,
      minimum_stock: 5,
      maximum_stock: 50,
      reorder_point: 10,
      primary_supplier_id: 501,
      weight: 1.24,
      status: "active",
      quantity: 28,
      created_by: 1,
      created_by_name: "Admin User",
      updated_by: 1,
      updated_by_name: "Admin User",
      created_at: "2024-03-05T10:00:00Z",
      updated_at: "2024-03-05T10:00:00Z",
    },
    {
      id: 4,
      sku: "LOGI-MX-MST3",
      barcode: "097855149000",
      name: "Logitech MX Master 3S",
      description: "Performance Wireless Mouse",
      category_id: 103,
      category_name: "Accessories",
      brand: "Logitech",
      group: "Peripherals",
      unit: "pcs",
      cost_price: 70.00,
      selling_price: 99.99,
      minimum_stock: 30,
      maximum_stock: 200,
      reorder_point: 50,
      primary_supplier_id: 503,
      weight: 0.141,
      status: "inactive",
      quantity: 150,
      created_by: 3,
      created_by_name: "Jane Smith",
      updated_by: 3,
      updated_by_name: "Jane Smith",
      created_at: "2023-11-15T11:20:00Z",
      updated_at: "2024-02-01T16:45:00Z",
    },
    {
      id: 5,
      sku: "DELL-XPS-15",
      barcode: "884116385111",
      name: "Dell XPS 15",
      description: "Dell XPS 15 Laptop, OLED Display, i9 Processor",
      category_id: 102,
      category_name: "Laptops",
      brand: "Dell",
      group: "Computers",
      unit: "pcs",
      cost_price: 1800.00,
      selling_price: 2200.00,
      minimum_stock: 3,
      maximum_stock: 20,
      reorder_point: 5,
      primary_supplier_id: 504,
      weight: 1.86,
      status: "discontinued",
      quantity: 0,
      created_by: 1,
      created_by_name: "Admin User",
      updated_by: 1,
      updated_by_name: "Admin User",
      created_at: "2023-01-10T09:00:00Z",
      updated_at: "2024-01-05T12:00:00Z",
    }
  ]);

  const columns: ColumnDef<ProductDisplay>[] = [
    { key: "name", label: "Product Name", className: "font-medium" },
    { key: "sku", label: "SKU", className: "font-mono text-xs" },
    { key: "barcode", label: "Barcode", className: "font-mono text-xs hidden lg:table-cell" },
    { key: "category_name", label: "Category" },
    { key: "brand", label: "Brand", className: "hidden sm:table-cell" },
    { 
      key: "quantity", 
      label: "Stock", 
      render: (row) => (
        <span className={row.quantity !== undefined && row.quantity <= row.minimum_stock ? "text-destructive font-bold" : ""}>
          {row.quantity} {row.unit}
        </span>
      )
    },
    { 
      key: "selling_price", 
      label: "Price", 
      render: (row) => `$${row.selling_price.toLocaleString('en-US', { minimumFractionDigits: 2 })}` 
    },
    {
      key: "status",
      label: "Status",
      render: (row) => {
        const variants: Record<string, string> = {
          active: "default",
          inactive: "secondary",
          discontinued: "destructive",
        };
        return <Badge variant={variants[row.status] as any}>{row.status}</Badge>;
      },
    },
    // Audit Columns
    {
      key: "created_by_name",
      label: "Created By",
      className: "text-sm text-muted-foreground hidden 2xl:table-cell",
    },
    {
      key: "created_at",
      label: "Created At",
      className: "text-sm text-muted-foreground hidden 2xl:table-cell",
      render: (row) => new Date(row.created_at).toLocaleDateString(),
    },
    {
      key: "updated_by_name",
      label: "Updated By",
      className: "text-sm text-muted-foreground hidden xl:table-cell",
    },
    {
      key: "updated_at",
      label: "Updated",
      className: "text-sm text-muted-foreground hidden xl:table-cell",
      render: (row) => new Date(row.updated_at).toLocaleDateString(),
    },
  ];

  const addFields: AddField<ProductDisplay>[] = [
    { label: "Product Name", name: "name", type: "text", required: true },
    { label: "SKU", name: "sku", type: "text", required: true },
    { label: "Barcode", name: "barcode", type: "text" },
    { label: "Category", name: "category_id", type: "select", options: [
      { value: "101", label: "Smartphones" },
      { value: "102", label: "Laptops" },
      { value: "103", label: "Accessories" },
    ]},
    { label: "Brand", name: "brand", type: "text" },
    { label: "Unit", name: "unit", type: "text", placeholder: "pcs, box, kg..." },
    { label: "Cost Price", name: "cost_price", type: "number", required: true },
    { label: "Selling Price", name: "selling_price", type: "number", required: true },
    { label: "Min Stock", name: "minimum_stock", type: "number" },
    { label: "Status", name: "status", type: "select", options: [
      { value: "active", label: "Active" },
      { value: "inactive", label: "Inactive" },
    ]},
  ];

  const editFields: EditField<ProductDisplay>[] = [...addFields];

  // Helper to handle actions
  const handleAdd = (data: Partial<ProductDisplay>) => {
    const newProduct = {
      ...data,
      id: Date.now(),
      quantity: 0, // Initial stock
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_by_name: "Admin User",
      updated_by_name: "Admin User",
    } as ProductDisplay;
    setProducts([newProduct, ...products]);
  };

  const handleUpdate = (id: number, data: Partial<ProductDisplay>) => {
    setProducts(products.map(p => p.id === id ? { ...p, ...data, updated_at: new Date().toISOString() } : p));
  };

  const handleDelete = (id: number) => {
    setProducts(products.filter(p => p.id !== id));
  };

  // Stats
  const stats = {
    total: products.length,
    active: products.filter(p => p.status === 'active').length,
    lowStock: products.filter(p => (p.quantity ?? 0) <= p.minimum_stock).length,
    totalValue: products.reduce((sum, p) => sum + (p.selling_price * (p.quantity ?? 0)), 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">All Products</h1>
          <p className="page-description">Manage product catalog and base inventory settings</p>
        </div>
        <AddModal<ProductDisplay>
          title="Add New Product"
          description="Create a new product record"
          fields={addFields}
          initialData={{} as ProductDisplay}
          onSubmit={handleAdd}
          triggerLabel="Add Product"
          submitLabel="Create Product"
          size="lg"
        />
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Products"
          value={stats.total}
          // change={{ value: 12, type: "increase" }}
          variant="primary"
          contentType="products"
        />
        <StatCard
          label="Active Products"
          value={stats.active}
          variant="success"
          contentType="active"
        />
        <StatCard
          label="Low Stock Items"
          value={stats.lowStock}
          variant="warning"
          contentType="low-stock"
        />
        <StatCard
          label="Total Inventory Value"
          value={`$${stats.totalValue.toLocaleString('en-US', { maximumFractionDigits: 0 })}`}
          variant="default"
          contentType="value"
        />
      </div>

      {/* DataTable */}
      <DataTable
        data={products}
        columns={columns}
        searchPlaceholder="Search products by name, SKU, or barcode..."
        defaultPageSize={10}
        actions={(row) => (
          <ActionMenu>
            <EditModal<ProductDisplay>
              title="Edit Product"
              description={`Update ${row.name}`}
              fields={editFields}
              data={row}
              onSubmit={(data) => handleUpdate(row.id, data)}
              triggerLabel="Edit"
              submitLabel="Save Changes"
            />
            <DeleteModal
              title="Delete Product"
              description={`Are you sure you want to delete ${row.name}?`}
              onSubmit={() => handleDelete(row.id)}
              triggerLabel="Delete"
            />
          </ActionMenu>
        )}
      />
    </div>
  );
}
