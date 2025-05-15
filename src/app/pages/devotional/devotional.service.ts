import { Injectable } from "@angular/core";
import { delay, Observable, of } from "rxjs";
import { TasksEnum } from "./state/devotional.models";
import { DevotionalFirestoreAdapter } from "../../core/adapters/firestore/devotional-firestore.adapter";

@Injectable({
  providedIn: 'root'
})
export class DevotionalService {
  private completed: TasksEnum[] = [
    TasksEnum.Verse,
    TasksEnum.Reflection,
    // pode iniciar vazio ou com alguns itens
  ];

  constructor(
    private firestoreAdapter: DevotionalFirestoreAdapter
  ) { }

  getCompletedTasks(): Observable<TasksEnum[]> {
    return of(this.completed).pipe(
      delay(500) // 500ms de “network delay” simulado
    );
  }

  completeTask(task: TasksEnum, userId: string): Observable<void> {
    if (!this.completed.includes(task)) {
      this.completed.push(task);
      this.firestoreAdapter.markTaskComplete(userId, task);
    }
    return of(void 0).pipe(delay(200));
  }

  uncompleteTask(task: TasksEnum, userId: string): Observable<void> {
    this.completed = this.completed.filter(t => t !== task);
    this.firestoreAdapter.markTaskUncomplete(userId, task);
    return of(void 0).pipe(delay(200));
  }
}
