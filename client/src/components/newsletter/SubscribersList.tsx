import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Subscriber } from '@/lib/types';
import { Loader2, Search, RefreshCw, Download } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const SubscribersList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const { 
    data: subscribers = [], 
    isLoading,
    refetch,
  } = useQuery({ 
    queryKey: ['/api/subscribers'], 
    queryFn: async () => {
      const response = await fetch('/api/subscribers');
      if (!response.ok) throw new Error('Failed to fetch subscribers');
      return response.json() as Promise<Subscriber[]>;
    }
  });
  
  const filteredSubscribers = subscribers.filter(subscriber => 
    subscriber.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (subscriber.name && subscriber.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  const handleExportCSV = () => {
    const headers = ['Email', 'Name', 'Status', 'Date Subscribed'];
    
    const csvContent = [
      headers.join(','),
      ...filteredSubscribers.map(subscriber => {
        const status = subscriber.subscribed ? 'Subscribed' : 'Unsubscribed';
        const date = subscriber.createdAt ? new Date(subscriber.createdAt).toISOString().split('T')[0] : '';
        return [
          `"${subscriber.email}"`,
          `"${subscriber.name || ''}"`,
          `"${status}"`,
          `"${date}"`
        ].join(',');
      })
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `subscribers_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search subscribers..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2 self-end">
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          
          <Button variant="outline" size="sm" onClick={handleExportCSV}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : filteredSubscribers.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <h3 className="text-xl font-medium text-muted-foreground mb-2">No subscribers found</h3>
          {searchQuery ? (
            <p className="text-muted-foreground">Try adjusting your search query</p>
          ) : (
            <p className="text-muted-foreground">You don't have any newsletter subscribers yet</p>
          )}
        </div>
      ) : (
        <>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date Subscribed</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubscribers.map((subscriber) => (
                  <TableRow key={subscriber.id}>
                    <TableCell className="font-medium">{subscriber.email}</TableCell>
                    <TableCell>{subscriber.name || '—'}</TableCell>
                    <TableCell>
                      {subscriber.subscribed ? (
                        <Badge variant="success" className="text-xs bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-800/20 dark:text-green-300 dark:hover:bg-green-800/30">
                          Subscribed
                        </Badge>
                      ) : (
                        <Badge variant="destructive" className="text-xs bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-800/20 dark:text-red-300 dark:hover:bg-red-800/30">
                          Unsubscribed
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {subscriber.createdAt ? (
                        <span title={new Date(subscriber.createdAt).toLocaleString()}>
                          {formatDistanceToNow(new Date(subscriber.createdAt), { addSuffix: true })}
                        </span>
                      ) : (
                        '—'
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          <div className="text-sm text-muted-foreground">
            Showing {filteredSubscribers.length} of {subscribers.length} subscribers
          </div>
        </>
      )}
    </div>
  );
};

export default SubscribersList;