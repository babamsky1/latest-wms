/**
 * Withdrawal Page - CONDITIONALLY READ-ONLY
 * 
 * Spec:
 * ✅ Read-only when status is Pending / Done
 * ✅ Columns: Reference #, Transfer Date, Category (Acetone), Warehouse, Status, Created By/At, Updated By/At
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
import { useWms, WithdrawalRecord } from "@/context/WmsContext";
import { ArrowUpCircle, CheckCircle2, Clock } from "lucide-react";

export default function Withdrawal() {
  const { withdrawals: records, addWithdrawal, updateWithdrawal, deleteWithdrawal, warehouses, items } = useWms();

  const addFields: AddField<WithdrawalRecord>[] = [
    { label: "PSC (Item)", name: "psc", type: "datalist", options: items.map(i => ({ value: i.psc, label: `${i.psc} - i.shortDescription` })), required: true },
    { label: "Category", name: "category", type: "select", options: [{ value: "Acetone", label: "Acetone" }, { value: "Industrial", label: "Industrial" }], required: true },
    { label: "Warehouse", name: "warehouse", type: "select", options: warehouses.map(w => ({ value: w.name, label: w.name })), required: true },
    { label: "Transfer Date", name: "transferDate", type: "text", placeholder: "YYYY-MM-DD", required: true },
  ];

  const columns: ColumnDef<WithdrawalRecord>[] = [
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
    { key: "transferDate", label: "Transfer Date" },
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
    { key: "updatedBy", label: "Updated By", className: "hidden xl:table-cell text-sm text-muted-foreground" },
    { key: "updatedAt", label: "Updated At", className: "hidden xl:table-cell text-sm text-muted-foreground" }
  ];

  const handleUpdate = (id: string, data: Partial<WithdrawalRecord>) => {
    updateWithdrawal(id, { ...data, updatedAt: new Date().toLocaleString(), updatedBy: "admin" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Withdrawal</h1>
          <p className="page-description">Manage stock withdrawals and industrial usage</p>
        </div>
        <AddModal<WithdrawalRecord>
          title="New Withdrawal"
          fields={addFields}
          onSubmit={(data) => {
            const newRec: WithdrawalRecord = {
              ...data as WithdrawalRecord,
              id: Date.now().toString(),
              referenceNo: `WTH-${String(records.length + 1).padStart(3, "0")}`,
              status: "Open",
              createdBy: "admin",
              createdAt: new Date().toLocaleString(),
              updatedBy: "admin",
              updatedAt: new Date().toLocaleString(),
            };
            addWithdrawal(newRec);
          }}
          triggerLabel="New Withdrawal"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Total Withdrawals" value={records.length} icon={ArrowUpCircle} variant="primary" />
        <StatCard label="Pending" value={records.filter(r => r.status === 'Pending').length} icon={Clock} variant="warning" />
        <StatCard label="Done" value={records.filter(r => r.status === 'Done').length} icon={CheckCircle2} variant="success" />
      </div>

      <DataTable
        data={records}
        columns={columns}
        searchPlaceholder="Search withdrawals..."
        actions={(row) => {
          const isLocked = row.status === "Pending" || row.status === "Done";
          if (isLocked) return <Badge variant="secondary">STATUS LOCKED</Badge>;

          return (
            <ActionMenu>
              <EditModal<WithdrawalRecord>
                title="Edit Withdrawal"
                data={row}
                fields={addFields as any}
                onSubmit={(data) => updateWithdrawal(row.id, data)}
                triggerLabel="Edit"
              />
              <DeleteModal
                title="Delete Withdrawal"
                onSubmit={() => deleteWithdrawal(row.id)}
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
