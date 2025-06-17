import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

// ✅ INTERFACES EXACTAS según backend
export interface CartDTO {
  id: number;
  items: CartItemDTO[];
  totalAmount: number;
}

export interface CartItemDTO {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  pricePerUnit: number;
}

@Injectable({
  providedIn: 'root' 
})
export class CartService {
  private apiUrl = `${environment.apiUrl}/cart`;
  private cartSubject = new BehaviorSubject<CartDTO | null>(null);
  public cart$ = this.cartSubject.asObservable();

  constructor(
    private http: HttpClient, 
    private authService: AuthService,
    private router: Router
  ) { }

  // ✅ ENDPOINT EXACTO: GET /api/cart
  getCart(): Observable<CartDTO> {
    if (!this.authService.isLoggedIn()) {
      return throwError(() => new Error('User not logged in.'));
    }
    return this.http.get<CartDTO>(this.apiUrl).pipe(
      tap(cart => {
        console.log('Cart loaded:', cart);
        this.cartSubject.next(cart);
      }),
      catchError(this.handleError.bind(this))
    );
  }

  // ✅ ENDPOINT EXACTO: POST /api/cart/items?productId={}&quantity={}
  addItemToCart(productId: number, quantity: number): Observable<CartDTO> {
    if (!this.authService.isLoggedIn()) {
      return throwError(() => new Error('User not logged in.'));
    }

    const params = new HttpParams()
      .set('productId', productId.toString())
      .set('quantity', quantity.toString());

    return this.http.post<CartDTO>(`${this.apiUrl}/items`, null, { params }).pipe(
      tap(cart => {
        console.log('Item added to cart:', cart);
        this.cartSubject.next(cart);
      }),
      catchError(this.handleError.bind(this))
    );
  }

  // ✅ ENDPOINT EXACTO: PUT /api/cart/items/{productId}?quantity={}
  updateCartItem(productId: number, quantity: number): Observable<CartDTO> {
    if (!this.authService.isLoggedIn()) {
      return throwError(() => new Error('User not logged in.'));
    }

    const params = new HttpParams().set('quantity', quantity.toString());

    return this.http.put<CartDTO>(`${this.apiUrl}/items/${productId}`, null, { params }).pipe(
      tap(cart => {
        console.log('Cart item updated:', cart);
        this.cartSubject.next(cart);
      }),
      catchError(this.handleError.bind(this))
    );
  }

  // ✅ ENDPOINT EXACTO: DELETE /api/cart/items/{productId}
  removeCartItem(productId: number): Observable<CartDTO> {
    if (!this.authService.isLoggedIn()) {
      return throwError(() => new Error('User not logged in.'));
    }

    return this.http.delete<CartDTO>(`${this.apiUrl}/items/${productId}`).pipe(
      tap(cart => {
        console.log('Item removed from cart:', cart);
        this.cartSubject.next(cart);
      }),
      catchError(this.handleError.bind(this))
    );
  }

  // ✅ ENDPOINT EXACTO: DELETE /api/cart
  clearCart(): Observable<void> {
    if (!this.authService.isLoggedIn()) {
      return throwError(() => new Error('User not logged in.'));
    }

    return this.http.delete<void>(this.apiUrl).pipe(
      tap(() => {
        console.log('Cart cleared');
        this.cartSubject.next(null);
      }),
      catchError(this.handleError.bind(this))
    );
  }

  getCurrentCartValue(): CartDTO | null {
    return this.cartSubject.value;
  }

  getTotal(): number {
    const cart = this.getCurrentCartValue();
    return cart?.totalAmount || 0;
  }

  calculateCartTotal(cart: CartDTO | null): number {
    if (!cart?.items) return 0;
    return cart.items.reduce((total, item) => total + (item.quantity * item.pricePerUnit), 0);
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Cart error';
    
    if (error.status === 401) {
      this.authService.logout();
      return throwError(() => new Error('Session expired. Please log in again.'));
    }
    
    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.error?.error) {
      errorMessage = error.error.error;
    }
    
    return throwError(() => new Error(errorMessage));
  }
}