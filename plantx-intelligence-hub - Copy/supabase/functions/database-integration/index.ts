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

    const { action, query, database_type, config } = await req.json();

    let result;
    switch (action) {
      case 'execute_query':
        result = await executeQuery(database_type, config, query);
        break;
      case 'sync_data':
        result = await syncExternalData(supabaseClient, database_type, config);
        break;
      case 'test_connection':
        result = await testDatabaseConnection(database_type, config);
        break;
      default:
        throw new Error('Unknown action');
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Database integration error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function executeQuery(databaseType: string, config: any, query: string) {
  // Mock query execution for different database types
  const mockResults = {
    'mysql': [
      { id: 1, name: 'Equipment A', status: 'active', last_check: '2024-01-22' },
      { id: 2, name: 'Equipment B', status: 'maintenance', last_check: '2024-01-20' }
    ],
    'postgresql': [
      { id: 1, site_name: 'Plant A', location: 'Detroit', capacity: 500 },
      { id: 2, site_name: 'Plant B', location: 'Chicago', capacity: 300 }
    ],
    'mongodb': [
      { _id: '507f1f77bcf86cd799439011', sensor_id: 'temp_001', value: 75.2, timestamp: '2024-01-22T10:30:00Z' },
      { _id: '507f1f77bcf86cd799439012', sensor_id: 'press_001', value: 14.7, timestamp: '2024-01-22T10:30:00Z' }
    ]
  };

  return {
    success: true,
    data: mockResults[databaseType as keyof typeof mockResults] || [],
    query_executed: query,
    rows_affected: mockResults[databaseType as keyof typeof mockResults]?.length || 0
  };
}

async function syncExternalData(supabaseClient: any, databaseType: string, config: any) {
  // Mock data synchronization
  const syncResults = {
    tickets_synced: 15,
    sites_updated: 3,
    equipment_records: 45,
    last_sync: new Date().toISOString()
  };

  // Update integration status in Supabase
  await supabaseClient
    .from('integrations')
    .update({
      last_sync: new Date().toISOString(),
      status: 'connected'
    })
    .eq('type', 'database')
    .eq('config->database_type', databaseType);

  return {
    success: true,
    message: `Successfully synced data from ${databaseType}`,
    details: syncResults
  };
}

async function testDatabaseConnection(databaseType: string, config: any) {
  // Mock connection test for different database types
  try {
    // Simulate connection delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const connectionResults = {
      'mysql': { connected: true, version: '8.0.28', response_time: '45ms' },
      'postgresql': { connected: true, version: '14.5', response_time: '32ms' },
      'mongodb': { connected: true, version: '5.0.9', response_time: '28ms' },
      'oracle': { connected: true, version: '19c', response_time: '67ms' },
      'sqlserver': { connected: true, version: '2019', response_time: '52ms' }
    };

    return connectionResults[databaseType as keyof typeof connectionResults] || {
      connected: false,
      error: 'Unsupported database type'
    };

  } catch (error) {
    return {
      connected: false,
      error: error.message,
      response_time: 'timeout'
    };
  }
}