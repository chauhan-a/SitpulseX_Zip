-- Create enum for integration types
CREATE TYPE integration_type AS ENUM (
  'servicenow',
  'database',
  'custom_app',
  'ai_tool',
  'scada',
  'erp',
  'cmms',
  'communication'
);

-- Create enum for integration status
CREATE TYPE integration_status AS ENUM (
  'connected',
  'pending',
  'disconnected',
  'error'
);

-- Create integrations table to store API configurations
CREATE TABLE public.integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  type integration_type NOT NULL,
  status integration_status DEFAULT 'pending',
  config JSONB NOT NULL DEFAULT '{}',
  api_endpoint TEXT,
  last_sync TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, name)
);

-- Enable RLS
ALTER TABLE public.integrations ENABLE ROW LEVEL SECURITY;

-- Create policies for integrations
CREATE POLICY "Users can view their own integrations" 
ON public.integrations 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own integrations" 
ON public.integrations 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own integrations" 
ON public.integrations 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own integrations" 
ON public.integrations 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create tickets table for ServiceNow integration
CREATE TABLE public.tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  servicenow_id TEXT,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'open',
  priority TEXT DEFAULT 'medium',
  assigned_to TEXT,
  site_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  due_date TIMESTAMP WITH TIME ZONE
);

-- Enable RLS for tickets
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;

-- Create policies for tickets (public read for now, but can be restricted later)
CREATE POLICY "Anyone can view tickets" 
ON public.tickets 
FOR SELECT 
USING (true);

-- Create sites table for site management
CREATE TABLE public.sites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  location TEXT,
  status TEXT DEFAULT 'active',
  equipment_count INTEGER DEFAULT 0,
  last_maintenance TIMESTAMP WITH TIME ZONE,
  details JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for sites
ALTER TABLE public.sites ENABLE ROW LEVEL SECURITY;

-- Create policies for sites
CREATE POLICY "Anyone can view sites" 
ON public.sites 
FOR SELECT 
USING (true);

-- Create knowledge_articles table
CREATE TABLE public.knowledge_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT,
  category TEXT,
  tags TEXT[],
  status TEXT DEFAULT 'published',
  author TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  views INTEGER DEFAULT 0
);

-- Enable RLS for knowledge articles
ALTER TABLE public.knowledge_articles ENABLE ROW LEVEL SECURITY;

-- Create policies for knowledge articles
CREATE POLICY "Anyone can view knowledge articles" 
ON public.knowledge_articles 
FOR SELECT 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_integrations_updated_at
  BEFORE UPDATE ON public.integrations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tickets_updated_at
  BEFORE UPDATE ON public.tickets
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_sites_updated_at
  BEFORE UPDATE ON public.sites
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_knowledge_articles_updated_at
  BEFORE UPDATE ON public.knowledge_articles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data for testing
INSERT INTO public.tickets (servicenow_id, title, description, status, priority, assigned_to, site_id) VALUES
('INC0000123', 'Network connectivity issue', 'Site A experiencing intermittent network drops', 'open', 'high', 'John Doe', 'site-001'),
('INC0000124', 'Equipment maintenance required', 'Scheduled maintenance for Pump Unit 3', 'in_progress', 'medium', 'Jane Smith', 'site-002'),
('INC0000125', 'Temperature sensor malfunction', 'Temperature readings showing irregular values', 'closed', 'low', 'Mike Johnson', 'site-001'),
('INC0000126', 'Safety inspection overdue', 'Monthly safety inspection due for Site B', 'overdue', 'high', 'Sarah Wilson', 'site-002');

INSERT INTO public.sites (name, location, status, equipment_count, last_maintenance, details) VALUES
('Manufacturing Plant A', 'Detroit, MI', 'active', 45, '2024-01-15 10:00:00+00', '{"type": "manufacturing", "capacity": "500 units/day"}'),
('Distribution Center B', 'Chicago, IL', 'active', 28, '2024-01-20 14:30:00+00', '{"type": "distribution", "area": "25000 sq ft"}'),
('Service Station C', 'Houston, TX', 'maintenance', 12, '2024-01-10 09:00:00+00', '{"type": "service", "fuel_capacity": "10000 gallons"}');

INSERT INTO public.knowledge_articles (title, content, category, tags, author) VALUES
('Emergency Shutdown Procedures', 'Step-by-step guide for emergency equipment shutdown...', 'Safety', '{safety, emergency, procedures}', 'Safety Team'),
('Pump Maintenance Guide', 'Regular maintenance procedures for industrial pumps...', 'Maintenance', '{maintenance, pumps, equipment}', 'Engineering Team'),
('Network Troubleshooting', 'Common network issues and their solutions...', 'IT Support', '{network, troubleshooting, connectivity}', 'IT Department');