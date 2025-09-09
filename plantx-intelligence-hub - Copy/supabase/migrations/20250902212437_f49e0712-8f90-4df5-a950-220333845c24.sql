-- Create SOPs (Standard Operating Procedures) table
CREATE TABLE public.sops (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT NOT NULL,
  category TEXT,
  industry_standards TEXT[],
  equipment_types TEXT[],
  safety_requirements TEXT[],
  steps JSONB DEFAULT '[]'::jsonb,
  tags TEXT[],
  status TEXT DEFAULT 'draft'::text CHECK (status IN ('draft', 'review', 'approved', 'archived')),
  version INTEGER DEFAULT 1,
  created_by TEXT,
  approved_by TEXT,
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.sops ENABLE ROW LEVEL SECURITY;

-- Create policies for SOPs
CREATE POLICY "Users can view their own SOPs" 
ON public.sops 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own SOPs" 
ON public.sops 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own SOPs" 
ON public.sops 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own SOPs" 
ON public.sops 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_sops_updated_at
BEFORE UPDATE ON public.sops
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();