/**
 * Allocation Summary Page - READ-ONLY
 *
 * Spec:
 * ✅ READ-ONLY - Auto-updates from assignment completions
 * ✅ Columns: PO #, Series #, Brand, Customer Name, Total Allocated Qty, Total Picked Qty, Total Remaining Qty, Status, Last Updated At
 * ✅ Data derived from Picker, Barcoder, Tagger, and Checker assignments
 */

import { StatCard } from "@/components/dashboard/StatCard";
import { ColumnDef, DataTable } from "@/components/table/DataTable";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2, ClipboardList } from "lucide-react";
import { useWms } from "@/context/WmsContext";
import { useMemo } from "react";

interface AllocationRecord {
  id: string;
  poNo: string;
  seriesNo: string;
  brand: string;
  customerName: string;
  allocatedQty: number;
  pickedQty: number;
  remainingQty: number;
  status: "Fully Picked" | "Partially Picked" | "Pending";
  updatedAt: string;
  stockSource: string;
  sourceReference: string;
}

export default function AllocationSummary() {
  const { pickers, barcoders, taggers, checkers } = useWms();

  // Calculate allocation data from assignment records
  const allocationData: AllocationRecord[] = useMemo(() => {
    // Group by PO and Series to aggregate allocation data
    const allocationMap = new Map<string, AllocationRecord>();

    // Process picker assignments (primary allocation source)
    pickers.forEach(picker => {
      const key = `${picker.poNo}_${picker.seriesNo}`;
      const existing = allocationMap.get(key);

      if (existing) {
        // Update existing record
        existing.allocatedQty = Math.max(existing.allocatedQty, picker.totalQty);
        // Picked quantity based on counted quantity
        existing.pickedQty = Math.max(existing.pickedQty, picker.countedQty);
        existing.updatedAt = new Date().toLocaleString();
      } else {
        // Create new allocation record
        allocationMap.set(key, {
          id: picker.id,
          poNo: picker.poNo,
          seriesNo: picker.seriesNo,
          brand: picker.poBrand,
          customerName: picker.customerName,
          allocatedQty: picker.totalQty,
          pickedQty: picker.countedQty,
          remainingQty: picker.totalQty - picker.countedQty,
          status: picker.countedQty === picker.totalQty ? "Fully Picked" :
                  picker.countedQty > 0 ? "Partially Picked" : "Pending",
          updatedAt: new Date().toLocaleString(),
          stockSource: picker.stockSource,
          sourceReference: picker.sourceReference
        });
      }
    });

    // Update allocation status based on workflow completion
    allocationMap.forEach(allocation => {
      const poBarcoders = barcoders.filter(b => b.poNo === allocation.poNo);
      const poTaggers = taggers.filter(t => t.poNo === allocation.poNo);
      const poCheckers = checkers.filter(c => c.poNo === allocation.poNo);

      // Calculate total counted from all workflow steps
      const totalBarcoded = poBarcoders.reduce((sum, b) => sum + b.countedQty, 0);
      const totalTagged = poTaggers.reduce((sum, t) => sum + t.countedQty, 0);
      const totalChecked = poCheckers.reduce((sum, c) => sum + c.countedQty, 0);

      // Use the minimum of all workflow steps as the verified quantity
      const verifiedQty = Math.min(totalBarcoded, totalTagged, totalChecked);

      if (verifiedQty > allocation.pickedQty) {
        allocation.pickedQty = verifiedQty;
        allocation.remainingQty = allocation.allocatedQty - verifiedQty;
        allocation.status = verifiedQty === allocation.allocatedQty ? "Fully Picked" :
                           verifiedQty > 0 ? "Partially Picked" : "Pending";
      }
    });

    return Array.from(allocationMap.values());
  }, [pickers, barcoders, taggers, checkers]);

  const columns: ColumnDef<AllocationRecord>[] = [
    { key: "poNo", label: "PO #", className: "font-mono font-bold" },
    { key: "seriesNo", label: "Series #", className: "font-mono" },
    { key: "brand", label: "Brand" },
    { key: "customerName", label: "Customer Name", className: "font-medium" },
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
      key: "sourceReference",
      label: "Source Ref",
      className: "font-mono text-sm",
      render: (row) => row.sourceReference,
    },
    {
      key: "allocatedQty",
      label: "Allocated",
      render: (row) => row.allocatedQty.toLocaleString()
    },
    {
      key: "progress",
      label: "Progress",
      className: "font-bold",
      render: (row) => {
        const progressPercent = row.allocatedQty > 0 ? (row.pickedQty / row.allocatedQty) * 100 : 0;
        const isComplete = row.remainingQty === 0;
        const hasProgress = row.pickedQty > 0;

        return (
          <div className="flex flex-col space-y-1 min-w-[120px]">
            <div className="flex justify-between text-xs">
              <span className="text-success font-medium">{row.pickedQty.toLocaleString()}</span>
              <span className="text-destructive font-medium">{row.remainingQty.toLocaleString()}</span>
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
                {progressPercent.toFixed(0)}% Complete
              </span>
            </div>
          </div>
        );
      },
    },
    {
      key: "status",
      label: "Status",
      render: (row) => {
        const variants: Record<string, string> = {
          "Fully Picked": "status-active",
          "Partially Picked": "status-pending",
          "Pending": "status-warning"
        };
        return <span className={`status-badge ${variants[row.status]}`}>{row.status}</span>;
      }
    },
    { key: "updatedAt", label: "Last Updated", className: "text-muted-foreground text-sm" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Allocation Summary</h1>
          <p className="page-description">Real-time allocation status derived from picker, barcoder, tagger, and checker assignments across all stock sources</p>
        </div>
        <Badge variant="secondary">READ-ONLY</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          label="Total Allocated"
          value={allocationData.reduce((sum, r) => sum + r.allocatedQty, 0).toLocaleString()}
          icon={ClipboardList}
          variant="primary"
        />
        <StatCard
          label="Total Picked"
          value={allocationData.reduce((sum, r) => sum + r.pickedQty, 0).toLocaleString()}
          icon={CheckCircle2}
          variant="success"
        />
        <StatCard
          label="Total Remaining"
          value={allocationData.reduce((sum, r) => sum + r.remainingQty, 0).toLocaleString()}
          icon={AlertCircle}
          variant="destructive"
        />
      </div>

      <DataTable
        data={allocationData}
        columns={columns}
        searchPlaceholder="Search by PO #, Series #, or Customer..."
        defaultPageSize={10}
      />
    </div>
  );
}
