import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface ActivePromotionDTO {
  id: number;
  title: string;
  description: string;
  discountPercentage: number;
  startDate: string;
  endDate: string;
  active: boolean;
}

export interface ProductWithPromotion {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice: number; // ✅ Nuevo
  discountPercentage?: number; // ✅ Nuevo
  hasPromotion: boolean; // ✅ Nuevo
  promotionTitle?: string; // ✅ Nuevo
  stockQuantity: number;
  imageUrl?: string;
  active: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class PromotionService {
  private apiUrl = `${environment.apiUrl}`;
  private activePromotionsSubject = new BehaviorSubject<ActivePromotionDTO[]>([]);
  public activePromotions$ = this.activePromotionsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadActivePromotions();
  }

  // ✅ Obtener promociones activas (endpoint público)
  getActivePromotions(): Observable<ActivePromotionDTO[]> {
    return this.http.get<ActivePromotionDTO[]>(`${this.apiUrl}/promotions/active`).pipe(
      tap(promotions => {
        console.log('✅ Active promotions loaded:', promotions);
        this.activePromotionsSubject.next(promotions);
      })
    );
  }

  // ✅ Cargar promociones activas
  loadActivePromotions(): void {
    this.getActivePromotions().subscribe({
      next: (promotions) => {
        console.log('✅ Promotions loaded:', promotions);
      },
      error: (error) => {
        console.error('❌ Error loading promotions:', error);
        this.activePromotionsSubject.next([]);
      }
    });
  }

  // ✅ Aplicar promociones a un producto
  applyPromotionToProduct(product: any): ProductWithPromotion {
    const activePromotions = this.activePromotionsSubject.value;
    
    if (activePromotions.length === 0) {
      return {
        ...product,
        originalPrice: product.price,
        hasPromotion: false
      };
    }

    // Por simplicidad, aplicamos la primera promoción activa
    // En un sistema más complejo, podrías tener promociones específicas por producto/categoría
    const promotion = activePromotions[0];
    const discountAmount = (product.price * promotion.discountPercentage) / 100;
    const discountedPrice = product.price - discountAmount;

    return {
      ...product,
      price: discountedPrice,
      originalPrice: product.price,
      discountPercentage: promotion.discountPercentage,
      hasPromotion: true,
      promotionTitle: promotion.title
    };
  }

  // ✅ Aplicar promociones a lista de productos
  applyPromotionsToProducts(products: any[]): ProductWithPromotion[] {
    return products.map(product => this.applyPromotionToProduct(product));
  }

  // ✅ Obtener descuento máximo disponible
  getMaxDiscount(): number {
    const activePromotions = this.activePromotionsSubject.value;
    if (activePromotions.length === 0) return 0;
    
    return Math.max(...activePromotions.map(p => p.discountPercentage));
  }

  // ✅ Verificar si hay promociones activas
  hasActivePromotions(): boolean {
    return this.activePromotionsSubject.value.length > 0;
  }
}
