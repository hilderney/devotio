// infrastructure/adapters/firestore-user.adapter.ts
import { IUserRepository } from '../../repositories/user.repository';
import { Firestore, collection, doc, getDoc, setDoc, deleteDoc } from '@angular/fire/firestore';
import { inject } from '@angular/core';
import { from, map, Observable, of } from 'rxjs';
import { User } from '../../models/user.model';

export class FirestoreUserAdapter implements IUserRepository {
  private firestore = inject(Firestore);

  getUser(id: string): Observable<User | null> {
    const ref = doc(this.firestore, `users/${id}`);
    return from(getDoc(ref)).pipe(
      map(snapshot => snapshot.exists() ? snapshot.data() as User : null));
  }

  saveUser(user: User): Observable<void> {
    const ref = doc(this.firestore, `users/${user.uid}`);
    return from(setDoc(ref, user));
  }

  deleteUser(id: string): Observable<void> {
    const ref = doc(this.firestore, `users/${id}`);
    return from(deleteDoc(ref));
  }
}
