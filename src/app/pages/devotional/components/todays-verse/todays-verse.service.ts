import { Injectable } from "@angular/core";
import { ITodaysVerse, mapBibleApiResponseToITodaysVerse } from "./todays-verse.model";
import { map, Observable, of } from "rxjs";
import { BibleApiResponse } from "../../../../shared/models/bible-api.model";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../../../enviroments/environment";

@Injectable({
  providedIn: 'root'
})
export class TodaysVerseService {

  constructor(private http: HttpClient) { }

  getTodaysVerse(): Observable<ITodaysVerse> {

    // TODO montar a url conforme o texto do dia (repo interno)
    // https://documenter.getpostman.com/view/11242574/2sA3Qy7VeH#intro
    const book = 'joao';
    const chapter = 1;
    const startVerse = 1;
    const endVerse = 10;

    const url = `${environment.apiUrl }/${book}+${chapter}:${startVerse}-${endVerse}?translation=almeida`;
    return this.http.get<BibleApiResponse>(url).pipe(
      map((api: BibleApiResponse) => mapBibleApiResponseToITodaysVerse(api))
    );



    // const url = 'https://bible-api.com/joao+1:1-4?translation=almeida';


    // const mock: ITodaysVerse = {
    //   bibleVersion: 'NVI',
    //   address: 'João 1:1-4',
    //   verses: [
    //     {
    //       number: '1',
    //       text: 'No princípio era o Verbo, e o Verbo estava com Deus, e o Verbo era Deus.'
    //     },
    //     {
    //       number: '2',
    //       text: 'Ele estava no princípio com Deus.'
    //     },
    //     {
    //       number: '3',
    //       text: 'Todas as coisas foram feitas por ele, e sem ele nada do que foi feito se fez.'
    //     }
    //     ,
    //     {
    //       number: '4',
    //       text: 'Nele estava a vida, e a vida era a luz dos homens.'
    //     }

    //   ],
    // }

    // return of(mock);
  }

  endTodaysTask(): Observable<boolean> {
    // TODO registrar conclusão da task do dia de Verso
    return of(true);
  }

}
