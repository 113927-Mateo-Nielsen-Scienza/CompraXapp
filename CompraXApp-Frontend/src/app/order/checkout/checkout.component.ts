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
    this.checkoutForm = this.fb.group({
      shippingAddress: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(255)]],
      paymentMethod: ['MERCADOPAGO', Validators.required]
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

  // Método para calcular el total del carrito
  calculateTotal(): number {
    if (this.cart?.totalAmount !== undefined) {
      return this.cart.totalAmount;
    }
    return this.cartService.calculateCartTotal(this.cart);
  }

  // Método para verificar si el carrito tiene items
  hasItems(): boolean {
    return !!(this.cart && this.cart.items && this.cart.items.length > 0);
  }

  placeOrder(): void {
    this.validationErrors = {};
    this.errorMessage = '';

    // Validar formulario
    if (this.checkoutForm.invalid) {
      this.markFormGroupTouched(this.checkoutForm);
      this.errorMessage = 'Please fill in all required fields correctly.';
      return;
    }

    // Validar carrito
    if (!this.hasItems()) {
      this.errorMessage = 'Your cart is empty. Cannot place order.';
      return;
    }

    // Validar que el usuario esté autenticado
    if (!this.authService.isLoggedIn()) {
      this.errorMessage = 'You must be logged in to place an order.';
      this.router.navigate(['/auth/login']);
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const orderData = {
      shippingAddress: this.checkoutForm.value.shippingAddress.trim(),
      paymentMethod: this.checkoutForm.value.paymentMethod
    };

    console.log('Sending order data:', orderData);

    this.orderService.createOrder(orderData).subscribe({
      next: (order) => {
        this.isSubmitting = false;
        console.log('Order created successfully:', order);
        
        // Limpiar el carrito
        this.cartService.clearCart().subscribe({
          next: () => console.log('Cart cleared'),
          error: (err) => console.warn('Failed to clear cart:', err)
        });
    
        // Mostrar mensaje de éxito y redirigir
        alert(`Order placed successfully! Order ID: ${order.id}`);
        this.router.navigate(['/products']);
      },
      error: (err) => {
        this.isSubmitting = false;
        console.error('Order creation failed:', err);
        
        if (err.status === 400 && err.error) {
          if (err.error.details) {
            this.validationErrors = err.error.details;
            this.errorMessage = 'Please correct the validation errors below.';
          } else {
            this.errorMessage = err.error.error || err.error.message || 'Validation failed. Please check your data.';
          }
        } else if (err.status === 401) {
          this.errorMessage = 'You are not logged in. Please log in and try again.';
          this.router.navigate(['/auth/login'], { queryParams: { returnUrl: '/order/checkout' } });
        } else if (err.status === 0) {
          this.errorMessage = 'Cannot connect to server. Please check your internet connection.';
        } else {
          this.errorMessage = err.error?.message || 'Failed to place order. Please try again.';
        }
      }
    });
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

  // Métodos de ayuda para el template
  isFieldInvalid(fieldName: string): boolean {
    const field = this.checkoutForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.checkoutForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return `${fieldName} is required`;
      if (field.errors['minlength']) return `${fieldName} must be at least ${field.errors['minlength'].requiredLength} characters`;
      if (field.errors['maxlength']) return `${fieldName} must not exceed ${field.errors['maxlength'].requiredLength} characters`;
    }
    return this.validationErrors[fieldName] || '';
  }
}