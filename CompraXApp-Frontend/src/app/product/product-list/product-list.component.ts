import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService, ProductResponse } from '../product.service'; // ✅ Usar ProductResponse
import { CartService } from '../../cart/cart.service';
import { AuthService, LoginResponse } from '../../auth/auth.service'; // ✅ Usar LoginResponse
import { Product } from '../../models/Product';
import { PromotionService, ProductWithPromotion } from '../../services/promotion.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {
  products: ProductWithPromotion[] = []; // ✅ Cambiar tipo
  allProducts: ProductWithPromotion[] = []; // ✅ Cambiar tipo
  isLoading = true;
  currentUser: LoginResponse | null = null;
  viewMode: 'grid' | 'list' = 'grid';
  searchKeyword = '';
  minPrice?: number;
  maxPrice?: number;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private authService: AuthService,
    private router: Router,
    private promotionService: PromotionService // ✅ Inyectar
  ) { }

  ngOnInit(): void {
    this.loadProducts();
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
    });

    // ✅ Escuchar cambios en promociones
    this.promotionService.activePromotions$.subscribe(promotions => {
      if (promotions.length > 0 && this.allProducts.length > 0) {
        this.refreshProductsWithPromotions();
      }
    });
  }

  // ✅ NUEVO: Refrescar productos cuando cambien las promociones
  refreshProductsWithPromotions(): void {
    this.products = this.promotionService.applyPromotionsToProducts(this.allProducts);
    this.filterProducts();
  }

  loadProducts(): void {
    this.isLoading = true;
    
    this.productService.getProducts(this.searchKeyword, this.minPrice, this.maxPrice)
      .subscribe({
        next: (products) => {
          this.allProducts = products;
          this.products = [...products];
          this.isLoading = false;
          console.log('✅ Products loaded with promotions:', products);
        },
        error: (error) => {
          console.error('❌ Error loading products:', error);
          this.isLoading = false;
        }
      });
  }

  // ✅ ACTUALIZAR: Filtrar productos considerando precio con descuento
  filterProducts(): void {
    let filtered = this.allProducts;
    
    if (this.searchKeyword && this.searchKeyword.trim()) {
      const keyword = this.searchKeyword.toLowerCase().trim();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(keyword) ||
        (product.description && product.description.toLowerCase().includes(keyword))
      );
    }

    // ✅ Usar precio con descuento para filtros
    if (this.minPrice !== undefined && this.minPrice !== null && this.minPrice > 0) {
      filtered = filtered.filter(product => product.price >= this.minPrice!);
    }

    if (this.maxPrice !== undefined && this.maxPrice !== null && this.maxPrice > 0) {
      filtered = filtered.filter(product => product.price <= this.maxPrice!);
    }

    this.products = filtered;
  }

  onSearch(): void {
    this.filterProducts();
  }

  onPriceChange(): void {
    this.filterProducts();
  }

  clearFilters(): void {
    this.searchKeyword = '';
    this.minPrice = undefined;
    this.maxPrice = undefined;
    this.products = [...this.allProducts];
  }

  setViewMode(mode: 'grid' | 'list'): void {
    this.viewMode = mode;
  }

  addToCart(product: ProductResponse, quantity: number = 1): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/auth/login']);
      return;
    }

    // ✅ Usar método corregido
    this.cartService.addItemToCart(product.id, quantity).subscribe({
      next: (cart) => {
        console.log('Product added to cart successfully');
        // Mostrar feedback al usuario
      },
      error: (err) => {
        console.error('Error adding product to cart:', err);
      }
    });
  }

  viewProduct(product: ProductResponse): void {
    this.router.navigate(['/products', product.id]);
  }

  trackByProductId(index: number, product: Product): number {
    return product.id;
  }

  onImageError(event: any): void {
    event.target.src = 'assets/default-product.png';
  }

  private showNotification(message: string, type: 'success' | 'error'): void {
    if (type === 'success') {
      const notification = document.createElement('div');
      notification.className = 'notification success';
      notification.textContent = message;
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--secondary-color);
        color: white;
        padding: 1rem 2rem;
        border-radius: 0.5rem;
        z-index: 9999;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        transform: translateX(100%);
        transition: transform 0.3s ease;
      `;
      
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.style.transform = 'translateX(0)';
      }, 100);
      
      setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
          document.body.removeChild(notification);
        }, 300);
      }, 3000);
    } else {
      alert(message);
    }
  }
}