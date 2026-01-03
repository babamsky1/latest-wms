/**
 * Order Monitoring Page - READ-ONLY
 * 
 * Spec:
 * ✅ READ-ONLY
 * ✅ Columns: PO #, Series #, Customer Name, Brand, Picker Status, Barcoder Status, Tagger Status, Checker Status, Overall Order Status, Delivery Schedule, Last Updated At
 */

import { StatCard } from "@/components/dashboard/StatCard";
import { DevBadge } from "@/components/dev/DevTools";
import { ColumnDef, DataTable } from "@/components/table/DataTable";
import { Badge } from "@/components/ui/badge";
import { OrderMonitorRecord, useWms } from "@/context/WmsContext";
import { Activity, CheckCircle2, Clock } from "lucide-react";

const statusColor = (status: string) => {
  switch (status) {
    case "Done": return "text-success font-bold";
    case "In Progress": return "text-warning font-bold";
    default: return "text-muted-foreground";
  }
};

export default function OrderMonitoring() {
  const { orders: monitorData } = useWms();
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
          <p className="page-description">Real-time status tracking across the warehouse workflow</p>
        </div>
        <Badge variant="secondary">READ-ONLY</Badge>
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
      />
    </div>
  );
}
