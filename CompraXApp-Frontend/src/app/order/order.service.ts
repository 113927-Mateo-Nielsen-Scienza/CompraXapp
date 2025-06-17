import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AuthService } from '../auth/auth.service';

// ✅ INTERFACES EXACTAS según backend
export interface OrderDTO {
  id: number;
  userId: number;
  userName: string;
  orderDate: string;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  shippingStatus: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED';
  totalAmount: number;
  shippingAddress: string;
  trackingNumber?: string;
  shippingDate?: string;
  deliveryDate?: string;
  items: OrderItemDTO[];
}

export interface OrderItemDTO {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  pricePerUnit: number;
}

export interface CreateOrderRequest {
  shippingAddress: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = `${environment.apiUrl}/orders`;

  constructor(private http: HttpClient, private authService: AuthService) { }

  // ✅ ENDPOINT EXACTO: POST /api/orders
  createOrder(orderData: CreateOrderRequest): Observable<OrderDTO> {
    if (!this.authService.isLoggedIn()) {
      return throwError(() => new Error('User not logged in'));
    }

    if (!orderData.shippingAddress || orderData.shippingAddress.trim().length < 10) {
      return throwError(() => new Error('Shipping address must be at least 10 characters long'));
    }
   
    return this.http.post<OrderDTO>(this.apiUrl, orderData).pipe(catchError(this.handleError));
  }

  // ✅ ENDPOINT EXACTO: GET /api/orders/my-orders
  getUserOrders(): Observable<OrderDTO[]> {
    return this.http.get<OrderDTO[]>(`${this.apiUrl}/my-orders`).pipe(catchError(this.handleError));
  }

  // ✅ AGREGAR método faltante como alias
  getOrderById(orderId: number): Observable<OrderDTO> {
    return this.getOrderDetails(orderId);
  }

  // ✅ ENDPOINT EXACTO: GET /api/orders/{orderId}/details
  getOrderDetails(orderId: number): Observable<OrderDTO> {
    return this.http.get<OrderDTO>(`${this.apiUrl}/${orderId}/details`).pipe(catchError(this.handleError));
  }

  // ✅ ENDPOINT EXACTO: POST /api/orders/{orderId}/whatsapp-payment
  requestWhatsAppPayment(orderId: number): Observable<{whatsappLink: string}> {
    return this.http.post<{whatsappLink: string}>(`${this.apiUrl}/${orderId}/whatsapp-payment`, {}).pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Error en la orden';
    
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