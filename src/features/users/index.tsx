"use client";

import * as React from "react";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AppDialog } from "@/components/app-dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTable } from "@/components/shared/data-table";
import { userColumns, type User } from "./user-columns";
import { usersData } from "./data/users";

const initialUsers: User[] = usersData.map((u) => ({
  id: u.id,
  name: `${u.firstName} ${u.lastName}`,
  email: u.email,
  role: (u.role === "superadmin" ? "admin" : u.role) as User["role"],
  status: (u.status === "active" ? "active" : "inactive") as User["status"],
}));

export function UsersFeature() {
  const [users, setUsers] = React.useState<User[]>(initialUsers);
  const [inviteOpen, setInviteOpen] = React.useState(false);

  // Invite form state
  const [newEmail, setNewEmail] = React.useState("");
  const [newFirstName, setNewFirstName] = React.useState("");
  const [newLastName, setNewLastName] = React.useState("");
  const [newRole, setNewRole] = React.useState<User["role"]>("admin");

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim() || !newFirstName.trim()) return;

    const created: User = {
      id: `usr-${Date.now().toString().slice(-4)}`,
      name: `${newFirstName.trim()} ${newLastName.trim()}`,
      email: newEmail.trim(),
      role: newRole,
      status: "active",
    };

    setUsers((prev) => [created, ...prev]);
    setNewEmail("");
    setNewFirstName("");
    setNewLastName("");
    setInviteOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Users
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Manage your organization members, invite new administrators, and set
            permissions.
          </p>
        </div>

        <Button
          size="sm"
          className="h-8 gap-1.5 text-xs"
          onClick={() => setInviteOpen(true)}
        >
          <UserPlus className="size-3.5" />
          <span>Invite User</span>
        </Button>
      </div>

      <DataTable
        data={users}
        columns={userColumns}
        search={{
          column: "name",
          placeholder: "Search users...",
        }}
        filters={[
          {
            column: "role",
            title: "Role",
            options: [
              { label: "Admin", value: "admin" },
              { label: "Manager", value: "manager" },
              { label: "Cashier", value: "cashier" },
            ],
          },
          {
            column: "status",
            title: "Status",
            options: [
              { label: "Active", value: "active" },
              { label: "Inactive", value: "inactive" },
            ],
          },
        ]}
        sorting
        pagination={{
          pageSize: 10,
          pageSizeOptions: [5, 10, 20, 50],
        }}
      />

      <AppDialog
        open={inviteOpen}
        onOpenChange={setInviteOpen}
        title="Invite Team Member"
        description="Send an invitation email with a secure link to join your workspace."
        onSubmit={handleInvite}
        size="md"
        footer={
          <>
            <Button
              type="button"
              variant="outline"
              onClick={() => setInviteOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Send Invitation</Button>
          </>
        }
      >
        <div className="grid gap-4 py-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                placeholder="Jane"
                value={newFirstName}
                onChange={(e) => setNewFirstName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                placeholder="Doe"
                value={newLastName}
                onChange={(e) => setNewLastName(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email">Email Address</Label>
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
            <Label htmlFor="role">Role</Label>
            <Select
              value={newRole}
              onValueChange={(val) => {
                if (val) setNewRole(val as User["role"]);
              }}
            >
              <SelectTrigger id="role" className="h-8 w-full text-xs">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent className="w-full">
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="cashier">Cashier</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </AppDialog>
    </div>
  );
}
