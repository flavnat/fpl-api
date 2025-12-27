"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  BookOpen,
  Code,
  FileJson,
  Layers,
  Users,
  Calendar,
  Trophy,
  Server,
  Heart,
  Key,
  RefreshCw,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar"

const navigation = [
  {
    title: "Getting Started",
    items: [
      { title: "Introduction", href: "/docs", icon: Home },
      { title: "Base URL", href: "/docs/base-url", icon: Server },
    ],
  },
  {
    title: "Authentication",
    items: [
      { title: "Register", href: "/docs/auth/register", icon: Users },
      { title: "API Keys", href: "/docs/auth/api-keys", icon: Key },
    ],
  },
  {
    title: "GraphQL API",
    items: [
      { title: "Overview", href: "/docs/graphql", icon: Code },
      { title: "Elements (Players)", href: "/docs/graphql/elements", icon: Users },
      { title: "Teams", href: "/docs/graphql/teams", icon: Trophy },
      { title: "Fixtures", href: "/docs/graphql/fixtures", icon: Calendar },
      { title: "Events (Gameweeks)", href: "/docs/graphql/events", icon: Layers },
      { title: "Element Types", href: "/docs/graphql/element-types", icon: BookOpen },
    ],
  },
  {
    title: "REST API",
    items: [
      { title: "Endpoints", href: "/docs/endpoints", icon: Server },
      { title: "Response Format", href: "/docs/response-format", icon: FileJson },
      { title: "Sync Data", href: "/docs/sync", icon: RefreshCw },
      { title: "Health Check", href: "/docs/health", icon: Heart },
    ],
  },
]

export function DocsSidebar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="border-b px-4 py-3">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <Code className="h-6 w-6 text-primary" />
            <span>FPL API</span>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          {navigation.map((group) => (
            <SidebarGroup key={group.title}>
              <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild isActive={pathname === item.href}>
                        <Link href={item.href}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b px-6">
          <SidebarTrigger />
          <h1 className="text-sm font-medium">Documentation</h1>
        </header>
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
