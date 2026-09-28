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

export const AUTH_ROLE_STORAGE_KEY = "admin_template_active_role";
export const AUTH_USER_STORAGE_KEY = "admin_template_active_user";

const defaultUser: RBACUser = {
  id: "usr-00",
  name: "Admin User",
  email: "admin@gmail.com",
  role: "admin",
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
    () => initialUser || defaultUser
  );

  const [activeRoleId, setActiveRoleId] = React.useState<string>(
    () => initialRole || initialUser?.role || defaultUser.role || "admin"
  );

  React.useEffect(() => {
    const syncFromStorage = () => {
      try {
        let savedRole = localStorage.getItem(AUTH_ROLE_STORAGE_KEY);
        const savedUserStr = localStorage.getItem(AUTH_USER_STORAGE_KEY);
        if (savedUserStr) {
          const parsed = JSON.parse(savedUserStr);
          if (parsed && parsed.email) {
            setCurrentUser(parsed);
            if (!savedRole && parsed.role) {
              savedRole = parsed.role;
            }
          }
        }
        if (savedRole && allRoles.some((r) => r.id === savedRole)) {
          setActiveRoleId(savedRole);
        }
      } catch {
        // localStorage may fail in restricted environments
      }
    };

    syncFromStorage();
    window.addEventListener("storage", syncFromStorage);
    return () => {
      window.removeEventListener("storage", syncFromStorage);
    };
  }, [allRoles]);

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
      setCurrentUser((prev) => {
        const updated = { ...prev, role: newRoleId };
        try {
          localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(updated));
        } catch {
          // ignore
        }
        return updated;
      });
      try {
        localStorage.setItem(AUTH_ROLE_STORAGE_KEY, newRoleId);
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
      localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(user));
      localStorage.setItem(AUTH_ROLE_STORAGE_KEY, user.role);
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
