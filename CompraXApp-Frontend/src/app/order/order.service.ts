import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service'; 

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:8080/api/orders'; 

  constructor(private http: HttpClient, private authService: AuthService) { }

  createOrder(orderData: { shippingAddress: string, paymentMethod: 'MERCADOPAGO' | 'WHATSAPP' }): Observable<any> {
    if (!this.authService.isLoggedIn()) {
      return throwError(() => new Error('User not logged in'));
    }

    // Validar los datos antes de enviar
    if (!orderData.shippingAddress || orderData.shippingAddress.trim().length < 10) {
      return throwError(() => new Error('Shipping address must be at least 10 characters long'));
    }

    if (!orderData.paymentMethod || !['MERCADOPAGO', 'WHATSAPP'].includes(orderData.paymentMethod)) {
      return throwError(() => new Error('Invalid payment method'));
    }
   
    return this.http.post<any>(this.apiUrl, orderData, { withCredentials: true })
      .pipe(
        catchError(this.handleError)
      );
  }

  getOrderById(orderId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${orderId}`, { withCredentials: true })
      .pipe(
        catchError(this.handleError)
      );
  }

  getUserOrders(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/my-orders`, { withCredentials: true })
      .pipe(
        catchError(this.handleError)
      );
  }

  getAllOrders(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { withCredentials: true })
      .pipe(
        catchError(this.handleError)
      );
  }

  updateOrderStatus(orderId: number, status: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${orderId}/status`, { status }, { withCredentials: true })
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('OrderService error:', error);
    return throwError(() => error);
  }
}