"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { UserPlus, Users, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from "@/components/shared/data-table";
import { PermissionGate } from "@/components/rbac/permission-gate";
import { RolesPermissionMatrix } from "@/components/rbac/roles-permission-matrix";
import { useRBAC } from "@/context/rbac-provider";
import { getUserColumns, type User } from "./user-columns";
import {
  InviteUserDialog,
  EditUserDialog,
  ViewUserSheet,
  DeleteUserDialog,
} from "./components/user-dialogs";
import { usersData } from "./data/users";

const initialUsers: User[] = usersData.map((u) => ({
  id: u.id,
  name: `${u.firstName} ${u.lastName}`,
  email: u.email,
  role: u.role,
  status: u.status,
}));

export function UsersFeature() {
  const t = useTranslations("users");
  const { hasPermission } = useRBAC();

  const [activeTab, setActiveTab] = React.useState<string>("users");
  const [users, setUsers] = React.useState<User[]>(initialUsers);
  const [inviteOpen, setInviteOpen] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null);
  const [editingUser, setEditingUser] = React.useState<User | null>(null);
  const [deletingUser, setDeletingUser] = React.useState<User | null>(null);

  const canUpdate = hasPermission("users:update");
  const canDelete = hasPermission("users:delete");
  const canView = hasPermission("users:read");

  const handleInvite = (created: User) => {
    setUsers((prev) => [created, ...prev]);
  };

  const handleUpdate = (updated: User) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === updated.id ? updated : u))
    );
    if (selectedUser?.id === updated.id) {
      setSelectedUser(updated);
    }
  };

  const handleDelete = (userId: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    if (selectedUser?.id === userId) {
      setSelectedUser(null);
    }
  };

  const columns = React.useMemo(
    () =>
      getUserColumns({
        onView: (user) => setSelectedUser(user),
        onEdit: (user) => setEditingUser(user),
        onDelete: (user) => setDeletingUser(user),
        canView,
        canEdit: canUpdate,
        canDelete,
        t,
      }),
    [canView, canUpdate, canDelete, t]
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            {t("title")}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            {t("description")}
          </p>
        </div>

        <PermissionGate permission="users:create">
          <Button
            size="sm"
            className="h-8 gap-1.5 text-xs"
            onClick={() => setInviteOpen(true)}
          >
            <UserPlus className="size-3.5" />
            <span>{t("inviteUser")}</span>
          </Button>
        </PermissionGate>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(val) => {
          if (val) setActiveTab(val);
        }}
        className="w-full space-y-6"
      >
        <div className="w-full overflow-x-auto pb-1">
          <TabsList className="inline-flex h-9 items-center justify-start gap-1 rounded-lg bg-muted p-1 text-muted-foreground border">
            <TabsTrigger
              value="users"
              className="text-xs h-7 px-3 gap-2 font-medium"
            >
              <Users className="size-3.5" />
              <span>Users Directory</span>
            </TabsTrigger>
            <TabsTrigger
              value="roles"
              className="text-xs h-7 px-3 gap-2 font-medium"
            >
              <Shield className="size-3.5" />
              <span>Roles & Permissions (RBAC)</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="users" className="mt-0 outline-none space-y-4">
          <DataTable
            data={users}
            columns={columns}
            search={{
              column: "name",
              placeholder: t("searchPlaceholder"),
            }}
            filters={[
              {
                column: "role",
                title: t("roles.title"),
                options: [
                  { label: "Super Admin", value: "superadmin" },
                  { label: t("roles.admin"), value: "admin" },
                  { label: t("roles.manager"), value: "manager" },
                  { label: t("roles.cashier"), value: "cashier" },
                  { label: "Viewer", value: "viewer" },
                ],
              },
              {
                column: "status",
                title: t("statuses.title"),
                options: [
                  { label: t("statuses.active"), value: "active" },
                  { label: t("statuses.inactive"), value: "inactive" },
                  { label: "Invited", value: "invited" },
                  { label: "Suspended", value: "suspended" },
                ],
              },
            ]}
            sorting
            pagination={{
              pageSize: 10,
              pageSizeOptions: [5, 10, 20, 50],
            }}
          />
        </TabsContent>

        <TabsContent value="roles" className="mt-0 outline-none">
          <RolesPermissionMatrix />
        </TabsContent>
      </Tabs>

      <InviteUserDialog
        open={inviteOpen}
        onOpenChange={setInviteOpen}
        onInvite={handleInvite}
      />

      <EditUserDialog
        user={editingUser}
        open={!!editingUser}
        onOpenChange={(open) => !open && setEditingUser(null)}
        onUpdate={handleUpdate}
      />

      <ViewUserSheet
        user={selectedUser}
        open={!!selectedUser}
        onOpenChange={(open) => !open && setSelectedUser(null)}
        onEdit={(user) => setEditingUser(user)}
        onDelete={(user) => setDeletingUser(user)}
      />

      <DeleteUserDialog
        user={deletingUser}
        open={!!deletingUser}
        onOpenChange={(open) => !open && setDeletingUser(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
