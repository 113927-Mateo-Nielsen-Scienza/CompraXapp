import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../order.service';
import { AuthService } from '../../auth/auth.service';
import { ProductService } from '../../product/product.service'; // ✅ AGREGAR

interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  pricePerUnit: number;
  imageUrl?: string;
}

interface Order {
  id: number;
  userId: number;
  status: string;
  totalAmount: number;
  shippingAddress: string;
  paymentMethod?: string;
  createdAt: string;
  items: OrderItem[];
}

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css']
})
export class OrderDetailsComponent implements OnInit {
  order: Order | null = null;
  loading = true;
  error = '';
  orderId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService,
    private authService: AuthService,
    private productService: ProductService // ✅ AGREGAR
  ) {}

  ngOnInit(): void {
    // Verificar autenticación
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/auth/login']);
      return;
    }

    // Obtener ID del order de la ruta
    this.route.params.subscribe(params => {
      this.orderId = +params['id'];
      if (this.orderId) {
        this.loadOrderDetails();
      } else {
        this.error = 'Invalid order ID';
        this.loading = false;
      }
    });
  }

  loadOrderDetails(): void {
    this.loading = true;
    this.error = '';
    
    this.orderService.getOrderById(this.orderId).subscribe({
      next: (response) => {
        console.log('🔍 Order response from backend:', response); // ✅ DEBUG
        
        // ✅ FIX: Adaptar la respuesta del backend
        this.order = this.adaptOrderData(response);
        
        console.log('🔍 Adapted order data:', this.order); // ✅ DEBUG
        
        // ✅ CARGAR IMÁGENES REALES DESPUÉS DE OBTENER EL ORDER
        this.loadProductImages();
      },
      error: (err) => {
        console.error('❌ Error loading order:', err);
        this.error = 'Failed to load order details. Please try again.';
        this.loading = false;
      }
    });
  }

  // ✅ NUEVO: Cargar imágenes reales de productos
  private loadProductImages(): void {
    if (!this.order?.items || this.order.items.length === 0) {
      this.loading = false;
      return;
    }

    console.log('🔍 Loading product images for items:', this.order.items);

    // Para cada item, intentar cargar la imagen del producto
    const imagePromises = this.order.items.map(item => {
      return new Promise<void>((resolve) => {
        if (item.productId) {
          this.productService.getProductById(item.productId).subscribe({
            next: (product) => {
              console.log(`🔍 Loaded product ${item.productId}:`, product);
              if (product && product.imageUrl) {
                item.imageUrl = product.imageUrl;
                console.log(`✅ Updated image for ${item.productName}:`, item.imageUrl);
              }
              resolve();
            },
            error: (err) => {
              console.warn(`⚠️ Failed to load product ${item.productId}:`, err);
              resolve(); // Continuar aunque falle
            }
          });
        } else {
          resolve();
        }
      });
    });

    // Esperar a que todas las imágenes se carguen (o fallen)
    Promise.all(imagePromises).then(() => {
      console.log('🔍 Final order with loaded images:', this.order);
      this.loading = false;
    });
  }

  // ✅ NUEVO: Adaptar datos del backend a la estructura esperada
  private adaptOrderData(backendData: any): Order {
    console.log('🔍 Raw backend data:', backendData);

    // ✅ FIX: Adaptar estructura dependiendo de cómo llegan los datos
    const order: Order = {
      id: backendData.id || 0,
      userId: backendData.userId || backendData.user_id || 0,
      status: backendData.status || 'UNKNOWN',
      totalAmount: this.parsePrice(backendData.totalAmount || backendData.total_amount || backendData.total || 0),
      shippingAddress: backendData.shippingAddress || backendData.shipping_address || 'No address provided',
      paymentMethod: backendData.paymentMethod || backendData.payment_method || 'Unknown',
      createdAt: backendData.createdAt || backendData.created_at || new Date().toISOString(),
      items: this.adaptOrderItems(backendData.items || backendData.orderItems || [])
    };

    console.log('🔍 Final adapted order:', order);
    return order;
  }

  // ✅ NUEVO: Adaptar items del pedido
  private adaptOrderItems(backendItems: any[]): OrderItem[] {
    console.log('🔍 Raw backend items:', backendItems);

    if (!Array.isArray(backendItems)) {
      console.warn('⚠️ Backend items is not an array:', backendItems);
      return [];
    }

    const adaptedItems = backendItems.map((item, index) => {
      console.log(`🔍 Processing item ${index}:`, item);

      const adaptedItem: OrderItem = {
        id: item.id || index,
        productId: item.productId || item.product_id || 0,
        productName: item.productName || item.product_name || item.name || `Product ${index + 1}`,
        quantity: this.parseQuantity(item.quantity || item.qty || 1),
        pricePerUnit: this.parsePrice(item.pricePerUnit || item.price_per_unit || item.price || item.unitPrice || 0),
        imageUrl: 'assets/default-product.png' // ✅ Inicializar con imagen por defecto
      };

      console.log(`🔍 Adapted item ${index}:`, adaptedItem);
      return adaptedItem;
    });

    console.log('🔍 All adapted items:', adaptedItems);
    return adaptedItems;
  }

  // ✅ NUEVO: Parse seguro de precios
  private parsePrice(value: any): number {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      // Remover símbolos de moneda y espacios
      const cleanValue = value.replace(/[$,\s]/g, '');
      const parsed = parseFloat(cleanValue);
      return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  }

  // ✅ NUEVO: Parse seguro de cantidad
  private parseQuantity(value: any): number {
    if (typeof value === 'number') return Math.max(1, Math.floor(value));
    if (typeof value === 'string') {
      const parsed = parseInt(value, 10);
      return isNaN(parsed) ? 1 : Math.max(1, parsed);
    }
    return 1;
  }

  // ✅ FIX: Obtener imagen del producto con fallback múltiple
  getProductImageUrl(item: OrderItem): string {
    const imageUrl = item.imageUrl || 'assets/default-product.png';
    console.log(`🔍 Image URL for ${item.productName}:`, imageUrl);
    return imageUrl;
  }

  // ✅ FIX: Manejo de error de imagen
  onImageError(event: any): void {
    const target = event.target as HTMLImageElement;
    if (target) {
      console.log('🔍 Image failed to load, using fallback');
      target.src = 'assets/default-product.png';
    }
  }

  // ✅ FIX: Calcular subtotal con debugging
  getSubtotal(): number {
    if (!this.order?.items) {
      console.log('🔍 No items for subtotal calculation');
      return 0;
    }

    const subtotal = this.order.items.reduce((sum, item) => {
      const itemTotal = (item.quantity || 0) * (item.pricePerUnit || 0);
      console.log(`🔍 Item ${item.productName}: ${item.quantity} x $${item.pricePerUnit} = $${itemTotal}`);
      return sum + itemTotal;
    }, 0);

    console.log(`🔍 Total subtotal: $${subtotal}`);
    return subtotal;
  }

  // ✅ FIX: Obtener total del item con debugging
  getItemTotal(item: OrderItem): number {
    const total = (item.quantity || 0) * (item.pricePerUnit || 0);
    console.log(`🔍 Item total for ${item.productName}: ${item.quantity} x $${item.pricePerUnit} = $${total}`);
    return total;
  }

  // Verificar si se puede descargar factura
  canDownloadInvoice(): boolean {
    return this.order?.status !== 'CANCELLED' && this.order?.status !== 'PENDING';
  }

  // Verificar si se puede cancelar el pedido
  canCancelOrder(): boolean {
    return this.order?.status === 'PENDING' || this.order?.status === 'CONFIRMED';
  }

  // Descargar factura
  downloadInvoice(): void {
    if (this.order) {
      alert(`Downloading invoice for order #${this.order.id}`);
    }
  }

  // Cancelar pedido
  cancelOrder(): void {
    if (!this.order) return;

    const confirmed = confirm('Are you sure you want to cancel this order?');
    if (confirmed) {
      alert('Order cancellation requested');
    }
  }

  // Volver a orders
  goBack(): void {
    this.router.navigate(['/user/orders']);
  }

  getStatusText(status: string): string {
    const statusTexts: { [key: string]: string } = {
      'PENDING': 'Pending',
      'CONFIRMED': 'Confirmed',
      'PROCESSING': 'Processing',
      'SHIPPED': 'Shipped',
      'DELIVERED': 'Delivered',
      'CANCELLED': 'Cancelled'
    };
    return statusTexts[status?.toUpperCase()] || status || 'Unknown';
  }

  getPaymentMethodText(method: string): string {
    const methodTexts: { [key: string]: string } = {
      'CREDIT_CARD': 'Credit Card',
      'DEBIT_CARD': 'Debit Card',
      'MERCADOPAGO': 'MercadoPago',
      'WHATSAPP': 'WhatsApp Coordination',
      'BANK_TRANSFER': 'Bank Transfer'
    };
    return methodTexts[method?.toUpperCase()] || method || 'Unknown';
  }

  // TrackBy function
  trackByItemId(index: number, item: OrderItem): number {
    return item.id || item.productId || index;
  }
}
