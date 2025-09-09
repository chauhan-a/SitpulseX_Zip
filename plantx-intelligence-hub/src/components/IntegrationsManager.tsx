import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Settings, Trash2, RefreshCw } from 'lucide-react';

interface Integration {
  id: string;
  name: string;
  type: string;
  status: string;
  config: any;
  last_sync?: string;
}

export const IntegrationsManager = () => {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newIntegration, setNewIntegration] = useState({
    name: '',
    type: '',
    config: {}
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchIntegrations();
  }, []);

  const fetchIntegrations = async () => {
    try {
      const { data, error } = await supabase
        .from('integrations')
        .select('*');
      
      if (error) throw error;
      setIntegrations(data || []);
    } catch (error) {
      console.error('Error fetching integrations:', error);
      toast({
        title: "Error",
        description: "Failed to fetch integrations",
        variant: "destructive",
      });
    }
  };

  const handleAddIntegration = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('integrations')
        .insert({
          user_id: user.id,
          name: newIntegration.name,
          type: newIntegration.type as any,
          config: newIntegration.config
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Integration added successfully",
      });

      setShowAddDialog(false);
      setNewIntegration({ name: '', type: '', config: {} });
      fetchIntegrations();
    } catch (error) {
      console.error('Error adding integration:', error);
      toast({
        title: "Error",
        description: "Failed to add integration",
        variant: "destructive",
      });
    }
  };

  const testConnection = async (integration: Integration) => {
    try {
      const { data, error } = await supabase.functions.invoke('database-integration', {
        body: {
          action: 'test_connection',
          database_type: integration.type,
          config: integration.config
        }
      });

      if (error) throw error;

      toast({
        title: data.connected ? "Success" : "Failed",
        description: data.connected ? "Connection successful" : `Connection failed: ${data.error}`,
        variant: data.connected ? "default" : "destructive",
      });
    } catch (error) {
      console.error('Error testing connection:', error);
      toast({
        title: "Error",
        description: "Failed to test connection",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return <Badge className="bg-green-100 text-green-800">Connected</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800">Error</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">API Integrations</h3>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Integration
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Integration</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="integration-name">Name</Label>
                <Input
                  id="integration-name"
                  value={newIntegration.name}
                  onChange={(e) => setNewIntegration({ ...newIntegration, name: e.target.value })}
                  placeholder="ServiceNow Production"
                />
              </div>
              <div>
                <Label htmlFor="integration-type">Type</Label>
                <Select onValueChange={(value) => setNewIntegration({ ...newIntegration, type: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select integration type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="servicenow">ServiceNow</SelectItem>
                    <SelectItem value="database">Database</SelectItem>
                    <SelectItem value="ai_tool">AI Tool</SelectItem>
                    <SelectItem value="custom_app">Custom App</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleAddIntegration} className="w-full">
                Add Integration
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {integrations.map((integration) => (
          <Card key={integration.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{integration.name}</CardTitle>
                {getStatusBadge(integration.status)}
              </div>
              <CardDescription className="capitalize">{integration.type.replace('_', ' ')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {integration.last_sync && (
                  <p className="text-xs text-muted-foreground">
                    Last sync: {new Date(integration.last_sync).toLocaleString()}
                  </p>
                )}
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => testConnection(integration)}
                  >
                    <RefreshCw className="h-3 w-3 mr-1" />
                    Test
                  </Button>
                  <Button variant="outline" size="sm">
                    <Settings className="h-3 w-3 mr-1" />
                    Config
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};