// core/services/user.service.ts
import { inject, Injectable } from '@angular/core';
import { IUserRepository } from '../repositories/user.repository';
import { User } from '../models/user.model';
import { FirestoreUserAdapter } from '../adapters/firestore/firestore-user.adapter';

@Injectable({ providedIn: 'root' })
export class UserService {
  // Troque esse adapter quando quiser mudar backend
  private repo: IUserRepository = new FirestoreUserAdapter();

  getUser(id: string) {
    return this.repo.getUser(id);
  }

  saveUser(user: User) {
    return this.repo.saveUser(user);
  }

  deleteUser(id: string) {
    return this.repo.deleteUser(id);
  }
}
