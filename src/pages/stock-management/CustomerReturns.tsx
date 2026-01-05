
import { StatCard } from "@/components/dashboard/StatCard";
import { DevBadge } from "@/components/dev/DevTools";
import AddModal, { AddField } from "@/components/modals/AddModal";
import DeleteModal from "@/components/modals/DeleteModal";
import EditModal from "@/components/modals/EditModal";
import { ActionMenu } from "@/components/table/ActionMenu";
import { ColumnDef, DataTable } from "@/components/table/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CustomerReturnRecord, useWms } from "@/context/WmsContext";
import { AlertCircle, Archive, CheckCircle2 } from "lucide-react";

export default function CustomerReturns() {
    const { customerReturns, addCustomerReturn, updateCustomerReturn, deleteCustomerReturn, customers, warehouses, items } = useWms();

    const reasons = ["OVERSTOCK", "DAMAGED", "EXPIRED", "BAD ORDER", "PULL OUT"];
    const statuses = ["Open", "For Segregation", "Done"];

    const addFields: AddField<CustomerReturnRecord>[] = [
        { label: "PSC (Item)", name: "psc", type: "datalist", options: items.map(i => ({ value: i.psc, label: `${i.psc} - ${i.shortDescription}` })), required: true },
        { label: "Customer", name: "customerName", type: "select", options: customers.map(c => ({ value: c.name, label: c.name })), required: true },
        { label: "Warehouse", name: "warehouse", type: "select", options: warehouses.map(w => ({ value: w.name, label: w.name })), required: true },
        { label: "Total Amount", name: "amountTotal", type: "number", required: true },
        { label: "Reason", name: "reason" as any, type: "select", options: reasons.map(r => ({ value: r, label: r })), required: true },
    ];

    const columns: ColumnDef<CustomerReturnRecord>[] = [
        {
            key: "referenceNo",
            label: "REFERENCE #",
            className: "font-mono font-bold",
            render: (row) => (
                <div className="flex items-center">
                    {row.referenceNo}
                    {row.isTestData && <DevBadge />}
                </div>
            )
        },
        { key: "psc", label: "PSC", className: "font-mono font-bold" },
        { key: "customerCode", label: "CUSTOMER CODE", className: "font-mono" },
        { key: "customerName", label: "CUSTOMER NAME" },
        { key: "company", label: "COMPANY" },
        { key: "warehouse", label: "WAREHOUSE" },
        {
            key: "status",
            label: "STATUS",
            render: (row) => {
                const variants: Record<string, string> = {
                    "Open": "status-pending",
                    "For Segregation": "status-warning",
                    "Done": "status-active"
                };
                return <span className={`status-badge ${variants[row.status]}`}>{row.status}</span>;
            }
        },
        {
            key: "amountTotal",
            label: "AMOUNT TOTAL",
            render: (row) => <span>₱{row.amountTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
        },
        {
            key: "reason",
            label: "REASON",
            render: (row) => (
                <div className="flex flex-wrap gap-1">
                    {Array.isArray(row.reason) ? row.reason.map(r => (
                        <Badge key={r} variant="outline" className="text-xs bg-slate-50">{r}</Badge>
                    )) : <Badge variant="outline">{row.reason}</Badge>}
                </div>
            )
        },
        { key: "createdBy", label: "CREATED BY", className: "hidden xl:table-cell text-sm text-muted-foreground" },
        { key: "createdAt", label: "CREATED AT", className: "hidden xl:table-cell text-sm text-muted-foreground" }
    ];

    const handleUpdate = (id: string, data: Partial<CustomerReturnRecord>) => {
        // Handle the reason field specially if it comes from a single select but needs to be an array
        const cleanData = { ...data };
        if (cleanData.reason && typeof cleanData.reason === 'string') {
            cleanData.reason = [cleanData.reason] as any;
        }
        updateCustomerReturn(id, cleanData);
    };

    const handleDelete = (id: string) => {
        deleteCustomerReturn(id);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="page-title">Customer Returns</h1>
                    <p className="page-description">Manage and track customer return requests</p>
                </div>
                <AddModal<CustomerReturnRecord>
                    title="New Customer Return"
                    fields={addFields}
                    onSubmit={(data) => {
                        const selectedCustomer = customers.find(c => c.name === data.customerName);

                        const newRecord: CustomerReturnRecord = {
                            ...data as any,
                            id: Date.now().toString(),
                            referenceNo: `CR-${String(customerReturns.length + 1).padStart(4, "0")}`,
                            customerCode: selectedCustomer?.code || "N/A",
                            company: selectedCustomer?.company || "N/A",
                            status: "Open",
                            // Ensure reason is array
                            reason: Array.isArray(data.reason) ? data.reason : [data.reason] as any,
                            createdBy: "admin",
                            createdAt: new Date().toLocaleString(),
                        };
                        addCustomerReturn(newRecord);
                    }}
                    triggerLabel="New Return"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard label="Total Returns" value={customerReturns.length} icon={Archive} variant="primary" />
                <StatCard label="For Segregation" value={customerReturns.filter(x => x.status === 'For Segregation').length} icon={AlertCircle} variant="warning" />
                <StatCard label="Completed" value={customerReturns.filter(x => x.status === 'Done').length} icon={CheckCircle2} variant="success" />
            </div>

            <DataTable
                data={customerReturns}
                columns={columns}
                searchPlaceholder="Search returns..."
                actions={(row) => {
                    const isLocked = row.status === "Done";
                    if (isLocked) return <Badge variant="secondary">LOCKED</Badge>;

                    return (
                        <ActionMenu>
                            <EditModal<CustomerReturnRecord>
                                title="Edit Return"
                                data={row}
                                fields={addFields as any}
                                onSubmit={(data) => handleUpdate(row.id, data)}
                                triggerLabel="Edit"
                            />
                            <DeleteModal
                                title="Delete Return"
                                onSubmit={() => handleDelete(row.id)}
                                triggerLabel="Delete"
                            />
                            {row.status === "Open" && (
                                <Button size="sm" variant="ghost" className="text-warning" onClick={() => handleUpdate(row.id, { status: "For Segregation" })}>
                                    Mark For Segregation
                                </Button>
                            )}
                            {row.status === "For Segregation" && (
                                <Button size="sm" variant="ghost" className="text-success" onClick={() => handleUpdate(row.id, { status: "Done" })}>
                                    Mark as Done
                                </Button>
                            )}
                        </ActionMenu>
                    );
                }}
            />
        </div>
    );
}
