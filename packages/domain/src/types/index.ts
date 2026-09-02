export interface User {
  _id: string;
  _creationTime: number;
  name: string;
  email: string;
  image?: string;
  authId: string;
}

export interface Community {
  _id: string;
  _creationTime: number;
  name: string;
  description?: string;
  scripture?: string;
  createdBy: string;
  createdAt: number;
  inviteCode: string;
}

export interface CommunityMember {
  _id: string;
  _creationTime: number;
  userId: string;
  communityId: string;
  role: 'admin' | 'member';
  joinedAt: number;
}

export interface CommunityMessage {
  _id: string;
  _creationTime: number;
  communityId: string;
  senderId: string;
  content: string;
  sentAt: number;
}

export interface Checklist {
  _id: string;
  _creationTime: number;
  name: string;
  communityId?: string;
  clubId?: string;
  createdBy: string;
  createdAt: number;
}

export interface ChecklistItem {
  _id: string;
  _creationTime: number;
  checklistId: string;
  text: string;
  order: number;
}

export interface ChecklistTick {
  _id: string;
  _creationTime: number;
  userId: string;
  checklistItemId: string;
  tickedAt?: number;
}

export interface Devotional {
  _id: string;
  _creationTime: number;
  date: string;
  scripture: string;
  reflection: string;
  audioUrl?: string;
  prayerSuggestion: string;
  publishedBy: string;
  createdAt: number;
}

export interface GlobalSettings {
  _id: string;
  _creationTime: number;
  monthlyVerse: string;
  weeklyVerse: string;
  updatedAt: number;
}

export type DailyDevotionalData = {
  scripture: string;
  reflection: string;
  audioUrl?: string;
  prayerSuggestion: string;
} | null;