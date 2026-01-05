/**
 * Supplier Profile Page - FULLY EDITABLE
 * 
 * Spec:
 * ✅ Fully Editable Master Data
 * ✅ Columns: Supplier Code, Supplier Name, Company Name, Supplier Type, Company, Status
 */

import { StatCard } from "@/components/dashboard/StatCard";
import { DevBadge } from "@/components/dev/DevTools";
import AddModal, { AddField } from "@/components/modals/AddModal";
import DeleteModal from "@/components/modals/DeleteModal";
import EditModal, { EditField } from "@/components/modals/EditModal";
import { ActionMenu } from "@/components/table/ActionMenu";
import { ColumnDef, DataTable } from "@/components/table/DataTable";
import { Badge } from "@/components/ui/badge";
import { SupplierRecord, useWms } from "@/hooks/useWms";
import { Globe, ShieldCheck, Truck } from "lucide-react";

export default function SupplierProfile() {
  const { suppliers: records, addSupplier, updateSupplier, deleteSupplier } = useWms();

  const fields: (AddField<SupplierRecord> | EditField<SupplierRecord>)[] = [
    { label: "Supplier Code", name: "supplierCode", type: "text", required: true },
    { label: "Supplier Name", name: "supplierName", type: "text", required: true },
    { label: "Company Name", name: "companyName", type: "text", required: true },
    { label: "Supplier Type", name: "supplierType", type: "select", options: [{value: "Local", label: "Local"}, {value: "International", label: "International"}], required: true },
    { label: "Company", name: "company", type: "text", required: true },
    { label: "Status", name: "status", type: "select", options: [{value: "Active", label: "Active"}, {value: "Inactive", label: "Inactive"}], required: true },
  ];

  const columns: ColumnDef<SupplierRecord>[] = [
    { 
      key: "supplierCode", 
      label: "Code", 
      className: "font-mono font-bold text-primary",
      render: (row) => (
        <div className="flex items-center">
          {row.supplierCode}
          {row.isTestData && <DevBadge />}
        </div>
      )
    },
    { key: "supplierName", label: "Supplier Name", className: "font-medium" },
    { key: "companyName", label: "Company Name" },
    { 
      key: "supplierType", 
      label: "Type",
      render: (row) => <Badge variant={row.supplierType === 'International' ? 'default' : 'secondary'}>{row.supplierType}</Badge>
    },
    { key: "company", label: "Division/Company" },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <Badge variant={row.status === 'Active' ? 'success' : 'secondary'}>{row.status}</Badge>
      )
    },
  ];

  const handleUpdate = (id: string, data: Partial<SupplierRecord>) => {
    updateSupplier(id, data);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Supplier Profile</h1>
          <p className="page-description">Maintain vendor records and master profiles</p>
        </div>
        <AddModal<SupplierRecord>
          title="Add New Supplier"
          fields={fields as any}
          onSubmit={(data) => {
             addSupplier({ ...data as SupplierRecord, id: Date.now().toString() });
          }}
          triggerLabel="New Supplier"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Total Suppliers" value={records.length} icon={Truck} variant="primary" />
        <StatCard label="Active" value={records.filter(r => r.status === 'Active').length} icon={ShieldCheck} variant="success" />
        <StatCard label="International" value={records.filter(r => r.supplierType === 'International').length} icon={Globe} variant="info" />
      </div>

      <DataTable
        data={records}
        columns={columns}
        searchPlaceholder="Search by supplier name or code..."
        actions={(row) => (
          <ActionMenu>
            <EditModal<SupplierRecord>
              title="Edit Supplier"
              data={row}
              fields={fields as any}
                onSubmit={(data) => updateSupplier(row.id, data)}
                triggerLabel="Edit"
              />
              <DeleteModal
                title="Delete Supplier"
                onSubmit={() => deleteSupplier(row.id)}
                triggerLabel="Delete"
              />
          </ActionMenu>
        )}
        defaultPageSize={10}
      />
    </div>
  );
}
