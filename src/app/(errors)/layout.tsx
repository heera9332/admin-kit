import { ThemeToggle } from "@/components/theme-toggle"

export default function ErrorsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-md mx-auto">{children}</div>
    </div>
  )
}
