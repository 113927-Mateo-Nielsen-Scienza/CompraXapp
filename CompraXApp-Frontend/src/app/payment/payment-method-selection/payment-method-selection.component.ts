import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CartService, CartItemDTO } from '../../cart/cart.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-payment-method-selection',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payment-method-selection.component.html',
  styleUrls: ['./payment-method-selection.component.css']
})
export class PaymentMethodSelectionComponent implements OnInit {
  cartItems: CartItemDTO[] = [];
  total: number = 0;
  user: any;

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCartData();
    this.loadUserData();
    this.validateCheckout();
  }

  validateCheckout(): void {
    // Verificar que hay datos de checkout
    const checkoutData = sessionStorage.getItem('checkoutData');
    if (!checkoutData) {
      this.router.navigate(['/checkout']);
      return;
    }

    // Verificar que hay items en el carrito
    if (this.cartItems.length === 0) {
      this.router.navigate(['/cart']);
      return;
    }
  }

  loadCartData(): void {
    const cart = this.cartService.getCurrentCartValue();
    this.cartItems = cart?.items || [];
    this.total = cart?.totalAmount || 0;
  }

  loadUserData(): void {
    this.user = this.authService.getCurrentUser();
  }

  selectMercadoPago(): void {
    this.router.navigate(['/payment/mercadopago']);
  }

  selectWhatsAppPayment(): void {
    this.router.navigate(['/payment/whatsapp']);
  }

  goBack(): void {
    this.router.navigate(['/order/checkout']);
  }
}
