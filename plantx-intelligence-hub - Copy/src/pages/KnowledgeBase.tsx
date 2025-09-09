import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { BookOpen, Search, Filter, Clock, User, Download, Eye, FileText } from "lucide-react";
import { useKnowledgeArticles } from '@/hooks/usePocketbaseData';

const KnowledgeBase = () => {
  const { articles, loading } = useKnowledgeArticles();
  const [selectedArticle, setSelectedArticle] = useState<any | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  
  const mockArticles = [
    {
      title: "Turbine Maintenance Procedures",
      category: "Maintenance",
      site: "Power Generation C",
      version: "v2.1",
      lastUpdated: "2024-01-15",
      author: "John Smith",
      summary: "Comprehensive guide for routine turbine maintenance including safety protocols and step-by-step procedures.",
      attachments: 3,
      views: 245
    },
    {
      title: "Chemical Storage Safety Guidelines",
      category: "Safety",
      site: "Chemical Processing B",
      version: "v1.8",
      lastUpdated: "2024-01-12",
      author: "Sarah Johnson",
      summary: "Essential safety protocols for chemical storage facilities including emergency procedures.",
      attachments: 5,
      views: 189
    },
    {
      title: "Quality Control Testing Protocols",
      category: "Quality",
      site: "Manufacturing Plant A",
      version: "v3.0",
      lastUpdated: "2024-01-10",
      author: "Mike Davis",
      summary: "Standard operating procedures for quality control testing across manufacturing processes.",
      attachments: 7,
      views: 167
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Knowledge Base</h1>
          <p className="text-muted-foreground">Access SOPs, procedures, and technical documentation</p>
        </div>
        <Button className="bg-primary hover:bg-primary-hover">
          <BookOpen className="h-4 w-4 mr-2" />
          Add Article
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input 
            placeholder="Search knowledge base with AI..." 
            className="pl-10"
          />
        </div>
        <Button variant="outline" onClick={() => setShowFilters(true)}>
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {(articles && articles.length > 0 ? articles : mockArticles).map((article, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-lg leading-tight">{article.title}</CardTitle>
                <Badge variant="outline" className="shrink-0">
                  {article.version}
                </Badge>
              </div>
              <div className="flex gap-2">
                <Badge className="bg-primary text-primary-foreground">
                  {article.category}
                </Badge>
                <Badge variant="secondary">
                  {article.site}
                </Badge>
              </div>
            </CardHeader>
            
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {article.summary || article.content?.substring(0, 100) + '...'}
            </p>
            
            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <Clock className="h-3 w-3" />
                <span>Updated {article.lastUpdated || new Date(article.updated || article.created).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-3 w-3" />
                <span>By {article.author || 'Unknown'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Download className="h-3 w-3" />
                <span>{article.attachments || 0} attachments • {article.views || 0} views</span>
              </div>
            </div>
              
              <div className="flex gap-2 pt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => setSelectedArticle(article)}
                >
                  View Article
                </Button>
                <Button variant="ghost" size="sm">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Article Details Modal */}
      <Dialog open={!!selectedArticle} onOpenChange={() => setSelectedArticle(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {selectedArticle?.title}
            </DialogTitle>
            <DialogDescription>
              {selectedArticle?.category} • {selectedArticle?.site} • Version {selectedArticle?.version}
            </DialogDescription>
          </DialogHeader>
          {selectedArticle && (
            <div className="space-y-6">
            <div className="flex gap-2">
              <Badge className="bg-primary text-primary-foreground">
                {selectedArticle.category || 'General'}
              </Badge>
              <Badge variant="secondary">
                {selectedArticle.site || 'All Sites'}
              </Badge>
              <Badge variant="outline">
                {selectedArticle.version || 'v1.0'}
              </Badge>
            </div>
              
              <div className="prose max-w-none">
                <h3>Article Summary</h3>
                <p>{selectedArticle.summary}</p>
                
                <h3>Standard Operating Procedures</h3>
                <ol>
                  <li>Pre-operation safety checks and equipment verification</li>
                  <li>Step-by-step operational procedures with safety protocols</li>
                  <li>Quality control checkpoints and testing procedures</li>
                  <li>Emergency shutdown procedures and safety protocols</li>
                  <li>Post-operation cleanup and maintenance requirements</li>
                </ol>
                
                <h3>Safety Guidelines</h3>
                <ul>
                  <li>Personal protective equipment (PPE) requirements</li>
                  <li>Hazard identification and risk assessment</li>
                  <li>Emergency contact information and procedures</li>
                  <li>Environmental and chemical safety protocols</li>
                </ul>
                
                <h3>Technical Specifications</h3>
                <p>Detailed technical parameters, operational limits, and performance criteria for the equipment and processes covered in this document.</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Document Information</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3" />
                      <span>Updated {selectedArticle.lastUpdated}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-3 w-3" />
                      <span>By {selectedArticle.author}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Download className="h-3 w-3" />
                      <span>{selectedArticle.attachments} attachments</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Eye className="h-3 w-3" />
                      <span>{selectedArticle.views} views</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Attachments</h4>
                  <div className="space-y-1">
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <FileText className="h-4 w-4 mr-2" />
                      Equipment_Manual.pdf
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <FileText className="h-4 w-4 mr-2" />
                      Safety_Checklist.pdf
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <FileText className="h-4 w-4 mr-2" />
                      Maintenance_Schedule.xlsx
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Filters Modal */}
      <Dialog open={showFilters} onOpenChange={setShowFilters}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Filter Knowledge Base</DialogTitle>
            <DialogDescription>
              Narrow down articles by category, site, and other criteria
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="space-y-3">
              <h4 className="font-medium">Categories</h4>
              <div className="space-y-2">
                {["Maintenance", "Safety", "Quality", "Operations", "Training"].map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox id={category} />
                    <label htmlFor={category} className="text-sm font-medium">
                      {category}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium">Sites</h4>
              <div className="space-y-2">
                {["All Sites", "Power Generation C", "Chemical Processing B", "Manufacturing Plant A", "Refinery Complex D"].map((site) => (
                  <div key={site} className="flex items-center space-x-2">
                    <Checkbox id={site} />
                    <label htmlFor={site} className="text-sm font-medium">
                      {site}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium">Date Range</h4>
              <div className="space-y-2">
                {["Last 30 days", "Last 90 days", "Last 6 months", "Last year", "All time"].map((range) => (
                  <div key={range} className="flex items-center space-x-2">
                    <Checkbox id={range} />
                    <label htmlFor={range} className="text-sm font-medium">
                      {range}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button className="flex-1">Apply Filters</Button>
              <Button variant="outline">Clear All</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default KnowledgeBase;