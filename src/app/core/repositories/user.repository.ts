// core/repositories/user.repository.ts
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

export interface IUserRepository {
  getUser(id: string): Observable<User | null>;
  saveUser(user: User): Observable<void>;
  deleteUser(id: string): Observable<void>;
}
