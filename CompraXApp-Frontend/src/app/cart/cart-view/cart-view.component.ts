import { Component, OnInit, OnDestroy } from '@angular/core';
import { CartService } from '../cart.service';
import { CartDTO, CartItemDTO } from '../cart.service';
import { ProductService } from '../../product/product.service'; // ✅ FIX: Importar ProductService
import { Subscription, forkJoin } from 'rxjs';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cart-view',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './cart-view.component.html',
  styleUrl: './cart-view.component.css'
})
export class CartViewComponent implements OnInit, OnDestroy {
  cart: CartDTO | null = null;
  isLoading = true;
  error = '';
  productImages: { [productId: number]: string } = {}; // ✅ FIX: Cache de imágenes
  private cartSubscription: Subscription | undefined;

  constructor(
    private cartService: CartService,
    private productService: ProductService, // ✅ FIX: Inyectar ProductService
    private router: Router,
    private authService: AuthService 
  ) {}

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/auth/login']);
      return;
    }

    this.loadCart();
    
    this.cartSubscription = this.cartService.cart$.subscribe({
      next: (cart) => {
        this.cart = cart;
        this.isLoading = false;
        
        // ✅ FIX: Cargar imágenes de productos cuando cambie el carrito
        if (cart && cart.items && cart.items.length > 0) {
          this.loadProductImages();
        }
      },
      error: (err) => {
        this.error = 'Error loading cart';
        this.isLoading = false;
        console.error('Error loading cart:', err);
      }
    });
  }

  loadCart(): void {
    this.isLoading = true;
    this.cartService.getCart().subscribe({
      next: (cart) => {
        this.cart = cart;
        this.isLoading = false;
        
        // ✅ FIX: Cargar imágenes después de obtener el carrito
        if (cart && cart.items && cart.items.length > 0) {
          this.loadProductImages();
        }
      },
      error: (err) => {
        this.error = 'Error loading cart';
        this.isLoading = false;
        console.error('Error loading cart:', err);
      }
    });
  }

  // ✅ FIX: Método para cargar imágenes de productos
  private loadProductImages(): void {
    if (!this.cart || !this.cart.items) return;

    // Obtener IDs únicos de productos
    const productIds = [...new Set(this.cart.items.map(item => item.productId))];
    
    // Cargar datos de productos para obtener las imágenes
    const productRequests = productIds.map(id => 
      this.productService.getProductById(id)
    );

    forkJoin(productRequests).subscribe({
      next: (products) => {
        // Crear cache de imágenes
        products.forEach(product => {
          this.productImages[product.id] = product.imageUrl || 'assets/default-product.png';
        });
      },
      error: (err) => {
        console.error('Error loading product images:', err);
        // En caso de error, usar imagen por defecto
        productIds.forEach(id => {
          this.productImages[id] = 'assets/default-product.png';
        });
      }
    });
  }

  // ✅ FIX: Método para obtener imagen del producto
  getProductImageUrl(item: CartItemDTO): string {
    // Usar imagen cacheada o imagen por defecto
    return this.productImages[item.productId] || 'assets/default-product.png';
  }

  // ✅ FIX: Método mejorado para manejo de errores de imagen
  onImageError(event: any): void {
    const target = event.target as HTMLImageElement;
    if (!target) return;

    console.log('Image failed to load:', target.src);

    // Crear fallback visual cuando la imagen falla
    const parent = target.parentElement;
    if (parent && !parent.querySelector('.image-fallback')) {
      // Ocultar la imagen rota
      target.style.display = 'none';
      
      // Crear elemento de respaldo
      const fallback = document.createElement('div');
      fallback.className = 'image-fallback';
      fallback.innerHTML = `
        <div class="fallback-icon">📦</div>
        <div class="fallback-text">Product Image</div>
      `;
      
      // Aplicar estilos
      fallback.style.cssText = `
        width: 80px;
        height: 80px;
        background: linear-gradient(135deg, #f3f4f6, #e5e7eb);
        border: 2px solid #d1d5db;
        border-radius: 8px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: #6b7280;
        font-size: 12px;
        text-align: center;
        gap: 4px;
      `;
      
      const icon = fallback.querySelector('.fallback-icon') as HTMLElement;
      if (icon) {
        icon.style.fontSize = '24px';
      }
      
      parent.appendChild(fallback);
    }
  }

  updateQuantity(item: CartItemDTO, event: Event): void {
    const target = event.target as HTMLInputElement;
    const newQuantity = parseInt(target.value);
    
    if (isNaN(newQuantity) || newQuantity <= 0) {
      this.removeItem(item.productId);
      return;
    }

    this.cartService.updateCartItem(item.productId, newQuantity).subscribe({
      next: (cart) => {
        console.log('Quantity updated successfully');
      },
      error: (err) => {
        console.error('Error updating quantity:', err);
        // Revertir el valor en caso de error
        target.value = item.quantity.toString();
      }
    });
  }

  incrementQuantity(item: CartItemDTO): void {
    this.updateQuantityValue(item, item.quantity + 1);
  }

  decrementQuantity(item: CartItemDTO): void {
    if (item.quantity > 1) {
      this.updateQuantityValue(item, item.quantity - 1);
    }
  }

  private updateQuantityValue(item: CartItemDTO, newQuantity: number): void {
    this.cartService.updateCartItem(item.productId, newQuantity).subscribe({
      next: (cart) => {
        console.log('Quantity updated successfully');
      },
      error: (err) => {
        console.error('Error updating quantity:', err);
      }
    });
  }

  removeItem(productId: number): void {
    if (confirm('Are you sure you want to remove this item from your cart?')) {
      this.cartService.removeCartItem(productId).subscribe({
        next: (cart) => {
          console.log('Item removed successfully');
          // ✅ FIX: Limpiar imagen cacheada del producto eliminado
          delete this.productImages[productId];
        },
        error: (err) => {
          console.error('Error removing item:', err);
        }
      });
    }
  }

  clearCart(): void {
    if (confirm('Are you sure you want to clear your entire cart?')) {
      this.cartService.clearCart().subscribe({
        next: () => {
          console.log('Cart cleared successfully');
          // ✅ FIX: Limpiar cache de imágenes
          this.productImages = {};
        },
        error: (err) => {
          console.error('Error clearing cart:', err);
        }
      });
    }
  }

  proceedToCheckout(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/auth/login']);
      return;
    }

    if (!this.hasItems()) {
      return;
    }

    this.router.navigate(['/order/checkout']);
  }

  calculateItemTotal(item: CartItemDTO): number {
    return item.quantity * item.pricePerUnit;
  }

  hasItems(): boolean {
    return !!(this.cart?.items && this.cart.items.length > 0);
  }

  ngOnDestroy(): void {
    this.cartSubscription?.unsubscribe();
  }
}