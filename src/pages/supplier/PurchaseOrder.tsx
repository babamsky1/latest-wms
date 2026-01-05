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
import EditModal, { EditField } from "@/components/modals/EditModal";
import { ActionMenu } from "@/components/table/ActionMenu";
import { ColumnDef, DataTable } from "@/components/table/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useWms } from "@/hooks/useWms";
import { cn } from "@/lib/utils";
import { PurchaseOrderRecord } from "@/types";
import { AuditDisplay, getAuditInfo } from "@/lib/AuditDisplay";
import { CheckCircle2, Clock, ShoppingCart } from "lucide-react";

export default function PurchaseOrder() {
  const { purchaseOrders: records, addPO, updatePO, deletePO, suppliers, items, addPicker, addBarcoder, addTagger, addChecker, addDelivery } = useWms();

  const addFields: AddField<PurchaseOrderRecord>[] = [
    { label: "Supplier", name: "supplierName", type: "select", options: suppliers.map(s => ({ value: s.supplierName, label: s.supplierName })), required: true },
    { label: "Item", name: "itemCode", type: "select", options: items.map(i => ({ value: i.psc, label: `${i.psc} - ${i.shortDescription}` })), required: true },
    { label: "Quantity", name: "quantity", type: "number", required: true },
    { label: "Unit Price", name: "unitPrice", type: "number", required: true },
    { label: "Total Amount", name: "totalAmount", type: "number", required: true },
    { label: "Priority", name: "priority", type: "select", options: [{ value: "Low", label: "Low" }, { value: "Medium", label: "Medium" }, { value: "High", label: "High" }], required: true },
    { label: "Expected Delivery", name: "expectedDate", type: "date", required: true },
  ];

  const editFields: EditField<PurchaseOrderRecord>[] = [
    { label: "Supplier", name: "supplierName", type: "select", options: suppliers.map(s => ({ value: s.supplierName, label: s.supplierName })), required: true },
    { label: "Item", name: "itemCode", type: "select", options: items.map(i => ({ value: i.psc, label: `${i.psc} - ${i.shortDescription}` })), required: true },
    { label: "Quantity", name: "quantity", type: "number", required: true },
    { label: "Unit Price", name: "unitPrice", type: "number", required: true },
    { label: "Total Amount", name: "totalAmount", type: "number", required: true },
    { label: "Priority", name: "priority", type: "select", options: [{ value: "Low", label: "Low" }, { value: "Medium", label: "Medium" }, { value: "High", label: "High" }], required: true },
    { label: "Expected Delivery", name: "expectedDate", type: "date", required: true },
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
    { key: "supplierName", label: "Supplier" },
    { key: "itemCode", label: "Item", className: "font-mono" },
    { key: "quantity", label: "Qty", className: "font-bold text-right" },
    { key: "orderDate", label: "Order Date" },
    { key: "expectedDate", label: "Expected Date" },
    {
      key: "auditInfo",
      label: "Audit Info",
      render: (row) => (
        <AuditDisplay audit={getAuditInfo(row)} compact={true} />
      )
    },
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
      className: "text-center",
      render: (row) => {
        const variants: Record<string, "default" | "secondary" | "destructive" | "outline" | "success" | "warning"> = {
          "Draft": "secondary",
          "Pending": "warning",
          "Approved": "success",
          "Received": "default"
        };
        return <Badge variant={variants[row.status] || "secondary"}>{row.status}</Badge>;
      }
    },
    { key: "updatedAt", label: "Updated At", className: "hidden xl:table-cell text-sm text-muted-foreground" }
  ];

  const handleUpdate = (id: string, data: Partial<PurchaseOrderRecord>) => {
    updatePO(id, data);
  };

  const handleApprove = (id: string) => {
    const po = records.find(r => r.id === id);
    if (!po) return;

    // Update PO status to Approved (ready for delivery)
    updatePO(id, {
      status: "Approved",
      approvedAt: new Date().toLocaleString(),
      updatedBy: "admin",
      updatedAt: new Date().toLocaleString()
    });

    // Automatically create a delivery record from the approved PO
    const supplier = suppliers.find(s => s.supplierName === po.supplierName);
    if (supplier) {
      const deliveryRecord = {
        id: Date.now().toString(),
        referenceNo: `DEL-${String(Math.floor(Math.random() * 10000)).padStart(4, "0")}`,
        poNumber: po.poNumber, // Link to original PO
        transferDate: po.expectedDate,
        supplierCode: supplier.supplierCode,
        itemCode: po.itemCode,
        quantity: po.quantity,
        packingNo: `PK-${String(Math.floor(Math.random() * 10000)).padStart(4, "0")}`,
        containerNo: `CONT-${String(Math.floor(Math.random() * 10000)).padStart(4, "0")}`,
        transferType: "Local" as const,
        status: "Open" as const,
        warehouse: "Main Warehouse",
        createdBy: "admin",
        createdAt: new Date().toLocaleString(),
        updatedBy: "admin",
        updatedAt: new Date().toLocaleString(),
      };
      addDelivery(deliveryRecord);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Purchase Orders</h1>
          <p className="page-description">Create and approve purchase requests to suppliers (assignments created after delivery receipt)</p>
        </div>
        <AddModal<PurchaseOrderRecord>
          title="Create New Purchase Order"
          fields={addFields}
          onSubmit={(data) => {
            const orderDate = new Date().toISOString().split('T')[0];
            const newRec: PurchaseOrderRecord = {
              ...data as PurchaseOrderRecord,
              id: Date.now().toString(),
              poNumber: `PO-${24000 + records.length + 1}`,
              orderDate: orderDate,
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
        actions={(row) => (
          <ActionMenu closeOnAction={["Approve PO"]}>
            {row.status === "Draft" && (
              <Button
                size="sm"
                variant="outline"
                className="text-warning border-warning hover:bg-warning/10 w-full"
                onClick={() => handleUpdate(row.id, { status: "Pending" })}
              >
                Submit for Approval
              </Button>
            )}
            {row.status === "Pending" && (
              <Button
                size="sm"
                variant="default"
                className="bg-success hover:bg-success/90 text-success-foreground w-full"
                onClick={() => handleApprove(row.id)}
              >
                Approve PO
              </Button>
            )}
            <EditModal<PurchaseOrderRecord>
              title="Edit Purchase Order"
              data={row}
              fields={editFields}
              onSubmit={(data) => updatePO(row.id, data)}
              triggerLabel="Edit"
            />
            <DeleteModal
              title="Delete Purchase Order"
              onSubmit={() => deletePO(row.id)}
              triggerLabel="Delete"
            />
          </ActionMenu>
        )}
      />
    </div>
  );
}
