import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

// ✅ ALIAS PARA EVITAR CONFLICTOS
export interface AdminPaymentDTO {
  id: number;
  orderId: number;
  method: 'MERCADO_PAGO' | 'WHATSAPP';
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  amount: number;
  paymentDate: string;
  externalPaymentId?: string;
}

// ✅ EXPORT correcto para AdminPaymentsComponent usando export type
export type { AdminPaymentDTO as PaymentDTO };

// ✅ INTERFACES EXACTAS según backend
export interface ProductSalesDTO {
  productId: number;
  productName: string;
  totalQuantitySold: number;
  totalRevenue: number;
}

export interface UserDTO {
  id: number;
  name: string;
  email: string;
  shippingAddress?: string;
  roles: string[];
  active: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {}

  // ✅ ENDPOINT EXACTO: GET /api/admin/payments/pending
  getPendingPayments(): Observable<AdminPaymentDTO[]> {
    return this.http.get<AdminPaymentDTO[]>(`${this.apiUrl}/admin/payments/pending`)
      .pipe(catchError(this.handleError.bind(this)));
  }

  // ✅ ENDPOINT EXACTO: POST /api/admin/payments/{paymentId}/confirm
  confirmPayment(paymentId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/admin/payments/${paymentId}/confirm`, {})
      .pipe(catchError(this.handleError.bind(this)));
  }

  // ✅ ENDPOINT EXACTO: GET /api/admin/reports/product-sales
  getProductSalesStatistics(): Observable<ProductSalesDTO[]> {
    return this.http.get<ProductSalesDTO[]>(`${this.apiUrl}/admin/reports/product-sales`)
      .pipe(catchError(this.handleError.bind(this)));
  }

  // ✅ MÉTODOS QUE DEBEN USAR OTROS SERVICIOS
  // Para usuarios - usar UserService
  getAllUsers(): Observable<UserDTO[]> {
    return this.http.get<UserDTO[]>(`${this.apiUrl}/users`)
      .pipe(catchError(this.handleError.bind(this)));
  }

  updateUserRoles(userId: number, roles: string[]): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/users/${userId}/roles`, roles)
      .pipe(catchError(this.handleError.bind(this)));
  }

  deleteUser(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/users/${userId}`)
      .pipe(catchError(this.handleError.bind(this)));
  }

  // Para productos - usar ProductService
  getAllProducts(keyword?: string, minPrice?: number, maxPrice?: number): Observable<any[]> {
    let params = new HttpParams();
    if (keyword) params = params.set('keyword', keyword);
    if (minPrice !== undefined) params = params.set('minPrice', minPrice.toString());
    if (maxPrice !== undefined) params = params.set('maxPrice', maxPrice.toString());
    
    return this.http.get<any[]>(`${this.apiUrl}/products`, { params })
      .pipe(catchError(this.handleError.bind(this)));
  }

  createProductJSON(productData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/products`, productData)
      .pipe(catchError(this.handleError.bind(this)));
  }

  updateProductJSON(productId: number, productData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/products/${productId}`, productData)
      .pipe(catchError(this.handleError.bind(this)));
  }

  deleteProduct(productId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/products/${productId}`)
      .pipe(catchError(this.handleError.bind(this)));
  }

  // Para órdenes - usar OrderService
  getAllOrders(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/orders`)
      .pipe(catchError(this.handleError.bind(this)));
  }

  updateOrderStatus(orderId: number, status: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/orders/${orderId}/status`, { status })
      .pipe(catchError(this.handleError.bind(this)));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Error en operación admin';
    
    if (error.status === 401) {
      this.authService.logout();
      this.router.navigate(['/auth/login'], {
        queryParams: { returnUrl: this.router.url }
      });
      return throwError(() => new Error('Sesión expirada'));
    }
    
    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.error?.error) {
      errorMessage = error.error.error;
    }
    
    return throwError(() => new Error(errorMessage));
  }
}
