import { apiRequest } from "./queryClient";

export interface Event {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  category: string;
  capacity: number;
  registrationDeadline: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export async function getEvents(): Promise<Event[]> {
  try {
    const response = await apiRequest("GET", "/api/events");
    return await response.json();
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
}

export async function getEvent(id: number): Promise<Event | null> {
  try {
    const response = await apiRequest("GET", `/api/events/${id}`);
    return await response.json();
  } catch (error) {
    console.error(`Error fetching event with id ${id}:`, error);
    return null;
  }
}