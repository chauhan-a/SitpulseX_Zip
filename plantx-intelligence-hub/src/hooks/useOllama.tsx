import { useState } from 'react';
import { getOllamaUrl, getSelectedModel } from '@/utils/ollamaUtils';

interface OllamaMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface OllamaResponse {
  message: {
    role: string;
    content: string;
  };
  done: boolean;
}

export const useOllama = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateResponse = async (
    messages: OllamaMessage[],
    model?: string
  ): Promise<string> => {
    setIsLoading(true);
    setError(null);

    const ollamaUrl = getOllamaUrl();
    const selectedModel = model || getSelectedModel();

    try {
      const response = await fetch(`${ollamaUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: selectedModel,
          messages,
          stream: false,
        }),
      });

      if (!response.ok) {
        throw new Error(`Ollama request failed: ${response.status}`);
      }

      const data: OllamaResponse = await response.json();
      return data.message.content;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const generateTicketResolution = async (
    ticketTitle: string,
    ticketDescription: string,
    ticketPriority: string
  ): Promise<string> => {
    const systemPrompt = `You are an expert maintenance engineer and technical support specialist. 
    Provide detailed, actionable resolution steps for maintenance tickets. 
    Include safety considerations, required tools/parts, estimated time, and follow-up actions.
    Format your response with clear numbered steps and bullet points.`;

    const userPrompt = `Please provide a detailed resolution plan for this maintenance ticket:
    
    Title: ${ticketTitle}
    Description: ${ticketDescription}
    Priority: ${ticketPriority}
    
    Include:
    1. Initial assessment steps
    2. Safety precautions
    3. Required tools and materials
    4. Step-by-step resolution procedure
    5. Testing and verification
    6. Documentation requirements`;

    return generateResponse([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ]);
  };

  const generateSOP = async (
    title: string,
    description: string,
    equipmentTypes: string[],
    safetyRequirements: string[],
    industryStandards: string[]
  ): Promise<{
    content: string;
    steps: Array<{ step: number; title: string; description: string; safety: string[] }>;
  }> => {
    const systemPrompt = `You are an expert in industrial procedures and safety standards. 
    Create comprehensive Standard Operating Procedures (SOPs) that comply with industry standards 
    including OSHA, ISO, and relevant industry-specific regulations.
    
    Format your response as structured steps with safety considerations for each step.
    Be specific about equipment, tools, PPE requirements, and safety protocols.`;

    const userPrompt = `Create a detailed SOP for:
    
    Title: ${title}
    Description: ${description}
    Equipment Types: ${equipmentTypes.join(', ')}
    Safety Requirements: ${safetyRequirements.join(', ')}
    Industry Standards: ${industryStandards.join(', ')}
    
    Please provide:
    1. Purpose and scope
    2. Responsibilities
    3. Required equipment and PPE
    4. Detailed step-by-step procedure with safety notes
    5. Emergency procedures
    6. Documentation and record keeping requirements
    
    Format each procedural step as: "Step X: [Title] - [Description] - Safety: [Safety considerations]"`;

    const response = await generateResponse([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ]);

    // Parse the response to extract structured steps
    const steps = extractStepsFromResponse(response);
    
    return {
      content: response,
      steps
    };
  };

  const extractStepsFromResponse = (response: string): Array<{ step: number; title: string; description: string; safety: string[] }> => {
    const steps: Array<{ step: number; title: string; description: string; safety: string[] }> = [];
    const lines = response.split('\n');
    
    let currentStep = 0;
    
    for (const line of lines) {
      const stepMatch = line.match(/Step (\d+):\s*(.+?)\s*-\s*(.+?)\s*-\s*Safety:\s*(.+)/i);
      if (stepMatch) {
        currentStep++;
        const [, stepNum, title, description, safetyText] = stepMatch;
        const safety = safetyText.split(',').map(s => s.trim()).filter(s => s.length > 0);
        
        steps.push({
          step: parseInt(stepNum) || currentStep,
          title: title.trim(),
          description: description.trim(),
          safety
        });
      }
    }
    
    return steps;
  };

  return {
    generateResponse,
    generateTicketResolution,
    generateSOP,
    isLoading,
    error
  };
};