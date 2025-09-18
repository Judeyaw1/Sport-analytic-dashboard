import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Search, Eye } from 'lucide-react'
import { useState } from 'react'

interface Player {
  id: string
  name: string
  sport: string
  position: string
  grade: number
  performance: number
  status: 'Active' | 'Injured' | 'Inactive'
  lastActivity: string
}

const players: Player[] = [
  { id: '1', name: 'Sarah Johnson', sport: 'Track & Field', position: 'Sprinter', grade: 12, performance: 95, status: 'Active', lastActivity: '2 hours ago' },
  { id: '2', name: 'Mike Chen', sport: 'Basketball', position: 'Point Guard', grade: 11, performance: 88, status: 'Active', lastActivity: '4 hours ago' },
  { id: '3', name: 'Emma Davis', sport: 'Soccer', position: 'Midfielder', grade: 10, performance: 92, status: 'Active', lastActivity: '6 hours ago' },
  { id: '4', name: 'Alex Rodriguez', sport: 'Swimming', position: 'Freestyle', grade: 12, performance: 85, status: 'Active', lastActivity: '8 hours ago' },
  { id: '5', name: 'Jessica Liu', sport: 'Tennis', position: 'Singles', grade: 11, performance: 90, status: 'Injured', lastActivity: '2 days ago' },
  { id: '6', name: 'Ryan Thompson', sport: 'Football', position: 'Quarterback', grade: 12, performance: 87, status: 'Active', lastActivity: '1 hour ago' },
  { id: '7', name: 'Olivia Martinez', sport: 'Volleyball', position: 'Setter', grade: 10, performance: 89, status: 'Active', lastActivity: '3 hours ago' },
  { id: '8', name: 'Daniel Kim', sport: 'Baseball', position: 'Pitcher', grade: 11, performance: 83, status: 'Inactive', lastActivity: '1 week ago' }
]

interface PlayerRosterProps {
  onPlayerSelect: (playerId: string) => void
}

export function PlayerRoster({ onPlayerSelect }: PlayerRosterProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [sportFilter, setSportFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  const filteredPlayers = players.filter(player => {
    const matchesSearch = player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         player.sport.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSport = sportFilter === 'all' || player.sport === sportFilter
    const matchesStatus = statusFilter === 'all' || player.status === statusFilter
    
    return matchesSearch && matchesSport && matchesStatus
  })

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Active': return 'default'
      case 'Injured': return 'destructive'
      case 'Inactive': return 'secondary'
      default: return 'default'
    }
  }

  const getPerformanceColor = (performance: number) => {
    if (performance >= 90) return 'text-green-600'
    if (performance >= 80) return 'text-yellow-600'
    return 'text-red-600'
  }

  const uniqueSports = Array.from(new Set(players.map(p => p.sport)))

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Player Roster</h1>
        <p className="text-muted-foreground">Manage and view all team members</p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search players..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={sportFilter} onValueChange={setSportFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filter by sport" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sports</SelectItem>
                {uniqueSports.map(sport => (
                  <SelectItem key={sport} value={sport}>{sport}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Injured">Injured</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Player Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPlayers.map((player) => (
          <Card key={player.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>{player.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-lg">{player.name}</CardTitle>
                  <CardDescription>Grade {player.grade} • {player.position}</CardDescription>
                </div>
                <Badge variant={getStatusVariant(player.status)}>
                  {player.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Sport:</span>
                <span className="font-medium">{player.sport}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Performance:</span>
                <span className={`font-bold ${getPerformanceColor(player.performance)}`}>
                  {player.performance}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Last Activity:</span>
                <span className="text-sm">{player.lastActivity}</span>
              </div>
              <Button 
                onClick={() => onPlayerSelect(player.id)}
                className="w-full"
                variant="outline"
              >
                <Eye className="h-4 w-4 mr-2" />
                View Profile
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPlayers.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">No players found matching your filters.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}