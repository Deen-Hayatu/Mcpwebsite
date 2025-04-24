import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardFooter 
} from "@/components/ui/card";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Trash2, ExternalLink } from "lucide-react";
import type { GalleryImage } from "@/lib/types";

interface GalleryGridProps {
  images: GalleryImage[];
  onDelete?: (id: number) => void;
}

export function GalleryGrid({ images, onDelete }: GalleryGridProps) {
  const [expandedImage, setExpandedImage] = useState<GalleryImage | null>(null);
  const { toast } = useToast();
  
  const deleteImage = async (id: number) => {
    try {
      await apiRequest("DELETE", `/api/gallery/${id}`);
      toast({
        title: "Success",
        description: "Image deleted successfully.",
      });
      if (onDelete) {
        onDelete(id);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete image.",
        variant: "destructive",
      });
    }
  };

  if (images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-muted-foreground mb-2">No images to display</p>
        <p className="text-sm text-muted-foreground">Upload images using the button above to get started</p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {images.map((image) => (
          <Card key={image.id} className="overflow-hidden flex flex-col">
            <div 
              className="h-48 overflow-hidden cursor-pointer relative"
              onClick={() => setExpandedImage(image)}
            >
              <img
                src={image.imageUrl}
                alt={image.title || "Gallery image"}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <CardContent className="flex-grow p-4">
              <h3 className="font-medium mb-1 line-clamp-1">{image.title || "Untitled"}</h3>
              <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                {image.description || "No description provided"}
              </p>
              <div className="flex flex-wrap gap-1 mt-2">
                {typeof image.tags === 'string' ? 
                  image.tags.split(",").map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag.trim()}
                    </Badge>
                  ))
                : Array.isArray(image.tags) ?
                  image.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))
                : null}
              </div>
            </CardContent>
            <CardFooter className="px-4 pb-4 pt-0 flex justify-between items-center">
              <div className="text-xs text-muted-foreground">
                Uploaded by {image.uploadedBy}
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the
                      image from the gallery.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => deleteImage(image.id)}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Modal for expanded image view */}
      {expandedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4"
          onClick={() => setExpandedImage(null)}
        >
          <div 
            className="relative max-w-4xl max-h-[90vh] bg-white rounded-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <img 
                src={expandedImage.imageUrl}
                alt={expandedImage.title || "Gallery image"} 
                className="max-h-[70vh] w-auto mx-auto"
              />
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                onClick={() => window.open(expandedImage.imageUrl, '_blank')}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-6">
              <h2 className="text-xl font-bold mb-2">{expandedImage.title || "Untitled"}</h2>
              <p className="text-muted-foreground mb-4">{expandedImage.description}</p>
              <div className="flex flex-wrap gap-2 mt-4">
                {typeof expandedImage.tags === 'string' ? 
                  expandedImage.tags.split(",").map((tag, index) => (
                    <Badge key={index} variant="outline">
                      {tag.trim()}
                    </Badge>
                  ))
                : Array.isArray(expandedImage.tags) ?
                  expandedImage.tags.map((tag, index) => (
                    <Badge key={index} variant="outline">
                      {tag}
                    </Badge>
                  ))
                : null}
              </div>
              <div className="mt-4 text-sm text-muted-foreground">
                <p>Uploaded by: {expandedImage.uploadedBy}</p>
                <p>Category: {expandedImage.category}</p>
                <p>Uploaded on: {new Date(expandedImage.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="p-4 bg-muted flex justify-end">
              <Button variant="outline" onClick={() => setExpandedImage(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}