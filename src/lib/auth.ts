export interface User {
  id: string;
  employeeId?: string;
  fullName: string;
  email: string;
  phone?: string;
  role: 'superadmin' | 'admin' | 'warehouse_manager' | 'operator' | 'viewer' | 'accountant';
  assignedWarehouseId?: string;
  status: 'active' | 'inactive' | 'suspended';
  lastLogin?: string;
  avatar?: string;
  permissions: string[];
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: User['role']) => boolean;
}

// Mock users for demonstration - replace with real authentication
export const MOCK_USERS: Record<string, User> = {
  'superadmin@wms.com': {
    id: '0',
    employeeId: 'SUP001',
    fullName: 'Super Administrator',
    email: 'superadmin@wms.com',
    phone: '+1234567890',
    role: 'superadmin',
    status: 'active',
    permissions: ['*'], // All permissions including sales
  },
  'admin@wms.com': {
    id: '1',
    employeeId: 'EMP001',
    fullName: 'System Administrator',
    email: 'admin@wms.com',
    phone: '+1234567890',
    role: 'admin',
    status: 'active',
    permissions: ['*'], // All permissions
  },
  'manager@wms.com': {
    id: '2',
    employeeId: 'EMP002',
    fullName: 'Warehouse Manager',
    email: 'manager@wms.com',
    role: 'warehouse_manager',
    assignedWarehouseId: 'WH-MAIN',
    status: 'active',
    permissions: ['read:*', 'write:inventory', 'write:orders', 'approve:transfers'],
  },
  'operator@wms.com': {
    id: '3',
    employeeId: 'EMP003',
    fullName: 'Warehouse Operator',
    email: 'operator@wms.com',
    role: 'operator',
    assignedWarehouseId: 'WH-MAIN',
    status: 'active',
    permissions: ['read:inventory', 'write:orders', 'write:assignments'],
  },
};

