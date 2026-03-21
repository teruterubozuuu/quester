import React, { useState } from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "./ui/sidebar"
import Link from "next/link"
import {
  ChevronLeft,
  ChevronRight,
  CircleUser,
  Cog,
  Home,
  Joystick,
  ScrollText,
  Swords,
  Users,
} from "lucide-react"
import NavUser from "./NavUser"
import userProps from "@/types/userTypes"
import logo from "public/logo-light.png"
import { Button } from "./ui/button"

interface AppSidebarProps {
  data: userProps | null
}

export default function AppSidebar({ data }: AppSidebarProps) {
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"

  const menuItems = [
    { id: "dashboard", label: "Dashboard", href: "/dashboard", icon: <Home /> },
    { id: "quests", label: "Quests", href: "/quests", icon: <Swords /> },
    {
      id: "backlogs",
      label: "Backlogs",
      href: "/backlogs",
      icon: <ScrollText />,
    },
    {
      id: "community",
      label: "Community",
      href: "/community",
      icon: <Users />,
    },
    { id: "profile", label: "Profile", href: "/profile", icon: <CircleUser /> },
    { id: "settings", label: "Settings", href: "/settings", icon: <Cog /> },
  ]

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        <div
          className={`flex items-center gap-2 py-2 ${isCollapsed ? "flex-col justify-center" : ""}`}
        >
          <div className="flex shrink-0 items-center gap-2 overflow-hidden">
            {/* Force the logo size */}
            <img
              src={logo.src}
              alt="Logo"
              className="h-8! w-8! shrink-0 rounded-sm"
            />
            {!isCollapsed && (
              <span className="text-2xl font-semibold whitespace-nowrap uppercase">
                Quester
              </span>
            )}
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.id}>
              <SidebarMenuButton asChild tooltip={item.label} className="h-12">
                {/* Remove the extra <div>, just use Link */}
                <Link href={item.href}>
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter>
        <NavUser data={data} isCollapsed={isCollapsed} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
