import {
  LayoutDashboard,
  FolderKanban,
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
  Newspaper,
  FileText,
  FolderTree,
  Tag,
} from "lucide-react"
import type { SidebarData } from "../types"

export const sidebarData: SidebarData = {
  user: {
    name: "adminkit",
    email: "heera-singh@zoro-dev.com",
    avatar: "/avatars/01.png",
    role: "superadmin",
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
          title: "Projects",
          titleKey: "projects",
          url: "/dashboard/projects",
          icon: FolderKanban,
          permission: "projects:read",
        },
        {
          title: "Tasks",
          titleKey: "tasks",
          url: "/dashboard/tasks",
          icon: ListTodo,
          permission: "tasks:read",
        },
        {
          title: "Apps",
          titleKey: "apps",
          url: "/dashboard/apps",
          icon: Package,
          permission: "apps:read",
        },
        {
          title: "Chats",
          titleKey: "chats",
          url: "/dashboard/chats",
          badge: "3",
          icon: MessagesSquare,
          permission: "chats:read",
        },
        {
          title: "Users",
          titleKey: "users",
          url: "/dashboard/users",
          icon: Users,
          permission: "users:read",
        },
        {
          title: "CMS",
          titleKey: "cms",
          icon: Newspaper,
          permission: "cms:read",
          items: [
            {
              title: "Posts",
              titleKey: "posts",
              url: "/dashboard/cms/posts",
              icon: FileText,
              permission: "cms:read",
            },
            {
              title: "Categories",
              titleKey: "categories",
              url: "/dashboard/cms/categories",
              icon: FolderTree,
              permission: "cms:read",
            },
            {
              title: "Tags",
              titleKey: "tags",
              url: "/dashboard/cms/tags",
              icon: Tag,
              permission: "cms:read",
            },
          ],
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
          permission: "settings:read",
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
