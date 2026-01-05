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
import { useAuth } from "@/hooks/useAuth";
import { useWms } from "@/hooks/useWms";
import { cn } from "@/lib/utils";
import { PurchaseOrderRecord } from "@/types";
import { CheckCircle2, Clock, ShoppingCart } from "lucide-react";

export default function PurchaseOrder() {
  const { purchaseOrders: records, addPO, updatePO, deletePO, suppliers, items, addPicker, addBarcoder, addTagger, addChecker, addDelivery, getCurrentUserName } = useWms();
  const { user } = useAuth();

  console.log('🏪 Purchase Order page loaded');
  console.log('📊 Current POs count:', records.length);
  console.log('👥 Available suppliers:', suppliers.length);
  console.log('📦 Available items:', items.length);
  console.log('👤 Current user:', getCurrentUserName());

  const addFields: AddField<PurchaseOrderRecord>[] = [
    { label: "Supplier", name: "supplierName", type: "select", options: suppliers.map(s => ({ value: s.supplierName, label: s.supplierName })), required: true },
    {
      label: "Item",
      name: "itemCode",
      type: "select",
      options: items.map(i => ({ value: i.psc, label: `${i.psc} - ${i.shortDescription}` })),
      required: true,
      onChange: (value, formData, setFormData) => {
        console.log('🔄 [CREATE FORM] Item selection changed to:', value);
        // When item changes, update unit price from item's SRP
        const selectedItem = items.find(item => item.psc === value);
        console.log('📦 [CREATE FORM] Selected item details:', selectedItem);

        if (selectedItem) {
          const unitPrice = selectedItem.srp;
          const quantity = Number(formData.quantity) || 0;
          const totalAmount = quantity * unitPrice;

          console.log('💰 [CREATE FORM] Auto-updating unit price:', unitPrice, 'and total:', totalAmount);

          setFormData({
            ...formData,
            unitPrice: unitPrice,
            totalAmount: totalAmount
          });
        } else {
          console.warn('⚠️ [CREATE FORM] No item found with PSC:', value);
        }
      }
    },
    {
      label: "Quantity",
      name: "quantity",
      type: "number",
      required: true,
      onChange: (value, formData, setFormData) => {
        console.log('🔢 Quantity changed to:', value);
        // When quantity changes, recalculate total amount
        const quantity = Number(value) || 0;
        const unitPrice = Number(formData.unitPrice) || 0;
        const totalAmount = quantity * unitPrice;

        console.log('🧮 Recalculating total:', quantity, '×', unitPrice, '=', totalAmount);

        setFormData({
          ...formData,
          totalAmount: totalAmount
        });
      }
    },
    { label: "Unit Price", name: "unitPrice", type: "number", required: true, disabled: true },
    { label: "Total Amount", name: "totalAmount", type: "number", required: true, disabled: true },
    { label: "Priority", name: "priority", type: "select", options: [{ value: "Low", label: "Low" }, { value: "Medium", label: "Medium" }, { value: "High", label: "High" }], required: true },
    { label: "Expected Delivery", name: "expectedDate", type: "date", required: true },
  ];

  const editFields: EditField<PurchaseOrderRecord>[] = [
    { label: "Supplier", name: "supplierName", type: "select", options: suppliers.map(s => ({ value: s.supplierName, label: s.supplierName })), required: true },
    {
      label: "Item",
      name: "itemCode",
      type: "select",
      options: items.map(i => ({ value: i.psc, label: `${i.psc} - ${i.shortDescription}` })),
      required: true,
      onChange: (value, formData, setFormData) => {
        console.log('🔄 [EDIT FORM] Item selection changed to:', value);
        // When item changes, update unit price from item's SRP
        const selectedItem = items.find(item => item.psc === value);
        console.log('📦 [EDIT FORM] Selected item details:', selectedItem);

        if (selectedItem) {
          const unitPrice = selectedItem.srp;
          const quantity = Number(formData.quantity) || 0;
          const totalAmount = quantity * unitPrice;

          console.log('💰 [EDIT FORM] Auto-updating unit price:', unitPrice, 'and total:', totalAmount);

          setFormData({
            ...formData,
            unitPrice: unitPrice,
            totalAmount: totalAmount
          });
        } else {
          console.warn('⚠️ [EDIT FORM] No item found with PSC:', value);
        }
      }
    },
    {
      label: "Quantity",
      name: "quantity",
      type: "number",
      required: true,
      onChange: (value, formData, setFormData) => {
        console.log('🔢 Quantity changed to:', value);
        // When quantity changes, recalculate total amount
        const quantity = Number(value) || 0;
        const unitPrice = Number(formData.unitPrice) || 0;
        const totalAmount = quantity * unitPrice;

        console.log('🧮 Recalculating total:', quantity, '×', unitPrice, '=', totalAmount);

        setFormData({
          ...formData,
          totalAmount: totalAmount
        });
      }
    },
    { label: "Unit Price", name: "unitPrice", type: "number", required: true, disabled: true },
    { label: "Total Amount", name: "totalAmount", type: "number", required: true, disabled: true },
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
    {
      key: "updatedBy",
      label: "Updated By",
      className: "text-sm",
      render: (row) => row.updatedBy || 'N/A'
    },
    {
      key: "updatedAt",
      label: "Updated At",
      className: "text-sm text-muted-foreground",
      render: (row) => {
        try {
          return new Date(row.updatedAt).toLocaleString();
        } catch {
          return row.updatedAt || 'N/A';
        }
      }
    },
    {
      key: "approvedBy",
      label: "Approved By",
      className: "text-sm",
      render: (row) => (
        <span className={row.approvedBy ? "text-green-600 font-medium" : "text-muted-foreground"}>
          {row.approvedBy || '-'}
        </span>
      )
    },
  ];

  const handleUpdate = (id: string, data: Partial<PurchaseOrderRecord>) => {
    updatePO(id, data);
  };

  const handleApprove = (id: string) => {
    console.log('🔄 Approving Purchase Order with ID:', id);

    const po = records.find(r => r.id === id);
    if (!po) {
      console.error('❌ Purchase Order not found with ID:', id);
      return;
    }

    console.log('📋 Found PO to approve:', po);

    // Update PO status to Approved (ready for delivery)
    const currentUser = getCurrentUserName();
    console.log('👤 Approving user:', currentUser);

    const updateData = {
      status: "Approved" as const,
      approvedBy: currentUser,
      approvedAt: new Date().toLocaleString(),
      updatedBy: currentUser,
      updatedAt: new Date().toLocaleString()
    };

    console.log('📝 Updating PO with data:', updateData);
    updatePO(id, updateData);

    // Automatically create a delivery record from the approved PO
    const supplier = suppliers.find(s => s.supplierName === po.supplierName);
    console.log('🏢 Found supplier:', supplier);

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
        createdBy: currentUser,
        createdAt: new Date().toLocaleString(),
        updatedBy: currentUser,
        updatedAt: new Date().toLocaleString(),
      };

      console.log('🚚 Creating delivery record:', deliveryRecord);
      addDelivery(deliveryRecord);
      console.log('✅ Delivery record created for approved PO');
    } else {
      console.warn('⚠️ No supplier found for PO, delivery record not created');
    }

    console.log('🎉 Purchase Order approved successfully!');
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
            console.log('🔄 Creating new Purchase Order...');
            console.log('📝 Form data received:', data);

            const orderDate = new Date().toISOString().split('T')[0];
            console.log('📅 Generated order date:', orderDate);

            const currentUser = getCurrentUserName();
            console.log('👤 Current user creating PO:', currentUser);

            const poNumber = `PO-${24000 + records.length + 1}`;
            console.log('🔢 Generated PO number:', poNumber);

            const newRec: PurchaseOrderRecord = {
              ...data as PurchaseOrderRecord,
              id: Date.now().toString(),
              poNumber: poNumber,
              orderDate: orderDate,
              status: "Draft",
              createdBy: currentUser,
              createdAt: new Date().toLocaleString(),
              updatedBy: currentUser,
              updatedAt: new Date().toLocaleString(),
            };

            console.log('✅ Final PO record to be created:', newRec);
            console.log('💾 Saving Purchase Order to database...');

            addPO(newRec);

            console.log('🎉 Purchase Order created successfully with ID:', newRec.id);
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
              onSubmit={(data) => {
                console.log('🔄 Updating Purchase Order:', row.id);
                console.log('📝 Update data:', data);
                updatePO(row.id, data);
                console.log('✅ Purchase Order updated successfully');
              }}
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
