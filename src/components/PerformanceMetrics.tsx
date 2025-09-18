import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Badge } from './ui/badge'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar } from 'recharts'
import { TrendingUp, TrendingDown, Activity, Target } from 'lucide-react'
import { useState } from 'react'

const performanceData = [
  { date: '2024-01-01', speed: 85, endurance: 78, strength: 82, agility: 80 },
  { date: '2024-01-08', speed: 87, endurance: 80, strength: 84, agility: 82 },
  { date: '2024-01-15', speed: 86, endurance: 82, strength: 86, agility: 85 },
  { date: '2024-01-22', speed: 89, endurance: 85, strength: 88, agility: 87 },
  { date: '2024-01-29', speed: 92, endurance: 87, strength: 90, agility: 89 },
  { date: '2024-02-05', speed: 94, endurance: 90, strength: 92, agility: 91 }
]

const radarData = [
  { subject: 'Speed', A: 92, B: 88, fullMark: 100 },
  { subject: 'Endurance', A: 90, B: 85, fullMark: 100 },
  { subject: 'Strength', A: 92, B: 90, fullMark: 100 },
  { subject: 'Agility', A: 91, B: 87, fullMark: 100 },
  { subject: 'Coordination', A: 88, B: 85, fullMark: 100 },
  { subject: 'Focus', A: 95, B: 82, fullMark: 100 }
]

const comparisonData = [
  { name: 'Sarah Johnson', speed: 95, endurance: 90, strength: 92, agility: 91 },
  { name: 'Mike Chen', speed: 88, endurance: 85, strength: 90, agility: 87 },
  { name: 'Emma Davis', speed: 92, endurance: 88, strength: 89, agility: 94 },
  { name: 'Alex Rodriguez', speed: 85, endurance: 92, strength: 87, agility: 85 },
  { name: 'Jessica Liu', speed: 90, endurance: 87, strength: 88, agility: 92 }
]

const metrics = [
  { 
    name: 'Average Speed', 
    value: '92%', 
    change: '+5%', 
    trend: 'up',
    description: 'Sprint and reaction times'
  },
  { 
    name: 'Endurance Level', 
    value: '90%', 
    change: '+3%', 
    trend: 'up',
    description: 'Cardiovascular fitness'
  },
  { 
    name: 'Strength Index', 
    value: '92%', 
    change: '+2%', 
    trend: 'up',
    description: 'Overall physical strength'
  },
  { 
    name: 'Injury Rate', 
    value: '2.3%', 
    change: '-1.2%', 
    trend: 'down',
    description: 'Monthly injury percentage'
  }
]

export function PerformanceMetrics() {
  const [selectedSport, setSelectedSport] = useState('all')
  const [timeRange, setTimeRange] = useState('6months')

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Performance Metrics</h1>
          <p className="text-muted-foreground">Analyze team and individual performance data</p>
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
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Time Range" />
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

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">{metric.name}</CardTitle>
                {metric.trend === 'up' ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <div className="flex items-center gap-2">
                <Badge variant={metric.trend === 'up' ? 'default' : 'destructive'}>
                  {metric.change}
                </Badge>
                <p className="text-xs text-muted-foreground">{metric.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Performance Analysis Tabs */}
      <Tabs defaultValue="trends" className="space-y-4">
        <TabsList>
          <TabsTrigger value="trends">Performance Trends</TabsTrigger>
          <TabsTrigger value="comparison">Player Comparison</TabsTrigger>
          <TabsTrigger value="analysis">Skill Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Over Time</CardTitle>
              <CardDescription>Track key performance indicators across time periods</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="speed" stroke="#8884d8" strokeWidth={2} name="Speed" />
                  <Line type="monotone" dataKey="endurance" stroke="#82ca9d" strokeWidth={2} name="Endurance" />
                  <Line type="monotone" dataKey="strength" stroke="#ffc658" strokeWidth={2} name="Strength" />
                  <Line type="monotone" dataKey="agility" stroke="#ff7300" strokeWidth={2} name="Agility" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Performers Comparison</CardTitle>
              <CardDescription>Compare performance metrics across top team members</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={comparisonData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="speed" fill="#8884d8" name="Speed" />
                  <Bar dataKey="endurance" fill="#82ca9d" name="Endurance" />
                  <Bar dataKey="strength" fill="#ffc658" name="Strength" />
                  <Bar dataKey="agility" fill="#ff7300" name="Agility" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Skill Distribution</CardTitle>
                <CardDescription>Radar chart showing skill balance</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    <Radar name="Current" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                    <Radar name="Target" dataKey="B" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Insights</CardTitle>
                <CardDescription>AI-generated performance analysis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Target className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Strength Improvement</p>
                    <p className="text-sm text-muted-foreground">
                      Team strength metrics have improved by 8% over the last month, particularly in upper body exercises.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Activity className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Endurance Focus Needed</p>
                    <p className="text-sm text-muted-foreground">
                      Consider adding more cardiovascular training to improve overall endurance scores.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <TrendingUp className="h-5 w-5 text-orange-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Top Performers</p>
                    <p className="text-sm text-muted-foreground">
                      Sarah Johnson and Emma Davis are showing exceptional progress across all metrics.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}