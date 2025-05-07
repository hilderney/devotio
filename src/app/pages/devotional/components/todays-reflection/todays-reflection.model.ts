import { ITodaysVerse } from "../todays-verse/todays-verse.model";

export class TodaysReflection implements ITodaysReflection {
  title!: string;
  reflection!: string;
  author!: string;
  verse?: ITodaysVerse;

  constructor(json: ITodaysReflection) {
    if (json) {
      Object.assign(this, json);
    }
   }
}

export interface ITodaysReflection {
  title: string;
  reflection: string;
  author: string;
  verse?: ITodaysVerse;
}
