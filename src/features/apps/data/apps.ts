export interface AppItem {
  id: string
  name: string
  desc: string
  connected: boolean
  category: "Productivity" | "Communication" | "Development" | "Finance" | "Design"
}

export const appsData: AppItem[] = [
  {
    id: "notion",
    name: "Notion",
    desc: "Effortlessly sync Notion pages and databases for team documentation.",
    connected: true,
    category: "Productivity",
  },
  {
    id: "figma",
    name: "Figma",
    desc: "View and collaborate on design systems and wireframes in real-time.",
    connected: true,
    category: "Design",
  },
  {
    id: "github",
    name: "GitHub",
    desc: "Streamline code repositories, pull requests, and CI/CD pipelines.",
    connected: true,
    category: "Development",
  },
  {
    id: "slack",
    name: "Slack",
    desc: "Integrate team messaging channels, alerts, and bot triggers.",
    connected: false,
    category: "Communication",
  },
  {
    id: "stripe",
    name: "Stripe",
    desc: "Monitor subscriptions, charge alerts, invoice generation, and payouts.",
    connected: true,
    category: "Finance",
  },
  {
    id: "discord",
    name: "Discord",
    desc: "Connect community channels and event notifications to your dashboard.",
    connected: false,
    category: "Communication",
  },
  {
    id: "docker",
    name: "Docker",
    desc: "Manage container deployments, health registries, and image registries.",
    connected: false,
    category: "Development",
  },
  {
    id: "zoom",
    name: "Zoom",
    desc: "Schedule, host, and sync recorded client meetings from your admin panel.",
    connected: false,
    category: "Communication",
  },
  {
    id: "trello",
    name: "Trello",
    desc: "Sync Kanban cards, team lists, and sprint progression automatically.",
    connected: false,
    category: "Productivity",
  },
  {
    id: "gmail",
    name: "Gmail",
    desc: "Dispatch notification digests and handle transaction confirmations.",
    connected: true,
    category: "Communication",
  },
  {
    id: "telegram",
    name: "Telegram",
    desc: "Send instant alerts and webhook events to automated operational bots.",
    connected: false,
    category: "Communication",
  },
  {
    id: "gitlab",
    name: "GitLab",
    desc: "Manage merge requests, deployment jobs, and security scanners.",
    connected: false,
    category: "Development",
  },
]
