export interface ChatMessage {
  id: string
  sender: "user" | "contact"
  text: string
  time: string
}

export interface ChatContact {
  id: string
  name: string
  email: string
  avatar: string
  status: "online" | "offline"
  unread: number
  lastActive: string
  phone: string
  about: string
  role: string
  location: string
  messages: ChatMessage[]
}

export const chatContacts: ChatContact[] = [
  {
    id: "user-1",
    name: "Sarah Jenkins",
    email: "sarah.jenkins@acme.com",
    avatar: "/avatars/01.png",
    status: "online",
    unread: 3,
    lastActive: "Just now",
    phone: "+1 (555) 234-5678",
    about: "Building scalable web products 🚀 | Available for quick syncs",
    role: "Lead Product Designer",
    location: "San Francisco, CA",
    messages: [
      { id: "m1", sender: "contact", text: "Hey adminkit! Did you check the latest pull request on the tasks dashboard?", time: "10:14 AM" },
      { id: "m2", sender: "user", text: "Hey Sarah! Yes, I just reviewed the TanStack table filters and pagination.", time: "10:15 AM" },
      { id: "m3", sender: "contact", text: "Awesome! The performance looks much faster with the new indexed queries.", time: "10:16 AM" },
      { id: "m4", sender: "contact", text: "Can we hop on a quick call before releasing the v1.2 update?", time: "10:18 AM" },
    ],
  },
  {
    id: "user-2",
    name: "Liam Vance",
    email: "liam.vance@techcorp.io",
    avatar: "/avatars/02.png",
    status: "online",
    unread: 0,
    lastActive: "15m ago",
    phone: "+1 (555) 890-1234",
    about: "Full stack engineering & distributed systems architect",
    role: "Senior Backend Engineer",
    location: "Austin, TX",
    messages: [
      { id: "m1", sender: "contact", text: "The Stripe webhook events are now synchronizing seamlessly.", time: "Yesterday" },
      { id: "m2", sender: "user", text: "Great news. Make sure the idempotency keys are handled properly.", time: "Yesterday" },
      { id: "m3", sender: "contact", text: "Already implemented! All verified with automated integration tests.", time: "Yesterday" },
    ],
  },
  {
    id: "user-3",
    name: "Elena Rostova",
    email: "elena.r@designhub.net",
    avatar: "/avatars/03.png",
    status: "offline",
    unread: 0,
    lastActive: "2h ago",
    phone: "+44 20 7946 0912",
    about: "Design system enthusiast & typography geek 🎨",
    role: "UI/UX Specialist",
    location: "London, UK",
    messages: [
      { id: "m1", sender: "contact", text: "I uploaded the updated dark mode tokens in Figma.", time: "2 days ago" },
      { id: "m2", sender: "user", text: "Looks clean! The contrast ratios meet WCAG AAA standards.", time: "2 days ago" },
    ],
  },
  {
    id: "user-4",
    name: "Marcus Brody",
    email: "marcus.brody@cloudscale.io",
    avatar: "/avatars/04.png",
    status: "online",
    unread: 1,
    lastActive: "5m ago",
    phone: "+1 (555) 432-8765",
    about: "DevOps & Cloud Infrastructure. SRE on call ⚡",
    role: "DevOps Lead",
    location: "Seattle, WA",
    messages: [
      { id: "m1", sender: "contact", text: "Are we deploying the database migrations tonight?", time: "9:30 AM" },
      { id: "m2", sender: "user", text: "Yes, scheduled for 11 PM UTC during the low-traffic window.", time: "9:45 AM" },
      { id: "m3", sender: "contact", text: "Sounds good, I'll be on standby for monitoring telemetry.", time: "9:46 AM" },
    ],
  },
  {
    id: "user-5",
    name: "Chloe Zhao",
    email: "chloe.zhao@startup.ai",
    avatar: "/avatars/05.png",
    status: "offline",
    unread: 0,
    lastActive: "1d ago",
    phone: "+1 (555) 321-9876",
    about: "AI / ML product researcher & prompt engineer",
    role: "Product Manager",
    location: "New York, NY",
    messages: [
      { id: "m1", sender: "contact", text: "Thanks for approving the invitation. Looking forward to using the template!", time: "Aug 31" },
    ],
  },
]
