import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Search, Plus, Edit, Copy, Archive, Calendar, User, TrendingUp, Eye } from "lucide-react";

const Templates = () => {
  const [selectedStat, setSelectedStat] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<any | null>(null);
  const [templateAction, setTemplateAction] = useState<string | null>(null);
  
  const templateStats = [
    { label: "Active Templates", value: 24, color: "bg-success" },
    { label: "Monthly Usage", value: 156, color: "bg-primary" },
    { label: "Drafts", value: 3, color: "bg-warning" },
    { label: "Archived", value: 8, color: "bg-muted" }
  ];

  const mockTemplates = [
    {
      name: "Equipment Inspection Checklist",
      category: "Inspection",
      sitesUsed: ["Plant A", "Plant B", "Plant C"],
      status: "Active",
      lastModified: "2024-01-15",
      usageCount: 42,
      description: "Standard equipment inspection form with safety checkpoints"
    },
    {
      name: "Maintenance Work Order",
      category: "Maintenance", 
      sitesUsed: ["All Sites"],
      status: "Active",
      lastModified: "2024-01-14",
      usageCount: 38,
      description: "Comprehensive work order template for maintenance activities"
    },
    {
      name: "Incident Report Form",
      category: "Safety",
      sitesUsed: ["Chemical Processing B", "Refinery D"],
      status: "Active",
      lastModified: "2024-01-12",
      usageCount: 15,
      description: "Incident documentation and investigation template"
    },
    {
      name: "Quality Audit Checklist",
      category: "Quality",
      sitesUsed: ["Manufacturing Plant A"],
      status: "Draft",
      lastModified: "2024-01-10",
      usageCount: 0,
      description: "Quality control audit procedures and documentation"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Templates</h1>
          <p className="text-muted-foreground">Create and manage form templates and checklists</p>
        </div>
        <Button className="bg-primary hover:bg-primary-hover">
          <Plus className="h-4 w-4 mr-2" />
          Create Template
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {templateStats.map((stat, index) => (
          <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedStat(stat.label)}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${stat.color}`} />
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-xl font-bold">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input 
            placeholder="Search templates..." 
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          Filter by Category
        </Button>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mockTemplates.map((template, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg">{template.name}</CardTitle>
                <Badge 
                  variant={template.status === "Active" ? "default" : "secondary"}
                  className={template.status === "Active" ? "bg-success text-success-foreground" : ""}
                >
                  {template.status}
                </Badge>
              </div>
              <Badge variant="outline" className="w-fit">
                {template.category}
              </Badge>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {template.description}
              </p>
              
              <div className="space-y-2">
                <div className="text-sm">
                  <span className="text-muted-foreground">Sites: </span>
                  <span className="font-medium">{template.sitesUsed.join(", ")}</span>
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Last Modified: </span>
                  <span className="font-medium">{template.lastModified}</span>
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Usage Count: </span>
                  <span className="font-medium">{template.usageCount}</span>
                </div>
              </div>
              
              <div className="flex gap-2 pt-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setSelectedTemplate(template);
                    setTemplateAction("view");
                  }}
                >
                  <FileText className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    setSelectedTemplate(template);
                    setTemplateAction("edit");
                  }}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    setSelectedTemplate(template);
                    setTemplateAction("duplicate");
                  }}
                >
                  <Copy className="h-4 w-4 mr-1" />
                  Duplicate
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    setSelectedTemplate(template);
                    setTemplateAction("archive");
                  }}
                >
                  <Archive className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Stats Details Modal */}
      <Dialog open={!!selectedStat} onOpenChange={() => setSelectedStat(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedStat} Details</DialogTitle>
            <DialogDescription>
              Detailed breakdown of {selectedStat?.toLowerCase()} templates
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Template Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Modified</TableHead>
                  <TableHead>Usage Count</TableHead>
                  <TableHead>Sites Used</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockTemplates
                  .filter(template => {
                    if (selectedStat === "Active Templates") return template.status === "Active";
                    if (selectedStat === "Drafts") return template.status === "Draft";
                    if (selectedStat === "Archived") return template.status === "Archived";
                    return true;
                  })
                  .map((template, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{template.name}</TableCell>
                      <TableCell>{template.category}</TableCell>
                      <TableCell>
                        <Badge variant={template.status === "Active" ? "default" : "secondary"}>
                          {template.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{template.lastModified}</TableCell>
                      <TableCell>{template.usageCount}</TableCell>
                      <TableCell>{template.sitesUsed.join(", ")}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>

      {/* Template Action Modal */}
      <Dialog open={!!templateAction} onOpenChange={() => { setTemplateAction(null); setSelectedTemplate(null); }}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {templateAction === "view" && "View Template"}
              {templateAction === "edit" && "Edit Template"}
              {templateAction === "duplicate" && "Duplicate Template"}
              {templateAction === "archive" && "Archive Template"}
            </DialogTitle>
            <DialogDescription>
              {selectedTemplate?.name} • {selectedTemplate?.category}
            </DialogDescription>
          </DialogHeader>
          {selectedTemplate && (
            <div className="space-y-6">
              {templateAction === "view" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-semibold">Template Information</h4>
                      <div className="space-y-1 text-sm">
                        <div><span className="text-muted-foreground">Name:</span> {selectedTemplate.name}</div>
                        <div><span className="text-muted-foreground">Category:</span> {selectedTemplate.category}</div>
                        <div><span className="text-muted-foreground">Status:</span> 
                          <Badge className="ml-2" variant={selectedTemplate.status === "Active" ? "default" : "secondary"}>
                            {selectedTemplate.status}
                          </Badge>
                        </div>
                        <div><span className="text-muted-foreground">Usage Count:</span> {selectedTemplate.usageCount}</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold">Deployment</h4>
                      <div className="space-y-1 text-sm">
                        <div><span className="text-muted-foreground">Sites Used:</span> {selectedTemplate.sitesUsed.join(", ")}</div>
                        <div><span className="text-muted-foreground">Last Modified:</span> {selectedTemplate.lastModified}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold">Description</h4>
                    <p className="text-sm text-muted-foreground">{selectedTemplate.description}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold">Template Fields</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {["Equipment ID", "Inspection Date", "Inspector Name", "Safety Checklist", "Maintenance Notes", "Approval Status"].map((field, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                          <FileText className="h-4 w-4" />
                          <span className="text-sm">{field}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              {templateAction === "edit" && (
                <div className="space-y-4">
                  <div className="text-center py-8">
                    <Edit className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold">Template Editor</h3>
                    <p className="text-muted-foreground">Edit template fields, validation rules, and deployment settings</p>
                  </div>
                  <Button className="w-full">Open Template Editor</Button>
                </div>
              )}
              
              {templateAction === "duplicate" && (
                <div className="space-y-4">
                  <div className="text-center py-8">
                    <Copy className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold">Duplicate Template</h3>
                    <p className="text-muted-foreground">Create a copy of this template with customizable settings</p>
                  </div>
                  <Button className="w-full">Create Duplicate</Button>
                </div>
              )}
              
              {templateAction === "archive" && (
                <div className="space-y-4">
                  <div className="text-center py-8">
                    <Archive className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold">Archive Template</h3>
                    <p className="text-muted-foreground">This will move the template to archived status and stop its usage</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="destructive" className="flex-1">Archive Template</Button>
                    <Button variant="outline" onClick={() => { setTemplateAction(null); setSelectedTemplate(null); }}>Cancel</Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Templates;