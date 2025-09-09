-- Create AI providers configuration table
CREATE TABLE public.ai_providers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  provider_name TEXT NOT NULL CHECK (provider_name IN ('openai', 'deepseek', 'llama', 'huggingface', 'gemini', 'anthropic')),
  api_key TEXT NOT NULL,
  model_name TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, provider_name)
);

-- Enable Row Level Security
ALTER TABLE public.ai_providers ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own AI providers" 
ON public.ai_providers 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own AI providers" 
ON public.ai_providers 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own AI providers" 
ON public.ai_providers 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own AI providers" 
ON public.ai_providers 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_ai_providers_updated_at
BEFORE UPDATE ON public.ai_providers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();