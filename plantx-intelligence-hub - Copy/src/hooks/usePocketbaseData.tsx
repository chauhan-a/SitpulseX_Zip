import { useState, useEffect } from 'react';
import { pb, Ticket, Site, SOP, KnowledgeArticle } from '@/integrations/pocketbase/client';

export const useTickets = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const records = await pb.collection('tickets').getFullList<Ticket>({
        sort: '-created',
      });
      setTickets(records);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const getTicketsByStatus = (status: string) => {
    return tickets.filter(ticket => ticket.status === status);
  };

  const getTicketCounts = () => {
    return {
      open: tickets.filter(t => t.status === 'open').length,
      in_progress: tickets.filter(t => t.status === 'in_progress').length,
      closed: tickets.filter(t => t.status === 'closed').length,
      overdue: tickets.filter(t => {
        if (!t.due_date || t.status === 'closed') return false;
        return new Date(t.due_date) < new Date();
      }).length
    };
  };

  return {
    tickets,
    loading,
    fetchTickets,
    getTicketsByStatus,
    getTicketCounts
  };
};

export const useSites = () => {
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSites = async () => {
    try {
      setLoading(true);
      const records = await pb.collection('sites').getFullList<Site>({
        sort: '-created',
      });
      setSites(records);
    } catch (error) {
      console.error('Error fetching sites:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSites();
  }, []);

  return {
    sites,
    loading,
    fetchSites
  };
};

export const useSOPs = () => {
  const [sops, setSOPs] = useState<SOP[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSOPs = async () => {
    try {
      setLoading(true);
      const records = await pb.collection('sops').getFullList<SOP>({
        sort: '-created',
      });
      setSOPs(records);
    } catch (error) {
      console.error('Error fetching SOPs:', error);
    } finally {
      setLoading(false);
    }
  };

  const createSOP = async (sopData: Partial<SOP>) => {
    try {
      const record = await pb.collection('sops').create<SOP>(sopData);
      setSOPs(prev => [record, ...prev]);
      return record;
    } catch (error) {
      console.error('Error creating SOP:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchSOPs();
  }, []);

  return {
    sops,
    loading,
    fetchSOPs,
    createSOP
  };
};

export const useKnowledgeArticles = () => {
  const [articles, setArticles] = useState<KnowledgeArticle[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const records = await pb.collection('knowledge_articles').getFullList<KnowledgeArticle>({
        sort: '-created',
      });
      setArticles(records);
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  return {
    articles,
    loading,
    fetchArticles
  };
};

// Export the Ticket type for use in other components
export type { Ticket };