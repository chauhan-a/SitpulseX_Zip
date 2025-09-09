import { useState } from 'react';
import { useOllama } from '@/hooks/useOllama';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from '@/components/ui/use-toast';
import { Wrench, Loader2, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

interface Ticket {
  id: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  site_id?: string;
  assigned_to?: string;
  created_at: string;
}

interface TicketResolverProps {
  tickets: Ticket[];
  onTicketUpdate?: (ticketId: string, resolution: string) => void;
}

export const TicketResolver = ({ tickets, onTicketUpdate }: TicketResolverProps) => {
  const { generateTicketResolution, isLoading } = useOllama();
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [resolution, setResolution] = useState<string>('');
  const [generatingFor, setGeneratingFor] = useState<string | null>(null);

  const getPriorityIcon = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      case 'medium':
        return <Clock className="h-4 w-4 text-primary" />;
      default:
        return <CheckCircle2 className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'critical':
        return <Badge variant="destructive">Critical</Badge>;
      case 'high':
        return <Badge className="bg-warning text-warning-foreground">High</Badge>;
      case 'medium':
        return <Badge variant="secondary">Medium</Badge>;
      default:
        return <Badge variant="outline">Low</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open':
        return <Badge variant="outline">Open</Badge>;
      case 'in progress':
        return <Badge className="bg-primary text-primary-foreground">In Progress</Badge>;
      case 'resolved':
        return <Badge className="bg-success text-success-foreground">Resolved</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleGenerateResolution = async (ticket: Ticket) => {
    setGeneratingFor(ticket.id);
    try {
      const generatedResolution = await generateTicketResolution(
        ticket.title,
        ticket.description || 'No description provided',
        ticket.priority
      );
      setSelectedTicket(ticket);
      setResolution(generatedResolution);
      toast({
        title: "Resolution Generated",
        description: `AI-generated resolution for ticket ${ticket.id}`
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate resolution. Please check your Ollama connection.",
        variant: "destructive"
      });
    } finally {
      setGeneratingFor(null);
    }
  };

  const handleApplyResolution = () => {
    if (selectedTicket && resolution && onTicketUpdate) {
      onTicketUpdate(selectedTicket.id, resolution);
      toast({
        title: "Resolution Applied",
        description: `Resolution applied to ticket ${selectedTicket.id}`
      });
      setSelectedTicket(null);
      setResolution('');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      {/* Left Panel - Ticket List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            Open Tickets
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px]">
            <div className="space-y-3">
              {tickets.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Wrench className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No tickets available</p>
                </div>
              ) : (
                tickets.map((ticket) => (
                  <Card 
                    key={ticket.id} 
                    className={`cursor-pointer transition-colors ${
                      selectedTicket?.id === ticket.id ? 'ring-2 ring-primary' : 'hover:bg-muted/50'
                    }`}
                    onClick={() => setSelectedTicket(ticket)}
                  >
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              {getPriorityIcon(ticket.priority)}
                              <span className="font-medium text-sm">{ticket.id}</span>
                            </div>
                            <h3 className="font-semibold leading-tight">{ticket.title}</h3>
                          </div>
                          <div className="flex flex-col gap-1">
                            {getPriorityBadge(ticket.priority)}
                            {getStatusBadge(ticket.status)}
                          </div>
                        </div>
                        
                        {ticket.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {ticket.description}
                          </p>
                        )}
                        
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{ticket.assigned_to || 'Unassigned'}</span>
                          <span>{new Date(ticket.created_at).toLocaleDateString()}</span>
                        </div>
                        
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleGenerateResolution(ticket);
                          }}
                          disabled={generatingFor === ticket.id || isLoading}
                          size="sm"
                          className="w-full"
                        >
                          {generatingFor === ticket.id ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Generating...
                            </>
                          ) : (
                            <>
                              <Wrench className="h-4 w-4 mr-2" />
                              Generate Resolution
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Right Panel - Resolution Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>AI-Generated Resolution</span>
            {selectedTicket && resolution && (
              <Button onClick={handleApplyResolution} size="sm">
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Apply Resolution
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedTicket && resolution ? (
            <ScrollArea className="h-[600px]">
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-semibold mb-2">Ticket Details</h3>
                  <div className="space-y-2 text-sm">
                    <div><strong>ID:</strong> {selectedTicket.id}</div>
                    <div><strong>Title:</strong> {selectedTicket.title}</div>
                    <div><strong>Priority:</strong> {selectedTicket.priority}</div>
                    <div><strong>Status:</strong> {selectedTicket.status}</div>
                    {selectedTicket.assigned_to && (
                      <div><strong>Assigned To:</strong> {selectedTicket.assigned_to}</div>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-semibold">AI-Generated Resolution Plan</h3>
                  <div className="prose prose-sm max-w-none">
                    <pre className="whitespace-pre-wrap text-sm bg-background p-4 rounded-lg border">
                      {resolution}
                    </pre>
                  </div>
                </div>
              </div>
            </ScrollArea>
          ) : (
            <div className="flex items-center justify-center h-[600px] text-muted-foreground">
              <div className="text-center">
                <Wrench className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Select a ticket to generate resolution</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};