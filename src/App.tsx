import { useState } from 'react'
import { SidebarProvider } from './components/ui/sidebar'
import { AppSidebar } from './components/AppSidebar'
import { DashboardOverview } from './components/DashboardOverview'
import { PlayerRoster } from './components/PlayerRoster'
import { PerformanceMetrics } from './components/PerformanceMetrics'
import { PlayerProfile } from './components/PlayerProfile'
import { ActivityTracker } from './components/ActivityTracker'
import { CoachInsights } from './components/CoachInsights'

export default function App() {
  const [currentView, setCurrentView] = useState('dashboard')
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null)

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardOverview />
      case 'roster':
        return <PlayerRoster onPlayerSelect={(playerId) => {
          setSelectedPlayer(playerId)
          setCurrentView('player-profile')
        }} />
      case 'performance':
        return <PerformanceMetrics />
      case 'player-profile':
        return <PlayerProfile playerId={selectedPlayer} onBack={() => setCurrentView('roster')} />
      case 'activities':
        return <ActivityTracker />
      case 'insights':
        return <CoachInsights />
      default:
        return <DashboardOverview />
    }
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar currentView={currentView} onViewChange={setCurrentView} />
        <main className="flex-1 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </SidebarProvider>
  )
}