import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../models/order,models';

const API_URL = 'http://localhost:8080/api/';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  
  constructor(private http: HttpClient) { }

  getUserPurchaseHistory(userId: number): Observable<Order[]> {
    return this.http.get<Order[]>(`${API_URL}users/${userId}/purchase-history`);
  }

  getOrderDetails(orderId: number): Observable<Order> {
    return this.http.get<Order>(`${API_URL}orders/${orderId}`);
  }
}