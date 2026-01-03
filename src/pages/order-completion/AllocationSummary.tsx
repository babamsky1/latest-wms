/**
 * Allocation Summary Page - READ-ONLY
 * 
 * Spec:
 * ✅ READ-ONLY
 * ✅ Columns: PO #, Series #, Brand, Customer Name, Total Allocated Qty, Total Picked Qty, Total Remaining Qty, Status, Last Updated At
 */

import { StatCard } from "@/components/dashboard/StatCard";
import { ColumnDef, DataTable } from "@/components/table/DataTable";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2, ClipboardList } from "lucide-react";

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
}

const allocationData: AllocationRecord[] = [
  {
    id: "1",
    poNo: "PO-89210",
    seriesNo: "SER-001",
    brand: "KLIK",
    customerName: "SM Supermarket",
    allocatedQty: 500,
    pickedQty: 500,
    remainingQty: 0,
    status: "Fully Picked",
    updatedAt: "2024-01-03 14:30",
  },
  {
    id: "2",
    poNo: "PO-89211",
    seriesNo: "SER-002",
    brand: "OMG",
    customerName: "Robinsons Retail",
    allocatedQty: 1000,
    pickedQty: 350,
    remainingQty: 650,
    status: "Partially Picked",
    updatedAt: "2024-01-03 15:45",
  },
  {
    id: "3",
    poNo: "PO-89212",
    seriesNo: "SER-003",
    brand: "BW",
    customerName: "Puregold Price Club",
    allocatedQty: 250,
    pickedQty: 0,
    remainingQty: 250,
    status: "Pending",
    updatedAt: "2024-01-03 16:00",
  },
  {
    id: "4",
    poNo: "PO-89213",
    seriesNo: "SER-004",
    brand: "KLIK",
    customerName: "Ayala Malls",
    allocatedQty: 100,
    pickedQty: 0,
    remainingQty: 100,
    status: "Pending",
    updatedAt: "2024-01-03 16:30",
  }
];

export default function AllocationSummary() {
  const columns: ColumnDef<AllocationRecord>[] = [
    { key: "poNo", label: "PO #", className: "font-mono font-bold" },
    { key: "seriesNo", label: "Series #", className: "font-mono" },
    { key: "brand", label: "Brand" },
    { key: "customerName", label: "Customer Name", className: "font-medium" },
    { 
      key: "allocatedQty", 
      label: "Allocated", 
      render: (row) => row.allocatedQty.toLocaleString() 
    },
    { 
      key: "pickedQty", 
      label: "Picked", 
      className: "text-success font-medium",
      render: (row) => row.pickedQty.toLocaleString() 
    },
    { 
      key: "remainingQty", 
      label: "Remaining", 
      className: "text-destructive font-medium",
      render: (row) => row.remainingQty.toLocaleString() 
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
          <p className="page-description">Derived from picker, barcoder, tagger, and checker assignments</p>
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
