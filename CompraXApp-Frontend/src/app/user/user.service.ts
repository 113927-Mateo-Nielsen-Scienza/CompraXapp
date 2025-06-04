import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  shippingAddress?: string;
  createdAt?: Date;
  roles?: any[];
}

export interface UserUpdateRequest {
  name: string;        // ← REQUERIDO (como en backend)
  email: string;       // ← REQUERIDO (como en backend)
  shippingAddress?: string; // ← Opcional
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) { }

  // Obtener perfil del usuario actual
  getMyProfile(): Observable<UserProfile> {
    console.log('UserService - Getting profile from:', `${this.apiUrl}/me`);
    
    return this.http.get<UserProfile>(`${this.apiUrl}/me`, { 
      withCredentials: true 
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Actualizar perfil del usuario actual
  updateMyProfile(updateRequest: UserUpdateRequest): Observable<UserProfile> {
    console.log('UserService - Updating profile with:', updateRequest);
    
    return this.http.put<UserProfile>(`${this.apiUrl}/me`, updateRequest, { 
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json'
      }
    }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('UserService error:', error);
    console.error('Error status:', error.status);
    console.error('Error message:', error.message);
    
    if (error.error) {
      console.error('Error response body:', error.error);
    }
    
    let userMessage = 'An error occurred';
    
    if (error.status === 0) {
      userMessage = 'Cannot connect to server. Please check your internet connection.';
    } else if (error.status === 401) {
      userMessage = 'You are not authorized. Please log in again.';
    } else if (error.status === 403) {
      userMessage = 'You do not have permission to access this resource.';
    } else if (error.status === 404) {
      userMessage = 'Profile not found.';
    } else if (error.status === 400) {
      // Manejar errores de validación del backend
      if (error.error?.message) {
        userMessage = error.error.message;
      } else {
        userMessage = 'Invalid data provided. Please check your input.';
      }
    } else if (error.status === 500) {
      userMessage = 'Server error. Please try again later.';
    } else if (error.error?.message) {
      userMessage = error.error.message;
    }
    
    // Crear un error personalizado con mensaje amigable
    const customError = new Error(userMessage);
    (customError as any).originalError = error;
    
    return throwError(() => customError);
  }
}
