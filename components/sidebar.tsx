"use client"

import {
  LayoutDashboard,
  Search,
  BarChart3,
  GitCompare,
  Settings,
  ChevronLeft,
  ChevronRight,
  Building2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface SidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  companiesCount: number
}

const navigation = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "research", label: "Research", icon: Search },
  { id: "comparison", label: "Compare", icon: GitCompare },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "settings", label: "Settings", icon: Settings },
]

export function Sidebar({ activeTab, setActiveTab, isOpen, setIsOpen, companiesCount }: SidebarProps) {
  return (
    <div
      className={cn(
        "fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white dark:bg-slate-900 border-r transition-all duration-300 z-40",
        isOpen ? "w-64" : "w-16",
      )}
    >
      <div className="flex flex-col h-full">
        <div className="p-4 border-b">
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)} className="ml-auto">
            {isOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navigation.map((item) => (
            <Button
              key={item.id}
              variant={activeTab === item.id ? "default" : "ghost"}
              className={cn("w-full justify-start", !isOpen && "px-2")}
              onClick={() => setActiveTab(item.id)}
            >
              <item.icon className="h-4 w-4" />
              {isOpen && (
                <>
                  <span className="ml-2">{item.label}</span>
                  {item.id === "research" && companiesCount > 0 && (
                    <Badge variant="secondary" className="ml-auto">
                      {companiesCount}
                    </Badge>
                  )}
                </>
              )}
            </Button>
          ))}
        </nav>

        {isOpen && (
          <div className="p-4 border-t">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Building2 className="h-4 w-4" />
              <span>{companiesCount} Companies</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
