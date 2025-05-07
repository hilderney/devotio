import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { TasksEnum } from "../../shared/enums/tasks.enum";

@Injectable({
  providedIn: 'root'
})
export class DevotionalService {

  constructor() { }

  getCompletedTasks(): Observable<TasksEnum> {
    // TODO: Carregar o status de conclusão dos items
    const mock: TasksEnum = TasksEnum.Citation;
    return of(mock)
  }
}
