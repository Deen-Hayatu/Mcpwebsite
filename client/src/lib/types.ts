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
