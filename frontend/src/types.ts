export interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  capacity: number;
  category: string;
  price: number;
  createdBy: string;
  registeredUsers: number;
  isOnline: boolean;
  tags: string[];
  imageUrl?: string;
  organizer?: string;
  status?: 'upcoming' | 'ongoing' | 'completed';
}

export type Tab = 'discover' | 'events' | 'my-events';

export interface EventFormData {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  capacity: number;
  category: string;
  price: number;
  isOnline: boolean;
  tags: string;
  requireApproval: boolean;
}

export interface EventCardProps {
  event: Event;
  showActions?: boolean;
  onRegister?: (eventId: number) => void;
  onDelete?: (eventId: number) => void;
  isRegistered?: boolean;
}

export interface HeaderProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export const CATEGORIES = ['all', 'Technology', 'Design', 'Business', 'Arts', 'Sports', 'Music', 'Education'] as const; 