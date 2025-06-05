import { Observable } from 'rxjs';
import { User } from '../models/user.model';

export interface IAuthRepository {
  login(email: string, password: string): Observable<User>;
  logout(): Observable<void>;
  currentUser(): Observable<User | null>;
  refreshToken?(): Observable<string>; // opcional
}
