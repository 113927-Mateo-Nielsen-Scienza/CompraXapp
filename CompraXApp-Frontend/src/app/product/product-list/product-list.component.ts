import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService, ProductResponse } from '../product.service'; // ✅ Usar ProductResponse
import { CartService } from '../../cart/cart.service';
import { AuthService, LoginResponse } from '../../auth/auth.service'; // ✅ Usar LoginResponse
import { Product } from '../../models/Product';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {
  products: ProductResponse[] = []; // ✅ Cambiar tipo
  allProducts: ProductResponse[] = []; // ✅ Cambiar tipo
  isLoading = true;
  currentUser: LoginResponse | null = null; // ✅ Cambiar tipo
  viewMode: 'grid' | 'list' = 'grid';
  searchKeyword = '';
  minPrice?: number;
  maxPrice?: number;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
    });
    
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading = true;
    
    this.productService.getProducts(
      this.searchKeyword || undefined,
      this.minPrice,
      this.maxPrice
    ).subscribe({
      next: (products) => {
        this.allProducts = products.filter(p => p.active);
        this.products = [...this.allProducts];
        this.isLoading = false;
      },
      error: (err) => {
        console.error("Failed to load products", err);
        this.isLoading = false;
      }
    });
  }

  onSearch(): void {
    this.filterProducts();
  }

  onPriceChange(): void {
    this.filterProducts();
  }

  filterProducts(): void {
    // Filtrar localmente para respuesta más rápida
    let filtered = this.allProducts;
    
    // Filtro por palabra clave
    if (this.searchKeyword && this.searchKeyword.trim()) {
      const keyword = this.searchKeyword.toLowerCase().trim();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(keyword) ||
        // ✅ CORREGIR: Verificar si description existe
        (product.description && product.description.toLowerCase().includes(keyword))
      );
    }

    // Filtro por precio mínimo
    if (this.minPrice !== undefined && this.minPrice !== null && this.minPrice > 0) {
      filtered = filtered.filter(product => product.price >= this.minPrice!);
    }

    // Filtro por precio máximo
    if (this.maxPrice !== undefined && this.maxPrice !== null && this.maxPrice > 0) {
      filtered = filtered.filter(product => product.price <= this.maxPrice!);
    }

    this.products = filtered;
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