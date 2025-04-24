import { queryClient } from "./queryClient";

export interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  imageUrl?: string;
  capacity?: number;
  registrationDeadline?: string;
  tags: string[];
  [key: string]: any;
}

// Fetch all events
export async function getEvents(): Promise<Event[]> {
  const response = await fetch("/api/events");
  
  if (!response.ok) {
    throw new Error("Failed to fetch events");
  }
  
  return response.json();
}

// Fetch a specific event by ID
export async function getEvent(id: number): Promise<Event> {
  const response = await fetch(`/api/events/${id}`);
  
  if (!response.ok) {
    throw new Error("Failed to fetch event");
  }
  
  return response.json();
}

// Invalidate events cache
export function invalidateEventsCache() {
  queryClient.invalidateQueries({ queryKey: ["/api/events"] });
}