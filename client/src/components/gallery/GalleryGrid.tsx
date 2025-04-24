import { useState } from "react";
import type { GalleryImage } from "@/lib/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Eye, Download, Share2 } from "lucide-react";

interface GalleryGridProps {
  images: GalleryImage[];
}

export function GalleryGrid({ images }: GalleryGridProps) {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  if (images.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No images found in this category.</p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "MMMM d, yyyy");
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image) => (
          <Card key={image.id} className="overflow-hidden">
            <div 
              className="h-48 bg-cover bg-center cursor-pointer" 
              style={{ backgroundImage: `url(${image.imageUrl})` }}
              onClick={() => setSelectedImage(image)}
            />
            <CardContent className="p-4">
              <h3 className="font-bold truncate">{image.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2 h-10">
                {image.description || "No description provided."}
              </p>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex justify-between">
              <div className="flex flex-wrap gap-1">
                {image.tags.slice(0, 2).map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {image.tags.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{image.tags.length - 2}
                  </Badge>
                )}
              </div>
              <Button variant="ghost" size="icon" onClick={() => setSelectedImage(image)}>
                <Eye className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Image details dialog */}
      <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>{selectedImage?.title}</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4">
            <div className="relative">
              <img 
                src={selectedImage?.imageUrl} 
                alt={selectedImage?.title} 
                className="w-full h-auto rounded-md"
              />
            </div>
            
            <div className="space-y-2">
              <p className="text-sm">{selectedImage?.description}</p>
              
              <div className="flex flex-wrap gap-1">
                {selectedImage?.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              
              <div className="pt-2 text-sm text-muted-foreground">
                <p>Category: <span className="capitalize">{selectedImage?.category.replace('_', ' ')}</span></p>
                <p>Uploaded by: {selectedImage?.uploadedBy}</p>
                <p>Date: {selectedImage && formatDate(selectedImage.createdAt)}</p>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button variant="outline" size="sm" onClick={() => window.open(selectedImage?.imageUrl, '_blank')}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button variant="outline" size="sm" onClick={() => {
                  navigator.clipboard.writeText(selectedImage?.imageUrl || '');
                }}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Copy Link
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}