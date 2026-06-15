/**
 * Route Protection Components
 * 
 * ProtectedRoute - Requires authentication
 * RoleProtectedRoute - Requires specific role
 * PermissionGuard - Requires specific permissions
 * PublicRoute - Prevents authenticated users from accessing
 */

import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * ProtectedRoute Component
 * Redirects to login if user is not authenticated
 * Shows loading spinner while auth is initializing
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  fallback 
}) => {
  const { isAuthenticated, isInitialized, isLoading } = useAuth();
  const location = useLocation();

  // Show loading while initializing auth
  if (!isInitialized || isLoading) {
    return (
      fallback || (
        <div className="flex h-screen items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <Loader className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading...</p>
          </div>
        </div>
      )
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

interface RoleProtectedRouteProps {
  children: ReactNode;
  requiredRole: string;
  fallback?: ReactNode;
  onUnauthorized?: () => void;
}

/**
 * RoleProtectedRoute Component
 * Redirects if user doesn't have the required role
 */
export const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({
  children,
  requiredRole,
  fallback,
  onUnauthorized,
}) => {
  const { user, isAuthenticated, isInitialized } = useAuth();
  const location = useLocation();

  // Must be authenticated first
  if (!isInitialized) {
    return (
      fallback || (
        <div className="flex h-screen items-center justify-center">
          <Loader className="h-8 w-8 animate-spin text-primary" />
        </div>
      )
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Check role
  if (!user?.roles?.includes(requiredRole)) {
    onUnauthorized?.();
    return (
      fallback || (
        <div className="flex h-screen items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Access Denied</h1>
            <p className="text-muted-foreground">
              You don't have permission to access this resource.
            </p>
          </div>
        </div>
      )
    );
  }

  return <>{children}</>;
};

interface PermissionGuardProps {
  children: ReactNode;
  permission: string | string[];
  requireAll?: boolean;
  fallback?: ReactNode;
  onUnauthorized?: () => void;
}

/**
 * PermissionGuard Component
 * Conditionally renders children based on user permissions
 * Can check for single permission or multiple permissions
 * 
 * @param permission - Single permission code or array of codes
 * @param requireAll - If true, user must have ALL permissions. If false (default), ANY permission is enough
 */
export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  children,
  permission,
  requireAll = false,
  fallback,
  onUnauthorized,
}) => {
  const { isAuthenticated, hasPermission, hasAllPermissions, hasAnyPermission } = useAuth();

  if (!isAuthenticated) {
    return fallback || null;
  }

  let hasAccess = false;

  if (typeof permission === 'string') {
    hasAccess = hasPermission(permission);
  } else if (Array.isArray(permission)) {
    hasAccess = requireAll 
      ? hasAllPermissions(permission)
      : hasAnyPermission(permission);
  }

  if (!hasAccess) {
    onUnauthorized?.();
    return fallback || null;
  }

  return <>{children}</>;
};

interface PublicRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * PublicRoute Component
 * Prevents authenticated users from accessing (e.g., login page)
 * Redirects to dashboard if already logged in
 */
export const PublicRoute: React.FC<PublicRouteProps> = ({ 
  children, 
  fallback 
}) => {
  const { isAuthenticated, isInitialized } = useAuth();
  const location = useLocation();

  if (!isInitialized) {
    return (
      fallback || (
        <div className="flex h-screen items-center justify-center">
          <Loader className="h-8 w-8 animate-spin text-primary" />
        </div>
      )
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

interface MultiRoleProtectedRouteProps {
  children: ReactNode;
  allowedRoles: string[];
  fallback?: ReactNode;
  onUnauthorized?: () => void;
}

/**
 * MultiRoleProtectedRoute Component
 * Allows access if user has ANY of the specified roles
 */
export const MultiRoleProtectedRoute: React.FC<MultiRoleProtectedRouteProps> = ({
  children,
  allowedRoles,
  fallback,
  onUnauthorized,
}) => {
  const { user, isAuthenticated, isInitialized } = useAuth();
  const location = useLocation();

  if (!isInitialized) {
    return (
      fallback || (
        <div className="flex h-screen items-center justify-center">
          <Loader className="h-8 w-8 animate-spin text-primary" />
        </div>
      )
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  if (!user?.roles || !user.roles.some(role => allowedRoles.includes(role))) {
    onUnauthorized?.();
    return (
      fallback || (
        <div className="flex h-screen items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Access Denied</h1>
            <p className="text-muted-foreground">
              You don't have permission to access this resource.
            </p>
          </div>
        </div>
      )
    );
  }

  return <>{children}</>;
};

// Export all components
export default {
  ProtectedRoute,
  RoleProtectedRoute,
  PermissionGuard,
  PublicRoute,
  MultiRoleProtectedRoute,
};
