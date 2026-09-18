import { useState } from "react";
import type {
  CommunityData,
  CommunityMessageData,
  ChecklistData,
} from "../types/community";

export interface UseCommunityResult {
  community: CommunityData | null;
  isLoading: boolean;
  isAdmin: boolean;
  isMember: boolean;
}

export function useCommunity(params?: {
  queryResult?: CommunityData | null;
}): UseCommunityResult {
  const isLoading = params?.queryResult === undefined;
  const community = params?.queryResult ?? null;
  const role = community?.userRole;

  return {
    community,
    isLoading,
    isAdmin: role === "admin",
    isMember: role === "admin" || role === "member",
  };
}

export interface UseCommunityMessagesResult {
  messages: CommunityMessageData[];
  isLoading: boolean;
  isEmpty: boolean;
}

export function useCommunityMessages(params?: {
  queryResult?: CommunityMessageData[];
}): UseCommunityMessagesResult {
  const isLoading = params?.queryResult === undefined;
  const messages = params?.queryResult ?? [];
  const isEmpty = !isLoading && messages.length === 0;

  return {
    messages,
    isLoading,
    isEmpty,
  };
}

export interface UseChecklistsResult {
  checklists: ChecklistData[];
  isLoading: boolean;
  isEmpty: boolean;
}

export function useChecklists(params?: {
  queryResult?: ChecklistData[];
}): UseChecklistsResult {
  const isLoading = params?.queryResult === undefined;
  const checklists = params?.queryResult ?? [];
  const isEmpty = !isLoading && checklists.length === 0;

  return {
    checklists,
    isLoading,
    isEmpty,
  };
}

export interface UseChecklistTicksResult {
  myTicks: Set<string>;
  toggleTick: (itemId: string) => void;
}

export function useChecklistTicks(params?: {
  initialTicks?: string[];
  onToggle?: (itemId: string) => Promise<boolean>;
}): UseChecklistTicksResult {
  const [ticks, setTicks] = useState<Set<string>>(
    () => new Set(params?.initialTicks ?? [])
  );

  const toggleTick = async (itemId: string) => {
    // Optimistic update
    setTicks((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });

    if (params?.onToggle) {
      try {
        await params.onToggle(itemId);
      } catch {
        // Revert on error
        setTicks((prev) => {
          const next = new Set(prev);
          if (next.has(itemId)) {
            next.delete(itemId);
          } else {
            next.add(itemId);
          }
          return next;
        });
      }
    }
  };

  return {
    myTicks: ticks,
    toggleTick,
  };
}
