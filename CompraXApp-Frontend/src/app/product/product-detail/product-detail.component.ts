import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../product.service';
import { Product } from '../../models/Product';
import { CartService } from '../../cart/cart.service'; // Ajusta la ruta
import { AuthService } from '../../auth/auth.service'; // Ajusta la ruta
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-product-detail',
  imports: [CommonModule, FormsModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent implements OnInit {
  product: Product | undefined;
  isLoading = true;
  quantity: number = 1;
  isLoggedIn = false;
  public readonly Infinity = Infinity; 

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const productId = Number(this.route.snapshot.paramMap.get('id'));
    if (productId) {
      this.loadProduct(productId);
    } else {
      this.isLoading = false;
      // Manejar caso de ID no válido, quizás redirigir
      this.router.navigate(['/products']);
    }
    this.authService.currentUser.subscribe(user => {
      this.isLoggedIn = !!user;
    });
  }

  loadProduct(id: number): void {
    this.isLoading = true;
    this.productService.getProductById(id).subscribe({
      next: (data) => {
        this.product = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching product', err);
        this.isLoading = false;
        // Manejar error, quizás redirigir
        this.router.navigate(['/products']);
      }
    });
  }

  addToCart(): void {
    if (!this.product) return;
    
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/auth/login']);
      return;
    }

    this.cartService.addItemToCart(this.product.id, this.quantity).subscribe({
      next: (cart) => {
        console.log('Product added to cart successfully');
        // ✅ TRANSLATE: Show success notification in English
        alert('Product added to cart successfully!');
      },
      error: (err) => {
        console.error('Error adding product to cart:', err);
        // ✅ TRANSLATE: Show error notification in English
        alert('Error adding product to cart. Please try again.');
      }
    });
  }

  incrementQuantity(): void {
    this.quantity++;
  }

  decrementQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }
}