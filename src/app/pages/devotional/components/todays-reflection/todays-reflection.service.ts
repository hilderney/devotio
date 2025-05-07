import { Injectable } from "@angular/core";
import { ITodaysReflection } from "./todays-reflection.model";
import { Observable, of } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TodaysReflectionService {

  constructor() { }

  getTodaysReflection(): Observable<ITodaysReflection> {
    const mock: ITodaysReflection = {
      title: 'Confiança em Deus',
      author: 'Equipe Devotio',
      reflection: 'Muitas vezes queremos controlar tudo, mas a verdadeira paz vem quando entregamos nossos caminhos a Deus.',
      verse: {
        address: 'Salmos 37:5',
        bibleVersion: 'NVI',
        verses: [{
          number: '5',
          text: 'Os arrogantes não são aceitos na tua presença; odeias todos os que praticam o mal.'
        }],
      }
    }

    return of(mock)
  }

  endTodaysTask(): Observable<boolean> {
    // TODO registrar conclusão da task do dia de Verso
    return of(true);
  }
}
