import { AnnouncementBar } from "@/components/landing/announcement-bar"
import { Navbar } from "@/components/landing/navbar"
import { Hero } from "@/components/landing/hero"
import { DashboardPreview } from "@/components/landing/dashboard-preview"
import { TechStack } from "@/components/landing/tech-stack"
import { Features } from "@/components/landing/features"
import { DashboardShowcase } from "@/components/landing/dashboard-showcase"
import { ComponentShowcase } from "@/components/landing/component-showcase"
import { TableShowcase } from "@/components/landing/table-showcase"
import { DeveloperExperience } from "@/components/landing/developer-experience"
import { Architecture } from "@/components/landing/architecture"
import { ThemeShowcase } from "@/components/landing/theme-showcase"
import { FinalCta } from "@/components/landing/final-cta"
import { Footer } from "@/components/landing/footer"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground selection:bg-primary/10 selection:text-primary">
      <AnnouncementBar />
      <Navbar />
      <main className="flex-1">
        <Hero />
        <DashboardPreview />
        <TechStack />
        <Features />
        <DashboardShowcase />
        <ComponentShowcase />
        <TableShowcase />
        <DeveloperExperience />
        <Architecture />
        <ThemeShowcase />
        <FinalCta />
      </main>
      <Footer />
    </div>
  )
}
