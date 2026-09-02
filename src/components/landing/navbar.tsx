"use client"

import * as React from "react"
import Link from "next/link"
import { Menu, ArrowRight, LayoutDashboard } from "lucide-react"
import { siteConfig } from "@/config/site"
import { marketingNav } from "@/config/navigation"
import { Button, buttonVariants } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { GithubIcon } from "@/components/icons"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet"

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/85 backdrop-blur-md transition-colors">
      <div className="container mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="flex items-center gap-2.5 font-bold tracking-tight text-foreground group"
          >
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm transition-transform group-hover:scale-105">
              <LayoutDashboard className="size-4.5" />
            </span>
            <span className="font-heading text-lg font-semibold tracking-tight">
              {siteConfig.name}
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 pl-4" aria-label="Main Navigation">
            {marketingNav.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-muted/50 rounded-md"
              >
                {item.title}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right CTA Actions (Desktop) */}
        <div className="hidden md:flex items-center gap-2">
          <ThemeToggle />

          <a
            href={siteConfig.links.github}
            target="_blank"
            rel="noreferrer"
            className={buttonVariants({ variant: "ghost", size: "icon-sm" })}
            aria-label="View on GitHub"
          >
                  <GithubIcon className="size-4" />
          </a>

          <Link
            href="/dashboard"
            className={buttonVariants({ variant: "default", size: "sm" })}
          >
            <span>Get Started</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>

        {/* Mobile Navigation */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Toggle navigation menu"
                />
              }
            >
              <Menu className="size-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-[80vw] max-w-sm flex flex-col p-6">
              <SheetHeader className="p-0 text-left border-b border-border/50 pb-4">
                <SheetTitle className="flex items-center gap-2.5">
                  <span className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
                    <LayoutDashboard className="size-4" />
                  </span>
                  <span className="font-heading text-lg font-semibold">
                    {siteConfig.name}
                  </span>
                </SheetTitle>
              </SheetHeader>

              <div className="flex flex-col gap-2 py-6 flex-1">
                {marketingNav.map((item) => (
                  <SheetClose
                    key={item.title}
                    render={
                      <Link
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center py-2 text-base font-medium text-foreground hover:text-primary transition-colors"
                      />
                    }
                  >
                    {item.title}
                  </SheetClose>
                ))}
              </div>

              <div className="flex flex-col gap-3 pt-4 border-t border-border/50">
                <a
                  href={siteConfig.links.github}
                  target="_blank"
                  rel="noreferrer"
                  className={buttonVariants({
                    variant: "outline",
                    size: "default",
                    className: "w-full justify-center gap-2",
                  })}
                >
                        <GithubIcon className="size-4" />
                  <span>GitHub Repository</span>
                </a>

                <SheetClose
                  render={
                    <Link
                      href="/dashboard"
                      onClick={() => setIsOpen(false)}
                      className={buttonVariants({
                        variant: "default",
                        size: "default",
                        className: "w-full justify-center gap-2",
                      })}
                    />
                  }
                >
                  <span>Get Started</span>
                  <ArrowRight className="size-4" />
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
