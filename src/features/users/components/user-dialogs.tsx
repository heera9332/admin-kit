"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { Pencil, Trash2, Mail, Shield, User as UserIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { AppDialog } from "@/components/app-dialog";
import { AppSheet } from "@/components/app-sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PermissionGate } from "@/components/rbac/permission-gate";
import { RoleBadge } from "@/components/rbac/role-badge";
import type { User } from "../user-columns";

interface InviteUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInvite: (user: User) => void;
}

export function InviteUserDialog({
  open,
  onOpenChange,
  onInvite,
}: InviteUserDialogProps) {
  const t = useTranslations("users");
  const tCommon = useTranslations("common");

  const [newEmail, setNewEmail] = React.useState("");
  const [newFirstName, setNewFirstName] = React.useState("");
  const [newLastName, setNewLastName] = React.useState("");
  const [newRole, setNewRole] = React.useState<User["role"]>("admin");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim() || !newFirstName.trim()) return;

    const created: User = {
      id: `usr-${Date.now().toString().slice(-4)}`,
      name: `${newFirstName.trim()} ${newLastName.trim()}`.trim(),
      email: newEmail.trim(),
      role: newRole,
      status: "active",
    };

    onInvite(created);
    setNewEmail("");
    setNewFirstName("");
    setNewLastName("");
    setNewRole("admin");
    onOpenChange(false);
  };

  return (
    <AppDialog
      open={open}
      onOpenChange={onOpenChange}
      title={t("inviteModal.title")}
      description={t("inviteModal.description")}
      onSubmit={handleSubmit}
      size="md"
      footer={
        <div className="flex items-center justify-end gap-2 w-full">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            {tCommon("cancel")}
          </Button>
          <Button type="submit">{t("inviteModal.sendInvite")}</Button>
        </div>
      }
    >
      <div className="grid gap-4 py-2">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="firstName">{t("inviteModal.firstNameLabel")}</Label>
            <Input
              id="firstName"
              placeholder="Jane"
              value={newFirstName}
              onChange={(e) => setNewFirstName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="lastName">{t("inviteModal.lastNameLabel")}</Label>
            <Input
              id="lastName"
              placeholder="Doe"
              value={newLastName}
              onChange={(e) => setNewLastName(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">{t("inviteModal.emailLabel")}</Label>
          <Input
            id="email"
            type="email"
            placeholder="jane.doe@company.com"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="role">{t("inviteModal.roleLabel")}</Label>
          <Select
            value={newRole}
            onValueChange={(val) => {
              if (val) setNewRole(val as User["role"]);
            }}
          >
            <SelectTrigger id="role" className="h-8 w-full text-xs">
              <SelectValue placeholder={t("inviteModal.selectRole")} />
            </SelectTrigger>
            <SelectContent className="w-full">
              <SelectItem value="superadmin">Super Admin</SelectItem>
              <SelectItem value="admin">{t("roles.admin")}</SelectItem>
              <SelectItem value="manager">{t("roles.manager")}</SelectItem>
              <SelectItem value="cashier">{t("roles.cashier")}</SelectItem>
              <SelectItem value="viewer">Viewer</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </AppDialog>
  );
}

interface EditUserFormProps {
  user: User;
  onOpenChange: (open: boolean) => void;
  onUpdate: (user: User) => void;
}

function EditUserForm({ user, onOpenChange, onUpdate }: EditUserFormProps) {
  const t = useTranslations("users");
  const tCommon = useTranslations("common");

  const [name, setName] = React.useState(user.name);
  const [email, setEmail] = React.useState(user.email);
  const [role, setRole] = React.useState<User["role"]>(user.role);
  const [status, setStatus] = React.useState<User["status"]>(user.status);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    onUpdate({
      ...user,
      name: name.trim(),
      email: email.trim(),
      role,
      status,
    });
    onOpenChange(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-2">
        <div className="space-y-1.5">
          <Label htmlFor="edit-name">{t("editDialog.nameLabel")}</Label>
          <Input
            id="edit-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="edit-email">{t("editDialog.emailLabel")}</Label>
          <Input
            id="edit-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="edit-role">{t("editDialog.roleLabel")}</Label>
            <Select
              value={role}
              onValueChange={(val) => {
                if (val) setRole(val as User["role"]);
              }}
            >
              <SelectTrigger id="edit-role" className="h-8 w-full text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="w-full">
                <SelectItem value="superadmin">Super Admin</SelectItem>
                <SelectItem value="admin">{t("roles.admin")}</SelectItem>
                <SelectItem value="manager">{t("roles.manager")}</SelectItem>
                <SelectItem value="cashier">{t("roles.cashier")}</SelectItem>
                <SelectItem value="viewer">Viewer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-status">{t("editDialog.statusLabel")}</Label>
            <Select
              value={status}
              onValueChange={(val) => {
                if (val) setStatus(val as User["status"]);
              }}
            >
              <SelectTrigger id="edit-status" className="h-8 w-full text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="w-full">
                <SelectItem value="active">{t("statuses.active")}</SelectItem>
                <SelectItem value="inactive">{t("statuses.inactive")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 pt-4 border-t mt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => onOpenChange(false)}
        >
          {tCommon("cancel")}
        </Button>
        <Button type="submit">{t("editDialog.save")}</Button>
      </div>
    </form>
  );
}

interface EditUserDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (user: User) => void;
}

export function EditUserDialog({
  user,
  open,
  onOpenChange,
  onUpdate,
}: EditUserDialogProps) {
  const t = useTranslations("users");

  return (
    <AppDialog
      open={open}
      onOpenChange={onOpenChange}
      title={t("editDialog.title")}
      description={t("editDialog.description")}
      size="md"
    >
      {user && (
        <EditUserForm
          key={user.id}
          user={user}
          onOpenChange={onOpenChange}
          onUpdate={onUpdate}
        />
      )}
    </AppDialog>
  );
}

interface ViewUserSheetProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

export function ViewUserSheet({
  user,
  open,
  onOpenChange,
  onEdit,
  onDelete,
}: ViewUserSheetProps) {
  const t = useTranslations("users");
  const tCommon = useTranslations("common");

  if (!user) return null;

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <AppSheet
      open={open}
      onOpenChange={onOpenChange}
      side="right"
      size="md"
      title={user.name}
      description={user.email}
      footer={
        <div className="flex items-center justify-between w-full gap-2">
          <PermissionGate permission="users:delete">
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                onOpenChange(false);
                onDelete(user);
              }}
              className="gap-1.5"
            >
              <Trash2 className="size-3.5" />
              <span>{tCommon("delete")}</span>
            </Button>
          </PermissionGate>

          <PermissionGate permission="users:update">
            <Button
              variant="default"
              size="sm"
              onClick={() => {
                onOpenChange(false);
                onEdit(user);
              }}
              className="gap-1.5 ml-auto"
            >
              <Pencil className="size-3.5" />
              <span>{tCommon("edit")}</span>
            </Button>
          </PermissionGate>
        </div>
      }
    >
      <div className="flex flex-col gap-5 py-2">
        <div className="flex items-center gap-3 p-3.5 rounded-lg border bg-muted/20">
          <Avatar className="size-12 rounded-lg">
            <AvatarFallback className="rounded-lg bg-primary/10 text-primary font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm truncate">{user.name}</span>
              <Badge
                variant={user.status === "active" ? "default" : "secondary"}
                className="text-[10px] capitalize font-normal"
              >
                {t(`statuses.${user.status}`)}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-lg border bg-card space-y-1">
            <span className="text-muted-foreground flex items-center gap-1">
              <UserIcon className="size-3" />
              <span>{t("viewSheet.id")}</span>
            </span>
            <span className="font-mono font-medium text-foreground block">
              {user.id}
            </span>
          </div>

          <div className="p-3 rounded-lg border bg-card space-y-1">
            <span className="text-muted-foreground flex items-center gap-1">
              <Shield className="size-3" />
              <span>{t("viewSheet.role")}</span>
            </span>
            <div className="pt-0.5">
              <RoleBadge role={user.role} />
            </div>
          </div>
        </div>

        <div className="p-3 rounded-lg border bg-card space-y-1.5">
          <span className="text-muted-foreground text-xs flex items-center gap-1">
            <Mail className="size-3" />
            <span>{t("viewSheet.email")}</span>
          </span>
          <p className="text-xs font-mono text-foreground">{user.email}</p>
        </div>
      </div>
    </AppSheet>
  );
}

interface DeleteUserDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (userId: string) => void;
}

export function DeleteUserDialog({
  user,
  open,
  onOpenChange,
  onConfirm,
}: DeleteUserDialogProps) {
  const t = useTranslations("users");
  const tCommon = useTranslations("common");

  if (!user) return null;

  return (
    <AppDialog
      open={open}
      onOpenChange={onOpenChange}
      title={t("deleteDialog.title")}
      description={t("deleteDialog.description")}
      size="sm"
      footer={
        <div className="flex items-center justify-end gap-2 w-full">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            {tCommon("cancel")}
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={() => {
              onConfirm(user.id);
              onOpenChange(false);
            }}
          >
            {tCommon("delete")}
          </Button>
        </div>
      }
    >
      <div className="rounded-lg border p-3 bg-destructive/5 text-xs text-foreground my-2 space-y-1">
        <div className="font-semibold text-sm">{user.name}</div>
        <p className="text-muted-foreground font-mono">{user.email}</p>
      </div>
    </AppDialog>
  );
}
