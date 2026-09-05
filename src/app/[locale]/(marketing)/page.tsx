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

export default function HomePage() {
  return (
    <>
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
    </>
  )
}
