import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

// ✅ INTERFACES EXACTAS según backend
export interface User {
  id: number;
  name: string;
  email: string;
  shippingAddress?: string;
  roles: string[];
  active: boolean;
  enabled: boolean;
}

export interface UserUpdateRequest {
  name: string;        // REQUERIDO
  email: string;       // REQUERIDO  
  shippingAddress?: string; // OPCIONAL
}

export interface UserProfileResponse {
  id: number;
  name: string;
  email: string;
  shippingAddress?: string;
  roles: string[];
  purchaseHistory: OrderDTO[];
}

// ✅ Importar OrderDTO del OrderService
interface OrderDTO {
  id: number;
  userId: number;
  userName: string;
  orderDate: string;
  status: string;
  shippingStatus: string;
  totalAmount: number;
  shippingAddress: string;
  trackingNumber?: string;
  shippingDate?: string;
  deliveryDate?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) { }

  // ✅ ENDPOINT EXACTO: GET /api/users/me
  getMyProfile(): Observable<UserProfileResponse> {
    return this.http.get<UserProfileResponse>(`${this.apiUrl}/me`, {
      withCredentials: true
    }).pipe(catchError(this.handleError));
  }

  // ✅ ENDPOINT EXACTO: PUT /api/users/me
  updateMyProfile(updateRequest: UserUpdateRequest): Observable<UserProfileResponse> {
    return this.http.put<UserProfileResponse>(`${this.apiUrl}/me`, updateRequest, {
      withCredentials: true,
      headers: { 'Content-Type': 'application/json' }
    }).pipe(catchError(this.handleError));
  }

  // ✅ ENDPOINT EXACTO: DELETE /api/users/me
  deleteMyAccount(): Observable<{message: string}> {
    return this.http.delete<{message: string}>(`${this.apiUrl}/me`, {
      withCredentials: true
    }).pipe(catchError(this.handleError));
  }

  // ✅ ENDPOINT EXACTO: GET /api/users/me/purchase-history
  getMyPurchaseHistory(): Observable<OrderDTO[]> {
    return this.http.get<OrderDTO[]>(`${this.apiUrl}/me/purchase-history`, {
      withCredentials: true
    }).pipe(catchError(this.handleError));
  }

  // ✅ MÉTODOS ADMIN - endpoints exactos
  getUserById(id: number): Observable<UserProfileResponse> {
    return this.http.get<UserProfileResponse>(`${this.apiUrl}/${id}`, {
      withCredentials: true
    }).pipe(catchError(this.handleError));
  }

  updateUser(id: number, updateRequest: UserUpdateRequest): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, updateRequest, {
      withCredentials: true,
      headers: { 'Content-Type': 'application/json' }
    }).pipe(catchError(this.handleError));
  }

  deleteUser(id: number): Observable<{message: string}> {
    return this.http.delete<{message: string}>(`${this.apiUrl}/${id}`, {
      withCredentials: true
    }).pipe(catchError(this.handleError));
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl, {
      withCredentials: true
    }).pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Error en el servicio de usuario';
    
    if (error.status === 401) {
      errorMessage = 'No autorizado';
    } else if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.error?.error) {
      errorMessage = error.error.error;
    }
    
    return throwError(() => new Error(errorMessage));
  }
}
