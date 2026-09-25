"use client";

import * as React from "react";
import { useRBAC } from "@/context/rbac-provider";

export interface RoleGateProps {
  roles: string[];
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Declarative component to conditionally render children based on user role.
 *
 * Example:
 * <RoleGate roles={["superadmin", "admin"]}>
 *   <AdminSettingsPanel />
 * </RoleGate>
 */
export function RoleGate({
  roles,
  fallback = null,
  children,
}: RoleGateProps) {
  const { role } = useRBAC();

  const isAllowed = roles.map((r) => r.toLowerCase()).includes(role.toLowerCase());

  if (!isAllowed) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
