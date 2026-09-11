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
    name: "adminkit",
    email: "heera-singh@zoro-dev.com",
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
      titleKey: "general",
      items: [
        {
          title: "Dashboard",
          titleKey: "dashboard",
          url: "/dashboard",
          icon: LayoutDashboard,
        },
        {
          title: "Tasks",
          titleKey: "tasks",
          url: "/dashboard/tasks",
          icon: ListTodo,
        },
        {
          title: "Apps",
          titleKey: "apps",
          url: "/dashboard/apps",
          icon: Package,
        },
        {
          title: "Chats",
          titleKey: "chats",
          url: "/dashboard/chats",
          badge: "3",
          icon: MessagesSquare,
        },
        {
          title: "Users",
          titleKey: "users",
          url: "/dashboard/users",
          icon: Users,
        },
      ],
    },
    {
      title: "Pages",
      titleKey: "pages",
      items: [
        {
          title: "Auth",
          titleKey: "auth",
          icon: ShieldCheck,
          items: [
            {
              title: "Sign In",
              titleKey: "signIn",
              url: "/sign-in",
            },
            {
              title: "Sign Up",
              titleKey: "signUp",
              url: "/sign-up",
            },
            {
              title: "Forgot Password",
              titleKey: "forgotPassword",
              url: "/forgot-password",
            },
            {
              title: "OTP",
              titleKey: "otp",
              url: "/otp",
            },
          ],
        },
        {
          title: "Errors",
          titleKey: "errors",
          icon: Bug,
          items: [
            {
              title: "Unauthorized",
              titleKey: "unauthorized",
              url: "/errors/unauthorized",
            },
            {
              title: "Forbidden",
              titleKey: "forbidden",
              url: "/errors/forbidden",
            },
            {
              title: "Not Found",
              titleKey: "notFound",
              url: "/errors/not-found",
            },
            {
              title: "Internal Server Error",
              titleKey: "serverError",
              url: "/errors/internal-server-error",
            },
            {
              title: "Maintenance Error",
              titleKey: "maintenance",
              url: "/errors/maintenance-error",
            },
          ],
        },
      ],
    },
    {
      title: "Other",
      titleKey: "other",
      items: [
        {
          title: "Settings",
          titleKey: "settings",
          icon: Settings,
          items: [
            {
              title: "Profile",
              titleKey: "profile",
              url: "/dashboard/settings",
            },
            {
              title: "Account",
              titleKey: "account",
              url: "/dashboard/settings/account",
            },
            {
              title: "Appearance",
              titleKey: "appearance",
              url: "/dashboard/settings/appearance",
            },
            {
              title: "Notifications",
              titleKey: "notifications",
              url: "/dashboard/settings/notifications",
            },
            {
              title: "Display",
              titleKey: "display",
              url: "/dashboard/settings/display",
            },
          ],
        },
        {
          title: "Help Center",
          titleKey: "helpCenter",
          url: "/dashboard/help-center",
          icon: HelpCircle,
        },
      ],
    },
  ],
}
