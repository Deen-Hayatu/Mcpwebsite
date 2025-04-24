import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { UserPlus, Search, Users, Award } from "lucide-react";
import { getStaffMembers, deleteStaffMember } from "@/lib/staffService";
import StaffCard from "./StaffCard";
import StaffForm from "./StaffForm";
import { useToast } from "@/hooks/use-toast";
import type { StaffMember } from "@shared/schema";

type StaffGridProps = {
  isAdmin?: boolean;
  featuredOnly?: boolean;
};

export default function StaffGrid({ isAdmin = false, featuredOnly = false }: StaffGridProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"all" | "featured">(featuredOnly ? "featured" : "all");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | undefined>(undefined);
  
  // Fetch staff members
  const { data: staffMembers = [], isLoading, error } = useQuery({
    queryKey: ["/api/staff"],
    queryFn: getStaffMembers,
  });
  
  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteStaffMember,
    onSuccess: () => {
      toast({
        title: "Staff member deleted",
        description: "The staff member has been deleted successfully.",
        duration: 3000,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/staff"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: (error as Error).message || "Failed to delete staff member.",
        variant: "destructive",
        duration: 5000,
      });
    },
  });
  
  // Filter staff members
  const filteredStaff = staffMembers.filter(staff => {
    const matchesSearch = searchTerm === "" || 
      staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (staff.expertise && staff.expertise.some(e => e.toLowerCase().includes(searchTerm.toLowerCase())));
    
    const matchesTab = viewMode === "all" || (viewMode === "featured" && staff.isFeatured);
    
    return matchesSearch && matchesTab;
  });
  
  // Handle form success
  const handleFormSuccess = () => {
    setShowAddDialog(false);
    setEditingStaff(undefined);
    queryClient.invalidateQueries({ queryKey: ["/api/staff"] });
  };
  
  // Handle edit
  const handleEdit = (staff: StaffMember) => {
    setEditingStaff(staff);
    setShowAddDialog(true);
  };
  
  // Handle delete
  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };
  
  if (isLoading) {
    return (
      <div className="w-full flex justify-center py-12">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="w-full p-6 text-center">
        <p className="text-destructive">Error loading staff members. Please try again later.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-2">
          <Tabs 
            defaultValue={featuredOnly ? "featured" : "all"} 
            value={viewMode}
            onValueChange={(value) => setViewMode(value as "all" | "featured")}
            className="w-[400px]"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="all" className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>All Staff</span>
              </TabsTrigger>
              <TabsTrigger value="featured" className="flex items-center gap-1">
                <Award className="h-4 w-4" />
                <span>Featured</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search staff..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {isAdmin && (
            <Button 
              onClick={() => {
                setEditingStaff(undefined);
                setShowAddDialog(true);
              }}
              className="whitespace-nowrap"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Add Staff
            </Button>
          )}
        </div>
      </div>
      
      {filteredStaff.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStaff.map((staff) => (
            <StaffCard 
              key={staff.id} 
              staff={staff} 
              isAdmin={isAdmin}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="text-center p-12 border rounded-md bg-muted/10">
          <p>
            {searchTerm 
              ? `No staff members found matching "${searchTerm}"`
              : viewMode === "featured" 
                ? "No featured staff members available yet"
                : "No staff members available yet"
            }
          </p>
        </div>
      )}
      
      {/* Add/Edit Staff Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingStaff ? `Edit ${editingStaff.name}` : "Add New Staff Member"}
            </DialogTitle>
          </DialogHeader>
          <StaffForm 
            staff={editingStaff} 
            onSuccess={handleFormSuccess}
            onCancel={() => {
              setShowAddDialog(false);
              setEditingStaff(undefined);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}