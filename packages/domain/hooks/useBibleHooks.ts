import type { BibleBook, BibleChapter, BibleVerse, BibleSearchResult } from "../types/bible";

export interface UseBibleBooksResult {
  data: BibleBook[] | null;
  isLoading: boolean;
  isEmpty: boolean;
}

export function useBibleBooks(params?: { queryResult?: BibleBook[] | null }): UseBibleBooksResult {
  const raw = params?.queryResult;
  const isLoading = raw === undefined;
  const data = raw ?? null;
  const isEmpty = !isLoading && (!data || data.length === 0);

  return { data, isLoading, isEmpty };
}

export interface UseBibleChapterResult {
  data: BibleChapter | null;
  isLoading: boolean;
  isEmpty: boolean;
}

export function useBibleChapter(params?: { queryResult?: BibleChapter | null }): UseBibleChapterResult {
  const raw = params?.queryResult;
  const isLoading = raw === undefined;
  const data = raw ?? null;
  const isEmpty = !isLoading && (!data || data.verses.length === 0);

  return { data, isLoading, isEmpty };
}

export interface UseBibleVerseResult {
  data: BibleVerse | null;
  isLoading: boolean;
  isEmpty: boolean;
}

export function useBibleVerse(params?: { queryResult?: BibleVerse | null }): UseBibleVerseResult {
  const raw = params?.queryResult;
  const isLoading = raw === undefined;
  const data = raw ?? null;
  const isEmpty = !isLoading && data === null;

  return { data, isLoading, isEmpty };
}

export interface UseBibleSearchResult {
  data: BibleSearchResult[] | null;
  isLoading: boolean;
  isEmpty: boolean;
}

export function useBibleSearch(params?: { queryResult?: BibleSearchResult[] | null }): UseBibleSearchResult {
  const raw = params?.queryResult;
  const isLoading = raw === undefined;
  const data = raw ?? null;
  const isEmpty = !isLoading && (!data || data.length === 0);

  return { data, isLoading, isEmpty };
}
