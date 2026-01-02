/**
 * Stock Location Inquiry Page - Refactored
 * 
 * Features:
 * ✅ Standardized StatCards
 * ✅ DataTable with fixed pagination
 * ✅ ActionMenu for operations
 * ✅ Location-based tracking
 */

import { StatCard } from "@/components/dashboard/StatCard";
import AddModal from "@/components/modals/AddModal";
import DeleteModal from "@/components/modals/DeleteModal";
import EditModal, { EditField } from "@/components/modals/EditModal";
import { ActionMenu } from "@/components/table/ActionMenu";
import { ColumnDef, DataTable } from "@/components/table/DataTable";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import { useReducer } from "react";
import { Link } from "react-router-dom";

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
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
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
  {
    id: "1",
    psc: "PSC-001",
    warehouse: "main",
    location: "A1-01-01",
    availableQty: 150,
    reservedQty: 25,
    stockInquiryRef: "STK-001",
    category: "electronics",
    group: "group_a",
    subCategory: "sub_1",
    created_by: "Admin",
    created_at: "2024-01-10T08:00:00Z",
    updated_at: "2024-01-15T14:30:00Z",
  },
  {
    id: "2",
    psc: "PSC-002",
    warehouse: "secondary",
    location: "B2-03-02",
    availableQty: 80,
    reservedQty: 10,
    stockInquiryRef: "STK-002",
    category: "furniture",
    group: "group_b",
    subCategory: "sub_2",
    created_by: "Admin",
    created_at: "2024-01-11T09:00:00Z",
    updated_at: "2024-01-14T10:00:00Z",
  },
  {
    id: "3",
    psc: "PSC-003",
    warehouse: "outlet",
    location: "C1-02-05",
    availableQty: 200,
    reservedQty: 50,
    stockInquiryRef: "STK-003",
    category: "clothing",
    group: "group_a",
    subCategory: "sub_3",
    created_by: "Admin",
    created_at: "2024-01-12T10:00:00Z",
    updated_at: "2024-01-13T12:00:00Z",
  },
];

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "DELETE_RECORD":
      return {
        ...state,
        records: state.records.filter((r) => r.id !== action.payload),
      };
    case "ADD_RECORD":
      return { 
        ...state, 
        records: [
          {
            ...action.payload,
            created_at: new Date().toISOString(),
            created_by: "Current User",
            updated_at: new Date().toISOString()
          }, 
          ...state.records
        ] 
      };
    case "UPDATE_RECORD":
      return {
        ...state,
        records: state.records.map((r) =>
          r.id === action.payload.id ? {
            ...action.payload,
            updated_at: new Date().toISOString(),
            updated_by: "Current User"
          } : r
        ),
      };
    default:
      return state;
  }
};

export default function StockLocationInquiry() {
  const [state, dispatch] = useReducer(reducer, { records: initialRecords });

  const editFields: EditField<LocationRecord>[] = [
    { label: "PSC", name: "psc", type: "text", required: true },
    {
      label: "Warehouse",
      name: "warehouse",
      type: "select",
      required: true,
      options: warehouseOptions,
    },
    { label: "Location", name: "location", type: "text", required: true },
    {
      label: "Available Qty",
      name: "availableQty",
      type: "number",
      required: true,
    },
    {
      label: "Reserved Qty",
      name: "reservedQty",
      type: "number",
      required: true,
    },
    {
      label: "Stock Inquiry Ref",
      name: "stockInquiryRef",
      type: "text",
      required: true,
    },
    {
      label: "Category",
      name: "category",
      type: "select",
      required: true,
      options: categoryOptions,
    },
    {
      label: "Group",
      name: "group",
      type: "select",
      required: true,
      options: groupOptions,
    },
    {
      label: "Sub-Category",
      name: "subCategory",
      type: "select",
      required: true,
      options: subCategoryOptions,
    },
  ];

  const columns: ColumnDef<LocationRecord>[] = [
    {
      key: "psc",
      label: "PSC",
      className: "font-mono font-medium",
    },
    {
      key: "warehouse",
      label: "Warehouse",
      render: (row) =>
        warehouseOptions.find((w) => w.value === row.warehouse)?.label ||
        row.warehouse,
    },
    {
      key: "location",
      label: "Location",
      render: (row) => (
        <div className="flex items-center gap-2">
           <Badge variant="outline" className="font-mono">{row.location}</Badge>
        </div>
      )
    },
    {
      key: "category",
      label: "Category",
      render: (row) => {
        const label = categoryOptions.find((c) => c.value === row.category)?.label || row.category;
        return <Badge variant="secondary">{label}</Badge>;
      }
    },
    {
      key: "availableQty",
      label: "Available Qty",
      className: "text-left font-medium text-success",
    },
    {
      key: "reservedQty",
      label: "Reserved Qty",
      className: "text-left font-medium text-warning",
    },
    {
      key: "stockInquiryRef",
      label: "Stock Ref",
      className: "text-left",
      render: (row) => (
        <Link
          to={`/inventory/stock-inquiry?ref=${row.stockInquiryRef}`}
          className="text-primary hover:underline inline-flex items-center justify-end gap-1"
        >
          {row.stockInquiryRef}
          <ExternalLink className="h-3 w-3" />
        </Link>
      ),
    },
    {
      key: "created_by",
      label: "Created By",
      className: "hidden xl:table-cell text-sm text-muted-foreground",
    },
    {
      key: "updated_at",
      label: "Updated At",
      className: "hidden xl:table-cell text-sm text-muted-foreground",
      render: (row) => row.updated_at ? new Date(row.updated_at).toLocaleDateString() : "-",
    },
  ];

  const renderActions = (record: LocationRecord) => (
    <ActionMenu>
      <EditModal<LocationRecord>
        title="Edit Location Record"
        description="Update stock location record"
        fields={editFields}
        data={record}
        onSubmit={(data) =>
          dispatch({
            type: "UPDATE_RECORD",
            payload: data as LocationRecord,
          })
        }
        triggerLabel="Edit"
        submitLabel="Update Record"
      />
      <DeleteModal
        title="Delete Location Record"
        description={`Are you sure you want to delete the location record "${record.psc}"? This action cannot be undone.`}
        onSubmit={() =>
          dispatch({ type: "DELETE_RECORD", payload: record.id })
        }
        triggerLabel="Delete"
      />
    </ActionMenu>
  );

  const totalAvailable = state.records.reduce(
    (sum, r) => sum + r.availableQty,
    0
  );
  const totalReserved = state.records.reduce(
    (sum, r) => sum + r.reservedQty,
    0
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Stock Location Inquiry</h1>
          <p className="page-description">Track inventory by warehouse location</p>
        </div>
        <AddModal<LocationRecord>
          title="New Location Entry"
          description="Add a new stock location record"
          fields={[
            {
              label: "PSC",
              name: "psc",
              type: "text",
              required: true,
              placeholder: "e.g. PSC-001",
            },
            {
              label: "Warehouse",
              name: "warehouse",
              type: "select",
              required: true,
              options: warehouseOptions,
            },
            {
              label: "Location",
              name: "location",
              type: "text",
              required: true,
              placeholder: "e.g. A1-01-01",
            },
            {
              label: "Available Qty",
              name: "availableQty",
              type: "number",
              required: true,
            },
            {
              label: "Reserved Qty",
              name: "reservedQty",
              type: "number",
              required: true,
            },
            {
              label: "Stock Inquiry Ref",
              name: "stockInquiryRef",
              type: "text",
              required: true,
              placeholder: "e.g. STK-001",
            },
            {
              label: "Category",
              name: "category",
              type: "select",
              required: true,
              options: categoryOptions,
            },
            {
              label: "Group",
              name: "group",
              type: "select",
              required: true,
              options: groupOptions,
            },
            {
              label: "Sub-Category",
              name: "subCategory",
              type: "select",
              required: true,
              options: subCategoryOptions,
            },
          ]}
          onSubmit={(data) => {
            dispatch({
              type: "ADD_RECORD",
              payload: {
                ...data,
                id: Date.now().toString(),
              } as LocationRecord,
            });
          }}
          triggerLabel="New Location"
          submitLabel="Add Record"
          size="lg"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          label="Total Locations"
          value={state.records.length}
          contentType="locations"
          variant="primary"
        />
        <StatCard
          label="Total Available"
          value={totalAvailable.toLocaleString()}
          contentType="stock"
          variant="success"
        />
        <StatCard
          label="Total Reserved"
          value={totalReserved.toLocaleString()}
          contentType="stock" // or "locked" but standard "stock" is fine or "pending"
          variant="warning"
        />
      </div>

      <DataTable
        data={state.records}
        columns={columns}
        searchPlaceholder="Search by PSC, location, warehouse..."
        actions={renderActions}
        defaultPageSize={10}
      />
    </div>
  );
}
