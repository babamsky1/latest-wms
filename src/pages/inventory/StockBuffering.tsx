/**
 * Stock Buffering Page - Refactored
 * 
 * Features:
 * ✅ Standardized StatCards
 * ✅ DataTable with ActionMenu
 * ✅ Status badges with correct variants
 * ✅ Buffer management
 */

import { StatCard } from "@/components/dashboard/StatCard";
import AddModal from "@/components/modals/AddModal";
import DeleteModal from "@/components/modals/DeleteModal";
import EditModal, { EditField } from "@/components/modals/EditModal";
import { ActionMenu } from "@/components/table/ActionMenu";
import { ColumnDef, DataTable } from "@/components/table/DataTable";
import { Badge } from "@/components/ui/badge";
import { useReducer } from "react";

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
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
  [key: string]: unknown;
}

type State = { records: BufferRecord[] };
type Action =
  | { type: "DELETE_RECORD"; payload: string }
  | { type: "ADD_RECORD"; payload: BufferRecord }
  | { type: "UPDATE_RECORD"; payload: BufferRecord };

const brandOptions = [
  { value: "acme", label: "Acme" },
  { value: "globex", label: "Globex" },
  { value: "initech", label: "Initech" },
];
const categoryOptions = [
  { value: "electronics", label: "Electronics" },
  { value: "furniture", label: "Furniture" },
  { value: "clothing", label: "Clothing" },
];
const groupOptions = [
  { value: "group_a", label: "Group A" },
  { value: "group_b", label: "Group B" },
];
const subCategoryOptions = [
  { value: "sub_1", label: "Sub-Category 1" },
  { value: "sub_2", label: "Sub-Category 2" },
];
const productTypeOptions = [
  { value: "finished", label: "Finished Goods" },
  { value: "raw", label: "Raw Materials" },
  { value: "component", label: "Components" },
];
const uomOptions = [
  { value: "pcs", label: "Pieces" },
  { value: "kg", label: "Kilograms" },
  { value: "box", label: "Box" },
];
const statusOptions = [
  { value: "critical", label: "Critical" },
  { value: "low", label: "Low" },
  { value: "adequate", label: "Adequate" },
  { value: "overstocked", label: "Overstocked" },
];

const initialRecords: BufferRecord[] = [
  {
    id: "1",
    psc: "PSC-001",
    shortDescription: "Widget A",
    longDescription: "Widget A Premium Model for industrial use",
    invoiceDescription: "Widget A - Premium",
    picklistCode: "PL-001",
    barcode: "1234567890123",
    productType: "finished",
    igDescription: "IG001 - General",
    subId: "SUB-01",
    brand: "acme",
    group: "group_a",
    subCategory: "sub_1",
    category: "electronics",
    unitOfMeasure: "pcs",
    currentStock: 15,
    reorderLevel: 50,
    status: "critical",
    created_at: "2024-01-01T08:00:00Z",
    created_by: "Admin",
    updated_at: "2024-01-10T11:00:00Z",
  },
  {
    id: "2",
    psc: "PSC-002",
    shortDescription: "Widget B",
    longDescription: "Widget B Standard Model",
    invoiceDescription: "Widget B - Std",
    picklistCode: "PL-002",
    barcode: "1234567890124",
    productType: "component",
    igDescription: "IG002 - Electronics",
    subId: "SUB-02",
    brand: "globex",
    group: "group_b",
    subCategory: "sub_2",
    category: "electronics",
    unitOfMeasure: "box",
    currentStock: 200,
    reorderLevel: 100,
    status: "adequate",
    created_at: "2024-01-01T08:00:00Z",
    created_by: "Admin",
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

export default function StockBuffering() {
  const [state, dispatch] = useReducer(reducer, { records: initialRecords });

  const editFields: EditField<BufferRecord>[] = [
    { label: "PSC", name: "psc", type: "text", disabled: true },
    {
      label: "Short Description",
      name: "shortDescription",
      type: "text",
      required: true,
    },
    {
      label: "Long Description",
      name: "longDescription",
      type: "textarea",
      required: false,
    },
    {
      label: "Invoice Description",
      name: "invoiceDescription",
      type: "text",
      required: false,
    },
    {
      label: "Picklist Code",
      name: "picklistCode",
      type: "text",
      required: true,
    },
    { label: "Barcode", name: "barcode", type: "text", required: true },
    {
      label: "Product Type",
      name: "productType",
      type: "select",
      required: true,
      options: productTypeOptions,
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
    {
      label: "Unit of Measure",
      name: "unitOfMeasure",
      type: "select",
      required: true,
      options: uomOptions,
    },
    {
      label: "Current Stock",
      name: "currentStock",
      type: "number",
      required: true,
    },
    {
      label: "Reorder Level",
      name: "reorderLevel",
      type: "number",
      required: true,
    },
    {
      label: "Status",
      name: "status",
      type: "select",
      required: true,
      options: statusOptions,
    },
  ];

  const columns: ColumnDef<BufferRecord>[] = [
    {
      key: "psc",
      label: "PSC",
      className: "font-mono font-medium",
    },
    {
      key: "shortDescription",
      label: "Description",
    },
    {
      key: "productType",
      label: "Type",
      render: (row) => {
        const label = productTypeOptions.find((p) => p.value === row.productType)?.label || row.productType;
        return <Badge variant="outline">{label}</Badge>;
      }
    },
    {
      key: "brand",
      label: "Brand",
      render: (row) => brandOptions.find((b) => b.value === row.brand)?.label || row.brand,
    },
    {
      key: "category",
      label: "Category",
      render: (row) => categoryOptions.find((c) => c.value === row.category)?.label || row.category,
    },
    {
      key: "unitOfMeasure",
      label: "UoM",
      render: (row) => uomOptions.find((u) => u.value === row.unitOfMeasure)?.label || row.unitOfMeasure,
    },
    {
      key: "currentStock",
      label: "Stock",
      className: "text-left font-semibold",
      render: (row) => row.currentStock.toLocaleString(),
    },
    {
      key: "reorderLevel",
      label: "Reorder Lvl",
      className: "text-left text-muted-foreground",
    },
    {
      key: "status",
      label: "Status",
      render: (row) => {
        const variants: Record<string, any> = {
          critical: "destructive",
          low: "warning",
          adequate: "success",
          overstocked: "info",
        };
        const statusLabel = row.status.charAt(0).toUpperCase() + row.status.slice(1);
        return <Badge variant={variants[row.status]}>{statusLabel}</Badge>;
      },
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

  const renderActions = (record: BufferRecord) => (
    <ActionMenu>
      <EditModal<BufferRecord>
        title="Edit Buffer"
        description="Update buffer details"
        fields={editFields}
        data={record}
        onSubmit={(data) =>
          dispatch({ type: "UPDATE_RECORD", payload: data as BufferRecord })
        }
        triggerLabel="Edit"
        submitLabel="Update Buffer"
      />
      <DeleteModal
        title="Delete Buffer"
        description={`Are you sure you want to delete the buffer "${record.shortDescription}"? This action cannot be undone.`}
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
          <h1 className="page-title">Stock Buffering</h1>
          <p className="page-description">Monitor buffer levels and reorder points</p>
        </div>
        <AddModal<BufferRecord>
          title="New Buffer Entry"
          fields={editFields.filter((f) => !f.disabled)}
          onSubmit={(data) =>
            dispatch({
              type: "ADD_RECORD",
              payload: { ...data, id: Date.now().toString() } as BufferRecord,
            })
          }
          triggerLabel="New Buffer"
          submitLabel="Add Buffer"
          size="lg"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          label="Critical"
          value={state.records.filter((r) => r.status === "critical").length}
          contentType="alert"
          variant="destructive"
        />
        <StatCard
          label="Low Stock"
          value={state.records.filter((r) => r.status === "low").length}
          contentType="low-stock"
          variant="warning"
        />
        <StatCard
          label="Adequate"
          value={state.records.filter((r) => r.status === "adequate").length}
          contentType="check"
          variant="success"
        />
      </div>

      <DataTable
        data={state.records}
        columns={columns}
        searchPlaceholder="Search by PSC, description, barcode..."
        actions={renderActions}
        defaultPageSize={10}
      />
    </div>
  );
}
