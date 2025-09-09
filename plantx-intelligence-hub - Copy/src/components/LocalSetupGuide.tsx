import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Download, Terminal, Database, Bot, Code, Globe } from 'lucide-react';

export const LocalSetupGuide = () => {
  const requirements = [
    {
      name: "Node.js",
      version: "18+ or 20+",
      description: "JavaScript runtime for running the development server",
      downloadUrl: "https://nodejs.org/",
      icon: Code
    },
    {
      name: "Git",
      version: "Latest",
      description: "Version control system to clone the repository",
      downloadUrl: "https://git-scm.com/",
      icon: Terminal
    },
    {
      name: "PocketBase",
      version: "Latest",
      description: "Local database server",
      downloadUrl: "https://pocketbase.io/docs/",
      icon: Database
    },
    {
      name: "Ollama",
      version: "Latest",
      description: "Local AI model server for llama3",
      downloadUrl: "https://ollama.ai/",
      icon: Bot
    }
  ];

  const setupSteps = [
    {
      step: 1,
      title: "Install Prerequisites",
      description: "Install Node.js, Git, PocketBase, and Ollama on your system",
      commands: []
    },
    {
      step: 2,
      title: "Clone Repository",
      description: "Download the project source code",
      commands: [
        "# Clone the repository (ask for the actual repo URL)",
        "git clone <REPOSITORY_URL>",
        "cd <PROJECT_NAME>"
      ]
    },
    {
      step: 3,
      title: "Install Dependencies",
      description: "Install all required npm packages",
      commands: [
        "npm install",
        "# or if you prefer yarn:",
        "yarn install"
      ]
    },
    {
      step: 4,
      title: "Setup PocketBase",
      description: "Start PocketBase server on port 8090",
      commands: [
        "# Download PocketBase binary",
        "# Create a folder for PocketBase",
        "mkdir pocketbase-data",
        "cd pocketbase-data",
        "# Run PocketBase (replace with actual binary path)",
        "./pocketbase serve --http=127.0.0.1:8090"
      ]
    },
    {
      step: 5,
      title: "Setup Ollama",
      description: "Install and start Ollama with llama3 model",
      commands: [
        "# Start Ollama service",
        "ollama serve",
        "",
        "# In another terminal, pull llama3 model",
        "ollama pull llama3"
      ]
    },
    {
      step: 6,
      title: "Configure Database",
      description: "Set up PocketBase collections and admin account",
      commands: [
        "# Open PocketBase admin at:",
        "# http://127.0.0.1:8090/_/",
        "# Create admin account with:",
        "# Email: arvind.s.chauhan@gmail.com",
        "# Password: Initial$1234567"
      ]
    },
    {
      step: 7,
      title: "Start Development Server",
      description: "Run the React application",
      commands: [
        "npm run dev",
        "# or with yarn:",
        "yarn dev",
        "",
        "# Open http://localhost:8080 in your browser"
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Local Development Setup Guide
          </CardTitle>
          <CardDescription>
            Complete instructions to run this project on your laptop
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <Globe className="h-4 w-4" />
            <AlertDescription>
              <strong>Current Configuration:</strong> This project is set up to run completely locally with PocketBase database, 
              Ollama AI, and Google Sheets integration. No cloud services required!
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>System Requirements</CardTitle>
          <CardDescription>
            Software you need to install on your laptop
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {requirements.map((req, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <req.icon className="h-5 w-5 text-primary" />
                  <div>
                    <h4 className="font-semibold">{req.name}</h4>
                    <Badge variant="outline">{req.version}</Badge>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{req.description}</p>
                <Button asChild size="sm" variant="outline" className="w-full">
                  <a href={req.downloadUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Download {req.name}
                  </a>
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Step-by-Step Setup</CardTitle>
          <CardDescription>
            Follow these steps in order to get everything running
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {setupSteps.map((step, index) => (
              <div key={index} className="border-l-2 border-primary pl-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Badge className="bg-primary text-primary-foreground">
                    Step {step.step}
                  </Badge>
                  <h4 className="font-semibold">{step.title}</h4>
                </div>
                <p className="text-sm text-muted-foreground">{step.description}</p>
                {step.commands.length > 0 && (
                  <div className="bg-muted p-3 rounded-lg">
                    <pre className="text-sm">
                      {step.commands.join('\n')}
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Verification Checklist</CardTitle>
          <CardDescription>
            Ensure everything is working correctly
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <input type="checkbox" id="node" />
              <label htmlFor="node" className="text-sm">
                Node.js installed (check with: <code>node --version</code>)
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="pocketbase" />
              <label htmlFor="pocketbase" className="text-sm">
                PocketBase running on http://127.0.0.1:8090
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="ollama" />
              <label htmlFor="ollama" className="text-sm">
                Ollama running with llama3 model (check with: <code>ollama list</code>)
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="app" />
              <label htmlFor="app" className="text-sm">
                App running on http://localhost:8080
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="data" />
              <label htmlFor="data" className="text-sm">
                Google Sheets data importing successfully
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Project Structure</CardTitle>
          <CardDescription>
            Understanding the codebase after download
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted p-4 rounded-lg">
            <pre className="text-sm">
{`project-root/
├── src/
│   ├── components/          # React components
│   ├── hooks/              # Custom React hooks
│   ├── integrations/       # PocketBase client
│   ├── pages/              # Application pages
│   └── lib/                # Utility functions
├── public/                 # Static assets
├── package.json           # Node.js dependencies
├── vite.config.ts        # Vite configuration
└── tailwind.config.ts    # Tailwind CSS config`}
            </pre>
          </div>
        </CardContent>
      </Card>

      <Alert>
        <Terminal className="h-4 w-4" />
        <AlertDescription>
          <strong>Need Help?</strong> If you encounter issues during setup, check the console logs in your browser developer tools 
          and ensure all services are running on the correct ports.
        </AlertDescription>
      </Alert>
    </div>
  );
};