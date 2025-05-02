import { Injectable } from "@angular/core";
import { ITodaysVerse } from "./todays-verse.model";
import { Observable, of } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TodaysVerseService {

  constructor() { }

  getTodaysVerse(): Observable<ITodaysVerse> {
    const mock = {
      bibleVersion: 'NVI',
      adress: 'João 1:1-4',
      verses: [
        {
          number: '1',
          text: 'No princípio era o Verbo, e o Verbo estava com Deus, e o Verbo era Deus.'
        },
        {
          number: '2',
          text: 'Ele estava no princípio com Deus.'
        },
        {
          number: '3',
          text: 'Todas as coisas foram feitas por ele, e sem ele nada do que foi feito se fez.'
        }
        ,
        {
          number: '4',
          text: 'Nele estava a vida, e a vida era a luz dos homens.'
        }

      ],
    }

    return of(mock)
  }

}