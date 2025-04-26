export interface Newsletter {
  id: number;
  title: string;
  subject: string;
  content: string;
  htmlContent: string;
  authorId?: number;
  authorName: string;
  status: 'draft' | 'sent' | 'scheduled';
  sentAt?: string;
  scheduledFor?: string;
  recipientCount?: number;
  openCount?: number;
  clickCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Subscriber {
  id: number;
  email: string;
  name?: string;
  subscribed: boolean;
  createdAt?: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  isAdmin?: boolean;
}

export interface PolicyBrief {
  id: number;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  type: 'brief' | 'paper';
}

export interface ResearchMetric {
  id: number;
  name: string;
  category: string;
  value: number;
  date: string;
  description?: string;
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

export interface StaffMember {
  id: number;
  name: string;
  position: string;
  bio: string;
  imageUrl?: string;
  email?: string;
  twitter?: string;
  linkedin?: string;
  isFeatured: boolean;
  sortOrder?: number;
}