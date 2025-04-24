import { apiRequest } from "./queryClient";
import type { Event } from "./types";

export const getEvents = async (): Promise<Event[]> => {
  const response = await apiRequest("GET", "/api/events");
  return response.json();
};

export const getEvent = async (id: number): Promise<Event> => {
  const response = await apiRequest("GET", `/api/events/${id}`);
  return response.json();
};