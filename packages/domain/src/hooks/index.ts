import { useQuery, useMutation } from 'convex/react';

export function useMonthlyAndWeeklyVerse() {
  return useQuery('globalSettings.get' as any);
}

export function useDailyDevotional(date: string) {
  return useQuery('devotionals.getByDate' as any, { date });
}

export function useCommunity(communityId: string) {
  return useQuery('communities.getById' as any, { communityId });
}

export function useCommunityMessages(communityId: string) {
  return useQuery('communityMessages.listByCommunity' as any, { communityId });
}

export function useChecklist(checklistId: string) {
  return useQuery('checklists.getWithItems' as any, { checklistId });
}

export function useCreateCommunity() {
  return useMutation('communities.create' as any);
}

export function useUpdateCommunityScripture() {
  return useMutation('communities.updateScripture' as any);
}

export function useJoinByInviteCode() {
  return useMutation('communities.joinByInviteCode' as any);
}

export function useRemoveCommunityMember() {
  return useMutation('communityMembers.remove' as any);
}

export function useSendCommunityMessage() {
  return useMutation('communityMessages.send' as any);
}

export function useCreateChecklist() {
  return useMutation('checklists.create' as any);
}

export function useToggleChecklistTick() {
  return useMutation('checklistTicks.toggle' as any);
}

export function useChecklistTickCount(checklistItemId: string) {
  return useQuery('checklistTicks.countByItem' as any, { checklistItemId });
}