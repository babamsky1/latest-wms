/**
 * Stock Location Inquiry Page - READ-ONLY
 * 
 * Spec:
 * ✅ READ-ONLY
 * ✅ TWO SCREENS: Warehouse Location List -> Product Stocks per Location
 */

import { StatCard } from "@/components/dashboard/StatCard";
import AddModal from "@/components/modals/AddModal";
import DeleteModal from "@/components/modals/DeleteModal";
import EditModal, { EditField } from "@/components/modals/EditModal";
import { ActionMenu } from "@/components/table/ActionMenu";
import { ColumnDef, DataTable } from "@/components/table/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useWms } from "@/hooks/useWms";
import { ItemMasterRecord, WarehouseMasterRecord } from "@/types";
import { ChevronLeft, MapPin, Package, Warehouse } from "lucide-react";
import { useState } from "react";

export default function StockLocationInquiry() {
  const { warehouses, items, addWarehouse, updateWarehouse, deleteWarehouse } = useWms();
  const [selectedWarehouse, setSelectedWarehouse] = useState<WarehouseMasterRecord | null>(null);

  const warehouseFields: EditField<WarehouseMasterRecord>[] = [
    { label: "Code", name: "code", type: "text", required: true },
    { label: "Name", name: "name", type: "text", required: true },
    { label: "Type", name: "type", type: "select", options: [{ value: "Main", label: "Main" }, { value: "Branch", label: "Branch" }, { value: "Production", label: "Production" }, { value: "Third Party", label: "Third Party" }], required: true },
    { label: "Location", name: "location", type: "text", required: true },
    { label: "Capacity", name: "capacity", type: "number", required: false },
    { label: "Status", name: "status", type: "select", options: [{ value: "Active", label: "Active" }, { value: "Inactive", label: "Inactive" }], required: true },
  ];

  // Warehouse Columns
  const warehouseColumns: ColumnDef<WarehouseMasterRecord>[] = [
    {
      key: "code",
      label: "Code",
      className: "font-mono font-bold text-primary",
    },
    {
      key: "name",
      label: "Warehouse Name",
      className: "font-semibold",
    },
    {
      key: "type",
      label: "Type",
      render: (row) => <Badge variant={row.type === 'Main' ? 'default' : 'secondary'}>{row.type}</Badge>
    },
    {
      key: "location",
      label: "Location",
    },
    {
      key: "capacity",
      label: "Capacity",
      render: (row) => row.capacity ? row.capacity.toLocaleString() : "N/A"
    },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <Badge variant={row.status === 'Active' ? 'success' : 'secondary'}>{row.status}</Badge>
      )
    }
  ];

  // Items by Warehouse Columns
  const itemColumns: ColumnDef<ItemMasterRecord>[] = [
    { key: "psc", label: "PSC", className: "font-mono font-bold" },
    { key: "shortDescription", label: "Description", className: "font-medium" },
    { key: "brand", label: "Brand" },
    { key: "category", label: "Category" },
    { key: "group", label: "Group" },
    {
      key: "cost",
      label: "Cost",
      className: "font-bold",
      render: (row) => `₱${row.cost.toLocaleString()}`
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Stock Location Inquiry</h1>
          <p className="page-description">
            {selectedWarehouse
              ? `Items in Warehouse: ${selectedWarehouse.name} (${selectedWarehouse.location})`
              : "Manage warehouse locations and view items by warehouse"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {!selectedWarehouse && (
            <AddModal<WarehouseMasterRecord>
              title="Add New Warehouse"
              fields={warehouseFields}
              onSubmit={(data) => {
                addWarehouse({
                  ...data as WarehouseMasterRecord,
                  id: Date.now().toString(),
                });
              }}
              triggerLabel="New Warehouse"
            />
          )}
          {selectedWarehouse && (
            <Button variant="outline" onClick={() => setSelectedWarehouse(null)}>
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Warehouses
            </Button>
          )}
        </div>
      </div>

      {!selectedWarehouse ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatCard
              label="Total Warehouses"
              value={warehouses.length}
              icon={Warehouse}
              variant="primary"
            />
            <StatCard
              label="Active Warehouses"
              value={warehouses.filter(w => w.status === 'Active').length}
              icon={Warehouse}
              variant="success"
            />
            <StatCard
              label="Total Items"
              value={items.length}
              icon={Package}
              variant="info"
            />
            <StatCard
              label="Warehouse Types"
              value={new Set(warehouses.map(w => w.type)).size}
              icon={MapPin}
              variant="default"
            />
          </div>

          <DataTable
            data={warehouses}
            columns={warehouseColumns}
            searchPlaceholder="Search by warehouse name, code, or location..."
            actions={(row) => (
              <div className="flex items-center gap-2">
                <Button size="sm" variant="ghost" className="text-primary font-medium" onClick={() => setSelectedWarehouse(row)}>
                  View Items
                </Button>
                <ActionMenu>
                  <EditModal<WarehouseMasterRecord>
                    title="Edit Warehouse"
                    data={row}
                    fields={warehouseFields}
                    onSubmit={(data) => updateWarehouse(row.id, data)}
                    triggerLabel="Edit"
                  />
                  <DeleteModal
                    title="Delete Warehouse"
                    onSubmit={() => deleteWarehouse(row.id)}
                    triggerLabel="Delete"
                  />
                </ActionMenu>
              </div>
            )}
          />
        </>
      ) : (
        <DataTable
          data={items}
          columns={itemColumns}
          searchPlaceholder="Search items in this warehouse..."
          emptyMessage="No items currently assigned to this warehouse."
        />
      )}
    </div>
  );
}
