import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Settings, Trash2, Eye, EyeOff, TestTube } from 'lucide-react';

interface AIProvider {
  id: string;
  provider_name: string;
  api_key: string;
  model_name: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const AI_PROVIDERS = [
  { value: 'openai', label: 'OpenAI (ChatGPT)', defaultModel: 'gpt-4o-mini' },
  { value: 'deepseek', label: 'DeepSeek', defaultModel: 'deepseek-chat' },
  { value: 'anthropic', label: 'Anthropic (Claude)', defaultModel: 'claude-3-haiku-20240307' },
  { value: 'gemini', label: 'Google Gemini', defaultModel: 'gemini-pro' },
  { value: 'llama', label: 'Llama (via Perplexity)', defaultModel: 'llama-3.1-sonar-small-128k-online' },
  { value: 'huggingface', label: 'Hugging Face', defaultModel: 'microsoft/DialoGPT-medium' },
  { value: 'ollama', label: 'OLLAMA (Local)', defaultModel: '' }, // Added OLLAMA
];

export const AIProviderSettings = () => {
  const [providers, setProviders] = useState<AIProvider[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showKeys, setShowKeys] = useState<{ [key: string]: boolean }>({});
  const [newProvider, setNewProvider] = useState({
    provider_name: '',
    api_key: '',
    model_name: '',
  });
  const [ollamaModels, setOllamaModels] = useState<string[]>([]);
  const [loadingOllamaModels, setLoadingOllamaModels] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      const { data, error } = await supabase
        .from('ai_providers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProviders(data || []);
    } catch (error) {
      console.error('Error fetching AI providers:', error);
      toast({ title: "Error", description: "Failed to fetch AI providers", variant: "destructive" });
    }
  };

  const fetchOllamaModels = async () => {
    setLoadingOllamaModels(true);
    try {
      const response = await fetch('http://localhost:11434/api/tags');
      if (!response.ok) throw new Error('Failed to fetch OLLAMA models');
      const json = await response.json();
      const modelNames = (json.models || []).map((m: any) => m.name);
      setOllamaModels(modelNames);
    } catch (error) {
      console.error('Error fetching OLLAMA models:', error);
      setOllamaModels([]);
    } finally {
      setLoadingOllamaModels(false);
    }
  };

  const handleAddProvider = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const config = AI_PROVIDERS.find(p => p.value === newProvider.provider_name);
      const model_name = newProvider.model_name || config?.defaultModel || null;

      const { error } = await supabase
        .from('ai_providers')
        .insert({
          user_id: user.id,
          provider_name: newProvider.provider_name,
          api_key: newProvider.api_key,
          model_name,
        });

      if (error) throw error;

      toast({ title: "Success", description: "AI provider added successfully" });
      setShowAddDialog(false);
      setNewProvider({ provider_name: '', api_key: '', model_name: '' });
      fetchProviders();
    } catch (err: any) {
      console.error('Error adding AI provider:', err);
      toast({
        title: "Error",
        description: err.message.includes('duplicate') ? "This provider is already configured" : "Failed to add AI provider",
        variant: "destructive",
      });
    }
  };

  const toggleProvider = async (id: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('ai_providers')
        .update({ is_active: isActive })
        .eq('id', id);
      if (error) throw error;
      toast({ title: "Success", description: `Provider ${isActive ? 'enabled' : 'disabled'}` });
      fetchProviders();
    } catch (error) {
      console.error('Error updating provider:', error);
      toast({ title: "Error", description: "Failed to update provider", variant: "destructive" });
    }
  };

  const deleteProvider = async (id: string) => {
    try {
      const { error } = await supabase
        .from('ai_providers')
        .delete()
        .eq('id', id);
      if (error) throw error;
      toast({ title: "Success", description: "Provider deleted successfully" });
      fetchProviders();
    } catch (error) {
      console.error('Error deleting provider:', error);
      toast({ title: "Error", description: "Failed to delete provider", variant: "destructive" });
    }
  };

  const testProvider = async (provider: AIProvider) => {
    try {
      if (provider.provider_name === 'ollama') {
        // Local OLLAMA test via /api/generate
        const resp = await fetch('http://localhost:11434/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ model: provider.model_name, prompt: "Hello from test", stream: false }),
        });
        if (!resp.ok) throw new Error('OLLAMA test failed');
        toast({ title: "Test Successful", description: "OLLAMA API is working correctly" });
        return;
      }

      const { error } = await supabase.functions.invoke('ai-integration', {
        body: {
          provider: provider.provider_name,
          question: 'Hello, this is a test message',
          context: 'Testing API connection',
          user_api_key: provider.api_key,
          model: provider.model_name,
        },
      });
      if (error) throw error;
      toast({ title: "Test Successful", description: `${provider.provider_name} API is working correctly` });
    } catch (error) {
      console.error('Error testing provider:', error);
      toast({ title: "Test Failed", description: "API connection test failed", variant: "destructive" });
    }
  };

  const toggleKeyVisibility = (id: string) => {
    setShowKeys(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const maskApiKey = (key: string) => {
    if (key.length <= 8) return '*'.repeat(key.length);
    return key.substring(0, 4) + '*'.repeat(key.length - 8) + key.substring(key.length - 4);
  };

  const getProviderLabel = (name: string) => AI_PROVIDERS.find(p => p.value === name)?.label || name;

  return (
    <div className="space-y-6">
      {/* Header + Add Dialog */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">AI Provider Settings</h3>
          <p className="text-sm text-muted-foreground">Configure your API keys for different AI providers</p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />Add Provider</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add AI Provider</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Provider</Label>
                <Select onValueChange={(v) => {
                  setNewProvider({ provider_name: v, api_key: '', model_name: '' });
                  if (v === 'ollama') fetchOllamaModels();
                }}>
                  <SelectTrigger><SelectValue placeholder="Select AI provider" /></SelectTrigger>
                  <SelectContent>
                    {AI_PROVIDERS.map((p) => (
                      <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>API Key</Label>
                <Input
                  type="password"
                  value={newProvider.api_key}
                  onChange={(e) => setNewProvider({ ...newProvider, api_key: e.target.value })}
                  placeholder="Enter your API key"
                />
              </div>

              {newProvider.provider_name === 'ollama' ? (
                <div>
                  <Label>Select OLLAMA Model</Label>
                  {loadingOllamaModels ? (
                    <p>Loading models...</p>
                  ) : (
                    <Select onValueChange={(m) => setNewProvider({ ...newProvider, model_name: m })} value={newProvider.model_name}>
                      <SelectTrigger><SelectValue placeholder="Select OLLAMA model" /></SelectTrigger>
                      <SelectContent>
                        {ollamaModels.length === 0 ? (
                          <SelectItem value="">No models found</SelectItem>
                        ) : (
                          ollamaModels.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)
                        )}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              ) : (
                <div>
                  <Label>Model Name (Optional)</Label>
                  <Input
                    value={newProvider.model_name}
                    onChange={(e) => setNewProvider({ ...newProvider, model_name: e.target.value })}
                    placeholder="Leave empty for default model"
                  />
                </div>
              )}

              <Button onClick={handleAddProvider} className="w-full">Add Provider</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Existing Providers List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {providers.map((prov) => (
          <Card key={prov.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{getProviderLabel(prov.provider_name)}</CardTitle>
                <div className="flex items-center gap-2">
                  <Switch checked={prov.is_active} onCheckedChange={(c) => toggleProvider(prov.id, c)} />
                  {prov.is_active
                    ? <Badge className="bg-green-100 text-green-800">Active</Badge>
                    : <Badge variant="secondary">Inactive</Badge>}
                </div>
              </div>
              <CardDescription>Model: {prov.model_name || 'Default'}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Label className="text-xs">API Key:</Label>
                  <code className="text-xs bg-muted px-2 py-1 rounded flex-1">
                    {showKeys[prov.id] ? prov.api_key : maskApiKey(prov.api_key)}
                  </code>
                  <Button variant="ghost" size="sm" onClick={() => toggleKeyVisibility(prov.id)}>
                    {showKeys[prov.id] ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => testProvider(prov)} disabled={!prov.is_active}>
                    <TestTube className="h-3 w-3 mr-1" />Test
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => deleteProvider(prov.id)}>
                    <Trash2 className="h-3 w-3 mr-1" />Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {providers.length === 0 && (
        <Card>
          <CardContent className="py-8 flex flex-col items-center">
            <Settings className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No AI Providers Configured</h3>
            <p className="text-muted-foreground text-center mb-4">
              Add your first AI provider to start using AI features
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
