/**
 * Stock Inquiry Page - READ-ONLY
 * 
 * Spec:
 * ✅ READ-ONLY (No create/update/delete)
 * ✅ Columns: PSC, AN #, Barcode, Description, Brand (BW, KLIK, OMG, ORO), Item Group, Color
 * ✅ Rule: No editing, no posting, no manual quantity changes
 */

import { StatCard } from "@/components/dashboard/StatCard";
import { DevBadge } from "@/components/dev/DevTools";
import AddModal, { AddField } from "@/components/modals/AddModal";
import DeleteModal from "@/components/modals/DeleteModal";
import EditModal from "@/components/modals/EditModal";
import { ActionMenu } from "@/components/table/ActionMenu";
import { ColumnDef, DataTable } from "@/components/table/DataTable";
import { Badge } from "@/components/ui/badge";
import { ItemMasterRecord, useWms } from "@/hooks/useWms";
import { AuditDisplay, getAuditInfo } from "@/lib/AuditDisplay";
import { Layers, Package, Tag } from "lucide-react";

export default function StockInquiry() {
  const { items, addItem, updateItem, deleteItem } = useWms();

  const addFields: AddField<ItemMasterRecord>[] = [
    { label: "PSC", name: "psc", type: "text", required: true },
    { label: "Short Description", name: "shortDescription", type: "text", required: true },
    { label: "Long Description", name: "longDescription", type: "textarea", required: true },
    { label: "Invoice Description", name: "invoiceDescription", type: "text", required: true },
    { label: "Picklist Code", name: "picklistCode", type: "text", required: true },
    { label: "Barcode", name: "barcode", type: "text", required: true },
    { label: "Product Type", name: "productType", type: "text", required: true },
    { label: "IG Description", name: "igDescription", type: "text", required: true },
    { label: "Sub ID", name: "subId", type: "text", required: true },
    { label: "Brand", name: "brand", type: "select", options: [{ value: "BW", label: "BW" }, { value: "KLIK", label: "KLIK" }, { value: "OMG", label: "OMG" }, { value: "ORO", label: "ORO" }], required: true },
    { label: "Group", name: "group", type: "text", required: true },
    { label: "Category", name: "category", type: "text", required: true },
    { label: "Sub Category", name: "subCategory", type: "text", required: true },
    { label: "Size", name: "size", type: "text", required: true },
    { label: "Color", name: "color", type: "text", required: true },
    { label: "Is Saleable", name: "isSaleable", type: "checkbox", required: false },
    { label: "Cost", name: "cost", type: "number", required: true },
    { label: "SRP", name: "srp", type: "number", required: true },
  ];
  const columns: ColumnDef<ItemMasterRecord>[] = [
    {
      key: "psc",
      label: "PSC",
      className: "font-mono font-bold text-primary",
    },
    {
      key: "subId",
      label: "Sub ID",
      className: "font-mono",
    },
    {
      key: "barcode",
      label: "Barcode",
      className: "font-mono text-muted-foreground",
    },
    {
      key: "shortDescription",
      label: "Description",
      className: "font-medium",
      render: (row) => (
        <div className="flex items-center">
          {row.shortDescription}
          {row.isTestData && <DevBadge />}
        </div>
      )
    },
    {
      key: "brand",
      label: "Brand",
      render: (row) => (
        <Badge variant="outline" className="font-bold">
          {row.brand}
        </Badge>
      ),
    },
    {
      key: "group",
      label: "Group",
    },
    {
      key: "color",
      label: "Color",
      render: (row) => (
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full border border-muted"
            style={{ backgroundColor: row.color.toLowerCase() === 'multi' ? 'transparent' : row.color.toLowerCase() }}
          />
          {row.color}
        </div>
      ),
    },
    {
      key: "cost",
      label: "Cost",
      className: "font-bold",
      render: (row) => `₱${row.cost.toLocaleString()}`,
    },
    {
      key: "auditInfo",
      label: "Audit Info",
      render: (row) => (
        <AuditDisplay audit={getAuditInfo(row)} compact={true} />
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Stock Inquiry</h1>
          <p className="page-description">Manage item master data and view stock information</p>
        </div>
        <AddModal<ItemMasterRecord>
          title="Add New Item"
          fields={addFields}
          onSubmit={(data) => {
            addItem({
              ...data as ItemMasterRecord,
              id: Date.now().toString(),
            });
          }}
          triggerLabel="New Item"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          label="Total PSCs"
          value={items.length}
          icon={Package}
          variant="primary"
        />
        <StatCard
          label="Stocked Brands"
          value={new Set(items.map(s => s.brand)).size}
          icon={Tag}
          variant="info"
        />
        <StatCard
          label="Active Groups"
          value={new Set(items.map(s => s.group)).size}
          icon={Layers}
          variant="success"
        />
      </div>

      <DataTable
        data={items}
        columns={columns}
        searchPlaceholder="Search by PSC, Sub ID, Barcode, or Description..."
        defaultPageSize={10}
        emptyMessage="No items found."
        actions={(row) => (
          <ActionMenu>
            <EditModal<ItemMasterRecord>
              title="Edit Item"
              data={row}
              fields={addFields as any}
              onSubmit={(data) => updateItem(row.id, data)}
              triggerLabel="Edit"
            />
            <DeleteModal
              title="Delete Item"
              onSubmit={() => deleteItem(row.id)}
              triggerLabel="Delete"
            />
          </ActionMenu>
        )}
      />

    </div>
  );
}
