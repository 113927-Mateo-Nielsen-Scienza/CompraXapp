import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-payment-success',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payment-success.component.html',
  styleUrls: ['./payment-success.component.css']
})
export class PaymentSuccessComponent implements OnInit {
  orderId: string = '';
  paymentMethod: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.orderId = this.route.snapshot.queryParams['order_id'] || '';
    this.paymentMethod = this.route.snapshot.queryParams['method'] || '';
  }

  goToOrders(): void {
    this.router.navigate(['/user/orders']);
  }

  goToHome(): void {
    this.router.navigate(['/products']);
  }
}
