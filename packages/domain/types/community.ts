import type { CommunityRole } from "../permissions/communityPermissions";

export interface CommunityData {
  _id: string;
  name: string;
  description?: string;
  scripture?: string;
  createdBy: string;
  createdAt: number;
  inviteCode: string;
  userRole?: CommunityRole;
}

export interface CommunityMemberData {
  memberId: string;
  userId: string;
  name: string;
  email?: string;
  image?: string;
  role: CommunityRole;
  joinedAt: number;
}

export interface CommunityMessageData {
  _id: string;
  content: string;
  sentAt: number;
  sender: {
    _id: string;
    name: string;
    image?: string;
  };
}

export interface ChecklistItemData {
  _id: string;
  checklistId: string;
  text: string;
  order: number;
}

export interface ChecklistData {
  _id: string;
  name: string;
  communityId?: string;
  clubId?: string;
  createdBy: string;
  createdAt: number;
  items: ChecklistItemData[];
}
