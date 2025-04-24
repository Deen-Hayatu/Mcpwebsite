import { apiRequest } from "./queryClient";

export interface Program {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export async function getPrograms(): Promise<Program[]> {
  try {
    const response = await apiRequest("GET", "/api/programs");
    return await response.json();
  } catch (error) {
    console.error("Error fetching programs:", error);
    return [];
  }
}

export async function getProgram(id: number): Promise<Program | null> {
  try {
    const response = await apiRequest("GET", `/api/programs/${id}`);
    return await response.json();
  } catch (error) {
    console.error(`Error fetching program with id ${id}:`, error);
    return null;
  }
}