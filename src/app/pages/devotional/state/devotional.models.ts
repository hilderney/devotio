// src/app/state/devotional/devotional.models.ts

/** Enum de tarefas devocionais */
export enum TasksEnum {
  Verse = 'Verse',
  Reflection = 'Reflection',
  Prayer = 'Prayer',
  Citation = 'Citation',
  Music = 'Music',
}

/** Estado da feature devotional */
export interface DevotionalState {
  /** Lista de tarefas já concluídas */
  completedTasks: TasksEnum[];
}
