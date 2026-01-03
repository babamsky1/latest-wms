import { StatCard } from "@/components/dashboard/StatCard";
import EditModal from "@/components/modals/EditModal";
import { ColumnDef, DataTable } from "@/components/table/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { WorkflowButton, WorkflowTransition } from "@/components/workflow/WorkflowButton";
import { PickerRecord, useWms } from "@/context/WmsContext";
import { CheckCircle2, ClipboardList, UserPlus, Users } from "lucide-react";

// Optional staff list
const staffList = [
  { value: "John Doe", label: "John Doe" },
  { value: "Jane Smith", label: "Jane Smith" },
  { value: "Robert Garcia", label: "Robert Garcia" },
  { value: "Alice Williams", label: "Alice Williams" },
  { value: "Michael Brown", label: "Michael Brown" },
];

export default function PickerAssignment() {
  const { pickers: allPickers, updatePicker } = useWms();

  // Map pickers to include dynamic status: No Assignment if no staff
  const records = allPickers.map((r) => ({
    ...r,
    status: r.assignedStaff ? r.status || "Assigned" : "No Assignment",
  }));

  // Workflow transitions
  const pickerTransitions: WorkflowTransition<PickerRecord["status"]>[] = [
    { from: "Assigned", to: "Picking", label: "Start Picking" },
    { from: "Picking", to: "Picked", label: "Complete Picking" },
  ];

  // Table columns
  const columns: ColumnDef<PickerRecord>[] = [
    { key: "seriesNo", label: "Series #", className: "font-mono font-bold" },
    { key: "poNo", label: "PO #", className: "font-mono" },
    { key: "poBrand", label: "Brand" },
    { key: "customerName", label: "Customer" },
    { key: "routeCode", label: "Route" },
    { key: "deliverySchedule", label: "Schedule" },
    {
      key: "priorityLevel",
      label: "Priority",
      render: (row) => (
        <Badge variant={row.priorityLevel === "High" ? "destructive" : "secondary"}>
          {row.priorityLevel}
        </Badge>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row) => {
        const variants: Record<string, string> = {
          "No Assignment": "status-muted",
          Assigned: "status-warning",
          Picking: "status-pending",
          Picked: "status-active",
        };
        return <span className={`status-badge ${variants[row.status]}`}>{row.status}</span>;
      },
    },
    { key: "totalQty", label: "Qty", className: "font-bold" },
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
            // Update assigned staff and set status dynamically
            updatePicker(row.id, {
              assignedStaff: data.assignedStaff,
              status: data.assignedStaff ? "Assigned" : "No Assignment",
            });
          }}
          customTrigger={
            <Button
              variant="ghost"
              className="w-full justify-between py-2 px-3 group hover:bg-slate-50 border border-transparent hover:border-slate-200"
            >
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
                  <span className="text-sm italic">Assign Picker</span>
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Picker Assignment</h1>
          <p className="page-description">Assign and track picking tasks for active orders</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Active Pickers" value="12" icon={Users} variant="primary" />
        <StatCard label="Pending Tasks" value={records.length} icon={ClipboardList} variant="warning" />
        <StatCard label="Completed Today" value="45" icon={CheckCircle2} variant="success" />
      </div>

      {/* Data Table */}
      <DataTable
        data={records}
        columns={columns}
        searchPlaceholder="Search by series, PO, or customer..."
        actions={(row) => (
          <WorkflowButton
            transitions={pickerTransitions}
            currentStatus={row.status}
            isAssigned={!!row.assignedStaff} // disable if no staff
            onTransition={(nextStatus) => {
              if (!row.assignedStaff) return; // prevent moving if unassigned
              updatePicker(row.id, { status: nextStatus });
            }}
          />
        )}
      />
    </div>
  );
}
