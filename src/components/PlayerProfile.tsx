import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Progress } from './ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'
import { ArrowLeft, Mail, Phone, MapPin, Calendar, Award } from 'lucide-react'

const playerData = {
  '1': {
    name: 'Sarah Johnson',
    sport: 'Track & Field',
    position: 'Sprinter',
    grade: 12,
    email: 'sarah.johnson@email.com',
    phone: '(555) 123-4567',
    address: '123 Main St, City, State',
    joinDate: 'September 2021',
    performance: 95,
    status: 'Active',
    bio: 'Sarah is a dedicated sprinter with exceptional speed and technique. She holds the school record in 100m and 200m events.',
    achievements: [
      'State Champion 100m (2023)',
      'Regional Record Holder 200m',
      'Team Captain (2023-2024)',
      'Academic Excellence Award'
    ],
    stats: {
      speed: 95,
      endurance: 85,
      strength: 88,
      agility: 92,
      coordination: 90,
      focus: 94
    },
    recentPerformance: [
      { date: '2024-01-01', score: 88 },
      { date: '2024-01-08', score: 90 },
      { date: '2024-01-15', score: 92 },
      { date: '2024-01-22', score: 94 },
      { date: '2024-01-29', score: 95 },
      { date: '2024-02-05', score: 97 }
    ],
    recentActivities: [
      { date: '2024-02-05', activity: 'Sprint Training', duration: '2h', performance: 'Excellent' },
      { date: '2024-02-03', activity: 'Team Meeting', duration: '1h', performance: 'Good' },
      { date: '2024-02-01', activity: 'Strength Training', duration: '1.5h', performance: 'Excellent' },
      { date: '2024-01-30', activity: 'Competition Prep', duration: '3h', performance: 'Excellent' }
    ]
  }
}

interface PlayerProfileProps {
  playerId: string | null
  onBack: () => void
}

export function PlayerProfile({ playerId, onBack }: PlayerProfileProps) {
  if (!playerId || !playerData[playerId as keyof typeof playerData]) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Roster
          </Button>
        </div>
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">Player not found.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const player = playerData[playerId as keyof typeof playerData]
  const radarData = Object.entries(player.stats).map(([key, value]) => ({
    subject: key.charAt(0).toUpperCase() + key.slice(1),
    value,
    fullMark: 100
  }))

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Roster
        </Button>
      </div>

      {/* Player Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col items-center md:items-start gap-4">
              <Avatar className="h-24 w-24">
                <AvatarFallback className="text-2xl">
                  {player.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <Badge variant={player.status === 'Active' ? 'default' : 'secondary'}>
                {player.status}
              </Badge>
            </div>
            
            <div className="flex-1 space-y-4">
              <div>
                <h1 className="text-3xl font-bold">{player.name}</h1>
                <p className="text-lg text-muted-foreground">
                  {player.sport} • {player.position} • Grade {player.grade}
                </p>
              </div>
              
              <p className="text-sm text-muted-foreground">{player.bio}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{player.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{player.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{player.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Joined {player.joinDate}</span>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{player.performance}%</div>
              <p className="text-sm text-muted-foreground">Overall Performance</p>
              <Progress value={player.performance} className="mt-2 w-24" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Player Details Tabs */}
      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="activities">Activities</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Trend</CardTitle>
                <CardDescription>Recent performance scores over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={player.recentPerformance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="score" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      dot={{ fill: 'hsl(var(--primary))' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Skill Assessment</CardTitle>
                <CardDescription>Current skill levels across key areas</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    <Radar 
                      name="Skills" 
                      dataKey="value" 
                      stroke="hsl(var(--primary))" 
                      fill="hsl(var(--primary))" 
                      fillOpacity={0.6} 
                    />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Detailed Stats</CardTitle>
              <CardDescription>Breakdown of individual skill metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(player.stats).map(([skill, value]) => (
                  <div key={skill} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="capitalize">{skill}</span>
                      <span className="font-medium">{value}%</span>
                    </div>
                    <Progress value={value} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activities" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
              <CardDescription>Training sessions and activities log</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {player.recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between py-3 border-b last:border-b-0">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      <div>
                        <p className="font-medium">{activity.activity}</p>
                        <p className="text-sm text-muted-foreground">{activity.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{activity.duration}</span>
                      <Badge variant={
                        activity.performance === 'Excellent' ? 'default' :
                        activity.performance === 'Good' ? 'secondary' : 'outline'
                      }>
                        {activity.performance}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Achievements & Awards</CardTitle>
              <CardDescription>Recognition and accomplishments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {player.achievements.map((achievement, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                    <Award className="h-5 w-5 text-yellow-600" />
                    <span>{achievement}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}