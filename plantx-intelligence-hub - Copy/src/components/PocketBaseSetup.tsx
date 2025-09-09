import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { ExternalLink, Database, CheckCircle } from 'lucide-react';

export const PocketBaseSetup = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            PocketBase Local Setup Guide
          </CardTitle>
          <CardDescription>
            Your application is now configured to use local PocketBase server
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Configuration Complete!</strong> Your app is now using:
              <ul className="mt-2 space-y-1">
                <li>• PocketBase Server: http://127.0.0.1:8090</li>
                <li>• Ollama Server: http://localhost:11434 (llama3 model)</li>
                <li>• Google Sheet Import: Your provided sheet URL</li>
                <li>• Local Development Mode</li>
              </ul>
            </AlertDescription>
          </Alert>
          
          <div className="space-y-3">
            <h4 className="font-semibold">Database Collections Created:</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="p-2 bg-muted rounded">📋 tickets</div>
              <div className="p-2 bg-muted rounded">🏭 sites</div>
              <div className="p-2 bg-muted rounded">📝 sops</div>
              <div className="p-2 bg-muted rounded">📚 knowledge_articles</div>
              <div className="p-2 bg-muted rounded">🤖 ai_providers</div>
              <div className="p-2 bg-muted rounded">🔗 integrations</div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold">Quick Start:</h4>
            <ol className="text-sm space-y-1 list-decimal list-inside">
              <li>Ensure PocketBase is running on port 8090</li>
              <li>Ensure Ollama is running with llama3 model</li>
              <li>Your Google Sheet data will auto-import on Dashboard load</li>
              <li>Use AI Assistant for ticket resolution and SOP generation</li>
            </ol>
          </div>

          <Button asChild className="w-full">
            <a href="http://127.0.0.1:8090/_/" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-2" />
              Open PocketBase Admin Dashboard
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};