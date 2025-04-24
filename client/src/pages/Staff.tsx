import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { StaffGrid } from "@/components/staff";
import PageHeader from "@/components/layout/PageHeader";
import PageContainer from "@/components/layout/PageContainer";
import { fetchStaffMembers } from "@/lib/staffService";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { StaffMember } from "@/lib/types";

export default function Staff() {
  const { user } = useAuth() || { user: null };
  const isAdmin = user?.isAdmin || false;
  
  const { data: staffMembers, isLoading, error } = useQuery({
    queryKey: ['/api/staff'],
    queryFn: fetchStaffMembers
  });

  // For when we implement the staff form later
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);

  const handleAddNew = () => {
    setEditingStaff(null);
    setIsFormOpen(true);
  };

  const handleEdit = (staff: StaffMember) => {
    setEditingStaff(staff);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: number) => {
    // We'll implement deletion functionality later
    console.log("Delete staff with ID:", id);
  };

  return (
    <PageContainer>
      <PageHeader 
        title="Our Team" 
        description="Meet the dedicated team at Movement for Positive Change driving positive impact across Ghana and beyond."
      />

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-destructive">Failed to load team members.</p>
          <Button 
            variant="outline" 
            className="mt-4" 
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </div>
      ) : (
        <StaffGrid 
          staff={staffMembers || []} 
          isAdmin={isAdmin}
          onAddNew={handleAddNew}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {/* We'll add the StaffForm component in the future for adding/editing staff */}
      {isFormOpen && (
        <div>Form will go here</div>
      )}
    </PageContainer>
  );
}