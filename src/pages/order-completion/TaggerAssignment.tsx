import { StatCard } from "@/components/dashboard/StatCard";
import EditModal from "@/components/modals/EditModal";
import { ColumnDef, DataTable } from "@/components/table/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { WorkflowButton, WorkflowTransition } from "@/components/workflow/WorkflowButton";
import { TaggerRecord, useWms } from "@/context/WmsContext";
import { CheckCircle2, ClipboardList, Tags, UserPlus } from "lucide-react";
import { STAFF_MEMBERS, DEFAULT_STAFF_COUNT } from "@/constants";

export default function TaggerAssignment() {
  const { taggers: records, updateTagger, pickers, barcoders, checkers, items, addItem, deliveries } = useWms();

  // Function to check if all assignments for a delivery are completed and create Stock Buffering record
  const checkAndCreateStockBuffering = (poNo: string) => {
    // Find all assignments for this PO
    const poPickers = pickers.filter(p => p.poNo === poNo && p.status === "Picked");
    const poBarcoders = barcoders.filter(b => b.poNo === poNo && b.status === "Scanned");
    const poTaggers = records.filter(t => t.poNo === poNo && t.status === "Tagged");
    const poCheckers = checkers.filter(c => c.poNo === poNo && c.status === "Checked");

    // Check if we have assignments for all types
    const hasPickers = poPickers.length > 0;
    const hasBarcoders = poBarcoders.length > 0;
    const hasTaggers = poTaggers.length > 0;
    const hasCheckers = poCheckers.length > 0;

    // If all assignment types exist and are completed, create Stock Buffering record
    if (hasPickers && hasBarcoders && hasTaggers && hasCheckers) {
      // Find the delivery record to get item details
      const delivery = deliveries.find(d => d.referenceNo === poNo);
      if (delivery) {
        const item = items.find(i => i.psc === delivery.itemCode);
        if (item) {
          // Check if Stock Buffering record already exists
          const existingStockBuffer = items.find(i => i.psc === delivery.itemCode);
          if (!existingStockBuffer) {
            // Create new Stock Buffering record
            addItem({
              id: `SB-${Date.now()}`,
              psc: delivery.itemCode,
              shortDescription: item.shortDescription,
              longDescription: item.longDescription,
              invoiceDescription: item.invoiceDescription,
              picklistCode: item.picklistCode,
              barcode: item.barcode,
              productType: item.productType,
              igDescription: item.igDescription,
              subId: item.subId,
              brand: item.brand,
              group: item.group,
              category: item.category,
              subCategory: item.subCategory,
              size: item.size,
              color: item.color,
              isSaleable: true,
              cost: item.cost,
              srp: item.srp,
              isTestData: false
            });
          }
        }
      }
    }
  };

  const taggerTransitions: WorkflowTransition<TaggerRecord["status"]>[] = [
    { from: "Pending", to: "Tagging", label: "Start Tagging" },
    { from: "Tagging", to: "Tagged", label: "Complete Tagging" },
  ];

  const columns: ColumnDef<TaggerRecord>[] = [
    { key: "seriesNo", label: "Series #", className: "font-mono font-bold" },
    { key: "poNo", label: "PO #", className: "font-mono" },
    {
      key: "deliveryReference",
      label: "DEL Ref",
      className: "font-mono",
      render: (row) => row.deliveryReference || "N/A"
    },
    { key: "poBrand", label: "Brand" },
    { key: "customerName", label: "Customer" },
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
      key: "sourceReference",
      label: "Source Ref",
      className: "font-mono text-sm",
      render: (row) => row.sourceReference,
    },
    {
      key: "priorityLevel",
      label: "Priority",
      render: (row) => {
        const colors = {
          "High": "text-red-700 bg-red-100",
          "Medium": "text-blue-700 bg-blue-100",
          "Low": "text-gray-700 bg-gray-100"
        };

        return (
          <div className="flex items-center gap-1">
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${colors[row.priorityLevel as keyof typeof colors]}`}>
              {row.priorityLevel}
            </div>
            {row.priorityLevel === "High" && (
              <span className="text-red-500 text-xs">⚡</span>
            )}
          </div>
        );
      },
    },
    {
      key: "totalQty",
      label: "Tag Progress",
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
          fields={[{ name: "assignedStaff", label: "Staff Member", type: "select", options: STAFF_MEMBERS }]}
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
          <p className="page-description">Assign price tagging and labeling tasks for stock from any source (Supplier Delivery, Internal Transfer, Adjustments, Customer Returns)</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Active Taggers" value={DEFAULT_STAFF_COUNT.TAGGERS.toString()} icon={Tags} variant="primary" />
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
            onTransition={(nextStatus) => {
              const updates: Partial<TaggerRecord> = { status: nextStatus };
              // When tagging is completed, set countedQty to totalQty
              if (nextStatus === "Tagged") {
                updates.countedQty = row.totalQty;
                // Check if all assignments for this delivery are completed
                setTimeout(() => checkAndCreateStockBuffering(row.poNo), 100);
              }
              updateTagger(row.id, updates);
            }}
          />
        )}
      />
    </div>
  );
}
