import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface RoleBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  role: string;
}

export function RoleBadge({ role, className, ...props }: RoleBadgeProps) {
  const normalized = role.toLowerCase();

  switch (normalized) {
    case "superadmin":
      return (
        <Badge
          variant="destructive"
          className={cn("uppercase text-[10px] tracking-wider font-semibold", className)}
          {...props}
        >
          Super Admin
        </Badge>
      );
    case "admin":
      return (
        <Badge
          variant="default"
          className={cn("uppercase text-[10px] tracking-wider font-semibold", className)}
          {...props}
        >
          Admin
        </Badge>
      );
    case "manager":
      return (
        <Badge
          variant="secondary"
          className={cn("uppercase text-[10px] tracking-wider font-semibold", className)}
          {...props}
        >
          Manager
        </Badge>
      );
    case "cashier":
      return (
        <Badge
          variant="outline"
          className={cn("uppercase text-[10px] tracking-wider font-semibold border-amber-500/40 text-amber-600 dark:text-amber-400 bg-amber-500/10", className)}
          {...props}
        >
          Cashier
        </Badge>
      );
    case "viewer":
      return (
        <Badge
          variant="outline"
          className={cn("uppercase text-[10px] tracking-wider font-semibold border-blue-500/40 text-blue-600 dark:text-blue-400 bg-blue-500/10", className)}
          {...props}
        >
          Viewer
        </Badge>
      );
    default:
      return (
        <Badge
          variant="outline"
          className={cn("uppercase text-[10px] tracking-wider font-semibold", className)}
          {...props}
        >
          {role}
        </Badge>
      );
  }
}
