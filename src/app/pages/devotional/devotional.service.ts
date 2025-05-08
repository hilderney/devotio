import { Injectable } from "@angular/core";
import { delay, Observable, of } from "rxjs";
import { TasksEnum } from "./state/devotional.models";

@Injectable({
  providedIn: 'root'
})
export class DevotionalService {
  private completed: TasksEnum[] = [
    TasksEnum.Verse,
    TasksEnum.Reflection,
    // pode iniciar vazio ou com alguns itens
  ];

  constructor() { }

  getCompletedTasks(): Observable<TasksEnum[]> {
    return of(this.completed).pipe(
      delay(500) // 500ms de “network delay” simulado
    );
  }

  completeTask(task: TasksEnum): Observable<void> {
    if (!this.completed.includes(task)) {
      this.completed.push(task);
    }
    return of(void 0).pipe(delay(200));
  }

  uncompleteTask(task: TasksEnum): Observable<void> {
    this.completed = this.completed.filter(t => t !== task);
    return of(void 0).pipe(delay(200));
  }
}
