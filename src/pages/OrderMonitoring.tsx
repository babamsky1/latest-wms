/**
 * Order Monitoring Page - READ-ONLY
 * 
 * Spec:
 * ✅ READ-ONLY
 * ✅ Columns: PO #, Series #, Customer Name, Brand, Picker Status, Barcoder Status, Tagger Status, Checker Status, Overall Order Status, Delivery Schedule, Last Updated At
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
import { OrderMonitorRecord, useWms } from "@/hooks/useWms";
import { Activity, CheckCircle2, Clock } from "lucide-react";

const statusColor = (status: string) => {
  switch (status) {
    case "Done": return "text-success font-bold";
    case "In Progress": return "text-warning font-bold";
    default: return "text-muted-foreground";
  }
};

export default function OrderMonitoring() {
  const { orders: monitorData, addOrder, updateOrder, deleteOrder, customers } = useWms();

  const addFields: AddField<OrderMonitorRecord>[] = [
    { label: "PO Number", name: "poNo", type: "text", required: true },
    { label: "Series Number", name: "seriesNo", type: "text", required: true },
    { label: "Customer", name: "customerName", type: "select", options: customers.map(c => ({ value: c.name, label: c.name })), required: true },
    { label: "Brand", name: "brand", type: "select", options: [{ value: "BW", label: "BW" }, { value: "KLIK", label: "KLIK" }, { value: "OMG", label: "OMG" }, { value: "ORO", label: "ORO" }], required: true },
    { label: "Delivery Schedule", name: "deliverySchedule", type: "date", required: true },
  ];
  const columns: ColumnDef<OrderMonitorRecord>[] = [
    { 
      key: "poNo", 
      label: "PO #", 
      className: "font-mono font-bold",
      render: (row) => (
        <div className="flex items-center">
          {row.poNo}
          {row.isTestData && <DevBadge />}
        </div>
      )
    },
    { key: "seriesNo", label: "Series #", className: "font-mono" },
    { key: "customerName", label: "Customer Name", className: "font-medium" },
    { key: "brand", label: "Brand" },
    { 
      key: "pickerStatus", 
      label: "Picker",
      render: (row) => <span className={statusColor(row.pickerStatus)}>{row.pickerStatus}</span>
    },
    { 
      key: "barcoderStatus", 
      label: "Barcoder",
      render: (row) => <span className={statusColor(row.barcoderStatus)}>{row.barcoderStatus}</span>
    },
    { 
      key: "taggerStatus", 
      label: "Tagger",
      render: (row) => <span className={statusColor(row.taggerStatus)}>{row.taggerStatus}</span>
    },
    { 
      key: "checkerStatus", 
      label: "Checker",
      render: (row) => <span className={statusColor(row.checkerStatus)}>{row.checkerStatus}</span>
    },
    {
      key: "overallStatus",
      label: "Overall Status",
      render: (row) => {
        const variants: Record<string, string> = {
          "Ready": "status-active",
          "Shipped": "status-active",
          "Processing": "status-pending",
          "Delayed": "status-error"
        };
        return <span className={`status-badge ${variants[row.overallStatus]}`}>{row.overallStatus}</span>;
      }
    },
    { key: "deliverySchedule", label: "Schedule", className: "font-bold" },
    { key: "updatedAt", label: "Last Updated", className: "text-muted-foreground text-sm" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Order Monitoring</h1>
          <p className="page-description">Manage and track order status across the warehouse workflow</p>
        </div>
        <AddModal<OrderMonitorRecord>
          title="Add New Order"
          fields={addFields}
          onSubmit={(data) => {
            addOrder({
              ...data as OrderMonitorRecord,
              id: Date.now().toString(),
              pickerStatus: "Pending",
              barcoderStatus: "Pending",
              taggerStatus: "Pending",
              checkerStatus: "Pending",
              overallStatus: "Processing",
              updatedAt: new Date().toLocaleString(),
            });
          }}
          triggerLabel="New Order"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          label="Active Orders"
          value={monitorData.length}
          icon={Activity}
          variant="primary"
        />
        <StatCard
          label="Pending Workflow"
          value={monitorData.filter(o => o.overallStatus === 'Processing').length}
          icon={Clock}
          variant="warning"
        />
        <StatCard
          label="Ready for Dispatch"
          value={monitorData.filter(o => o.overallStatus === 'Ready').length}
          icon={CheckCircle2}
          variant="success"
        />
      </div>

      <DataTable
        data={monitorData}
        columns={columns}
        searchPlaceholder="Search by PO #, Series #, or Customer..."
        defaultPageSize={10}
        actions={(row) => (
          <ActionMenu>
            <EditModal<OrderMonitorRecord>
              title="Edit Order"
              data={row}
              fields={addFields as any}
              onSubmit={(data) => updateOrder(row.id, { ...data, updatedAt: new Date().toLocaleString() })}
              triggerLabel="Edit"
            />
            <DeleteModal
              title="Delete Order"
              onSubmit={() => deleteOrder(row.id)}
              triggerLabel="Delete"
            />
            {row.pickerStatus === "Pending" && (
              <Button size="sm" variant="ghost" className="text-blue-600" onClick={() => updateOrder(row.id, { pickerStatus: "In Progress", updatedAt: new Date().toLocaleString() })}>
                Start Picker
              </Button>
            )}
            {row.barcoderStatus === "Pending" && (
              <Button size="sm" variant="ghost" className="text-green-600" onClick={() => updateOrder(row.id, { barcoderStatus: "In Progress", updatedAt: new Date().toLocaleString() })}>
                Start Barcoder
              </Button>
            )}
            {row.taggerStatus === "Pending" && (
              <Button size="sm" variant="ghost" className="text-purple-600" onClick={() => updateOrder(row.id, { taggerStatus: "In Progress", updatedAt: new Date().toLocaleString() })}>
                Start Tagger
              </Button>
            )}
            {row.checkerStatus === "Pending" && (
              <Button size="sm" variant="ghost" className="text-orange-600" onClick={() => updateOrder(row.id, { checkerStatus: "In Progress", updatedAt: new Date().toLocaleString() })}>
                Start Checker
              </Button>
            )}
          </ActionMenu>
        )}
      />
    </div>
  );
}
