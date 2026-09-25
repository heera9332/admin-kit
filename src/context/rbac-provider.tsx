"use client";

import * as React from "react";
import { users } from "@/data/users";
import {
  getAllRoles,
  getAllPermissions,
  getRole,
  getRolePermissions,
  hasPermission as checkHasPermission,
  hasAnyPermission as checkHasAnyPermission,
  hasAllPermissions as checkHasAllPermissions,
  can as checkCan,
  type Role,
  type Permission,
  type RBACUser,
} from "@/lib/rbac";

interface RBACContextType {
  currentUser: RBACUser;
  currentRole: Role | undefined;
  role: string;
  permissions: string[];
  roles: Role[];
  allPermissions: Permission[];
  availableUsers: RBACUser[];
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  hasAllPermissions: (permissions: string[]) => boolean;
  can: (action: string, resource: string) => boolean;
  setRole: (roleId: string) => void;
  setUser: (user: RBACUser) => void;
}

const STORAGE_KEY = "admin_template_active_role";

const defaultUser: RBACUser = {
  id: "usr-01",
  name: "Sarah Jenkins",
  email: "sarah.jenkins@acme.com",
  role: "superadmin",
  avatar: "/avatars/01.png",
  status: "active",
};

const RBACContext = React.createContext<RBACContextType | undefined>(undefined);

export function RBACProvider({
  children,
  initialRole,
  initialUser,
}: {
  children: React.ReactNode;
  initialRole?: string;
  initialUser?: RBACUser;
}) {
  const allRoles = React.useMemo(() => getAllRoles(), []);
  const allPerms = React.useMemo(() => getAllPermissions(), []);
  const availableUsers: RBACUser[] = React.useMemo(
    () =>
      users.map((u) => ({
        id: u.id,
        name: `${u.firstName} ${u.lastName}`,
        email: u.email,
        role: u.role,
        avatar: u.avatar || "/avatars/01.png",
        status: u.status,
      })),
    []
  );

  const [currentUser, setCurrentUser] = React.useState<RBACUser>(
    initialUser || defaultUser
  );
  const [activeRoleId, setActiveRoleId] = React.useState<string>(() => {
    if (initialRole) return initialRole;
    if (typeof window !== "undefined") {
      try {
        const savedRole = localStorage.getItem(STORAGE_KEY);
        if (savedRole && allRoles.some((r) => r.id === savedRole)) {
          return savedRole;
        }
      } catch {
        // localStorage may fail in restricted environments
      }
    }
    return initialUser?.role || defaultUser.role || "superadmin";
  });

  const currentRole = React.useMemo(
    () => getRole(activeRoleId),
    [activeRoleId]
  );

  const permissions = React.useMemo(
    () => (currentRole ? getRolePermissions(currentRole) : []),
    [currentRole]
  );

  const setRole = React.useCallback(
    (newRoleId: string) => {
      setActiveRoleId(newRoleId);
      setCurrentUser((prev) => ({
        ...prev,
        role: newRoleId,
      }));
      try {
        localStorage.setItem(STORAGE_KEY, newRoleId);
      } catch {
        // ignore
      }
    },
    []
  );

  const setUser = React.useCallback((user: RBACUser) => {
    setCurrentUser(user);
    setActiveRoleId(user.role);
    try {
      localStorage.setItem(STORAGE_KEY, user.role);
    } catch {
      // ignore
    }
  }, []);

  const hasPermission = React.useCallback(
    (permissionId: string) => checkHasPermission(activeRoleId, permissionId),
    [activeRoleId]
  );

  const hasAnyPermission = React.useCallback(
    (permissionIds: string[]) => checkHasAnyPermission(activeRoleId, permissionIds),
    [activeRoleId]
  );

  const hasAllPermissions = React.useCallback(
    (permissionIds: string[]) => checkHasAllPermissions(activeRoleId, permissionIds),
    [activeRoleId]
  );

  const can = React.useCallback(
    (action: string, resource: string) => checkCan(activeRoleId, action, resource),
    [activeRoleId]
  );

  const value = React.useMemo(
    () => ({
      currentUser,
      currentRole,
      role: activeRoleId,
      permissions,
      roles: allRoles,
      allPermissions: allPerms,
      availableUsers,
      hasPermission,
      hasAnyPermission,
      hasAllPermissions,
      can,
      setRole,
      setUser,
    }),
    [
      currentUser,
      currentRole,
      activeRoleId,
      permissions,
      allRoles,
      allPerms,
      availableUsers,
      hasPermission,
      hasAnyPermission,
      hasAllPermissions,
      can,
      setRole,
      setUser,
    ]
  );

  return <RBACContext.Provider value={value}>{children}</RBACContext.Provider>;
}

/**
 * Hook to access RBAC permissions and user role in any component.
 */
export function useRBAC(): RBACContextType {
  const context = React.useContext(RBACContext);
  if (!context) {
    throw new Error("useRBAC must be used within an RBACProvider");
  }
  return context;
}
