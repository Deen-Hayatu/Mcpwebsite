import React, { useState } from 'react';
import { Annotation } from '@/lib/types';
import { 
  Card, 
  CardContent,
  CardFooter,
  CardHeader 
} from '@/components/ui/card';
import { 
  updateAnnotation, 
  deleteAnnotation, 
  toggleAnnotationVisibility 
} from '@/lib/annotationService';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  MessageSquare, 
  Edit, 
  Trash, 
  Eye, 
  EyeOff, 
  Share2, 
  Check, 
  X 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';

interface AnnotationItemProps {
  annotation: Annotation;
  onReply?: (annotationId: number) => void;
  onEdit?: (annotation: Annotation) => void;
  onDelete?: (annotation: Annotation) => void;
  onShare?: (annotation: Annotation) => void;
  showReplyButton?: boolean;
  isReply?: boolean;
  currentUserEmail?: string;
}

const AnnotationItem: React.FC<AnnotationItemProps> = ({
  annotation,
  onReply,
  onEdit,
  onDelete,
  onShare,
  showReplyButton = true,
  isReply = false,
  currentUserEmail,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(annotation.text);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  
  const isOwner = currentUserEmail === annotation.userEmail;
  
  const handleEdit = async () => {
    if (isEditing) {
      try {
        await updateAnnotation(annotation.id, editText);
        setIsEditing(false);
        if (onEdit) {
          onEdit({...annotation, text: editText});
        }
        toast({
          title: "Annotation updated",
          description: "Your annotation has been successfully updated.",
          variant: "success",
        });
      } catch (error) {
        toast({
          title: "Failed to update",
          description: "There was an error updating your annotation.",
          variant: "destructive",
        });
      }
    } else {
      setIsEditing(true);
    }
  };
  
  const handleDelete = async () => {
    if (isDeleting) {
      try {
        await deleteAnnotation(annotation.id, annotation.documentType, annotation.documentId);
        if (onDelete) {
          onDelete(annotation);
        }
        toast({
          title: "Annotation deleted",
          description: "Your annotation has been successfully deleted.",
          variant: "success",
        });
      } catch (error) {
        toast({
          title: "Failed to delete",
          description: "There was an error deleting your annotation.",
          variant: "destructive",
        });
      }
      setIsDeleting(false);
    } else {
      setIsDeleting(true);
    }
  };
  
  const handleCancelDelete = () => {
    setIsDeleting(false);
  };
  
  const handleToggleVisibility = async () => {
    try {
      const updatedAnnotation = await toggleAnnotationVisibility(annotation.id);
      if (onEdit) {
        onEdit(updatedAnnotation);
      }
      toast({
        title: `Annotation is now ${updatedAnnotation.isPublic ? 'public' : 'private'}`,
        description: updatedAnnotation.isPublic 
          ? "Others can now see this annotation." 
          : "This annotation is now only visible to you.",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Failed to change visibility",
        description: "There was an error changing the visibility of your annotation.",
        variant: "destructive",
      });
    }
  };
  
  const handleShare = () => {
    if (onShare) {
      onShare(annotation);
    }
  };
  
  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name.split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };
  
  // Format date relative to now (e.g., "2 hours ago")
  const getRelativeTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      return dateString;
    }
  };
  
  return (
    <Card className={`mb-4 ${isReply ? 'ml-6' : ''}`} style={{ borderLeft: `4px solid ${annotation.color}` }}>
      <CardHeader className="pb-2 pt-4 px-4 flex flex-row items-center gap-2">
        <Avatar className="h-8 w-8">
          <AvatarFallback>{getInitials(annotation.userName)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <div className="font-medium">{annotation.userName}</div>
          <div className="text-xs text-gray-500 flex items-center gap-1">
            {getRelativeTime(annotation.createdAt)}
            {annotation.isEdited && <span className="text-xs italic">(edited)</span>}
            {!annotation.isPublic && (
              <span className="inline-flex items-center ml-1 text-amber-600">
                <EyeOff className="h-3 w-3 mr-1" /> Private
              </span>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-4 py-2">
        {isEditing ? (
          <Textarea 
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="min-h-[100px]"
          />
        ) : (
          <div className="whitespace-pre-wrap">
            {annotation.text}
          </div>
        )}
        {isDeleting && (
          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm">
            <p className="text-red-800 mb-2">Are you sure you want to delete this annotation?</p>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="destructive" 
                onClick={handleDelete} 
                className="flex items-center gap-1"
              >
                <Check className="h-4 w-4" /> Confirm
              </Button>
              <Button 
                size="sm" 
                variant="secondary" 
                onClick={handleCancelDelete}
                className="flex items-center gap-1"
              >
                <X className="h-4 w-4" /> Cancel
              </Button>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="px-4 pt-0 pb-3 flex justify-between items-center">
        <div>
          {showReplyButton && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onReply?.(annotation.id)}
                    className="h-8 px-2"
                  >
                    <MessageSquare className="h-4 w-4 mr-1" />
                    <span className="text-xs">Reply</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Reply to this annotation</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        
        <div className="flex gap-1">
          {isOwner && (
            <>
              {isEditing ? (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleEdit}
                        className="h-8 w-8 p-0"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Save changes</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={handleEdit}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Edit annotation</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={handleDelete}
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Delete annotation</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={handleToggleVisibility}
                          className="h-8 w-8 p-0"
                        >
                          {annotation.isPublic ? (
                            <Eye className="h-4 w-4" />
                          ) : (
                            <EyeOff className="h-4 w-4" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {annotation.isPublic ? "Make private" : "Make public"}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={handleShare}
                          className="h-8 w-8 p-0"
                        >
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Share annotation</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </>
              )}
            </>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default AnnotationItem;