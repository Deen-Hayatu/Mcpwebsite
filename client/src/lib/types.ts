export interface PolicyBrief {
  id: number;
  title: string;
  date: string;
  excerpt: string;
  content?: string;
}

export interface Event {
  id: number;
  title: string;
  date: string;
  location: string;
  time: string;
  description: string;
}

export interface Program {
  id: number;
  title: string;
  description: string;
}

export interface ResearchMetric {
  id: number;
  name: string;
  category: string;
  value: number;
  date: string;
  description?: string;
}

export interface EventRegistration {
  id: number;
  eventId: number;
  name: string;
  email: string;
  phone?: string;
  createdAt: string;
  notes?: string;
  status: string;
}

export interface Annotation {
  id: number;
  documentType: string;
  documentId: number;
  userId?: number;
  userName: string;
  userEmail: string;
  text: string;
  position: {
    startOffset: number;
    endOffset: number;
    startContainer: string;
    endContainer: string;
    [key: string]: any;
  };
  highlight: string;
  color: string;
  createdAt: string;
  updatedAt: string;
  isPublic: boolean;
  isEdited: boolean;
  replyToId?: number;
  replies?: Annotation[];
}

export interface Note {
  id: number;
  title: string;
  content: string;
  userId?: number;
  userName: string;
  userEmail: string;
  documentType: string;
  documentId: number;
  createdAt: string;
  updatedAt: string;
  isPublic: boolean;
  tags: string[];
}

export interface AnnotationSharing {
  id: number;
  annotationId: number;
  sharedWithEmail: string;
  createdAt: string;
  invitationAccepted: boolean;
  shareToken: string;
}

export interface NoteSharing {
  id: number;
  noteId: number;
  sharedWithEmail: string;
  createdAt: string;
  invitationAccepted: boolean;
  shareToken: string;
}

export interface GalleryImage {
  id: number;
  title: string;
  description?: string;
  imageUrl: string;
  programId?: number;
  eventId?: number;
  category: string;
  uploadedBy: string;
  uploadedByEmail: string;
  createdAt: string;
  isPublic: boolean;
  tags: string[];
}
