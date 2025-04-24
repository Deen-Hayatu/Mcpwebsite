import { apiRequest } from "./queryClient";
import type { GalleryImage } from "./types";

export const getGalleryImages = async (): Promise<GalleryImage[]> => {
  const response = await apiRequest("GET", "/api/gallery");
  return response.json();
};

export const getGalleryImagesByCategory = async (category: string): Promise<GalleryImage[]> => {
  const response = await apiRequest("GET", `/api/gallery/category/${encodeURIComponent(category)}`);
  return response.json();
};

export const getGalleryImagesByProgram = async (programId: number): Promise<GalleryImage[]> => {
  const response = await apiRequest("GET", `/api/gallery/program/${programId}`);
  return response.json();
};

export const getGalleryImagesByEvent = async (eventId: number): Promise<GalleryImage[]> => {
  const response = await apiRequest("GET", `/api/gallery/event/${eventId}`);
  return response.json();
};

export const getGalleryImage = async (id: number): Promise<GalleryImage> => {
  const response = await apiRequest("GET", `/api/gallery/${id}`);
  return response.json();
};

export interface CreateGalleryImageData {
  title: string;
  description?: string;
  imageUrl: string;
  category: string;
  programId?: number;
  eventId?: number;
  uploadedBy: string;
  uploadedByEmail: string;
  isPublic?: boolean;
  tags?: string[];
}

export const createGalleryImage = async (data: CreateGalleryImageData): Promise<GalleryImage> => {
  const response = await apiRequest("POST", "/api/gallery", data);
  const result = await response.json();
  return result.image;
};

export const updateGalleryImage = async (id: number, data: Partial<CreateGalleryImageData>): Promise<GalleryImage> => {
  const response = await apiRequest("PATCH", `/api/gallery/${id}`, data);
  const result = await response.json();
  return result.image;
};

export const deleteGalleryImage = async (id: number): Promise<boolean> => {
  const response = await apiRequest("DELETE", `/api/gallery/${id}`);
  const result = await response.json();
  return result.success;
};