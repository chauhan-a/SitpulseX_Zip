import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Settings, RefreshCw, CheckCircle, AlertCircle, Bot } from 'lucide-react';

interface OllamaModel {
  name: string;
  size: string;
  modified_at: string;
}

export const OllamaSettings = () => {
  const [ollamaUrl, setOllamaUrl] = useState('http://localhost:11434');
  const [availableModels, setAvailableModels] = useState<OllamaModel[]>([]);
  const [selectedModel, setSelectedModel] = useState('llama3');
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load saved settings from localStorage
    const savedUrl = localStorage.getItem('ollama_url');
    const savedModel = localStorage.getItem('ollama_model');
    
    if (savedUrl) setOllamaUrl(savedUrl);
    if (savedModel) setSelectedModel(savedModel);
    
    // Test connection on load
    testConnection();
  }, []);

  const testConnection = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${ollamaUrl}/api/tags`);
      if (response.ok) {
        const data = await response.json();
        setAvailableModels(data.models || []);
        setIsConnected(true);
        
        toast({
          title: "Connected to Ollama",
          description: `Found ${data.models?.length || 0} models`
        });
      } else {
        throw new Error('Failed to connect');
      }
    } catch (error) {
      setIsConnected(false);
      setAvailableModels([]);
      toast({
        title: "Connection Failed",
        description: "Make sure Ollama is running on the specified URL",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveSettings = () => {
    localStorage.setItem('ollama_url', ollamaUrl);
    localStorage.setItem('ollama_model', selectedModel);
    
    toast({
      title: "Settings Saved",
      description: "Ollama configuration has been saved"
    });
  };

  const pullModel = async (modelName: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`${ollamaUrl}/api/pull`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: modelName }),
      });

      if (response.ok) {
        toast({
          title: "Model Download Started",
          description: `Pulling ${modelName}... This may take several minutes.`
        });
        
        // Refresh models after a delay
        setTimeout(() => {
          testConnection();
        }, 5000);
      } else {
        throw new Error('Failed to pull model');
      }
    } catch (error) {
      toast({
        title: "Download Failed",
        description: `Failed to download ${modelName}`,
        variant: "destructive"
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
    'gemma2'
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
          <div className="space-y-2">
            <Label htmlFor="ollama-url">Ollama Server URL</Label>
            <Input
              id="ollama-url"
              value={ollamaUrl}
              onChange={(e) => setOllamaUrl(e.target.value)}
              placeholder="http://localhost:11434"
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={testConnection} disabled={isLoading}>
              {isLoading ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Test Connection
            </Button>
            <Button onClick={saveSettings} variant="outline">
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
            <CardDescription>
              Select your preferred model for AI assistance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Selected Model</Label>
              <Select value={selectedModel} onValueChange={setSelectedModel}>
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
          <CardDescription>
            Pull popular models from Ollama registry
          </CardDescription>
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
            Note: Model downloads can be several GB and may take time depending on your internet connection.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};