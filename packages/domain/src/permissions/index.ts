import type { CommunityMember } from '../types';

export type UserRole = 'admin' | 'member';

export function isAdminOfCommunity(
  member: CommunityMember | null | undefined
): boolean {
  return member?.role === 'admin';
}

export function isMemberOfCommunity(
  member: CommunityMember | null | undefined
): boolean {
  return member?.role === 'admin' || member?.role === 'member';
}

export function canManageMembers(
  member: CommunityMember | null | undefined,
  targetMember: CommunityMember | null | undefined,
  communityMembers: CommunityMember[]
): boolean {
  if (!isAdminOfCommunity(member) || !member) return false;
  if (!targetMember) return false;
  if (targetMember.userId === member.userId) {
    const adminCount = communityMembers.filter(m => m.role === 'admin').length;
    return adminCount > 1;
  }
  return true;
}

export function canSendCommunityMessage(
  member: CommunityMember | null | undefined
): boolean {
  return isAdminOfCommunity(member);
}

export function canViewCommunityContent(
  member: CommunityMember | null | undefined
): boolean {
  return isMemberOfCommunity(member);
}

export function canToggleChecklistTick(
  member: CommunityMember | null | undefined
): boolean {
  return isMemberOfCommunity(member);
}