import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CheckoutComponent } from './checkout/checkout.component';
// import { OrderConfirmationComponent } from './order-confirmation/order-confirmation.component'; // Suponiendo que lo creas

const routes: Routes = [
  {
    path: 'checkout',
    component: CheckoutComponent
  },
  // { // DESCOMENTA Y AJUSTA CUANDO CREES EL COMPONENTE
  //   path: 'confirmation/:id',
  //   component: OrderConfirmationComponent
  // },
  {
    path: '',
    redirectTo: 'checkout',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderRoutingModule { }
