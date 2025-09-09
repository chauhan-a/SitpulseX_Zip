# Local Development Setup Guide

## Overview
This project is configured to run completely locally using:
- **PocketBase** for database (http://127.0.0.1:8090)
- **Ollama** for AI assistance (http://localhost:11434)
- **Google Sheets** for data import
- **React + Vite** for the frontend

## Prerequisites

Download and install the following on your laptop:

### 1. Node.js (Required)
- Download: https://nodejs.org/
- Version: 18+ or 20+
- Verify installation: `node --version`

### 2. Git (Required)
- Download: https://git-scm.com/
- For cloning the repository

### 3. PocketBase (Required)
- Download: https://pocketbase.io/docs/
- Lightweight database server
- Extract the binary to a folder

### 4. Ollama (Required)
- Download: https://ollama.ai/
- Local AI model server
- Install and start the service

## Setup Instructions

### Step 1: Clone Repository
```bash
# Get the repository URL from your development environment
git clone <REPOSITORY_URL>
cd <PROJECT_NAME>
```

### Step 2: Install Dependencies
```bash
npm install
# or if you prefer yarn:
yarn install
```

### Step 3: Setup PocketBase
1. Create a folder for PocketBase data:
```bash
mkdir pocketbase-data
cd pocketbase-data
```

2. Run PocketBase:
```bash
# Windows
./pocketbase.exe serve --http=127.0.0.1:8090

# macOS/Linux
./pocketbase serve --http=127.0.0.1:8090
```

3. Open http://127.0.0.1:8090/_ in your browser
4. Create admin account:
   - Email: `arvind.s.chauhan@gmail.com`
   - Password: `Initial$1234567`

### Step 4: Setup Ollama
1. Start Ollama service:
```bash
ollama serve
```

2. In another terminal, pull the llama3 model:
```bash
ollama pull llama3
```

3. Verify installation:
```bash
ollama list
```

### Step 5: Start Development Server
```bash
npm run dev
# or with yarn:
yarn dev
```

Open http://localhost:8080 in your browser.

## Database Collections

The following collections will be created automatically:
- `tickets` - Maintenance tickets from Google Sheets
- `sites` - Site information
- `sops` - Standard Operating Procedures
- `knowledge_articles` - Knowledge base articles
- `ai_providers` - AI configuration
- `integrations` - External integrations

## Configuration

### Google Sheets Integration
Your Google Sheet is already configured:
- URL: `https://docs.google.com/spreadsheets/d/e/2PACX-1vQ9Q2MzE4usWbIf6IzxKLssnsHFuDp769gjel_8Z5QPRM45dm7IL85xBFdHG9EH2zASpnKSv1yLxH94/pubhtml?gid=0&single=true`
- The "State" column maps to ticket status
- Data auto-imports on dashboard load

### Ollama Settings
- Default URL: `http://localhost:11434`
- Default Model: `llama3`
- Configure in AI Assistant > Ollama Settings tab

## Verification Checklist

- [ ] Node.js installed (`node --version`)
- [ ] PocketBase running on http://127.0.0.1:8090
- [ ] Ollama running with llama3 model (`ollama list`)
- [ ] App running on http://localhost:8080
- [ ] Google Sheets data importing successfully
- [ ] AI chat working in AI Assistant tab

## Project Structure

```
project-root/
├── src/
│   ├── components/          # React components
│   │   ├── dashboard/       # Dashboard components
│   │   ├── layout/          # Layout components
│   │   └── ui/              # UI components (shadcn)
│   ├── hooks/               # Custom React hooks
│   ├── integrations/        # PocketBase client
│   ├── pages/               # Application pages
│   ├── lib/                 # Utility functions
│   └── utils/               # Helper utilities
├── public/                  # Static assets
├── package.json             # Node.js dependencies
├── vite.config.ts          # Vite configuration
└── tailwind.config.ts      # Tailwind CSS config
```

## Features

### 🤖 AI Assistant
- Local Ollama integration
- Ticket resolution guidance
- SOP generation
- Model selection and configuration

### 📊 Dashboard
- Real-time ticket metrics
- Google Sheets integration
- Site status overview
- Performance analytics

### 📝 SOP Generator
- AI-powered SOP creation
- Industry standards compliance
- Local database storage
- Step-by-step procedures

### 🎫 Ticket Management
- Google Sheets data import
- Status tracking from "State" column
- Priority management
- Assignment tracking

## Troubleshooting

### Common Issues

1. **PocketBase not starting**
   - Check if port 8090 is available
   - Run with `--http=0.0.0.0:8090` if needed

2. **Ollama connection failed**
   - Ensure Ollama service is running: `ollama serve`
   - Check if llama3 model is installed: `ollama list`
   - Try pulling the model again: `ollama pull llama3`

3. **Google Sheets not importing**
   - Check if the sheet URL is publicly accessible
   - Verify the "State" column exists in your sheet
   - Check browser console for errors

4. **Build errors**
   - Delete `node_modules` and run `npm install` again
   - Check Node.js version compatibility

### Getting Help

1. Check browser developer console for errors
2. Verify all services are running on correct ports
3. Review the logs in terminal where services are running
4. Ensure all prerequisites are properly installed

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run type-check

# Linting
npm run lint
```

## Production Deployment

When ready to deploy:
1. Build the project: `npm run build`
2. Set up PocketBase on your server
3. Configure Ollama on your server
4. Deploy the built files to your web server

## Support

For issues or questions:
1. Check this README first
2. Review console logs and error messages
3. Verify all services are running correctly
4. Check the setup guide in the AI Assistant > Local Setup tab