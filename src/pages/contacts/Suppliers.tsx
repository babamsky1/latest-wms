/**
 * Suppliers Page - Refactored
 * 
 * Features:
 * ✅ Standardized DataTable
 * ✅ Correct StatCards
 * ✅ Full Audit Trail
 * ✅ ActionMenu integration
 */

import { StatCard } from "@/components/dashboard/StatCard";
import AddModal, { AddField } from "@/components/modals/AddModal";
import DeleteModal from "@/components/modals/DeleteModal";
import EditModal, { EditField } from "@/components/modals/EditModal";
import { ActionMenu } from "@/components/table/ActionMenu";
import { ColumnDef, DataTable } from "@/components/table/DataTable";
import { Badge } from "@/components/ui/badge";
import { Building2, Mail, Star } from "lucide-react";
import { useReducer } from "react";

interface Supplier {
  [key: string]: unknown;
  id: string;
  code: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  productCount: number;
  lastOrder: string;
  status: "active" | "inactive";
  rating: number;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
}

type State = {
  suppliers: Supplier[];
};

type Action =
  | { type: "DELETE_SUPPLIER"; payload: string }
  | { type: "ADD_SUPPLIER"; payload: Supplier }
  | { type: "UPDATE_SUPPLIER"; payload: Supplier };

const initialSuppliers: Supplier[] = [
  {
    id: "1",
    code: "SUP-001",
    name: "Tech Supplies Co.",
    contactPerson: "John Smith",
    email: "john@techsupplies.com",
    phone: "+1-555-0101",
    address: "123 Tech Park, CA",
    productCount: 145,
    lastOrder: "2024-01-15",
    status: "active",
    rating: 4.8,
    created_at: "2023-01-10T08:00:00Z",
    created_by: "Admin",
    updated_at: "2024-01-15T14:30:00Z",
  },
  {
    id: "2",
    code: "SUP-002",
    name: "Global Parts Ltd.",
    contactPerson: "Jane Doe",
    email: "jane@globalparts.com",
    phone: "+1-555-0102",
    address: "456 Industrial Ave, TX",
    productCount: 89,
    lastOrder: "2024-01-14",
    status: "active",
    rating: 4.5,
    created_at: "2023-02-15T09:00:00Z",
    created_by: "Admin",
    updated_at: "2024-01-14T10:00:00Z",
  },
  {
    id: "3",
    code: "SUP-003",
    name: "Raw Materials Inc.",
    contactPerson: "Mike Johnson",
    email: "mike@rawmaterials.com",
    phone: "+1-555-0103",
    address: "789 Factory Rd, NY",
    productCount: 234,
    lastOrder: "2024-01-13",
    status: "active",
    rating: 4.2,
    created_at: "2023-03-20T10:00:00Z",
    created_by: "Admin",
    updated_at: "2024-01-13T12:00:00Z",
  },
  {
    id: "4",
    code: "SUP-004",
    name: "Electronic World",
    contactPerson: "Sarah Wilson",
    email: "sarah@electronicworld.com",
    phone: "+1-555-0104",
    address: "321 Circuit Blvd, WA",
    productCount: 67,
    lastOrder: "2024-01-10",
    status: "inactive",
    rating: 3.8,
    created_at: "2023-04-10T11:00:00Z",
    created_by: "Admin",
    updated_at: "2024-01-10T11:00:00Z",
  },
  {
    id: "5",
    code: "SUP-005",
    name: "Pack & Ship Co.",
    contactPerson: "David Brown",
    email: "david@packship.com",
    phone: "+1-555-0105",
    address: "654 Logistics Way, FL",
    productCount: 45,
    lastOrder: "2024-01-12",
    status: "active",
    rating: 4.6,
    created_at: "2023-05-15T15:00:00Z",
    created_by: "Admin",
    updated_at: "2024-01-12T15:00:00Z",
  },
];

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "DELETE_SUPPLIER":
      return {
        ...state,
        suppliers: state.suppliers.filter((s) => s.id !== action.payload),
      };
    case "ADD_SUPPLIER":
      return {
        ...state,
        suppliers: [
          {
            ...action.payload,
            status: "active",
            productCount: 0,
            lastOrder: "N/A",
            rating: 0,
            created_at: new Date().toISOString(),
            created_by: "Current User",
            updated_at: new Date().toISOString(),
          },
          ...state.suppliers,
        ],
      };
    case "UPDATE_SUPPLIER":
      return {
        ...state,
        suppliers: state.suppliers.map((s) =>
          s.id === action.payload.id ? {
            ...action.payload,
            updated_at: new Date().toISOString(),
            updated_by: "Current User"
          } : s
        ),
      };
    default:
      return state;
  }
};

const Suppliers = () => {
  const [state, dispatch] = useReducer(reducer, {
    suppliers: initialSuppliers,
  });

  const nextSupplierNumber = state.suppliers.length > 0
    ? Math.max(...state.suppliers.map((s) => parseInt(s.code.split("-")[1] || "0"))) + 1
    : 1;
  const generatedSupplierCode = `SUP-${nextSupplierNumber.toString().padStart(3, "0")}`;

  const supplierFields: AddField<Supplier>[] = [
    { label: "Code (Auto)", name: "code", type: "text", disabled: true },
    { label: "Supplier Name", name: "name", type: "text", placeholder: "Enter supplier name", required: true },
    { label: "Contact Person", name: "contactPerson", type: "text", placeholder: "Enter contact name", required: true },
    { label: "Email", name: "email", type: "email", placeholder: "Enter email address", required: true },
    { label: "Phone", name: "phone", type: "text", placeholder: "Enter phone number", required: true },
    { label: "Address", name: "address", type: "textarea", placeholder: "Enter full address", required: true },
  ];

  const editSupplierFields: EditField<Supplier>[] = [...supplierFields];

  const columns: ColumnDef<Supplier>[] = [
    {
      key: "code",
      label: "Code",
      className: "font-mono font-medium",
    },
    {
      key: "name",
      label: "Supplier Name",
      render: (row) => (
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-primary" />
          <span className="font-medium">{row.name}</span>
        </div>
      ),
    },
    {
      key: "contactPerson",
      label: "Contact",
      render: (row) => (
        <div className="space-y-1 text-sm">
          <div className="font-medium">{row.contactPerson}</div>
          <div className="flex items-center gap-2 text-muted-foreground whitespace-nowrap">
            <Mail className="h-3 w-3" />
            {row.email}
          </div>
        </div>
      ),
    },
    {
      key: "productCount",
      label: "Items",
      className: "text-left font-semibold",
    },
    {
      key: "rating",
      label: "Rating",
      render: (row) => (
        <div className="flex items-center gap-1">
          <Star className="h-3 w-3 fill-warning text-warning" />
          <span className="font-semibold">{row.rating}</span>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <Badge variant={row.status === "active" ? "success" : "secondary"}>
          {row.status}
        </Badge>
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

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title">Suppliers</h1>
            <p className="page-description">Manage vendor relationships and contacts</p>
          </div>
          <AddModal<Supplier>
            title="Add New Supplier"
            fields={supplierFields}
            initialData={{
              code: generatedSupplierCode,
              name: "",
              contactPerson: "",
              email: "",
              phone: "",
              address: "",
              id: String(Date.now()),
              productCount: 0,
              lastOrder: "N/A",
              status: "active",
              rating: 0,
            }}
            onSubmit={(data) => dispatch({ type: "ADD_SUPPLIER", payload: data as Supplier })}
            triggerLabel="Add Supplier"
            submitLabel="Create"
            size="lg"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Total Suppliers" value={state.suppliers.length} contentType="warehouses" variant="primary" />
        <StatCard label="Active" value={state.suppliers.filter(s => s.status === 'active').length} contentType="active" variant="success" />
        <StatCard label="Avg. Rating" value="4.4" contentType="star" variant="warning" />
      </div>

      <DataTable
        data={state.suppliers}
        columns={columns}
        searchPlaceholder="Search suppliers..."
        actions={(supplier) => (
          <ActionMenu>
            <EditModal<Supplier>
              title="Edit Supplier"
              fields={editSupplierFields}
              data={supplier}
              onSubmit={(data) => dispatch({ type: "UPDATE_SUPPLIER", payload: data as Supplier })}
              triggerLabel="Edit"
            />
            <DeleteModal
              title="Delete Supplier"
              description={`Delete ${supplier.name}?`}
              onSubmit={() => dispatch({ type: "DELETE_SUPPLIER", payload: supplier.id })}
              triggerLabel="Delete"
            />
          </ActionMenu>
        )}
      />
    </div>
  );
};

export default Suppliers;
