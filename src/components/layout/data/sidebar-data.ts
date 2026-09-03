import {
  LayoutDashboard,
  ListTodo,
  Package,
  MessagesSquare,
  Users,
  ShieldCheck,
  Bug,
  Settings,
  HelpCircle,
  Command,
  GalleryVerticalEnd,
  AudioWaveform,
} from "lucide-react"
import type { SidebarData } from "../types"

export const sidebarData: SidebarData = {
  user: {
    name: "satnaing",
    email: "satnaingdev@gmail.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Shadcn Admin",
      logo: Command,
      plan: "Next.js + ShadcnUI",
    },
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
  ],
  navGroups: [
    {
      title: "General",
      items: [
        {
          title: "Dashboard",
          url: "/dashboard",
          icon: LayoutDashboard,
        },
        {
          title: "Tasks",
          url: "/dashboard/tasks",
          icon: ListTodo,
        },
        {
          title: "Apps",
          url: "/dashboard/apps",
          icon: Package,
        },
        {
          title: "Chats",
          url: "/dashboard/chats",
          badge: "3",
          icon: MessagesSquare,
        },
        {
          title: "Users",
          url: "/dashboard/users",
          icon: Users,
        },
      ],
    },
    {
      title: "Pages",
      items: [
        {
          title: "Auth",
          icon: ShieldCheck,
          items: [
            {
              title: "Sign In",
              url: "/sign-in",
            },
            {
              title: "Sign Up",
              url: "/sign-up",
            },
            {
              title: "Forgot Password",
              url: "/forgot-password",
            },
            {
              title: "OTP",
              url: "/otp",
            },
          ],
        },
        {
          title: "Errors",
          icon: Bug,
          items: [
            {
              title: "Unauthorized",
              url: "/errors/unauthorized",
            },
            {
              title: "Forbidden",
              url: "/errors/forbidden",
            },
            {
              title: "Not Found",
              url: "/errors/not-found",
            },
            {
              title: "Internal Server Error",
              url: "/errors/internal-server-error",
            },
            {
              title: "Maintenance Error",
              url: "/errors/maintenance-error",
            },
          ],
        },
      ],
    },
    {
      title: "Other",
      items: [
        {
          title: "Settings",
          icon: Settings,
          items: [
            {
              title: "Profile",
              url: "/dashboard/settings",
            },
            {
              title: "Account",
              url: "/dashboard/settings/account",
            },
            {
              title: "Appearance",
              url: "/dashboard/settings/appearance",
            },
            {
              title: "Notifications",
              url: "/dashboard/settings/notifications",
            },
            {
              title: "Display",
              url: "/dashboard/settings/display",
            },
          ],
        },
        {
          title: "Help Center",
          url: "/dashboard/help-center",
          icon: HelpCircle,
        },
      ],
    },
  ],
}
