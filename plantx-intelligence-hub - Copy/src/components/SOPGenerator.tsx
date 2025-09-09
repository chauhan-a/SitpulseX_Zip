import { useState } from 'react';
import { useOllama } from '@/hooks/useOllama';
import { pb } from '@/integrations/pocketbase/client';
import { useSOPs } from '@/hooks/usePocketbaseData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from '@/components/ui/use-toast';
import { FileText, Loader2, Plus, X, Save, BookOpen } from 'lucide-react';

interface SOPStep {
  step: number;
  title: string;
  description: string;
  safety: string[];
}

export const SOPGenerator = () => {
  const { generateSOP, isLoading } = useOllama();
  const { createSOP } = useSOPs();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    equipmentTypes: [] as string[],
    safetyRequirements: [] as string[],
    industryStandards: [] as string[]
  });
  const [newTag, setNewTag] = useState('');
  const [tagType, setTagType] = useState<'equipment' | 'safety' | 'standards'>('equipment');
  const [generatedSOP, setGeneratedSOP] = useState<{
    content: string;
    steps: SOPStep[];
  } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const addTag = () => {
    if (!newTag.trim()) return;
    
    const updatedData = { ...formData };
    if (tagType === 'equipment') {
      updatedData.equipmentTypes = [...formData.equipmentTypes, newTag.trim()];
    } else if (tagType === 'safety') {
      updatedData.safetyRequirements = [...formData.safetyRequirements, newTag.trim()];
    } else {
      updatedData.industryStandards = [...formData.industryStandards, newTag.trim()];
    }
    
    setFormData(updatedData);
    setNewTag('');
  };

  const removeTag = (type: 'equipment' | 'safety' | 'standards', index: number) => {
    const updatedData = { ...formData };
    if (type === 'equipment') {
      updatedData.equipmentTypes = formData.equipmentTypes.filter((_, i) => i !== index);
    } else if (type === 'safety') {
      updatedData.safetyRequirements = formData.safetyRequirements.filter((_, i) => i !== index);
    } else {
      updatedData.industryStandards = formData.industryStandards.filter((_, i) => i !== index);
    }
    setFormData(updatedData);
  };

  const handleGenerateSOP = async () => {
    if (!formData.title || !formData.description) {
      toast({
        title: "Missing Information",
        description: "Please provide both title and description",
        variant: "destructive"
      });
      return;
    }

    try {
      const result = await generateSOP(
        formData.title,
        formData.description,
        formData.equipmentTypes,
        formData.safetyRequirements,
        formData.industryStandards
      );
      setGeneratedSOP(result);
      toast({
        title: "SOP Generated",
        description: "Standard Operating Procedure has been generated successfully"
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate SOP. Please check your Ollama connection.",
        variant: "destructive"
      });
    }
  };

  const handleSaveSOP = async () => {
    if (!generatedSOP) return;

    setIsSaving(true);
    try {
      const sopData = {
        user_id: 'local-user', // For local development
        title: formData.title,
        description: formData.description,
        content: generatedSOP.content,
        category: formData.category,
        industry_standards: formData.industryStandards,
        equipment_types: formData.equipmentTypes,
        safety_requirements: formData.safetyRequirements,
        steps: generatedSOP.steps,
        status: 'draft',
        created_by: 'Local User'
      };

      await createSOP(sopData);

      toast({
        title: "SOP Saved",
        description: "Standard Operating Procedure has been saved successfully"
      });

      // Reset form
      setFormData({
        title: '',
        description: '',
        category: '',
        equipmentTypes: [],
        safetyRequirements: [],
        industryStandards: []
      });
      setGeneratedSOP(null);
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save SOP to database",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      {/* Left Panel - SOP Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            SOP Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Procedure Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Chemical Tank Cleaning Procedure"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of the procedure and its purpose"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder="e.g., Maintenance, Safety, Operations"
            />
          </div>

          <Separator />

          {/* Tag Management */}
          <div className="space-y-3">
            <Label>Add Requirements & Standards</Label>
            
            <div className="flex gap-2">
              <select
                value={tagType}
                onChange={(e) => setTagType(e.target.value as 'equipment' | 'safety' | 'standards')}
                className="px-3 py-2 border rounded-md text-sm"
              >
                <option value="equipment">Equipment</option>
                <option value="safety">Safety</option>
                <option value="standards">Standards</option>
              </select>
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Type and press Enter"
                onKeyPress={(e) => e.key === 'Enter' && addTag()}
                className="flex-1"
              />
              <Button onClick={addTag} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Equipment Types */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Equipment Types</Label>
              <div className="flex flex-wrap gap-1">
                {formData.equipmentTypes.map((item, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {item}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => removeTag('equipment', index)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            {/* Safety Requirements */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Safety Requirements</Label>
              <div className="flex flex-wrap gap-1">
                {formData.safetyRequirements.map((item, index) => (
                  <Badge key={index} variant="destructive" className="flex items-center gap-1">
                    {item}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => removeTag('safety', index)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            {/* Industry Standards */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Industry Standards</Label>
              <div className="flex flex-wrap gap-1">
                {formData.industryStandards.map((item, index) => (
                  <Badge key={index} variant="outline" className="flex items-center gap-1">
                    {item}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => removeTag('standards', index)}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <Button 
            onClick={handleGenerateSOP} 
            disabled={isLoading || !formData.title || !formData.description}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating SOP...
              </>
            ) : (
              <>
                <BookOpen className="h-4 w-4 mr-2" />
                Generate SOP
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Right Panel - Generated SOP */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Generated SOP</span>
            {generatedSOP && (
              <Button onClick={handleSaveSOP} disabled={isSaving} size="sm">
                {isSaving ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Save to Database
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {generatedSOP ? (
            <ScrollArea className="h-[600px]">
              <div className="space-y-4">
                <div className="prose prose-sm max-w-none">
                  <pre className="whitespace-pre-wrap text-sm font-mono bg-muted p-4 rounded-lg">
                    {generatedSOP.content}
                  </pre>
                </div>
                
                {generatedSOP.steps.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="font-semibold">Structured Steps:</h3>
                    {generatedSOP.steps.map((step, index) => (
                      <div key={index} className="border rounded-lg p-3 space-y-2">
                        <div className="font-medium">Step {step.step}: {step.title}</div>
                        <div className="text-sm text-muted-foreground">{step.description}</div>
                        {step.safety.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {step.safety.map((safety, safetyIndex) => (
                              <Badge key={safetyIndex} variant="destructive" className="text-xs">
                                {safety}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </ScrollArea>
          ) : (
            <div className="flex items-center justify-center h-[600px] text-muted-foreground">
              <div className="text-center">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Fill out the form and generate your SOP</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};