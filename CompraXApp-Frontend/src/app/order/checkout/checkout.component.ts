import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../cart/cart.service'; 
import { OrderService } from '../order.service';
import { Cart } from '../../models/Cart';
import { AuthService } from '../../auth/auth.service'; 
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-checkout',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {
  checkoutForm: FormGroup;
  cart: Cart | null = null;
  isLoading = true;
  isSubmitting = false;
  errorMessage: string = '';
  validationErrors: any = {};

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router
  ) {
    // ✅ SOLO campo shippingAddress según documentación backend
    this.checkoutForm = this.fb.group({
      shippingAddress: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]]
    });
  }

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/auth/login'], { queryParams: { returnUrl: '/order/checkout' } });
      return;
    }

    this.cartService.cart$.subscribe({
      next: (cartData) => {
        this.cart = cartData;
        this.isLoading = false;
        
        if (!this.hasItems()) {
          this.errorMessage = 'Your cart is empty. Add items before checkout.';
          setTimeout(() => {
            this.router.navigate(['/products']);
          }, 2000);
        }
      },
      error: (err) => {
        console.error("Failed to load cart for checkout", err);
        this.isLoading = false;
        this.errorMessage = 'Failed to load cart. Please try again.';
      }
    });

    // Cargar el carrito si no está disponible
    if (!this.cartService.getCurrentCartValue()) {
      this.cartService.getCart().subscribe({
        error: (err) => {
          console.error("Failed to load cart initially", err);
          this.isLoading = false;
          this.errorMessage = 'Failed to load cart. Please try again.';
        }
      });
    }
  }

  getTotal(): number {
    if (!this.cart || !this.cart.items) return 0;
    return this.cart.totalAmount || this.cart.items.reduce((total, item) => total + (item.quantity * item.pricePerUnit), 0);
  }

  calculateTotal(): number {
    if (!this.cart?.items) return 0;
    return this.cart.items.reduce((total, item) => total + (item.quantity * item.pricePerUnit), 0);
  }

  hasItems(): boolean {
    return !!(this.cart && this.cart.items && this.cart.items.length > 0);
  }

  placeOrder(): void {
    this.validationErrors = {};
    this.errorMessage = '';

    if (this.checkoutForm.invalid) {
      this.markFormGroupTouched(this.checkoutForm);
      this.errorMessage = 'Please fill in all required fields correctly.';
      return;
    }

    if (!this.hasItems()) {
      this.errorMessage = 'Your cart is empty. Cannot place order.';
      return;
    }

    if (!this.authService.isLoggedIn()) {
      this.errorMessage = 'You must be logged in to place an order.';
      this.router.navigate(['/auth/login']);
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    // ✅ ESTRUCTURA EXACTA del backend
    const checkoutData = {
      shippingAddress: this.checkoutForm.value.shippingAddress.trim()
    };

    console.log('Saving checkout data:', checkoutData);
    sessionStorage.setItem('checkoutData', JSON.stringify(checkoutData));
    
    this.isSubmitting = false;
    this.router.navigate(['/payment/method-selection']);
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.checkoutForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.checkoutForm.get(fieldName);
    if (field && field.errors && (field.dirty || field.touched)) {
      if (field.errors['required']) {
        return `${fieldName} is required`;
      }
      if (field.errors['minlength']) {
        return `${fieldName} must be at least ${field.errors['minlength'].requiredLength} characters`;
      }
      if (field.errors['maxlength']) {
        return `${fieldName} must be no more than ${field.errors['maxlength'].requiredLength} characters`;
      }
    }
    return '';
  }
}