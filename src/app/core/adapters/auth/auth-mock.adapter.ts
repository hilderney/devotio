// src/app/infrastructure/adapters/auth-mock.adapter.ts
import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { IAuthRepository } from '../../repositories/auth.repository';
import { User } from '../../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthMockAdapter implements IAuthRepository {
  private _currentUser: User | null = null;

  login(email: string, password: string): Observable<User> {
    // Em Prod, verifique credenciais contra servidor
    const fakeUser: User = {
      uid: 'mock-uid',
      email: 'fake@mock.com',
      displayName: 'Usuário Mock'
    };
    return of(fakeUser).pipe(
      delay(500),          // fake Latency
      tap(user => this._currentUser = user)
    );
  }

  logout(): Observable<void> {
    return of(void 0).pipe(
      tap(() => this._currentUser = null)
    );
  }

  currentUser(): Observable<User | null> {
    return of(this._currentUser).pipe(delay(100));
  }

  async getCurrentUser(): Promise<User | null> {
    const user = this.mapUser(this._currentUser as User);
    return new Promise<User | null>(resolve => {
      setTimeout(() => resolve(user), 100);
    });
  }

    private mapUser(user: User): User {
      return {
        uid: user.uid,
        email: user.email ?? '',
        displayName: user.displayName ?? undefined,
      };
    }
}
