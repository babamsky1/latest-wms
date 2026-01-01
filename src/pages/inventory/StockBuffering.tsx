import { useReducer } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTable, ColumnDef } from "@/components/table/DataTable";
import { AlertTriangle, Eye, MoreHorizontal, Trash2 } from "lucide-react";
import AddModal from "@/components/modals/AddModal";
import EditModal, { EditField } from "@/components/modals/EditModal";

interface BufferRecord {
  id: string;
  psc: string;
  shortDescription: string;
  longDescription: string;
  invoiceDescription: string;
  picklistCode: string;
  barcode: string;
  productType: string;
  igDescription: string;
  subId: string;
  brand: string;
  group: string;
  subCategory: string;
  category: string;
  unitOfMeasure: string;
  currentStock: number;
  reorderLevel: number;
  status: "critical" | "low" | "adequate" | "overstocked";
  [key: string]: unknown;
}

type State = { records: BufferRecord[] };
type Action =
  | { type: "DELETE_RECORD"; payload: string }
  | { type: "ADD_RECORD"; payload: BufferRecord }
  | { type: "UPDATE_RECORD"; payload: BufferRecord };

const brandOptions = [{ value: "acme", label: "Acme" }, { value: "globex", label: "Globex" }, { value: "initech", label: "Initech" }];
const categoryOptions = [{ value: "electronics", label: "Electronics" }, { value: "furniture", label: "Furniture" }, { value: "clothing", label: "Clothing" }];
const groupOptions = [{ value: "group_a", label: "Group A" }, { value: "group_b", label: "Group B" }];
const subCategoryOptions = [{ value: "sub_1", label: "Sub-Category 1" }, { value: "sub_2", label: "Sub-Category 2" }];
const productTypeOptions = [{ value: "finished", label: "Finished Goods" }, { value: "raw", label: "Raw Materials" }, { value: "component", label: "Components" }];
const uomOptions = [{ value: "pcs", label: "Pieces" }, { value: "kg", label: "Kilograms" }, { value: "box", label: "Box" }];
const statusOptions = [{ value: "critical", label: "Critical" }, { value: "low", label: "Low" }, { value: "adequate", label: "Adequate" }, { value: "overstocked", label: "Overstocked" }];

const initialRecords: BufferRecord[] = [
  { id: "1", psc: "PSC-001", shortDescription: "Widget A", longDescription: "Widget A Premium Model for industrial use", invoiceDescription: "Widget A - Premium", picklistCode: "PL-001", barcode: "1234567890123", productType: "finished", igDescription: "IG001 - General", subId: "SUB-01", brand: "acme", group: "group_a", subCategory: "sub_1", category: "electronics", unitOfMeasure: "pcs", currentStock: 15, reorderLevel: 50, status: "critical" },
  { id: "2", psc: "PSC-002", shortDescription: "Widget B", longDescription: "Widget B Standard Model", invoiceDescription: "Widget B - Std", picklistCode: "PL-002", barcode: "1234567890124", productType: "component", igDescription: "IG002 - Electronics", subId: "SUB-02", brand: "globex", group: "group_b", subCategory: "sub_2", category: "electronics", unitOfMeasure: "box", currentStock: 200, reorderLevel: 100, status: "adequate" },
];

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "DELETE_RECORD": return { ...state, records: state.records.filter(r => r.id !== action.payload) };
    case "ADD_RECORD": return { ...state, records: [action.payload, ...state.records] };
    case "UPDATE_RECORD": return { ...state, records: state.records.map(r => r.id === action.payload.id ? action.payload : r) };
    default: return state;
  }
};

export default function StockBuffering() {
  const [state, dispatch] = useReducer(reducer, { records: initialRecords });

  const getStatusBadge = (status: BufferRecord["status"]) => {
    const config = { critical: "bg-destructive/20 text-destructive", low: "bg-warning/20 text-warning", adequate: "bg-success/20 text-success", overstocked: "bg-primary/20 text-primary" };
    return <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config[status]}`}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>;
  };

  const editFields: EditField<BufferRecord>[] = [
    { label: "PSC", name: "psc", type: "text", disabled: true },
    { label: "Short Description", name: "shortDescription", type: "text", required: true },
    { label: "Long Description", name: "longDescription", type: "textarea", required: false },
    { label: "Invoice Description", name: "invoiceDescription", type: "text", required: false },
    { label: "Picklist Code", name: "picklistCode", type: "text", required: true },
    { label: "Barcode", name: "barcode", type: "text", required: true },
    { label: "Product Type", name: "productType", type: "select", required: true, options: productTypeOptions },
    { label: "Brand", name: "brand", type: "select", required: true, options: brandOptions },
    { label: "Category", name: "category", type: "select", required: true, options: categoryOptions },
    { label: "Group", name: "group", type: "select", required: true, options: groupOptions },
    { label: "Sub-Category", name: "subCategory", type: "select", required: true, options: subCategoryOptions },
    { label: "Unit of Measure", name: "unitOfMeasure", type: "select", required: true, options: uomOptions },
    { label: "Current Stock", name: "currentStock", type: "number", required: true },
    { label: "Reorder Level", name: "reorderLevel", type: "number", required: true },
    { label: "Status", name: "status", type: "select", required: true, options: statusOptions },
  ];

  const columns: ColumnDef<BufferRecord>[] = [
    { key: "psc", label: "PSC", sortable: true, filterable: true, className: "font-mono font-medium" },
    { key: "shortDescription", label: "Short Desc", sortable: true, filterable: true },
    { key: "barcode", label: "Barcode", sortable: true, filterable: true, className: "font-mono text-sm" },
    { key: "productType", label: "Type", sortable: true, filterable: true, filterType: "select", filterOptions: productTypeOptions, render: (row) => productTypeOptions.find(p => p.value === row.productType)?.label || row.productType },
    { key: "brand", label: "Brand", sortable: true, filterable: true, filterType: "select", filterOptions: brandOptions, render: (row) => brandOptions.find(b => b.value === row.brand)?.label || row.brand },
    { key: "category", label: "Category", sortable: true, filterable: true, filterType: "select", filterOptions: categoryOptions, render: (row) => categoryOptions.find(c => c.value === row.category)?.label || row.category },
    { key: "unitOfMeasure", label: "UoM", sortable: true, filterable: true, filterType: "select", filterOptions: uomOptions, render: (row) => uomOptions.find(u => u.value === row.unitOfMeasure)?.label || row.unitOfMeasure },
    { key: "currentStock", label: "Current Stock", sortable: true, filterable: true, className: "font-semibold" },
    { key: "reorderLevel", label: "Reorder Level", sortable: true, filterable: true },
    { key: "status", label: "Status", sortable: true, filterable: true, filterType: "select", filterOptions: statusOptions, render: (row) => getStatusBadge(row.status) },
  ];

  const renderActions = (record: BufferRecord) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-popover">
        <DropdownMenuItem asChild><EditModal<BufferRecord> title="Edit Buffer" fields={editFields} data={record} onSubmit={(data) => dispatch({ type: "UPDATE_RECORD", payload: data as BufferRecord })} triggerLabel="Edit" triggerSize="sm" submitLabel="Update" size="lg" /></DropdownMenuItem>
        <DropdownMenuItem><Eye className="h-4 w-4 mr-2" /> View</DropdownMenuItem>
        <DropdownMenuItem className="text-destructive" onClick={() => dispatch({ type: "DELETE_RECORD", payload: record.id })}><Trash2 className="h-4 w-4 mr-2" /> Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div><h1 className="page-title">Stock Buffering</h1><p className="page-description">Monitor buffer levels and reorder points</p></div>
          <AddModal<BufferRecord> title="New Buffer Entry" fields={editFields.filter(f => !f.disabled)} onSubmit={(data) => dispatch({ type: "ADD_RECORD", payload: { ...data, id: crypto.randomUUID() } as BufferRecord })} triggerLabel="New Buffer" submitLabel="Add" size="lg" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="stat-card"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-destructive/10"><AlertTriangle className="h-5 w-5 text-destructive" /></div><div><p className="stat-label">Critical</p><p className="stat-value">{state.records.filter(r => r.status === "critical").length}</p></div></div></div>
        <div className="stat-card"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-warning/10"><AlertTriangle className="h-5 w-5 text-warning" /></div><div><p className="stat-label">Low Stock</p><p className="stat-value">{state.records.filter(r => r.status === "low").length}</p></div></div></div>
        <div className="stat-card"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-success/10"><AlertTriangle className="h-5 w-5 text-success" /></div><div><p className="stat-label">Adequate</p><p className="stat-value">{state.records.filter(r => r.status === "adequate").length}</p></div></div></div>
      </div>
      <DataTable data={state.records} columns={columns} searchPlaceholder="Search by PSC, description, barcode..." actions={renderActions} pageSize={10} />
    </div>
  );
}
