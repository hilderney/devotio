// src/app/state/devotional/devotional.actions.ts
import { createAction, props } from '@ngrx/store';
import { TasksEnum } from './devotional.models';

/** Marca uma tarefa como concluída */
export const markTaskComplete = createAction(
  '[Devotional] Mark Task Complete',
  props<{ task: TasksEnum }>()
);

/** Desmarca (remove) uma tarefa concluída */
export const unmarkTask = createAction(
  '[Devotional] Unmark Task',
  props<{ task: TasksEnum }>()
);

export const loadCompletedTasks = createAction(
  '[Devotional] Load Completed Tasks',
  props<{ tasks: TasksEnum[] }>()
);
