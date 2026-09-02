import Link from "next/link"
import { LayoutDashboard } from "lucide-react"
import { siteConfig } from "@/config/site"
import { footerNav } from "@/config/navigation"

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-background text-muted-foreground transition-colors">
      <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="col-span-2 space-y-4">
            <Link
              href="/"
              className="flex items-center gap-2.5 font-bold tracking-tight text-foreground"
            >
              <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <LayoutDashboard className="size-4" />
              </span>
              <span className="font-heading text-lg font-semibold tracking-tight">
                {siteConfig.name}
              </span>
            </Link>
            <p className="max-w-sm text-xs text-muted-foreground leading-relaxed">
              {siteConfig.description}
            </p>
          </div>

          {/* Navigation Links Columns */}
          {footerNav.map((section) => (
            <div key={section.title} className="space-y-3">
              <h4 className="font-heading text-xs font-semibold uppercase tracking-wider text-foreground">
                {section.title}
              </h4>
              <ul className="space-y-2 text-xs">
                {section.items.map((item) => (
                  <li key={item.title}>
                    {item.external ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-foreground transition-colors"
                      >
                        {item.title}
                      </a>
                    ) : (
                      <Link
                        href={item.href}
                        className="hover:text-foreground transition-colors"
                      >
                        {item.title}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar with Copyright */}
        <div className="mt-12 pt-6 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© 2026 {siteConfig.name}. All rights reserved.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Next.js 16</span>
            <span>•</span>
            <span>TypeScript</span>
            <span>•</span>
            <span>Tailwind CSS</span>
            <span>•</span>
            <span>shadcn/ui</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
