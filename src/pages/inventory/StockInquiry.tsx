import { useReducer } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTable, ColumnDef } from "@/components/table/DataTable";
import { Eye, MoreHorizontal, Search, Trash2 } from "lucide-react";
import AddModal from "@/components/modals/AddModal";
import EditModal, { EditField } from "@/components/modals/EditModal";

interface StockRecord {
  id: string;
  psc: string;
  anNo: string;
  barcode: string;
  description: string;
  igNo: string;
  brand: string;
  category: string;
  group: string;
  subCategory: string;
  [key: string]: unknown;
}

type State = {
  records: StockRecord[];
};

type Action =
  | { type: "DELETE_RECORD"; payload: string }
  | { type: "ADD_RECORD"; payload: StockRecord }
  | { type: "UPDATE_RECORD"; payload: StockRecord };

const igNoOptions = [
  { value: "IG001", label: "IG001 - General" },
  { value: "IG002", label: "IG002 - Electronics" },
  { value: "IG003", label: "IG003 - Consumables" },
];

const brandOptions = [
  { value: "acme", label: "Acme Corp" },
  { value: "globex", label: "Globex Inc" },
  { value: "initech", label: "Initech" },
  { value: "hooli", label: "Hooli" },
];

const categoryOptions = [
  { value: "electronics", label: "Electronics" },
  { value: "furniture", label: "Furniture" },
  { value: "clothing", label: "Clothing" },
  { value: "food", label: "Food & Beverage" },
];

const groupOptions = [
  { value: "group_a", label: "Group A" },
  { value: "group_b", label: "Group B" },
  { value: "group_c", label: "Group C" },
];

const subCategoryOptions = [
  { value: "sub_1", label: "Sub-Category 1" },
  { value: "sub_2", label: "Sub-Category 2" },
  { value: "sub_3", label: "Sub-Category 3" },
];

const initialRecords: StockRecord[] = [
  { id: "1", psc: "PSC-001", anNo: "AN-12345", barcode: "1234567890123", description: "Widget A - Premium Model", igNo: "IG001", brand: "acme", category: "electronics", group: "group_a", subCategory: "sub_1" },
  { id: "2", psc: "PSC-002", anNo: "AN-12346", barcode: "1234567890124", description: "Widget B - Standard Model", igNo: "IG002", brand: "globex", category: "electronics", group: "group_b", subCategory: "sub_2" },
  { id: "3", psc: "PSC-003", anNo: "AN-12347", barcode: "1234567890125", description: "Office Chair Deluxe", igNo: "IG003", brand: "initech", category: "furniture", group: "group_a", subCategory: "sub_3" },
];

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "DELETE_RECORD":
      return { ...state, records: state.records.filter(r => r.id !== action.payload) };
    case "ADD_RECORD":
      return { ...state, records: [action.payload, ...state.records] };
    case "UPDATE_RECORD":
      return { ...state, records: state.records.map(r => r.id === action.payload.id ? action.payload : r) };
    default:
      return state;
  }
};

export default function StockInquiry() {
  const [state, dispatch] = useReducer(reducer, { records: initialRecords });

  const editFields: EditField<StockRecord>[] = [
    { label: "PSC", name: "psc", type: "text", disabled: true },
    { label: "AN No", name: "anNo", type: "text", required: true },
    { label: "Barcode", name: "barcode", type: "text", required: true },
    { label: "Description", name: "description", type: "text", required: true },
    { label: "IG No", name: "igNo", type: "select", required: true, options: igNoOptions },
    { label: "Brand", name: "brand", type: "select", required: true, options: brandOptions },
    { label: "Category", name: "category", type: "select", required: true, options: categoryOptions },
    { label: "Group", name: "group", type: "select", required: true, options: groupOptions },
    { label: "Sub-Category", name: "subCategory", type: "select", required: true, options: subCategoryOptions },
  ];

  const columns: ColumnDef<StockRecord>[] = [
    { key: "psc", label: "PSC", sortable: true, filterable: true, className: "font-mono font-medium" },
    { key: "anNo", label: "AN No", sortable: true, filterable: true, className: "font-mono" },
    { key: "barcode", label: "Barcode", sortable: true, filterable: true, className: "font-mono text-muted-foreground" },
    { key: "description", label: "Description", sortable: true, filterable: true },
    { 
      key: "igNo", 
      label: "IG No", 
      sortable: true, 
      filterable: true,
      filterType: "select",
      filterOptions: igNoOptions,
      render: (row) => igNoOptions.find(i => i.value === row.igNo)?.label.split(" - ")[0] || row.igNo
    },
    { 
      key: "brand", 
      label: "Brand", 
      sortable: true, 
      filterable: true,
      filterType: "select",
      filterOptions: brandOptions,
      render: (row) => brandOptions.find(b => b.value === row.brand)?.label || row.brand
    },
    { 
      key: "category", 
      label: "Category", 
      sortable: true, 
      filterable: true,
      filterType: "select",
      filterOptions: categoryOptions,
      render: (row) => categoryOptions.find(c => c.value === row.category)?.label || row.category
    },
    { 
      key: "group", 
      label: "Group", 
      sortable: true, 
      filterable: true,
      filterType: "select",
      filterOptions: groupOptions,
      render: (row) => groupOptions.find(g => g.value === row.group)?.label || row.group
    },
    { 
      key: "subCategory", 
      label: "Sub-Category", 
      sortable: true, 
      filterable: true,
      filterType: "select",
      filterOptions: subCategoryOptions,
      render: (row) => subCategoryOptions.find(s => s.value === row.subCategory)?.label || row.subCategory
    },
  ];

  const renderActions = (record: StockRecord) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-popover">
        <DropdownMenuItem asChild>
          <EditModal<StockRecord>
            title="Edit Stock Record"
            description="Update stock inquiry record"
            fields={editFields}
            data={record}
            onSubmit={(data) => dispatch({ type: "UPDATE_RECORD", payload: data as StockRecord })}
            triggerLabel="Edit"
            triggerSize="sm"
            submitLabel="Update Record"
            size="lg"
          />
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Eye className="h-4 w-4 mr-2" /> View
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-destructive"
          onClick={() => dispatch({ type: "DELETE_RECORD", payload: record.id })}
        >
          <Trash2 className="h-4 w-4 mr-2" /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title">Stock Inquiry</h1>
            <p className="page-description">Search and view product stock information</p>
          </div>
          <AddModal<StockRecord>
            title="New Stock Entry"
            description="Add a new stock inquiry record"
            fields={[
              { label: "PSC", name: "psc", type: "text", required: true, placeholder: "e.g. PSC-001" },
              { label: "AN No", name: "anNo", type: "text", required: true, placeholder: "e.g. AN-12345" },
              { label: "Barcode", name: "barcode", type: "text", required: true, placeholder: "13-digit barcode" },
              { label: "Description", name: "description", type: "text", required: true },
              { label: "IG No", name: "igNo", type: "select", required: true, options: igNoOptions },
              { label: "Brand", name: "brand", type: "select", required: true, options: brandOptions },
              { label: "Category", name: "category", type: "select", required: true, options: categoryOptions },
              { label: "Group", name: "group", type: "select", required: true, options: groupOptions },
              { label: "Sub-Category", name: "subCategory", type: "select", required: true, options: subCategoryOptions },
            ]}
            onSubmit={(data) => {
              dispatch({ 
                type: "ADD_RECORD", 
                payload: { 
                  ...data, 
                  id: crypto.randomUUID(),
                } as StockRecord 
              });
            }}
            triggerLabel="New Entry"
            submitLabel="Add Record"
            size="lg"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Search className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="stat-label">Total Products</p>
              <p className="stat-value">{state.records.length}</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success/10">
              <Search className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="stat-label">Categories</p>
              <p className="stat-value">{new Set(state.records.map(r => r.category)).size}</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-warning/10">
              <Search className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="stat-label">Brands</p>
              <p className="stat-value">{new Set(state.records.map(r => r.brand)).size}</p>
            </div>
          </div>
        </div>
      </div>

      <DataTable
        data={state.records}
        columns={columns}
        searchPlaceholder="Search by PSC, barcode, description..."
        actions={renderActions}
        pageSize={10}
      />
    </div>
  );
}
