/**
 * Adjustments Page - CONDITIONALLY READ-ONLY
 * 
 * Spec:
 * ✅ Read-only when status is Pending / Done
 * ✅ Columns: Reference #, Adjustment Date, Source Reference, Category (JO, Zero Out, etc), Warehouse, Status, Created By/At, Updated By/At
 */

import { StatCard } from "@/components/dashboard/StatCard";
import { DevBadge } from "@/components/dev/DevTools";
import AddModal, { AddField } from "@/components/modals/AddModal";
import DeleteModal from "@/components/modals/DeleteModal";
import EditModal from "@/components/modals/EditModal";
import { ActionMenu } from "@/components/table/ActionMenu";
import { ColumnDef, DataTable } from "@/components/table/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AdjustmentRecord, useWms } from "@/context/WmsContext";
import { CheckCircle2, Clock, Scale } from "lucide-react";

export default function Adjustments() {
  const { adjustments, addAdjustment, updateAdjustment, deleteAdjustment, warehouses, items } = useWms();

  const categories = ["For JO", "For Zero Out", "Sample and Retention", "Wrong Encode"];
  const statuses = ["Open", "Pending", "Done"];

  const addFields: AddField<AdjustmentRecord>[] = [
    { label: "PSC (Item)", name: "psc", type: "datalist", options: items.map(i => ({ value: i.psc, label: `${i.psc} - ${i.shortDescription}` })), required: true },
    { label: "Category", name: "category", type: "select", options: categories.map(c => ({ value: c, label: c })), required: true },
    { label: "Warehouse", name: "warehouse", type: "select", options: warehouses.map(w => ({ value: w.name, label: w.name })), required: true },
    { label: "Adjustment Date", name: "adjustmentDate", type: "text", placeholder: "YYYY-MM-DD", required: true },
  ];

  const columns: ColumnDef<AdjustmentRecord>[] = [
    {
      key: "referenceNo",
      label: "Reference #",
      className: "font-mono font-bold",
      render: (row) => (
        <div className="flex items-center">
          {row.referenceNo}
          {row.isTestData && <DevBadge />}
        </div>
      )
    },
    { key: "psc", label: "PSC", className: "font-mono font-bold" },
    { key: "adjustmentDate", label: "Adjustment Date" },
    { key: "sourceReference", label: "Source Ref", className: "font-mono" },
    { key: "category", label: "Category" },
    { key: "warehouse", label: "Warehouse" },
    {
      key: "status",
      label: "Status",
      render: (row) => {
        const variants: Record<string, string> = {
          "Open": "status-pending",
          "Pending": "status-warning",
          "Done": "status-active"
        };
        return <span className={`status-badge ${variants[row.status]}`}>{row.status}</span>;
      }
    },
    { key: "createdBy", label: "Created By", className: "hidden xl:table-cell text-sm text-muted-foreground" },
    { key: "createdAt", label: "Created At", className: "hidden xl:table-cell text-sm text-muted-foreground" }
  ];

  const handleUpdate = (id: string, data: Partial<AdjustmentRecord>) => {
    updateAdjustment(id, { ...data, updatedAt: new Date().toLocaleString(), updatedBy: "admin" });
  };

  const handleDelete = (id: string) => {
    deleteAdjustment(id);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Inventory Adjustments</h1>
          <p className="page-description">Stock corrections and reconciliations</p>
        </div>
        <AddModal<AdjustmentRecord>
          title="New Adjustment"
          fields={addFields}
          onSubmit={(data) => {
            const newAdj: AdjustmentRecord = {
              ...data as AdjustmentRecord,
              id: Date.now().toString(),
              referenceNo: `ADJ-${String(adjustments.length + 1).padStart(3, "0")}`,
              status: "Open",
              createdBy: "admin",
              createdAt: new Date().toLocaleString(),
              updatedBy: "admin",
              updatedAt: new Date().toLocaleString(),
            };
            addAdjustment(newAdj);
          }}
          triggerLabel="New Adjustment"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Total Adjustments" value={adjustments.length} icon={Scale} variant="primary" />
        <StatCard label="Pending Approval" value={adjustments.filter(a => a.status === 'Pending').length} icon={Clock} variant="warning" />
        <StatCard label="Completed" value={adjustments.filter(a => a.status === 'Done').length} icon={CheckCircle2} variant="success" />
      </div>

      <DataTable
        data={adjustments}
        columns={columns}
        searchPlaceholder="Search adjustments..."
        actions={(row) => {
          const isLocked = row.status === "Pending" || row.status === "Done";
          if (isLocked) return <Badge variant="secondary">STATUS LOCKED</Badge>;

          return (
            <ActionMenu>
              <EditModal<AdjustmentRecord>
                title="Edit Adjustment"
                data={row}
                fields={addFields as any}
                onSubmit={(data) => handleUpdate(row.id, data)}
                triggerLabel="Edit"
              />
              <DeleteModal
                title="Delete Adjustment"
                onSubmit={() => handleDelete(row.id)}
                triggerLabel="Delete"
              />
              <Button size="sm" variant="ghost" className="text-success" onClick={() => handleUpdate(row.id, { status: "Pending" })}>
                Post
              </Button>
            </ActionMenu>
          );
        }}
      />
    </div>
  );
}
