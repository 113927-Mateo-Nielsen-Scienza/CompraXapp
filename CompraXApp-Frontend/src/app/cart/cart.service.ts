import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { PromotionService, ProductWithPromotion } from '../services/promotion.service';

// ✅ INTERFACES EXACTAS según backend
export interface CartDTO {
  id: number;
  items: CartItemDTO[];
  totalAmount: number;
  originalTotalAmount?: number; // ✅ AGREGAR: Total original sin descuentos
  totalDiscount?: number; // ✅ AGREGAR: Total de descuentos aplicados
}

export interface CartItemDTO {
  id: number;
  productId: number;
  productName: string;
  pricePerUnit: number;
  originalPrice?: number; // ✅ AGREGAR: Precio original
  quantity: number;
  imageUrl?: string;
  // ✅ AGREGAR: Campos de promoción
  discountPercentage?: number;
  hasPromotion?: boolean;
  promotionTitle?: string;
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
    private router: Router,
    private promotionService: PromotionService // ✅ AGREGAR: Inyectar PromotionService
  ) { 
    this.loadCart();
  }

  // ✅ ENDPOINT EXACTO: GET /api/cart
  getCart(): Observable<CartDTO> {
    if (!this.authService.isLoggedIn()) {
      return throwError(() => new Error('User not logged in.'));
    }
    return this.http.get<CartDTO>(this.apiUrl).pipe(
      map(cart => this.applyPromotionsToCart(cart)), // ✅ Aplicar promociones
      tap(cart => {
        console.log('Cart loaded:', cart);
        this.cartSubject.next(cart);
      }),
      catchError(this.handleError.bind(this))
    );
  }

  // ✅ NUEVO: Aplicar promociones al carrito completo
  private applyPromotionsToCart(cart: CartDTO): CartDTO {
    if (!cart || !cart.items) return cart;

    // Aplicar promociones a cada item del carrito
    const updatedItems = cart.items.map(item => {
      // Crear un objeto "producto" temporal para aplicar promociones
      const tempProduct = {
        id: item.productId,
        name: item.productName,
        price: item.originalPrice || item.pricePerUnit, // Usar precio original
        stockQuantity: 999, // Temporal
        active: true
      };

      // Aplicar promoción
      const productWithPromotion = this.promotionService.applyPromotionToProduct(tempProduct);

      // Actualizar el item del carrito con el precio promocional
      return {
        ...item,
        pricePerUnit: productWithPromotion.price, // ✅ Precio con descuento
        originalPrice: productWithPromotion.originalPrice,
        discountPercentage: productWithPromotion.discountPercentage,
        hasPromotion: productWithPromotion.hasPromotion,
        promotionTitle: productWithPromotion.promotionTitle
      };
    });

    // Recalcular total del carrito
    const newTotalAmount = updatedItems.reduce((total, item) => {
      return total + (item.pricePerUnit * item.quantity);
    }, 0);

    return {
      ...cart,
      items: updatedItems,
      totalAmount: newTotalAmount
    };
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

  // ✅ ACTUALIZAR: Agregar producto con promociones
  addToCart(productId: number, quantity: number = 1): Observable<CartDTO> {
    const request = { productId, quantity };
    return this.http.post<CartDTO>(this.apiUrl, request).pipe(
      map(cart => this.applyPromotionsToCart(cart)), // ✅ Aplicar promociones
      tap(cart => this.cartSubject.next(cart))
    );
  }

  // ✅ ACTUALIZAR: Actualizar cantidad con promociones
  updateQuantity(cartItemId: number, quantity: number): Observable<CartDTO> {
    return this.http.put<CartDTO>(`${this.apiUrl}/update`, { cartItemId, quantity }).pipe(
      map(cart => this.applyPromotionsToCart(cart)), // ✅ Aplicar promociones
      tap(cart => this.cartSubject.next(cart))
    );
  }

  // ✅ ACTUALIZAR: Cargar carrito inicial con promociones
  private loadCart(): void {
    this.getCart().subscribe({
      next: (cart) => {
        console.log('✅ Cart loaded with promotions:', cart);
      },
      error: (error) => {
        console.log('ℹ️ No active cart found or user not logged in');
        this.cartSubject.next(null);
      }
    });
  }
}