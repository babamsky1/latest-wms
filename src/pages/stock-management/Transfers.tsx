/**
 * Transfers Page - CONDITIONALLY READ-ONLY
 * 
 * Spec:
 * ✅ Read-only when status != Open
 * ✅ Columns: Reference #, Transfer Date, Needed Date, Source Warehouse, Destination Warehouse, Requested By, Status, Updated By, Updated At
 */

import { StatCard } from "@/components/dashboard/StatCard";
import { DevBadge } from "@/components/dev/DevTools";
import DeleteModal from "@/components/modals/DeleteModal";
import EditModal, { AddField } from "@/components/modals/EditModal";
import { ActionMenu } from "@/components/table/ActionMenu";
import { ColumnDef, DataTable } from "@/components/table/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useWms } from "@/hooks/useWms";
import { TransferRecord, TransferItem } from "@/types";
import { ArrowRightLeft, CheckCircle2, Clock, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

export default function Transfers() {
  const { transfers: rawRecords, addTransfer, updateTransfer, deleteTransfer, warehouses, items } = useWms();

  // Migrate old format to new format (backward compatibility)
  const records = rawRecords.map(record => {
    // If record has items array, use it; otherwise migrate from old psc field
    if (record.items && Array.isArray(record.items)) {
      return record;
    } else {
      // Migrate old format: create items array from single psc
      const oldRecord = record as any; // Cast to any to access old psc field
      return {
        ...record,
        items: oldRecord.psc ? [{
          id: "1",
          psc: oldRecord.psc,
          quantity: 1, // Default quantity
          unit: "pcs" // Default unit
        }] : []
      };
    }
  });

  // State for the new transfer form
  const [newTransfer, setNewTransfer] = useState({
    transferDate: "",
    neededDate: "",
    sourceWarehouse: "",
    destinationWarehouse: "",
    requestedBy: ""
  });

  // Dynamic product management state for the add modal
  const [transferItems, setTransferItems] = useState<TransferItem[]>([
    { id: "1", psc: "", quantity: 1, unit: "pcs" }
  ]);

  const addTransferItem = () => {
    const newId = String(Math.max(...transferItems.map(item => parseInt(item.id)), 0) + 1);
    setTransferItems([...transferItems, { id: newId, psc: "", quantity: 1, unit: "pcs" }]);
  };

  const removeTransferItem = (id: string) => {
    if (transferItems.length > 1) {
      setTransferItems(transferItems.filter(item => item.id !== id));
    }
  };

  const updateTransferItem = (id: string, field: keyof TransferItem, value: string | number) => {
    setTransferItems(transferItems.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const addFields: AddField<TransferRecord>[] = [
    { label: "Transfer Date", name: "transferDate", type: "date", required: true },
    { label: "Needed Date", name: "neededDate", type: "date", required: true },
    { label: "Source Warehouse", name: "sourceWarehouse", type: "select", options: warehouses.map(w => ({ value: w.name, label: w.name })), required: true },
    { label: "Destination Warehouse", name: "destinationWarehouse", type: "select", options: warehouses.map(w => ({ value: w.name, label: w.name })), required: true },
    { label: "Requested By", name: "requestedBy", type: "text", required: true },
  ];

  const columns: ColumnDef<TransferRecord>[] = [
    {
      key: "referenceNo",
      label: "Reference #",
      className: "font-mono font-bold",
      render: (row) => (
        <div className="flex items-center">
          {row.referenceNo}
          {row.isTestData && <DevBadge />}
        </div>
      )
    },
    {
      key: "items",
      label: "Products",
      render: (row) => (
        <div className="space-y-1">
          {row.items.map((item, index) => (
            <div key={item.id} className="text-sm">
              <span className="font-mono font-bold">{item.psc}</span>
              <span className="text-muted-foreground ml-2">
                ({item.quantity} {item.unit})
              </span>
              {index < row.items.length - 1 && <span className="text-muted-foreground">, </span>}
            </div>
          ))}
        </div>
      )
    },
    { key: "transferDate", label: "Date" },
    { key: "neededDate", label: "Needed" },
    { key: "sourceWarehouse", label: "Source" },
    { key: "destinationWarehouse", label: "Destination" },
    { key: "requestedBy", label: "Requested By" },
    {
      key: "status",
      label: "Status",
      render: (row) => {
        const variants: Record<string, string> = {
          "Open": "status-pending",
          "Approved": "status-info",
          "In Transit": "status-warning",
          "Done": "status-active",
          "Cancelled": "status-error"
        };
        return <span className={`status-badge ${variants[row.status] || 'status-pending'}`}>{row.status}</span>;
      }
    },
    { key: "updatedAt", label: "Last Updated", className: "hidden xl:table-cell text-sm text-muted-foreground" }
  ];

  const handleCreateTransfer = () => {
    // Validate required fields
    if (!newTransfer.transferDate || !newTransfer.neededDate ||
        !newTransfer.sourceWarehouse || !newTransfer.destinationWarehouse ||
        !newTransfer.requestedBy) {
      alert("Please fill in all required fields");
      return;
    }

    // Validate that at least one product is selected
    if (transferItems.some(item => !item.psc)) {
      alert("Please select products for all items");
      return;
    }

    const newRec: TransferRecord = {
      id: Date.now().toString(),
      items: transferItems,
      referenceNo: `TRF-${String(records.length + 1).padStart(3, "0")}`,
      transferDate: newTransfer.transferDate,
      neededDate: newTransfer.neededDate,
      sourceWarehouse: newTransfer.sourceWarehouse,
      destinationWarehouse: newTransfer.destinationWarehouse,
      requestedBy: newTransfer.requestedBy,
      status: "Open",
      updatedBy: "admin",
      updatedAt: new Date().toLocaleString(),
    };

    addTransfer(newRec);

    // Reset form
    setNewTransfer({
      transferDate: "",
      neededDate: "",
      sourceWarehouse: "",
      destinationWarehouse: "",
      requestedBy: ""
    });
    setTransferItems([{ id: "1", psc: "", quantity: 1, unit: "pcs" }]);
  };

  const handleUpdate = (id: string, data: Partial<TransferRecord>) => {
    updateTransfer(id, { ...data, updatedAt: new Date().toLocaleString(), updatedBy: "admin" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Transfers</h1>
          <p className="page-description">Stock movement between warehouse locations</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Transfer
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>New Transfer</DialogTitle>
              <DialogDescription>
                Create a new transfer request with multiple products
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Transfer Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="transferDate">Transfer Date</Label>
                  <Input
                    id="transferDate"
                    type="date"
                    value={newTransfer.transferDate}
                    onChange={(e) => setNewTransfer({...newTransfer, transferDate: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="neededDate">Needed Date</Label>
                  <Input
                    id="neededDate"
                    type="date"
                    value={newTransfer.neededDate}
                    onChange={(e) => setNewTransfer({...newTransfer, neededDate: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sourceWarehouse">Source Warehouse</Label>
                  <Select value={newTransfer.sourceWarehouse} onValueChange={(value) => setNewTransfer({...newTransfer, sourceWarehouse: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select source warehouse" />
                    </SelectTrigger>
                    <SelectContent>
                      {warehouses.map(w => (
                        <SelectItem key={w.id} value={w.name}>{w.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="destinationWarehouse">Destination Warehouse</Label>
                  <Select value={newTransfer.destinationWarehouse} onValueChange={(value) => setNewTransfer({...newTransfer, destinationWarehouse: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select destination warehouse" />
                    </SelectTrigger>
                    <SelectContent>
                      {warehouses.map(w => (
                        <SelectItem key={w.id} value={w.name}>{w.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="requestedBy">Requested By</Label>
                  <Input
                    id="requestedBy"
                    value={newTransfer.requestedBy}
                    onChange={(e) => setNewTransfer({...newTransfer, requestedBy: e.target.value})}
                    placeholder="Enter requester name"
                  />
                </div>
              </div>

              {/* Products Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold">Products</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addTransferItem}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                </div>

                <div className="space-y-3">
                  {transferItems.map((item, index) => (
                    <div key={item.id} className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className="flex-1">
                        <Label className="text-sm font-medium">Product {index + 1}</Label>
                        <Select
                          value={item.psc}
                          onValueChange={(value) => updateTransferItem(item.id, 'psc', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select product" />
                          </SelectTrigger>
                          <SelectContent>
                            {items.map(i => (
                              <SelectItem key={i.id} value={i.psc}>
                                {i.psc} - {i.shortDescription}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="w-24">
                        <Label className="text-sm font-medium">Qty</Label>
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateTransferItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                        />
                      </div>
                      <div className="w-20">
                        <Label className="text-sm font-medium">Unit</Label>
                        <Input
                          value={item.unit}
                          onChange={(e) => updateTransferItem(item.id, 'unit', e.target.value)}
                          placeholder="pcs"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeTransferItem(item.id)}
                        disabled={transferItems.length === 1}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="submit" onClick={handleCreateTransfer}>
                Create Transfer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Total Transfers" value={records.length} icon={ArrowRightLeft} variant="primary" />
        <StatCard label="Pending" value={records.filter(r => r.status === 'Open').length} icon={Clock} variant="warning" />
        <StatCard label="Completed" value={records.filter(r => r.status === 'Done').length} icon={CheckCircle2} variant="success" />
      </div>

      <DataTable
        data={records}
        columns={columns}
        searchPlaceholder="Search transfers..."
        actions={(row) => (
          <ActionMenu>
            <EditModal
              title="Edit Transfer"
              data={{
                transferDate: row.transferDate,
                neededDate: row.neededDate,
                sourceWarehouse: row.sourceWarehouse,
                destinationWarehouse: row.destinationWarehouse,
                requestedBy: row.requestedBy
              }}
              fields={[
                { label: "Transfer Date", name: "transferDate", type: "date", required: true },
                { label: "Needed Date", name: "neededDate", type: "date", required: true },
                { label: "Source Warehouse", name: "sourceWarehouse", type: "select", options: warehouses.map(w => ({ value: w.name, label: w.name })), required: true },
                { label: "Destination Warehouse", name: "destinationWarehouse", type: "select", options: warehouses.map(w => ({ value: w.name, label: w.name })), required: true },
                { label: "Requested By", name: "requestedBy", type: "text", required: true },
              ]}
              onSubmit={(data) => updateTransfer(row.id, data)}
              triggerLabel="Edit"
            />
            <DeleteModal
              title="Delete Transfer"
              onSubmit={() => deleteTransfer(row.id)}
              triggerLabel="Delete"
            />
            {row.status === "Open" && (
              <Button size="sm" variant="ghost" className="text-success" onClick={() => handleUpdate(row.id, { status: "Approved" })}>
                Approve Transfer
              </Button>
            )}
            {row.status === "Approved" && (
              <Button size="sm" variant="ghost" className="text-warning" onClick={() => handleUpdate(row.id, { status: "In Transit" })}>
                Start Transit
              </Button>
            )}
            {row.status === "In Transit" && (
              <Button size="sm" variant="ghost" className="text-success" onClick={() => handleUpdate(row.id, { status: "Done" })}>
                Complete Transfer
              </Button>
            )}
          </ActionMenu>
        )}
      />
    </div>
  );
}
