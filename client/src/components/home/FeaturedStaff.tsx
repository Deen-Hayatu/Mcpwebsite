import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { getFeaturedStaffMembers } from "@/lib/staffService";
import { StaffCard } from "@/components/staff";
import { ChevronRight } from "lucide-react";

export default function FeaturedStaff() {
  // Fetch featured staff members
  const { data: featuredStaff = [], isLoading, error } = useQuery({
    queryKey: ["/api/staff/featured"],
    queryFn: getFeaturedStaffMembers,
  });
  
  // Don't show the section if there are no featured staff members
  if (featuredStaff.length === 0 || error) {
    return null;
  }
  
  return (
    <section className="py-12 bg-secondary/5">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold">Our Leadership</h2>
            <p className="text-muted-foreground mt-2">
              Meet the experts leading our initiatives
            </p>
          </div>
          
          <Button variant="outline" size="sm" asChild className="mt-4 md:mt-0">
            <Link to="/staff" className="flex items-center">
              View All Team Members
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
        
        {isLoading ? (
          <div className="w-full flex justify-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredStaff.slice(0, 3).map((staff) => (
              <StaffCard key={staff.id} staff={staff} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}