"use client";

import * as React from "react";
import { Shield, ChevronDown, Check } from "lucide-react";
import { useRBAC } from "@/context/rbac-provider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RoleBadge } from "./role-badge";

export function RolePreviewSwitcher() {
  const { role, currentRole, roles, setRole } = useRBAC();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 px-2 text-xs font-normal border-dashed sm:px-2.5"
          />
        }
      >
        <Shield className="size-3.5 text-primary" />
        <span className="hidden md:inline text-muted-foreground">Role:</span>
        <span className="font-semibold">{currentRole?.name || role}</span>
        <ChevronDown className="size-3 text-muted-foreground opacity-60" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="font-normal text-xs text-muted-foreground">
          Simulate Role (RBAC Preview)
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {roles.map((r) => {
          const isSelected = r.id.toLowerCase() === role.toLowerCase();
          return (
            <DropdownMenuItem
              key={r.id}
              onClick={() => setRole(r.id)}
              className="flex items-start justify-between gap-2 py-2 cursor-pointer"
            >
              <div className="flex flex-col gap-0.5 min-w-0">
                <div className="flex items-center gap-1.5">
                  <RoleBadge role={r.id} />
                  <span className="text-xs font-medium text-foreground">
                    {r.name}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground line-clamp-1">
                  {r.description}
                </p>
              </div>
              {isSelected && (
                <Check className="size-4 shrink-0 text-primary mt-0.5" />
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
