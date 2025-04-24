import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Annotation } from '@/lib/types';
import { 
  fetchAnnotations, 
  fetchAnnotationReplies, 
  createAnnotation 
} from '@/lib/annotationService';
import AnnotationItem from './AnnotationItem';
import AnnotationForm from './AnnotationForm';
import SharingDialog from './SharingDialog';
import { Button } from '@/components/ui/button';
import { queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { MessageSquarePlus, Loader2 } from 'lucide-react';

interface AnnotationListProps {
  documentType: string;
  documentId: number;
  currentUserEmail: string;
  currentUserName: string;
}

const AnnotationList: React.FC<AnnotationListProps> = ({
  documentType,
  documentId,
  currentUserEmail,
  currentUserName,
}) => {
  const [replyToId, setReplyToId] = useState<number | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [sharingAnnotation, setSharingAnnotation] = useState<Annotation | null>(null);
  const { toast } = useToast();
  
  // Fetch annotations for this document
  const { 
    data: annotations = [], 
    isLoading, 
    isError 
  } = useQuery<Annotation[]>({
    queryKey: [`/api/annotations?documentType=${documentType}&documentId=${documentId}`],
    enabled: !!documentType && !!documentId,
  });
  
  // Fetch replies for annotations with replies
  const [expandedAnnotations, setExpandedAnnotations] = useState<number[]>([]);
  const [loadingReplies, setLoadingReplies] = useState<number[]>([]);
  
  // Use object to store replies for each annotation
  const [annotationReplies, setAnnotationReplies] = useState<Record<number, Annotation[]>>({});
  
  // Create a new annotation
  const createMutation = useMutation({
    mutationFn: async (newAnnotation: {
      documentType: string;
      documentId: number;
      userName: string;
      userEmail: string;
      text: string;
      position: Record<string, any>;
      highlight: string;
      color: string;
      isPublic: boolean;
      replyToId?: number;
    }) => {
      await createAnnotation(newAnnotation);
    },
    onSuccess: () => {
      // Invalidate and refetch annotations
      queryClient.invalidateQueries({ 
        queryKey: [`/api/annotations?documentType=${documentType}&documentId=${documentId}`]
      });
      
      // If this was a reply, also refetch the replies for the parent annotation
      if (replyToId) {
        queryClient.invalidateQueries({ 
          queryKey: [`/api/annotations/${replyToId}/replies`]
        });
      }
      
      toast({
        title: 'Annotation created',
        description: 'Your annotation has been successfully created.',
      });
      
      // Reset the form
      setShowNewForm(false);
      setReplyToId(null);
    },
    onError: () => {
      toast({
        title: 'Failed to create annotation',
        description: 'There was an error creating your annotation. Please try again.',
        variant: 'destructive',
      });
    },
  });
  
  const handleLoadReplies = async (annotationId: number) => {
    // If already expanded, collapse it
    if (expandedAnnotations.includes(annotationId)) {
      setExpandedAnnotations(expandedAnnotations.filter(id => id !== annotationId));
      return;
    }
    
    // If not expanded and not already loading, load replies
    if (!loadingReplies.includes(annotationId)) {
      setLoadingReplies([...loadingReplies, annotationId]);
      
      try {
        const replies = await fetchAnnotationReplies(annotationId);
        setAnnotationReplies({
          ...annotationReplies,
          [annotationId]: replies,
        });
        setExpandedAnnotations([...expandedAnnotations, annotationId]);
      } catch (error) {
        toast({
          title: 'Failed to load replies',
          description: 'Could not load annotation replies. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setLoadingReplies(loadingReplies.filter(id => id !== annotationId));
      }
    }
  };
  
  const handleReply = (annotationId: number) => {
    setReplyToId(annotationId);
    setShowNewForm(false);
  };
  
  const handleCreateAnnotation = async (text: string, color: string, isPublic: boolean) => {
    // Sample position data - in a real app, this would come from text selection
    const position = {
      startOffset: 0,
      endOffset: 10,
      startContainer: "document.body",
      endContainer: "document.body",
    };
    
    const newAnnotation = {
      documentType,
      documentId,
      userName: currentUserName,
      userEmail: currentUserEmail,
      text,
      position,
      highlight: "Selected text", // In a real app, this would be the highlighted text
      color,
      isPublic,
      ...(replyToId ? { replyToId } : {}),
    };
    
    await createMutation.mutateAsync(newAnnotation);
  };
  
  const handleShare = (annotation: Annotation) => {
    setSharingAnnotation(annotation);
  };
  
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
        Failed to load annotations. Please try again.
      </div>
    );
  }
  
  return (
    <div className="annotations-container">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          Annotations ({annotations.length})
        </h2>
        
        <Button
          onClick={() => {
            setShowNewForm(!showNewForm);
            setReplyToId(null);
          }}
          variant={showNewForm ? "secondary" : "default"}
          className="flex items-center gap-2"
        >
          <MessageSquarePlus className="h-4 w-4" />
          {showNewForm ? "Cancel" : "Add Annotation"}
        </Button>
      </div>
      
      {/* New annotation form */}
      {showNewForm && (
        <AnnotationForm
          onSubmit={handleCreateAnnotation}
          onCancel={() => setShowNewForm(false)}
          isReply={false}
        />
      )}
      
      {/* Reply form */}
      {replyToId && (
        <div className="ml-6 mt-2 mb-6">
          <AnnotationForm
            onSubmit={handleCreateAnnotation}
            onCancel={() => setReplyToId(null)}
            isReply={true}
          />
        </div>
      )}
      
      {/* Annotations list */}
      {annotations.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No annotations yet. Be the first to add one!
        </div>
      ) : (
        <div className="space-y-4">
          {annotations.map((annotation) => (
            <div key={annotation.id}>
              <AnnotationItem
                annotation={annotation}
                onReply={() => handleLoadReplies(annotation.id)}
                onShare={handleShare}
                currentUserEmail={currentUserEmail}
              />
              
              {/* Show loading indicator for replies */}
              {loadingReplies.includes(annotation.id) && (
                <div className="ml-6 mt-2 flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm text-gray-500">Loading replies...</span>
                </div>
              )}
              
              {/* Show replies if expanded */}
              {expandedAnnotations.includes(annotation.id) && annotationReplies[annotation.id]?.length > 0 && (
                <div className="ml-6 mt-2">
                  {annotationReplies[annotation.id].map((reply) => (
                    <AnnotationItem
                      key={reply.id}
                      annotation={reply}
                      isReply={true}
                      showReplyButton={false}
                      currentUserEmail={currentUserEmail}
                      onShare={handleShare}
                    />
                  ))}
                  
                  {/* Reply button at the bottom of replies */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleReply(annotation.id)}
                    className="ml-2 mt-2"
                  >
                    Reply to this thread
                  </Button>
                </div>
              )}
              
              {/* Show reply button if expanded but no replies */}
              {expandedAnnotations.includes(annotation.id) && 
               (!annotationReplies[annotation.id] || annotationReplies[annotation.id].length === 0) && (
                <div className="ml-6 mt-2">
                  <p className="text-sm text-gray-500 mb-2">No replies yet</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleReply(annotation.id)}
                  >
                    Be the first to reply
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      {/* Sharing dialog */}
      {sharingAnnotation && (
        <SharingDialog
          open={!!sharingAnnotation}
          onOpenChange={(open) => {
            if (!open) setSharingAnnotation(null);
          }}
          item={sharingAnnotation}
          itemType="annotation"
        />
      )}
    </div>
  );
};

export default AnnotationList;