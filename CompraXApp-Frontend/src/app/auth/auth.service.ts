import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User, AuthResponse } from '../models/User';
import { Router } from '@angular/router';

export interface VerificationRequest {
  email: string;
  code: string;
}

export interface MessageResponse {
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';
  private currentUserSubject: BehaviorSubject<any | null>;
  public currentUser: Observable<any | null>;
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    let initialUser: any | null = null;
    if (this.isBrowser) {
      const storedUser = localStorage.getItem('currentUser');
      try {
        initialUser = storedUser ? JSON.parse(storedUser) : null;
      } catch (e) {
        initialUser = null;
        localStorage.removeItem('currentUser');
      }
    }
    this.currentUserSubject = new BehaviorSubject<any | null>(initialUser);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): any | null {
    return this.currentUserSubject.value;
  }

  register(userData: any): Observable<any> {
    // No guardar en localStorage para registro, solo retornar la respuesta
    return this.http.post<any>(`${this.apiUrl}/signup`, userData);
  }

  verifyAccount(verificationData: VerificationRequest): Observable<MessageResponse> {
    return this.http.post<MessageResponse>(`${this.apiUrl}/verify-account`, verificationData)
      .pipe(
        catchError(this.handleError)
      );
  }

  login(credentials: any): Observable<any> {
    // Importante: withCredentials: true para cookies de sesión
    return this.http.post<any>(`${this.apiUrl}/signin`, credentials, { withCredentials: true }).pipe(
      tap(response => {
        if (this.isBrowser) {
          localStorage.setItem('currentUser', JSON.stringify(response));
        }
        this.currentUserSubject.next(response);
      }),
      catchError(this.handleError)
    );
  }

  logout(): void {
    // Llamar al endpoint de logout del backend
    this.http.post(`${this.apiUrl}/logout`, {}, { withCredentials: true }).subscribe({
      next: () => {
        this.clearUserData();
      },
      error: () => {
        // Limpiar datos locales incluso si hay error en el server
        this.clearUserData();
      }
    });
  }

  private clearUserData(): void {
    if (this.isBrowser) {
      localStorage.removeItem('currentUser');
    }
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  isLoggedIn(): boolean {
    return !!this.currentUserValue;
  }

  isAdmin(): boolean {
    return this.isLoggedIn() && (
      this.currentUserValue?.roles?.includes('ROLE_ADMIN') || 
      this.currentUserValue?.authorities?.some((auth: { authority: string; }) => auth.authority === 'ROLE_ADMIN')
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocurrió un error desconocido.';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.error?.message || error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(error.error?.message || errorMessage));
  }
}
