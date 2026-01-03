import { StatCard } from "@/components/dashboard/StatCard";
import EditModal from "@/components/modals/EditModal";
import { ColumnDef, DataTable } from "@/components/table/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { WorkflowButton, WorkflowTransition } from "@/components/workflow/WorkflowButton";
import { BarcoderRecord, useWms } from "@/context/WmsContext";
import { CheckCircle2, ClipboardList, QrCode, UserPlus } from "lucide-react";

const staffList = [
  { value: "John Doe", label: "John Doe" },
  { value: "Jane Smith", label: "Jane Smith" },
  { value: "Robert Garcia", label: "Robert Garcia" },
  { value: "Alice Williams", label: "Alice Williams" },
  { value: "Michael Brown", label: "Michael Brown" },
];

export default function BarcoderAssignment() {
  const { barcoders: records, updateBarcoder } = useWms();

  const barcoderTransitions: WorkflowTransition<BarcoderRecord["status"]>[] = [
    { from: "Pending", to: "Scanning", label: "Start Scanning" },
    { from: "Scanning", to: "Scanned", label: "Complete Scanning" },
  ];

  const columns: ColumnDef<BarcoderRecord>[] = [
    { key: "seriesNo", label: "Series #", className: "font-mono font-bold" },
    { key: "poNo", label: "PO #", className: "font-mono" },
    { key: "poBrand", label: "Brand" },
    { key: "customerName", label: "Customer" },
    { key: "deliverySchedule", label: "Schedule" },
    {
      key: "priorityLevel",
      label: "Priority",
      render: (row) => <Badge variant={row.priorityLevel === "High" ? "destructive" : "secondary"}>{row.priorityLevel}</Badge>,
    },
    {
      key: "status",
      label: "Status",
      render: (row) => {
        const effectiveStatus = row.assignedStaff ? row.status : "No Assignment";
        const variants: Record<string, string> = {
          "No Assignment": "status-muted",
          Pending: "status-warning",
          Scanning: "status-pending",
          Scanned: "status-active",
        };
        return <span className={`status-badge ${variants[effectiveStatus]}`}>{effectiveStatus}</span>;
      },
    },
    {
      key: "assignedStaff",
      label: "Assigned Staff",
      render: (row) => (
        <EditModal
          title="Assign Staff"
          description="Select a staff member for this task"
          data={row}
          fields={[{ name: "assignedStaff", label: "Staff Member", type: "select", options: staffList }]}
          onSubmit={(data) => {
            updateBarcoder(row.id, { assignedStaff: data.assignedStaff });
          }}
          customTrigger={
            <Button variant="ghost" className="w-full justify-between py-2 px-3 group hover:bg-slate-50 border border-transparent hover:border-slate-200">
              {row.assignedStaff ? (
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px] font-bold">
                    {row.assignedStaff.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <span className="text-sm font-medium">{row.assignedStaff}</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-muted-foreground group-hover:text-primary transition-colors">
                  <UserPlus className="h-4 w-4" />
                  <span className="text-sm italic">Assign Barcoder</span>
                </div>
              )}
            </Button>
          }
        />
      ),
    },
    { key: "approvedBy", label: "Approved By", className: "text-sm text-muted-foreground" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Barcoder Assignment</h1>
          <p className="page-description">Assign and manage barcode verification tasks</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Active Barcoders" value="8" icon={QrCode} variant="primary" />
        <StatCard label="Pending Qty" value={records.length} icon={ClipboardList} variant="warning" />
        <StatCard label="Verified Today" value="128" icon={CheckCircle2} variant="success" />
      </div>

      <DataTable
        data={records}
        columns={columns}
        searchPlaceholder="Search by series, PO, or customer..."
        actions={(row) => (
          <WorkflowButton
            transitions={barcoderTransitions}
            currentStatus={row.assignedStaff ? row.status : "Pending"} // only allow if assigned
            isAssigned={!!row.assignedStaff}
            onTransition={(nextStatus) => updateBarcoder(row.id, { status: nextStatus })}
          />
        )}
      />
    </div>
  );
}
