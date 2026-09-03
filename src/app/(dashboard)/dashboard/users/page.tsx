import type { Metadata } from "next"
import { UsersFeature } from "@/features/users"

export const metadata: Metadata = {
  title: "Users",
  description: "User directory, role assignments, and workspace invitations",
}

export default function UsersPage() {
  return <UsersFeature />
}
