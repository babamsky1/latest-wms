import { StatCard } from "@/components/dashboard/StatCard";
import EditModal from "@/components/modals/EditModal";
import { ColumnDef, DataTable } from "@/components/table/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { WorkflowButton, WorkflowTransition } from "@/components/workflow/WorkflowButton";
import { TaggerRecord, useWms } from "@/context/WmsContext";
import { CheckCircle2, ClipboardList, Tags, UserPlus } from "lucide-react";

const staffList = [
  { value: "John Doe", label: "John Doe" },
  { value: "Jane Smith", label: "Jane Smith" },
  { value: "Robert Garcia", label: "Robert Garcia" },
  { value: "Alice Williams", label: "Alice Williams" },
  { value: "Michael Brown", label: "Michael Brown" },
];

export default function TaggerAssignment() {
  const { taggers: records, updateTagger } = useWms();

  const taggerTransitions: WorkflowTransition<TaggerRecord["status"]>[] = [
    { from: "Pending", to: "Tagging", label: "Start Tagging" },
    { from: "Tagging", to: "Tagged", label: "Complete Tagging" },
  ];

  const columns: ColumnDef<TaggerRecord>[] = [
    { key: "seriesNo", label: "Series #", className: "font-mono font-bold" },
    { key: "poNo", label: "PO #", className: "font-mono" },
    { key: "poBrand", label: "Brand" },
    { key: "customerName", label: "Customer" },
    {
      key: "priorityLevel",
      label: "Priority",
      render: (row) => <Badge variant={row.priorityLevel === "High" ? "destructive" : "secondary"}>{row.priorityLevel}</Badge>,
    },
    { key: "deliverySchedule", label: "Schedule" },
    {
      key: "status",
      label: "Status",
      render: (row) => {
        const effectiveStatus = row.assignedStaff ? row.status : "No Assignment";
        const variants: Record<string, string> = {
          "No Assignment": "status-muted",
          Pending: "status-warning",
          Tagging: "status-pending",
          Tagged: "status-active",
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
          onSubmit={(data) => updateTagger(row.id, { assignedStaff: data.assignedStaff })}
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
                  <span className="text-sm italic">Assign Tagger</span>
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
          <h1 className="page-title">Tagger Assignment</h1>
          <p className="page-description">Manage and assign price tagging and labeling tasks</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Active Taggers" value="5" icon={Tags} variant="primary" />
        <StatCard label="Pending Tags" value={records.length} icon={ClipboardList} variant="warning" />
        <StatCard label="Tagged Today" value="340" icon={CheckCircle2} variant="success" />
      </div>

      <DataTable
        data={records}
        columns={columns}
        searchPlaceholder="Search by series, PO, or customer..."
        actions={(row) => (
          <WorkflowButton
            transitions={taggerTransitions}
            currentStatus={row.assignedStaff ? row.status : "Pending"} // only allow transitions if assigned
            isAssigned={!!row.assignedStaff}
            onTransition={(nextStatus) => updateTagger(row.id, { status: nextStatus })}
          />
        )}
      />
    </div>
  );
}
