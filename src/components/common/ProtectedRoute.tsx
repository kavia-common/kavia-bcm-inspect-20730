import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "hooks/useAuth";
import { UserRole } from "interfaces/auth";
import { message } from "antd";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles = [],
}) => {
  const { user, isAuthenticated, userRole } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to signin while saving the attempted location
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // If there are no required roles, allow access
  if (allowedRoles.length === 0) {
    return <>{children}</>;
  }

  // Check if user has required role
  const hasRequiredRole = userRole && allowedRoles.includes(userRole);

  if (!hasRequiredRole) {
    // Redirect to home page if user doesn't have required role
    message.error("You are not authorized to access this page");
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
