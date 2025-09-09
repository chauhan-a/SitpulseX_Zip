
import { useState } from "react";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { SiteCard } from "@/components/dashboard/SiteCard";
import { ClusterCard } from "@/components/dashboard/ClusterCard";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useTickets, useSites, Ticket as TicketType } from "@/hooks/usePocketbaseData";
import { 
  Ticket, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  TrendingUp,
  Filter,
  MapPin,
  Users,
  ExternalLink,
  Calendar,
  User
} from "lucide-react";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<"All" | "Dedicated" | "Cluster" | "Dispatched" | "Geographic">("All");
  const [viewMode, setViewMode] = useState<"sites" | "clusters">("sites");
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  const [selectedSite, setSelectedSite] = useState<any | null>(null);
  
  const { tickets, loading: ticketsLoading, getTicketsByStatus, getTicketCounts } = useTickets();
  const { sites, loading: sitesLoading } = useSites();
  
  const ticketCounts = getTicketCounts();

  const ticketMetrics = [
    {
      title: "Open Tickets",
      value: ticketsLoading ? '...' : ticketCounts.open,
      icon: Ticket,
      color: "warning" as const,
      trend: { value: 12, isPositive: false }
    },
    {
      title: "In Progress", 
      value: ticketsLoading ? '...' : ticketCounts.in_progress,
      icon: Clock,
      color: "default" as const,
      trend: { value: 8, isPositive: true }
    },
    {
      title: "Closed Today",
      value: ticketsLoading ? '...' : ticketCounts.closed,
      icon: CheckCircle,
      color: "success" as const,
      trend: { value: 23, isPositive: true }
    },
    {
      title: "Overdue",
      value: ticketsLoading ? '...' : ticketCounts.overdue,
      icon: AlertTriangle,
      color: "destructive" as const,
      trend: { value: 15, isPositive: false }
    }
  ];

  const mockSites = [
    {
      siteName: "Manufacturing Plant A",
      openTickets: 8,
      averageAging: 3,
      siteType: "Dedicated" as const,
      status: "Active" as const,
      location: "Texas",
      engineerAssignment: {
        dedicated: ["John Smith (OT-1)", "Sarah Johnson (OT-2)"],
        backup: ["Mike Davis (OT-3)"]
      },
      dispatchInfo: {
        prerequisiteTransferred: true,
        contactInfoAvailable: true,
        walkthroughLink: true,
        engineerRosterStatus: "Ready" as const
      }
    },
    {
      siteName: "Chemical Processing B",
      openTickets: 12,
      averageAging: 5,
      siteType: "Cluster" as const,
      status: "Active" as const,
      location: "Louisiana",
      engineerAssignment: {
        dedicated: ["Alex Chen (OT-4)"],
        backup: ["Emma Wilson (OT-5)", "David Brown (OT-6)"]
      },
      dispatchInfo: {
        prerequisiteTransferred: true,
        contactInfoAvailable: false,
        walkthroughLink: true,
        engineerRosterStatus: "Pending" as const
      }
    },
    {
      siteName: "Power Generation C",
      openTickets: 6,
      averageAging: 2,
      siteType: "Dispatched" as const,
      status: "Maintenance" as const,
      location: "Ohio",
      engineerAssignment: {
        dedicated: [],
        backup: ["Tom Rodriguez (OT-7)", "Lisa Parker (OT-8)"]
      },
      dispatchInfo: {
        prerequisiteTransferred: false,
        contactInfoAvailable: true,
        walkthroughLink: false,
        engineerRosterStatus: "Unavailable" as const
      }
    },
    {
      siteName: "Refinery Complex D",
      openTickets: 15,
      averageAging: 7,
      siteType: "Dedicated" as const,
      status: "Active" as const,
      location: "Texas",
      engineerAssignment: {
        dedicated: ["Robert Kim (OT-9)", "Jennifer Lee (OT-10)", "Carlos Martinez (OT-11)"],
        backup: ["Amy White (OT-12)"]
      },
      dispatchInfo: {
        prerequisiteTransferred: true,
        contactInfoAvailable: true,
        walkthroughLink: true,
        engineerRosterStatus: "Ready" as const
      }
    },
    {
      siteName: "Pharmaceutical E",
      openTickets: 4,
      averageAging: 1,
      siteType: "Cluster" as const,
      status: "Active" as const,
      location: "North Carolina",
      engineerAssignment: {
        dedicated: ["Kevin Thompson (OT-13)"],
        backup: ["Rachel Green (OT-14)"]
      },
      dispatchInfo: {
        prerequisiteTransferred: true,
        contactInfoAvailable: true,
        walkthroughLink: true,
        engineerRosterStatus: "Ready" as const
      }
    },
    {
      siteName: "Steel Mill F",
      openTickets: 0,
      averageAging: 0,
      siteType: "Dispatched" as const,
      status: "Offline" as const,
      location: "Pennsylvania",
      engineerAssignment: {
        dedicated: [],
        backup: []
      },
      dispatchInfo: {
        prerequisiteTransferred: false,
        contactInfoAvailable: false,
        walkthroughLink: false,
        engineerRosterStatus: "Unavailable" as const
      }
    }
  ];

  const geographicClusters = [
    {
      clusterName: "Texas Operations",
      location: "Texas",
      sites: ["Manufacturing Plant A", "Refinery Complex D"],
      totalTickets: 23,
      averageAging: 5,
      dedicatedEngineers: ["John Smith (OT-1)", "Sarah Johnson (OT-2)", "Robert Kim (OT-9)", "Jennifer Lee (OT-10)", "Carlos Martinez (OT-11)"],
      backupEngineers: ["Mike Davis (OT-3)", "Amy White (OT-12)"],
      status: "Active" as const
    },
    {
      clusterName: "Gulf Coast Cluster",
      location: "Louisiana",
      sites: ["Chemical Processing B"],
      totalTickets: 12,
      averageAging: 5,
      dedicatedEngineers: ["Alex Chen (OT-4)"],
      backupEngineers: ["Emma Wilson (OT-5)", "David Brown (OT-6)"],
      status: "Active" as const
    },
    {
      clusterName: "East Coast Operations",
      location: "North Carolina - Pennsylvania",
      sites: ["Pharmaceutical E", "Power Generation C", "Steel Mill F"],
      totalTickets: 10,
      averageAging: 1.5,
      dedicatedEngineers: ["Kevin Thompson (OT-13)", "Tom Rodriguez (OT-7)", "Lisa Parker (OT-8)"],
      backupEngineers: ["Rachel Green (OT-14)"],
      status: "Mixed" as const
    }
  ];

  const plantTypeClusters = [
    {
      clusterName: "Chemical & Pharmaceutical",
      plantTypes: ["Chemical Processing", "Pharmaceutical"],
      sites: ["Chemical Processing B", "Pharmaceutical E"],
      totalTickets: 16,
      averageAging: 3,
      dedicatedEngineers: ["Alex Chen (OT-4)", "Kevin Thompson (OT-13)"],
      backupEngineers: ["Emma Wilson (OT-5)", "David Brown (OT-6)", "Rachel Green (OT-14)"],
      status: "Active" as const
    },
    {
      clusterName: "Heavy Manufacturing",
      plantTypes: ["Manufacturing", "Refinery", "Steel"],
      sites: ["Manufacturing Plant A", "Refinery Complex D", "Steel Mill F"],
      totalTickets: 23,
      averageAging: 3.3,
      dedicatedEngineers: ["John Smith (OT-1)", "Sarah Johnson (OT-2)", "Robert Kim (OT-9)", "Jennifer Lee (OT-10)", "Carlos Martinez (OT-11)"],
      backupEngineers: ["Mike Davis (OT-3)", "Amy White (OT-12)"],
      status: "Active" as const
    },
    {
      clusterName: "Power & Utilities",
      plantTypes: ["Power Generation"],
      sites: ["Power Generation C"],
      totalTickets: 6,
      averageAging: 2,
      dedicatedEngineers: [],
      backupEngineers: ["Tom Rodriguez (OT-7)", "Lisa Parker (OT-8)"],
      status: "Maintenance" as const
    }
  ];

  const filteredSites = activeTab === "All" 
    ? mockSites 
    : mockSites.filter(site => site.siteType === activeTab);

  const getDisplayData = () => {
    if (viewMode === "clusters") {
      return activeTab === "Geographic" ? geographicClusters : plantTypeClusters;
    }
    return filteredSites;
  };

  const getMetricDetails = (metricType: string) => {
    let statusFilter = '';
    switch (metricType) {
      case "Open Tickets":
        statusFilter = 'open';
        break;
      case "In Progress":
        statusFilter = 'in_progress';
        break;
      case "Closed Today":
        statusFilter = 'closed';
        break;
      case "Overdue":
        // Filter tickets that are overdue (due_date < now and not closed)
        return tickets.filter(ticket => {
          if (!ticket.due_date || ticket.status === 'closed') return false;
          return new Date(ticket.due_date) < new Date();
        });
    }
    return getTicketsByStatus(statusFilter);
  };

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
      case "Closed": return <Badge className="bg-success text-success-foreground">Closed</Badge>;
      case "Overdue": return <Badge className="bg-destructive text-destructive-foreground">Overdue</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Monitor site status, ticket metrics, and OT engineer assignments</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Button variant="outline" size="sm">
            <TrendingUp className="h-4 w-4 mr-2" />
            Reports
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {ticketMetrics.map((metric, index) => (
          <div key={index} onClick={() => setSelectedMetric(metric.title)} className="cursor-pointer">
            <MetricCard {...metric} />
          </div>
        ))}
      </div>

      {/* View Mode Toggle */}
      <div className="flex items-center gap-4">
        <div className="flex gap-1 bg-muted rounded-lg p-1">
          <Button
            variant={viewMode === "sites" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setViewMode("sites")}
            className="px-4"
          >
            <MapPin className="h-4 w-4 mr-2" />
            Individual Sites
          </Button>
          <Button
            variant={viewMode === "clusters" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setViewMode("clusters")}
            className="px-4"
          >
            <Users className="h-4 w-4 mr-2" />
            Clusters
          </Button>
        </div>
      </div>

      {/* Site Status Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">
            {viewMode === "sites" ? "Site Status Overview" : "Cluster Management"}
          </h2>
          <div className="flex gap-1 bg-muted rounded-lg p-1">
            {viewMode === "sites" ? (
              ["All", "Dedicated", "Cluster", "Dispatched"].map((tab) => (
                <Button
                  key={tab}
                  variant={activeTab === tab ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab(tab as typeof activeTab)}
                  className="px-4"
                >
                  {tab}
                </Button>
              ))
            ) : (
              ["Geographic", "Plant Type"].map((tab) => (
                <Button
                  key={tab}
                  variant={activeTab === (tab === "Geographic" ? "Geographic" : "All") ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab(tab === "Geographic" ? "Geographic" : "All")}
                  className="px-4"
                >
                  {tab}
                </Button>
              ))
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {viewMode === "sites" ? (
            filteredSites.map((site, index) => (
              <div key={index} onClick={() => setSelectedSite(site)} className="cursor-pointer">
                <SiteCard {...site} />
              </div>
            ))
          ) : (
            getDisplayData().map((cluster, index) => (
              <ClusterCard key={index} {...cluster} />
            ))
          )}
        </div>
      </div>

      {/* Metric Details Modal */}
      <Dialog open={!!selectedMetric} onOpenChange={() => setSelectedMetric(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedMetric} Details</DialogTitle>
            <DialogDescription>
              Detailed view of {selectedMetric?.toLowerCase()} tickets from ServiceNow
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ticket ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Site</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assignee</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedMetric && getMetricDetails(selectedMetric).map((ticket, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-mono">{ticket.servicenow_id || ticket.id}</TableCell>
                    <TableCell className="font-medium">{ticket.title}</TableCell>
                    <TableCell>{ticket.site_id || 'N/A'}</TableCell>
                    <TableCell>{getPriorityBadge(ticket.priority)}</TableCell>
                    <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                    <TableCell>{ticket.assigned_to || 'Unassigned'}</TableCell>
                    <TableCell>{new Date(ticket.created).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Open
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>

      {/* Site Details Modal */}
      <Dialog open={!!selectedSite} onOpenChange={() => setSelectedSite(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedSite?.siteName} Details</DialogTitle>
            <DialogDescription>
              Comprehensive site information and engineer assignments
            </DialogDescription>
          </DialogHeader>
          {selectedSite && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold">Site Information</h4>
                  <div className="space-y-1 text-sm">
                    <div><span className="text-muted-foreground">Location:</span> {selectedSite.location}</div>
                    <div><span className="text-muted-foreground">Type:</span> {selectedSite.siteType}</div>
                    <div><span className="text-muted-foreground">Status:</span> <Badge variant={selectedSite.status === "Active" ? "default" : "secondary"}>{selectedSite.status}</Badge></div>
                    <div><span className="text-muted-foreground">Open Tickets:</span> {selectedSite.openTickets}</div>
                    <div><span className="text-muted-foreground">Average Aging:</span> {selectedSite.averageAging} days</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Dispatch Status</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${selectedSite.dispatchInfo.prerequisiteTransferred ? 'bg-success' : 'bg-destructive'}`} />
                      <span>Prerequisites Transferred</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${selectedSite.dispatchInfo.contactInfoAvailable ? 'bg-success' : 'bg-destructive'}`} />
                      <span>Contact Info Available</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${selectedSite.dispatchInfo.walkthroughLink ? 'bg-success' : 'bg-destructive'}`} />
                      <span>Walkthrough Link Ready</span>
                    </div>
                    <div><span className="text-muted-foreground">Engineer Status:</span> <Badge variant="outline">{selectedSite.dispatchInfo.engineerRosterStatus}</Badge></div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-semibold">Engineer Assignments</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="text-sm font-medium text-muted-foreground mb-2">Dedicated Engineers</h5>
                    <div className="space-y-2">
                      {selectedSite.engineerAssignment.dedicated.map((engineer: string, index: number) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                          <User className="h-4 w-4" />
                          <span className="text-sm">{engineer}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h5 className="text-sm font-medium text-muted-foreground mb-2">Backup Engineers</h5>
                    <div className="space-y-2">
                      {selectedSite.engineerAssignment.backup.map((engineer: string, index: number) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                          <User className="h-4 w-4" />
                          <span className="text-sm">{engineer}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
