import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    const authHeader = req.headers.get('Authorization')!;
    const { data: { user } } = await supabaseClient.auth.getUser(authHeader.replace('Bearer ', ''));
    
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { action, config } = await req.json();

    switch (action) {
      case 'sync_tickets':
        await syncTicketsFromServiceNow(supabaseClient, config);
        break;
      case 'get_ticket_details':
        const { ticketId } = await req.json();
        const ticketDetails = await getTicketDetails(config, ticketId);
        return new Response(JSON.stringify(ticketDetails), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      case 'test_connection':
        const connectionStatus = await testServiceNowConnection(config);
        return new Response(JSON.stringify(connectionStatus), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('ServiceNow integration error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function syncTicketsFromServiceNow(supabaseClient: any, config: any) {
  // Mock ServiceNow API call - replace with actual ServiceNow API
  const mockTickets = [
    {
      servicenow_id: 'INC0000127',
      title: 'HVAC System Malfunction',
      description: 'Air conditioning unit in Building C not working',
      status: 'open',
      priority: 'high',
      assigned_to: 'Mike Johnson',
      site_id: 'site-003'
    }
  ];

  for (const ticket of mockTickets) {
    await supabaseClient
      .from('tickets')
      .upsert(ticket, { onConflict: 'servicenow_id' });
  }
}

async function getTicketDetails(config: any, ticketId: string) {
  // Mock ticket details - replace with actual ServiceNow API call
  return {
    id: ticketId,
    servicenow_id: 'INC0000123',
    title: 'Network connectivity issue',
    description: 'Site A experiencing intermittent network drops affecting production systems',
    status: 'open',
    priority: 'high',
    assigned_to: 'John Doe',
    site_id: 'site-001',
    created_at: '2024-01-22T08:30:00Z',
    updated_at: '2024-01-22T10:15:00Z',
    due_date: '2024-01-25T17:00:00Z',
    comments: [
      {
        author: 'John Doe',
        timestamp: '2024-01-22T09:15:00Z',
        text: 'Initial investigation shows possible router issue'
      },
      {
        author: 'Jane Smith',
        timestamp: '2024-01-22T10:00:00Z',
        text: 'Escalating to network team for immediate attention'
      }
    ],
    attachments: [
      { name: 'network_log.txt', url: '#' },
      { name: 'diagnostic_report.pdf', url: '#' }
    ]
  };
}

async function testServiceNowConnection(config: any) {
  // Mock connection test - replace with actual ServiceNow API call
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { connected: true, message: 'Connection successful' };
  } catch (error) {
    return { connected: false, message: 'Connection failed: ' + error.message };
  }
}