"use client"
import { useSession } from "next-auth/react"
import AppSidebar from "@/components/AppSidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { supabase } from "@/lib/supabase"
import userProps from "@/types/userTypes"
import React, { useEffect, useState } from "react"
import { TooltipProvider } from "@/components/ui/tooltip"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { usePathname } from "next/navigation"

export default function layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [userData, setuserData] = useState<userProps | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      //fetch only if we have a logged-in user ID
      const userId = session?.user?.id
      if (!userId) return

      console.log("Fetching data for ID:", userId) // Debug: Check your console!

      const { data, error } = await supabase
        .from("users")
        .select("username, email")
        .eq("id", userId) // Filter by the session ID
        .single()
      if (error) {
        console.error(error)
      } else {
        setuserData(data as userProps)
      }
    }
    fetchData()
  }, [session?.user?.id])

  return (
    <div>
      <TooltipProvider>
        <SidebarProvider>
          <AppSidebar data={userData} />
          <main className="p-4">
            <header className="flex items-center gap-2">
              <SidebarTrigger />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbPage>Quester</BreadcrumbPage>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>
                      {pathname
                        .split("/")
                        .filter(Boolean)
                        .pop()
                        ?.toLowerCase()
                        ?.replace(/^\w/, (char) => char.toUpperCase()) ||
                        "Home"}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </header>
            {children}
          </main>
        </SidebarProvider>
      </TooltipProvider>
    </div>
  )
}
