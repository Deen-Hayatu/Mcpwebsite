import { apiRequest } from "./queryClient";
import type { Program } from "./types";

export const getPrograms = async (): Promise<Program[]> => {
  const response = await apiRequest("GET", "/api/programs");
  return response.json();
};

export const getProgram = async (id: number): Promise<Program> => {
  const response = await apiRequest("GET", `/api/programs/${id}`);
  return response.json();
};