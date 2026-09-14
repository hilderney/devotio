export interface BibleBook {
  _id?: string;
  version: string;
  abbrev: string;
  name: string;
  author?: string;
  chapters: number;
  group?: string;
  testament: "VT" | "NT";
}

export interface BibleVerse {
  _id?: string;
  version: string;
  abbrev: string;
  chapter: number;
  number: number;
  text: string;
}

export interface BibleChapter {
  book: BibleBook | null;
  chapter: number;
  verses: BibleVerse[];
}

export interface BibleSearchResult {
  abbrev: string;
  bookName: string;
  chapter: number;
  number: number;
  text: string;
}
