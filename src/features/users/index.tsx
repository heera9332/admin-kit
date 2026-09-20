"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/shared/data-table";
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
  role: (u.role === "superadmin" ? "admin" : u.role) as User["role"],
  status: (u.status === "active" ? "active" : "inactive") as User["status"],
}));

export function UsersFeature() {
  const t = useTranslations("users");

  const [users, setUsers] = React.useState<User[]>(initialUsers);
  const [inviteOpen, setInviteOpen] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null);
  const [editingUser, setEditingUser] = React.useState<User | null>(null);
  const [deletingUser, setDeletingUser] = React.useState<User | null>(null);

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
        t,
      }),
    [t]
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            {t("title")}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            {t("description")}
          </p>
        </div>

        <Button
          size="sm"
          className="h-8 gap-1.5 text-xs"
          onClick={() => setInviteOpen(true)}
        >
          <UserPlus className="size-3.5" />
          <span>{t("inviteUser")}</span>
        </Button>
      </div>

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
              { label: t("roles.admin"), value: "admin" },
              { label: t("roles.manager"), value: "manager" },
              { label: t("roles.cashier"), value: "cashier" },
            ],
          },
          {
            column: "status",
            title: t("statuses.title"),
            options: [
              { label: t("statuses.active"), value: "active" },
              { label: t("statuses.inactive"), value: "inactive" },
            ],
          },
        ]}
        sorting
        pagination={{
          pageSize: 10,
          pageSizeOptions: [5, 10, 20, 50],
        }}
      />

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
