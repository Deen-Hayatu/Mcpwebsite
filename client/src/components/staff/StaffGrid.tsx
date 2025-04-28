import React from 'react';
import StaffCard from './StaffCard';
import { StaffMember } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';

interface StaffGridProps {
  staff: StaffMember[];
  isAdmin?: boolean;
  onAddNew?: () => void;
  onEdit?: (staff: StaffMember) => void;
  onDelete?: (id: number) => void;
}

const StaffGrid: React.FC<StaffGridProps> = ({
  staff,
  isAdmin = false,
  onAddNew,
  onEdit,
  onDelete,
}) => {
  // Sort by sortOrder if available, otherwise default to alphabetical
  const sortedStaff = [...staff].sort((a, b) => {
    // First sort by sortOrder (if both have it)
    if (a.sortOrder !== undefined && b.sortOrder !== undefined) {
      return a.sortOrder - b.sortOrder;
    }
    // If only one has sortOrder, prioritize it
    if (a.sortOrder !== undefined) return -1;
    if (b.sortOrder !== undefined) return 1;
    
    // Fallback to alphabetical by name
    return a.name.localeCompare(b.name);
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6 relative z-10">
        <div>
          <p className="text-muted-foreground">Displaying {staff.length} team members</p>
        </div>

        {isAdmin && onAddNew && (
          <Button onClick={onAddNew}>
            <PlusIcon className="h-4 w-4 mr-2" />
            Add New
          </Button>
        )}
      </div>

      {sortedStaff.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center relative z-10">
          <p className="text-muted-foreground mb-4">No team members found</p>
          {isAdmin && onAddNew && (
            <Button onClick={onAddNew}>
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Staff Member
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 relative z-10">
          {sortedStaff.map((member) => (
            <StaffCard
              key={member.id}
              staff={member}
              isAdmin={isAdmin}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default StaffGrid;