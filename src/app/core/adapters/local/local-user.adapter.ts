import { User } from '../../models/user.model';
import { Observable, of } from 'rxjs';
import { IUserRepository } from '../../repositories/user.repository';

export class LocalUserAdapter implements IUserRepository {
  getUser(id: string): Observable<User | null> {
    const data = localStorage.getItem(`user-${id}`);
    return of(data ? JSON.parse(data) : null);
  }

  saveUser(user: User): Observable<void> {
    localStorage.setItem(`user-${user.id}`, JSON.stringify(user));
    return of(void 0);
  }

  deleteUser(id: string): Observable<void> {
    localStorage.removeItem(`user-${id}`);
    return of(void 0);
  }
}
