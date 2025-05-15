// src/app/state/devotional/devotional.effects.ts
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap, map, exhaustMap } from 'rxjs/operators';
import { loadCompletedTasks, markTaskComplete, unmarkTask } from './devotional.actions';
import { TasksEnum } from './devotional.models';
import { Action, Store } from '@ngrx/store';
import { of } from 'rxjs';
import { DevotionalService } from '../devotional.service';

const STORAGE_KEY = 'devotio:completedTasks';

@Injectable()
export class DevotionalEffects {
  constructor(
    private actions$: Actions,
    private store: Store,
    private service: DevotionalService
  ) { }

  // Efeito para carregar tarefas do localStorage ao iniciar
  loadTasks$ = createEffect(() =>
    of(null).pipe(
      map(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        const tasks: TasksEnum[] = stored
          ? JSON.parse(stored)
          : [];
        return loadCompletedTasks({ tasks });
      })
    )
  );

  // Efeito para salvar no localStorage quando uma task é marcada
  persistOnMark$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(markTaskComplete, unmarkTask),
        tap(action => {
          // obtém o estado atual das tasks no store
          let current: TasksEnum[] = [];
          this.store
            .select(state => (state as any).devotional.completedTasks)
            .subscribe(list => (current = list))
            .unsubscribe();

          // grava no localStorage
          localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
        })
      ),
    { dispatch: false }
  );

  saveTaskOnComplete$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(markTaskComplete),
        exhaustMap(action => {
          // TODO Passe o userId real aqui!
          return this.service.completeTask(action.task, '0');
        })
      ),
    { dispatch: false }
  );

  removeTaskOnUnmark$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(unmarkTask),
        exhaustMap(action => {
          // TODO Passe o userId real aqui!
          return this.service.uncompleteTask(action.task, '0');
        })
      ),
    { dispatch: false }
  );
}
