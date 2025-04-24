import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { Event } from '@/lib/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';

interface AddToCalendarProps {
  event: Event;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

export function AddToCalendar({ event, variant = 'outline', size = 'default', className }: AddToCalendarProps) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  // Function to generate Google Calendar URL
  const generateGoogleCalendarUrl = () => {
    const eventDate = new Date(event.date);
    
    // Calculate end time (assuming events last 2 hours if not specified)
    let startDateTime = new Date(eventDate);
    const timeParts = event.time.split(' - ')[0]; // Get start time
    const timeMatch = timeParts.match(/(\d+):(\d+)\s*([AP]M)/i);
    
    if (timeMatch) {
      let hours = parseInt(timeMatch[1]);
      const minutes = parseInt(timeMatch[2]);
      const ampm = timeMatch[3].toUpperCase();
      
      if (ampm === 'PM' && hours < 12) hours += 12;
      if (ampm === 'AM' && hours === 12) hours = 0;
      
      startDateTime.setHours(hours, minutes, 0, 0);
    }
    
    // End time is 2 hours after start
    let endDateTime = new Date(startDateTime);
    endDateTime.setHours(endDateTime.getHours() + 2);
    
    // Format dates for URL
    const formatDate = (date: Date) => {
      return date.toISOString().replace(/-|:|\.\d+/g, '');
    };
    
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: event.title,
      dates: `${formatDate(startDateTime)}/${formatDate(endDateTime)}`,
      details: event.description,
      location: event.location,
    });
    
    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  };
  
  // Function to generate iCal/Apple Calendar file content
  const generateIcsFileContent = () => {
    const eventDate = new Date(event.date);
    
    // Calculate start and end times
    let startDateTime = new Date(eventDate);
    const timeParts = event.time.split(' - ')[0]; // Get start time
    const timeMatch = timeParts.match(/(\d+):(\d+)\s*([AP]M)/i);
    
    if (timeMatch) {
      let hours = parseInt(timeMatch[1]);
      const minutes = parseInt(timeMatch[2]);
      const ampm = timeMatch[3].toUpperCase();
      
      if (ampm === 'PM' && hours < 12) hours += 12;
      if (ampm === 'AM' && hours === 12) hours = 0;
      
      startDateTime.setHours(hours, minutes, 0, 0);
    }
    
    // End time is 2 hours after start
    let endDateTime = new Date(startDateTime);
    endDateTime.setHours(endDateTime.getHours() + 2);
    
    // Format dates for iCal
    const formatDateForIcs = (date: Date) => {
      return date.toISOString().replace(/-|:|\.\d+/g, '').slice(0, 15) + 'Z';
    };
    
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'BEGIN:VEVENT',
      `SUMMARY:${event.title}`,
      `DTSTART:${formatDateForIcs(startDateTime)}`,
      `DTEND:${formatDateForIcs(endDateTime)}`,
      `DESCRIPTION:${event.description.replace(/\\n/g, '\\n')}`,
      `LOCATION:${event.location}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\\n');
    
    return icsContent;
  };
  
  // Function to generate Outlook Calendar URL
  const generateOutlookCalendarUrl = () => {
    const eventDate = new Date(event.date);
    
    // Calculate start and end times (same as Google Calendar)
    let startDateTime = new Date(eventDate);
    const timeParts = event.time.split(' - ')[0]; // Get start time
    const timeMatch = timeParts.match(/(\d+):(\d+)\s*([AP]M)/i);
    
    if (timeMatch) {
      let hours = parseInt(timeMatch[1]);
      const minutes = parseInt(timeMatch[2]);
      const ampm = timeMatch[3].toUpperCase();
      
      if (ampm === 'PM' && hours < 12) hours += 12;
      if (ampm === 'AM' && hours === 12) hours = 0;
      
      startDateTime.setHours(hours, minutes, 0, 0);
    }
    
    // End time is 2 hours after start
    let endDateTime = new Date(startDateTime);
    endDateTime.setHours(endDateTime.getHours() + 2);
    
    // Format dates for URL
    const formatDate = (date: Date) => {
      return date.toISOString().replace(/-|:|\.\d+/g, '');
    };
    
    const params = new URLSearchParams({
      path: '/calendar/action/compose',
      rru: 'addevent',
      subject: event.title,
      startdt: formatDate(startDateTime),
      enddt: formatDate(endDateTime),
      body: event.description,
      location: event.location,
    });
    
    return `https://outlook.office.com/calendar/0/deeplink/compose?${params.toString()}`;
  };
  
  // Function to download ICS file
  const downloadIcsFile = () => {
    const icsContent = generateIcsFileContent();
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${event.title.replace(/\s+/g, '_')}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Calendar Event Downloaded",
      description: `${event.title} has been downloaded as an ICS file.`,
    });
    
    setIsOpen(false);
  };
  
  // Function to open Google Calendar
  const openGoogleCalendar = () => {
    window.open(generateGoogleCalendarUrl(), '_blank');
    setIsOpen(false);
  };
  
  // Function to open Outlook Calendar
  const openOutlookCalendar = () => {
    window.open(generateOutlookCalendarUrl(), '_blank');
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} className={className}>
          Add to Calendar
          <CalendarIcon className="h-4 w-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem className="cursor-pointer" onClick={openGoogleCalendar}>
          Google Calendar
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" onClick={downloadIcsFile}>
          Apple Calendar / iCal
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" onClick={openOutlookCalendar}>
          Outlook
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}