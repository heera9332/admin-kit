import type { Metadata } from "next"
import { ChatsFeature } from "@/features/chats"

export const metadata: Metadata = {
  title: "Chats",
  description: "Team conversations and customer direct messaging",
}

export default function ChatsPage() {
  return <ChatsFeature />
}
