export class TodaysVerse implements ITodaysVerse {
  adress!: string;
  bibleVersion!: string;
  verses!: IVerse[];

  constructor(json: ITodaysVerse) {
    if (json) {
      Object.assign(this, json);
    }
   }
}

export interface ITodaysVerse {
  adress: string;
  bibleVersion: string;
  verses: IVerse[];
}

export interface IVerse {
  number: string;
  text: string;
}