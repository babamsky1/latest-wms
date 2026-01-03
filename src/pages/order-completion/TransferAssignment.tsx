import { StatCard } from "@/components/dashboard/StatCard";
import EditModal from "@/components/modals/EditModal";
import { ColumnDef, DataTable } from "@/components/table/DataTable";
import { Button } from "@/components/ui/button";
import { WorkflowButton, WorkflowTransition } from "@/components/workflow/WorkflowButton";
import { TransferAssignmentRecord, useWms } from "@/context/WmsContext";
import { ArrowLeftRight, ClipboardList, Truck, UserPlus } from "lucide-react";

const staffList = [
  { value: "John Doe", label: "John Doe" },
  { value: "Jane Smith", label: "Jane Smith" },
  { value: "Robert Garcia", label: "Robert Garcia" },
  { value: "Alice Williams", label: "Alice Williams" },
  { value: "Michael Brown", label: "Michael Brown" },
];

export default function TransferAssignment() {
  const { transferAssignments: records, updateTransferAssignment } = useWms();

  const transferTransitions: WorkflowTransition<TransferAssignmentRecord["status"]>[] = [
    { from: "Assigned", to: "On Delivery", label: "Start Delivery" },
    { from: "On Delivery", to: "Delivered", label: "Complete Delivery" },
  ];

  const columns: ColumnDef<TransferAssignmentRecord>[] = [
    { key: "transferId", label: "Transfer ID", className: "font-mono font-bold" },
    { key: "fromWarehouse", label: "From", className: "font-medium" },
    { key: "toWarehouse", label: "To", className: "font-medium" },
    { key: "driverName", label: "Driver" },
    {
      key: "status",
      label: "Status",
      render: (row) => {
        const effectiveStatus = row.assignedStaff ? row.status : "No Assignment";
        const variants: Record<string, string> = {
          "No Assignment": "status-muted",
          Assigned: "status-warning",
          "On Delivery": "status-pending",
          Delivered: "status-active",
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
          onSubmit={(data) => updateTransferAssignment(row.id, { assignedStaff: data.assignedStaff })}
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
                  <span className="text-sm italic">Assign Driver</span>
                </div>
              )}
            </Button>
          }
        />
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Transfer Assignment</h1>
          <p className="page-description">Assign and manage inter-warehouse stock transfer tasks</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Active Drivers" value="3" icon={Truck} variant="primary" />
        <StatCard label="Pending Transfers" value={records.filter((r) => r.status === "Assigned").length} icon={ClipboardList} variant="warning" />
        <StatCard label="Completed Today" value={records.filter((r) => r.status === "Delivered").length} icon={ArrowLeftRight} variant="success" />
      </div>

      <DataTable
        data={records}
        columns={columns}
        searchPlaceholder="Search transfers..."
        actions={(row) => (
          <WorkflowButton
            transitions={transferTransitions}
            currentStatus={row.assignedStaff ? row.status : "Assigned"}
            isAssigned={!!row.assignedStaff}
            onTransition={(nextStatus) => updateTransferAssignment(row.id, { status: nextStatus })}
          />
        )}
      />
    </div>
  );
}
