import permissionData from "./permission.json";

export const permissions = permissionData.permissions;

export interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string;
  description: string;
}

export type PermissionItem = Permission;
