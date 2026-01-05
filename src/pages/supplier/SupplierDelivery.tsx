/**
 * Supplier Delivery Page - FULLY EDITABLE WITH WORKFLOW
 *
 * Spec:
 * ✅ Status Workflow: Open → Pending → Done → Received
 * ✅ Creates assignments when delivery is marked as "Done" (received)
 * ✅ Columns: Reference #, Date, Supplier, Item, Qty, Packing #, Container #, Type, Status, Warehouse, Updated At
 * ✅ Connected to: Items, Suppliers, Warehouses, Assignments (Picker/Barcoder/Tagger/Checker)
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
  const { deliveries: records, updateDelivery, deleteDelivery, warehouses, suppliers, items, addPicker, addBarcoder, addTagger, addChecker } = useWms();

  // Only show deliveries that are "For Approval" or later stages
  const filteredRecords = records.filter(r => r.status !== "Open");

  // Fields for editing existing deliveries (only packing/container info)
  const editFields: AddField<DeliveryRecord>[] = [
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
      render: (row) => {
        const variants: Record<string, string> = {
          "For Approval": "status-warning",
          "Pending": "status-warning",
          "Done": "status-active",
          "Received": "status-success"
        };
        return <span className={`status-badge ${variants[row.status]}`}>{row.status}</span>;
      }
    },
    { key: "warehouse", label: "Warehouse" },
    {
      key: "approvedAt",
      label: "Approved",
      className: "text-sm text-muted-foreground",
      render: (row) => row.status === "Done" || row.status === "Received" ? row.approvedAt || "N/A" : "Pending"
    },
    { key: "updatedAt", label: "Updated At", className: "hidden xl:table-cell text-sm text-muted-foreground" }
  ];

  const handleUpdate = (id: string, data: Partial<DeliveryRecord>) => {
    updateDelivery(id, { ...data, updatedBy: "admin", updatedAt: new Date().toLocaleString() });
  };

  const handleApprove = (id: string) => {
    const delivery = records.find(r => r.id === id);
    if (!delivery) {
      console.error("Delivery not found:", id);
      return;
    }

    // Update delivery status to Done (approved)
    updateDelivery(id, {
      status: "Done",
      approvedAt: new Date().toLocaleString(),
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

    // Create Picker Assignment
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

    // Create Barcoder Assignment
    addBarcoder({
      id: `B-${Date.now()}`,
      seriesNo: `B-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
      poNo: delivery.poNumber || delivery.referenceNo,
      deliveryReference: delivery.referenceNo,
      poBrand: item.brand,
      customerName: supplier.supplierName,
      routeCode: "RT-01",
      barcoderName: "Barcode Scanner",
      deliverySchedule: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      dateApproved: new Date().toISOString().split('T')[0],
      approvedTime: new Date().toTimeString().split(' ')[0],
      priorityLevel: "Medium",
      transferType: delivery.transferType,
      approvedBy: "Admin",
      receivedBy: "Warehouse Staff",
      status: "Pending",
      assignedStaff: undefined,
      stockSource: "Supplier Delivery",
      sourceReference: delivery.referenceNo,
      totalQty: delivery.quantity,
      countedQty: 0,
    });

    // Create Tagger Assignment
    addTagger({
      id: `T-${Date.now()}`,
      seriesNo: `T-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
      poNo: delivery.poNumber || delivery.referenceNo,
      deliveryReference: delivery.referenceNo,
      poBrand: item.brand,
      customerName: supplier.supplierName,
      routeCode: "RT-01",
      priorityLevel: "Medium",
      deliverySchedule: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      dateApproved: new Date().toISOString().split('T')[0],
      status: "Pending",
      approvedBy: "Admin",
      assignedStaff: undefined,
      stockSource: "Supplier Delivery",
      sourceReference: delivery.referenceNo,
      totalQty: delivery.quantity,
      countedQty: 0,
    });

    // Create Checker Assignment
    addChecker({
      id: `C-${Date.now()}`,
      seriesNo: `CHK-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
      poNo: delivery.poNumber || delivery.referenceNo,
      deliveryReference: delivery.referenceNo,
      customerName: supplier.supplierName,
      status: "Pending",
      assignedStaff: undefined,
      stockSource: "Supplier Delivery",
      sourceReference: delivery.referenceNo,
      totalQty: delivery.quantity,
      countedQty: 0,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Supplier Delivery</h1>
          <p className="page-description">Manage deliveries from approved purchase orders - add packing/container details and approve for assignment creation</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Total Deliveries" value={filteredRecords.length} icon={Truck} variant="primary" />
        <StatCard label="For Approval" value={filteredRecords.filter(r => r.status === 'For Approval').length} icon={Clock} variant="warning" />
        <StatCard label="Approved" value={filteredRecords.filter(r => r.status === 'Done').length} icon={CheckCircle2} variant="success" />
      </div>

      <DataTable
        data={filteredRecords}
        columns={columns}
        searchPlaceholder="Search by reference, supplier, or container..."
        actions={(row) => (
          <ActionMenu>
            <EditModal<DeliveryRecord>
              title="Edit Packing Details"
              data={row}
              fields={editFields as any}
              onSubmit={(data) => updateDelivery(row.id, data)}
              triggerLabel="Edit Details"
            />
            <DeleteModal
              title="Delete Delivery"
              onSubmit={() => deleteDelivery(row.id)}
              triggerLabel="Delete"
            />
            {row.status === "Pending" && (
              <Button size="sm" variant="ghost" className="text-success" onClick={() => handleApprove(row.id)}>
                Approve & Create Assignments
              </Button>
            )}
            {row.status === "Done" && (
              <Button size="sm" variant="ghost" className="text-primary" onClick={() => handleUpdate(row.id, { status: "Received" })}>
                Mark as Received
              </Button>
            )}
          </ActionMenu>
        )}
      />
    </div>
  );
}
