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
    if (!this.isLoggedIn) {
      alert('Please log in to add products to your cart.');
      this.router.navigate(['/auth/login'], { queryParams: { returnUrl: this.router.url } });
      return;
    }

    const item = {
      productId: this.product.id,
      quantity: this.quantity,
      productName: this.product.name,
      productPrice: this.product.price,
      imageUrl: this.product.imageUrl
    };
    this.cartService.addItemToCart(item).subscribe({
      next: () => {
        alert(`${this.product?.name} (x${this.quantity}) added to cart!`);
      },
      error: (err) => {
        alert(`Failed to add ${this.product?.name} to cart. ` + (err.error?.message || 'Please try again.'));
        console.error(err);
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