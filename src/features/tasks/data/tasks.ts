import { tasks, type Task } from "@/data/tasks";
import { usersDataList, type UserItem } from "@/data/users";
import { projects, type Project } from "@/data/projects";

export type { Task };
export const tasksData: Task[] = tasks as Task[];

export function getTaskUser(userId?: string | null): UserItem | null {
  if (!userId || userId === "unassigned") return null;
  return usersDataList.find((u) => u.id === userId) || null;
}

export function getUserDisplayName(userId?: string | null): string {
  const user = getTaskUser(userId);
  if (user) {
    return `${user.firstName} ${user.lastName}`.trim();
  }
  return userId && userId !== "unassigned" ? userId : "Unassigned";
}

export interface TaskUserOption {
  value: string;
  label: string;
  email: string;
  avatar?: string;
  role?: string;
}

export const taskUserOptions: TaskUserOption[] = [
  { value: "unassigned", label: "Unassigned", email: "" },
  ...usersDataList.map((u) => ({
    value: u.id,
    label: `${u.firstName} ${u.lastName}`,
    email: u.email,
    avatar: u.avatar,
    role: u.role,
  })),
];

export function getTaskProject(projectId?: string | null): Project | null {
  if (!projectId || projectId === "none") return null;
  return projects.find((p) => p.id === projectId) || null;
}

export function getProjectDisplayName(projectId?: string | null): string {
  const proj = getTaskProject(projectId);
  if (proj) {
    return proj.title;
  }
  return projectId && projectId !== "none" ? projectId : "No Project";
}

export interface TaskProjectOption {
  value: string;
  label: string;
  category?: string;
  status?: string;
}

export const taskProjectOptions: TaskProjectOption[] = [
  { value: "none", label: "No Project" },
  ...projects.map((p) => ({
    value: p.id,
    label: `${p.title} (${p.id})`,
    category: p.category,
    status: p.status,
  })),
];
