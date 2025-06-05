import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signOut, User as FirebaseUser } from '@angular/fire/auth';
import { inject } from '@angular/core';
import { AuthRepository, User } from '../../models/user.model';

@Injectable({ providedIn: 'root' })
export class FirebaseAuthAdapter implements AuthRepository {
  private auth = inject(Auth);

  async login(email: string, password: string): Promise<User> {
    const cred = await signInWithEmailAndPassword(this.auth, email, password);
    return this.mapUser(cred.user);
  }

  async logout(): Promise<void> {
    await signOut(this.auth);
  }

  async getCurrentUser(): Promise<User | null> {
    const user = this.auth.currentUser;
    return user ? this.mapUser(user) : null;
  }

  private mapUser(user: FirebaseUser): User {
    return {
      uid: user.uid,
      email: user.email ?? '',
      displayName: user.displayName ?? undefined,
    };
  }
}
