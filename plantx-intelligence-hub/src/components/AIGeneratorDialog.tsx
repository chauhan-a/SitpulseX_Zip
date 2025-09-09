import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Input,
  Button,
} from "@/components/ui";
import { Sparkles } from "lucide-react";

const AIGeneratorDialog = ({
  show,
  onClose,
  newDoc,
  onNewDocChange,
  aiPrompt,
  setAiPrompt,
  generateAIContent,
  saveNewDocument,
  clearDocument,
  saving,
  generatingAI,
  ollamaStatus,
}) => {
  return (
    <Dialog open={show} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl h-[85vh] p-0" style={{ zIndex: 100 }}>
        <div className="flex flex-col w-full h-full">
          {/* Header */}
          <DialogHeader className="bg-primary text-primary-foreground p-6">
            <DialogTitle className="text-xl flex items-center gap-2">
              <Sparkles size={24} />
              AI Content Generator
            </DialogTitle>
            <DialogDescription>
              Create content with AI assistance using Ollama
            </DialogDescription>
          </DialogHeader>

          {/* Body */}
          <div className="flex flex-1 overflow-hidden">
            {/* Left - Editor */}
            <div className="w-1/2 p-6 border-r overflow-auto flex flex-col gap-4 bg-background">
              <h3 className="text-lg font-semibold">Editor</h3>

              <div>
                <label className="text-sm font-medium mb-1 block">Document Title</label>
                <Input
                  placeholder="Enter title"
                  value={newDoc.title}
                  onChange={(e) => onNewDocChange("title", e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Document Content</label>
                <textarea
                  rows={8}
                  value={newDoc.content}
                  onChange={(e) => onNewDocChange("content", e.target.value)}
                  placeholder="Document Content"
                  className="w-full border border-gray-300 rounded-md p-3 resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">AI Prompt</label>
                <textarea
                  rows={3}
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="e.g., Write a SOP for OT assessment best practices"
                  className="w-full border border-gray-300 rounded-md p-3 resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex gap-2 flex-wrap">
                <Button
                  onClick={generateAIContent}
                  disabled={generatingAI || ollamaStatus !== "connected"}
                >
                  {generatingAI ? "Generating..." : "Generate AI Content"}
                </Button>
                <Button onClick={saveNewDocument} disabled={saving}>
                  {saving ? "Saving..." : "Save Document"}
                </Button>
                <Button variant="outline" onClick={clearDocument}>
                  Clear
                </Button>
              </div>

              <div className="mt-2 p-3 bg-muted rounded-md text-sm flex items-start gap-3">
                <div
                  className={`w-3 h-3 mt-1 rounded-full ${
                    ollamaStatus === "connected" ? "bg-green-500" : "bg-red-500"
                  }`}
                ></div>
                <div>
                  <p>
                    <strong>
                      Ollama Status:{" "}
                      {ollamaStatus === "connected" ? "Connected" : "Not Connected"}
                    </strong>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {ollamaStatus === "connected"
                      ? "You can generate AI content using the button above."
                      : "Please make sure Ollama is running on your machine at http://localhost:11434"}
                  </p>
                </div>
              </div>
            </div>

            {/* Right - Preview */}
            <div className="w-1/2 p-6 overflow-auto bg-muted/30 flex flex-col gap-4">
              <h3 className="text-lg font-semibold">Preview</h3>
              <div className="bg-background border border-border rounded-md p-4 h-60 overflow-auto text-sm whitespace-pre-wrap">
                {newDoc.content || "AI generated content will appear here..."}
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">How to use:</h3>
                <ol className="list-decimal pl-5 space-y-2 text-sm text-muted-foreground">
                  <li>Enter a title for your document</li>
                  <li>Click "Generate AI Content"</li>
                  <li>Review and edit the generated content</li>
                  <li>Save your document</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AIGeneratorDialog;
