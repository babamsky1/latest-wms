import { useReducer } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTable, ColumnDef } from "@/components/table/DataTable";
import { Eye, MapPin, MoreHorizontal, Trash2, ExternalLink } from "lucide-react";
import AddModal from "@/components/modals/AddModal";
import EditModal, { EditField } from "@/components/modals/EditModal";

interface LocationRecord {
  id: string;
  psc: string;
  warehouse: string;
  location: string;
  availableQty: number;
  reservedQty: number;
  stockInquiryRef: string;
  category: string;
  group: string;
  subCategory: string;
  [key: string]: unknown;
}

type State = {
  records: LocationRecord[];
};

type Action =
  | { type: "DELETE_RECORD"; payload: string }
  | { type: "ADD_RECORD"; payload: LocationRecord }
  | { type: "UPDATE_RECORD"; payload: LocationRecord };

const warehouseOptions = [
  { value: "main", label: "Main Warehouse" },
  { value: "secondary", label: "Secondary Warehouse" },
  { value: "outlet", label: "Outlet Store" },
  { value: "distribution", label: "Distribution Center" },
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

const initialRecords: LocationRecord[] = [
  { id: "1", psc: "PSC-001", warehouse: "main", location: "A1-01-01", availableQty: 150, reservedQty: 25, stockInquiryRef: "STK-001", category: "electronics", group: "group_a", subCategory: "sub_1" },
  { id: "2", psc: "PSC-002", warehouse: "secondary", location: "B2-03-02", availableQty: 80, reservedQty: 10, stockInquiryRef: "STK-002", category: "furniture", group: "group_b", subCategory: "sub_2" },
  { id: "3", psc: "PSC-003", warehouse: "outlet", location: "C1-02-05", availableQty: 200, reservedQty: 50, stockInquiryRef: "STK-003", category: "clothing", group: "group_a", subCategory: "sub_3" },
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

export default function StockLocationInquiry() {
  const [state, dispatch] = useReducer(reducer, { records: initialRecords });

  const editFields: EditField<LocationRecord>[] = [
    { label: "PSC", name: "psc", type: "text", required: true },
    { label: "Warehouse", name: "warehouse", type: "select", required: true, options: warehouseOptions },
    { label: "Location", name: "location", type: "text", required: true },
    { label: "Available Qty", name: "availableQty", type: "number", required: true },
    { label: "Reserved Qty", name: "reservedQty", type: "number", required: true },
    { label: "Stock Inquiry Ref", name: "stockInquiryRef", type: "text", required: true },
    { label: "Category", name: "category", type: "select", required: true, options: categoryOptions },
    { label: "Group", name: "group", type: "select", required: true, options: groupOptions },
    { label: "Sub-Category", name: "subCategory", type: "select", required: true, options: subCategoryOptions },
  ];

  const columns: ColumnDef<LocationRecord>[] = [
    { key: "psc", label: "PSC", sortable: true, filterable: true, className: "font-mono font-medium" },
    { 
      key: "warehouse", 
      label: "Warehouse", 
      sortable: true, 
      filterable: true,
      filterType: "select",
      filterOptions: warehouseOptions,
      render: (row) => warehouseOptions.find(w => w.value === row.warehouse)?.label || row.warehouse
    },
    { key: "location", label: "Location", sortable: true, filterable: true, className: "font-mono" },
    { key: "availableQty", label: "Available Qty", sortable: true, filterable: true, className: "font-semibold text-success" },
    { key: "reservedQty", label: "Reserved Qty", sortable: true, filterable: true, className: "text-warning" },
    { 
      key: "stockInquiryRef", 
      label: "Stock Inquiry Ref", 
      sortable: true, 
      filterable: true,
      render: (row) => (
        <Link 
          to={`/inventory/stock-inquiry?ref=${row.stockInquiryRef}`}
          className="text-primary hover:underline flex items-center gap-1"
        >
          {row.stockInquiryRef}
          <ExternalLink className="h-3 w-3" />
        </Link>
      )
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

  const renderActions = (record: LocationRecord) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-popover">
        <DropdownMenuItem asChild>
          <EditModal<LocationRecord>
            title="Edit Location Record"
            description="Update stock location record"
            fields={editFields}
            data={record}
            onSubmit={(data) => dispatch({ type: "UPDATE_RECORD", payload: data as LocationRecord })}
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

  const totalAvailable = state.records.reduce((sum, r) => sum + r.availableQty, 0);
  const totalReserved = state.records.reduce((sum, r) => sum + r.reservedQty, 0);

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title">Stock Location Inquiry</h1>
            <p className="page-description">Track inventory by warehouse location</p>
          </div>
          <AddModal<LocationRecord>
            title="New Location Entry"
            description="Add a new stock location record"
            fields={[
              { label: "PSC", name: "psc", type: "text", required: true, placeholder: "e.g. PSC-001" },
              { label: "Warehouse", name: "warehouse", type: "select", required: true, options: warehouseOptions },
              { label: "Location", name: "location", type: "text", required: true, placeholder: "e.g. A1-01-01" },
              { label: "Available Qty", name: "availableQty", type: "number", required: true },
              { label: "Reserved Qty", name: "reservedQty", type: "number", required: true },
              { label: "Stock Inquiry Ref", name: "stockInquiryRef", type: "text", required: true, placeholder: "e.g. STK-001" },
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
                } as LocationRecord 
              });
            }}
            triggerLabel="New Location"
            submitLabel="Add Record"
            size="lg"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="stat-label">Total Locations</p>
              <p className="stat-value">{state.records.length}</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success/10">
              <MapPin className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="stat-label">Total Available</p>
              <p className="stat-value">{totalAvailable.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-warning/10">
              <MapPin className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="stat-label">Total Reserved</p>
              <p className="stat-value">{totalReserved.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      <DataTable
        data={state.records}
        columns={columns}
        searchPlaceholder="Search by PSC, location, warehouse..."
        actions={renderActions}
        pageSize={10}
      />
    </div>
  );
}
