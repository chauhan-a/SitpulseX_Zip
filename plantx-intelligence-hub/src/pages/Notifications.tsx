
import { useState } from "react";
import { Bell, AlertTriangle, CheckCircle, Info, Settings, Filter, MoreHorizontal } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";

const Notifications = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);

  const notifications = [
    {
      id: 1,
      type: "critical",
      title: "Emergency Generator Failure",
      message: "Generator GEN-002 at Data Center Delta has failed. Backup power activated.",
      timestamp: "2 minutes ago",
      site: "Data Center Delta",
      read: false,
      category: "Equipment"
    },
    {
      id: 2,
      type: "warning",
      title: "Maintenance Overdue",
      message: "Turbine blade inspection for WT-003 is 2 days overdue.",
      timestamp: "15 minutes ago",
      site: "Wind Farm Alpha",
      read: false,
      category: "Maintenance"
    },
    {
      id: 3,
      type: "info",
      title: "Knowledge Base Updated",
      message: "New SOP uploaded: Emergency Shutdown Procedures v2.1",
      timestamp: "1 hour ago",
      site: "All Sites",
      read: true,
      category: "Knowledge"
    },
    {
      id: 4,
      type: "success",
      title: "Dispatch Request Completed",
      message: "John Mitchell has completed transformer maintenance at Substation Beta.",
      timestamp: "2 hours ago",
      site: "Substation Beta",
      read: true,
      category: "Dispatch"
    },
    {
      id: 5,
      type: "warning",
      title: "Weather Alert",
      message: "High wind warning issued for Wind Farm Alpha region. Monitor turbine operations.",
      timestamp: "3 hours ago",
      site: "Wind Farm Alpha",
      read: false,
      category: "Environmental"
    }
  ];

  const alertSummary = [
    { type: "Critical", count: 2, color: "bg-red-500" },
    { type: "Warnings", count: 5, color: "bg-yellow-500" },
    { type: "Info", count: 12, color: "bg-blue-500" },
    { type: "Success", count: 8, color: "bg-green-500" }
  ];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "critical": return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "warning": return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "info": return <Info className="h-4 w-4 text-blue-500" />;
      case "success": return <CheckCircle className="h-4 w-4 text-green-500" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const notificationSettings = [
    {
      category: "Equipment Alerts",
      description: "Critical equipment failures and maintenance alerts",
      email: true,
      sms: true,
      push: true
    },
    {
      category: "Dispatch Updates",
      description: "Engineer assignments and dispatch status changes",
      email: true,
      sms: false,
      push: true
    },
    {
      category: "Knowledge Base",
      description: "New articles, updates, and approval requests",
      email: true,
      sms: false,
      push: false
    },
    {
      category: "Compliance & Audits",
      description: "Regulatory deadlines and audit notifications",
      email: true,
      sms: true,
      push: true
    },
    {
      category: "Environmental",
      description: "Weather alerts and environmental conditions",
      email: false,
      sms: true,
      push: true
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications Hub</h1>
          <p className="text-muted-foreground">
            Stay informed about critical alerts, updates, and system notifications
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {alertSummary.map((alert, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{alert.type}</CardTitle>
              <div className={`w-3 h-3 rounded-full ${alert.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{alert.count}</div>
              <p className="text-xs text-muted-foreground">
                {alert.type === "Critical" ? "Immediate attention" : 
                 alert.type === "Warnings" ? "Review required" : 
                 alert.type === "Info" ? "For your information" : "Completed successfully"}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="recent" className="space-y-4">
        <TabsList>
          <TabsTrigger value="recent">Recent Notifications</TabsTrigger>
          <TabsTrigger value="critical">Critical Alerts</TabsTrigger>
          <TabsTrigger value="settings">Notification Settings</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="recent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Notifications</CardTitle>
              <CardDescription>Latest alerts and updates from all systems</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div key={notification.id} className={`border rounded-lg p-4 ${!notification.read ? 'bg-blue-50' : ''}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        {getNotificationIcon(notification.type)}
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{notification.title}</h3>
                            {!notification.read && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
                          </div>
                          <p className="text-sm text-muted-foreground">{notification.message}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>{notification.timestamp}</span>
                            <span>{notification.site}</span>
                            <Badge variant="outline" className="text-xs">{notification.category}</Badge>
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="critical" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Critical Alerts</CardTitle>
              <CardDescription>High-priority notifications requiring immediate attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notifications.filter(n => n.type === "critical" || n.type === "warning").map((notification) => (
                  <div key={notification.id} className="border-l-4 border-red-500 bg-red-50 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        {getNotificationIcon(notification.type)}
                        <div className="space-y-1 flex-1">
                          <h3 className="font-semibold text-red-900">{notification.title}</h3>
                          <p className="text-sm text-red-700">{notification.message}</p>
                          <div className="flex items-center gap-4 text-xs text-red-600">
                            <span>{notification.timestamp}</span>
                            <span>{notification.site}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">Acknowledge</Button>
                        <Button size="sm">Take Action</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Global Notification Preferences</CardTitle>
                <CardDescription>Configure how you receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Email Notifications</div>
                    <div className="text-sm text-muted-foreground">Receive notifications via email</div>
                  </div>
                  <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">SMS Notifications</div>
                    <div className="text-sm text-muted-foreground">Receive critical alerts via SMS</div>
                  </div>
                  <Switch checked={smsNotifications} onCheckedChange={setSmsNotifications} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Push Notifications</div>
                    <div className="text-sm text-muted-foreground">Receive in-app notifications</div>
                  </div>
                  <Switch checked={pushNotifications} onCheckedChange={setPushNotifications} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Notification Categories</CardTitle>
                <CardDescription>Customize notifications by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {notificationSettings.map((setting, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="space-y-2">
                        <h4 className="font-medium">{setting.category}</h4>
                        <p className="text-sm text-muted-foreground">{setting.description}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Switch checked={setting.email} disabled />
                            <span>Email</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Switch checked={setting.sms} disabled />
                            <span>SMS</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Switch checked={setting.push} disabled />
                            <span>Push</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification History</CardTitle>
              <CardDescription>View all past notifications and alerts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Button variant="outline" size="sm">Last 24 Hours</Button>
                  <Button variant="outline" size="sm">Last Week</Button>
                  <Button variant="outline" size="sm">Last Month</Button>
                  <Button variant="outline" size="sm">Custom Range</Button>
                </div>
                <div className="text-center py-12 text-muted-foreground">
                  Select a time range to view notification history
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Notifications;
