import type { Metadata, Viewport } from "next"
import { notFound } from "next/navigation"
import {
  Lexend,
  Inter,
  Geist,
  Plus_Jakarta_Sans,
  Manrope,
  Outfit,
  DM_Sans,
} from "next/font/google"
import "@/app/globals.css"
import { TooltipProvider } from "@/components/ui/tooltip"
import { ThemeProvider } from "@/providers/theme-provider"
import { siteConfig } from "@/config/site"
import { NextIntlClientProvider } from "next-intl"
import { getMessages, setRequestLocale } from "next-intl/server"
import { routing, type Locale } from "@/i18n/routing"

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
  display: "swap",
})

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
})

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
})

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  display: "swap",
})

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
})

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
})

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} — Modern Next.js Admin Template`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
  icons: {
    icon: "/favicon.ico",
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  width: "device-width",
  initialScale: 1,
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ locale: string }>
}>) {
  const { locale } = await params

  if (!routing.locales.includes(locale as Locale)) {
    notFound()
  }

  // Enable static rendering
  setRequestLocale(locale)

  const messages = await getMessages()
  const isRtl = locale === "ar"

  return (
    <html
      lang={locale}
      dir={isRtl ? "rtl" : "ltr"}
      className={`${lexend.variable} ${inter.variable} ${geist.variable} ${plusJakartaSans.variable} ${manrope.variable} ${outfit.variable} ${dmSans.variable} font-sans h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var color = localStorage.getItem('theme-color') || 'zinc';
                var radius = localStorage.getItem('theme-radius') || '0.5';
                var layout = localStorage.getItem('theme-layout') || 'fluid';
                var sidebarVariant = localStorage.getItem('theme-sidebar-variant') || 'default';
                var font = localStorage.getItem('theme-font') || 'lexend';
                var displayFont = localStorage.getItem('theme-display-font') || 'lexend';
                document.documentElement.setAttribute('data-theme', color);
                document.documentElement.setAttribute('data-layout', layout);
                document.documentElement.setAttribute('data-sidebar-variant', sidebarVariant);
                document.documentElement.setAttribute('data-font', font);
                document.documentElement.setAttribute('data-display-font', displayFont);
                document.documentElement.style.setProperty('--radius', radius + 'rem');
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground antialiased selection:bg-primary/10 selection:text-primary">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextIntlClientProvider messages={messages} locale={locale}>
            <TooltipProvider>{children}</TooltipProvider>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
