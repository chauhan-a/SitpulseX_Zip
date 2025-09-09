import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  BarChart3, 
  TrendingUp, 
  Activity, 
  Clock, 
  AlertTriangle, 
  Users, 
  Filter,
  Search,
  Download,
  Eye
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

const Analytics = () => {
  const mockAlerts = [
    {
      id: 1,
      title: "High Temperature Alert",
      site: "Power Generation A",
      equipment: "Turbine 1",
      priority: "High",
      status: "Active",
      timestamp: "2024-01-19 08:30:00",
      description: "Temperature exceeds threshold. Immediate inspection required."
    },
    {
      id: 2,
      title: "Low Pressure Warning",
      site: "Chemical Processing B",
      equipment: "Reactor 3",
      priority: "Medium",
      status: "Acknowledged",
      timestamp: "2024-01-19 08:15:00",
      description: "Pressure below normal operating range. Check feed lines."
    },
    {
      id: 3,
      title: "Vibration Level Exceeded",
      site: "Manufacturing Plant C",
      equipment: "Conveyor Belt 2",
      priority: "Critical",
      status: "Active",
      timestamp: "2024-01-19 08:00:00",
      description: "Vibration levels beyond acceptable limits. Stop operation immediately."
    },
    {
      id: 4,
      title: "Unusual Noise Detected",
      site: "Refinery D",
      equipment: "Pump 5",
      priority: "Low",
      status: "Resolved",
      timestamp: "2024-01-19 07:45:00",
      description: "Strange sounds coming from pump unit. Inspected and resolved."
    }
  ];

  const mockKPIData = [
    { name: "Jan", efficiency: 85, downtime: 15, quality: 92 },
    { name: "Feb", efficiency: 88, downtime: 12, quality: 94 },
    { name: "Mar", efficiency: 82, downtime: 18, quality: 89 },
    { name: "Apr", efficiency: 90, downtime: 10, quality: 96 },
    { name: "May", efficiency: 87, downtime: 13, quality: 93 },
    { name: "Jun", efficiency: 93, downtime: 7, quality: 97 }
  ];

  const performanceData = [
    { site: "Power Generation A", efficiency: 94, availability: 98, quality: 96 },
    { site: "Chemical Processing B", efficiency: 87, availability: 92, quality: 89 },
    { site: "Manufacturing Plant C", efficiency: 91, availability: 95, quality: 93 },
    { site: "Refinery D", efficiency: 89, availability: 94, quality: 91 }
  ];

  const pieData = [
    { name: "Operational", value: 78, color: "hsl(var(--success))" },
    { name: "Maintenance", value: 15, color: "hsl(var(--warning))" },
    { name: "Downtime", value: 7, color: "hsl(var(--destructive))" }
  ];

  const getPriorityBadge = (priority: string) => {
    switch(priority) {
      case "Critical": return <Badge className="bg-destructive text-destructive-foreground">Critical</Badge>;
      case "High": return <Badge className="bg-warning text-warning-foreground">High</Badge>;
      case "Medium": return <Badge variant="secondary">Medium</Badge>;
      default: return <Badge variant="outline">Low</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case "Open": return <Badge variant="outline">Open</Badge>;
      case "In Progress": return <Badge className="bg-primary text-primary-foreground">In Progress</Badge>;
      case "Resolved": return <Badge className="bg-success text-success-foreground">Resolved</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics & Reporting</h1>
          <p className="text-muted-foreground">Performance insights and operational analytics</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Overall Efficiency</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">89.5%</div>
                <p className="text-xs text-success">+2.3% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Equipment Availability</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">94.7%</div>
                <p className="text-xs text-success">+1.8% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Downtime</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">11.2h</div>
                <p className="text-xs text-destructive">+0.8h from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">23</div>
                <p className="text-xs text-warning">5 critical, 18 medium</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Performance Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={mockKPIData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="efficiency" stroke="hsl(var(--primary))" strokeWidth={2} />
                    <Line type="monotone" dataKey="quality" stroke="hsl(var(--success))" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Equipment Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Site Performance Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Site</TableHead>
                    <TableHead>Efficiency</TableHead>
                    <TableHead>Availability</TableHead>
                    <TableHead>Quality Score</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {performanceData.map((site, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{site.site}</TableCell>
                      <TableCell>{site.efficiency}%</TableCell>
                      <TableCell>{site.availability}%</TableCell>
                      <TableCell>{site.quality}%</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Historical Performance Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={mockKPIData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="efficiency" fill="hsl(var(--primary))" />
                  <Bar dataKey="quality" fill="hsl(var(--success))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;
