import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import pb from '@/lib/pb'; // PocketBase client instance
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RefreshCw, CheckCircle, AlertCircle, Bot, Settings } from 'lucide-react';

interface OllamaModel {
  name: string;
  size: string;
  modified_at: string;
}

interface UserOllamaSettings {
  id?: string; // PocketBase record ID
  user_id: string;
  ollama_url: string;
  selected_model: string;
}

export const AIProviderSettings = () => {
  const navigate = useNavigate();
  const [ollamaUrl, setOllamaUrl] = useState('http://localhost:11434');
  const [availableModels, setAvailableModels] = useState<OllamaModel[]>([]);
  const [selectedModel, setSelectedModel] = useState('llama3');
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [userSettingsId, setUserSettingsId] = useState<string | null>(null);
  const { toast } = useToast();

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = pb.authStore.onChange(() => {
      if (!pb.authStore.isValid) {
        // If user logs out, redirect to login or clear data
        toast({
          title: 'Logged out',
          description: 'Please log in to manage AI provider settings.',
          variant: 'destructive',
        });
        navigate('/login');
      } else {
        // If logged in, load user settings
        loadUserSettings();
      }
    });

    // Initial check on mount
    if (!pb.authStore.isValid) {
      setError('You must be logged in to manage AI providers.');
      navigate('/login');
      return () => unsubscribe();
    }

    loadUserSettings();

    return () => unsubscribe();
  }, [navigate, toast]);

  // Load Ollama settings saved for this user in PocketBase
  const loadUserSettings = async () => {
    setIsLoading(true);
    setError('');
    try {
      const user = pb.authStore.model;
      if (!user) throw new Error('User not authenticated');

      const records = await pb
        .collection('ollama_settings')
        .getFullList(1, {
          filter: `user_id = "${user.id}"`,
        });

      if (records.length > 0) {
        const settings = records[0];
        setUserSettingsId(settings.id);
        setOllamaUrl(settings.ollama_url);
        setSelectedModel(settings.selected_model);
        // After loading, test connection and fetch models
        await testConnection(settings.ollama_url);
      } else {
        // No saved settings - test default URL
        await testConnection(ollamaUrl);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load your Ollama settings.');
      // fallback: test default URL anyway
      await testConnection(ollamaUrl);
    } finally {
      setIsLoading(false);
    }
  };

  // Test connection to Ollama server and fetch models
  const testConnection = async (url: string) => {
    setIsLoading(true);
    setError('');
    setIsConnected(false);
    try {
      const response = await fetch(`${url}/api/tags`);
      if (!response.ok) throw new Error('Failed to connect');
      const data = await response.json();
      setAvailableModels(data.models || []);
      setIsConnected(true);

      toast({
        title: 'Connected to Ollama',
        description: `Found ${data.models?.length || 0} models`,
      });
    } catch (err) {
      setAvailableModels([]);
      setIsConnected(false);
      setError('Failed to connect to Ollama server. Make sure it is running.');
      toast({
        title: 'Connection Failed',
        description: 'Make sure Ollama is running on the specified URL',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Save/update Ollama settings in PocketBase
  const saveSettings = async () => {
    if (!pb.authStore.isValid) {
      toast({
        title: 'Not logged in',
        description: 'Please log in to save your settings.',
        variant: 'destructive',
      });
      navigate('/login');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const user = pb.authStore.model;
      if (!user) throw new Error('User not authenticated');

      const data: UserOllamaSettings = {
        user_id: user.id,
        ollama_url: ollamaUrl,
        selected_model: selectedModel,
      };

      if (userSettingsId) {
        await pb.collection('ollama_settings').update(userSettingsId, data);
      } else {
        const newRecord = await pb.collection('ollama_settings').create(data);
        setUserSettingsId(newRecord.id);
      }

      toast({
        title: 'Settings Saved',
        description: 'Ollama configuration has been saved',
      });
    } catch (err) {
      console.error(err);
      toast({
        title: 'Failed to save settings',
        description: 'There was an error saving your settings',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Pull model from Ollama registry
  const pullModel = async (modelName: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${ollamaUrl}/api/pull`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: modelName }),
      });
      if (!response.ok) throw new Error('Failed to pull model');

      toast({
        title: 'Model Download Started',
        description: `Pulling ${modelName}... This may take several minutes.`,
      });

      setTimeout(() => testConnection(ollamaUrl), 5000);
    } catch (err) {
      toast({
        title: 'Download Failed',
        description: `Failed to download ${modelName}`,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const popularModels = [
    'llama3.2',
    'llama3.1',
    'llama3',
    'mistral',
    'codellama',
    'phi3',
    'qwen2',
    'gemma2',
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Ollama Configuration
          </CardTitle>
          <CardDescription>
            Configure your local Ollama server connection and manage AI models
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <Label htmlFor="ollama-url">Ollama Server URL</Label>
            <Input
              id="ollama-url"
              value={ollamaUrl}
              onChange={(e) => setOllamaUrl(e.target.value)}
              placeholder="http://localhost:11434"
              disabled={isLoading}
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={() => testConnection(ollamaUrl)} disabled={isLoading}>
              {isLoading ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Test Connection
            </Button>
            <Button onClick={saveSettings} variant="outline" disabled={isLoading}>
              Save Settings
            </Button>
          </div>

          <Alert>
            <div className="flex items-center gap-2">
              {isConnected ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-500" />
              )}
              <AlertDescription>
                Status: {isConnected ? 'Connected' : 'Disconnected'}
                {isConnected && ` - ${availableModels.length} models available`}
              </AlertDescription>
            </div>
          </Alert>
        </CardContent>
      </Card>

      {isConnected && (
        <Card>
          <CardHeader>
            <CardTitle>Installed Models</CardTitle>
            <CardDescription>Select your preferred model for AI assistance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Selected Model</Label>
              <Select value={selectedModel} onValueChange={setSelectedModel} disabled={isLoading}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a model" />
                </SelectTrigger>
                <SelectContent>
                  {availableModels.map((model) => (
                    <SelectItem key={model.name} value={model.name}>
                      <div className="flex items-center gap-2">
                        <Bot className="h-4 w-4" />
                        <span>{model.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {model.size || 'Unknown size'}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {availableModels.map((model) => (
                <div
                  key={model.name}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedModel === model.name
                      ? 'border-primary bg-primary/10'
                      : 'hover:border-primary/50'
                  }`}
                  onClick={() => setSelectedModel(model.name)}
                >
                  <div className="font-medium text-sm">{model.name}</div>
                  <div className="text-xs text-muted-foreground">
                    Modified: {new Date(model.modified_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Download New Models</CardTitle>
          <CardDescription>Pull popular models from Ollama registry</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {popularModels.map((modelName) => (
              <Button
                key={modelName}
                variant="outline"
                onClick={() => pullModel(modelName)}
                disabled={isLoading || !isConnected}
                className="justify-start"
              >
                <Bot className="h-4 w-4 mr-2" />
                {modelName}
              </Button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Note: Model downloads can be several GB and may take time depending on your
            internet connection.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
