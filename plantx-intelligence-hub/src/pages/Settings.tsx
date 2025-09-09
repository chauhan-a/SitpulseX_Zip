
import { useState } from "react";
import { User, Bell, Shield, Database, Palette, Globe, Key, Users, Building, Zap } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { IntegrationsManager } from "@/components/IntegrationsManager";
import { ExcelImporter } from "@/components/ExcelImporter";
import { AIProviderSettings } from "@/components/AIProviderSettings";

const Settings = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [autoBackup, setAutoBackup] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);

  const userRoles = [
    { name: "System Administrator", users: 2, permissions: ["Full Access", "User Management", "System Config"] },
    { name: "Site Manager", users: 8, permissions: ["Site Management", "Staff Assignment", "Reporting"] },
    { name: "OT Engineer", users: 24, permissions: ["Equipment Access", "Maintenance Tasks", "Knowledge Base"] },
    { name: "Knowledge Manager", users: 4, permissions: ["Content Management", "Approval Workflow", "Version Control"] },
    { name: "Safety Officer", users: 6, permissions: ["Safety Procedures", "Compliance Monitoring", "Incident Reports"] }
  ];

  const systemIntegrations = [
    { name: "SAP ERP", status: "Connected", type: "Asset Management", lastSync: "2024-01-22 09:30" },
    { name: "SCADA System", status: "Connected", type: "Real-time Data", lastSync: "2024-01-22 10:15" },
    { name: "Microsoft Teams", status: "Connected", type: "Communication", lastSync: "2024-01-22 10:00" },
    { name: "Maximo CMMS", status: "Pending", type: "Maintenance", lastSync: "Never" },
    { name: "Active Directory", status: "Connected", type: "Authentication", lastSync: "2024-01-22 08:45" }
  ];

  const auditLogs = [
    { timestamp: "2024-01-22 10:15:23", user: "admin@hcltech.com", action: "User role updated", details: "Changed OT Engineer permissions" },
    { timestamp: "2024-01-22 09:45:12", user: "manager@hcltech.com", action: "Knowledge article approved", details: "Emergency shutdown procedures v2.1" },
    { timestamp: "2024-01-22 09:30:45", user: "engineer@hcltech.com", action: "Template created", details: "Safety inspection checklist" },
    { timestamp: "2024-01-22 08:15:33", user: "admin@hcltech.com", action: "System backup initiated", details: "Weekly automated backup" },
    { timestamp: "2024-01-21 16:20:18", user: "safety@hcltech.com", action: "Compliance report generated", details: "Monthly safety audit report" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
          <p className="text-muted-foreground">
            Configure system preferences, security, and integrations
          </p>
        </div>
        <Button>Save All Changes</Button>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="users">Users & Roles</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="ai-providers">AI Providers</TabsTrigger>
          <TabsTrigger value="import">Data Import</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="audit">Audit & Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Organization Settings
                </CardTitle>
                <CardDescription>Basic organization and system configuration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="orgName">Organization Name</Label>
                  <Input id="orgName" defaultValue="HCLTech Industrial Solutions" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select defaultValue="utc-5">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="utc-5">UTC-5 (Eastern Time)</SelectItem>
                      <SelectItem value="utc-6">UTC-6 (Central Time)</SelectItem>
                      <SelectItem value="utc-7">UTC-7 (Mountain Time)</SelectItem>
                      <SelectItem value="utc-8">UTC-8 (Pacific Time)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Default Language</Label>
                  <Select defaultValue="en">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Appearance & Interface
                </CardTitle>
                <CardDescription>Customize the look and feel of the application</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Dark Mode</div>
                    <div className="text-sm text-muted-foreground">Enable dark theme</div>
                  </div>
                  <Switch checked={darkMode} onCheckedChange={setDarkMode} />
                </div>
                <div className="space-y-2">
                  <Label>Theme Color</Label>
                  <div className="flex gap-2">
                    <div className="w-8 h-8 rounded bg-blue-600 border-2 border-blue-600" />
                    <div className="w-8 h-8 rounded bg-green-600 border" />
                    <div className="w-8 h-8 rounded bg-purple-600 border" />
                    <div className="w-8 h-8 rounded bg-orange-600 border" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="logoUpload">Company Logo</Label>
                  <Input id="logoUpload" type="file" accept="image/*" />
                  <p className="text-xs text-muted-foreground">Recommended: 200x50px, PNG or SVG</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                System Maintenance
              </CardTitle>
              <CardDescription>Data backup and system maintenance settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Automatic Backups</div>
                  <div className="text-sm text-muted-foreground">Daily system and data backups</div>
                </div>
                <Switch checked={autoBackup} onCheckedChange={setAutoBackup} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Backup Frequency</Label>
                  <Select defaultValue="daily">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Retention Period</Label>
                  <Select defaultValue="30">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">7 days</SelectItem>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="90">90 days</SelectItem>
                      <SelectItem value="365">1 year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button variant="outline" className="w-full">Run Backup Now</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                User Roles & Permissions
              </CardTitle>
              <CardDescription>Manage user roles and access permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userRoles.map((role, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold">{role.name}</h3>
                        <p className="text-sm text-muted-foreground">{role.users} users assigned</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">Edit</Button>
                        <Button variant="outline" size="sm">Manage Users</Button>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {role.permissions.map((permission, idx) => (
                        <Badge key={idx} variant="outline">{permission}</Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center mt-6">
                <p className="text-sm text-muted-foreground">Total active users: 44</p>
                <Button>Add New Role</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Authentication Settings
                </CardTitle>
                <CardDescription>Configure login and security policies</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Password Policy</Label>
                  <Select defaultValue="strong">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Basic (8+ characters)</SelectItem>
                      <SelectItem value="strong">Strong (12+ chars, mixed case, numbers)</SelectItem>
                      <SelectItem value="enterprise">Enterprise (15+ chars, symbols required)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Session Timeout</Label>
                  <Select defaultValue="8">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 hour</SelectItem>
                      <SelectItem value="4">4 hours</SelectItem>
                      <SelectItem value="8">8 hours</SelectItem>
                      <SelectItem value="24">24 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Two-Factor Authentication</Label>
                  <div className="flex items-center gap-2">
                    <Switch defaultChecked />
                    <span className="text-sm">Required for admin users</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  API & Access Keys
                </CardTitle>
                <CardDescription>Manage system API keys and integrations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {[
                    { name: "SCADA Integration", key: "sk_live_...3x9k", created: "2024-01-15", status: "Active" },
                    { name: "Mobile App Access", key: "sk_live_...7m2p", created: "2024-01-10", status: "Active" },
                    { name: "Backup Service", key: "sk_live_...9n5q", created: "2023-12-20", status: "Inactive" }
                  ].map((apiKey, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <div className="font-medium">{apiKey.name}</div>
                        <div className="text-sm text-muted-foreground">{apiKey.key} • Created {apiKey.created}</div>
                      </div>
                      <Badge className={apiKey.status === "Active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                        {apiKey.status}
                      </Badge>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full">Generate New API Key</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                System Integrations
              </CardTitle>
              <CardDescription>Connect SitePulseX with external systems and APIs</CardDescription>
            </CardHeader>
            <CardContent>
              <IntegrationsManager />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai-providers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                AI Provider Configuration
              </CardTitle>
              <CardDescription>Configure API keys for ChatGPT, DeepSeek, LLAMA, and other AI providers</CardDescription>
            </CardHeader>
            <CardContent>
              <AIProviderSettings />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="import" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Data Import
              </CardTitle>
              <CardDescription>Import tickets and data from Excel files or Google Sheets</CardDescription>
            </CardHeader>
            <CardContent>
              <ExcelImporter />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  System Notifications
                </CardTitle>
                <CardDescription>Configure system-wide notification settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Email Notifications</div>
                    <div className="text-sm text-muted-foreground">Send notifications via email</div>
                  </div>
                  <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">SMS Alerts</div>
                    <div className="text-sm text-muted-foreground">Critical alerts via SMS</div>
                  </div>
                  <Switch checked={smsAlerts} onCheckedChange={setSmsAlerts} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emailServer">SMTP Server</Label>
                  <Input id="emailServer" defaultValue="smtp.hcltech.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smsProvider">SMS Provider</Label>
                  <Select defaultValue="twilio">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="twilio">Twilio</SelectItem>
                      <SelectItem value="aws-sns">AWS SNS</SelectItem>
                      <SelectItem value="nexmo">Vonage (Nexmo)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Escalation Rules</CardTitle>
                <CardDescription>Define automatic escalation for critical alerts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Critical Alert Escalation</Label>
                  <Textarea 
                    placeholder="Define escalation rules for critical alerts..."
                    defaultValue="1. Immediate notification to on-call engineer&#10;2. After 15 minutes: Notify site manager&#10;3. After 30 minutes: Notify regional director"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Primary Contact</Label>
                    <Input defaultValue="emergency@hcltech.com" />
                  </div>
                  <div className="space-y-2">
                    <Label>Backup Contact</Label>
                    <Input defaultValue="+1-555-0123" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="audit" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Audit Trail & System Logs
              </CardTitle>
              <CardDescription>Monitor system activities and maintain compliance records</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Log Retention Policy</h3>
                    <p className="text-sm text-muted-foreground">Keep audit logs for compliance requirements</p>
                  </div>
                  <Select defaultValue="2-years">
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-year">1 Year</SelectItem>
                      <SelectItem value="2-years">2 Years</SelectItem>
                      <SelectItem value="5-years">5 Years</SelectItem>
                      <SelectItem value="permanent">Permanent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3">Recent System Activity</h4>
                  <div className="space-y-2">
                    {auditLogs.map((log, index) => (
                      <div key={index} className="text-sm border-l-2 border-blue-500 pl-3 py-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{log.action}</span>
                          <span className="text-muted-foreground">{log.timestamp}</span>
                        </div>
                        <div className="text-muted-foreground">
                          <span>{log.user}</span> • <span>{log.details}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button variant="outline">Export Audit Report</Button>
                  <Button variant="outline">View Full Logs</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
