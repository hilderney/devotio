import { Injectable } from '@angular/core';
import { FirebaseAuthAdapter } from '../adapters/auth/auth-firebase.adaper';
import { User } from '../models/user.model';
import { AuthMockAdapter } from '../adapters/auth/auth-mock.adapter';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(
    // private adapter: FirebaseAuthAdapter
    private adapter: AuthMockAdapter
  ) { }

  login(email: string, password: string) {
    return this.adapter.login(email, password);
  }

  logout() {
    return this.adapter.logout();
  }

  getCurrentUser() {
    return this.adapter.getCurrentUser();
  }
}
