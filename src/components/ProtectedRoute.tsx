import React, { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { User } from '@/lib/auth';

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

      if (requiredRole && !hasRole(requiredRole) && user.role !== 'superadmin') {
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
  }, [user, requiredRole, requiredPermission, hasRole, hasPermission, isLoading, navigate, fallback]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) return null;

  if (requiredRole && !hasRole(requiredRole) && user.role !== 'superadmin') {
    return fallback || null;
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return fallback || null;
  }

  return <>{children}</>;
};

