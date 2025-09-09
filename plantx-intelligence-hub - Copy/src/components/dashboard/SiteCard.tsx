
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Users, ExternalLink, Wrench } from "lucide-react";

interface SiteCardProps {
  siteName: string;
  openTickets: number;
  averageAging: number;
  siteType: "Dedicated" | "Cluster" | "Dispatched";
  status: "Active" | "Maintenance" | "Offline";
  location?: string;
  engineerAssignment?: {
    dedicated: string[];
    backup: string[];
  };
  dispatchInfo: {
    prerequisiteTransferred: boolean;
    contactInfoAvailable: boolean;
    walkthroughLink: boolean;
    engineerRosterStatus: "Ready" | "Pending" | "Unavailable";
  };
}

export const SiteCard = ({ 
  siteName, 
  openTickets, 
  averageAging, 
  siteType, 
  status,
  location,
  engineerAssignment,
  dispatchInfo 
}: SiteCardProps) => {
  const statusColors = {
    Active: "bg-success text-success-foreground",
    Maintenance: "bg-warning text-warning-foreground",
    Offline: "bg-destructive text-destructive-foreground"
  };

  const typeColors = {
    Dedicated: "bg-primary text-primary-foreground",
    Cluster: "bg-secondary text-secondary-foreground", 
    Dispatched: "bg-accent text-accent-foreground"
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">{siteName}</CardTitle>
          <div className="flex gap-2">
            <Badge className={statusColors[status]} variant="secondary">
              {status}
            </Badge>
            <Badge className={typeColors[siteType]} variant="outline">
              {siteType}
            </Badge>
          </div>
        </div>
        {location && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{location}</span>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Open Tickets</p>
            <p className="text-xl font-bold text-foreground">{openTickets}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Avg. Aging</p>
            <p className="text-xl font-bold text-foreground">{averageAging}d</p>
          </div>
        </div>

        {engineerAssignment && (
          <div className="space-y-3">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <p className="text-sm font-medium text-foreground">
                  Dedicated OT ({engineerAssignment.dedicated.length})
                </p>
              </div>
              {engineerAssignment.dedicated.length > 0 ? (
                <div className="space-y-1">
                  {engineerAssignment.dedicated.slice(0, 2).map((engineer, index) => (
                    <div key={index} className="flex items-center gap-2 text-xs">
                      <div className="w-2 h-2 rounded-full bg-success" />
                      <span className="text-muted-foreground">{engineer}</span>
                    </div>
                  ))}
                  {engineerAssignment.dedicated.length > 2 && (
                    <div className="text-xs text-muted-foreground ml-4">
                      +{engineerAssignment.dedicated.length - 2} more
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground ml-6">No dedicated engineers</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Wrench className="h-4 w-4 text-secondary" />
                <p className="text-sm font-medium text-foreground">
                  Backup ({engineerAssignment.backup.length})
                </p>
              </div>
              {engineerAssignment.backup.length > 0 ? (
                <div className="space-y-1">
                  {engineerAssignment.backup.slice(0, 1).map((engineer, index) => (
                    <div key={index} className="flex items-center gap-2 text-xs">
                      <div className="w-2 h-2 rounded-full bg-warning" />
                      <span className="text-muted-foreground">{engineer}</span>
                    </div>
                  ))}
                  {engineerAssignment.backup.length > 1 && (
                    <div className="text-xs text-muted-foreground ml-4">
                      +{engineerAssignment.backup.length - 1} more backup
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground ml-6">No backup available</p>
              )}
            </div>
          </div>
        )}

        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">Dispatch Status</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                dispatchInfo.prerequisiteTransferred ? "bg-success" : "bg-destructive"
              }`} />
              <span className="text-muted-foreground">Prerequisites</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                dispatchInfo.contactInfoAvailable ? "bg-success" : "bg-destructive"
              }`} />
              <span className="text-muted-foreground">Contact Info</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                dispatchInfo.walkthroughLink ? "bg-success" : "bg-destructive"
              }`} />
              <span className="text-muted-foreground">Walkthrough</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                dispatchInfo.engineerRosterStatus === "Ready" ? "bg-success" : 
                dispatchInfo.engineerRosterStatus === "Pending" ? "bg-warning" : "bg-destructive"
              }`} />
              <span className="text-muted-foreground">Engineers</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" className="flex-1">
            <MapPin className="h-4 w-4 mr-1" />
            View Details
          </Button>
          <Button variant="ghost" size="sm">
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
