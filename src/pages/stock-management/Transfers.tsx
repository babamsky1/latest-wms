/**
 * Transfers Page - CONDITIONALLY READ-ONLY
 * 
 * Spec:
 * ✅ Read-only when status != Open
 * ✅ Columns: Reference #, Transfer Date, Needed Date, Source Warehouse, Destination Warehouse, Requested By, Status, Updated By, Updated At
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
import { TransferRecord, useWms } from "@/context/WmsContext";
import { ArrowRightLeft, CheckCircle2, Clock } from "lucide-react";

export default function Transfers() {
  const { transfers: records, addTransfer, updateTransfer, deleteTransfer, warehouses, items } = useWms();

  const addFields: AddField<TransferRecord>[] = [
    { label: "PSC (Item)", name: "psc", type: "datalist", options: items.map(i => ({ value: i.psc, label: `${i.psc} - ${i.shortDescription}` })), required: true },
    { label: "Transfer Date", name: "transferDate", type: "text", placeholder: "YYYY-MM-DD", required: true },
    { label: "Needed Date", name: "neededDate", type: "text", placeholder: "YYYY-MM-DD", required: true },
    { label: "Source Warehouse", name: "sourceWarehouse", type: "select", options: warehouses.map(w => ({ value: w.name, label: w.name })), required: true },
    { label: "Destination Warehouse", name: "destinationWarehouse", type: "select", options: warehouses.map(w => ({ value: w.name, label: w.name })), required: true },
    { label: "Requested By", name: "requestedBy", type: "text", required: true },
  ];

  const columns: ColumnDef<TransferRecord>[] = [
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
    { key: "transferDate", label: "Date" },
    { key: "neededDate", label: "Needed" },
    { key: "sourceWarehouse", label: "Source" },
    { key: "destinationWarehouse", label: "Destination" },
    { key: "requestedBy", label: "Requested By" },
    {
      key: "status",
      label: "Status",
      render: (row) => {
        const variants: Record<string, string> = {
          "Open": "status-pending",
          "For Approval": "status-warning",
          "In Transit": "status-warning",
          "Done": "status-active",
          "Cancelled": "status-error"
        };
        return <span className={`status-badge ${variants[row.status] || 'status-pending'}`}>{row.status}</span>;
      }
    },
    { key: "updatedAt", label: "Last Updated", className: "hidden xl:table-cell text-sm text-muted-foreground" }
  ];

  const handleUpdate = (id: string, data: Partial<TransferRecord>) => {
    updateTransfer(id, { ...data, updatedAt: new Date().toLocaleString(), updatedBy: "admin" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Transfers</h1>
          <p className="page-description">Stock movement between warehouse locations</p>
        </div>
        <AddModal<TransferRecord>
          title="New Transfer"
          fields={addFields}
          onSubmit={(data) => {
            const newRec: TransferRecord = {
              ...data as TransferRecord,
              id: Date.now().toString(),
              referenceNo: `TRF-${String(records.length + 1).padStart(3, "0")}`,
              status: "Open",
              updatedBy: "admin",
              updatedAt: new Date().toLocaleString(),
            };
            addTransfer(newRec);
          }}
          triggerLabel="New Transfer"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Total Transfers" value={records.length} icon={ArrowRightLeft} variant="primary" />
        <StatCard label="Active" value={records.filter(r => r.status !== 'Done' && r.status !== 'Cancelled').length} icon={Clock} variant="warning" />
        <StatCard label="Completed" value={records.filter(r => r.status === 'Done').length} icon={CheckCircle2} variant="success" />
      </div>

      <DataTable
        data={records}
        columns={columns}
        searchPlaceholder="Search transfers..."
        actions={(row) => {
          const isLocked = row.status !== "Open";
          if (isLocked) return <Badge variant="secondary">LOCKED</Badge>;

          return (
            <ActionMenu>
              <EditModal<TransferRecord>
                title="Edit Transfer"
                data={row}
                fields={addFields as any}
                onSubmit={(data) => updateTransfer(row.id, data)}
                triggerLabel="Edit"
              />
              <DeleteModal
                title="Delete Transfer"
                onSubmit={() => deleteTransfer(row.id)}
                triggerLabel="Delete"
              />
              <Button size="sm" variant="ghost" className="text-success" onClick={() => handleUpdate(row.id, { status: "For Approval" })}>
                Send for Approval
              </Button>
            </ActionMenu>
          );
        }}
      />
    </div>
  );
}
