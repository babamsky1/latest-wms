import { StatCard } from "@/components/dashboard/StatCard";
import EditModal from "@/components/modals/EditModal";
import { ColumnDef, DataTable } from "@/components/table/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { WorkflowButton, WorkflowTransition } from "@/components/workflow/WorkflowButton";
import { DEFAULT_STAFF_COUNT, STAFF_MEMBERS } from "@/constants/assignment";
import { CheckerRecord, useWms } from "@/hooks/useWms";
import { CheckCircle2, ClipboardList, ShieldCheck, UserPlus } from "lucide-react";

export default function CheckerAssignment() {
  const { checkers: records, updateChecker } = useWms();

  const checkerTransitions: WorkflowTransition<CheckerRecord["status"]>[] = [
    { from: "Pending", to: "Checking", label: "Start Checking" },
    { from: "Checking", to: "Checked", label: "Complete Checking" },
  ];

  const columns: ColumnDef<CheckerRecord>[] = [
    { key: "seriesNo", label: "Series #", className: "font-mono font-bold" },
    { key: "poNo", label: "PO #", className: "font-mono" },
    {
      key: "deliveryReference",
      label: "DEL Ref",
      className: "font-mono",
      render: (row) => row.deliveryReference || "N/A"
    },
    { key: "customerName", label: "Customer", className: "font-medium" },
    {
      key: "stockSource",
      label: "Stock Source",
      render: (row) => (
        <Badge variant={
          row.stockSource === "Supplier Delivery" ? "default" :
          row.stockSource === "Internal Transfer" ? "secondary" :
          row.stockSource === "Adjustment" ? "outline" :
          row.stockSource === "Customer Return" ? "destructive" : "secondary"
        }>
          {row.stockSource}
        </Badge>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row) => {
        const effectiveStatus = row.assignedStaff ? row.status : "No Assignment";
        const variants: Record<string, "default" | "secondary" | "destructive" | "outline" | "success" | "warning"> = {
          "No Assignment": "secondary",
          "Pending": "warning",
          "Checking": "default",
          "Checked": "success",
        };
        return <Badge variant={variants[effectiveStatus] || "secondary"}>{effectiveStatus}</Badge>;
      },
    },
    {
      key: "lastVerified",
      label: "Last Verified",
      className: "text-sm text-muted-foreground",
      render: (row) => row.lastVerified || "Not verified"
    },
    {
      key: "totalQty",
      label: "Verify Progress",
      className: "font-bold",
      render: (row) => {
        const progressPercent = row.totalQty > 0 ? (row.countedQty / row.totalQty) * 100 : 0;
        const isComplete = row.countedQty === row.totalQty;
        const hasProgress = row.countedQty > 0;

        return (
          <div className="flex flex-col space-y-1 min-w-[100px]">
            <div className="flex justify-between text-xs">
              <span className="text-primary font-medium">{row.totalQty.toLocaleString()}</span>
              <span className={`font-medium ${isComplete ? 'text-success' : hasProgress ? 'text-warning' : 'text-muted-foreground'}`}>
                {row.countedQty.toLocaleString()}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  isComplete ? 'bg-success' :
                  hasProgress ? 'bg-warning' : 'bg-muted'
                }`}
                style={{ width: `${Math.min(progressPercent, 100)}%` }}
              />
            </div>
            <div className="text-center">
              <span className={`text-xs font-medium ${
                isComplete ? 'text-success' :
                hasProgress ? 'text-warning' : 'text-muted-foreground'
              }`}>
                {progressPercent.toFixed(0)}%
              </span>
            </div>
          </div>
        );
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
          fields={[{ name: "assignedStaff", label: "Staff Member", type: "select", options: STAFF_MEMBERS }]}
          onSubmit={(data) => updateChecker(row.id, { assignedStaff: data.assignedStaff })}
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
                  <span className="text-sm italic">Assign Checker</span>
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
          <h1 className="page-title">Checker Assignment</h1>
          <p className="page-description">Final quality and quantity verification for stock from any source (Supplier Delivery, Internal Transfer, Adjustments, Customer Returns)</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Active Checkers" value={DEFAULT_STAFF_COUNT.CHECKERS.toString()} icon={ShieldCheck} variant="primary" />
        <StatCard label="Pending Verify" value={records.filter((d) => d.status === "Pending").length} icon={ClipboardList} variant="warning" />
        <StatCard label="Total Checked" value={records.filter((d) => d.status === "Checked").length} icon={CheckCircle2} variant="success" />
      </div>

      <DataTable
        data={records}
        columns={columns}
        searchPlaceholder="Search assignments..."
        actions={(row) => (
          <WorkflowButton
            transitions={checkerTransitions}
            currentStatus={row.assignedStaff ? row.status : "Pending"}
            isAssigned={!!row.assignedStaff}
            onTransition={(nextStatus) => {
              const updates: Partial<CheckerRecord> = {
                status: nextStatus,
                lastVerified: nextStatus === "Checked" ? new Date().toLocaleString() : undefined,
              };
              // When checking is completed, set countedQty to totalQty
              if (nextStatus === "Checked") {
                updates.countedQty = row.totalQty;
                // Note: Downstream assignments are created by PickerAssignment.tsx
              }
              updateChecker(row.id, updates);
            }}
          />
        )}
      />
    </div>
  );
}
