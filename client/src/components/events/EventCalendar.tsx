import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { Event } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { Calendar as CalendarIcon, MapPin, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { AddToCalendar } from './AddToCalendar';

interface EventCalendarProps {
  className?: string;
  onEventSelect?: (event: Event) => void;
}

export function EventCalendar({ className, onEventSelect }: EventCalendarProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [expandedEvent, setExpandedEvent] = useState<number | null>(null);
  const isMobile = useIsMobile();

  const { data: events = [], isLoading } = useQuery({
    queryKey: ['/api/events'],
    select: (data: Event[]) => {
      // Sort events by date
      return [...data].sort((a, b) => {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      });
    }
  });

  // Get events for the selected date
  const selectedDateEvents = date 
    ? events.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate.getDate() === date.getDate() &&
               eventDate.getMonth() === date.getMonth() &&
               eventDate.getFullYear() === date.getFullYear();
      })
    : [];

  // Get upcoming events (regardless of selected date)
  const upcomingEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    const today = new Date();
    
    // Clear time component for accurate date comparison
    today.setHours(0, 0, 0, 0);
    
    return eventDate >= today;
  }).slice(0, 5); // Get only the next 5 upcoming events

  // Calendar date renderer with event indicators
  function renderCalendarDate(day: Date) {
    // Check if this date has any events
    const hasEvents = events.some(event => {
      const eventDate = new Date(event.date);
      return eventDate.getDate() === day.getDate() &&
             eventDate.getMonth() === day.getMonth() &&
             eventDate.getFullYear() === day.getFullYear();
    });

    return hasEvents ? (
      <div className="relative">
        {day.getDate()}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
      </div>
    ) : day.getDate();
  }

  function toggleExpandEvent(eventId: number) {
    if (expandedEvent === eventId) {
      setExpandedEvent(null);
    } else {
      setExpandedEvent(eventId);
    }
  }

  function handleRegister(event: Event) {
    if (onEventSelect) {
      onEventSelect(event);
    }
  }

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-3 gap-4", className)}>
      {/* Calendar */}
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle>Event Calendar</CardTitle>
          <CardDescription>
            Browse our upcoming events
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Calendar 
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border w-full"
          />
        </CardContent>
      </Card>

      {/* Selected date events or upcoming events */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>
            {date && selectedDateEvents.length > 0 
              ? `Events on ${format(date, 'MMMM d, yyyy')}` 
              : 'Upcoming Events'}
          </CardTitle>
          <CardDescription>
            {selectedDateEvents.length > 0 
              ? `${selectedDateEvents.length} event${selectedDateEvents.length !== 1 ? 's' : ''} scheduled` 
              : date ? 'No events on selected date' : 'Register to secure your spot'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              </div>
            ) : selectedDateEvents.length > 0 ? (
              selectedDateEvents.map(event => (
                <EventCard 
                  key={event.id}
                  event={event}
                  isExpanded={expandedEvent === event.id}
                  onToggleExpand={() => toggleExpandEvent(event.id)}
                  onRegister={() => handleRegister(event)}
                />
              ))
            ) : (
              upcomingEvents.map(event => (
                <EventCard 
                  key={event.id}
                  event={event}
                  isExpanded={expandedEvent === event.id}
                  onToggleExpand={() => toggleExpandEvent(event.id)}
                  onRegister={() => handleRegister(event)}
                />
              ))
            )}

            {!isLoading && upcomingEvents.length === 0 && selectedDateEvents.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No upcoming events scheduled. Please check back later.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface EventCardProps {
  event: Event;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onRegister: () => void;
}

function EventCard({ event, isExpanded, onToggleExpand, onRegister }: EventCardProps) {
  const eventDate = new Date(event.date);
  const isUpcoming = eventDate >= new Date();

  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-200",
      isExpanded ? "shadow-md" : "shadow-sm"
    )}>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg">{event.title}</h3>
            <div className="flex items-center mt-1 text-sm text-muted-foreground">
              <CalendarIcon className="h-3.5 w-3.5 mr-1" />
              <span>{format(eventDate, 'MMMM d, yyyy')}</span>
            </div>
          </div>

          <Badge variant={isUpcoming ? "default" : "outline"}>
            {isUpcoming ? "Upcoming" : "Past"}
          </Badge>
        </div>
        
        <div className="flex items-center mt-2 text-sm text-muted-foreground">
          <Clock className="h-3.5 w-3.5 mr-1" />
          <span>{event.time}</span>
          <MapPin className="h-3.5 w-3.5 ml-3 mr-1" />
          <span>{event.location}</span>
        </div>

        <div className="mt-2">
          <button 
            onClick={onToggleExpand}
            className="text-sm flex items-center text-primary hover:underline"
          >
            {isExpanded ? (
              <>Show Less <ChevronUp className="w-4 h-4 ml-1" /></>
            ) : (
              <>Show More <ChevronDown className="w-4 h-4 ml-1" /></>
            )}
          </button>
        </div>

        {isExpanded && (
          <div className="mt-3 text-sm">
            <p className="mt-2">{event.description}</p>
            
            {isUpcoming && (
              <div className="mt-4 flex flex-wrap gap-2">
                <Button 
                  variant="default" 
                  size="sm" 
                  onClick={onRegister}
                  className="w-full sm:w-auto"
                >
                  Register for this Event
                </Button>
                <AddToCalendar 
                  event={event}
                  variant="outline"
                  size="sm"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}