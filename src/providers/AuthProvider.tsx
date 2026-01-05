import { AuthContext } from '@/context/AuthContext';
import { auditTrail } from '@/lib/AuditTrail';
import { AuthContextType, MOCK_USERS, User } from '@/lib/auth';
import React, { ReactNode, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

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


