"use client";

import * as React from "react";
import { useRBAC } from "@/context/rbac-provider";

export interface PermissionGateProps {
  permission?: string;
  anyPermissions?: string[];
  allPermissions?: string[];
  action?: string;
  resource?: string;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Declarative component to conditionally render children based on user permissions.
 *
 * Examples:
 * <PermissionGate permission="users:create">
 *   <Button>Invite User</Button>
 * </PermissionGate>
 *
 * <PermissionGate action="delete" resource="users" fallback={<p>Not allowed</p>}>
 *   <DeleteButton />
 * </PermissionGate>
 */
export function PermissionGate({
  permission,
  anyPermissions,
  allPermissions,
  action,
  resource,
  fallback = null,
  children,
}: PermissionGateProps) {
  const { hasPermission, hasAnyPermission, hasAllPermissions, can } = useRBAC();

  let isAllowed = true;

  if (permission) {
    isAllowed = hasPermission(permission);
  } else if (action && resource) {
    isAllowed = can(action, resource);
  } else if (anyPermissions && anyPermissions.length > 0) {
    isAllowed = hasAnyPermission(anyPermissions);
  } else if (allPermissions && allPermissions.length > 0) {
    isAllowed = hasAllPermissions(allPermissions);
  }

  if (!isAllowed) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
