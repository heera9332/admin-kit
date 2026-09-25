import { roles } from "@/data/roles";
import { permissions } from "@/data/permission";
import type { Role, Permission, PermissionCheckOptions } from "./types";

export * from "./types";

/**
 * Returns all configured roles.
 */
export function getAllRoles(): Role[] {
  return roles as Role[];
}

/**
 * Retrieves a role by its unique ID.
 */
export function getRole(roleId: string): Role | undefined {
  return (roles as Role[]).find((r) => r.id.toLowerCase() === roleId.toLowerCase());
}

/**
 * Returns all available system permissions.
 */
export function getAllPermissions(): Permission[] {
  return permissions as Permission[];
}

/**
 * Groups all permissions by their resource (e.g., users, projects, tasks).
 */
export function getPermissionsByResource(): Record<string, Permission[]> {
  const grouped: Record<string, Permission[]> = {};
  
  for (const perm of permissions as Permission[]) {
    if (!grouped[perm.resource]) {
      grouped[perm.resource] = [];
    }
    grouped[perm.resource].push(perm);
  }
  return grouped;
}

/**
 * Resolves all permission IDs granted to a role, handling wildcards.
 */
export function getRolePermissions(roleIdOrRole: string | Role): string[] {
  const role = typeof roleIdOrRole === "string" ? getRole(roleIdOrRole) : roleIdOrRole;
  if (!role) return [];

  // Superadmin has unconstrained access
  if (role.id === "superadmin" || role.permissions.includes("*")) {
    return (permissions as Permission[]).map((p) => p.id);
  }

  const resolved = new Set<string>();
  for (const perm of role.permissions) {
    if (perm.endsWith(":*") || perm.endsWith(":manage")) {
      const resource = perm.split(":")[0];
      for (const p of permissions as Permission[]) {
        if (p.resource === resource) {
          resolved.add(p.id);
        }
      }
    } else {
      resolved.add(perm);
    }
  }

  return Array.from(resolved);
}

/**
 * Checks if a given role has a specific permission.
 * User has role -> role has permission.
 */
export function hasPermission(
  roleIdOrRole: string | Role | undefined | null,
  permissionId: string
): boolean {
  if (!roleIdOrRole || !permissionId) return false;

  const role = typeof roleIdOrRole === "string" ? getRole(roleIdOrRole) : roleIdOrRole;
  if (!role) return false;

  // 1. Wildcard superadmin rule
  if (role.id === "superadmin" || role.permissions.includes("*")) {
    return true;
  }

  // 2. Exact match
  if (role.permissions.includes(permissionId)) {
    return true;
  }

  // 3. Resource wildcard match (e.g., "users:*" or "users:manage" grants "users:read")
  const [resource] = permissionId.split(":");
  if (
    role.permissions.includes(`${resource}:*`) ||
    role.permissions.includes(`${resource}:manage`)
  ) {
    return true;
  }

  return false;
}

/**
 * Checks if a role has at least ONE of the specified permissions.
 */
export function hasAnyPermission(
  roleIdOrRole: string | Role | undefined | null,
  permissionIds: string[]
): boolean {
  if (!roleIdOrRole || !permissionIds || permissionIds.length === 0) return false;
  return permissionIds.some((p) => hasPermission(roleIdOrRole, p));
}

/**
 * Checks if a role has ALL of the specified permissions.
 */
export function hasAllPermissions(
  roleIdOrRole: string | Role | undefined | null,
  permissionIds: string[]
): boolean {
  if (!roleIdOrRole || !permissionIds || permissionIds.length === 0) return false;
  return permissionIds.every((p) => hasPermission(roleIdOrRole, p));
}

/**
 * Checks if a role can perform an action on a resource (can(role, "create", "users")).
 */
export function can(
  roleIdOrRole: string | Role | undefined | null,
  action: string,
  resource: string
): boolean {
  return hasPermission(roleIdOrRole, `${resource}:${action}`);
}

/**
 * Returns full Permission objects for a user based on their assigned role.
 */
export function getUserPermissions(user: { role: string } | undefined | null): Permission[] {
  if (!user?.role) return [];
  const permIds = getRolePermissions(user.role);
  return (permissions as Permission[]).filter((p) => permIds.includes(p.id));
}

/**
 * General options checker.
 */
export function checkPermission(
  roleIdOrRole: string | Role | undefined | null,
  options: PermissionCheckOptions
): boolean {
  if (options.permission) {
    return hasPermission(roleIdOrRole, options.permission);
  }
  if (options.action && options.resource) {
    return can(roleIdOrRole, options.action, options.resource);
  }
  if (options.anyPermissions && options.anyPermissions.length > 0) {
    return hasAnyPermission(roleIdOrRole, options.anyPermissions);
  }
  if (options.allPermissions && options.allPermissions.length > 0) {
    return hasAllPermissions(roleIdOrRole, options.allPermissions);
  }
  return true;
}
