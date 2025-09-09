
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Users, Clock, Wrench, ExternalLink } from "lucide-react";

interface ClusterCardProps {
  clusterName: string;
  location?: string;
  plantTypes?: string[];
  sites: string[];
  totalTickets: number;
  averageAging: number;
  dedicatedEngineers: string[];
  backupEngineers: string[];
  status: "Active" | "Maintenance" | "Mixed" | "Offline";
}

export const ClusterCard = ({ 
  clusterName,
  location,
  plantTypes,
  sites,
  totalTickets,
  averageAging,
  dedicatedEngineers,
  backupEngineers,
  status
}: ClusterCardProps) => {
  const statusColors = {
    Active: "bg-success text-success-foreground",
    Maintenance: "bg-warning text-warning-foreground",
    Mixed: "bg-secondary text-secondary-foreground",
    Offline: "bg-destructive text-destructive-foreground"
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">{clusterName}</CardTitle>
          <Badge className={statusColors[status]} variant="secondary">
            {status}
          </Badge>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>{location || plantTypes?.join(", ")}</span>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Total Tickets</p>
            <p className="text-xl font-bold text-foreground">{totalTickets}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Avg. Aging</p>
            <p className="text-xl font-bold text-foreground">{averageAging}d</p>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">Sites ({sites.length})</p>
          <div className="flex flex-wrap gap-1">
            {sites.slice(0, 2).map((site, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {site.split(' ')[0]}
              </Badge>
            ))}
            {sites.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{sites.length - 2} more
              </Badge>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <p className="text-sm font-medium text-foreground">Dedicated OT Engineers ({dedicatedEngineers.length})</p>
            </div>
            {dedicatedEngineers.length > 0 ? (
              <div className="space-y-1">
                {dedicatedEngineers.slice(0, 3).map((engineer, index) => (
                  <div key={index} className="flex items-center gap-2 text-xs">
                    <div className="w-2 h-2 rounded-full bg-success" />
                    <span className="text-muted-foreground">{engineer}</span>
                  </div>
                ))}
                {dedicatedEngineers.length > 3 && (
                  <div className="text-xs text-muted-foreground ml-4">
                    +{dedicatedEngineers.length - 3} more engineers
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground ml-6">No dedicated engineers assigned</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Wrench className="h-4 w-4 text-secondary" />
              <p className="text-sm font-medium text-foreground">Backup Engineers ({backupEngineers.length})</p>
            </div>
            {backupEngineers.length > 0 ? (
              <div className="space-y-1">
                {backupEngineers.slice(0, 2).map((engineer, index) => (
                  <div key={index} className="flex items-center gap-2 text-xs">
                    <div className="w-2 h-2 rounded-full bg-warning" />
                    <span className="text-muted-foreground">{engineer}</span>
                  </div>
                ))}
                {backupEngineers.length > 2 && (
                  <div className="text-xs text-muted-foreground ml-4">
                    +{backupEngineers.length - 2} more backup engineers
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground ml-6">No backup engineers available</p>
            )}
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" className="flex-1">
            <Clock className="h-4 w-4 mr-1" />
            Manage
          </Button>
          <Button variant="ghost" size="sm">
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
