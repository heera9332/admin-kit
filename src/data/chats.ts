import chatsData from "./chats.json";

export interface ChatMessage {
  id: string;
  sender: "user" | "contact";
  text: string;
  time: string;
}

export interface ChatContact {
  id: string;
  name: string;
  email: string;
  avatar: string;
  status: "online" | "offline";
  unread: number;
  lastActive: string;
  phone: string;
  about: string;
  role: string;
  location: string;
  messages: ChatMessage[];
}

export const chatContacts: ChatContact[] = chatsData.contacts as unknown as ChatContact[];
