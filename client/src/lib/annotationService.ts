import { 
  Annotation, 
  Note, 
  AnnotationSharing, 
  NoteSharing 
} from './types';
import { apiRequest, queryClient } from './queryClient';

// Annotation API functions
export const fetchAnnotations = async (documentType: string, documentId: number): Promise<Annotation[]> => {
  const response = await apiRequest('GET', `/api/annotations?documentType=${documentType}&documentId=${documentId}`);
  return await response.json();
};

export const fetchAnnotation = async (id: number): Promise<Annotation> => {
  const response = await apiRequest('GET', `/api/annotations/${id}`);
  return await response.json();
};

export const createAnnotation = async (annotation: Omit<Annotation, 'id' | 'createdAt' | 'updatedAt' | 'isEdited'>): Promise<Annotation> => {
  const response = await apiRequest('POST', '/api/annotations', annotation);
  const result = await response.json();
  
  // Invalidate the cache for the annotations list
  queryClient.invalidateQueries({ 
    queryKey: [`/api/annotations?documentType=${annotation.documentType}&documentId=${annotation.documentId}`]
  });
  
  return result.annotation;
};

export const updateAnnotation = async (id: number, text: string): Promise<Annotation> => {
  const response = await apiRequest('PATCH', `/api/annotations/${id}`, { text });
  const result = await response.json();
  
  // Invalidate the cache for this specific annotation
  queryClient.invalidateQueries({ queryKey: [`/api/annotations/${id}`] });
  
  return result.annotation;
};

export const deleteAnnotation = async (id: number, documentType: string, documentId: number): Promise<void> => {
  await apiRequest('DELETE', `/api/annotations/${id}`);
  
  // Invalidate the cache for the annotations list and replies
  queryClient.invalidateQueries({ 
    queryKey: [`/api/annotations?documentType=${documentType}&documentId=${documentId}`]
  });
  queryClient.invalidateQueries({ queryKey: [`/api/annotations/${id}/replies`] });
};

export const fetchAnnotationReplies = async (annotationId: number): Promise<Annotation[]> => {
  const response = await apiRequest('GET', `/api/annotations/${annotationId}/replies`);
  return await response.json();
};

export const toggleAnnotationVisibility = async (id: number): Promise<Annotation> => {
  const response = await apiRequest('PATCH', `/api/annotations/${id}/toggle-visibility`);
  const result = await response.json();
  
  // Invalidate the cache for this specific annotation
  queryClient.invalidateQueries({ queryKey: [`/api/annotations/${id}`] });
  
  return result.annotation;
};

// Note API functions
export const fetchNotes = async (documentType: string, documentId: number): Promise<Note[]> => {
  const response = await apiRequest('GET', `/api/notes?documentType=${documentType}&documentId=${documentId}`);
  return await response.json();
};

export const fetchUserNotes = async (userEmail: string): Promise<Note[]> => {
  const response = await apiRequest('GET', `/api/user-notes?userEmail=${userEmail}`);
  return await response.json();
};

export const fetchNote = async (id: number): Promise<Note> => {
  const response = await apiRequest('GET', `/api/notes/${id}`);
  return await response.json();
};

export const createNote = async (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Promise<Note> => {
  const response = await apiRequest('POST', '/api/notes', note);
  const result = await response.json();
  
  // Invalidate the cache for the notes list
  queryClient.invalidateQueries({ 
    queryKey: [`/api/notes?documentType=${note.documentType}&documentId=${note.documentId}`]
  });
  // Also invalidate user's notes
  queryClient.invalidateQueries({ 
    queryKey: [`/api/user-notes?userEmail=${note.userEmail}`]
  });
  
  return result.note;
};

export const updateNote = async (id: number, title: string, content: string, tags?: string[]): Promise<Note> => {
  const response = await apiRequest('PATCH', `/api/notes/${id}`, { title, content, tags });
  const result = await response.json();
  
  // Invalidate the cache for this specific note
  queryClient.invalidateQueries({ queryKey: [`/api/notes/${id}`] });
  
  return result.note;
};

export const deleteNote = async (id: number, documentType: string, documentId: number, userEmail: string): Promise<void> => {
  await apiRequest('DELETE', `/api/notes/${id}`);
  
  // Invalidate the cache for the notes list and user's notes
  queryClient.invalidateQueries({ 
    queryKey: [`/api/notes?documentType=${documentType}&documentId=${documentId}`]
  });
  queryClient.invalidateQueries({ 
    queryKey: [`/api/user-notes?userEmail=${userEmail}`]
  });
};

export const toggleNoteVisibility = async (id: number): Promise<Note> => {
  const response = await apiRequest('PATCH', `/api/notes/${id}/toggle-visibility`);
  const result = await response.json();
  
  // Invalidate the cache for this specific note
  queryClient.invalidateQueries({ queryKey: [`/api/notes/${id}`] });
  
  return result.note;
};

// Sharing API functions
export const shareAnnotation = async (annotationId: number, sharedWithEmail: string): Promise<AnnotationSharing> => {
  const response = await apiRequest('POST', `/api/annotations/${annotationId}/share`, { sharedWithEmail });
  const result = await response.json();
  
  // Invalidate the cache for this annotation's sharing list
  queryClient.invalidateQueries({ queryKey: [`/api/annotations/${annotationId}/sharing`] });
  
  return result.sharing;
};

export const getAnnotationSharings = async (annotationId: number): Promise<AnnotationSharing[]> => {
  const response = await apiRequest('GET', `/api/annotations/${annotationId}/sharing`);
  return await response.json();
};

export const acceptAnnotationSharing = async (token: string): Promise<void> => {
  await apiRequest('POST', `/api/annotation-shares/accept/${token}`);
};

export const deleteAnnotationSharing = async (id: number, annotationId: number): Promise<void> => {
  await apiRequest('DELETE', `/api/annotation-shares/${id}`);
  
  // Invalidate the cache for this annotation's sharing list
  queryClient.invalidateQueries({ queryKey: [`/api/annotations/${annotationId}/sharing`] });
};

export const shareNote = async (noteId: number, sharedWithEmail: string): Promise<NoteSharing> => {
  const response = await apiRequest('POST', `/api/notes/${noteId}/share`, { sharedWithEmail });
  const result = await response.json();
  
  // Invalidate the cache for this note's sharing list
  queryClient.invalidateQueries({ queryKey: [`/api/notes/${noteId}/sharing`] });
  
  return result.sharing;
};

export const getNoteSharings = async (noteId: number): Promise<NoteSharing[]> => {
  const response = await apiRequest('GET', `/api/notes/${noteId}/sharing`);
  return await response.json();
};

export const acceptNoteSharing = async (token: string): Promise<void> => {
  await apiRequest('POST', `/api/note-shares/accept/${token}`);
};

export const deleteNoteSharing = async (id: number, noteId: number): Promise<void> => {
  await apiRequest('DELETE', `/api/note-shares/${id}`);
  
  // Invalidate the cache for this note's sharing list
  queryClient.invalidateQueries({ queryKey: [`/api/notes/${noteId}/sharing`] });
};