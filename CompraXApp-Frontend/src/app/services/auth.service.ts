import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenService } from './token.service';

const AUTH_API = 'http://localhost:8080/api/auth/';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  constructor(private http: HttpClient, private tokenService: TokenService) { }

  login(email: string, password: string): Observable<any> {
    return this.http.post(AUTH_API + 'signin', {
      email,
      password
    });
  }

  register(name: string, email: string, password: string): Observable<any> {
    return this.http.post(AUTH_API + 'signup', {
      name,
      email,
      password
    });
  }

  requestPasswordReset(email: string): Observable<any> {
    return this.http.post(AUTH_API + 'password-reset-request', {
      email
    });
  }

  resetPassword(token: string, password: string): Observable<any> {
    return this.http.post(AUTH_API + 'reset-password', {
      token,
      password
    });
  }

  logout(): void {
    this.tokenService.signOut();
  }

  isLoggedIn(): boolean {
    return this.tokenService.getToken() !== null;
  }

  isAdmin(): boolean {
    const user = this.tokenService.getUser();
    return user && user.roles && user.roles.includes('ROLE_ADMIN');
  }
}