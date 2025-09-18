import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Progress } from './ui/progress'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { Users, TrendingUp, Activity, Award } from 'lucide-react'

const performanceData = [
  { month: 'Jan', performance: 85 },
  { month: 'Feb', performance: 88 },
  { month: 'Mar', performance: 82 },
  { month: 'Apr', performance: 90 },
  { month: 'May', performance: 92 },
  { month: 'Jun', performance: 95 }
]

const activityData = [
  { day: 'Mon', activities: 12 },
  { day: 'Tue', activities: 15 },
  { day: 'Wed', activities: 8 },
  { day: 'Thu', activities: 18 },
  { day: 'Fri', activities: 14 },
  { day: 'Sat', activities: 10 },
  { day: 'Sun', activities: 6 }
]

const recentActivities = [
  { player: 'Sarah Johnson', activity: 'Track Practice', time: '2 hours ago', performance: 'Excellent' },
  { player: 'Mike Chen', activity: 'Basketball Scrimmage', time: '4 hours ago', performance: 'Good' },
  { player: 'Emma Davis', activity: 'Soccer Training', time: '6 hours ago', performance: 'Excellent' },
  { player: 'Alex Rodriguez', activity: 'Swimming Laps', time: '8 hours ago', performance: 'Average' }
]

export function DashboardOverview() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
        <p className="text-muted-foreground">Track your team's performance and activities</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Total Athletes</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">34</div>
            <p className="text-xs text-muted-foreground">
              +2 from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Avg Performance</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <p className="text-xs text-muted-foreground">
              +5% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              Currently ongoing
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Team Goals</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8/10</div>
            <p className="text-xs text-muted-foreground">
              <Progress value={80} className="mt-2" />
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Performance Trend</CardTitle>
            <CardDescription>Monthly team performance average</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="performance" 
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
            <CardTitle>Weekly Activity</CardTitle>
            <CardDescription>Training sessions this week</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="activities" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
          <CardDescription>Latest training sessions and updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <div>
                    <p className="font-medium">{activity.player}</p>
                    <p className="text-sm text-muted-foreground">{activity.activity}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={
                    activity.performance === 'Excellent' ? 'default' :
                    activity.performance === 'Good' ? 'secondary' : 'outline'
                  }>
                    {activity.performance}
                  </Badge>
                  <span className="text-sm text-muted-foreground">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}