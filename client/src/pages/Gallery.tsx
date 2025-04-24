import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getGalleryImages, getGalleryImagesByCategory } from "@/lib/galleryService";
import type { GalleryImage } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Spinner } from "@/components/ui/spinner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Link } from "wouter";
import { GalleryUploadForm } from "@/components/gallery/GalleryUploadForm";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";

export default function Gallery() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("all");
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

  // Fetch all gallery images
  const { 
    data: allImages, 
    isLoading: isLoadingAll,
    error: allError,
    refetch: refetchAll
  } = useQuery({
    queryKey: ["/api/gallery"],
    queryFn: getGalleryImages,
  });

  // Fetch program images
  const { 
    data: programImages, 
    isLoading: isLoadingProgram,
    error: programError,
    refetch: refetchProgram
  } = useQuery({
    queryKey: ["/api/gallery/category", "program"],
    queryFn: () => getGalleryImagesByCategory("program"),
    enabled: activeTab === "programs",
  });

  // Fetch event images
  const { 
    data: eventImages, 
    isLoading: isLoadingEvent,
    error: eventError,
    refetch: refetchEvent
  } = useQuery({
    queryKey: ["/api/gallery/category", "event"],
    queryFn: () => getGalleryImagesByCategory("event"),
    enabled: activeTab === "events",
  });

  // Fetch campus tour images
  const { 
    data: campusTourImages, 
    isLoading: isLoadingCampusTour,
    error: campusTourError,
    refetch: refetchCampusTour
  } = useQuery({
    queryKey: ["/api/gallery/category", "campus_tour"],
    queryFn: () => getGalleryImagesByCategory("campus_tour"),
    enabled: activeTab === "campus_tour",
  });

  // Handle errors
  useEffect(() => {
    if (allError) {
      toast({
        title: "Error",
        description: "Failed to load gallery images.",
        variant: "destructive",
      });
    }
  }, [allError, toast]);

  // Determine which images to display based on active tab
  const getActiveImages = (): GalleryImage[] | undefined => {
    switch (activeTab) {
      case "programs":
        return programImages;
      case "events":
        return eventImages;
      case "campus_tour":
        return campusTourImages;
      default:
        return allImages;
    }
  };

  const isLoading = 
    (activeTab === "all" && isLoadingAll) ||
    (activeTab === "programs" && isLoadingProgram) ||
    (activeTab === "events" && isLoadingEvent) ||
    (activeTab === "campus_tour" && isLoadingCampusTour);

  const handleUploadSuccess = () => {
    // Close the dialog
    setIsUploadDialogOpen(false);
    
    // Refetch images based on active tab
    refetchAll();
    if (activeTab === "programs") refetchProgram();
    if (activeTab === "events") refetchEvent();
    if (activeTab === "campus_tour") refetchCampusTour();
    
    // Show success toast
    toast({
      title: "Success",
      description: "Image uploaded successfully.",
    });
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-primary">MPC Gallery</h1>
        
        <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button>Upload Image</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Upload New Image</DialogTitle>
            </DialogHeader>
            <GalleryUploadForm onSuccess={handleUploadSuccess} currentCategory={activeTab === "all" ? undefined : activeTab} />
          </DialogContent>
        </Dialog>
      </div>
      
      <Tabs defaultValue="all" className="w-full" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="all">All Images</TabsTrigger>
          <TabsTrigger value="programs">Programs</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="campus_tour">Campus Tour</TabsTrigger>
        </TabsList>
        
        <div className="mt-4">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Spinner size="lg" />
            </div>
          ) : (
            <GalleryGrid images={getActiveImages() || []} />
          )}
        </div>
      </Tabs>
    </div>
  );
}