import AppSidebar from "@/components/AppSidebar"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import React from "react"

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <SidebarProvider>
        <AppSidebar />
            <main>
            {children}
            </main>
      </SidebarProvider>
    </div>
  )
}
