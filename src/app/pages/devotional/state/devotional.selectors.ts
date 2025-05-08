import { createFeatureSelector, createSelector } from '@ngrx/store';
import { DevotionalState } from './devotional.models';

export const selectDevotionalState = createFeatureSelector<DevotionalState>('devotional');

export const selectCompletedTasks = createSelector(
  selectDevotionalState,
  (state) => state.completedTasks
);

export const isTaskCompleted = (task: any) => createSelector(
  selectCompletedTasks,
  (tasks) => tasks.includes(task)
);
