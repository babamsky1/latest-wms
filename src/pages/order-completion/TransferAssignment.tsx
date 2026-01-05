import { StatCard } from "@/components/dashboard/StatCard";
import { ColumnDef, DataTable } from "@/components/table/DataTable";
import { Badge } from "@/components/ui/badge";
import { WorkflowButton, WorkflowTransition } from "@/components/workflow/WorkflowButton";
import { useWms } from "@/hooks/useWms";
import { TransferRecord } from "@/types";
import { ArrowLeftRight, ClipboardList, Truck } from "lucide-react";

export default function TransferAssignment() {
  const { transfers, updateTransfer, items } = useWms();

  // Filter transfers that are approved and ready for assignment
  const records = transfers.filter(t => t.status === "Approved" || t.status === "In Transit" || t.status === "Done");

  // Get item details for each transfer
  const getTransferDetails = (transfer: TransferRecord) => {
    // Get the first item from the transfer's items array (primary product)
    const primaryItem = transfer && transfer.items && transfer.items.length > 0 ? transfer.items[0] : null;
    const item = primaryItem ? items.find(i => i.psc === primaryItem.psc) : null;
    return { transfer, item };
  };

  const transferTransitions: WorkflowTransition<TransferRecord["status"]>[] = [
    { from: "Approved", to: "In Transit", label: "Start Delivery" },
    { from: "In Transit", to: "Done", label: "Complete Delivery" },
  ];

  const columns: ColumnDef<TransferRecord>[] = [
    { key: "referenceNo", label: "Transfer ID", className: "font-mono font-bold" },
    {
      key: "items",
      label: "Product",
      render: (row) => {
        const { item } = getTransferDetails(row);
        return item ? (
          <div className="flex flex-col">
            <span className="font-medium">{item.shortDescription}</span>
            <span className="text-sm text-muted-foreground font-mono">{item.psc}</span>
          </div>
        ) : (
          <span className="text-muted-foreground">Product not found</span>
        );
      },
    },
    { key: "sourceWarehouse", label: "From Warehouse", className: "font-medium" },
    { key: "destinationWarehouse", label: "To Warehouse", className: "font-medium" },
    {
      key: "transferDate",
      label: "Transfer Date",
      render: (row) => new Date(row.transferDate).toLocaleDateString(),
    },
    { key: "requestedBy", label: "Requested By", className: "font-medium" },
    {
      key: "status",
      label: "Status",
      render: (row) => {
        const variants: Record<string, "default" | "secondary" | "destructive" | "outline" | "success" | "warning"> = {
          "Approved": "warning",
          "In Transit": "default",
          "Done": "success",
        };
        return <Badge variant={variants[row.status] || "secondary"}>{row.status}</Badge>;
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Transfer Assignment</h1>
        <p className="page-description">Monitor and manage approved inter-warehouse stock transfers from the Transfers page.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Approved Transfers" value={records.filter((r) => r.status === "Approved").length} icon={Truck} variant="primary" />
        <StatCard label="In Transit" value={records.filter((r) => r.status === "In Transit").length} icon={ClipboardList} variant="warning" />
        <StatCard label="Completed" value={records.filter((r) => r.status === "Done").length} icon={ArrowLeftRight} variant="success" />
      </div>

      <DataTable
        data={records}
        columns={columns}
        searchPlaceholder="Search transfers..."
        actions={(row) => (
          <WorkflowButton
            transitions={transferTransitions}
            currentStatus={row.status}
            isAssigned={true}
            onTransition={(nextStatus) => {
              updateTransfer(row.id, { status: nextStatus });
            }}
          />
        )}
      />
    </div>
  );
}
