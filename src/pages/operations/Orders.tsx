/**
 * Orders Page - Complete Refactored Example
 * 
 * This serves as the REFERENCE IMPLEMENTATION for all other pages
 * 
 * Features Demonstrated:
 * ✅ DataTable with modern pagination
 * ✅ StatCard components with content-aware icons
 * ✅ ActionMenu for table actions
 * ✅ Full audit columns (created_by, updated_by, created_at, updated_at)
 * ✅ Complete Order schema with all WMS-required fields
 * ✅ Customer relationship (FK)
 * ✅ Workflow status tracking
 * ✅ Priority management
 * ✅ Financial tracking (total_amount, tax, discount)
 * ✅ Assignment tracking (assigned_to)
 * ✅ Detailed comments explaining each section
 */

import { StatCard } from "@/components/dashboard/StatCard";
import AddModal, { AddField } from "@/components/modals/AddModal";
import DeleteModal from "@/components/modals/DeleteModal";
import EditModal, { EditField } from "@/components/modals/EditModal";
import { ActionMenu } from "@/components/table/ActionMenu";
import { ColumnDef, DataTable } from "@/components/table/DataTable";
import { Badge } from "@/components/ui/badge";
import { Order } from "@/types/database";
import { useState } from "react";

/**
 * Extended Order interface for UI display
 * Comment: Includes joined data from related tables
 */
interface OrderDisplay extends Order {
  customer_name?: string; // From customers table
  warehouse_name?: string; // From warehouses table
  assigned_to_name?: string; // From users table
  created_by_name?: string; // From users table
  updated_by_name?: string; // From users table
  [key: string]: unknown; // Index signature to satisfy Record<string, unknown> constraint
}

export default function Orders() {
  /**
   * State Management
   * Comment: In production, replace with React Query or similar
   * to handle API calls, caching, and optimistic updates
   */
  const [orders, setOrders] = useState<OrderDisplay[]>([
    {
      id: 1,
      order_no: "ORD-2025-001",
      order_type: "sales",
      customer_id: 1,
      customer_name: "Acme Corporation",
      supplier_id: undefined,
      warehouse_id: 1,
      warehouse_name: "Main Warehouse",
      status: "processing",
      priority: "high",
      assigned_to: 2,
      assigned_to_name: "John Smith",
      order_date: "2025-01-15",
      expected_date: "2025-01-20",
      completed_at: undefined,
      total_amount: 15420.50,
      tax_amount: 1542.05,
      discount_amount: 500.00,
      shipping_cost: 150.00,
      notes: "Rush order - customer needs ASAP",
      created_at: "2025-01-15T09:00:00Z",
      updated_at: "2025-01-15T14:30:00Z",
      created_by: 1,
      created_by_name: "Admin User",
      updated_by: 2,
      updated_by_name: "John Smith",
    },
    {
      id: 2,
      order_no: "ORD-2025-002",
      order_type: "purchase",
      customer_id: undefined,
      supplier_id: 3,
      customer_name: undefined,
      warehouse_id: 1,
      warehouse_name: "Main Warehouse",
      status: "completed",
      priority: "normal",
      assigned_to: 3,
      assigned_to_name: "Jane Doe",
      order_date: "2025-01-14",
      expected_date: "2025-01-25",
      completed_at: "2025-01-16T10:00:00Z",
      total_amount: 8750.00,
      tax_amount: 875.00,
      discount_amount: 0,
      shipping_cost: 0,
      notes: undefined,
      created_at: "2025-01-14T08:00:00Z",
      updated_at: "2025-01-16T10:00:00Z",
      created_by: 1,
      created_by_name: "Admin User",
      updated_by: 3,
      updated_by_name: "Jane Doe",
    },
    // More orders...
  ]);

  /**
   * Column Definitions for DataTable
   * Comment: Includes ALL required WMS fields with audit columns
   */
  const columns: ColumnDef<OrderDisplay>[] = [
    {
      key: "order_no",
      label: "Order No.",
      className: "font-mono font-medium",
    },
    {
      key: "order_type",
      label: "Type",
      render: (row) => {
        const variants: Record<string, string> = {
          sales: "default",
          purchase: "secondary",
          transfer: "outline",
          return: "destructive",
        };
        return <Badge variant={variants[row.order_type] as any}>{row.order_type}</Badge>;
      },
    },
    {
      key: "customer_name",
      label: "Customer/Supplier",
      render: (row) => row.customer_name || row.supplier_id ? `Supplier #${row.supplier_id}` : "-",
    },
    {
      key: "warehouse_name",
      label: "Warehouse",
    },
    {
      key: "status",
      label: "Status",
      render: (row) => {
        // Comment: Color-coded status badges for quick visual scanning
        const variants: Record<string, any> = {
          draft: "secondary",
          pending: "outline",
          approved: "default",
          processing: "default",
          completed: "success",
          cancelled: "destructive",
        };
        return <Badge variant={variants[row.status]}>{row.status}</Badge>;
      },
    },
    {
      key: "priority",
      label: "Priority",
      render: (row) => {
        // Comment: Priority indicates urgency of order processing
        const variants: Record<string, any> = {
          low: "secondary",
          normal: "outline",
          high: "default",
          urgent: "destructive",
        };
        return <Badge variant={variants[row.priority]}>{row.priority}</Badge>;
      },
    },
    {
      key: "order_date",
      label: "Order Date",
      className: "text-sm",
      render: (row) => new Date(row.order_date).toLocaleDateString(),
    },
    {
      key: "expected_date",
      label: "Expected",
      className: "text-sm",
      render: (row) => row.expected_date ? new Date(row.expected_date).toLocaleDateString() : "-",
    },
    {
      key: "total_amount",
      label: "Total Amount",
      className: "text-left font-semibold",
      render: (row) => `$${row.total_amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
    },
    {
      key: "assigned_to_name",
      label: "Assigned To",
      className: "text-sm",
    },
    // Comment: AUDIT COLUMNS - Essential for traceability and compliance
    {
      key: "created_by_name",
      label: "Created By",
      className: "text-sm text-muted-foreground hidden 2xl:table-cell",
    },
    {
      key: "updated_by_name",
      label: "Updated By",
      className: "text-sm text-muted-foreground hidden xl:table-cell",
    },
    {
      key: "created_at",
      label: "Created",
      className: "text-sm text-muted-foreground hidden 2xl:table-cell",
      render: (row) => new Date(row.created_at).toLocaleDateString(),
    },
    {
      key: "updated_at",
      label: "Updated",
      className: "text-sm text-muted-foreground hidden xl:table-cell",
      render: (row) => new Date(row.updated_at).toLocaleDateString(),
    },
  ];

  /**
   * Form Fields for Add Modal
   * Comment: All required fields for order creation
   */
  const addOrderFields: AddField<OrderDisplay>[] = [
    {
      label: "Order Type",
      name: "order_type",
      type: "select",
      required: true,
      options: [
        { value: "sales", label: "Sales Order" },
        { value: "purchase", label: "Purchase Order" },
        { value: "transfer", label: "Transfer Order" },
        { value: "return", label: "Return Order" },
      ],
    },
    {
      label: "Customer",
      name: "customer_id",
      type: "select",
      required: false, // Only for sales orders
      options: [
        // Comment: Load from customers table in production
        { value: "1", label: "Acme Corporation" },
        { value: "2", label: "Tech Solutions LLC" },
      ],
    },
    {
      label: "Warehouse",
      name: "warehouse_id",
      type: "select",
      required: true,
      options: [
        // Comment: Load from warehouses table
        { value: "1", label: "Main Warehouse" },
        { value: "2", label: "Regional Hub" },
      ],
    },
    {
      label: "Priority",
      name: "priority",
      type: "select",
      required: true,
      options: [
        { value: "low", label: "Low" },
        { value: "normal", label: "Normal" },
        { value: "high", label: "High" },
        { value: "urgent", label: "Urgent" },
      ],
    },
    {
      label: "Order Date",
      name: "order_date",
      type: "text", // Use date picker in production
      required: true,
      placeholder: "YYYY-MM-DD",
    },
    {
      label: "Expected Date",
      name: "expected_date",
      type: "text",
      placeholder: "YYYY-MM-DD",
    },
    {
      label: "Assign To",
      name: "assigned_to",
      type: "select",
      options: [
        // Comment: Load from users table
        { value: "2", label: "John Smith" },
        { value: "3", label: "Jane Doe" },
      ],
    },
    {
      label: "Notes",
      name: "notes",
      type: "textarea",
      placeholder: "Additional order notes...",
    },
  ];

  /**
   * Form Fields for Edit Modal
   * Comment: Same as add fields plus status field
   */
  const editOrderFields: EditField<OrderDisplay>[] = [
    ...addOrderFields,
    {
      label: "Status",
      name: "status",
      type: "select",
      required: true,
      options: [
        { value: "draft", label: "Draft" },
        { value: "pending", label: "Pending" },
        { value: "approved", label: "Approved" },
        { value: "processing", label: "Processing" },
        { value: "completed", label: "Completed" },
        { value: "cancelled", label: "Cancelled" },
      ],
    },
  ];

  /**
   * Calculate Statistics
   * Comment: Real-time stats computed from current data
   * In production, these would come from summary API endpoints
   */
  const stats = {
    todayOrders: orders.filter(o => {
      const today = new Date().toISOString().split('T')[0];
      return o.order_date === today;
    }).length,
    pending: orders.filter(o => o.status === "pending" || o.status === "draft").length,
    processing: orders.filter(o => o.status === "processing" || o.status === "approved").length,
    completed: orders.filter(o => o.status === "completed").length,
    totalValue: orders
      .filter(o => o.status !== "cancelled")
      .reduce((sum, o) => sum + o.total_amount, 0),
  };

  /**
   * Handle Order Creation
   * Comment: Add audit fields automatically on creation
   */
  const handleCreateOrder = (data: Partial<OrderDisplay>) => {
    // Comment: Get current user from auth context in production
    const currentUserId = 1; // Placeholder
    const currentUserName = "Admin User"; // Placeholder

    const newOrder: OrderDisplay = {
      ...data as OrderDisplay,
      id: Date.now(), // Use UUID or DB-generated ID in production
      order_no: `ORD-${new Date().getFullYear()}-${String(orders.length + 1).padStart(3, "0")}`,
      status: "draft",
      total_amount: 0, // Calculate from order items
      tax_amount: 0,
      discount_amount: 0,
      shipping_cost: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_by: currentUserId,
      created_by_name: currentUserName,
      updated_by: currentUserId,
      updated_by_name: currentUserName,
    };

    setOrders([newOrder, ...orders]);
  };

  /**
   * Handle Order Update
   * Comment: Update audit fields on every modification
   */
  const handleUpdateOrder = (id: number, data: Partial<OrderDisplay>) => {
    const currentUserId = 1; // Get from auth context
    const currentUserName = "Admin User"; // Get from auth context

    setOrders(
      orders.map((order) =>
        order.id === id
          ? {
              ...order,
              ...data,
              updated_at: new Date().toISOString(),
              updated_by: currentUserId,
              updated_by_name: currentUserName,
            }
          : order
      )
    );
  };

  /**
   * Handle Order Deletion
   * Comment: In production, consider soft delete with deleted_at column
   * instead of permanent removal
   */
  const handleDeleteOrder = (id: number) => {
    setOrders(orders.filter((order) => order.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* ===== PAGE HEADER ===== */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Orders</h1>
          <p className="page-description">
            Manage sales orders, purchase orders, and transfers with complete audit trail
          </p>
        </div>
        <AddModal<OrderDisplay>
          title="Create New Order"
          description="Start a new order in the system"
          fields={addOrderFields}
          initialData={{} as OrderDisplay}
          onSubmit={handleCreateOrder}
          triggerLabel="New Order"
          submitLabel="Create Order"
          size="lg"
        />
      </div>

      {/* ===== STATISTICS GRID ===== */}
      {/* Comment: Using StatCard component for consistent design */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          label="Today's Orders"
          value={stats.todayOrders}
          change={{ value: 8, type: "increase" }}
          variant="primary"
          contentType="orders"
        />
        <StatCard
          label="Pending"
          value={stats.pending}
          variant="warning"
          contentType="pending"
        />
        <StatCard
          label="Processing"
          value={stats.processing}
          variant="default"
          contentType="clock"
        />
        <StatCard
          label="Completed"
          value={stats.completed}
          change={{ value: 15, type: "increase" }}
          variant="success"
          contentType="completed"
        />
        <StatCard
          label="Total Value"
          value={`$${stats.totalValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
          variant="default"
          contentType="value"
        />
      </div>

      {/* ===== DATA TABLE ===== */}
      {/* Comment: Modern DataTable with built-in pagination, sorting, and search */}
      <DataTable
        data={orders}
        columns={columns}
        searchPlaceholder="Search orders by number, customer, or warehouse..."
        actions={(row) => (
          <ActionMenu>
            {/* Edit Action */}
            <EditModal<OrderDisplay>
              title="Edit Order"
              description={`Update order ${row.order_no}`}
              fields={editOrderFields}
              data={row}
              onSubmit={(data) => handleUpdateOrder(row.id, data)}
              triggerLabel="Edit"
              submitLabel="Update Order"
              size="lg"
            />
            
            {/* Delete Action */}
            <DeleteModal
              title="Delete Order"
              description={`Are you sure you want to delete order ${row.order_no}? This action cannot be undone.`}
              onSubmit={() => handleDeleteOrder(row.id)}
              triggerLabel="Delete"
            />
          </ActionMenu>
        )}
        defaultPageSize={10}
      />
    </div>
  );
}
