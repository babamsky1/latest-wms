import { StatCard } from "@/components/dashboard/StatCard";
import { DevBadge } from "@/components/dev/DevTools";
import AddModal, { AddField } from "@/components/modals/AddModal";
import DeleteModal from "@/components/modals/DeleteModal";
import EditModal, { EditField } from "@/components/modals/EditModal";
import { ActionMenu } from "@/components/table/ActionMenu";
import { ColumnDef, DataTable } from "@/components/table/DataTable";
import { Badge } from "@/components/ui/badge";
import { ItemMasterRecord, useWms } from "@/context/WmsContext";
import { Box, DollarSign, ListFilter, Tag } from "lucide-react";

export default function StockBuffering() {
  const { items, addItem, updateItem, deleteItem } = useWms();

  const fields: (AddField<ItemMasterRecord> | EditField<ItemMasterRecord>)[] = [
    // Basic
    { label: "PSC", name: "psc", type: "text", required: true },
    { label: "Short Description", name: "shortDescription", type: "text", required: true, fullWidth: true },
    { label: "Barcode", name: "barcode", type: "text", required: true },
    { label: "Picklist Code", name: "picklistCode", type: "text", required: true },
    // Types
    { label: "Product Type", name: "productType", type: "text", required: true },
    { label: "IG Description", name: "igDescription", type: "text", fullWidth: true },
    // Class
    { label: "Brand", name: "brand", type: "select", options: ["BW", "KLIK", "OMG", "ORO"].map(b => ({value: b, label: b})), required: true },
    { 
      label: "Category", 
      name: "category", 
      type: "select", 
      options: [
        { value: "Paint", label: "Paint" },
        { value: "Ink", label: "Ink" },
        { value: "Paper", label: "Paper" },
        { value: "Supplies", label: "Supplies" },
        { value: "Chemicals", label: "Chemicals" }
      ],
      required: true 
    },
    { label: "Color", name: "color", type: "text" },
    // Price
    { label: "Cost", name: "cost", type: "number", required: true },
    { label: "SRP", name: "srp", type: "number", required: true },
  ];

  const columns: ColumnDef<ItemMasterRecord>[] = [
    { key: "psc", label: "PSC", className: "font-mono font-bold text-primary" },
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
    { key: "brand", label: "Brand", render: (row) => <Badge variant="outline">{row.brand}</Badge> },
    { key: "category", label: "Category" },
    { key: "size", label: "Size" },
    { key: "color", label: "Color" },
    { 
      key: "srp", 
      label: "SRP", 
      className: "font-bold text-success",
      render: (row) => `₱${row.srp.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
    },
    { key: "barcode", label: "Barcode", className: "font-mono text-xs text-muted-foreground" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Stock Buffering</h1>
          <p className="page-description">Maintain core product definitions and master data</p>
        </div>
        <AddModal<ItemMasterRecord>
          title="New Item"
          fields={fields as any}
          onSubmit={(data) => {
            addItem({ ...data as ItemMasterRecord, id: Date.now().toString() });
          }}
          triggerLabel="Add New Item"
          size="2xl"
          columns={2}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard label="Total Items" value={items.length} icon={Box} variant="primary" />
        <StatCard label="Active Brands" value={new Set(items.map(i => i.brand)).size} icon={Tag} variant="info" />
        <StatCard label="Avg. Margin" value="45%" icon={DollarSign} variant="success" />
        <StatCard label="Categories" value={new Set(items.map(i => i.category)).size} icon={ListFilter} variant="default" />
      </div>

      <DataTable
        data={items}
        columns={columns}
        searchPlaceholder="Search by PSC, description, or barcode..."
        actions={(row) => (
          <ActionMenu>
            <EditModal<ItemMasterRecord>
              title="Edit Item Master"
              data={row}
              fields={fields as any}
              onSubmit={(data) => updateItem(row.id, data)}
              triggerLabel="Edit"
              size="2xl"
              columns={2}
            />
            <DeleteModal
              title="Delete Product"
              onSubmit={() => deleteItem(row.id)}
              triggerLabel="Delete"
            />
          </ActionMenu>
        )}
      />
    </div>
  );
}
