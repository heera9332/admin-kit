import rolesData from "./roles.json";

export const roles = rolesData.roles;

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  badgeVariant?: "default" | "secondary" | "outline" | "destructive";
  isSystem?: boolean;
}

export type RoleItem = Role;
