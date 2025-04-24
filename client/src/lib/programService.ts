import { queryClient } from "./queryClient";

export interface Program {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate?: string;
  location: string;
  imageUrl?: string;
  tags: string[];
  [key: string]: any;
}

// Fetch all programs
export async function getPrograms(): Promise<Program[]> {
  const response = await fetch("/api/programs");
  
  if (!response.ok) {
    throw new Error("Failed to fetch programs");
  }
  
  return response.json();
}

// Fetch a specific program by ID
export async function getProgram(id: number): Promise<Program> {
  const response = await fetch(`/api/programs/${id}`);
  
  if (!response.ok) {
    throw new Error("Failed to fetch program");
  }
  
  return response.json();
}

// Invalidate programs cache
export function invalidateProgramsCache() {
  queryClient.invalidateQueries({ queryKey: ["/api/programs"] });
}