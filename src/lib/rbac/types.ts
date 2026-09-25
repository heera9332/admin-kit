import type { Role as RoleData } from "@/data/roles";
import type { Permission as PermissionData } from "@/data/permission";

export type RoleId = "superadmin" | "admin" | "manager" | "cashier" | "viewer" | string;

export interface Role extends RoleData {
  badgeVariant?: "default" | "secondary" | "outline" | "destructive";
  isSystem?: boolean;
}

export type Permission = PermissionData;

export interface RBACUser {
  id: string;
  name: string;
  email: string;
  role: RoleId;
  avatar?: string;
  status?: string;
}

export type PermissionAction = "read" | "create" | "update" | "delete" | "manage" | "connect" | "send" | "export" | string;
export type ResourceName = "users" | "roles" | "projects" | "tasks" | "apps" | "chats" | "cms" | "settings" | "analytics" | string;

export interface PermissionCheckOptions {
  permission?: string;
  anyPermissions?: string[];
  allPermissions?: string[];
  action?: PermissionAction;
  resource?: ResourceName;
}

export interface RoleWithPermissions extends Role {
  resolvedPermissions: Permission[];
}
