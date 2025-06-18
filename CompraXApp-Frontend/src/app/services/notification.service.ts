import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from '../auth/auth.service';
import { tap } from 'rxjs/operators';

// ✅ CORREGIR la interface Notification según documentación del backend
export interface Notification {
  id: number;
  type: 'ORDER_CREATED' | 'PAYMENT_CONFIRMED' | 'ORDER_SHIPPED' | 'ORDER_DELIVERED' | 'PROMOTION';
  title: string;
  message: string;
  read: boolean;
  createdAt: Date | string; // ✅ Permitir tanto Date como string
  relatedOrderId?: number; // ✅ USAR relatedOrderId según backend
  actionUrl?: string; // ✅ AGREGAR para navegación
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService implements OnDestroy {
  private apiUrl = `${environment.apiUrl}/notifications`;
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  public notifications$ = this.notificationsSubject.asObservable();
  private refreshInterval: any;

  constructor(private http: HttpClient) {}

  // ✅ ENDPOINT EXACTO: GET /api/notifications
  getAllNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(this.apiUrl, {
      withCredentials: true
    }).pipe(
      tap(notifications => this.notificationsSubject.next(notifications))
    );
  }

  // Alias para compatibilidad
  getNotifications(page: number = 0, size: number = 20): Observable<any> {
    return this.getAllNotifications();
  }

  // ✅ ENDPOINT EXACTO: GET /api/notifications/unread
  getUnreadNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.apiUrl}/unread`, {
      withCredentials: true
    });
  }

  // ✅ ENDPOINT EXACTO: GET /api/notifications/unread/count
  getUnreadCount(): Observable<{unreadCount: number}> {
    return this.http.get<{unreadCount: number}>(`${this.apiUrl}/unread/count`, {
      withCredentials: true
    });
  }

  // ✅ ENDPOINT EXACTO: PUT /api/notifications/{notificationId}/read
  markAsRead(notificationId: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${notificationId}/read`, {}, {
      withCredentials: true
    });
  }

  // ✅ ENDPOINT EXACTO: PUT /api/notifications/read-all
  markAllAsRead(): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/read-all`, {}, {
      withCredentials: true
    });
  }

  // ✅ AGREGAR método para eliminar notificación (aunque no esté en backend)
  deleteNotification(notificationId: number): Observable<void> {
    // Simulación local ya que no existe en backend
    return new Observable(observer => {
      const currentNotifications = this.notificationsSubject.value;
      const filteredNotifications = currentNotifications.filter(n => n.id !== notificationId);
      this.notificationsSubject.next(filteredNotifications);
      observer.next();
      observer.complete();
    });
  }

  // Método para recargar notificaciones
  loadNotifications(): void {
    this.getAllNotifications().subscribe({
      next: (notifications) => {
        this.notificationsSubject.next(notifications);
      },
      error: (error) => {
        console.error('Error reloading notifications:', error);
      }
    });
  }

  // Métodos de utilidad para el frontend
  getNotificationIcon(type: string): string {
    switch (type) {
      case 'ORDER_CREATED': return 'fas fa-shopping-cart';
      case 'PAYMENT_CONFIRMED': return 'fas fa-credit-card';
      case 'ORDER_SHIPPED': return 'fas fa-truck';
      case 'ORDER_DELIVERED': return 'fas fa-check-circle';
      case 'PROMOTION': return 'fas fa-tag';
      default: return 'fas fa-bell';
    }
  }

  getNotificationColor(type: string): string {
    switch (type) {
      case 'ORDER_CREATED': return 'primary';
      case 'PAYMENT_CONFIRMED': return 'secondary';
      case 'ORDER_SHIPPED': return 'warning';
      case 'ORDER_DELIVERED': return 'secondary';
      case 'PROMOTION': return 'warning';
      default: return 'primary';
    }
  }

  startAutoRefresh(): void {
    // Actualizar cada 30 segundos
    this.refreshInterval = setInterval(() => {
      this.loadNotifications();
    }, 30000);
  }

  stopAutoRefresh(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }

  ngOnDestroy(): void {
    this.stopAutoRefresh();
  }
}
