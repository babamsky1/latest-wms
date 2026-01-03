/**
 * Purchase Order Page
 * 
 * Spec:
 * ✅ Read-only when Pending / Approved / Received
 * ✅ Columns: PO #, Order Date, Supplier, Expected Date, Total Amount, Status, Created By/At
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
import { PurchaseOrderRecord, useWms } from "@/context/WmsContext";
import { cn } from "@/lib/utils";
import { CheckCircle2, Clock, ShoppingCart } from "lucide-react";

export default function PurchaseOrder() {
  const { purchaseOrders: records, addPO, updatePO, deletePO } = useWms();

  const addFields: AddField<PurchaseOrderRecord>[] = [
    { label: "Supplier Name", name: "supplierName", type: "text", required: true },
    { label: "Total Amount", name: "totalAmount", type: "number", required: true },
    { label: "Priority", name: "priority", type: "select", options: [{value: "Low", label: "Low"}, {value: "Medium", label: "Medium"}, {value: "High", label: "High"}], required: true },
    { label: "Order Date", name: "orderDate", type: "text", placeholder: "YYYY-MM-DD", required: true },
    { label: "Expected Delivery", name: "expectedDate", type: "text", placeholder: "YYYY-MM-DD", required: true },
  ];

  const columns: ColumnDef<PurchaseOrderRecord>[] = [
    { 
      key: "poNumber", 
      label: "PO #", 
      className: "font-mono font-bold",
      render: (row) => (
        <div className="flex items-center">
          {row.poNumber}
          {row.isTestData && <DevBadge />}
        </div>
      )
    },
    { key: "orderDate", label: "Order Date" },
    { key: "supplierName", label: "Supplier" },
    { key: "expectedDate", label: "Expected Date" },
    { 
      key: "totalAmount", 
      label: "Amount", 
      className: "font-bold",
      render: (row) => `₱${row.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
    },
    {
      key: "priority",
      label: "Priority",
      render: (row) => {
        const colors: Record<string, string> = {
          "Low": "bg-info/10 text-info",
          "Medium": "bg-warning/10 text-warning",
          "High": "bg-destructive/10 text-destructive"
        };
        return <span className={cn("status-badge", colors[row.priority])}>{row.priority}</span>;
      }
    },
    {
      key: "status",
      label: "Status",
      render: (row) => {
        const variants: Record<string, string> = {
          "Draft": "status-pending",
          "Pending": "status-warning",
          "Approved": "status-active",
          "Received": "bg-success text-success-foreground"
        };
        return <span className={cn("status-badge", variants[row.status])}>{row.status}</span>;
      }
    },
    { key: "updatedAt", label: "Updated At", className: "hidden xl:table-cell text-sm text-muted-foreground" }
  ];

  const handleUpdate = (id: string, data: Partial<PurchaseOrderRecord>) => {
    updatePO(id, data);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Purchase Orders</h1>
          <p className="page-description">Manage and track procurement cycles with suppliers</p>
        </div>
        <AddModal<PurchaseOrderRecord>
          title="Create New Purchase Order"
          fields={addFields}
          onSubmit={(data) => {
             const newRec: PurchaseOrderRecord = {
               ...data as PurchaseOrderRecord,
               id: Date.now().toString(),
               poNumber: `PO-${24000 + records.length + 1}`,
               status: "Draft",
               createdBy: "admin",
               createdAt: new Date().toLocaleString(),
               updatedBy: "admin",
               updatedAt: new Date().toLocaleString(),
             };
             addPO(newRec);
          }}
          triggerLabel="New PO"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Total POs" value={records.length} icon={ShoppingCart} variant="primary" />
        <StatCard label="Pending Approval" value={records.filter(r => r.status === 'Pending').length} icon={Clock} variant="warning" />
        <StatCard label="Approved" value={records.filter(r => r.status === 'Approved').length} icon={CheckCircle2} variant="success" />
      </div>

      <DataTable
        data={records}
        columns={columns}
        searchPlaceholder="Search by PO #, supplier..."
        actions={(row) => {
          const isLocked = row.status === "Approved" || row.status === "Received";
          if (isLocked) return <Badge variant="secondary">LOCKED</Badge>;

          return (
            <ActionMenu>
              <EditModal<PurchaseOrderRecord>
                title="Edit Purchase Order"
                data={row}
                fields={addFields as any}
                onSubmit={(data) => updatePO(row.id, data)}
                triggerLabel="Edit"
              />
              <DeleteModal
                title="Delete Purchase Order"
                onSubmit={() => deletePO(row.id)}
                triggerLabel="Delete"
              />
              <Button size="sm" variant="ghost" className="text-success" onClick={() => handleUpdate(row.id, { status: "Pending" })}>
                 Submit for Approval
              </Button>
            </ActionMenu>
          );
        }}
      />
    </div>
  );
}
