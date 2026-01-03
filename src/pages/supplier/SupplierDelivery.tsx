/**
 * Supplier Delivery Page - CONDITIONALLY READ-ONLY
 * 
 * Spec:
 * ✅ Read-only when Pending / Done
 * ✅ Columns: Reference #, Transfer Date, Supplier Code, Packing #, Container No, Transfer Type (Local, International), Status (Open, Pending, Done), Warehouse, Created By, Created At, Updated By, Updated At
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
import { DeliveryRecord, useWms } from "@/context/WmsContext";
import { CheckCircle2, Clock, Truck } from "lucide-react";

export default function SupplierDelivery() {
  const { deliveries: records, addDelivery, updateDelivery, deleteDelivery } = useWms();

  const addFields: AddField<DeliveryRecord>[] = [
    { label: "Supplier Code", name: "supplierCode", type: "text", required: true },
    { label: "Packing #", name: "packingNo", type: "text", required: true },
    { label: "Container No", name: "containerNo", type: "text", required: true },
    { label: "Transfer Type", name: "transferType", type: "select", options: [{value: "Local", label: "Local"}, {value: "International", label: "International"}], required: true },
    { label: "Warehouse", name: "warehouse", type: "text", required: true },
    { label: "Transfer Date", name: "transferDate", type: "text", placeholder: "YYYY-MM-DD", required: true },
  ];

  const columns: ColumnDef<DeliveryRecord>[] = [
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
    { key: "transferDate", label: "Date" },
    { key: "supplierCode", label: "Supplier", className: "font-mono" },
    { key: "packingNo", label: "Packing #" },
    { key: "containerNo", label: "Container #" },
    { 
      key: "transferType", 
      label: "Type",
      render: (row) => <Badge variant={row.transferType === 'International' ? 'default' : 'secondary'}>{row.transferType}</Badge>
    },
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
    { key: "warehouse", label: "Warehouse" },
    { key: "updatedAt", label: "Updated At", className: "hidden xl:table-cell text-sm text-muted-foreground" }
  ];

  const handleUpdate = (id: string, data: Partial<DeliveryRecord>) => {
    updateDelivery(id, { ...data, updatedBy: "admin", updatedAt: new Date().toLocaleString() });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Supplier Delivery</h1>
          <p className="page-description">Manage incoming merchandise and container deliveries</p>
        </div>
        <AddModal<DeliveryRecord>
          title="New Delivery Record"
          fields={addFields}
          onSubmit={(data) => {
             const newRec: DeliveryRecord = {
               ...data as DeliveryRecord,
               id: Date.now().toString(),
               referenceNo: `DEL-${String(records.length + 1).padStart(3, "0")}`,
               status: "Open",
               createdBy: "admin",
               createdAt: new Date().toLocaleString(),
               updatedBy: "admin",
               updatedAt: new Date().toLocaleString(),
             };
             addDelivery(newRec);
          }}
          triggerLabel="New Delivery"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Total Deliveries" value={records.length} icon={Truck} variant="primary" />
        <StatCard label="Pending" value={records.filter(r => r.status === 'Pending').length} icon={Clock} variant="warning" />
        <StatCard label="Done" value={records.filter(r => r.status === 'Done').length} icon={CheckCircle2} variant="success" />
      </div>

      <DataTable
        data={records}
        columns={columns}
        searchPlaceholder="Search by reference, supplier, or container..."
        actions={(row) => {
          const isLocked = row.status === "Pending" || row.status === "Done";
          if (isLocked) return <Badge variant="secondary">LOCKED</Badge>;

          return (
            <ActionMenu>
              <EditModal<DeliveryRecord>
                title="Edit Delivery"
                data={row}
                fields={addFields as any}
                onSubmit={(data) => updateDelivery(row.id, data)}
                triggerLabel="Edit"
              />
              <DeleteModal
                title="Delete Delivery"
                onSubmit={() => deleteDelivery(row.id)}
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
