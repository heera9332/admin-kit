import { cookies } from "next/headers"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { SearchProvider } from "@/context/search-provider"
import { RBACProvider } from "@/context/rbac-provider"
import { BreadcrumbProvider } from "@/context/breadcrumb-provider"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar_state")?.value !== "false"

  return (
    <RBACProvider>
      <BreadcrumbProvider>
        <SearchProvider>
          <SidebarProvider defaultOpen={defaultOpen}>
            <AppSidebar />
            <SidebarInset>
              <SiteHeader />
              <div className="flex flex-1 flex-col gap-4 p-4 overflow-y-auto">
                {children}
              </div>
            </SidebarInset>
          </SidebarProvider>
        </SearchProvider>
      </BreadcrumbProvider>
    </RBACProvider>
  )
}
