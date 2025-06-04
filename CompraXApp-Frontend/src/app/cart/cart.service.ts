import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Cart, CartItem } from '../models/Cart';
import { AuthService } from '../auth/auth.service'; 

@Injectable({
  providedIn: 'root' 
})
export class CartService {
  private apiUrl = 'http://localhost:8080/api/cart';
  private cartSubject = new BehaviorSubject<Cart | null>(null);
  public cart$ = this.cartSubject.asObservable();

  constructor(private http: HttpClient, private authService: AuthService) { }

  getCart(): Observable<Cart> {
    if (!this.authService.isLoggedIn()) {
      return throwError(() => new Error('User not logged in.'));
    }
    return this.http.get<Cart>(this.apiUrl, { withCredentials: true }).pipe(
      tap(cart => {
        console.log('Cart loaded:', cart);
        this.cartSubject.next(cart);
      }),
      catchError(this.handleError)
    );
  }

  addItemToCart(item: { productId: number, quantity: number, productName: string, productPrice: number, imageUrl?: string }): Observable<Cart> {
    if (!this.authService.isLoggedIn()) {
      return throwError(() => new Error('User not logged in.'));
    }

    const params = new HttpParams()
      .set('productId', item.productId.toString())
      .set('quantity', item.quantity.toString());

    return this.http.post<Cart>(`${this.apiUrl}/items`, null, { 
      params, 
      withCredentials: true 
    }).pipe(
      tap(cart => {
        console.log('Item added to cart:', cart);
        this.cartSubject.next(cart);
      }),
      catchError(this.handleError)
    );
  }

  updateCartItem(productId: number, quantity: number): Observable<Cart> {
    if (!this.authService.isLoggedIn()) {
      return throwError(() => new Error('User not logged in.'));
    }

    const params = new HttpParams().set('quantity', quantity.toString());

    return this.http.put<Cart>(`${this.apiUrl}/items/${productId}`, null, { 
      params, 
      withCredentials: true 
    }).pipe(
      tap(cart => {
        console.log('Cart item updated:', cart);
        this.cartSubject.next(cart);
      }),
      catchError(this.handleError)
    );
  }

  removeCartItem(productId: number): Observable<Cart> {
    if (!this.authService.isLoggedIn()) {
      return throwError(() => new Error('User not logged in.'));
    }
    return this.http.delete<Cart>(`${this.apiUrl}/items/${productId}`, { withCredentials: true }).pipe(
      tap(cart => {
        console.log('Item removed from cart:', cart);
        this.cartSubject.next(cart);
      }),
      catchError(this.handleError)
    );
  }

  clearCart(): Observable<Cart> { 
    if (!this.authService.isLoggedIn()) {
      return throwError(() => new Error('User not logged in.'));
    }
    return this.http.delete<Cart>(this.apiUrl, { withCredentials: true }).pipe( 
      tap(cart => {
        console.log('Cart cleared:', cart);
        this.cartSubject.next(cart);
      }),
      catchError(this.handleError)
    );
  }

  getCurrentCartValue(): Cart | null {
    return this.cartSubject.value;
  }

  // Método helper para calcular total localmente si es necesario
  calculateCartTotal(cart: Cart | null): number {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((total, item) => total + (item.pricePerUnit * item.quantity), 0);
  }

  private handleError(error: any) {
    console.error('CartService error:', error);
    return throwError(() => error);
  }
}