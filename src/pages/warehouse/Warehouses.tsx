/**
 * Warehouses Page - Refactored
 * 
 * Features:
 * ✅ Standardized StatCards
 * ✅ DataTable with fixed pagination
 * ✅ Complete Warehouse schema with audit columns
 * ✅ ActionMenu for operations
 */

import { StatCard } from "@/components/dashboard/StatCard";
import AddModal, { AddField } from "@/components/modals/AddModal";
import DeleteModal from "@/components/modals/DeleteModal";
import EditModal, { EditField } from "@/components/modals/EditModal";
import { ActionMenu } from "@/components/table/ActionMenu";
import { ColumnDef, DataTable } from "@/components/table/DataTable";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Warehouse } from "@/types/database";
import { useState } from "react";

/**
 * Extended Warehouse interface for UI display
 */
interface WarehouseDisplay extends Warehouse {
  created_by_name?: string;
  updated_by_name?: string;
  used_capacity?: number; // Calculated field
  utilization_percentage?: number; // Calculated field
  location_count?: number; // Count of locations
  [key: string]: unknown;
}

export default function Warehouses() {
  const [warehouses, setWarehouses] = useState<WarehouseDisplay[]>([
    {
      id: 1,
      name: "Main Warehouse",
      code: "WH-001",
      type: "main",
      address: "123 Industrial Park, City A",
      contact_person: "John Smith",
      phone: "+1 (555) 123-4567",
      email: "jsmith@warehouse.com",
      capacity: 50000,
      used_capacity: 32500,
      utilization_percentage: 65,
      location_count: 250,
      status: "active",
      created_by: 1,
      created_by_name: "Admin User",
      updated_by: 1,
      updated_by_name: "Admin User",
      created_at: "2024-01-01T08:00:00Z",
      updated_at: "2024-01-01T08:00:00Z",
    },
    {
      id: 2,
      name: "Secondary Warehouse",
      code: "WH-002",
      type: "regional",
      address: "456 Logistics Ave, City B",
      contact_person: "Jane Doe",
      phone: "+1 (555) 987-6543",
      email: "jdoe@warehouse.com",
      capacity: 30000,
      used_capacity: 21000,
      utilization_percentage: 70,
      location_count: 150,
      status: "active",
      created_by: 1,
      created_by_name: "Admin User",
      updated_by: 1,
      updated_by_name: "Admin User",
      created_at: "2024-01-05T09:00:00Z",
      updated_at: "2024-01-05T09:00:00Z",
    },
    {
      id: 3,
      name: "Cold Storage",
      code: "WH-003",
      type: "regional",
      address: "789 Refrigeration Blvd, City A",
      contact_person: "Mike Johnson",
      phone: "+1 (555) 456-7890",
      email: "mjohnson@warehouse.com",
      capacity: 10000,
      used_capacity: 8500,
      utilization_percentage: 85,
      location_count: 80,
      status: "active",
      created_by: 1,
      created_by_name: "Admin User",
      updated_by: 1,
      updated_by_name: "Admin User",
      created_at: "2024-02-01T10:00:00Z",
      updated_at: "2024-02-01T10:00:00Z",
    },
    {
      id: 4,
      name: "Overflow Facility",
      code: "WH-004",
      type: "outlet",
      address: "321 Expansion Rd, City C",
      contact_person: "Sarah Wilson",
      phone: "+1 (555) 789-0123",
      email: "swilson@warehouse.com",
      capacity: 20000,
      used_capacity: 4000,
      utilization_percentage: 20,
      location_count: 100,
      status: "inactive",
      created_by: 1,
      created_by_name: "Admin User",
      updated_by: 1,
      updated_by_name: "Admin User",
      created_at: "2024-03-01T11:00:00Z",
      updated_at: "2024-03-15T14:00:00Z",
    },
  ]);

  // Helper for capacity color
  const getCapacityColor = (percentage: number) => {
    if (percentage >= 90) return "bg-destructive";
    if (percentage >= 70) return "bg-warning";
    return "bg-success";
  };

  const columns: ColumnDef<WarehouseDisplay>[] = [
    { 
      key: "code", 
      label: "Code", 
      className: "font-mono font-medium" 
    },
    { 
      key: "name", 
      label: "Warehouse Name", 
      className: "font-medium" 
    },
    {
      key: "type",
      label: "Type",
      render: (row) => (
        <Badge variant="outline" className="capitalize">{row.type}</Badge>
      )
    },
    { 
      key: "address", 
      label: "Address", 
      className: "hidden md:table-cell text-sm text-muted-foreground truncate max-w-[200px]" 
    },
    { 
      key: "contact_person", 
      label: "Manager",
      className: "hidden lg:table-cell" 
    },
    {
      key: "utilization_percentage",
      label: "Capacity",
      className: "min-w-[150px]",
      render: (row) => {
        const percent = row.utilization_percentage || 0;
        return (
          <div className="flex flex-col gap-1 w-full">
            <div className="flex justify-between text-xs">
              <span>{percent}%</span>
              <span className="text-muted-foreground">
                {((row.used_capacity || 0) / 1000).toFixed(1)}k / {((row.capacity || 0) / 1000).toFixed(1)}k
              </span>
            </div>
            <Progress value={percent} className={cn("h-1.5", getCapacityColor(percent))} />
          </div>
        );
      }
    },
    {
      key: "status",
      label: "Status",
      render: (row) => {
        const variants: Record<string, string> = {
          active: "default",
          inactive: "secondary",
        };
        return <Badge variant={variants[row.status] as any}>{row.status}</Badge>;
      },
    },
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
      label: "Last Updated",
      className: "text-sm text-muted-foreground hidden xl:table-cell",
      render: (row) => new Date(row.updated_at).toLocaleDateString(),
    },
  ];

  const addFields: AddField<WarehouseDisplay>[] = [
    { label: "Warehouse Name", name: "name", type: "text", required: true },
    { label: "Type", name: "type", type: "select", required: true, options: [
      { value: "main", label: "Main Warehouse" },
      { value: "regional", label: "Regional Hub" },
      { value: "outlet", label: "Outlet" },
      { value: "transit", label: "Transit Hub" },
    ]},
    { label: "Address", name: "address", type: "textarea", required: true },
    { label: "Contact Person", name: "contact_person", type: "text", required: true },
    { label: "Phone", name: "phone", type: "text", required: true },
    { label: "Email", name: "email", type: "text", required: true },
    { label: "Capacity (Units)", name: "capacity", type: "number", required: true },
    { label: "Status", name: "status", type: "select", options: [
      { value: "active", label: "Active" },
      { value: "inactive", label: "Inactive" },
    ]},
  ];

  const editFields: EditField<WarehouseDisplay>[] = [...addFields];

  const handleAdd = (data: Partial<WarehouseDisplay>) => {
    const newWarehouse: WarehouseDisplay = {
      ...data as WarehouseDisplay,
      id: Date.now(),
      code: `WH-${String(warehouses.length + 1).padStart(3, "0")}`,
      used_capacity: 0,
      utilization_percentage: 0,
      location_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_by: 1,
      created_by_name: "Admin User",
      updated_by: 1,
      updated_by_name: "Admin User",
    };
    setWarehouses([newWarehouse, ...warehouses]);
  };

  const handleUpdate = (id: number, data: Partial<WarehouseDisplay>) => {
    setWarehouses(warehouses.map(w => w.id === id ? { ...w, ...data, updated_at: new Date().toISOString() } : w));
  };

  const handleDelete = (id: number) => {
    setWarehouses(warehouses.filter(w => w.id !== id));
  };

  // Stats
  const stats = {
    total: warehouses.length,
    active: warehouses.filter(w => w.status === "active").length,
    totalCapacity: warehouses.reduce((sum, w) => sum + (w.capacity || 0), 0),
    avgUtilization: Math.round(warehouses.reduce((sum, w) => sum + (w.utilization_percentage || 0), 0) / warehouses.length),
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Warehouses</h1>
          <p className="page-description">Manage warehouse facilities and capacity</p>
        </div>
        <AddModal<WarehouseDisplay>
          title="Add New Warehouse"
          description="Create a new warehouse facility"
          fields={addFields}
          initialData={{} as WarehouseDisplay}
          onSubmit={handleAdd}
          triggerLabel="Add Warehouse"
          submitLabel="Create Warehouse"
          size="lg"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Warehouses"
          value={stats.total}
          contentType="warehouses"
          variant="primary"
        />
        <StatCard
          label="Active Facilities"
          value={stats.active}
          contentType="active"
          variant="success"
        />
        <StatCard
          label="Total Capacity"
          value={stats.totalCapacity.toLocaleString()}
          contentType="capacity"
          variant="default"
        />
        <StatCard
          label="Avg Utilization"
          value={`${stats.avgUtilization}%`}
          contentType="percentage"
          variant={stats.avgUtilization > 80 ? "warning" : "default"}
          change={{ value: 2, type: "increase" }}
        />
      </div>

      <DataTable
        data={warehouses}
        columns={columns}
        searchPlaceholder="Search warehouses..."
        defaultPageSize={10}
        actions={(row) => (
          <ActionMenu>
            <EditModal<WarehouseDisplay>
              title="Edit Warehouse"
              description={`Update ${row.name}`}
              fields={editFields}
              data={row}
              onSubmit={(data) => handleUpdate(row.id, data)}
              triggerLabel="Edit"
              submitLabel="Save Changes"
            />
            <DeleteModal
              title="Delete Warehouse"
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
