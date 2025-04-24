import { apiRequest, queryClient } from "@/lib/queryClient";
import { StaffMember } from "@/lib/types";

const BASE_URL = "/api/staff";

// Get all staff members
export const fetchStaffMembers = async (): Promise<StaffMember[]> => {
  const response = await apiRequest("GET", BASE_URL);
  const data = await response.json();
  return data.staff;
};

// Get featured staff members
export const fetchFeaturedStaffMembers = async (): Promise<StaffMember[]> => {
  const response = await apiRequest("GET", `${BASE_URL}/featured`);
  const data = await response.json();
  return data.staff;
};

// Get a single staff member by ID
export const fetchStaffMember = async (id: number): Promise<StaffMember> => {
  const response = await apiRequest("GET", `${BASE_URL}/${id}`);
  const data = await response.json();
  return data.member;
};

// Create a new staff member
export const createStaffMember = async (staffData: Omit<StaffMember, "id" | "createdAt" | "updatedAt">): Promise<StaffMember> => {
  const response = await apiRequest("POST", BASE_URL, staffData);
  const data = await response.json();
  
  // Invalidate the staff query to refresh the data
  queryClient.invalidateQueries({ queryKey: [BASE_URL] });
  
  return data.member;
};

// Update an existing staff member
export const updateStaffMember = async (
  id: number, 
  staffData: Partial<Omit<StaffMember, "id" | "createdAt" | "updatedAt">>
): Promise<StaffMember> => {
  const response = await apiRequest("PATCH", `${BASE_URL}/${id}`, staffData);
  const data = await response.json();
  
  // Invalidate both the list and individual staff queries
  queryClient.invalidateQueries({ queryKey: [BASE_URL] });
  queryClient.invalidateQueries({ queryKey: [`${BASE_URL}/${id}`] });
  
  return data.member;
};

// Delete a staff member
export const deleteStaffMember = async (id: number): Promise<boolean> => {
  const response = await apiRequest("DELETE", `${BASE_URL}/${id}`);
  const data = await response.json();
  
  // Invalidate the staff query to refresh the data
  queryClient.invalidateQueries({ queryKey: [BASE_URL] });
  
  return data.success;
};