import React, { useState, useMemo, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Calendar } from './ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Checkbox } from './ui/checkbox'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { cn } from './ui/utils'
import { format } from 'date-fns'
import { Plus, Calendar as CalendarIcon, Clock, MapPin, Users, Edit, Trash2, Play, CheckCircle, XCircle, Search, Filter, BarChart3 } from 'lucide-react'

interface Activity {
  id: string
  title: string
  type: string
  date: string
  time: string
  duration: string
  location: string
  participants: string[]
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled'
  description: string
  coach?: string
  equipment?: string[]
  notes?: string
  createdAt: string
  updatedAt: string
}

interface Participant {
  id: string
  name: string
  role: 'Player' | 'Coach' | 'Staff'
  position?: string
  team?: string
}

const participants: Participant[] = [
  { id: '1', name: 'Sarah Johnson', role: 'Player', position: 'Forward', team: 'Basketball' },
  { id: '2', name: 'Mike Chen', role: 'Player', position: 'Guard', team: 'Basketball' },
  { id: '3', name: 'Emma Davis', role: 'Player', position: 'Center', team: 'Basketball' },
  { id: '4', name: 'Ryan Thompson', role: 'Player', position: 'Guard', team: 'Basketball' },
  { id: '5', name: 'Daniel Kim', role: 'Player', position: 'Forward', team: 'Basketball' },
  { id: '6', name: 'Alex Rodriguez', role: 'Player', position: 'Swimmer', team: 'Swimming' },
  { id: '7', name: 'Jessica Liu', role: 'Player', position: 'Forward', team: 'Basketball' },
  { id: '8', name: 'Coach Martinez', role: 'Coach', team: 'Basketball' },
  { id: '9', name: 'Dr. Smith', role: 'Staff', team: 'Medical' },
  { id: '10', name: 'John Wilson', role: 'Staff', team: 'Equipment' }
]

const initialActivities: Activity[] = [
  {
    id: '1',
    title: 'Morning Sprint Training',
    type: 'Training',
    date: '2024-02-08',
    time: '07:00',
    duration: '2 hours',
    location: 'Track Field A',
    participants: ['Sarah Johnson', 'Mike Chen', 'Emma Davis'],
    status: 'Scheduled',
    description: 'Focus on acceleration and top speed development',
    coach: 'Coach Martinez',
    equipment: ['Cones', 'Stopwatch', 'Water bottles'],
    notes: 'Focus on proper form and breathing technique',
    createdAt: '2024-02-01T10:00:00Z',
    updatedAt: '2024-02-01T10:00:00Z'
  },
  {
    id: '2',
    title: 'Basketball Scrimmage',
    type: 'Practice',
    date: '2024-02-08',
    time: '15:30',
    duration: '1.5 hours',
    location: 'Gymnasium',
    participants: ['Mike Chen', 'Ryan Thompson', 'Daniel Kim'],
    status: 'In Progress',
    description: 'Full court scrimmage with defensive drills',
    coach: 'Coach Martinez',
    equipment: ['Basketballs', 'Whistle', 'Scoreboard'],
    notes: 'Emphasize defensive positioning and communication',
    createdAt: '2024-02-01T11:00:00Z',
    updatedAt: '2024-02-08T15:30:00Z'
  },
  {
    id: '3',
    title: 'Swimming Technique Session',
    type: 'Training',
    date: '2024-02-07',
    time: '16:00',
    duration: '2 hours',
    location: 'Pool',
    participants: ['Alex Rodriguez'],
    status: 'Completed',
    description: 'Freestyle stroke technique improvement',
    coach: 'Coach Martinez',
    equipment: ['Pull buoys', 'Kickboard', 'Fins'],
    notes: 'Excellent progress on stroke efficiency',
    createdAt: '2024-02-01T12:00:00Z',
    updatedAt: '2024-02-07T18:00:00Z'
  },
  {
    id: '4',
    title: 'Team Conditioning',
    type: 'Fitness',
    date: '2024-02-09',
    time: '06:00',
    duration: '1 hour',
    location: 'Fitness Center',
    participants: ['Sarah Johnson', 'Emma Davis', 'Jessica Liu'],
    status: 'Scheduled',
    description: 'Strength and conditioning workout',
    coach: 'Coach Martinez',
    equipment: ['Weights', 'Resistance bands', 'Mats'],
    notes: 'Focus on core strength and flexibility',
    createdAt: '2024-02-01T13:00:00Z',
    updatedAt: '2024-02-01T13:00:00Z'
  }
]

export function ActivityTracker() {
  const [activities, setActivities] = useState<Activity[]>(initialActivities)
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [isAddingActivity, setIsAddingActivity] = useState(false)
  const [isEditingActivity, setIsEditingActivity] = useState(false)
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('All')
  const [filterStatus, setFilterStatus] = useState('All')
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [newActivity, setNewActivity] = useState({
    title: '',
    type: '',
    date: '',
    time: '',
    duration: '',
    location: '',
    description: '',
    coach: '',
    equipment: [] as string[],
    notes: '',
    participants: [] as string[]
  })

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Scheduled': return 'default'
      case 'In Progress': return 'secondary'
      case 'Completed': return 'default'
      case 'Cancelled': return 'destructive'
      default: return 'default'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Scheduled': return 'text-blue-600'
      case 'In Progress': return 'text-orange-600'
      case 'Completed': return 'text-green-600'
      case 'Cancelled': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  // Form validation
  const validateForm = () => {
    const errors: Record<string, string> = {}
    
    if (!newActivity.title.trim()) {
      errors.title = 'Title is required'
    }
    if (!newActivity.type) {
      errors.type = 'Activity type is required'
    }
    if (!newActivity.date) {
      errors.date = 'Date is required'
    }
    if (!newActivity.time) {
      errors.time = 'Time is required'
    }
    if (!newActivity.duration.trim()) {
      errors.duration = 'Duration is required'
    }
    if (!newActivity.location.trim()) {
      errors.location = 'Location is required'
    }
    if (!newActivity.description.trim()) {
      errors.description = 'Description is required'
    }
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // CRUD Operations
  const addActivity = async () => {
    if (!validateForm()) {
      return
    }
    
    setIsSubmitting(true)
    
    try {
      const activity: Activity = {
        id: Date.now().toString(),
        ...newActivity,
        status: 'Scheduled',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      setActivities([...activities, activity])
      resetForm()
      setIsAddingActivity(false)
      
      // Show success feedback (you could add a toast notification here)
      console.log('Activity created successfully!')
    } catch (error) {
      console.error('Error creating activity:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const updateActivity = () => {
    if (!editingActivity) return
    
    const updatedActivity = {
      ...editingActivity,
      ...newActivity,
      updatedAt: new Date().toISOString()
    }
    
    setActivities(activities.map(a => a.id === editingActivity.id ? updatedActivity : a))
    resetForm()
    setIsEditingActivity(false)
    setEditingActivity(null)
  }

  const deleteActivity = (id: string) => {
    setActivities(activities.filter(a => a.id !== id))
  }

  const updateActivityStatus = (id: string, status: Activity['status']) => {
    setActivities(activities.map(a => 
      a.id === id ? { ...a, status, updatedAt: new Date().toISOString() } : a
    ))
  }

  const editActivity = (activity: Activity) => {
    setEditingActivity(activity)
    setNewActivity({
      title: activity.title,
      type: activity.type,
      date: activity.date,
      time: activity.time,
      duration: activity.duration,
      location: activity.location,
      description: activity.description,
      coach: activity.coach || '',
      equipment: activity.equipment || [],
      notes: activity.notes || '',
      participants: activity.participants
    })
    setSelectedParticipants(activity.participants)
    setIsEditingActivity(true)
  }

  const resetForm = () => {
    setNewActivity({
      title: '',
      type: '',
      date: '',
      time: '',
      duration: '',
      location: '',
      description: '',
      coach: '',
      equipment: [],
      notes: '',
      participants: []
    })
    setSelectedParticipants([])
    setSelectedDate(undefined)
    setFormErrors({})
    setIsSubmitting(false)
  }

  const handleDialogOpenChange = (open: boolean) => {
    setIsAddingActivity(open)
    if (open) {
      resetForm()
    }
  }

  // Set selectedDate when newActivity.date changes
  useEffect(() => {
    if (newActivity.date) {
      setSelectedDate(new Date(newActivity.date))
    }
  }, [newActivity.date])

  // Filtering and Search
  const filteredActivities = useMemo(() => {
    return activities.filter(activity => {
      const matchesSearch = activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           activity.location.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesType = filterType === 'All' || activity.type === filterType
      const matchesStatus = filterStatus === 'All' || activity.status === filterStatus
      const matchesParticipants = selectedParticipants.length === 0 || 
        selectedParticipants.some(participant => activity.participants.includes(participant))
      
      return matchesSearch && matchesType && matchesStatus && matchesParticipants
    })
  }, [activities, searchTerm, filterType, filterStatus, selectedParticipants])

  const todayActivities = filteredActivities.filter(activity => 
    activity.date === new Date().toISOString().split('T')[0]
  )

  const upcomingActivities = filteredActivities.filter(activity => 
    new Date(activity.date) > new Date() && activity.status !== 'Cancelled'
  )

  // Analytics
  const totalActivities = activities.length
  const activeSessions = activities.filter(a => a.status === 'In Progress').length
  const completedActivities = activities.filter(a => a.status === 'Completed').length
  const completionRate = totalActivities > 0 ? Math.round((completedActivities / totalActivities) * 100) : 0

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Activity Tracker</h1>
          <p className="text-muted-foreground">Manage training sessions and team activities</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </Button>
          <Dialog open={isAddingActivity} onOpenChange={handleDialogOpenChange}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Activity
            </Button>
          </DialogTrigger>
             <DialogContent 
               className="!w-[80vw] !h-[90vh] !max-w-none mx-auto my-2" 
               style={{ 
                 width: '80vw !important', 
                 height: '90vh !important',
                 maxWidth: 'none !important',
                 minWidth: '80vw !important',
                 maxHeight: '90vh !important'
               }}
               data-radix-dialog-content=""
             >
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">Activity Details</DialogTitle>
              <DialogDescription>
                Create a new training session or team activity.
              </DialogDescription>
            </DialogHeader>
             <div className="overflow-y-auto max-h-[70vh] pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100" style={{ scrollbarWidth: 'thin', height: '70vh' }}>
               <div className="grid gap-3 py-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title *</label>
                <Input
                  value={newActivity.title}
                  onChange={(e) => {
                    setNewActivity({...newActivity, title: e.target.value})
                    if (formErrors.title) {
                      setFormErrors({...formErrors, title: ''})
                    }
                  }}
                  placeholder="Brief description of the activity"
                  className={formErrors.title ? 'border-red-500' : ''}
                />
                {formErrors.title && (
                  <p className="text-xs text-red-500">{formErrors.title}</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Type *</label>
                  <Select
                    value={newActivity.type}
                    onValueChange={(value) => {
                      setNewActivity({...newActivity, type: value})
                      if (formErrors.type) {
                        setFormErrors({...formErrors, type: ''})
                      }
                    }}
                  >
                    <SelectTrigger className={formErrors.type ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Training">Training</SelectItem>
                      <SelectItem value="Practice">Practice</SelectItem>
                      <SelectItem value="Competition">Competition</SelectItem>
                      <SelectItem value="Fitness">Fitness</SelectItem>
                      <SelectItem value="Recovery">Recovery</SelectItem>
                    </SelectContent>
                  </Select>
                  {formErrors.type && (
                    <p className="text-xs text-red-500">{formErrors.type}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Duration *</label>
                  <Input
                    value={newActivity.duration}
                    onChange={(e) => {
                      setNewActivity({...newActivity, duration: e.target.value})
                      if (formErrors.duration) {
                        setFormErrors({...formErrors, duration: ''})
                      }
                    }}
                    placeholder="e.g., 2 hours"
                    className={formErrors.duration ? 'border-red-500' : ''}
                  />
                  {formErrors.duration && (
                    <p className="text-xs text-red-500">{formErrors.duration}</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date *</label>
                  <div className="space-y-2">
                    <Input
                      type="date"
                      value={newActivity.date}
                      onChange={(e) => {
                        const date = e.target.value ? new Date(e.target.value) : null
                        setSelectedDate(date)
                        setNewActivity({...newActivity, date: e.target.value})
                        if (formErrors.date) {
                          setFormErrors({...formErrors, date: ''})
                        }
                      }}
                      className={cn(
                        formErrors.date && "border-red-500"
                      )}
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          console.log('Today button clicked')
                          const today = new Date()
                          const todayString = today.toISOString().split('T')[0]
                          setSelectedDate(today)
                          setNewActivity({...newActivity, date: todayString})
                          if (formErrors.date) {
                            setFormErrors({...formErrors, date: ''})
                          }
                        }}
                      >
                        Today
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          console.log('Tomorrow button clicked')
                          const tomorrow = new Date()
                          tomorrow.setDate(tomorrow.getDate() + 1)
                          const tomorrowString = tomorrow.toISOString().split('T')[0]
                          setSelectedDate(tomorrow)
                          setNewActivity({...newActivity, date: tomorrowString})
                          if (formErrors.date) {
                            setFormErrors({...formErrors, date: ''})
                          }
                        }}
                      >
                        Tomorrow
                      </Button>
                    </div>
                  </div>
                  {formErrors.date && (
                    <p className="text-xs text-red-500">{formErrors.date}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Time *</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="time"
                    value={newActivity.time}
                      onChange={(e) => {
                        setNewActivity({...newActivity, time: e.target.value})
                        if (formErrors.time) {
                          setFormErrors({...formErrors, time: ''})
                        }
                      }}
                      className={cn(
                        "pl-10",
                        formErrors.time && "border-red-500"
                      )}
                    />
                  </div>
                  {formErrors.time && (
                    <p className="text-xs text-red-500">{formErrors.time}</p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Location *</label>
                <Input
                  value={newActivity.location}
                  onChange={(e) => {
                    setNewActivity({...newActivity, location: e.target.value})
                    if (formErrors.location) {
                      setFormErrors({...formErrors, location: ''})
                    }
                  }}
                  placeholder="Training location"
                  className={formErrors.location ? 'border-red-500' : ''}
                />
                {formErrors.location && (
                    <p className="text-xs text-red-500">{formErrors.location}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Coach</label>
                <Input
                  value={newActivity.coach}
                  onChange={(e) => setNewActivity({...newActivity, coach: e.target.value})}
                  placeholder="Coach name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Participants</label>
                <div className="max-h-24 overflow-y-auto border rounded-md p-2">
                  <div className="grid grid-cols-2 gap-2">
                    {participants.map((participant) => (
                      <div key={participant.id} className="flex items-center space-x-1">
                        <Checkbox
                          id={participant.id}
                          checked={selectedParticipants.includes(participant.name)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedParticipants([...selectedParticipants, participant.name])
                              setNewActivity({...newActivity, participants: [...newActivity.participants, participant.name]})
                            } else {
                              setSelectedParticipants(selectedParticipants.filter(p => p !== participant.name))
                              setNewActivity({...newActivity, participants: newActivity.participants.filter(p => p !== participant.name)})
                            }
                          }}
                        />
                        <label htmlFor={participant.id} className="text-sm">
                          {participant.name} ({participant.role})
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description *</label>
                <Textarea
                  value={newActivity.description}
                  onChange={(e) => {
                    setNewActivity({...newActivity, description: e.target.value})
                    if (formErrors.description) {
                      setFormErrors({...formErrors, description: ''})
                    }
                  }}
                  placeholder="Detailed description of the activity, objectives, and requirements"
                  className={`h-20 ${formErrors.description ? 'border-red-500' : ''}`}
                />
                {formErrors.description && (
                    <p className="text-xs text-red-500">{formErrors.description}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Notes</label>
                <Textarea
                  value={newActivity.notes}
                  onChange={(e) => setNewActivity({...newActivity, notes: e.target.value})}
                  placeholder="Additional notes"
                  className="h-12"
                />
               </div>
              </div>
            </div>
             <div className="flex justify-end gap-3 pt-2">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsAddingActivity(false)
                    resetForm()
                  }}
                  disabled={isSubmitting}
                >
                Cancel
              </Button>
                <Button 
                  onClick={addActivity}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Creating...' : 'Create Activity'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search activities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Types</SelectItem>
                  <SelectItem value="Training">Training</SelectItem>
                  <SelectItem value="Practice">Practice</SelectItem>
                  <SelectItem value="Competition">Competition</SelectItem>
                  <SelectItem value="Fitness">Fitness</SelectItem>
                  <SelectItem value="Recovery">Recovery</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Status</SelectItem>
                  <SelectItem value="Scheduled">Scheduled</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activities List with Tabs */}
      <Tabs defaultValue="today" className="space-y-4">
        <TabsList>
          <TabsTrigger value="today">Today ({todayActivities.length})</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming ({upcomingActivities.length})</TabsTrigger>
          <TabsTrigger value="all">All Activities ({filteredActivities.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="today">
      <Card>
        <CardHeader>
          <CardTitle>Today's Activities</CardTitle>
          <CardDescription>Current and scheduled activities for today</CardDescription>
        </CardHeader>
        <CardContent>
          {todayActivities.length > 0 ? (
            <div className="space-y-4">
              {todayActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                  <div className={`w-2 h-2 rounded-full mt-2 ${getStatusColor(activity.status).replace('text-', 'bg-')}`} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{activity.title}</h3>
                          <div className="flex items-center gap-2">
                      <Badge variant={getStatusVariant(activity.status)}>
                        {activity.status}
                      </Badge>
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => editActivity(activity)}
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button size="sm" variant="ghost">
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Activity</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete "{activity.title}"? This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => deleteActivity(activity.id)}>
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{activity.description}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {activity.time} ({activity.duration})
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {activity.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {activity.participants.length} participants
                      </div>
                          {activity.coach && (
                            <div className="flex items-center gap-1">
                              <span className="font-medium">Coach:</span>
                              {activity.coach}
                            </div>
                          )}
                        </div>
                        {activity.participants.length > 0 && (
                          <div className="mt-2">
                            <p className="text-xs text-muted-foreground mb-1">Participants:</p>
                            <div className="flex flex-wrap gap-1">
                              {activity.participants.map((participant, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {participant}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        <div className="flex gap-2 mt-3">
                          {activity.status === 'Scheduled' && (
                            <Button
                              size="sm"
                              onClick={() => updateActivityStatus(activity.id, 'In Progress')}
                            >
                              <Play className="h-3 w-3 mr-1" />
                              Start
                            </Button>
                          )}
                          {activity.status === 'In Progress' && (
                            <Button
                              size="sm"
                              onClick={() => updateActivityStatus(activity.id, 'Completed')}
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Complete
                            </Button>
                          )}
                          {activity.status !== 'Cancelled' && activity.status !== 'Completed' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateActivityStatus(activity.id, 'Cancelled')}
                            >
                              <XCircle className="h-3 w-3 mr-1" />
                              Cancel
                            </Button>
                          )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">No activities scheduled for today.</p>
          )}
        </CardContent>
      </Card>
        </TabsContent>

        <TabsContent value="upcoming">
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Activities</CardTitle>
          <CardDescription>Scheduled activities for the coming days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingActivities.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="text-center">
                    <div className="text-sm font-medium">
                      {format(new Date(activity.date), 'MMM')}
                    </div>
                    <div className="text-2xl font-bold">
                      {format(new Date(activity.date), 'd')}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium">{activity.title}</h3>
                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                    <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {activity.time} ({activity.duration})
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {activity.location}
                      </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {activity.participants.length} participants
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{activity.type}</Badge>
                  <Badge variant={getStatusVariant(activity.status)}>
                    {activity.status}
                  </Badge>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => editActivity(activity)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="ghost">
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Activity</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{activity.title}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteActivity(activity.id)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
        </TabsContent>
        
        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>All Activities</CardTitle>
              <CardDescription>Complete list of all activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="text-center">
                        <div className="text-sm font-medium">
                          {format(new Date(activity.date), 'MMM d')}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {activity.time}
                        </div>
                      </div>
                      <div>
                        <h3 className="font-medium">{activity.title}</h3>
                        <p className="text-sm text-muted-foreground">{activity.description}</p>
                        <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {activity.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {activity.participants.length} participants
                          </div>
                          {activity.coach && (
                            <div className="flex items-center gap-1">
                              <span className="font-medium">Coach:</span>
                              {activity.coach}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{activity.type}</Badge>
                      <Badge variant={getStatusVariant(activity.status)}>
                        {activity.status}
                      </Badge>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => editActivity(activity)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="ghost">
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Activity</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{activity.title}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteActivity(activity.id)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Activity Dialog */}
      <Dialog open={isEditingActivity} onOpenChange={setIsEditingActivity}>
        <DialogContent 
          className="!w-[80vw] !h-[90vh] !max-w-none mx-auto my-2" 
          style={{ 
            width: '80vw !important', 
            height: '90vh !important',
            maxWidth: 'none !important',
            minWidth: '80vw !important',
            maxHeight: '90vh !important'
          }}
          data-radix-dialog-content=""
        >
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Activity Details</DialogTitle>
            <DialogDescription>
              Update the training session or team activity.
            </DialogDescription>
          </DialogHeader>
          <div className="overflow-y-auto max-h-[70vh] pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100" style={{ scrollbarWidth: 'thin', height: '70vh' }}>
            <div className="grid gap-3 py-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title *</label>
                <Input
                  value={newActivity.title}
                  onChange={(e) => {
                    setNewActivity({...newActivity, title: e.target.value})
                    if (formErrors.title) {
                      setFormErrors({...formErrors, title: ''})
                    }
                  }}
                  placeholder="Brief description of the activity"
                  className={formErrors.title ? 'border-red-500' : ''}
                />
                {formErrors.title && (
                  <p className="text-xs text-red-500">{formErrors.title}</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Type *</label>
                  <Select
                    value={newActivity.type}
                    onValueChange={(value) => {
                      setNewActivity({...newActivity, type: value})
                      if (formErrors.type) {
                        setFormErrors({...formErrors, type: ''})
                      }
                    }}
                  >
                    <SelectTrigger className={formErrors.type ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Training">Training</SelectItem>
                      <SelectItem value="Practice">Practice</SelectItem>
                      <SelectItem value="Competition">Competition</SelectItem>
                      <SelectItem value="Fitness">Fitness</SelectItem>
                      <SelectItem value="Recovery">Recovery</SelectItem>
                    </SelectContent>
                  </Select>
                  {formErrors.type && (
                    <p className="text-xs text-red-500">{formErrors.type}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Duration *</label>
                  <Input
                    value={newActivity.duration}
                    onChange={(e) => {
                      setNewActivity({...newActivity, duration: e.target.value})
                      if (formErrors.duration) {
                        setFormErrors({...formErrors, duration: ''})
                      }
                    }}
                    placeholder="e.g., 2 hours"
                    className={formErrors.duration ? 'border-red-500' : ''}
                  />
                  {formErrors.duration && (
                    <p className="text-xs text-red-500">{formErrors.duration}</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date *</label>
                  <div className="space-y-2">
                    <Input
                      type="date"
                      value={newActivity.date}
                      onChange={(e) => {
                        const date = e.target.value ? new Date(e.target.value) : null
                        setSelectedDate(date)
                        setNewActivity({...newActivity, date: e.target.value})
                        if (formErrors.date) {
                          setFormErrors({...formErrors, date: ''})
                        }
                      }}
                      className={cn(
                        formErrors.date && "border-red-500"
                      )}
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          console.log('Today button clicked')
                          const today = new Date()
                          const todayString = today.toISOString().split('T')[0]
                          setSelectedDate(today)
                          setNewActivity({...newActivity, date: todayString})
                          if (formErrors.date) {
                            setFormErrors({...formErrors, date: ''})
                          }
                        }}
                      >
                        Today
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          console.log('Tomorrow button clicked')
                          const tomorrow = new Date()
                          tomorrow.setDate(tomorrow.getDate() + 1)
                          const tomorrowString = tomorrow.toISOString().split('T')[0]
                          setSelectedDate(tomorrow)
                          setNewActivity({...newActivity, date: tomorrowString})
                          if (formErrors.date) {
                            setFormErrors({...formErrors, date: ''})
                          }
                        }}
                      >
                        Tomorrow
                      </Button>
                    </div>
                  </div>
                  {formErrors.date && (
                    <p className="text-xs text-red-500">{formErrors.date}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Time *</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="time"
                      value={newActivity.time}
                      onChange={(e) => {
                        setNewActivity({...newActivity, time: e.target.value})
                        if (formErrors.time) {
                          setFormErrors({...formErrors, time: ''})
                        }
                      }}
                      className={cn(
                        "pl-10",
                        formErrors.time && "border-red-500"
                      )}
                    />
                  </div>
                  {formErrors.time && (
                    <p className="text-xs text-red-500">{formErrors.time}</p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Location *</label>
                <Input
                  value={newActivity.location}
                  onChange={(e) => {
                    setNewActivity({...newActivity, location: e.target.value})
                    if (formErrors.location) {
                      setFormErrors({...formErrors, location: ''})
                    }
                  }}
                  placeholder="Training location"
                  className={formErrors.location ? 'border-red-500' : ''}
                />
                {formErrors.location && (
                    <p className="text-xs text-red-500">{formErrors.location}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Coach</label>
                <Input
                  value={newActivity.coach}
                  onChange={(e) => setNewActivity({...newActivity, coach: e.target.value})}
                  placeholder="Coach name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Participants</label>
                <div className="max-h-24 overflow-y-auto border rounded-md p-2">
                  <div className="grid grid-cols-2 gap-2">
                    {participants.map((participant) => (
                      <div key={participant.id} className="flex items-center space-x-1">
                        <Checkbox
                          id={`edit-${participant.id}`}
                          checked={selectedParticipants.includes(participant.name)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedParticipants([...selectedParticipants, participant.name])
                              setNewActivity({...newActivity, participants: [...newActivity.participants, participant.name]})
                            } else {
                              setSelectedParticipants(selectedParticipants.filter(p => p !== participant.name))
                              setNewActivity({...newActivity, participants: newActivity.participants.filter(p => p !== participant.name)})
                            }
                          }}
                        />
                        <label htmlFor={`edit-${participant.id}`} className="text-xs truncate">
                          {participant.name.split(' ')[0]}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description *</label>
                <Textarea
                  value={newActivity.description}
                  onChange={(e) => {
                    setNewActivity({...newActivity, description: e.target.value})
                    if (formErrors.description) {
                      setFormErrors({...formErrors, description: ''})
                    }
                  }}
                  placeholder="Detailed description of the activity, objectives, and requirements"
                  className={cn("h-20", formErrors.description && "border-red-500")}
                />
                {formErrors.description && (
                  <p className="text-xs text-red-500">{formErrors.description}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Notes</label>
                <Textarea
                  value={newActivity.notes}
                  onChange={(e) => setNewActivity({...newActivity, notes: e.target.value})}
                  placeholder="Additional notes"
                  className="h-12"
                />
               </div>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button 
              variant="outline" 
              onClick={() => {
                setIsEditingActivity(false)
                resetForm()
              }}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              onClick={updateActivity}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Updating...' : 'Update Activity'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalActivities}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeSessions}</div>
            <p className="text-xs text-muted-foreground">Currently in progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedActivities}</div>
            <p className="text-xs text-muted-foreground">Activities finished</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completionRate}%</div>
            <p className="text-xs text-muted-foreground">Success rate</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}