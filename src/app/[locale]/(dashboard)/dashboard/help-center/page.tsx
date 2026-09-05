import type { Metadata } from "next"
import { BookOpen, MessageSquare, LifeBuoy, ExternalLink } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Help Center",
  description: "Knowledge base, FAQs, and customer support resources",
}

export default function HelpCenterPage() {
  const faqs = [
    {
      q: "How do I switch teams or workspaces in the dashboard?",
      a: "Click on the team dropdown in the top-left corner of the sidebar to view all assigned workspaces or invite new team collaborators.",
    },
    {
      q: "How does the global search command work?",
      a: "Press ⌘K (or Ctrl+K on Windows/Linux) anywhere to trigger the Command Palette for instant page navigation and theme toggling.",
    },
    {
      q: "Can I customize the columns in the Tasks table?",
      a: "Yes! Click the 'View' button above the table to toggle column visibility on and off according to your preference.",
    },
    {
      q: "How do I toggle dark mode?",
      a: "You can click the theme toggle icon in the top header, use the ⌘K command menu, or go to Settings > Appearance.",
    },
  ]

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Help Center</h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Find answers to common questions and get in touch with our team.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <BookOpen className="size-4.5" />
            </div>
            <CardTitle className="text-sm mt-2">Documentation</CardTitle>
            <CardDescription className="text-xs">
              Explore component specifications and architectural guides.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" size="sm" className="w-full text-xs gap-1.5">
              <span>Browse Docs</span>
              <ExternalLink className="size-3" />
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <MessageSquare className="size-4.5" />
            </div>
            <CardTitle className="text-sm mt-2">Community Chat</CardTitle>
            <CardDescription className="text-xs">
              Discuss features, share templates, and ask questions with developers.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" size="sm" className="w-full text-xs gap-1.5">
              <span>Join Discord</span>
              <ExternalLink className="size-3" />
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <LifeBuoy className="size-4.5" />
            </div>
            <CardTitle className="text-sm mt-2">Direct Support</CardTitle>
            <CardDescription className="text-xs">
              Reach out to our engineering team for enterprise inquiries.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button size="sm" className="w-full text-xs">
              <span>Contact Us</span>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4 pt-4">
        <h2 className="text-lg font-semibold">Frequently Asked Questions</h2>
        <div className="grid gap-3">
          {faqs.map((faq, i) => (
            <Card key={i} className="p-4">
              <h3 className="font-medium text-xs sm:text-sm">{faq.q}</h3>
              <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{faq.a}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
