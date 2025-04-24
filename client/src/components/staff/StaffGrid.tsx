import React from "react";
import StaffCard from "./StaffCard";
import { StaffMember } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

interface StaffGridProps {
  staff: StaffMember[];
  isAdmin?: boolean;
  onAddNew?: () => void;
  onEdit?: (staff: StaffMember) => void;
  onDelete?: (id: number) => void;
  featuredOnly?: boolean;
}

export default function StaffGrid({ 
  staff, 
  isAdmin = false,
  onAddNew,
  onEdit,
  onDelete,
  featuredOnly = false
}: StaffGridProps) {
  // Filter staff if featuredOnly is true
  const displayedStaff = featuredOnly 
    ? staff.filter(member => member.isFeatured)
    : staff;
  
  // Sort staff by sortOrder if available
  const sortedStaff = [...displayedStaff].sort((a, b) => {
    if (a.sortOrder !== null && b.sortOrder !== null) {
      return a.sortOrder - b.sortOrder;
    }
    if (a.sortOrder !== null) return -1;
    if (b.sortOrder !== null) return 1;
    return 0;
  });

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedStaff.map((member) => (
          <StaffCard 
            key={member.id} 
            staff={member}
            isAdmin={isAdmin}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
        
        {/* Add new staff button for admins */}
        {isAdmin && onAddNew && (
          <div className="flex items-center justify-center h-full min-h-[300px]">
            <Button 
              onClick={onAddNew}
              variant="outline" 
              className="flex flex-col gap-3 h-auto py-6 px-8 border-dashed"
            >
              <UserPlus className="h-8 w-8 text-muted-foreground" />
              <span>Add Team Member</span>
            </Button>
          </div>
        )}
      </div>
      
      {/* Empty state */}
      {sortedStaff.length === 0 && !isAdmin && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No team members found.</p>
        </div>
      )}
    </div>
  );
}