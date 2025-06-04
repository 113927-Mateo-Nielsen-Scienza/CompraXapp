import { Component, OnInit, OnDestroy } from '@angular/core';
import { CartService } from '../cart.service';
import { Cart, CartItem } from '../../models/Cart';
import { Subscription } from 'rxjs';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cart-view',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './cart-view.component.html',
  styleUrl: './cart-view.component.css'
})
export class CartViewComponent implements OnInit, OnDestroy {
  cart: Cart | null = null;
  isLoading = true;
  private cartSubscription: Subscription | undefined;

  constructor(
    private cartService: CartService,
    private router: Router,
    private authService: AuthService 
  ) {}

  ngOnInit(): void {
    // Suscribirse a los cambios del carrito
    this.cartSubscription = this.cartService.cart$.subscribe(cart => {
      this.cart = cart;
      this.isLoading = false;
      console.log('Cart updated:', cart); // Debug temporal
    });

    // Cargar el carrito si no está disponible
    if (!this.cartService.getCurrentCartValue()) {
      this.cartService.getCart().subscribe({
        error: (err) => {
          console.error("Failed to load cart initially", err);
          this.isLoading = false;
        }
      });
    } else {
      this.isLoading = false;
    }
  }

  updateQuantity(item: CartItem, newQuantity: number): void {
    if (newQuantity < 1 || isNaN(newQuantity)) return;
   
    this.cartService.updateCartItem(item.productId, newQuantity).subscribe({
      next: (updatedCart) => {
        console.log('Quantity updated successfully');
      },
      error: err => {
        console.error('Failed to update quantity:', err);
        alert('Failed to update quantity: ' + (err.error?.message || 'Try again'));
      }
    });
  }

  incrementQuantity(item: CartItem): void {
    this.updateQuantity(item, item.quantity + 1);
  }

  decrementQuantity(item: CartItem): void {
    if (item.quantity > 1) {
      this.updateQuantity(item, item.quantity - 1);
    }
  }

  removeItem(item: CartItem): void {
    if (confirm(`Are you sure you want to remove ${item.productName} from your cart?`)) {
      this.cartService.removeCartItem(item.productId).subscribe({
        next: () => {
          console.log('Item removed successfully');
        },
        error: err => {
          console.error('Failed to remove item:', err);
          alert('Failed to remove item: ' + (err.error?.message || 'Try again'));
        }
      });
    }
  }

  clearCart(): void {
    if (confirm('Are you sure you want to clear your entire cart?')) {
      this.cartService.clearCart().subscribe({
        next: () => {
          console.log('Cart cleared successfully');
        },
        error: err => {
          console.error('Failed to clear cart:', err);
          alert('Failed to clear cart: ' + (err.error?.message || 'Try again'));
        }
      });
    }
  }

  proceedToCheckout(): void {
    if (this.cart && this.cart.items.length > 0) {
      this.router.navigate(['/order/checkout']);
    } else {
      alert('Your cart is empty.');
    }
  }

  ngOnDestroy(): void {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

  calculateItemTotal(item: CartItem): number {
    // Usar subtotal del backend si está disponible, sino calcular
    if (item.subtotal !== undefined) {
      return item.subtotal;
    }
    return (item.pricePerUnit || 0) * item.quantity;
  }

  // Calcular subtotal (suma de todos los items)
  getSubtotal(): number {
    if (!this.cart || !this.cart.items) return 0;
    return this.cart.items.reduce((total, item) => total + this.calculateItemTotal(item), 0);
  }

  // Usar totalAmount del backend
  getCartTotal(): number {
    if (this.cart?.totalAmount !== undefined) {
      return this.cart.totalAmount;
    }
    return this.getSubtotal();
  }

  // Contar total de items en el carrito
  getTotalItems(): number {
    if (!this.cart || !this.cart.items) return 0;
    return this.cart.items.reduce((total, item) => total + item.quantity, 0);
  }

  hasItems(): boolean {
    return !!(this.cart && this.cart.items && this.cart.items.length > 0);
  }

  onImageError(event: any): void {
    event.target.src = 'assets/default-product.png';
  }
}