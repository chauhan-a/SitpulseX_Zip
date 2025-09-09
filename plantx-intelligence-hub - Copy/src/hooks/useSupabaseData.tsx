import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Ticket {
  id: string;
  servicenow_id?: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  assigned_to?: string;
  site_id?: string;
  created_at: string;
  updated_at: string;
  due_date?: string;
}

export interface Site {
  id: string;
  name: string;
  location?: string;
  status: string;
  equipment_count: number;
  last_maintenance?: string;
  details: any;
  created_at: string;
  updated_at: string;
}

export interface KnowledgeArticle {
  id: string;
  title: string;
  content?: string;
  category?: string;
  tags?: string[];
  status: string;
  author?: string;
  created_at: string;
  updated_at: string;
  views: number;
}

export const useTickets = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTickets(data || []);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      toast({
        title: "Error",
        description: "Failed to fetch tickets",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getTicketsByStatus = (status: string) => {
    return tickets.filter(ticket => ticket.status === status);
  };

  const getTicketCounts = () => {
    return {
      open: tickets.filter(t => t.status === 'open').length,
      in_progress: tickets.filter(t => t.status === 'in_progress').length,
      closed: tickets.filter(t => t.status === 'closed').length,
      overdue: tickets.filter(t => {
        if (!t.due_date) return false;
        return new Date(t.due_date) < new Date() && t.status !== 'closed';
      }).length,
    };
  };

  return {
    tickets,
    loading,
    getTicketsByStatus,
    getTicketCounts,
    refetch: fetchTickets,
  };
};

export const useSites = () => {
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchSites();
  }, []);

  const fetchSites = async () => {
    try {
      const { data, error } = await supabase
        .from('sites')
        .select('*')
        .order('name');

      if (error) throw error;
      setSites(data || []);
    } catch (error) {
      console.error('Error fetching sites:', error);
      toast({
        title: "Error",
        description: "Failed to fetch sites",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    sites,
    loading,
    refetch: fetchSites,
  };
};

export const useKnowledgeArticles = () => {
  const [articles, setArticles] = useState<KnowledgeArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const { data, error } = await supabase
        .from('knowledge_articles')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setArticles(data || []);
    } catch (error) {
      console.error('Error fetching articles:', error);
      toast({
        title: "Error",
        description: "Failed to fetch knowledge articles",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getArticlesByCategory = (category: string) => {
    return articles.filter(article => article.category === category);
  };

  return {
    articles,
    loading,
    getArticlesByCategory,
    refetch: fetchArticles,
  };
};

export const useAIIntegration = () => {
  const { toast } = useToast();

  const queryAI = async (question: string, provider = 'openai', context = '') => {
    try {
      const { data, error } = await supabase.functions.invoke('ai-integration', {
        body: { provider, question, context }
      });

      if (error) throw error;
      return data.response;
    } catch (error) {
      console.error('Error querying AI:', error);
      toast({
        title: "Error",
        description: "Failed to get AI response",
        variant: "destructive",
      });
      return null;
    }
  };

  return { queryAI };
};