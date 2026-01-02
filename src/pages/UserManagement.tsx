import AddModal, { AddField } from "@/components/modals/AddModal";
import DeleteModal from "@/components/modals/DeleteModal";
import EditModal, { EditField } from "@/components/modals/EditModal";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Mail, MoreHorizontal, Search, Shield, Users } from "lucide-react";
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
  { id: "1", name: "John Smith", email: "john.smith@company.com", role: "admin", department: "IT", status: "active", lastLogin: "2024-01-15 14:30", createdAt: "2023-06-01" },
  { id: "2", name: "Jane Doe", email: "jane.doe@company.com", role: "manager", department: "Operations", status: "active", lastLogin: "2024-01-15 12:15", createdAt: "2023-07-15" },
  { id: "3", name: "Mike Johnson", email: "mike.johnson@company.com", role: "staff", department: "Warehouse", status: "active", lastLogin: "2024-01-15 10:00", createdAt: "2023-08-20" },
  { id: "4", name: "Sarah Wilson", email: "sarah.wilson@company.com", role: "staff", department: "Warehouse", status: "active", lastLogin: "2024-01-14 16:45", createdAt: "2023-09-10" },
  { id: "5", name: "David Brown", email: "david.brown@company.com", role: "viewer", department: "Finance", status: "inactive", lastLogin: "2024-01-10 09:30", createdAt: "2023-10-05" },
  { id: "6", name: "Emily Davis", email: "emily.davis@company.com", role: "staff", department: "Receiving", status: "pending", lastLogin: "-", createdAt: "2024-01-15" },
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
          { ...action.payload, status: "pending", lastLogin: "-", createdAt: new Date().toISOString().split('T')[0] },
          ...state.users,
        ],
      };
    case "UPDATE_USER":
      return {
        ...state,
        users: state.users.map((u) => u.id === action.payload.id ? action.payload : u),
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

  const filteredUsers = state.users.filter(
    (u) =>
      u.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(state.searchQuery.toLowerCase())
  );

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
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="stat-label">Total Users</p>
              <p className="stat-value">{state.users.length}</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success/10">
              <Users className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="stat-label">Active</p>
              <p className="stat-value">{state.users.filter((u) => u.status === "active").length}</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-destructive/10">
              <Shield className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="stat-label">Admins</p>
              <p className="stat-value">{state.users.filter((u) => u.role === "admin").length}</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-warning/10">
              <Mail className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="stat-label">Pending</p>
              <p className="stat-value">{state.users.filter((u) => u.status === "pending").length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="content-section">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={state.searchQuery}
              onChange={(e) => dispatch({ type: "SET_SEARCH", payload: e.target.value })}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      <div className="table-container">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id} className="hover:bg-muted/30">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-primary/10 text-primary text-sm">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{getRoleBadge(user.role)}</TableCell>
                <TableCell>{user.department}</TableCell>
                <TableCell>{getStatusBadge(user.status)}</TableCell>
                <TableCell className="text-muted-foreground text-sm">{user.lastLogin}</TableCell>
                <TableCell className="text-muted-foreground text-sm">{user.createdAt}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="p-2">
                      <div className="flex flex-col gap-2 w-full">
                        {/* Edit Button */}
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
                          triggerSize="default"
                          submitLabel="Update User"
                          size="lg"
                        />

                        {/* Delete Button */}
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
                          triggerSize="default"
                        />
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default UserManagement;
