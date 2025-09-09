import PocketBase from 'pocketbase';

const POCKETBASE_URL = 'http://127.0.0.1:8090';

export const pb = new PocketBase(POCKETBASE_URL);

// Enable auto-cancellation for duplicated requests
pb.autoCancellation(false);

// Export types for better TypeScript support
export interface Ticket {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  assigned_to?: string;
  site_id?: string;
  servicenow_id?: string;
  due_date?: string;
  created: string;
  updated: string;
}

export interface Site {
  id: string;
  name: string;
  location?: string;
  status: string;
  equipment_count: number;
  last_maintenance?: string;
  details?: any;
  created: string;
  updated: string;
}

export interface SOP {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  content: string;
  steps?: any[];
  category?: string;
  industry_standards?: string[];
  equipment_types?: string[];
  safety_requirements?: string[];
  status: string;
  version: number;
  created_by?: string;
  approved_by?: string;
  approved_at?: string;
  tags?: string[];
  created: string;
  updated: string;
}

export interface KnowledgeArticle {
  id: string;
  title: string;
  content?: string;
  category?: string;
  tags?: string[];
  status: string;
  author?: string;
  views: number;
  created: string;
  updated: string;
}

export interface AIProvider {
  id: string;
  user_id: string;
  provider_name: string;
  api_key: string;
  model_name?: string;
  is_active: boolean;
  created: string;
  updated: string;
}

export interface Integration {
  id: string;
  user_id: string;
  name: string;
  type: string;
  status: string;
  config: any;
  api_endpoint?: string;
  last_sync?: string;
  created: string;
  updated: string;
}