import { apiRequest } from "./queryClient";
import type { StaffMember, InsertStaffMember } from "@shared/schema";

/**
 * Fetches all staff members from the API
 */
export const getStaffMembers = async (): Promise<StaffMember[]> => {
  const response = await apiRequest("GET", "/api/staff");
  return response.json();
};

/**
 * Fetches featured staff members from the API
 */
export const getFeaturedStaffMembers = async (): Promise<StaffMember[]> => {
  const response = await apiRequest("GET", "/api/staff/featured");
  return response.json();
};

/**
 * Fetches a single staff member by ID
 */
export const getStaffMember = async (id: number): Promise<StaffMember> => {
  const response = await apiRequest("GET", `/api/staff/${id}`);
  return response.json();
};

/**
 * Creates a new staff member (admin only)
 */
export const createStaffMember = async (data: InsertStaffMember): Promise<StaffMember> => {
  const response = await apiRequest("POST", "/api/staff", data);
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || "Failed to create staff member");
  }
  return result.member;
};

/**
 * Updates an existing staff member (admin only)
 */
export const updateStaffMember = async (id: number, data: Partial<InsertStaffMember>): Promise<StaffMember> => {
  const response = await apiRequest("PATCH", `/api/staff/${id}`, data);
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || "Failed to update staff member");
  }
  return result.member;
};

/**
 * Deletes a staff member (admin only)
 */
export const deleteStaffMember = async (id: number): Promise<void> => {
  const response = await apiRequest("DELETE", `/api/staff/${id}`);
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || "Failed to delete staff member");
  }
};