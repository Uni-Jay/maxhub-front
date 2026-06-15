import { Navigate, Outlet } from 'react-router-dom';
import { Loader } from '@components/ui/loader';
import { useAuth } from '@/contexts/AuthContext';

/**
 * PrivateRoute - Protects routes that require authentication
 * Uses AuthContext for consistent auth state management
 */
export function PrivateRoute() {
  const { isAuthenticated, isInitialized, isLoading } = useAuth();

  if (!isInitialized || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  return <Outlet />;
}

/**
 * PublicRoute - Only allows unauthenticated users
 * Uses AuthContext for consistent auth state management
 */
export function PublicRoute() {
  const { isAuthenticated, isInitialized, isLoading } = useAuth();

  if (!isInitialized || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
