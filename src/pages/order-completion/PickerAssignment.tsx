import { StatCard } from "@/components/dashboard/StatCard";
import EditModal from "@/components/modals/EditModal";
import { ColumnDef, DataTable } from "@/components/table/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { WorkflowButton, WorkflowTransition } from "@/components/workflow/WorkflowButton";
import { DEFAULT_STAFF_COUNT, STAFF_MEMBERS } from "@/constants/assignment";
import { useWms } from "@/hooks/useWms";
import { PickerRecord } from "@/types";
import { CheckCircle2, ClipboardList, UserPlus, Users } from "lucide-react";

export default function PickerAssignment() {
  const { pickers: allPickers, updatePicker, barcoders, taggers, checkers, items, addItem, deliveries, suppliers, addBarcoder, addTagger, addChecker, addTransferAssignment } = useWms();

  // Function to create all downstream assignments when picker assignment completes
  const createNextAssignment = (poNo: string) => {
    // Find the delivery record to get item details
    const delivery = deliveries.find(d => d.poNumber === poNo || d.referenceNo === poNo);
    if (!delivery) return;

    const item = items.find(i => i.psc === delivery.itemCode);
    const supplier = suppliers.find(s => s.supplierCode === delivery.supplierCode);
    if (!item || !supplier) return;

    // Create ALL assignments in sequence when picker is completed
      // Create Barcoder Assignment
      addBarcoder({
        id: `B-${Date.now()}`,
        seriesNo: `B-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
        poNo: delivery.poNumber || delivery.referenceNo,
        deliveryReference: delivery.referenceNo,
        poBrand: item.brand,
        customerName: supplier.supplierName,
        routeCode: "RT-01",
        barcoderName: "Barcode Scanner",
        deliverySchedule: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        dateApproved: new Date().toISOString().split('T')[0],
        approvedTime: new Date().toTimeString().split(' ')[0],
        priorityLevel: "Medium",
        transferType: delivery.transferType,
        approvedBy: "Admin",
        receivedBy: "Warehouse Staff",
        status: "Pending",
        assignedStaff: undefined,
        stockSource: "Supplier Delivery",
        sourceReference: delivery.referenceNo,
        totalQty: delivery.quantity,
        countedQty: 0,
      });

      // Create Tagger Assignment
      addTagger({
        id: `T-${Date.now()}`,
        seriesNo: `T-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
        poNo: delivery.poNumber || delivery.referenceNo,
        deliveryReference: delivery.referenceNo,
        poBrand: item.brand,
        customerName: supplier.supplierName,
        routeCode: "RT-01",
        priorityLevel: "Medium",
        deliverySchedule: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        dateApproved: new Date().toISOString().split('T')[0],
        status: "Pending",
        approvedBy: "Admin",
        assignedStaff: undefined,
        stockSource: "Supplier Delivery",
        sourceReference: delivery.referenceNo,
        totalQty: delivery.quantity,
        countedQty: 0,
      });

      // Create Checker Assignment
      addChecker({
        id: `C-${Date.now()}`,
        seriesNo: `CHK-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
        poNo: delivery.poNumber || delivery.referenceNo,
        deliveryReference: delivery.referenceNo,
        customerName: supplier.supplierName,
        status: "Pending",
        assignedStaff: undefined,
        stockSource: "Supplier Delivery",
        sourceReference: delivery.referenceNo,
        totalQty: delivery.quantity,
        countedQty: 0,
      });

      // Create Transfer Assignment
      addTransferAssignment({
        id: `TA-${Date.now()}`,
        transferId: `TRF-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
        fromWarehouse: "Main Warehouse",
        toWarehouse: "Retail Outlet",
        driverName: "Robert Garcia",
        assignedStaff: undefined,
        status: "Assigned",
      });

      // Create Stock Buffering record (final step)
      const existingStockBuffer = items.find(i => i.psc === delivery.itemCode);
      if (!existingStockBuffer) {
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
  };

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
      key: "stockSource",
      label: "Stock Source",
      render: (row) => (
        <Badge variant={
          row.stockSource === "Supplier Delivery" ? "default" :
          row.stockSource === "Internal Transfer" ? "secondary" :
          row.stockSource === "Adjustment" ? "outline" : "destructive"
        }>
          {row.stockSource}
        </Badge>
      ),
    },
    {
      key: "priorityLevel",
      label: "Priority",
      render: (row) => {
        const variants = {
          "High": "destructive",
          "Medium": "default",
          "Low": "secondary"
        } as const;

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
      key: "status",
      label: "Status",
      className: "text-center",
      render: (row) => {
        const variants: Record<string, "default" | "secondary" | "destructive" | "outline" | "success" | "warning"> = {
          "No Assignment": "secondary",
          "Assigned": "warning",
          "Picking": "default",
          "Picked": "success",
        };
        return <Badge variant={variants[row.status] || "secondary"}>{row.status}</Badge>;
      },
    },
    {
      key: "totalQty",
      label: "Progress",
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
          <p className="page-description">Assign pickers to orders using stock from any source (Supplier Delivery, Internal Transfer, Adjustments)</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Active Pickers" value={DEFAULT_STAFF_COUNT.PICKERS.toString()} icon={Users} variant="primary" />
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
              const updates: Partial<PickerRecord> = { status: nextStatus };
              // When picking is completed, set countedQty to totalQty
              if (nextStatus === "Picked") {
                updates.countedQty = row.totalQty;
                // Create all downstream assignments in sequence
                setTimeout(() => createNextAssignment(row.poNo), 100);
              }
              updatePicker(row.id, updates);
            }}
          />
        )}
      />
    </div>
  );
}
