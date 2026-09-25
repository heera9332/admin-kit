"use client";

import * as React from "react";
import { Check, X, Shield, Users as UsersIcon, Search } from "lucide-react";
import { useRBAC } from "@/context/rbac-provider";
import { hasPermission } from "@/lib/rbac";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { RoleBadge } from "./role-badge";

export function RolesPermissionMatrix() {
  const { roles, allPermissions, availableUsers, role: currentActiveRole, setRole } = useRBAC();
  const [searchTerm, setSearchTerm] = React.useState("");

  // Group permissions by resource
  const groupedPermissions = React.useMemo(() => {
    const groups: Record<string, typeof allPermissions> = {};
    for (const perm of allPermissions) {
      if (
        searchTerm &&
        !perm.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !perm.id.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !perm.resource.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        continue;
      }
      if (!groups[perm.resource]) {
        groups[perm.resource] = [];
      }
      groups[perm.resource].push(perm);
    }
    return groups;
  }, [allPermissions, searchTerm]);

  return (
    <div className="space-y-6">
      {/* Roles Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {roles.map((r) => {
          const userCount = availableUsers.filter(
            (u) => u.role.toLowerCase() === r.id.toLowerCase()
          ).length;
          const isCurrentActive = currentActiveRole.toLowerCase() === r.id.toLowerCase();

          return (
            <Card
              key={r.id}
              className={`cursor-pointer transition-all hover:border-primary/50 ${
                isCurrentActive ? "border-primary ring-1 ring-primary/40 bg-muted/20" : ""
              }`}
              onClick={() => setRole(r.id)}
            >
              <CardHeader className="p-4 pb-2">
                <div className="flex items-center justify-between gap-1">
                  <RoleBadge role={r.id} />
                  {isCurrentActive && (
                    <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/30">
                      Active
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-sm font-semibold mt-2">{r.name}</CardTitle>
                <CardDescription className="text-xs line-clamp-2 min-h-8">
                  {r.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-1 flex items-center justify-between text-xs text-muted-foreground border-t mt-2">
                <span className="flex items-center gap-1">
                  <UsersIcon className="size-3" />
                  {userCount} {userCount === 1 ? "user" : "users"}
                </span>
                <span className="font-mono text-[11px]">
                  {r.id === "superadmin" ? "All ( * )" : `${r.permissions.length} perms`}
                </span>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Permissions Matrix */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-6 border-b">
          <div>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Shield className="size-4 text-primary" />
              Role-Permission Access Control Matrix
            </CardTitle>
            <CardDescription className="text-xs mt-1">
              Hierarchical matrix mapping system permissions to roles. Click any role card above to simulate access.
            </CardDescription>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 size-3.5 text-muted-foreground" />
            <Input
              placeholder="Filter permissions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-8 pl-8 text-xs"
            />
          </div>
        </CardHeader>

        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b bg-muted/40 text-muted-foreground font-medium">
                <th className="py-3 px-4 w-[280px]">Permission</th>
                <th className="py-3 px-3 w-[120px]">Key</th>
                {roles.map((r) => (
                  <th
                    key={r.id}
                    className={`py-3 px-3 text-center transition-colors ${
                      currentActiveRole.toLowerCase() === r.id.toLowerCase()
                        ? "bg-primary/5 text-primary font-semibold"
                        : ""
                    }`}
                  >
                    <div className="flex flex-col items-center">
                      <span>{r.name}</span>
                      {currentActiveRole.toLowerCase() === r.id.toLowerCase() && (
                        <span className="text-[10px] text-primary/80 font-normal">
                          (Current)
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {Object.entries(groupedPermissions).map(([resource, perms]) => (
                <React.Fragment key={resource}>
                  <tr className="bg-muted/20 font-semibold text-foreground/80">
                    <td
                      colSpan={roles.length + 2}
                      className="py-2 px-4 uppercase text-[11px] tracking-wider text-muted-foreground"
                    >
                      {resource} Module
                    </td>
                  </tr>
                  {perms.map((perm) => (
                    <tr
                      key={perm.id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <td className="py-2.5 px-4 font-medium text-foreground">
                        <div>{perm.name}</div>
                        <div className="text-[11px] text-muted-foreground font-normal">
                          {perm.description}
                        </div>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-[11px] text-muted-foreground">
                        {perm.id}
                      </td>
                      {roles.map((r) => {
                        const allowed = hasPermission(r, perm.id);
                        const isCurrent =
                          currentActiveRole.toLowerCase() === r.id.toLowerCase();
                        return (
                          <td
                            key={r.id}
                            className={`py-2.5 px-3 text-center ${
                              isCurrent ? "bg-primary/5" : ""
                            }`}
                          >
                            {allowed ? (
                              <span className="inline-flex items-center justify-center size-5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                <Check className="size-3.5 stroke-[2.5]" />
                              </span>
                            ) : (
                              <span className="inline-flex items-center justify-center size-5 text-muted-foreground/30">
                                <X className="size-3 stroke-[1.5]" />
                              </span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
