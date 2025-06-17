import { Routes } from '@angular/router';
import { PaymentMethodSelectionComponent } from './payment/payment-method-selection/payment-method-selection.component';
import { MercadopagoPaymentComponent } from './payment/mercadopago-payment/mercadopago-payment.component';
import { WhatsappPaymentComponent } from './payment/whatsapp-payment/whatsapp-payment.component';
import { PaymentSuccessComponent } from './payment/payment-success/payment-success.component';
import { OrderConfirmationComponent } from './order/order-confirmation/order-confirmation.component';
import { OrderHistoryComponent } from './user/order-history/order-history.component';
import { OrderDetailsComponent } from './order/order-details/order-details.component';

export const routes: Routes = [
  // ✅ Módulos principales SIN guards - Spring Security maneja todo
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'products',
    loadChildren: () => import('./product/product.module').then(m => m.ProductModule)
  },
  {
    path: 'cart',
    loadChildren: () => import('./cart/cart.module').then(m => m.CartModule)
    // ✅ SIN canActivate - Spring Security maneja la autorización
  },
  {
    path: 'order',
    loadChildren: () => import('./order/order.module').then(m => m.OrderModule)
    // ✅ SIN canActivate - Spring Security maneja la autorización
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
    // ✅ SIN canActivate - Spring Security maneja la autorización
  },
  {
    path: 'user',
    loadChildren: () => import('./user/user.module').then(m => m.UserModule)
    // ✅ SIN canActivate - Spring Security maneja la autorización
  },

  // ✅ Rutas específicas SIN guards
  {
    path: 'payment/method-selection',
    component: PaymentMethodSelectionComponent
    // ✅ SIN canActivate - El backend rechaza si no hay sesión
  },
  {
    path: 'payment/mercadopago',
    component: MercadopagoPaymentComponent
  },
  {
    path: 'payment/whatsapp',
    component: WhatsappPaymentComponent
  },
  {
    path: 'payment/success',
    component: PaymentSuccessComponent
  },

  // ✅ Rutas de órdenes SIN guards
  {
    path: 'order/confirmation/:id',
    component: OrderConfirmationComponent
  },
  {
    path: 'user/orders',
    component: OrderHistoryComponent
  },
  {
    path: 'order/details/:id',
    component: OrderDetailsComponent
  },

  // ✅ Rutas administrativas SIN guards
  {
    path: 'admin/payments',
    loadComponent: () => import('./admin/admin-payments/admin-payments.component').then(m => m.AdminPaymentsComponent)
  },

  // ✅ Páginas legales y ayuda (públicas)
  {
    path: 'terms',
    loadComponent: () => import('./legal/terms-of-service/terms-of-service.component').then(c => c.TermsOfServiceComponent)
  },
  {
    path: 'privacy',
    loadComponent: () => import('./legal/privacy-policy/privacy-policy.component').then(c => c.PrivacyPolicyComponent)
  },
  {
    path: 'help',
    loadComponent: () => import('./help/help-center/help-center.component').then(c => c.HelpCenterComponent)
  },
  {
    path: 'contact',
    loadComponent: () => import('./support/contact/contact.component').then(c => c.ContactComponent)
  },
  {
    path: 'manual',
    loadComponent: () => import('./help/user-manual/user-manual.component').then(c => c.UserManualComponent)
  },

  // Redirecciones
  {
    path: '',
    redirectTo: '/products',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/products' 
  }
];
