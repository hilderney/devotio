import { BibleApiResponse } from "../../../../shared/models/bible-api.model";

export class TodaysVerse implements ITodaysVerse {
  address!: string;
  bibleVersion!: string;
  verses!: IVerse[];

  constructor(json: ITodaysVerse) {
    if (json) {
      Object.assign(this, json);
    }
   }
}

export interface ITodaysVerse {
  address: string;
  bibleVersion: string;
  verses: IVerse[];
}

export interface IVerse {
  number: string;
  text: string;
}

export function mapBibleApiResponseToITodaysVerse(api: BibleApiResponse): ITodaysVerse {
  return {
    address: api.reference,
    bibleVersion: api.translation_name,
    verses: api.verses.map(v => ({
      number: v.verse.toString(),
      text: v.text.trim()
    }))
  };
}
