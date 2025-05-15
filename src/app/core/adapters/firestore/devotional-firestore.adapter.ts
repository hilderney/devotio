import { Injectable } from '@angular/core';
import { Firestore, collection, deleteDoc, doc, setDoc } from '@angular/fire/firestore';
import { TasksEnum } from '../../../pages/devotional/state/devotional.models';


@Injectable({ providedIn: 'root' })
export class DevotionalFirestoreAdapter {
  constructor(private firestore: Firestore) { }

  async markTaskComplete(userId: string, task: TasksEnum): Promise<void> {
    const ref = doc(this.firestore, `users/${userId}/completedTasks/${task}`);
    await setDoc(ref, { completedAt: new Date() });
  }

  async markTaskUncomplete(userId: string, task: TasksEnum): Promise<void> {
    const ref = doc(this.firestore, `users/${userId}/completedTasks/${task}`);
    await deleteDoc(ref);
  }
}
