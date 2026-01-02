/**
 * Categories Page - Refactored
 * 
 * Features:
 * ✅ Standardized StatCards
 * ✅ DataTable with fixed pagination
 * ✅ Complete Category schema with audit columns
 * ✅ ActionMenu for operations
 */

import { StatCard } from "@/components/dashboard/StatCard";
import AddModal, { AddField } from "@/components/modals/AddModal";
import DeleteModal from "@/components/modals/DeleteModal";
import EditModal, { EditField } from "@/components/modals/EditModal";
import { ActionMenu } from "@/components/table/ActionMenu";
import { ColumnDef, DataTable } from "@/components/table/DataTable";
import { Badge } from "@/components/ui/badge";
import { Category } from "@/types/database";
import { Folder, FolderTree } from "lucide-react";
import { useState } from "react";

/**
 * Extended Category interface for UI display
 */
interface CategoryDisplay extends Category {
  product_count?: number; // Calculated/joined field
  parent_name?: string; // Joined field
  created_by_name?: string;
  updated_by_name?: string;
  [key: string]: unknown;
}

export default function Categories() {
  const [categories, setCategories] = useState<CategoryDisplay[]>([
    {
      id: 1,
      name: "Electronics",
      description: "Electronic devices and gadgets",
      status: "active",
      product_count: 245,
      created_by: 1,
      created_by_name: "Admin User",
      updated_by: 1,
      updated_by_name: "Admin User",
      created_at: "2024-01-10T08:00:00Z",
      updated_at: "2024-01-10T08:00:00Z",
      created_by_id: 1,
      updated_by_id: 1,
    },
    {
      id: 2,
      name: "Smartphones",
      description: "Mobile phones and accessories",
      parent_id: 1,
      parent_name: "Electronics",
      status: "active",
      product_count: 89,
      created_by: 1,
      created_by_name: "Admin User",
      updated_by: 1,
      updated_by_name: "Admin User",
      created_at: "2024-01-10T09:00:00Z",
      updated_at: "2024-01-10T09:00:00Z",
      created_by_id: 1,
      updated_by_id: 1,
    },
    {
      id: 3,
      name: "Laptops",
      description: "Portable computers",
      parent_id: 1,
      parent_name: "Electronics",
      status: "active",
      product_count: 56,
      created_by: 2,
      created_by_name: "John Does",
      updated_by: 2,
      updated_by_name: "John Doe",
      created_at: "2024-01-11T10:30:00Z",
      updated_at: "2024-01-11T10:30:00Z",
      created_by_id: 2,
      updated_by_id: 2,
    },
    {
      id: 4,
      name: "Raw Materials",
      description: "Basic materials for production",
      status: "active",
      product_count: 312,
      created_by: 1,
      created_by_name: "Admin User",
      updated_by: 1,
      updated_by_name: "Admin User",
      created_at: "2024-01-08T14:20:00Z",
      updated_at: "2024-01-08T14:20:00Z",
      created_by_id: 1,
      updated_by_id: 1,
    },
    {
      id: 5,
      name: "Packaging",
      description: "Boxes, tape, and packing materials",
      status: "active",
      product_count: 78,
      created_by: 3,
      created_by_name: "Jane Smith",
      updated_by: 3,
      updated_by_name: "Jane Smith",
      created_at: "2024-01-09T11:45:00Z",
      updated_at: "2024-01-09T11:45:00Z",
      created_by_id: 3,
      updated_by_id: 3,
    },
    {
      id: 6,
      name: "Obsolete Items",
      description: "Items no longer in use",
      status: "inactive",
      product_count: 23,
      created_by: 1,
      created_by_name: "Admin User",
      updated_by: 1,
      updated_by_name: "Admin User",
      created_at: "2024-01-05T09:10:00Z",
      updated_at: "2024-01-25T16:00:00Z",
      created_by_id: 1,
      updated_by_id: 1,
    }
  ]);

  const columns: ColumnDef<CategoryDisplay>[] = [
    { 
      key: "name", 
      label: "Category Name",
      className: "font-medium",
      render: (row) => (
        <div className="flex items-center gap-2">
          {row.parent_id ? <Folder className="h-4 w-4 text-muted-foreground" /> : <FolderTree className="h-4 w-4 text-primary" />}
          <span>{row.name}</span>
        </div>
      )
    },
    { key: "description", label: "Description", className: "hidden md:table-cell text-muted-foreground" },
    { 
      key: "parent_name", 
      label: "Parent Category",
      render: (row) => row.parent_name || "-"
    },
    { 
      key: "product_count", 
      label: "Products",
      className: "text-center",
      render: (row) => <Badge variant="secondary" className="rounded-full px-2">{row.product_count}</Badge>
    },
    {
      key: "status",
      label: "Status",
      render: (row) => {
        const variants: Record<string, string> = {
          active: "default",
          inactive: "secondary",
        };
        return <Badge variant={variants[row.status] as any}>{row.status}</Badge>;
      },
    },
    {
      key: "created_by_name",
      label: "Created By",
      className: "text-sm text-muted-foreground hidden xl:table-cell",
    },
    {
      key: "created_at",
      label: "Created At",
      className: "text-sm text-muted-foreground hidden xl:table-cell",
      render: (row) => new Date(row.created_at).toLocaleDateString(),
    },
    {
      key: "updated_by_name",
      label: "Updated By",
      className: "text-sm text-muted-foreground hidden xl:table-cell",
    },
    {
      key: "updated_at",
      label: "Last Updated",
      className: "text-sm text-muted-foreground hidden lg:table-cell",
      render: (row) => new Date(row.updated_at).toLocaleDateString(),
    },
  ];

  const addFields: AddField<CategoryDisplay>[] = [
    { label: "Category Name", name: "name", type: "text", required: true },
    { label: "Description", name: "description", type: "textarea" },
    { label: "Parent Category", name: "parent_id", type: "select", options: [
      { value: "1", label: "Electronics" },
      { value: "4", label: "Raw Materials" },
    ]},
    { label: "Status", name: "status", type: "select", options: [
      { value: "active", label: "Active" },
      { value: "inactive", label: "Inactive" },
    ]},
  ];

  const editFields: EditField<CategoryDisplay>[] = [...addFields];

  // Actions
  const handleAdd = (data: Partial<CategoryDisplay>) => {
    const newCategory: CategoryDisplay = {
      ...data as CategoryDisplay,
      id: Date.now(),
      product_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_by: 1,
      created_by_name: "Admin User",
      updated_by: 1,
      updated_by_name: "Admin User",
    };
    setCategories([newCategory, ...categories]);
  };

  const handleUpdate = (id: number, data: Partial<CategoryDisplay>) => {
    setCategories(categories.map(c => c.id === id ? { ...c, ...data, updated_at: new Date().toISOString() } : c));
  };

  const handleDelete = (id: number) => {
    setCategories(categories.filter(c => c.id !== id));
  };

  // Stats
  const stats = {
    total: categories.length,
    active: categories.filter(c => c.status === "active").length,
    subCategories: categories.filter(c => c.parent_id).length,
    parentCategories: categories.filter(c => !c.parent_id).length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Categories</h1>
          <p className="page-description">Organize products into hierarchical categories</p>
        </div>
        <AddModal<CategoryDisplay>
          title="Add New Category"
          description="Create a new product category"
          fields={addFields}
          initialData={{} as CategoryDisplay}
          onSubmit={handleAdd}
          triggerLabel="Add Category"
          submitLabel="Create Category"
          size="lg"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Categories"
          value={stats.total}
          contentType="categories"
          variant="primary"
          // change={{ value: 4, type: "increase" }}
        />
        <StatCard
          label="Active Categories"
          value={stats.active}
          contentType="active"
          variant="success"
        />
        <StatCard
          label="Top Level"
          value={stats.parentCategories}
          contentType="parent-category"
          variant="default"
        />
        <StatCard
          label="Sub-Categories"
          value={stats.subCategories}
          contentType="sub-category"
          variant="warning"
        />
      </div>

      {/* DataTable */}
      <DataTable
        data={categories}
        columns={columns}
        searchPlaceholder="Search categories..."
        defaultPageSize={10}
        actions={(row) => (
          <ActionMenu>
            <EditModal<CategoryDisplay>
              title="Edit Category"
              description={`Update ${row.name}`}
              fields={editFields}
              data={row}
              onSubmit={(data) => handleUpdate(row.id, data)}
              triggerLabel="Edit"
              submitLabel="Save Changes"
            />
            <DeleteModal
              title="Delete Category"
              description={`Are you sure you want to delete ${row.name}?`}
              onSubmit={() => handleDelete(row.id)}
              triggerLabel="Delete"
            />
          </ActionMenu>
        )}
      />
    </div>
  );
}
