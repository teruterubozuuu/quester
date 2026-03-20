import React from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar"
import Link from "next/link"
import { CircleUser, Home, Joystick, ScrollText, Swords, Users } from "lucide-react"

export default function AppSidebar() {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", href: "/dashboard", icon: <Home /> },
    { id: "quests", label: "Quests", href: "/quests", icon: <Swords /> },
    { id: "backlogs", label: "Backlogs", href: "/backlogs", icon: <ScrollText /> },
    { id: "community", label: "Community", href: "/community", icon: <Users /> },
    { id: "profile", label: "Profile", href: "/profile", icon: <CircleUser /> },
  ]
  return (
    <Sidebar>
      <SidebarHeader className="px-4">
        <div className="flex gap-2 py-4">
        <Joystick/>
        <span className="text-lg font-semibold">Quester</span>
        </div>
      </SidebarHeader>
      <SidebarContent className="px-2">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuButton key={item.id} className="text-md cursor-pointer">
              <span>{item.icon}</span>
              <Link href={item.id}>{item.label}</Link>
            </SidebarMenuButton>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}
