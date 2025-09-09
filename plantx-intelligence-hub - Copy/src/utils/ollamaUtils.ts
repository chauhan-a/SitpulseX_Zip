// Utility functions for Ollama integration
export const getOllamaUrl = (): string => {
  return localStorage.getItem('ollama_url') || 'http://localhost:11434';
};

export const getSelectedModel = (): string => {
  return localStorage.getItem('ollama_model') || 'llama3';
};

export const setOllamaSettings = (url: string, model: string): void => {
  localStorage.setItem('ollama_url', url);
  localStorage.setItem('ollama_model', model);
};

export const testOllamaConnection = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(`${url}/api/tags`);
    return response.ok;
  } catch {
    return false;
  }
};

export const getAvailableModels = async (url: string): Promise<any[]> => {
  try {
    const response = await fetch(`${url}/api/tags`);
    if (!response.ok) return [];
    
    const data = await response.json();
    return data.models || [];
  } catch {
    return [];
  }
};