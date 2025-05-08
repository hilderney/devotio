// src/app/state/devotional/devotional.reducer.ts
import { createReducer, on } from '@ngrx/store';
import { DevotionalState } from './devotional.models';
import * as DevotionalActions from './devotional.actions';
import { loadCompletedTasks } from './devotional.actions';

/** Chave da feature no Store */
export const devotionalFeatureKey = 'devotional';

/** Estado inicial */
export const initialState: DevotionalState = {
  completedTasks: []
};

/** Reducer que adiciona ou remove tarefas do array completedTasks */
export const devotionalReducer = createReducer(
  initialState,
  on(DevotionalActions.markTaskComplete, (state, { task }) => ({
    ...state,
    completedTasks: Array.from(new Set([...state.completedTasks, task]))
  })),
  on(DevotionalActions.unmarkTask, (state, { task }) => ({
    ...state,
    completedTasks: state.completedTasks.filter(t => t !== task)
  })),
  on(loadCompletedTasks, (state, { tasks }) => ({
    ...state,
    completedTasks: tasks
  }))
);


