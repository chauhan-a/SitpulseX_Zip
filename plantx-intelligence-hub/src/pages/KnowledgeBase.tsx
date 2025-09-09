import React, { useEffect, useState } from "react";
import PocketBase from "pocketbase";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Input,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui";
import { BookOpen, Clock, Eye, Download, Sparkles, Send, RotateCcw } from "lucide-react";

const pb = new PocketBase("http://127.0.0.1:8090");

const KnowledgeBase = () => {
  const navigate = useNavigate();

  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);

  const [showAddDoc, setShowAddDoc] = useState(false);
  const [newDoc, setNewDoc] = useState({
    title: "",
    content: "",
    source_url: "",
    tags: "",
    file: null,
  });
  const [saving, setSaving] = useState(false);
  const [generatingAI, setGeneratingAI] = useState(false);
  
  // State for AI prompt dialog
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiChatHistory, setAiChatHistory] = useState([]);
  const [ollamaStatus, setOllamaStatus] = useState("checking");

  useEffect(() => {
    fetchDocuments();
    checkOllamaStatus();
  }, []);

  const checkOllamaStatus = async () => {
    try {
      const response = await fetch('http://localhost:11434/api/tags', {
        method: 'GET'
      });
      if (response.ok) {
        setOllamaStatus("connected");
      } else {
        setOllamaStatus("disconnected");
      }
    } catch (error) {
      setOllamaStatus("disconnected");
      console.error("Ollama is not available:", error);
    }
  };

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const data = await pb.collection("documents").getFullList({
        sort: "-updated",
      });
      setDocuments(data);
    } catch (error) {
      console.error("Error fetching documents:", error);
    } finally {
      setLoading(false);
    }
  };

  const onNewDocChange = (field, value) => {
    setNewDoc((prev) => ({ ...prev, [field]: value }));
  };

  // Generate AI Content using Ollama with custom prompt
  const generateAIContent = async (prompt) => {
    if (!prompt) {
      alert("Please enter a prompt");
      return;
    }
    
    // Add user message to chat history
    const userMessage = { role: "user", content: prompt };
    setAiChatHistory(prev => [...prev, userMessage]);
    
    setGeneratingAI(true);
    try {
      // Call the Ollama API
      const response = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "llama3", // Change to your preferred model
          prompt: prompt,
          stream: false,
        }),
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.response) {
        // Add AI response to chat history
        const aiMessage = { role: "assistant", content: result.response };
        setAiChatHistory(prev => [...prev, aiMessage]);
        
        // Update the document content with the latest response
        setNewDoc(prev => ({
          ...prev,
          content: prev.content + "\n\n" + result.response
        }));
        
        // Clear the prompt input but keep the dialog open
        setAiPrompt("");
      } else {
        throw new Error("No response from Ollama");
      }
    } catch (err) {
      console.error("AI generation error:", err);
      
      // Add error message to chat history
      const errorMessage = { 
        role: "assistant", 
        content: "Error: Failed to generate content. Please check if Ollama is running and the model is available." 
      };
      setAiChatHistory(prev => [...prev, errorMessage]);
      
      alert("Failed to generate content via AI. Please check if Ollama is running.");
    } finally {
      setGeneratingAI(false);
    }
  };

  const handleAISubmit = (e) => {
    e.preventDefault();
    generateAIContent(aiPrompt);
  };

  const resetAIChat = () => {
    setAiChatHistory([]);
    setAiPrompt("");
  };

  const saveNewDocument = async () => {
    if (!newDoc.title) {
      alert("Title is required");
      return;
    }

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("title", newDoc.title);
      formData.append("content", newDoc.content);
      formData.append("source_url", newDoc.source_url);
      formData.append("tags", newDoc.tags);

      if (newDoc.file) {
        formData.append("file", newDoc.file);
      }

      await pb.collection("documents").create(formData);
      alert("Document saved successfully");

      setShowAddDoc(false);
      setShowAIGenerator(false);
      setNewDoc({
        title: "",
        content: "",
        source_url: "",
        tags: "",
        file: null,
      });
      setAiChatHistory([]);
      fetchDocuments();
    } catch (error) {
      console.error("Failed to save document:", error);
      alert("Failed to save document");
    } finally {
      setSaving(false);
    }
  };

  const handleViewArticle = async (doc) => {
    try {
      const updatedDoc = await pb
        .collection("documents")
        .update(doc.id, { views: (doc.views || 0) + 1 });
      fetchDocuments();
      setSelectedDoc(updatedDoc);
    } catch (error) {
      console.error("Failed to update views:", error);
      alert("Failed to update views");
      setSelectedDoc(doc);
    }
  };

  return (
    <div className="p-6">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Knowledge Base</h1>
        <Button onClick={() => setShowAddDoc(true)}>
          <BookOpen className="mr-2" />
          Add Document
        </Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <p>Loading documents...</p>
        ) : documents.length === 0 ? (
          <p>No documents found.</p>
        ) : (
          documents.map((doc) => (
            <Card key={doc.id} className="hover:shadow-lg">
              <CardHeader>
                <CardTitle>{doc.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{doc.content?.substring(0, 120)}...</p>

                <div className="mt-2 flex justify-between items-center text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Clock className="h-3 w-3" />
                    <span>{new Date(doc.updated).toLocaleDateString()}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Eye className="h-3 w-3" />
                    <span>{doc.views || 0} views</span>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleViewArticle(doc)}
                  >
                    View Article
                  </Button>

                  {doc.file && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const fileUrl = pb.getFileUrl(doc, doc.file);
                        window.open(fileUrl, "_blank");
                      }}
                    >
                      <Download className="mr-1" size={14} />
                      Download
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* View Document Dialog */}
      <Dialog open={!!selectedDoc} onOpenChange={() => setSelectedDoc(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedDoc?.title}</DialogTitle>
            <DialogDescription>
              Source: {selectedDoc?.source_url || "N/A"}
              <br />
              Tags: {selectedDoc?.tags || "N/A"}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 max-h-[60vh] overflow-auto whitespace-pre-wrap">
            {selectedDoc?.content || "No content available"}
          </div>
          {selectedDoc?.file && (
            <a
              href={pb.getFileUrl(selectedDoc, selectedDoc.file)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline mt-4 block"
            >
              Download Attachment
            </a>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Document Dialog */}
      <Dialog open={showAddDoc} onOpenChange={setShowAddDoc}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Document</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <Input
              placeholder="Title"
              value={newDoc.title}
              onChange={(e) => onNewDocChange("title", e.target.value)}
            />

            <textarea
              placeholder="Content"
              rows={6}
              value={newDoc.content}
              onChange={(e) => onNewDocChange("content", e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2"
            />

            <Input
              placeholder="Source URL"
              value={newDoc.source_url}
              onChange={(e) => onNewDocChange("source_url", e.target.value)}
            />

            <Input
              placeholder="Tags (comma separated)"
              value={newDoc.tags}
              onChange={(e) => onNewDocChange("tags", e.target.value)}
            />

            <div className="flex items-center gap-4">
              <Input
                type="file"
                onChange={(e) =>
                  onNewDocChange("file", e.target.files?.[0] || null)
                }
              />
              <Button onClick={() => setShowAIGenerator(true)}>
                <Sparkles className="mr-2" size={16} />
                Generate AI Content
              </Button>
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <Button variant="outline" onClick={() => setShowAddDoc(false)}>
                Cancel
              </Button>
              <Button onClick={saveNewDocument} disabled={saving}>
                {saving ? "Saving..." : "Save Document"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* AI Generator Dialog - Now with actual Ollama integration */}
      <Dialog open={showAIGenerator} onOpenChange={setShowAIGenerator}>
        <DialogContent className="max-w-5xl h-[85vh] flex p-0" style={{zIndex: 100}}>
          <div className="flex flex-col w-full h-full">
            <DialogHeader className="bg-primary text-primary-foreground p-4 flex flex-row items-center justify-between">
              <div>
                <DialogTitle className="text-primary-foreground flex items-center gap-2">
                  <Sparkles className="inline" size={24} />
                  AI Content Generator
                </DialogTitle>
                <DialogDescription className="text-primary-foreground/80">
                  Create and enhance content with AI assistance using Ollama
                </DialogDescription>
              </div>
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={resetAIChat}
                className="text-primary-foreground/80 hover:text-primary-foreground"
              >
                <RotateCcw size={16} className="mr-1" />
                Reset Chat
              </Button>
            </DialogHeader>
            
            <div className="flex flex-1 overflow-hidden">
              {/* Left side - Editor and AI Chat */}
              <div className="w-1/2 p-4 border-r overflow-auto flex flex-col">
                <div className="mb-4">
                  <h3 className="font-medium text-lg mb-2">Document Editor</h3>
                  <Input
                    placeholder="Document Title"
                    value={newDoc.title}
                    onChange={(e) => onNewDocChange("title", e.target.value)}
                    className="mb-3"
                  />
                  <textarea
                    rows={8}
                    value={newDoc.content}
                    onChange={(e) => onNewDocChange("content", e.target.value)}
                    placeholder="Document content will appear here as you generate it with AI..."
                    className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div className="mt-auto">
                  <h3 className="font-medium text-lg mb-2">Chat with AI</h3>
                  <div className="bg-muted p-3 rounded-md mb-3 max-h-40 overflow-y-auto">
                    {aiChatHistory.length === 0 ? (
                      <p className="text-sm text-muted-foreground">Your conversation with AI will appear here...</p>
                    ) : (
                      aiChatHistory.map((msg, index) => (
                        <div key={index} className={`mb-2 ${msg.role === 'user' ? 'text-right' : ''}`}>
                          <div className={`inline-block p-2 rounded-lg text-sm max-w-xs ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}>
                            {msg.content.substring(0, 100)}{msg.content.length > 100 ? '...' : ''}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  
                  <form onSubmit={handleAISubmit} className="flex gap-2">
                    <Input
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      placeholder="Ask AI to create or enhance content..."
                      className="flex-1"
                      disabled={generatingAI || ollamaStatus !== "connected"}
                    />
                    <Button 
                      type="submit" 
                      disabled={generatingAI || ollamaStatus !== "connected"}
                    >
                      <Send size={16} />
                    </Button>
                  </form>
                  
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => generateAIContent("Expand on this content with more details")}
                      disabled={generatingAI || ollamaStatus !== "connected"}
                    >
                      Expand
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => generateAIContent("Make this content shorter and more concise")}
                      disabled={generatingAI || ollamaStatus !== "connected"}
                    >
                      Summarize
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => generateAIContent("Improve the language and style of this content")}
                      disabled={generatingAI || ollamaStatus !== "connected"}
                    >
                      Improve
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => generateAIContent("Add bullet points to organize this content better")}
                      disabled={generatingAI || ollamaStatus !== "connected"}
                    >
                      Organize
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Right side - Preview and Actions */}
              <div className="w-1/2 p-4 overflow-auto bg-muted/30 flex flex-col">
                <h3 className="font-medium text-lg mb-4">Preview</h3>
                <div className="bg-background border border-border rounded-md p-4 flex-1 overflow-auto mb-4">
                  {newDoc.content || "Your content will appear here as you generate it with AI..."}
                  {generatingAI && (
                    <div className="flex items-center text-blue-500 mt-4">
                      <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-2"></div>
                      <span>AI is generating content...</span>
                    </div>
                  )}
                </div>
                
                <div className="bg-muted p-4 rounded-md mb-4">
                  <h3 className="font-medium mb-2">Suggested Prompts</h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>"Create a detailed SOP for [topic]"</li>
                    <li>"Expand the introduction with more context"</li>
                    <li>"Add bullet points to summarize key findings"</li>
                    <li>"Improve the language to make it more professional"</li>
                  </ul>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    onClick={saveNewDocument} 
                    disabled={saving} 
                    className="flex-1"
                  >
                    {saving ? "Saving..." : "Save Document"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setNewDoc({
                        title: "",
                        content: "",
                        source_url: "",
                        tags: "",
                        file: null,
                      });
                    }}
                  >
                    Clear
                  </Button>
                </div>
                
                <div className="mt-4 p-3 bg-muted rounded-md">
                  <div className="flex items-center text-sm mb-1">
                    <div className={`w-3 h-3 rounded-full mr-2 ${ollamaStatus === "connected" ? "bg-green-500" : "bg-red-500"}`}></div>
                    <span>Ollama Status: {ollamaStatus === "connected" ? "Connected" : "Not connected"}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {ollamaStatus === "connected" 
                      ? "You can generate AI content using the chat below." 
                      : "Please make sure Ollama is running on your machine at http://localhost:11434"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default KnowledgeBase;