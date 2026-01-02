/**
 * Inventory Overview Page - Refactored
 * 
 * Features:
 * ✅ Standardized StatCards with content-aware icons
 * ✅ DataTable with fixed pagination and search
 * ✅ Warehouse-based filtering (Tabs)
 * ✅ usage visualization
 */

import { StatCard } from "@/components/dashboard/StatCard";
import { ColumnDef, DataTable } from "@/components/table/DataTable";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useState } from "react";

/* ================= TYPES ================= */
interface InventoryDisplay {
  id: number;
  sku: string;
  name: string;
  warehouse_name: string;
  location_name: string;
  quantity: number;
  capacity: number;
  unit: string;
  last_updated: string;
  status: 'in_stock' | 'low_stock' | 'out_of_stock' | 'overstock';
  [key: string]: unknown;
}

/* ================= DATA ================= */
const inventoryItems: InventoryDisplay[] = [
  { 
    id: 1, 
    sku: "WGT-A123", 
    name: "Widget A-123", 
    warehouse_name: "Main Warehouse", 
    location_name: "A-01-02-03", 
    quantity: 250, 
    capacity: 500, 
    unit: "pcs", 
    last_updated: "2024-01-15 14:30",
    status: "in_stock"
  },
  { 
    id: 2, 
    sku: "WGT-A123", 
    name: "Widget A-123", 
    warehouse_name: "Main Warehouse", 
    location_name: "A-01-02-04", 
    quantity: 200, 
    capacity: 500, 
    unit: "pcs", 
    last_updated: "2024-01-15 14:30",
    status: "in_stock"
  },
  { 
    id: 3, 
    sku: "CMP-B456", 
    name: "Component B-456", 
    warehouse_name: "Main Warehouse", 
    location_name: "B-02-01-01", 
    quantity: 28, 
    capacity: 100, 
    unit: "pcs", 
    last_updated: "2024-01-15 10:15",
    status: "low_stock"
  },
  { 
    id: 4, 
    sku: "RAW-C789", 
    name: "Raw Material C-789", 
    warehouse_name: "Secondary Warehouse", 
    location_name: "C-01-03-02", 
    quantity: 1200, 
    capacity: 2000, 
    unit: "kg", 
    last_updated: "2024-01-14 16:45",
    status: "in_stock"
  },
];

export default function Overview() {
  const [activeTab, setActiveTab] = useState<string>("Main Warehouse");

  const filteredInventory = inventoryItems.filter(
    (item) => item.warehouse_name === activeTab
  );

  const getCapacityColor = (percentage: number) => {
    if (percentage >= 90) return "bg-destructive";
    if (percentage >= 70) return "bg-warning";
    return "bg-success";
  };

  // Stats
  const stats = {
    totalItems: filteredInventory.length,
    totalQuantity: filteredInventory.reduce((sum, item) => sum + item.quantity, 0),
    totalCapacity: filteredInventory.reduce((sum, item) => sum + item.capacity, 0),
    utilization: filteredInventory.length > 0 
      ? Math.round((filteredInventory.reduce((sum, item) => sum + item.quantity, 0) / filteredInventory.reduce((sum, item) => sum + item.capacity, 0)) * 100)
      : 0
  };

  const columns: ColumnDef<InventoryDisplay>[] = [
    { 
      key: "sku", 
      label: "SKU", 
      className: "font-mono font-medium" 
    },
    { 
      key: "name", 
      label: "Product Name" 
    },
    { 
      key: "warehouse_name", 
      label: "Warehouse" 
    },
    { 
      key: "location_name", 
      label: "Location",
      render: (row) => <Badge variant="outline" className="font-mono">{row.location_name}</Badge>
    },
    {
      key: "quantity",
      label: "Quantity",
      render: (row) => (
        <span>
          <span className="font-semibold">{row.quantity.toLocaleString()}</span>{" "}
          <span className="text-muted-foreground text-xs">{row.unit}</span>
        </span>
      )
    },
    {
      key: "capacity",
      label: "Capacity",
      render: (row) => {
        const usage = Math.round((row.quantity / row.capacity) * 100);
        return (
          <div className="flex items-center gap-2 w-full max-w-[150px]">
            <Progress value={usage} className={cn("h-2 flex-1", getCapacityColor(usage))} />
            <span className="text-xs text-muted-foreground w-8 text-left">{usage}%</span>
          </div>
        );
      }
    },
    { 
      key: "last_updated", 
      label: "Last Updated",
      className: "text-sm text-muted-foreground"
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Inventory Overview</h1>
          <p className="page-description">View and manage stock levels by warehouse</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-border">
        {["Main Warehouse", "Secondary Warehouse"].map((tab) => (
          <button
            key={tab}
            className={cn(
              "px-4 py-2 font-medium text-sm rounded-t-md transition-colors border-t border-l border-r",
              activeTab === tab
                ? "bg-card text-primary border-border border-b-card -mb-px"
                : "bg-transparent text-muted-foreground border-transparent hover:bg-muted/50 hover:text-foreground"
            )}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          label="Total Items"
          value={stats.totalItems}
          contentType="products"
          variant="primary"
        />
        <StatCard
          label="Total Quantity"
          value={stats.totalQuantity.toLocaleString()}
          contentType="quantity"
          variant="default" // Changed from 'info' to 'default' as 'info' maps to blue/cyan which is usually default/primary
        />
        <StatCard
          label="Total Capacity"
          value={stats.totalCapacity.toLocaleString()}
          contentType="capacity"
          variant="warning"
        />
        <StatCard
          label="Utilization"
          value={`${stats.utilization}%`}
          contentType="percentage"
          variant={stats.utilization > 80 ? "destructive" : "success"}
        />
      </div>

      {/* Table */}
      <DataTable
        data={filteredInventory}
        columns={columns}
        searchPlaceholder="Search by SKU, product name, or location..."
        defaultPageSize={10}
      />
    </div>
  );
}
