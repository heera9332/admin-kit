"use client";

import * as React from "react";
import { Link } from "@/i18n/routing";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslations } from "next-intl";
import { useRBAC } from "@/context/rbac-provider";
import { RoleBadge } from "@/components/rbac/role-badge";
import { SignOutDialog } from "./sign-out-dialog";

export function ProfileDropdown() {
  const [openSignOut, setOpenSignOut] = React.useState(false);
  const tNav = useTranslations("nav");
  const tCommon = useTranslations("common");
  const { currentUser, role } = useRBAC();

  const initials = currentUser.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="ghost" className="relative size-8 rounded-full" />
          }
        >
          <Avatar className="size-8">
            <AvatarImage src={currentUser.avatar || "/avatars/01.png"} alt={currentUser.name} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end">
          <Avatar className="size-14 mx-auto my-3">
            <AvatarImage src={currentUser.avatar || "/avatars/01.png"} alt={currentUser.name} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>

          <DropdownMenuGroup className="pb-2">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col items-center space-y-1.5">
                <p className="text-sm font-medium leading-none text-center">
                  {currentUser.name}
                </p>
                <p className="text-xs leading-none text-muted-foreground text-center">
                  {currentUser.email}
                </p>
                <RoleBadge role={role} className="mt-1" />
              </div>
            </DropdownMenuLabel>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem render={<Link href="/dashboard/settings" />}>
              <span>{tNav("profile")}</span>
              <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem
              render={<Link href="/dashboard/settings/account" />}
            >
              <span>{tNav("account")}</span>
              <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem render={<Link href="/dashboard/settings" />}>
              <span>{tNav("settings")}</span>
              <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onClick={() => setOpenSignOut(true)}
          >
            <span>{tCommon("logout")}</span>
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <SignOutDialog open={openSignOut} onOpenChange={setOpenSignOut} />
    </>
  );
}
