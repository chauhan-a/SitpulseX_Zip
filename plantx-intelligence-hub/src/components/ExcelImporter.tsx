import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { pb } from '@/integrations/pocketbase/client';
import { Upload, FileSpreadsheet, Link } from 'lucide-react';

export const ExcelImporter = () => {
  const [isImporting, setIsImporting] = useState(false);
  const [googleSheetUrl, setGoogleSheetUrl] = useState('https://docs.google.com/spreadsheets/d/e/2PACX-1vQ9Q2MzE4usWbIf6IzxKLssnsHFuDp769gjel_8Z5QPRM45dm7IL85xBFdHG9EH2zASpnKSv1yLxH94/pubhtml?gid=0&single=true');
  const { toast } = useToast();

  // Auto-import the provided Google Sheet on component mount
  useEffect(() => {
    if (googleSheetUrl && googleSheetUrl.includes('2PACX-1vQ9Q2MzE4usWbIf6IzxKLssnsHFuDp769gjel_8Z5QPRM45dm7IL85xBFdHG9EH2zASpnKSv1yLxH94')) {
      handleGoogleSheetImport();
    }
  }, []);

  const handleGoogleSheetImport = async () => {
    if (!googleSheetUrl.trim()) {
      toast({
        title: "Error",
        description: "Please enter a Google Sheet URL",
        variant: "destructive",
      });
      return;
    }

    setIsImporting(true);
    try {
      // Convert Google Sheets pubhtml URL to CSV export URL
      const csvUrl = googleSheetUrl.replace('/pubhtml', '/export').replace('?gid=0&single=true', '?format=csv&gid=0');
      
      // Fetch the CSV data directly
      const response = await fetch(csvUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch Google Sheet data');
      }
      
      const csvData = await response.text();
      const tickets = parseCSVToTickets(csvData);
      
      // Save tickets to PocketBase
      const importedCount = await importTicketsToPocketBase(tickets);

      toast({
        title: "Success",
        description: `Imported ${importedCount} tickets successfully`,
      });
      
      // Refresh the page to show new data
      window.location.reload();
    } catch (error) {
      console.error('Import error:', error);
      toast({
        title: "Error",
        description: `Failed to import data: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    try {
      const fileContent = await fileToText(file);
      const tickets = parseCSVToTickets(fileContent);
      const importedCount = await importTicketsToPocketBase(tickets);

      toast({
        title: "Success",
        description: `Imported ${importedCount} tickets successfully`,
      });
      
      // Refresh the page to show new data
      window.location.reload();
    } catch (error) {
      console.error('Import error:', error);
      toast({
        title: "Error",
        description: "Failed to import Excel file",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  const fileToText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const parseCSVToTickets = (csvData: string) => {
    const lines = csvData.split('\n').filter(line => line.trim());
    if (lines.length < 2) return [];

    const headers = parseCSVLine(lines[0]);
    const tickets = [];

    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i]);
      if (values.length < headers.length) continue;

      const ticket: any = {};
      headers.forEach((header, index) => {
        const normalizedHeader = header.toLowerCase().trim();
        const value = values[index]?.trim() || '';

        switch (normalizedHeader) {
          case 'number':
          case 'ticket number':
          case 'id':
            ticket.servicenow_id = value;
            break;
          case 'short description':
          case 'title':
          case 'description':
            ticket.title = value;
            break;
          case 'state':
          case 'status':
            ticket.status = normalizeStatus(value);
            break;
          case 'priority':
            ticket.priority = normalizePriority(value);
            break;
          case 'assigned to':
          case 'assignee':
            ticket.assigned_to = value;
            break;
          case 'location':
          case 'site':
            ticket.site_id = value;
            break;
          case 'opened':
          case 'created':
          case 'created at':
            if (value) {
              ticket.created_at = parseDate(value);
            }
            break;
          case 'due date':
          case 'due':
            if (value) {
              ticket.due_date = parseDate(value);
            }
            break;
          default:
            if (normalizedHeader.includes('description') && !ticket.description) {
              ticket.description = value;
            }
            break;
        }
      });

      if (ticket.title || ticket.servicenow_id) {
        tickets.push({
          title: ticket.title || 'Untitled Ticket',
          description: ticket.description || '',
          status: ticket.status || 'open',
          priority: ticket.priority || 'medium',
          assigned_to: ticket.assigned_to || '',
          site_id: ticket.site_id || '',
          servicenow_id: ticket.servicenow_id || '',
          due_date: ticket.due_date,
        });
      }
    }

    return tickets;
  };

  const parseCSVLine = (line: string): string[] => {
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
    return result.map(field => field.replace(/^"(.*)"$/, '$1'));
  };

  const normalizeStatus = (status: string): string => {
    const normalized = status.toLowerCase().trim();
    
    // Handle common status variations from Google Sheets "State" column
    if (normalized.includes('new') || normalized.includes('open') || normalized === '1') return 'open';
    if (normalized.includes('progress') || normalized.includes('assigned') || normalized.includes('work') || normalized === '2') return 'in_progress';
    if (normalized.includes('resolved') || normalized.includes('closed') || normalized.includes('complete') || normalized === '3') return 'closed';
    if (normalized.includes('pending') || normalized.includes('hold') || normalized === '4') return 'pending';
    if (normalized.includes('cancelled') || normalized.includes('canceled') || normalized === '5') return 'cancelled';
    
    // Log unrecognized status for debugging
    console.log('Unrecognized status:', status, 'normalized to:', normalized);
    
    return 'open'; // Default fallback
  };

  const normalizePriority = (priority: string): string => {
    const normalized = priority.toLowerCase().trim();
    
    if (normalized.includes('1') || normalized.includes('critical') || normalized.includes('urgent')) return 'critical';
    if (normalized.includes('2') || normalized.includes('high')) return 'high';
    if (normalized.includes('3') || normalized.includes('medium') || normalized.includes('moderate')) return 'medium';
    if (normalized.includes('4') || normalized.includes('low') || normalized.includes('planning')) return 'low';
    
    return 'medium';
  };

  const parseDate = (dateStr: string): string | null => {
    if (!dateStr) return null;
    
    try {
      const date = new Date(dateStr);
      return date.toISOString();
    } catch {
      return null;
    }
  };

  const importTicketsToPocketBase = async (tickets: any[]): Promise<number> => {
    let importedCount = 0;
    
    // Clear existing tickets first to avoid duplicates
    try {
      const existingTickets = await pb.collection('tickets').getFullList();
      for (const ticket of existingTickets) {
        await pb.collection('tickets').delete(ticket.id);
      }
    } catch (error) {
      console.log('No existing tickets to clear or clearing failed:', error);
    }
    
    // Import new tickets
    for (const ticket of tickets) {
      try {
        await pb.collection('tickets').create(ticket);
        importedCount++;
        console.log('Imported ticket:', ticket.title, 'Status:', ticket.status);
      } catch (error) {
        console.error('Error importing ticket:', error, ticket);
      }
    }
    
    return importedCount;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link className="h-5 w-5" />
            Import from Google Sheet
          </CardTitle>
          <CardDescription>
            Enter a Google Sheet URL to import ticket data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="https://docs.google.com/spreadsheets/d/..."
            value={googleSheetUrl}
            onChange={(e) => setGoogleSheetUrl(e.target.value)}
          />
          <Button 
            onClick={handleGoogleSheetImport}
            disabled={isImporting}
            className="w-full"
          >
            {isImporting ? 'Importing...' : 'Import from Google Sheet'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Upload Excel File
          </CardTitle>
          <CardDescription>
            Upload an Excel (.xlsx) or CSV file to import ticket data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-accent/50">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
                <p className="mb-2 text-sm text-muted-foreground">
                  <span className="font-semibold">Click to upload</span> Excel or CSV file
                </p>
              </div>
              <input
                type="file"
                className="hidden"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileUpload}
                disabled={isImporting}
              />
            </label>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};