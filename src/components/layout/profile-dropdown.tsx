"use client"

import * as React from "react"
import { Link } from "@/i18n/routing"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTranslations } from "next-intl"
import { SignOutDialog } from "./sign-out-dialog"

export function ProfileDropdown() {
  const [openSignOut, setOpenSignOut] = React.useState(false)
  const tNav = useTranslations("nav")
  const tCommon = useTranslations("common")

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="ghost" className="relative size-8 rounded-full" />
          }
        >
          <Avatar className="size-8">
            <AvatarImage src="/avatars/01.png" alt="@adminkit" />
            <AvatarFallback>SN</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end">
          <DropdownMenuGroup>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">adminkit</p>
                <p className="text-xs leading-none text-muted-foreground">
                  heera-singh@zoro-dev.com 
                </p>
              </div>
            </DropdownMenuLabel>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem render={<Link href="/dashboard/settings" />}>
              <span>{tNav("profile")}</span>
              <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem render={<Link href="/dashboard/settings/account" />}>
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
  )
}
