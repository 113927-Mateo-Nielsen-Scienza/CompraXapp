import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../auth/auth.service'; 
import { CartService } from '../../cart/cart.service'; 
import { Subscription } from 'rxjs';
import { AuthResponse } from '../../models/User';
import { Cart } from '../../models/Cart';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit, OnDestroy {
  currentUser: AuthResponse | null = null;
  cartItemCount: number = 0;
  mobileMenuOpen = false;
  isUserMenuOpen = false;
  private authSubscription: Subscription | undefined;
  private cartSubscription: Subscription | undefined;

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authSubscription = this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.cartService.getCart().subscribe({
          error: (err) => console.error('Error loading cart in navbar:', err)
        });
      } else {
        this.cartItemCount = 0;
      }
    });

    this.cartSubscription = this.cartService.cart$.subscribe((cart: Cart | null) => {
      this.cartItemCount = cart ? cart.items.reduce((sum, item) => sum + item.quantity, 0) : 0;
    });
  }

  logout(): void {
    this.authService.logout();
    this.closeMobileMenu();
    this.closeUserMenu(); 
  }

 
  get isLoggedIn(): boolean {
    return !!this.currentUser;
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  getUserName(): string {
    if (!this.currentUser) return '';
    return this.currentUser.username || this.currentUser.email?.split('@')[0] || '';
  }

  getUserInitials(): string {
    const name = this.getUserName();
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
  }

  toggleUserMenu(): void {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  closeUserMenu(): void {
    this.isUserMenuOpen = false;
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }
}