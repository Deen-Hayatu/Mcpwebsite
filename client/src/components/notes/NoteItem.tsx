import React, { useState } from 'react';
import { Note } from '@/lib/types';
import { 
  Card, 
  CardContent,
  CardFooter,
  CardHeader 
} from '@/components/ui/card';
import { 
  updateNote, 
  deleteNote, 
  toggleNoteVisibility 
} from '@/lib/annotationService';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Edit, 
  Trash, 
  Eye, 
  EyeOff, 
  Share2, 
  Check, 
  X, 
  Tag
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import NoteForm from './NoteForm';

interface NoteItemProps {
  note: Note;
  onEdit?: (note: Note) => void;
  onDelete?: (note: Note) => void;
  onShare?: (note: Note) => void;
  currentUserEmail?: string;
}

const NoteItem: React.FC<NoteItemProps> = ({
  note,
  onEdit,
  onDelete,
  onShare,
  currentUserEmail,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  
  const isOwner = currentUserEmail === note.userEmail;
  
  const handleUpdate = async (title: string, content: string, isPublic: boolean, tags: string[]) => {
    try {
      const updatedNote = await updateNote(note.id, title, content, tags);
      setIsEditing(false);
      if (onEdit) {
        onEdit(updatedNote);
      }
      toast({
        title: "Note updated",
        description: "Your note has been successfully updated.",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Failed to update",
        description: "There was an error updating your note.",
        variant: "destructive",
      });
    }
  };
  
  const handleDelete = async () => {
    if (isDeleting) {
      try {
        await deleteNote(note.id, note.documentType, note.documentId, note.userEmail);
        if (onDelete) {
          onDelete(note);
        }
        toast({
          title: "Note deleted",
          description: "Your note has been successfully deleted.",
          variant: "success",
        });
      } catch (error) {
        toast({
          title: "Failed to delete",
          description: "There was an error deleting your note.",
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
      const updatedNote = await toggleNoteVisibility(note.id);
      if (onEdit) {
        onEdit(updatedNote);
      }
      toast({
        title: `Note is now ${updatedNote.isPublic ? 'public' : 'private'}`,
        description: updatedNote.isPublic 
          ? "Others can now see this note." 
          : "This note is now only visible to you.",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Failed to change visibility",
        description: "There was an error changing the visibility of your note.",
        variant: "destructive",
      });
    }
  };
  
  const handleShare = () => {
    if (onShare) {
      onShare(note);
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
  
  if (isEditing) {
    return (
      <NoteForm 
        onSubmit={handleUpdate}
        onCancel={() => setIsEditing(false)}
        initialTitle={note.title}
        initialContent={note.content}
        initialTags={note.tags}
        isEditing={true}
      />
    );
  }
  
  return (
    <Card className="mb-4 border-primary/20 hover:border-primary/30 transition-colors">
      <CardHeader className="pb-2 pt-4 px-4">
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback>{getInitials(note.userName)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <div className="font-medium">{note.userName}</div>
              <div className="text-xs text-gray-500 flex items-center gap-1">
                {getRelativeTime(note.updatedAt)}
                {note.createdAt !== note.updatedAt && (
                  <span className="text-xs italic">(edited)</span>
                )}
                {!note.isPublic && (
                  <span className="inline-flex items-center ml-1 text-amber-600">
                    <EyeOff className="h-3 w-3 mr-1" /> Private
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <h3 className="text-lg font-semibold">{note.title}</h3>
        </div>
      </CardHeader>
      
      <CardContent className="px-4 py-2">
        <div className="whitespace-pre-wrap mb-3">
          {note.content}
        </div>
        
        {note.tags && note.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {note.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                <Tag className="h-3 w-3" />
                {tag}
              </Badge>
            ))}
          </div>
        )}
        
        {isDeleting && (
          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm">
            <p className="text-red-800 mb-2">Are you sure you want to delete this note?</p>
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
      
      <CardFooter className="px-4 pt-0 pb-3 flex justify-end items-center gap-1">
        {isOwner && (
          <>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setIsEditing(true)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Edit note</TooltipContent>
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
                <TooltipContent>Delete note</TooltipContent>
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
                    {note.isPublic ? (
                      <Eye className="h-4 w-4" />
                    ) : (
                      <EyeOff className="h-4 w-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {note.isPublic ? "Make private" : "Make public"}
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
                <TooltipContent>Share note</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default NoteItem;