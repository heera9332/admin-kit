import { cookies } from "next/headers"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { SearchProvider } from "@/context/search-provider"
import { RBACProvider } from "@/context/rbac-provider"
import { BreadcrumbProvider } from "@/context/breadcrumb-provider"
import { MediaProvider } from "@/context/media-provider"
import { CmsProvider } from "@/context/cms-provider"
import { EcommerceProvider } from "@/context/ecommerce-provider"
import { TasksProvider } from "@/context/tasks-provider"
import { NotificationsProvider } from "@/context/notifications-provider"
import { NotesProvider } from "@/context/notes-provider"

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
        <MediaProvider>
          <CmsProvider>
            <EcommerceProvider>
              <TasksProvider>
                <NotificationsProvider>
                  <NotesProvider>
                    <SearchProvider>
                      <SidebarProvider defaultOpen={defaultOpen}>
                        <AppSidebar />
                        <SidebarInset>
                          <SiteHeader />
                          <div className="flex flex-1 flex-col gap-4 p-4 overflow-y-auto min-w-0">
                            {children}
                          </div>
                        </SidebarInset>
                      </SidebarProvider>
                    </SearchProvider>
                  </NotesProvider>
                </NotificationsProvider>
              </TasksProvider>
          </EcommerceProvider>
          </CmsProvider>
        </MediaProvider>
      </BreadcrumbProvider>
    </RBACProvider>
  )
}
