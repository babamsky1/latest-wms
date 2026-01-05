import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { auditTrail } from '@/lib/AuditTrail';

export interface User {
  id: string;
  employeeId?: string;
  fullName: string;
  email: string;
  phone?: string;
  role: 'admin' | 'warehouse_manager' | 'operator' | 'viewer' | 'accountant';
  assignedWarehouseId?: string;
  status: 'active' | 'inactive' | 'suspended';
  lastLogin?: string;
  avatar?: string;
  permissions: string[];
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: User['role']) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration - replace with real authentication
const MOCK_USERS: Record<string, User> = {
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

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Check for stored authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem('wms_user');
        const storedToken = localStorage.getItem('wms_token');

        if (storedUser && storedToken) {
          const userData = JSON.parse(storedUser);
          setUser(userData);

          // Start audit session
          auditTrail.startSession(userData.id, userData.fullName);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('wms_user');
        localStorage.removeItem('wms_token');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Handle route protection
  useEffect(() => {
    if (!isLoading) {
      const publicRoutes = ['/', '/login'];
      const isPublicRoute = publicRoutes.includes(location.pathname);

      if (!user && !isPublicRoute) {
        // Redirect to login if not authenticated and not on public route
        navigate('/login', { replace: true });
      } else if (user && location.pathname === '/login') {
        // Redirect to dashboard if authenticated and on login page
        navigate('/dashboard', { replace: true });
      }
    }
  }, [user, isLoading, location.pathname, navigate]);

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);

    try {
      // Mock authentication - replace with real API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockUser = MOCK_USERS[email];
      if (!mockUser || password !== 'password') {
        throw new Error('Invalid credentials');
      }

      // Create session
      const token = `mock_token_${Date.now()}`;
      const userWithLogin = {
        ...mockUser,
        lastLogin: new Date().toISOString(),
      };

      // Store authentication
      localStorage.setItem('wms_user', JSON.stringify(userWithLogin));
      localStorage.setItem('wms_token', token);

      setUser(userWithLogin);

      // Start audit session
      auditTrail.startSession(userWithLogin.id, userWithLogin.fullName);

      // Navigate to intended destination or dashboard
      const intendedPath = location.state?.from?.pathname || '/dashboard';
      navigate(intendedPath, { replace: true });

    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // End audit session
    auditTrail.endSession();

    // Clear authentication
    localStorage.removeItem('wms_user');
    localStorage.removeItem('wms_token');

    setUser(null);
    navigate('/login', { replace: true });
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    if (user.permissions.includes('*')) return true;
    return user.permissions.includes(permission);
  };

  const hasRole = (role: User['role']): boolean => {
    return user?.role === role;
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    hasPermission,
    hasRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Custom router hook with auth integration
export const useRouter = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();

  const navigateTo = (path: string, options?: { replace?: boolean; state?: any }) => {
    if (!isAuthenticated && !['/', '/login'].includes(path)) {
      navigate('/login', {
        replace: true,
        state: { from: location }
      });
      return;
    }
    navigate(path, options);
  };

  const goBack = () => {
    navigate(-1);
  };

  const goHome = () => {
    navigate('/dashboard', { replace: true });
  };

  return {
    navigate: navigateTo,
    goBack,
    goHome,
    currentPath: location.pathname,
    searchParams: new URLSearchParams(location.search),
    location,
  };
};

// Route guard component
export const ProtectedRoute: React.FC<{
  children: ReactNode;
  requiredRole?: User['role'];
  requiredPermission?: string;
  fallback?: ReactNode;
}> = ({ children, requiredRole, requiredPermission, fallback }) => {
  const { user, hasRole, hasPermission, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        navigate('/login', { replace: true });
        return;
      }

      if (requiredRole && !hasRole(requiredRole)) {
        console.warn(`Access denied: Required role ${requiredRole}, user has ${user.role}`);
        if (fallback) return;
        navigate('/dashboard', { replace: true });
        return;
      }

      if (requiredPermission && !hasPermission(requiredPermission)) {
        console.warn(`Access denied: Required permission ${requiredPermission}`);
        if (fallback) return;
        navigate('/dashboard', { replace: true });
        return;
      }
    }
  }, [user, requiredRole, requiredPermission, hasRole, hasPermission, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) return null;

  if (requiredRole && !hasRole(requiredRole)) {
    return fallback || null;
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return fallback || null;
  }

  return <>{children}</>;
};
