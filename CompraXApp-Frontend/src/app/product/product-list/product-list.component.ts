import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../product.service';
import { CartService } from '../../cart/cart.service';
import { AuthService } from '../../auth/auth.service';
import { Product } from '../../models/Product';
import { AuthResponse } from '../../models/User';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  allProducts: Product[] = []; // Agregar para mantener todos los productos
  isLoading = true;
  currentUser: AuthResponse | null = null;
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
    
    // Usar los parámetros de filtro en la llamada al backend
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
    let filtered = [...this.allProducts];

    // Filtro por palabra clave
    if (this.searchKeyword && this.searchKeyword.trim()) {
      const keyword = this.searchKeyword.toLowerCase().trim();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(keyword) ||
        product.description.toLowerCase().includes(keyword)
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

  addToCart(product: Product): void {
    if (!this.currentUser) {
      this.router.navigate(['/auth/login']);
      return;
    }

    const cartItem = {
      productId: product.id,
      quantity: 1,
      productName: product.name,
      productPrice: product.price,
      imageUrl: product.imageUrl
    };

    this.cartService.addItemToCart(cartItem).subscribe({
      next: (cart) => {
        this.showNotification(`${product.name} added to cart!`, 'success');
      },
      error: (err) => {
        console.error("Failed to add to cart", err);
        this.showNotification('Failed to add product to cart', 'error');
      }
    });
  }

  viewProduct(product: Product): void {
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