
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { useOllama } from "@/hooks/useOllama";
import { pb } from "@/integrations/pocketbase/client";
import { SOPGenerator } from "@/components/SOPGenerator";
import { TicketResolver } from "@/components/TicketResolver";
import { PocketBaseSetup } from "@/components/PocketBaseSetup";
import { OllamaSettings } from "@/components/OllamaSettings";
import { LocalSetupGuide } from "@/components/LocalSetupGuide";
import { toast } from "@/components/ui/use-toast";
import { 
  Bot, 
  Send, 
  MessageSquare, 
  TrendingUp, 
  BookOpen, 
  FileText, 
  Video, 
  Headphones, 
  UserCheck, 
  Users, 
  Wrench, 
  Calendar, 
  Eye, 
  Search, 
  Filter, 
  Clock,
  HelpCircle,
  CheckCircle2,
  Settings,
  Loader2,
  Database,
  Download
} from "lucide-react";

const AIAssistant = () => {
  const { generateResponse, isLoading } = useOllama();
  const [message, setMessage] = useState("");
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<Array<{
    type: 'user' | 'assistant';
    message: string;
    timestamp: string;
    relatedLinks?: Array<{ title: string; type: string }>;
  }>>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [loadingTickets, setLoadingTickets] = useState(true);

  const quickQuestions = [
    "How do I perform turbine maintenance?",
    "What are the safety protocols for chemical storage?",
    "Show me quality control procedures",
    "Find incident report templates",
    "What's the emergency shutdown procedure?"
  ];

  const searchStats = [
    { label: "Total Queries", value: "1,245", icon: MessageSquare },
    { label: "Success Rate", value: "94%", icon: TrendingUp },
    { label: "Popular Articles", value: "23", icon: BookOpen },
    { label: "Templates Used", value: "16", icon: FileText }
  ];

  useEffect(() => {
    loadTickets();
    // Initialize with welcome message
    setChatHistory([
      {
        type: "assistant",
        message: "Hello! I'm your AI maintenance assistant powered by Ollama. I can help you with:\n\n• Ticket resolution guidance\n• Safety procedures\n• Equipment troubleshooting\n• Standard Operating Procedures\n\nHow can I assist you today?",
        timestamp: new Date().toLocaleTimeString()
      }
    ]);
  }, []);

  const loadTickets = async () => {
    try {
      const records = await pb.collection('tickets').getFullList({
        filter: 'status = "open" || status = "in_progress"',
        sort: '-created'
      });
      
      setTickets(records || []);
    } catch (error) {
      console.error('Error loading tickets:', error);
    } finally {
      setLoadingTickets(false);
    }
  };

  // XR Remote Assist data
  const xrTickets = [
    {
      id: "INC001234",
      title: "Turbine Vibration Analysis Required",
      site: "Power Generation A",
      priority: "High",
      status: "Open",
      assignedTo: "Field Engineer - Mike Johnson",
      expertise: ["L2 Mechanical", "L3 Vibration Analysis"],
      createdDate: "2024-01-18",
      description: "Unusual vibration patterns detected in Turbine Unit 2"
    },
    {
      id: "INC001235", 
      title: "Chemical Reactor Temperature Anomaly",
      site: "Chemical Processing B",
      priority: "Critical",
      status: "In Progress",
      assignedTo: "Field Engineer - Sarah Chen",
      expertise: ["L2 Process Control", "L3 Chemical Engineering"],
      createdDate: "2024-01-18",
      description: "Temperature spikes in Reactor 3 require immediate expert consultation"
    },
    {
      id: "INC001236",
      title: "Conveyor Belt Alignment Issue",
      site: "Manufacturing Plant C", 
      priority: "Medium",
      status: "Open",
      assignedTo: "Field Engineer - David Wilson",
      expertise: ["L2 Mechanical", "L2 Maintenance"],
      createdDate: "2024-01-17",
      description: "Belt misalignment causing production inefficiencies"
    }
  ];

  const getPriorityBadge = (priority: string) => {
    switch(priority) {
      case "Critical": return <Badge className="bg-destructive text-destructive-foreground">Critical</Badge>;
      case "High": return <Badge className="bg-warning text-warning-foreground">High</Badge>;
      case "Medium": return <Badge variant="secondary">Medium</Badge>;
      default: return <Badge variant="outline">Low</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case "Open": return <Badge variant="outline">Open</Badge>;
      case "In Progress": return <Badge className="bg-primary text-primary-foreground">In Progress</Badge>;
      case "Resolved": return <Badge className="bg-success text-success-foreground">Resolved</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || isLoading) return;

    const userMessage = message.trim();
    const timestamp = new Date().toLocaleTimeString();
    
    // Add user message to chat
    setChatHistory(prev => [...prev, {
      type: 'user',
      message: userMessage,
      timestamp
    }]);

    setMessage(''); // Clear input immediately

    try {
      const response = await generateResponse([
        { role: 'system', content: 'You are an expert maintenance and safety assistant. Provide detailed, actionable advice for industrial maintenance, safety procedures, and equipment troubleshooting. Always prioritize safety and include relevant warnings or precautions.' },
        { role: 'user', content: userMessage }
      ]);

      // Add assistant response to chat
      setChatHistory(prev => [...prev, {
        type: 'assistant',
        message: response,
        timestamp: new Date().toLocaleTimeString()
      }]);
    } catch (error) {
      setChatHistory(prev => [...prev, {
        type: 'assistant',
        message: 'Sorry, I encountered an error. Please make sure Ollama is running locally on port 11434 with the llama3 model.',
        timestamp: new Date().toLocaleTimeString()
      }]);
      
      toast({
        title: "Connection Error",
        description: "Failed to connect to Ollama. Make sure it's running locally.",
        variant: "destructive"
      });
    }
  };

  const handleQuickQuestion = async (question: string) => {
    setMessage(question);
    // Trigger the message send after setting the message
    setTimeout(() => handleSendMessage(), 100);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">AI & XR Assistant</h1>
          <p className="text-muted-foreground">Get instant answers and collaborative remote assistance</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Bot className="h-4 w-4 mr-2" />
            Voice Input
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Ollama: llama3
          </Button>
        </div>
      </div>

      <Tabs defaultValue="setup" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="setup">
            <Database className="h-4 w-4 mr-2" />
            Setup
          </TabsTrigger>
          <TabsTrigger value="ai-chat">AI Chat</TabsTrigger>
          <TabsTrigger value="ticket-resolver">Ticket Resolver</TabsTrigger>
          <TabsTrigger value="sop-generator">SOP Generator</TabsTrigger>
          <TabsTrigger value="ollama-settings">
            <Bot className="h-4 w-4 mr-2" />
            Ollama Settings
          </TabsTrigger>
          <TabsTrigger value="local-setup">
            <Download className="h-4 w-4 mr-2" />
            Local Setup
          </TabsTrigger>
        </TabsList>

        <TabsContent value="setup" className="space-y-6">
          <PocketBaseSetup />
        </TabsContent>

        <TabsContent value="ai-chat" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Quick Questions & Stats */}
            <div className="space-y-6">
              {/* Quick Questions */}
              <Dialog>
                <DialogTrigger asChild>
                  <Card className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg">Quick Questions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {quickQuestions.slice(0, 3).map((question, index) => (
                        <Button
                          key={index}
                          variant="ghost"
                          className="w-full text-left justify-start h-auto p-3 text-sm"
                          onClick={() => handleQuickQuestion(question)}
                        >
                          <HelpCircle className="h-4 w-4 mr-2 shrink-0" />
                          {question}
                        </Button>
                      ))}
                      <p className="text-sm text-muted-foreground text-center">Click to view all questions</p>
                    </CardContent>
                  </Card>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>All Quick Questions</DialogTitle>
                  </DialogHeader>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                    {quickQuestions.map((question, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        className="w-full text-left justify-start h-auto p-3 text-sm"
                        onClick={() => handleQuickQuestion(question)}
                      >
                        <HelpCircle className="h-4 w-4 mr-2 shrink-0" />
                        {question}
                      </Button>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>

              {/* Search Statistics */}
              <Dialog>
                <DialogTrigger asChild>
                  <Card className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg">AI Statistics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {searchStats.map((stat, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <div className="p-2 bg-muted rounded-lg">
                            <stat.icon className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">{stat.label}</p>
                            <p className="font-bold">{stat.value}</p>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Detailed AI Statistics</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 border rounded-lg">
                        <h3 className="font-semibold">Query Performance</h3>
                        <p className="text-sm text-muted-foreground">Average response time: 1.2s</p>
                        <p className="text-sm text-muted-foreground">Accuracy rate: 96.5%</p>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <h3 className="font-semibold">Popular Topics</h3>
                        <p className="text-sm text-muted-foreground">Safety Procedures: 45%</p>
                        <p className="text-sm text-muted-foreground">Maintenance: 32%</p>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Right Column - Chat Interface */}
            <div className="lg:col-span-2">
              <Card className="h-[600px] flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bot className="h-5 w-5" />
                    AI Chat Console
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="flex-1 flex flex-col">
                  {/* Chat Messages */}
                  <div className="flex-1 space-y-4 overflow-y-auto mb-4">
                    {chatHistory.map((chat, index) => (
                      <div key={index} className={`flex ${chat.type === "user" ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[80%] rounded-lg p-3 ${
                          chat.type === "user" 
                            ? "bg-primary text-primary-foreground" 
                            : "bg-muted"
                        }`}>
                          <div className="text-sm whitespace-pre-line">
                            {chat.message}
                          </div>
                          {chat.relatedLinks && (
                            <div className="mt-3 space-y-1">
                              <p className="text-xs font-medium opacity-80">Related Resources:</p>
                              {chat.relatedLinks.map((link, linkIndex) => (
                                <Badge key={linkIndex} variant="secondary" className="mr-2 mb-1">
                                  {link.type === "article" ? <BookOpen className="h-3 w-3 mr-1" /> : <FileText className="h-3 w-3 mr-1" />}
                                  {link.title}
                                </Badge>
                              ))}
                            </div>
                          )}
                          <div className="text-xs opacity-60 mt-2">
                            {chat.timestamp}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Message Input */}
                  <div className="flex gap-2">
                    <Input
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Ask me anything about procedures, safety, or equipment..."
                      className="flex-1"
                      onKeyPress={async (e) => {
                        if (e.key === "Enter") {
                          await handleSendMessage();
                        }
                      }}
                    />
                    <Button 
                      onClick={handleSendMessage}
                      disabled={isLoading || !message.trim()}
                      className="bg-primary hover:bg-primary-hover"
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="ticket-resolver" className="space-y-6">
          <TicketResolver 
            tickets={tickets} 
            onTicketUpdate={(ticketId, resolution) => {
              // Update ticket in database or handle as needed
              console.log('Ticket updated:', ticketId, resolution);
            }}
          />
        </TabsContent>

        <TabsContent value="sop-generator" className="space-y-6">
          <SOPGenerator />
        </TabsContent>

        <TabsContent value="ollama-settings" className="space-y-6">
          <OllamaSettings />
        </TabsContent>

        <TabsContent value="local-setup" className="space-y-6">
          <LocalSetupGuide />
        </TabsContent>

        <TabsContent value="xr-assist" className="space-y-6">
          {/* XR Remote Assist Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground">XR Remote Assist</h2>
              <p className="text-muted-foreground">Collaborative remote assistance with field engineers and SMEs</p>
            </div>
            <Button className="bg-primary hover:bg-primary-hover">
              <Video className="h-4 w-4 mr-2" />
              Start New XR Session
            </Button>
          </div>

          {/* Search and Filter */}
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                placeholder="Search ServiceNow tickets..." 
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter by Priority
            </Button>
          </div>

          {/* Active XR Sessions */}
          <Dialog>
            <DialogTrigger asChild>
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Video className="h-5 w-5 text-primary" />
                    Active XR Sessions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg bg-success/10">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-success rounded-full animate-pulse"></div>
                        <div>
                          <p className="font-medium">Chemical Reactor Analysis - INC001235</p>
                          <p className="text-sm text-muted-foreground">Field Engineer: Sarah Chen | SME: Dr. Michael Rodriguez (L3)</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Badge className="bg-success text-success-foreground">Live</Badge>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-2" />
                          Join Session
                        </Button>
                      </div>
                    </div>
                    
                    <div className="text-center py-8 text-muted-foreground">
                      <Headphones className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No other active sessions at the moment</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Active XR Sessions - Detailed View</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg bg-success/10">
                  <h3 className="font-semibold">Session Details</h3>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <p className="text-sm font-medium">Session ID:</p>
                      <p className="text-sm text-muted-foreground">XR-2024-001235</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Duration:</p>
                      <p className="text-sm text-muted-foreground">45 minutes</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Participants:</p>
                      <p className="text-sm text-muted-foreground">3 (Field Engineer + 2 SMEs)</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Equipment:</p>
                      <p className="text-sm text-muted-foreground">HoloLens 2, Mobile AR</p>
                    </div>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* ServiceNow Tickets */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-5 w-5 text-primary" />
                ServiceNow Tickets Requiring XR Assistance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {xrTickets.map((ticket) => (
                  <Dialog key={ticket.id}>
                    <DialogTrigger asChild>
                      <div className="border rounded-lg p-4 space-y-3 cursor-pointer hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-3">
                              <h3 className="font-semibold">{ticket.title}</h3>
                              {getPriorityBadge(ticket.priority)}
                              {getStatusBadge(ticket.status)}
                            </div>
                            <p className="text-sm text-muted-foreground">{ticket.description}</p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>Ticket: {ticket.id}</span>
                              <span>Site: {ticket.site}</span>
                              <span>Created: {ticket.createdDate}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <UserCheck className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">Assigned Field Engineer:</span>
                            <span className="text-sm">{ticket.assignedTo}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">Required Expertise:</span>
                            <div className="flex gap-1">
                              {ticket.expertise.map((exp, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  {exp}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl">
                      <DialogHeader>
                        <DialogTitle>{ticket.title}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <h3 className="font-semibold">Ticket Information</h3>
                            <div className="space-y-1">
                              <p className="text-sm"><strong>ID:</strong> {ticket.id}</p>
                              <p className="text-sm"><strong>Site:</strong> {ticket.site}</p>
                              <p className="text-sm"><strong>Created:</strong> {ticket.createdDate}</p>
                              <p className="text-sm"><strong>Status:</strong> {getStatusBadge(ticket.status)}</p>
                              <p className="text-sm"><strong>Priority:</strong> {getPriorityBadge(ticket.priority)}</p>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <h3 className="font-semibold">Assignment Details</h3>
                            <div className="space-y-1">
                              <p className="text-sm"><strong>Field Engineer:</strong> {ticket.assignedTo}</p>
                              <p className="text-sm"><strong>Required Expertise:</strong></p>
                              <div className="flex gap-1 flex-wrap">
                                {ticket.expertise.map((exp, idx) => (
                                  <Badge key={idx} variant="secondary" className="text-xs">
                                    {exp}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h3 className="font-semibold mb-2">Description</h3>
                          <p className="text-sm text-muted-foreground">{ticket.description}</p>
                        </div>
                        <div className="flex gap-2 pt-4 border-t">
                          <Button className="bg-primary hover:bg-primary-hover">
                            <Video className="h-4 w-4 mr-2" />
                            Initiate XR Session
                          </Button>
                          <Button variant="outline">
                            <BookOpen className="h-4 w-4 mr-2" />
                            View Knowledge Base
                          </Button>
                          <Button variant="outline">
                            <Calendar className="h-4 w-4 mr-2" />
                            Schedule Session
                          </Button>
                          <Button variant="ghost">
                            <Eye className="h-4 w-4 mr-2" />
                            View Full Ticket
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* XR Session Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Dialog>
              <DialogTrigger asChild>
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total XR Sessions</CardTitle>
                    <Video className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">127</div>
                    <p className="text-xs text-muted-foreground">This month</p>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>XR Sessions Analytics</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-semibold">Session Types</h3>
                      <p className="text-sm text-muted-foreground">Maintenance: 68</p>
                      <p className="text-sm text-muted-foreground">Training: 35</p>
                      <p className="text-sm text-muted-foreground">Troubleshooting: 24</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-semibold">Success Rate</h3>
                      <p className="text-sm text-muted-foreground">Issues Resolved: 92%</p>
                      <p className="text-sm text-muted-foreground">First-Time Fix: 78%</p>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Average Resolution Time</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">42min</div>
                    <p className="text-xs text-success">-15min from last month</p>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Resolution Time Analysis</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold">Time Breakdown</h3>
                    <p className="text-sm text-muted-foreground">Session Setup: 8min</p>
                    <p className="text-sm text-muted-foreground">Problem Analysis: 18min</p>
                    <p className="text-sm text-muted-foreground">Resolution: 16min</p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">SME Availability</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">87%</div>
                    <p className="text-xs text-muted-foreground">12 experts online</p>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>SME Availability Details</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold">Available SMEs by Expertise</h3>
                    <p className="text-sm text-muted-foreground">L3 Mechanical: 4 experts</p>
                    <p className="text-sm text-muted-foreground">L3 Electrical: 3 experts</p>
                    <p className="text-sm text-muted-foreground">L3 Process Control: 3 experts</p>
                    <p className="text-sm text-muted-foreground">L2 General: 2 experts</p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </TabsContent>
      </Tabs>

      {/* Quick Question Answer Modal */}
      <Dialog open={!!selectedQuestion} onOpenChange={() => setSelectedQuestion(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              {selectedQuestion}
            </DialogTitle>
            <DialogDescription>
              AI-powered detailed response with step-by-step guidance
            </DialogDescription>
          </DialogHeader>
          {selectedQuestion && (
            <div className="space-y-6">
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Bot className="h-5 w-5 text-primary" />
                  <span className="font-medium">AI Assistant Response</span>
                </div>
                <div className="prose max-w-none text-sm">
                  {selectedQuestion === "How do I perform turbine maintenance?" && (
                    <div className="space-y-4">
                      <p><strong>Turbine Maintenance Procedure (Based on SOP v2.1)</strong></p>
                      
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-semibold text-primary">1. Pre-Maintenance Safety Check</h4>
                          <ul className="list-disc pl-5 space-y-1">
                            <li>Verify complete shutdown and lockout/tagout procedures</li>
                            <li>Check PPE requirements: hard hat, safety glasses, steel-toed boots</li>
                            <li>Ensure proper ventilation and gas detection systems are active</li>
                            <li>Confirm emergency stop systems are functional</li>
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-primary">2. Visual Inspection</h4>
                          <ul className="list-disc pl-5 space-y-1">
                            <li>Inspect turbine blades for cracks, erosion, or foreign object damage</li>
                            <li>Check bearing housing for oil leaks or unusual wear</li>
                            <li>Examine coupling alignment and condition</li>
                            <li>Verify instrumentation and control panel functionality</li>
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-primary">3. Maintenance Tasks</h4>
                          <ul className="list-disc pl-5 space-y-1">
                            <li>Change oil filters and perform oil analysis</li>
                            <li>Check vibration levels and trending data</li>
                            <li>Inspect and torque all bolted connections</li>
                            <li>Verify governor and protection system settings</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {selectedQuestion === "What are the safety protocols for chemical storage?" && (
                    <div className="space-y-4">
                      <p><strong>Chemical Storage Safety Guidelines (Based on v1.8)</strong></p>
                      
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-semibold text-primary">1. Personal Protective Equipment</h4>
                          <ul className="list-disc pl-5 space-y-1">
                            <li>Full-face respirator with appropriate chemical cartridges</li>
                            <li>Chemical-resistant gloves (material specific to stored chemicals)</li>
                            <li>Chemical-resistant apron or full-body suit</li>
                            <li>Safety boots with non-slip, chemical-resistant soles</li>
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-primary">2. Environmental Controls</h4>
                          <ul className="list-disc pl-5 space-y-1">
                            <li>Ensure adequate ventilation (minimum 6 air changes per hour)</li>
                            <li>Verify gas detection systems are calibrated and functional</li>
                            <li>Check emergency shower/eyewash stations (weekly testing required)</li>
                            <li>Maintain temperature controls within specified ranges</li>
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-primary">3. Emergency Procedures</h4>
                          <ul className="list-disc pl-5 space-y-1">
                            <li>Know location of emergency shutdown procedures</li>
                            <li>Understand chemical-specific spill response procedures</li>
                            <li>Have emergency contact numbers readily available</li>
                            <li>Ensure fire suppression systems are appropriate for stored chemicals</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {selectedQuestion === "Show me quality control procedures" && (
                    <div className="space-y-4">
                      <p><strong>Quality Control Testing Protocols (Based on SOP v3.0)</strong></p>
                      
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-semibold text-primary">1. Incoming Material Inspection</h4>
                          <ul className="list-disc pl-5 space-y-1">
                            <li>Verify material specifications against purchase order</li>
                            <li>Conduct visual inspection for defects or damage</li>
                            <li>Perform dimensional checks using calibrated instruments</li>
                            <li>Document all findings in QC log sheets</li>
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-primary">2. In-Process Testing</h4>
                          <ul className="list-disc pl-5 space-y-1">
                            <li>Monitor critical process parameters continuously</li>
                            <li>Perform statistical process control (SPC) analysis</li>
                            <li>Conduct first article inspections for new batches</li>
                            <li>Verify measurement system accuracy (MSA studies)</li>
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-primary">3. Final Product Verification</h4>
                          <ul className="list-disc pl-5 space-y-1">
                            <li>Complete final inspection checklist per customer requirements</li>
                            <li>Perform functional testing where applicable</li>
                            <li>Generate certificate of compliance (COC)</li>
                            <li>Package with appropriate quality documentation</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {(selectedQuestion === "Find incident report templates" || selectedQuestion === "What's the emergency shutdown procedure?") && (
                    <div className="space-y-4">
                      <p><strong>Detailed guidance and templates for {selectedQuestion.toLowerCase()}</strong></p>
                      <p>This would contain comprehensive step-by-step instructions, checklists, and relevant templates.</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold">Related Resources</h4>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <BookOpen className="h-4 w-4 mr-2" />
                      View Full SOP Document
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <FileText className="h-4 w-4 mr-2" />
                      Download Checklist Template
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Video className="h-4 w-4 mr-2" />
                      Watch Training Video
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Quick Actions</h4>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Mark as Helpful
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Ask Follow-up Question
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Users className="h-4 w-4 mr-2" />
                      Contact SME
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AIAssistant;
