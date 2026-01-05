import { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '@/context/AuthContext';
import { AuthContextType, User } from '@/lib/auth';

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

  const navigateTo = (path: string, options?: { replace?: boolean; state?: Record<string, unknown> }) => {
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
