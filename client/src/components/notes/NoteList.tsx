import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Note } from '@/lib/types';
import { 
  fetchNotes, 
  createNote 
} from '@/lib/annotationService';
import NoteItem from './NoteItem';
import NoteForm from './NoteForm';
import SharingDialog from '../annotations/SharingDialog';
import { Button } from '@/components/ui/button';
import { queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { FileText, Loader2, Plus } from 'lucide-react';

interface NoteListProps {
  documentType: string;
  documentId: number;
  currentUserEmail: string;
  currentUserName: string;
}

const NoteList: React.FC<NoteListProps> = ({
  documentType,
  documentId,
  currentUserEmail,
  currentUserName,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [sharingNote, setSharingNote] = useState<Note | null>(null);
  const { toast } = useToast();
  
  // Fetch notes for this document
  const { 
    data: notes = [], 
    isLoading, 
    isError 
  } = useQuery<Note[]>({
    queryKey: [`/api/notes?documentType=${documentType}&documentId=${documentId}`],
    enabled: !!documentType && !!documentId,
  });
  
  // Create a new note
  const createMutation = useMutation({
    mutationFn: async (newNote: {
      title: string;
      content: string;
      documentType: string;
      documentId: number;
      userName: string;
      userEmail: string;
      isPublic: boolean;
      tags: string[];
    }) => {
      await createNote(newNote);
    },
    onSuccess: () => {
      // Invalidate and refetch notes
      queryClient.invalidateQueries({ 
        queryKey: [`/api/notes?documentType=${documentType}&documentId=${documentId}`]
      });
      
      // Also invalidate user's notes
      queryClient.invalidateQueries({ 
        queryKey: [`/api/user-notes?userEmail=${currentUserEmail}`]
      });
      
      toast({
        title: 'Note created',
        description: 'Your note has been successfully created.',
      });
      
      // Reset the form
      setShowForm(false);
    },
    onError: () => {
      toast({
        title: 'Failed to create note',
        description: 'There was an error creating your note. Please try again.',
        variant: 'destructive',
      });
    },
  });
  
  const handleCreateNote = async (title: string, content: string, isPublic: boolean, tags: string[]) => {
    const newNote = {
      title,
      content,
      documentType,
      documentId,
      userName: currentUserName,
      userEmail: currentUserEmail,
      isPublic,
      tags,
    };
    
    await createMutation.mutateAsync(newNote);
  };
  
  const handleShare = (note: Note) => {
    setSharingNote(note);
  };
  
  // Filter notes to show public ones and the current user's private ones
  const visibleNotes = notes.filter(note => 
    note.isPublic || note.userEmail === currentUserEmail
  );
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (isError) {
    return (
      <div className="text-center py-8 text-red-500">
        Failed to load notes. Please try again.
      </div>
    );
  }
  
  return (
    <div className="notes-container">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          Research Notes ({visibleNotes.length})
        </h2>
        
        <Button
          onClick={() => setShowForm(!showForm)}
          variant={showForm ? "secondary" : "default"}
          className="flex items-center gap-2"
        >
          {showForm ? (
            "Cancel"
          ) : (
            <>
              <Plus className="h-4 w-4" />
              Add Note
            </>
          )}
        </Button>
      </div>
      
      {/* Note form */}
      {showForm && (
        <NoteForm
          onSubmit={handleCreateNote}
          onCancel={() => setShowForm(false)}
        />
      )}
      
      {/* Notes list */}
      {visibleNotes.length === 0 ? (
        <div className="text-center py-8 text-gray-500 flex flex-col items-center">
          <FileText className="h-12 w-12 mb-2 text-gray-300" />
          <p>No notes yet. Be the first to add one!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {visibleNotes.map((note) => (
            <NoteItem
              key={note.id}
              note={note}
              onShare={handleShare}
              currentUserEmail={currentUserEmail}
            />
          ))}
        </div>
      )}
      
      {/* Sharing dialog */}
      {sharingNote && (
        <SharingDialog
          open={!!sharingNote}
          onOpenChange={(open) => {
            if (!open) setSharingNote(null);
          }}
          item={sharingNote}
          itemType="note"
        />
      )}
    </div>
  );
};

export default NoteList;