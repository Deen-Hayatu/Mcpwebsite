import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { StaffGrid, StaffForm } from "@/components/staff";
import PageHeader from "@/components/layout/PageHeader";
import PageContainer from "@/components/layout/PageContainer";
import { fetchStaffMembers, deleteStaffMember } from "@/lib/staffService";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { StaffMember } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function Staff() {
  const { user } = useAuth() || { user: null };
  const isAdmin = user?.isAdmin || false;
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: staffMembers, isLoading, error } = useQuery({
    queryKey: ['/api/staff'],
    queryFn: fetchStaffMembers
  });

  // Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  
  // Delete confirmation dialog state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingStaffId, setDeletingStaffId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleAddNew = () => {
    setEditingStaff(null);
    setIsFormOpen(true);
  };

  const handleEdit = (staff: StaffMember) => {
    setEditingStaff(staff);
    setIsFormOpen(true);
  };

  const handleDeleteConfirm = (id: number) => {
    setDeletingStaffId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingStaff(null);
    // Refresh the staff list after form closes
    queryClient.invalidateQueries({ queryKey: ['/api/staff'] });
  };

  const performDelete = async () => {
    if (deletingStaffId === null) return;
    
    setIsDeleting(true);
    try {
      await deleteStaffMember(deletingStaffId);
      
      // Refresh the staff list
      queryClient.invalidateQueries({ queryKey: ['/api/staff'] });
      
      toast({
        title: "Staff member deleted",
        description: "The staff member has been removed successfully."
      });
    } catch (error) {
      console.error('Error deleting staff member:', error);
      toast({
        title: "Deletion failed",
        description: "There was an error deleting the staff member.",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setDeletingStaffId(null);
    }
  };

  return (
    <PageContainer withLandmarkMotifs>
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
            onClick={() => queryClient.invalidateQueries({ queryKey: ['/api/staff'] })}
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
          onDelete={handleDeleteConfirm}
        />
      )}

      {/* Staff Form */}
      {isFormOpen && (
        <StaffForm 
          isOpen={isFormOpen}
          onClose={handleFormClose}
          staffMember={editingStaff}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the staff member
              and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={performDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageContainer>
  );
}