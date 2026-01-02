/**
 * Stock Inquiry Page - Refactored
 * 
 * Features:
 * ✅ Standardized StatCards
 * ✅ DataTable with ActionMenu
 * ✅ Comprehensive product search and management
 */

import { StatCard } from "@/components/dashboard/StatCard";
import AddModal from "@/components/modals/AddModal";
import DeleteModal from "@/components/modals/DeleteModal";
import EditModal, { EditField } from "@/components/modals/EditModal";
import { ActionMenu } from "@/components/table/ActionMenu";
import { ColumnDef, DataTable } from "@/components/table/DataTable";
import { Badge } from "@/components/ui/badge";
import { useReducer } from "react";

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
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
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
  {
    id: "1",
    psc: "PSC-001",
    anNo: "AN-12345",
    barcode: "1234567890123",
    description: "Widget A - Premium Model",
    igNo: "IG001",
    brand: "acme",
    category: "electronics",
    group: "group_a",
    subCategory: "sub_1",
    created_by: "Admin",
    created_at: "2024-01-01T08:00:00Z",
    updated_at: "2024-01-01T08:00:00Z",
  },
  {
    id: "2",
    psc: "PSC-002",
    anNo: "AN-12346",
    barcode: "1234567890124",
    description: "Widget B - Standard Model",
    igNo: "IG002",
    brand: "globex",
    category: "electronics",
    group: "group_b",
    subCategory: "sub_2",
    created_by: "Admin",
    created_at: "2024-01-01T08:00:00Z",
    updated_at: "2024-01-01T08:00:00Z",
  },
  {
    id: "3",
    psc: "PSC-003",
    anNo: "AN-12347",
    barcode: "1234567890125",
    description: "Office Chair Deluxe",
    igNo: "IG003",
    brand: "initech",
    category: "furniture",
    group: "group_a",
    subCategory: "sub_3",
    created_by: "Admin",
    created_at: "2024-01-01T08:00:00Z",
    updated_at: "2024-01-01T08:00:00Z",
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
            updated_at: new Date().toISOString(),
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

export default function StockInquiry() {
  const [state, dispatch] = useReducer(reducer, { records: initialRecords });

  const editFields: EditField<StockRecord>[] = [
    { label: "PSC", name: "psc", type: "text", disabled: true },
    { label: "AN No", name: "anNo", type: "text", required: true },
    { label: "Barcode", name: "barcode", type: "text", required: true },
    { label: "Description", name: "description", type: "text", required: true },
    {
      label: "IG No",
      name: "igNo",
      type: "select",
      required: true,
      options: igNoOptions,
    },
    {
      label: "Brand",
      name: "brand",
      type: "select",
      required: true,
      options: brandOptions,
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

  const columns: ColumnDef<StockRecord>[] = [
    {
      key: "psc",
      label: "PSC",
      className: "font-mono font-medium",
    },
    {
      key: "anNo",
      label: "AN No",
      className: "font-mono",
    },
    {
      key: "barcode",
      label: "Barcode",
      className: "font-mono text-muted-foreground",
    },
    {
      key: "description",
      label: "Description",
      className: "font-medium",
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
      key: "brand",
      label: "Brand",
      render: (row) => brandOptions.find((b) => b.value === row.brand)?.label || row.brand,
    },
    {
      key: "igNo",
      label: "IG No",
      render: (row) => igNoOptions.find((i) => i.value === row.igNo)?.label.split(" - ")[0] || row.igNo,
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

  const renderActions = (record: StockRecord) => (
    <ActionMenu>
      <EditModal<StockRecord>
        title="Edit Stock Record"
        description="Update stock inquiry record"
        fields={editFields}
        data={record}
        onSubmit={(data) =>
          dispatch({ type: "UPDATE_RECORD", payload: data as StockRecord })
        }
        triggerLabel="Edit"
        submitLabel="Update Record"
      />
      <DeleteModal
        title="Delete Stock Record"
        description={`Are you sure you want to delete the stock record "${record.id}"? This action cannot be undone.`}
        onSubmit={() =>
          dispatch({ type: "DELETE_RECORD", payload: record.id })
        }
        triggerLabel="Delete"
      />
    </ActionMenu>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Stock Inquiry</h1>
          <p className="page-description">Search and view product stock information</p>
        </div>
        <AddModal<StockRecord>
          title="New Stock Entry"
          description="Add a new stock inquiry record"
          fields={[
            {
              label: "PSC",
              name: "psc",
              type: "text",
              required: true,
              placeholder: "e.g. PSC-001",
            },
            {
              label: "AN No",
              name: "anNo",
              type: "text",
              required: true,
              placeholder: "e.g. AN-12345",
            },
            {
              label: "Barcode",
              name: "barcode",
              type: "text",
              required: true,
              placeholder: "13-digit barcode",
            },
            {
              label: "Description",
              name: "description",
              type: "text",
              required: true,
            },
            {
              label: "IG No",
              name: "igNo",
              type: "select",
              required: true,
              options: igNoOptions,
            },
            {
              label: "Brand",
              name: "brand",
              type: "select",
              required: true,
              options: brandOptions,
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
              } as StockRecord,
            });
          }}
          triggerLabel="New Entry"
          submitLabel="Add Record"
          size="lg"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          label="Total Products"
          value={state.records.length}
          contentType="products"
          variant="primary"
        />
        <StatCard
          label="Categories"
          value={new Set(state.records.map((r) => r.category)).size}
          contentType="categories"
          variant="success"
        />
        <StatCard
          label="Brands"
          value={new Set(state.records.map((r) => r.brand)).size}
          contentType="star"
          variant="warning"
        />
      </div>

      <DataTable
        data={state.records}
        columns={columns}
        searchPlaceholder="Search by PSC, barcode, description..."
        actions={renderActions}
        defaultPageSize={10}
      />
    </div>
  );
}
