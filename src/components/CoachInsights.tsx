import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Progress } from './ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'
import { TrendingUp, TrendingDown, AlertTriangle, Star, Users, Activity } from 'lucide-react'
import { useState } from 'react'

const teamPerformanceData = [
  { month: 'Jan', overall: 82, individual: 78, team: 85 },
  { month: 'Feb', overall: 85, individual: 82, team: 87 },
  { month: 'Mar', overall: 83, individual: 80, team: 86 },
  { month: 'Apr', overall: 88, individual: 86, team: 90 },
  { month: 'May', overall: 91, individual: 89, team: 93 },
  { month: 'Jun', overall: 94, individual: 92, team: 96 }
]

const playerProgressData = [
  { name: 'Sarah Johnson', improvement: 15, current: 95, potential: 98 },
  { name: 'Mike Chen', improvement: 12, current: 88, potential: 92 },
  { name: 'Emma Davis', improvement: 18, current: 92, potential: 95 },
  { name: 'Alex Rodriguez', improvement: 8, current: 85, potential: 90 },
  { name: 'Jessica Liu', improvement: 10, current: 90, potential: 93 },
  { name: 'Ryan Thompson', improvement: 14, current: 87, potential: 91 }
]

const sportDistribution = [
  { name: 'Track & Field', value: 8, color: '#8884d8' },
  { name: 'Basketball', value: 6, color: '#82ca9d' },
  { name: 'Soccer', value: 7, color: '#ffc658' },
  { name: 'Swimming', value: 4, color: '#ff7300' },
  { name: 'Tennis', value: 3, color: '#00ff87' },
  { name: 'Others', value: 6, color: '#ff8787' }
]

const insights = [
  {
    type: 'success',
    title: 'Performance Improvement',
    description: 'Team performance has increased by 12% over the last quarter, with particularly strong gains in endurance metrics.',
    players: ['Sarah Johnson', 'Emma Davis'],
    action: 'Continue current training regimen'
  },
  {
    type: 'warning',
    title: 'Injury Risk Alert',
    description: 'High-intensity training frequency may be putting some players at risk for overuse injuries.',
    players: ['Mike Chen', 'Ryan Thompson'],
    action: 'Consider adding more recovery sessions'
  },
  {
    type: 'info',
    title: 'Skill Development Opportunity',
    description: 'Several players show potential for improvement in coordination and agility-based activities.',
    players: ['Alex Rodriguez', 'Daniel Kim'],
    action: 'Implement specialized agility training'
  },
  {
    type: 'success',
    title: 'Team Cohesion',
    description: 'Group activities and team sports are showing exceptional engagement and performance levels.',
    players: ['Basketball Team', 'Soccer Team'],
    action: 'Maintain current team building approach'
  }
]

const recommendations = [
  {
    priority: 'High',
    category: 'Training',
    title: 'Increase Recovery Time',
    description: 'Add 2 additional recovery sessions per week to prevent overtraining and reduce injury risk.',
    impact: 'Reduce injury risk by 30%'
  },
  {
    priority: 'Medium',
    category: 'Performance',
    title: 'Individual Skill Development',
    description: 'Focus on personalized training plans for players showing specific skill gaps.',
    impact: 'Improve individual scores by 8-12%'
  },
  {
    priority: 'High',
    category: 'Nutrition',
    title: 'Nutrition Education Program',
    description: 'Implement structured nutrition education to support training and recovery.',
    impact: 'Enhance recovery by 25%'
  },
  {
    priority: 'Low',
    category: 'Equipment',
    title: 'Equipment Upgrade',
    description: 'Consider upgrading training equipment for better performance tracking.',
    impact: 'Improve data accuracy by 15%'
  }
]

export function CoachInsights() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('6months')
  const [selectedSport, setSelectedSport] = useState('all')

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'success': return <TrendingUp className="h-5 w-5 text-green-600" />
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-600" />
      case 'info': return <Star className="h-5 w-5 text-blue-600" />
      default: return <Activity className="h-5 w-5 text-gray-600" />
    }
  }

  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case 'High': return 'destructive'
      case 'Medium': return 'default'
      case 'Low': return 'secondary'
      default: return 'outline'
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Coach Insights</h1>
          <p className="text-muted-foreground">AI-powered analysis and recommendations for your team</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedSport} onValueChange={setSelectedSport}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Sport" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sports</SelectItem>
              <SelectItem value="track">Track & Field</SelectItem>
              <SelectItem value="basketball">Basketball</SelectItem>
              <SelectItem value="soccer">Soccer</SelectItem>
              <SelectItem value="swimming">Swimming</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">1 Month</SelectItem>
              <SelectItem value="3months">3 Months</SelectItem>
              <SelectItem value="6months">6 Months</SelectItem>
              <SelectItem value="1year">1 Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Key Insights Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Team Performance</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94%</div>
            <p className="text-xs text-muted-foreground">
              +12% from last quarter
            </p>
            <Progress value={94} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">At-Risk Players</CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              Injury risk monitoring
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Top Performers</CardTitle>
              <Star className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              Exceeding expectations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Team Engagement</CardTitle>
              <Users className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">97%</div>
            <p className="text-xs text-muted-foreground">
              Activity participation
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Analysis Tabs */}
      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="performance">Performance Analysis</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Team Performance Trends</CardTitle>
                <CardDescription>Overall, individual, and team performance over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={teamPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="overall" stroke="#8884d8" strokeWidth={2} name="Overall" />
                    <Line type="monotone" dataKey="individual" stroke="#82ca9d" strokeWidth={2} name="Individual" />
                    <Line type="monotone" dataKey="team" stroke="#ffc658" strokeWidth={2} name="Team" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sport Distribution</CardTitle>
                <CardDescription>Number of athletes by sport</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={sportDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {sportDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Player Progress Comparison</CardTitle>
              <CardDescription>Individual improvement rates and potential analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={playerProgressData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="current" fill="#8884d8" name="Current Performance" />
                  <Bar dataKey="potential" fill="#82ca9d" name="Potential Performance" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid gap-4">
            {insights.map((insight, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    {getInsightIcon(insight.type)}
                    <div className="flex-1">
                      <h3 className="font-medium mb-2">{insight.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{insight.description}</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {insight.players.map((player, playerIndex) => (
                          <Badge key={playerIndex} variant="outline">
                            {player}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Recommended Action:</span>
                        <span className="text-sm text-muted-foreground">{insight.action}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <div className="grid gap-4">
            {recommendations.map((rec, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium">{rec.title}</h3>
                        <Badge variant={getPriorityVariant(rec.priority)}>
                          {rec.priority} Priority
                        </Badge>
                        <Badge variant="outline">{rec.category}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{rec.description}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Expected Impact:</span>
                        <span className="text-sm text-green-600">{rec.impact}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}