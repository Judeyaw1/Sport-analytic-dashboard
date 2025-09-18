import { Activity, BarChart3, Home, Users, TrendingUp, Target } from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from './ui/sidebar'

interface AppSidebarProps {
  currentView: string
  onViewChange: (view: string) => void
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'roster', label: 'Player Roster', icon: Users },
  { id: 'performance', label: 'Performance', icon: BarChart3 },
  { id: 'activities', label: 'Activities', icon: Activity },
  { id: 'insights', label: 'Coach Insights', icon: TrendingUp }
]

export function AppSidebar({ currentView, onViewChange }: AppSidebarProps) {
  return (
    <Sidebar>
      <SidebarHeader className="border-b px-6 py-4">
        <div className="flex items-center gap-2">
          <Target className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-lg font-semibold">SportTracker</h1>
            <p className="text-sm text-muted-foreground">High School Athletics</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => onViewChange(item.id)}
                    isActive={currentView === item.id}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}