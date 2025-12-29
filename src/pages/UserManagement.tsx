import { useReducer } from "react";
import { Users, Plus, Search, Edit, Trash2, MoreHorizontal, Shield, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface User {
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
  | { type: "DELETE_USER"; payload: string };

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
    default:
      return state;
  }
};

const UserManagement = () => {
  const [state, dispatch] = useReducer(reducer, {
    users: initialUsers,
    searchQuery: "",
  });

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
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </Button>
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
              <TableHead className="w-[80px]">Actions</TableHead>
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
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem><Edit className="h-4 w-4 mr-2" />Edit</DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => dispatch({ type: "DELETE_USER", payload: user.id })}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />Delete
                      </DropdownMenuItem>
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
