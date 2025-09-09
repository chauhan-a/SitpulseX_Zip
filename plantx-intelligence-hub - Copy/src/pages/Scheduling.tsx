
import { useState } from "react";
import { Calendar, Clock, Users, Wrench, AlertTriangle, Plus, Filter, MapPin, Settings } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

const Scheduling = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const maintenanceSchedule = [
    {
      id: 1,
      task: "Turbine Blade Inspection",
      site: "Wind Farm Alpha",
      engineer: "John Mitchell",
      backup: "Sarah Chen",
      date: "2024-01-22",
      time: "09:00",
      duration: "4 hours",
      status: "scheduled",
      priority: "high",
      equipment: "WT-001 to WT-005",
      sop: "SOP-WT-INSP-001"
    },
    {
      id: 2,
      task: "Transformer Oil Analysis",
      site: "Substation Beta",
      engineer: "David Park",
      backup: "Mike Johnson",
      date: "2024-01-22",
      time: "14:00",
      duration: "2 hours",
      status: "in-progress",
      priority: "medium",
      equipment: "TR-101, TR-102",
      sop: "SOP-TR-OIL-001"
    },
    {
      id: 3,
      task: "Solar Panel Cleaning",
      site: "Solar Farm Gamma",
      engineer: "Lisa Wong",
      backup: "Tom Rodriguez",
      date: "2024-01-23",
      time: "08:00",
      duration: "6 hours",
      status: "scheduled",
      priority: "low",
      equipment: "PV-Array 1-10",
      sop: "SOP-PV-CLEAN-001"
    },
    {
      id: 4,
      task: "Emergency Generator Test",
      site: "Data Center Delta",
      engineer: "Alex Kumar",
      backup: "Emma Davis",
      date: "2024-01-24",
      time: "10:00",
      duration: "3 hours",
      status: "overdue",
      priority: "critical",
      equipment: "GEN-001, GEN-002",
      sop: "SOP-GEN-TEST-001"
    }
  ];

  const upcomingInspections = [
    { type: "Annual Safety Audit", site: "All Sites", due: "2024-02-15", responsible: "Safety Team" },
    { type: "Environmental Compliance", site: "Chemical Plant", due: "2024-01-30", responsible: "ENV Team" },
    { type: "Equipment Calibration", site: "Manufacturing Line 1", due: "2024-02-05", responsible: "QA Team" },
    { type: "Fire Safety Inspection", site: "Warehouse Complex", due: "2024-02-10", responsible: "Fire Marshal" }
  ];

  const engineerRoster = [
    { name: "John Mitchell", shift: "Day", availability: "Available", skills: ["Turbines", "Electrical"], location: "Zone A" },
    { name: "Sarah Chen", shift: "Day", availability: "On Leave", skills: ["Solar", "Battery"], location: "Zone B" },
    { name: "David Park", shift: "Night", availability: "Available", skills: ["Transformers", "HVAC"], location: "Zone C" },
    { name: "Mike Johnson", shift: "Day", availability: "Deployed", skills: ["Emergency", "Mechanical"], location: "Zone A" },
    { name: "Lisa Wong", shift: "Day", availability: "Available", skills: ["Solar", "Cleaning"], location: "Zone D" },
    { name: "Tom Rodriguez", shift: "Swing", availability: "Available", skills: ["General", "Safety"], location: "Zone B" }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled": return "bg-blue-100 text-blue-800";
      case "in-progress": return "bg-yellow-100 text-yellow-800";
      case "completed": return "bg-green-100 text-green-800";
      case "overdue": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "bg-red-500";
      case "high": return "bg-orange-500";
      case "medium": return "bg-yellow-500";
      case "low": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Maintenance & Inspection Scheduling</h1>
          <p className="text-muted-foreground">
            Manage maintenance schedules, inspections, and engineer assignments
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Schedule Task
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Tasks</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">+2 from yesterday</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Tasks</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">3</div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Engineers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Out of 18 total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Inspection</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Days remaining</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="schedule" className="space-y-4">
        <TabsList>
          <TabsTrigger value="schedule">Schedule View</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="roster">Engineer Roster</TabsTrigger>
          <TabsTrigger value="inspections">Inspections</TabsTrigger>
        </TabsList>

        <TabsContent value="schedule" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Maintenance Tasks</CardTitle>
              <CardDescription>Scheduled maintenance and repair activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {maintenanceSchedule.map((task) => (
                  <div key={task.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)}`} />
                        <h3 className="font-semibold">{task.task}</h3>
                        <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">View SOP</Button>
                        <Button variant="outline" size="sm">Edit</Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          Site
                        </div>
                        <div className="font-medium">{task.site}</div>
                      </div>
                      <div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          Schedule
                        </div>
                        <div className="font-medium">{task.date} at {task.time}</div>
                      </div>
                      <div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Users className="h-3 w-3" />
                          Engineers
                        </div>
                        <div className="font-medium">{task.engineer} (Backup: {task.backup})</div>
                      </div>
                      <div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Wrench className="h-3 w-3" />
                          Equipment
                        </div>
                        <div className="font-medium">{task.equipment}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Calendar</CardTitle>
              </CardHeader>
              <CardContent>
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>
            
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Tasks for Selected Date</CardTitle>
                <CardDescription>
                  {selectedDate ? selectedDate.toLocaleDateString() : "Select a date"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {maintenanceSchedule.slice(0, 3).map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <div className="font-medium">{task.task}</div>
                        <div className="text-sm text-muted-foreground">{task.time} - {task.site}</div>
                      </div>
                      <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="roster" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Engineer Roster & Availability</CardTitle>
              <CardDescription>Current engineer assignments and availability status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {engineerRoster.map((engineer, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{engineer.name}</h3>
                      <Badge 
                        className={
                          engineer.availability === "Available" ? "bg-green-100 text-green-800" :
                          engineer.availability === "On Leave" ? "bg-gray-100 text-gray-800" :
                          "bg-yellow-100 text-yellow-800"
                        }
                      >
                        {engineer.availability}
                      </Badge>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Shift:</span> {engineer.shift}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Location:</span> {engineer.location}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Skills:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {engineer.skills.map((skill, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inspections" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Inspections & Audits</CardTitle>
              <CardDescription>Regulatory and compliance inspections schedule</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingInspections.map((inspection, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <h3 className="font-semibold">{inspection.type}</h3>
                      <p className="text-sm text-muted-foreground">{inspection.site}</p>
                      <p className="text-sm">Responsible: {inspection.responsible}</p>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="font-semibold">Due: {inspection.due}</div>
                      <Badge variant="outline">Scheduled</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Scheduling;
