export interface UserItem {
  id: string
  firstName: string
  lastName: string
  username: string
  email: string
  phoneNumber: string
  status: "active" | "inactive" | "invited" | "suspended"
  role: "superadmin" | "admin" | "manager" | "cashier"
  createdAt: string
}

export const usersData: UserItem[] = [
  {
    id: "usr-01",
    firstName: "Sarah",
    lastName: "Jenkins",
    username: "sjenkins",
    email: "sarah.jenkins@acme.com",
    phoneNumber: "+1 (555) 234-5678",
    status: "active",
    role: "superadmin",
    createdAt: "2025-01-14",
  },
  {
    id: "usr-02",
    firstName: "Liam",
    lastName: "Vance",
    username: "lvance",
    email: "liam.vance@techcorp.io",
    phoneNumber: "+1 (555) 345-6789",
    status: "active",
    role: "admin",
    createdAt: "2025-03-22",
  },
  {
    id: "usr-03",
    firstName: "Elena",
    lastName: "Rostova",
    username: "erostova",
    email: "elena.r@designhub.net",
    phoneNumber: "+1 (555) 456-7890",
    status: "active",
    role: "manager",
    createdAt: "2025-04-10",
  },
  {
    id: "usr-04",
    firstName: "Marcus",
    lastName: "Brody",
    username: "mbrody",
    email: "marcus.brody@cloudscale.io",
    phoneNumber: "+1 (555) 567-8901",
    status: "invited",
    role: "manager",
    createdAt: "2025-08-01",
  },
  {
    id: "usr-05",
    firstName: "Chloe",
    lastName: "Zhao",
    username: "czhao",
    email: "chloe.zhao@startup.ai",
    phoneNumber: "+1 (555) 678-9012",
    status: "active",
    role: "cashier",
    createdAt: "2025-09-18",
  },
  {
    id: "usr-06",
    firstName: "Devon",
    lastName: "Lane",
    username: "dlane",
    email: "devon.lane@example.com",
    phoneNumber: "+1 (555) 789-0123",
    status: "inactive",
    role: "cashier",
    createdAt: "2025-10-05",
  },
  {
    id: "usr-07",
    firstName: "Courtney",
    lastName: "Henry",
    username: "chenry",
    email: "courtney.h@example.com",
    phoneNumber: "+1 (555) 890-1234",
    status: "suspended",
    role: "admin",
    createdAt: "2025-11-12",
  },
]
