import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../product.service';
import { Product } from '../../models/Product';
import { CartService } from '../../cart/cart.service'; // Ajusta la ruta
import { AuthService } from '../../auth/auth.service'; // Ajusta la ruta
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PromotionService, ProductWithPromotion } from '../../services/promotion.service';

@Component({
  selector: 'app-product-detail',
  imports: [CommonModule, FormsModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent implements OnInit {
  product: ProductWithPromotion | null = null;
  quantity: number = 1;
  isLoading = true;
  isLoggedIn = false;
  public readonly Infinity = Infinity; 

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService,
    private authService: AuthService,
    private promotionService: PromotionService
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

    this.promotionService.activePromotions$.subscribe(promotions => {
      if (promotions.length > 0 && this.product) {
        this.refreshProductWithPromotions();
      }
    });
  }

  refreshProductWithPromotions(): void {
    if (this.product) {
      this.product = this.promotionService.applyPromotionToProduct(this.product);
    }
  }

  loadProduct(id: number): void {
    this.isLoading = true;
    this.productService.getProductById(id).subscribe({
      next: (product) => {
        this.product = product;
        this.isLoading = false;
        console.log('✅ Product loaded with promotions:', product);
      },
      error: (error) => {
        console.error('❌ Error loading product:', error);
        this.isLoading = false;
        // Manejar error, quizás redirigir
        this.router.navigate(['/products']);
      }
    });
  }

  addToCart(): void {
    if (!this.product) return;
    
    if (!this.isLoggedIn) {
      this.router.navigate(['/auth/login']);
      return;
    }

    this.cartService.addItemToCart(this.product.id, this.quantity).subscribe({
      next: (cart) => {
        console.log('✅ Product added to cart with promotional price');
        // Mostrar mensaje de éxito
        alert('Product added to cart successfully!');
      },
      error: (error) => {
        console.error('❌ Error adding to cart:', error);
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