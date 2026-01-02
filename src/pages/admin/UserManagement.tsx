import { StatCard } from "@/components/dashboard/StatCard";
import AddModal, { AddField } from "@/components/modals/AddModal";
import DeleteModal from "@/components/modals/DeleteModal";
import EditModal, { EditField } from "@/components/modals/EditModal";
import { ActionMenu } from "@/components/table/ActionMenu";
import { ColumnDef, DataTable } from "@/components/table/DataTable";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Mail, Shield, Users } from "lucide-react";
import { useReducer } from "react";

interface User {
  [key: string]: unknown;
  id: string;
  name: string;
  email: string;
  role: "admin" | "manager" | "staff" | "viewer";
  department: string;
  status: "active" | "inactive" | "pending";
  lastLogin: string;
  createdAt: string;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
}

type State = {
  users: User[];
  searchQuery: string;
};

type Action =
  | { type: "SET_SEARCH"; payload: string }
  | { type: "DELETE_USER"; payload: string }
  | { type: "ADD_USER"; payload: User }
  | { type: "UPDATE_USER"; payload: User };

const initialUsers: User[] = [
  { id: "1", name: "John Smith", email: "john.smith@company.com", role: "admin", department: "IT", status: "active", lastLogin: "2024-01-15 14:30", createdAt: "2023-06-01", created_by: "Admin", created_at: "2023-06-01T08:00:00Z", updated_at: "2024-01-15T14:30:00Z" },
  { id: "2", name: "Jane Doe", email: "jane.doe@company.com", role: "manager", department: "Operations", status: "active", lastLogin: "2024-01-15 12:15", createdAt: "2023-07-15", created_by: "Admin", created_at: "2023-07-15T09:00:00Z", updated_at: "2024-01-15T12:15:00Z" },
  { id: "3", name: "Mike Johnson", email: "mike.johnson@company.com", role: "staff", department: "Warehouse", status: "active", lastLogin: "2024-01-15 10:00", createdAt: "2023-08-20", created_by: "Jane Doe", created_at: "2023-08-20T10:00:00Z", updated_at: "2024-01-15T10:00:00Z" },
  { id: "4", name: "Sarah Wilson", email: "sarah.wilson@company.com", role: "staff", department: "Warehouse", status: "active", lastLogin: "2024-01-14 16:45", createdAt: "2023-09-10", created_by: "Jane Doe", created_at: "2023-09-10T11:00:00Z", updated_at: "2024-01-14T16:45:00Z" },
  { id: "5", name: "David Brown", email: "david.brown@company.com", role: "viewer", department: "Finance", status: "inactive", lastLogin: "2024-01-10 09:30", createdAt: "2023-10-05", created_by: "Admin", created_at: "2023-10-05T09:30:00Z", updated_at: "2024-01-10T09:30:00Z" },
  { id: "6", name: "Emily Davis", email: "emily.davis@company.com", role: "staff", department: "Receiving", status: "pending", lastLogin: "-", createdAt: "2024-01-15", created_by: "Jane Doe", created_at: "2024-01-15T08:00:00Z", updated_at: "2024-01-15T08:00:00Z" },
];

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_SEARCH":
      return { ...state, searchQuery: action.payload };
    case "DELETE_USER":
      return { ...state, users: state.users.filter((u) => u.id !== action.payload) };
    case "ADD_USER":
      return {
        ...state,
        users: [
          { 
            ...action.payload, 
            status: "pending", 
            lastLogin: "-", 
            createdAt: new Date().toISOString().split('T')[0],
            created_at: new Date().toISOString(),
            created_by: "Current Admin",
            updated_at: new Date().toISOString()
          },
          ...state.users,
        ],
      };
    case "UPDATE_USER":
      return {
        ...state,
        users: state.users.map((u) => u.id === action.payload.id ? {
          ...action.payload,
          updated_at: new Date().toISOString(),
          updated_by: "Current Admin"
        } : u),
      };
    default:
      return state;
  }
};

const UserManagement = () => {
  const [state, dispatch] = useReducer(reducer, {
    users: initialUsers,
    searchQuery: "",
  });

  // Form fields configuration
  const userFields: AddField<User>[] = [
    { label: "Name", name: "name", type: "text", placeholder: "Enter full name", required: true },
    { label: "Email", name: "email", type: "email", placeholder: "Enter email address", required: true },
    { 
      label: "Role", 
      name: "role", 
      type: "select", 
      required: true,
      options: [
        { value: "admin", label: "Admin" },
        { value: "manager", label: "Manager" },
        { value: "staff", label: "Staff" },
        { value: "viewer", label: "Viewer" }
      ]
    },
    { 
      label: "Department", 
      name: "department", 
      type: "select", 
      required: true,
      options: [
        { value: "IT", label: "IT" },
        { value: "Operations", label: "Operations" },
        { value: "Warehouse", label: "Warehouse" },
        { value: "Finance", label: "Finance" },
        { value: "Receiving", label: "Receiving" },
        { value: "Shipping", label: "Shipping" }
      ]
    },
  ];

  const editUserFields: EditField<User>[] = [
    { label: "Name", name: "name", type: "text", placeholder: "Enter full name", required: true },
    { label: "Email", name: "email", type: "email", placeholder: "Enter email address", required: true },
    { 
      label: "Role", 
      name: "role", 
      type: "select", 
      required: true,
      options: [
        { value: "admin", label: "Admin" },
        { value: "manager", label: "Manager" },
        { value: "staff", label: "Staff" },
        { value: "viewer", label: "Viewer" }
      ]
    },
    { 
      label: "Department", 
      name: "department", 
      type: "select", 
      required: true,
      options: [
        { value: "IT", label: "IT" },
        { value: "Operations", label: "Operations" },
        { value: "Warehouse", label: "Warehouse" },
        { value: "Finance", label: "Finance" },
        { value: "Receiving", label: "Receiving" },
        { value: "Shipping", label: "Shipping" }
      ]
    },
    { 
      label: "Status", 
      name: "status", 
      type: "select", 
      required: true,
      options: [
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
        { value: "pending", label: "Pending" }
      ]
    },
  ];

  const getRoleBadge = (role: User["role"]) => {
    const colors = {
      admin: "bg-destructive/10 text-destructive",
      manager: "bg-primary/10 text-primary",
      staff: "bg-success/10 text-success",
      viewer: "bg-muted text-muted-foreground",
    };
    return (
      <Badge variant="outline" className={colors[role]}>
        <Shield className="h-3 w-3 mr-1" />
        {role}
      </Badge>
    );
  };

  const getStatusBadge = (status: User["status"]) => {
    const config = {
      active: "status-active",
      inactive: "status-inactive",
      pending: "status-warning",
    };
    return <span className={`status-badge ${config[status]}`}>{status}</span>;
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const columns: ColumnDef<User>[] = [
    {
      key: "name",
      label: "User",
      render: (row) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-primary/10 text-primary text-sm">
              {getInitials(row.name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{row.name}</p>
            <p className="text-sm text-muted-foreground">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      label: "Role",
      render: (row) => getRoleBadge(row.role),
    },
    {
      key: "department",
      label: "Department",
    },
    {
      key: "status",
      label: "Status",
      render: (row) => getStatusBadge(row.status),
    },
    {
      key: "lastLogin",
      label: "Last Login",
      className: "text-muted-foreground text-sm",
    },
    {
      key: "createdAt",
      label: "Member Since",
      className: "text-muted-foreground text-sm",
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
            <h1 className="page-title">User Management</h1>
            <p className="page-description">Manage user accounts and permissions</p>
          </div>
          <AddModal<User>
            title="Add New User"
            description="Create a new user account and assign their role"
            fields={userFields}
            initialData={{
              id: String(Date.now()),
              name: "",
              email: "",
              role: "staff",
              department: "Warehouse",
              status: "pending",
              lastLogin: "-",
              createdAt: new Date().toISOString().split('T')[0],
            }}
            onSubmit={(data) => dispatch({ type: "ADD_USER", payload: data as User })}
            triggerLabel="Add User"
            submitLabel="Create User"
            size="lg"
          />
        </div>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          label="Total Users"
          value={state.users.length}
          icon={Users}
          variant="primary"
        />
        <StatCard
          label="Active"
          value={state.users.filter((u) => u.status === "active").length}
          icon={Users}
          variant="success"
        />
        <StatCard
          label="Admins"
          value={state.users.filter((u) => u.role === "admin").length}
          icon={Shield}
          variant="destructive"
        />
        <StatCard
          label="Pending"
          value={state.users.filter((u) => u.status === "pending").length}
          icon={Mail}
          variant="warning"
        />
      </div>


      <DataTable
        data={state.users}
        columns={columns}
        searchPlaceholder="Search users by name or email..."
        actions={(user) => (
          <ActionMenu>
            <EditModal<User>
              title="Edit User"
              description="Update user information"
              fields={editUserFields}
              data={user}
              onSubmit={(data) =>
                dispatch({
                  type: "UPDATE_USER",
                  payload: data as User,
                })
              }
              triggerLabel="Edit"
              submitLabel="Update User"
              size="lg"
            />
            <DeleteModal
              title="Delete User"
              description={`Are you sure you want to delete the user "${user.name}"? This action cannot be undone.`}
              onSubmit={() =>
                dispatch({
                  type: "DELETE_USER",
                  payload: user.id,
                })
              }
              triggerLabel="Delete"
            />
          </ActionMenu>
        )}
      />
    </div>
  );
};

export default UserManagement;
