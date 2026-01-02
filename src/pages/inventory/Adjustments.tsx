/**
 * Adjustments Page - Refactored
 * 
 * Features:
 * ✅ Standardized StatCards
 * ✅ DataTable with fixed pagination
 * ✅ Complete Adjustment schema with audit columns
 * ✅ ActionMenu for operations
 */

import { StatCard } from "@/components/dashboard/StatCard";
import AddModal, { AddField } from "@/components/modals/AddModal";
import DeleteModal from "@/components/modals/DeleteModal";
import EditModal, { EditField } from "@/components/modals/EditModal";
import { ActionMenu } from "@/components/table/ActionMenu";
import { ColumnDef, DataTable } from "@/components/table/DataTable";
import { Badge } from "@/components/ui/badge";
import { Adjustment } from "@/types/database";
import { format } from "date-fns";
import { useState } from "react";

/**
 * Extended Adjustment interface for UI display
 */
interface AdjustmentDisplay extends Adjustment {
  product_name?: string;
  warehouse_name?: string;
  location_name?: string;
  adjusted_by_name?: string;
  approved_by_name?: string;
  created_by_name?: string;
  updated_by_name?: string;
  status: string;
  [key: string]: unknown;
}

export default function Adjustments() {
  const [adjustments, setAdjustments] = useState<AdjustmentDisplay[]>([
    {
      id: 1,
      adjustment_no: "ADJ-2025-001",
      product_id: 101,
      product_name: "iPhone 15",
      warehouse_id: 1,
      warehouse_name: "Main Warehouse",
      location_id: 5,
      location_name: "A-01-01",
      previous_qty: 50,
      adjusted_qty: 48,
      adjustment_type: "decrease",
      category: "damage",
      reason: "Damaged during handling",
      cost_impact: -1598.00,
      status: "approved",
      adjusted_by: 2,
      adjusted_by_name: "John Operator",
      approved_by: 1,
      approved_by_name: "Admin User",
      approved_at: "2025-01-02T10:00:00Z",
      created_by: 2,
      created_by_name: "John Operator",
      updated_by: 1,
      updated_by_name: "Admin User",
      created_at: "2025-01-02T09:00:00Z",
      updated_at: "2025-01-02T10:00:00Z",
    },
    {
      id: 2,
      adjustment_no: "ADJ-2025-002",
      product_id: 205,
      product_name: "Office Chair",
      warehouse_id: 2,
      warehouse_name: "Regional Hub",
      location_id: 12,
      location_name: "B-05-02",
      previous_qty: 120,
      adjusted_qty: 125,
      adjustment_type: "increase",
      category: "physical_count",
      reason: "Found extra stock during cycle count",
      cost_impact: 450.00,
      status: "pending",
      adjusted_by: 3,
      adjusted_by_name: "Jane Storekeeper",
      created_by: 3,
      created_by_name: "Jane Storekeeper",
      updated_by: 3,
      updated_by_name: "Jane Storekeeper",
      created_at: "2025-01-02T11:30:00Z",
      updated_at: "2025-01-02T11:30:00Z",
    },
    {
      id: 3,
      adjustment_no: "ADJ-2025-003",
      product_id: 301,
      product_name: "Laptop HP",
      warehouse_id: 1,
      warehouse_name: "Main Warehouse",
      location_id: 8,
      location_name: "A-03-04",
      previous_qty: 15,
      adjusted_qty: 0,
      adjustment_type: "decrease",
      category: "theft",
      reason: "Missing from shelf, investigation ongoing",
      cost_impact: -12000.00,
      status: "pending",
      adjusted_by: 2,
      adjusted_by_name: "John Operator",
      created_by: 2,
      created_by_name: "John Operator",
      updated_by: 2,
      updated_by_name: "John Operator",
      created_at: "2025-01-01T16:00:00Z",
      updated_at: "2025-01-01T16:00:00Z",
    }
  ]);

  const columns: ColumnDef<AdjustmentDisplay>[] = [
    { 
      key: "adjustment_no", 
      label: "Ref No", 
      className: "font-mono font-medium" 
    },
    { 
      key: "created_at", 
      label: "Date",
      render: (row) => format(new Date(row.created_at), "yyyy-MM-dd")
    },
    { 
      key: "product_name", 
      label: "Product" 
    },
    { 
      key: "warehouse_name", 
      label: "Warehouse" 
    },
    {
      key: "category",
      label: "Category",
      render: (row) => {
        const labels: Record<string, string> = {
          physical_count: "Cycle Count",
          damage: "Damage",
          theft: "Theft/Loss",
          correction: "Correction",
          expiry: "Expired"
        };
        return labels[row.category] || row.category;
      }
    },
    {
      key: "adjustment_type",
      label: "Change",
      render: (row) => {
        const diff = Math.abs(row.adjusted_qty - row.previous_qty);
        return (
          <Badge variant={row.adjustment_type === "increase" ? "success" : "destructive"}>
            {row.adjustment_type === "increase" ? "+" : "-"}{diff}
          </Badge>
        );
      }
    },
    { 
      key: "cost_impact", 
      label: "Impact",
      className: "text-left",
      render: (row) => (
        <span className={row.cost_impact && row.cost_impact >= 0 ? "text-success" : "text-destructive"}>
          {row.cost_impact ? `$${Math.abs(row.cost_impact).toLocaleString()}` : "-"}
        </span>
      )
    },
    {
      key: "status",
      label: "Status",
      render: (row) => {
        const variants: Record<string, any> = {
          pending: "warning",
          approved: "success",
          rejected: "destructive",
          draft: "secondary",
        };
        return <Badge variant={variants[row.status]}>{row.status}</Badge>;
      },
    },
    { 
      key: "created_by_name", 
      label: "Created By",
      className: "text-sm text-muted-foreground hidden 2xl:table-cell"
    },
    { 
      key: "created_at", 
      label: "Created At",
      className: "text-sm text-muted-foreground hidden 2xl:table-cell",
      render: (row) => format(new Date(row.created_at), "yyyy-MM-dd HH:mm")
    },
    { 
      key: "updated_by_name", 
      label: "Updated By",
      className: "text-sm text-muted-foreground hidden xl:table-cell"
    },
    { 
      key: "updated_at", 
      label: "Updated At",
      className: "text-sm text-muted-foreground hidden xl:table-cell",
      render: (row) => format(new Date(row.updated_at), "yyyy-MM-dd HH:mm")
    },
  ];

  const addFields: AddField<AdjustmentDisplay>[] = [
    { label: "Product", name: "product_id", type: "select", required: true, options: [
      { value: "101", label: "iPhone 15" },
      { value: "205", label: "Office Chair" },
    ]},
    { label: "Warehouse", name: "warehouse_id", type: "select", required: true, options: [
      { value: "1", label: "Main Warehouse" },
      { value: "2", label: "Regional Hub" },
    ]},
    { label: "Category", name: "category", type: "select", required: true, options: [
      { value: "physical_count", label: "Physical Count" },
      { value: "damage", label: "Damage" },
      { value: "theft", label: "Theft/Loss" },
      { value: "correction", label: "Correction" },
    ]},
    { label: "Previous Qty", name: "previous_qty", type: "number", required: true },
    { label: "New Qty", name: "adjusted_qty", type: "number", required: true },
    { label: "Reason", name: "reason", type: "textarea", required: true },
  ];

  const editFields: EditField<AdjustmentDisplay>[] = [...addFields];

  const handleCreate = (data: Partial<AdjustmentDisplay>) => {
    // Logic to calculate type and impact would go here
    const diff = (data.adjusted_qty || 0) - (data.previous_qty || 0);
    const type = diff >= 0 ? "increase" : "decrease";
    
    const newAdj: AdjustmentDisplay = {
      ...data as AdjustmentDisplay,
      id: Date.now(),
      adjustment_no: `ADJ-${new Date().getFullYear()}-${String(adjustments.length + 1).padStart(3, "0")}`,
      adjustment_type: type,
      status: "pending",
      product_name: "Selected Product", // Mock
      warehouse_name: "Selected Warehouse", // Mock
      adjusted_by_name: "CurrentUser",
      created_by_name: "CurrentUser",
      updated_by_name: "CurrentUser",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      cost_impact: diff * 100, // Mock calculation
      created_by: 1,
      updated_by: 1,
      adjusted_by: 1,
      product_id: Number(data.product_id),
      warehouse_id: Number(data.warehouse_id),
      location_id: 1,
      reason: data.reason || "",
      category: data.category || "correction",
    };
    setAdjustments([newAdj, ...adjustments]);
  };

  const handleUpdate = (id: number, data: Partial<AdjustmentDisplay>) => {
    setAdjustments(adjustments.map(a => a.id === id ? { ...a, ...data, updated_at: new Date().toISOString() } : a));
  };

  const handleDelete = (id: number) => {
    setAdjustments(adjustments.filter(a => a.id !== id));
  };

  // Stats
  const stats = {
    total: adjustments.length,
    pending: adjustments.filter(a => a.status === "pending").length,
    thisMonth: adjustments.filter(a => new Date(a.created_at).getMonth() === new Date().getMonth()).length,
    totalImpact: adjustments.reduce((sum, a) => sum + (a.cost_impact || 0), 0),
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Inventory Adjustments</h1>
          <p className="page-description">Manage stock corrections, damages, and cycle counts</p>
        </div>
        <AddModal<AdjustmentDisplay>
          title="New Adjustment"
          description="Create a new inventory adjustment record"
          fields={addFields}
          initialData={{} as AdjustmentDisplay}
          onSubmit={handleCreate}
          triggerLabel="New Adjustment"
          submitLabel="Create Adjustment"
          size="lg"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Adjustments"
          value={stats.total}
          contentType="adjustments"
          variant="primary"
        />
        <StatCard
          label="Pending Approvals"
          value={stats.pending}
          contentType="pending"
          variant="warning"
        />
        <StatCard
          label="This Month"
          value={stats.thisMonth}
          contentType="calendar"
          variant="default"
        />
        <StatCard
          label="Net Value Impact"
          value={`$${stats.totalImpact.toLocaleString()}`}
          contentType="value"
          variant={stats.totalImpact >= 0 ? "success" : "destructive"}
        />
      </div>

      <DataTable
        data={adjustments}
        columns={columns}
        searchPlaceholder="Search adjustments..."
        defaultPageSize={10}
        actions={(row) => (
          <ActionMenu>
            <EditModal<AdjustmentDisplay>
              title="Edit Adjustment"
              description={`Update ${row.adjustment_no}`}
              fields={editFields}
              data={row}
              onSubmit={(data) => handleUpdate(row.id, data)}
              triggerLabel="Edit"
              submitLabel="Save Changes"
            />
            <DeleteModal
              title="Delete Adjustment"
              description={`Are you sure you want to delete ${row.adjustment_no}?`}
              onSubmit={() => handleDelete(row.id)}
              triggerLabel="Delete"
            />
          </ActionMenu>
        )}
      />
    </div>
  );
}
