/**
 * Supplier Delivery Page - FULLY EDITABLE WITH WORKFLOW
 *
 * Spec:
 * ✅ Status Workflow: Open → Pending → Received
 * ✅ Creates assignments when delivery is marked as "Received"
 * ✅ Columns: Reference #, Date, Supplier, Item, Qty, Packing #, Container #, Type, Status, Warehouse, Updated At
 * ✅ Connected to: Items, Suppliers, Warehouses, Assignments (Picker/Barcoder/Tagger/Checker)
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
import { DeliveryRecord } from "@/types";
import { CheckCircle2, Clock, Truck } from "lucide-react";

export default function SupplierDelivery() {
  const { deliveries: records, addDelivery, updateDelivery, deleteDelivery, warehouses, suppliers, items, addPicker, addBarcoder, addTagger, addChecker, addTransferAssignment } = useWms();

  // Show all deliveries
  const filteredRecords = records;

  // Fields for creating new deliveries
  const addFields: AddField<DeliveryRecord>[] = [
    { label: "PO Number", name: "poNumber", type: "text", placeholder: "PO-XXXXX", required: false },
    { label: "Transfer Date", name: "transferDate", type: "date", required: true },
    { label: "Supplier", name: "supplierCode", type: "select", options: suppliers.map(s => ({ value: s.supplierCode, label: `${s.supplierCode} - ${s.supplierName}` })), required: true },
    { label: "Item", name: "itemCode", type: "select", options: items.map(i => ({ value: i.psc, label: `${i.psc} - ${i.shortDescription}` })), required: true },
    { label: "Quantity", name: "quantity", type: "number", required: true },
    { label: "Packing #", name: "packingNo", type: "text", required: true },
    { label: "Container No", name: "containerNo", type: "text", required: true },
    { label: "Transfer Type", name: "transferType", type: "select", options: [{ value: "Local", label: "Local" }, { value: "International", label: "International" }], required: true },
    { label: "Warehouse", name: "warehouse", type: "select", options: warehouses.map(w => ({ value: w.name, label: w.name })), required: true },
  ];

  // Fields for editing existing deliveries (only packing/container info)
  const editFields: EditField<DeliveryRecord>[] = [
    { label: "Packing #", name: "packingNo", type: "text", required: true },
    { label: "Container No", name: "containerNo", type: "text", required: true },
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
    {
      key: "poNumber",
      label: "PO #",
      className: "font-mono",
      render: (row) => row.poNumber || "N/A"
    },
    { key: "transferDate", label: "Date" },
    { key: "supplierCode", label: "Supplier", className: "font-mono" },
    { key: "itemCode", label: "Item", className: "font-mono" },
    { key: "quantity", label: "Qty", className: "font-bold text-right" },
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
      className: "text-center",
      render: (row) => {
        const variants: Record<string, "default" | "secondary" | "destructive" | "outline" | "success" | "warning"> = {
          "Open": "secondary",
          "Done": "warning",
          "Received": "success"
        };
        const displayText = row.status === "Done" ? "Pending" : row.status;
        return <Badge variant={variants[row.status] || "secondary"}>{displayText}</Badge>;
      }
    },
    { key: "warehouse", label: "Warehouse" },
    {
      key: "approvedAt",
      label: "Approved",
      className: "text-sm text-muted-foreground",
      render: (row) => row.status === "Received" ? row.approvedAt || "N/A" : "Pending"
    },
    { key: "updatedAt", label: "Updated At", className: "hidden xl:table-cell text-sm text-muted-foreground" }
  ];

  const handleUpdate = (id: string, data: Partial<DeliveryRecord>) => {
    updateDelivery(id, { ...data, updatedBy: "admin", updatedAt: new Date().toLocaleString() });
  };


  const handleReceive = (id: string) => {
    const delivery = records.find(r => r.id === id);
    if (!delivery) {
      console.error("Delivery not found:", id);
      return;
    }

    // Update delivery status to Received
    updateDelivery(id, {
      status: "Received",
      updatedBy: "admin",
      updatedAt: new Date().toLocaleString()
    });

    // Validate required data before creating assignments
    const item = items.find(i => i.psc === delivery.itemCode);
    const supplier = suppliers.find(s => s.supplierCode === delivery.supplierCode);

    if (!item) {
      console.error("Item not found for delivery:", delivery.itemCode);
      return;
    }

    if (!supplier) {
      console.error("Supplier not found for delivery:", delivery.supplierCode);
      return;
    }

    // Create ONLY Picker Assignment initially (sequential workflow)
    addPicker({
      id: `P-${Date.now()}`,
      seriesNo: `P-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
      poNo: delivery.poNumber || delivery.referenceNo,
      deliveryReference: delivery.referenceNo,
      poBrand: item.brand,
      customerName: supplier.supplierName,
      routeCode: "RT-01",
      dateApproved: new Date().toISOString().split('T')[0],
      approvedTime: new Date().toTimeString().split(' ')[0],
      deliverySchedule: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
      priorityLevel: "Medium",
      transferType: delivery.transferType,
      receivedBy: "Warehouse Staff",
      status: "No Assignment",
      totalQty: delivery.quantity,
      countedQty: 0,
      whReceiveDate: new Date().toISOString().split('T')[0],
      approvedBy: "Admin",
      plRemarks: `Delivery ${delivery.referenceNo} - ${item.shortDescription}`,
      stockSource: "Supplier Delivery",
      sourceReference: delivery.referenceNo,
      assignedStaff: undefined,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Supplier Delivery</h1>
          <p className="page-description">Manage deliveries from approved purchase orders - submit for receiving, add packing details, mark as pending, then mark as received to create assignments</p>
        </div>
        <AddModal<DeliveryRecord>
          title="Create New Delivery"
          fields={addFields}
          onSubmit={(data) => {
            const newDelivery: DeliveryRecord = {
              ...data as DeliveryRecord,
              id: Date.now().toString(),
              referenceNo: `DEL-${String(Math.floor(Math.random() * 10000)).padStart(4, "0")}`,
              status: "Open",
              createdBy: "admin",
              createdAt: new Date().toLocaleString(),
              updatedBy: "admin",
              updatedAt: new Date().toLocaleString(),
            };
            addDelivery(newDelivery);
          }}
          triggerLabel="New Delivery"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard label="Total Deliveries" value={filteredRecords.length} icon={Truck} variant="primary" />
        <StatCard label="Open" value={filteredRecords.filter(r => r.status === 'Open').length} icon={Clock} variant="default" />
        <StatCard label="Pending" value={filteredRecords.filter(r => r.status === 'Done').length} icon={Clock} variant="info" />
        <StatCard label="Received" value={filteredRecords.filter(r => r.status === 'Received').length} icon={CheckCircle2} variant="success" />
      </div>

      <DataTable
        data={filteredRecords}
        columns={columns}
        searchPlaceholder="Search by reference, supplier, or container..."
        actions={(row) => (
          <ActionMenu closeOnAction={["Approve", "Mark as Received"]}>
            {row.status === "Open" && (
              <Button size="sm" variant="outline" onClick={() => handleUpdate(row.id, { status: "Done" })}>
                Submit for Receiving
              </Button>
            )}
            {row.status === "Done" && (
              <Button size="sm" variant="default" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => handleReceive(row.id)}>
                Mark as Received
              </Button>
            )}
            <EditModal<DeliveryRecord>
              title="Edit Packing Details"
              data={row}
              fields={editFields}
              onSubmit={(data) => updateDelivery(row.id, data)}
              triggerLabel="Edit"
            />
            <DeleteModal
              title="Delete Delivery"
              onSubmit={() => deleteDelivery(row.id)}
              triggerLabel="Delete"
            />
          </ActionMenu>
        )}
      />
    </div>
  );
}
