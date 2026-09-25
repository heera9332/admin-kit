import usersData from "./users.json";

export const users = usersData.users;

export interface UserItem {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phoneNumber: string;
  status: "active" | "inactive" | "invited" | "suspended";
  role: "superadmin" | "admin" | "manager" | "cashier" | "viewer";
  createdAt: string;
  avatar?: string;
}

export type UserData = UserItem;
export const usersDataList: UserItem[] = users as UserItem[];
