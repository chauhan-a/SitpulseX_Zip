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
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const { type, url, file, filename } = await req.json();

    let csvData: string;

    if (type === 'google_sheet') {
      // Convert Google Sheet URL to CSV export URL
      const sheetId = extractGoogleSheetId(url);
      if (!sheetId) {
        throw new Error('Invalid Google Sheet URL');
      }
      
      const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=0`;
      const response = await fetch(csvUrl);
      
      if (!response.ok) {
        throw new Error('Failed to fetch Google Sheet data');
      }
      
      csvData = await response.text();
    } else if (type === 'file_upload') {
      // Handle base64 encoded file
      const base64Data = file.split(',')[1];
      const binaryData = atob(base64Data);
      
      if (filename.toLowerCase().endsWith('.csv')) {
        csvData = binaryData;
      } else {
        // For Excel files, we'll treat them as CSV for now
        // In a real implementation, you'd use a library to parse Excel
        throw new Error('Excel files not yet supported. Please convert to CSV first.');
      }
    } else {
      throw new Error('Invalid import type');
    }

    // Parse CSV data
    const tickets = parseCSVToTickets(csvData);
    
    // Insert tickets into database
    const { data: insertedTickets, error } = await supabaseClient
      .from('tickets')
      .insert(tickets)
      .select();

    if (error) {
      console.error('Database error:', error);
      throw new Error('Failed to insert tickets into database');
    }

    return new Response(JSON.stringify({ 
      success: true, 
      imported_count: insertedTickets?.length || 0,
      tickets: insertedTickets 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Excel import error:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function extractGoogleSheetId(url: string): string | null {
  const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  return match ? match[1] : null;
}

function parseCSVToTickets(csvData: string) {
  const lines = csvData.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  
  console.log('CSV Headers:', headers);
  
  const tickets = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    
    if (values.length < headers.length) continue;
    
    const ticket: any = {
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    // Map CSV columns to ticket fields
    headers.forEach((header, index) => {
      const value = values[index]?.trim() || '';
      
      switch (header) {
        case 'title':
        case 'subject':
        case 'ticket title':
          ticket.title = value || 'Untitled Ticket';
          break;
        case 'description':
        case 'details':
        case 'ticket description':
          ticket.description = value;
          break;
        case 'status':
        case 'ticket status':
          ticket.status = normalizeStatus(value);
          break;
        case 'priority':
        case 'ticket priority':
          ticket.priority = normalizePriority(value);
          break;
        case 'assigned to':
        case 'assignee':
        case 'assigned_to':
          ticket.assigned_to = value;
          break;
        case 'site':
        case 'site_id':
        case 'location':
          ticket.site_id = value;
          break;
        case 'servicenow_id':
        case 'ticket id':
        case 'id':
          if (value && header !== 'id') {
            ticket.servicenow_id = value;
          }
          break;
        case 'due date':
        case 'due_date':
          if (value) {
            ticket.due_date = parseDate(value);
          }
          break;
      }
    });
    
    // Ensure required fields
    if (!ticket.title) {
      ticket.title = `Imported Ticket ${i}`;
    }
    if (!ticket.status) {
      ticket.status = 'open';
    }
    if (!ticket.priority) {
      ticket.priority = 'medium';
    }
    
    tickets.push(ticket);
  }
  
  console.log(`Parsed ${tickets.length} tickets`);
  return tickets;
}

function parseCSVLine(line: string): string[] {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current);
  return result.map(field => field.replace(/^"|"$/g, ''));
}

function normalizeStatus(status: string): string {
  const normalized = status.toLowerCase().trim();
  
  if (normalized.includes('open') || normalized.includes('new')) return 'open';
  if (normalized.includes('progress') || normalized.includes('working')) return 'in_progress';
  if (normalized.includes('closed') || normalized.includes('resolved') || normalized.includes('complete')) return 'closed';
  if (normalized.includes('overdue') || normalized.includes('expired')) return 'overdue';
  
  return 'open'; // default
}

function normalizePriority(priority: string): string {
  const normalized = priority.toLowerCase().trim();
  
  if (normalized.includes('high') || normalized.includes('urgent') || normalized === '1') return 'high';
  if (normalized.includes('medium') || normalized.includes('normal') || normalized === '2') return 'medium';
  if (normalized.includes('low') || normalized === '3') return 'low';
  
  return 'medium'; // default
}

function parseDate(dateStr: string): string | null {
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return null;
    return date.toISOString();
  } catch {
    return null;
  }
}