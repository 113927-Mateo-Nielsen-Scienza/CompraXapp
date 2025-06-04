import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Product } from '../models/Product';
import { AuthService } from '../auth/auth.service';

export interface ProductSalesDTO {
  productId: number;
  productName: string;
  totalQuantitySold: number;
  totalRevenue: number;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  // Gestión de Productos
  createProduct(productData: FormData): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}/products`, productData, { 
      withCredentials: true 
    }).pipe(
      catchError(this.handleError)
    );
  }

  updateProduct(id: number, productData: FormData): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/products/${id}`, productData, { 
      withCredentials: true 
    }).pipe(
      catchError(this.handleError)
    );
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/products/${id}`, { 
      withCredentials: true 
    }).pipe(
      catchError(this.handleError)
    );
  }

  getAllProducts(keyword?: string, minPrice?: number, maxPrice?: number): Observable<Product[]> {
    let params = new HttpParams();
    if (keyword) params = params.set('keyword', keyword);
    if (minPrice !== undefined) params = params.set('minPrice', minPrice.toString());
    if (maxPrice !== undefined) params = params.set('maxPrice', maxPrice.toString());
    
    return this.http.get<Product[]>(`${this.apiUrl}/products`, { 
      params, 
      withCredentials: true 
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Reportes
  getProductSalesStatistics(): Observable<ProductSalesDTO[]> {
    return this.http.get<ProductSalesDTO[]>(`${this.apiUrl}/admin/reports/product-sales`, { 
      withCredentials: true 
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Gestión de Usuarios
  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/users`, { 
      withCredentials: true 
    }).pipe(
      catchError(this.handleError)
    );
  }

  updateUserRoles(userId: number, roles: string[]): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/${userId}/roles`, roles, { 
      withCredentials: true 
    }).pipe(
      catchError(this.handleError)
    );
  }

  deleteUser(userId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${userId}`, { 
      withCredentials: true 
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Gestión de Órdenes
  getAllOrders(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/orders`, { 
      withCredentials: true 
    }).pipe(
      catchError(this.handleError)
    );
  }

  updateOrderStatus(orderId: number, status: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/orders/${orderId}/status`, { status }, { 
      withCredentials: true 
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Métodos JSON para productos
  createProductJSON(productData: any): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}/products`, productData, { 
      withCredentials: true,
      headers: { 'Content-Type': 'application/json' }
    }).pipe(
      catchError(this.handleError)
    );
  }

  updateProductJSON(id: number, productData: any): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/products/${id}`, productData, { 
      withCredentials: true,
      headers: { 'Content-Type': 'application/json' }
    }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    console.error('AdminService error:', error);
    return throwError(() => error);
  }
}
