import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OrderService, OrderDTO } from '../../order/order.service';
import { AuthService } from '../../auth/auth.service';
import { UserService, UserProfileResponse, UserUpdateRequest } from '../user.service';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {
  orders: OrderDTO[] = [];
  loading = true;
  error = '';
  currentPage = 1;
  totalPages = 1;
  pageSize = 10;

  userProfile: UserProfileResponse | null = null;
  isEditing = false;
  isLoading = true;
  isSaving = false;
  errorMessage = '';
  successMessage = '';

  profileForm: FormGroup;

  constructor(
    private orderService: OrderService,
    private authService: AuthService,
    public router: Router,
    private userService: UserService,
    private fb: FormBuilder
  ) {
    this.profileForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      shippingAddress: ['']
    });
  }

  ngOnInit(): void {
    this.loadOrders();
    this.loadProfile();
  }

  loadOrders(page: number = 1): void {
    this.loading = true;
    this.orderService.getUserOrders().subscribe({
      next: (orders: OrderDTO[]) => {
        console.log('🔍 Raw orders from backend:', orders);
        
       
        if (orders.length > 0) {
          console.log('🔍 First order structure:', orders[0]);
          if (orders[0].items && orders[0].items.length > 0) {
            console.log('🔍 First item structure:', orders[0].items[0]);
            console.log('🔍 All fields in first item:', Object.keys(orders[0].items[0]));
          }
        }
        
        this.orders = this.processOrders(orders);
        console.log('🔍 Processed orders:', this.orders);
        
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error loading order history';
        this.loading = false;
        console.error('Error loading orders:', error);
      }
    });
  }

  // ✅ AGREGAR estos métodos al final del componente

  // ✅ TrackBy functions para mejor performance
  trackByOrderId(index: number, order: OrderDTO): number {
    return order.id;
  }

  trackByItemId(index: number, item: any): number {
    return item.id || index;
  }

  // ✅ MEJORAR: Proceso de orders para manejar datos del backend específico
  private processOrders(orders: OrderDTO[]): OrderDTO[] {
    console.log('🔍 Processing orders:', orders);
    
    return orders.map(order => {
      console.log(`🔍 Processing order ${order.id}:`, order);
      
      // ✅ FIX: Process items with better null handling and proper typing
      const processedItems = (order.items || []).map((item, index) => {
        console.log(`🔍 Raw item data:`, item);
        
        // ✅ Cast to any for field access or create a more flexible approach
        const itemData = item as any;
        
        // ✅ SEARCH for price in multiple possible fields with null checks
        const possiblePriceFields = [
          'pricePerUnit', 'price_per_unit', 'unitPrice', 'unit_price', 
          'price', 'cost', 'amount', 'productPrice', 'product_price'
        ];
        
        let foundPrice = 0;
        for (const field of possiblePriceFields) {
          const value = itemData[field];
          if (value !== null && value !== undefined && value !== '' && !isNaN(Number(value))) {
            foundPrice = this.parsePrice(value);
            if (foundPrice > 0) {
              console.log(`🔍 Found valid price in field '${field}': ${value} -> ${foundPrice}`);
              break;
            }
          }
        }
        
        // ✅ If no price found, calculate from order total
        if (foundPrice === 0 && order.totalAmount && order.items?.length) {
          const orderTotal = this.parsePrice(order.totalAmount);
          if (orderTotal > 0) {
            foundPrice = orderTotal / order.items.length;
            console.log(`🔍 Calculated price from order total: ${orderTotal} / ${order.items.length} = ${foundPrice}`);
          }
        }
        
        // ✅ Find quantity with better handling
        const possibleQuantityFields = ['quantity', 'qty', 'count', 'units'];
        let foundQuantity = 1;
        
        for (const field of possibleQuantityFields) {
          const value = itemData[field];
          if (value !== null && value !== undefined && value !== '' && !isNaN(Number(value))) {
            foundQuantity = this.parseQuantity(value);
            if (foundQuantity > 0) {
              console.log(`🔍 Found valid quantity in field '${field}': ${value} -> ${foundQuantity}`);
              break;
            }
          }
        }
        
        const processedItem = {
          id: item.id || index,
          productId: item.productId || 0, // ✅ FIX: Use correct property name
          productName: item.productName || `Product ${index + 1}`, // ✅ FIX: Use correct property name
          quantity: foundQuantity,
          pricePerUnit: foundPrice,
          // ✅ Keep original data for debugging
          originalData: itemData
        };
        
        console.log(`🔍 Processed item:`, processedItem);
        return processedItem;
      });
      
      const processedOrder = {
        ...order,
        items: processedItems,
        totalAmount: this.parsePrice(order.totalAmount),
        shippingStatus: order.shippingStatus || order.status || 'PENDING'
      };
      
      console.log(`🔍 Final processed order:`, processedOrder);
      return processedOrder;
    });
  }

  // ✅ MEJORAR: parsePrice para manejar diferentes tipos
  private parsePrice(value: any): number {
    console.log(`🔍 Parsing price:`, value, `(type: ${typeof value})`);
    
    // ✅ Handle null, undefined, empty string
    if (value === null || value === undefined || value === '') {
      console.log(`🔍 Null/undefined/empty price, returning 0`);
      return 0;
    }
    
    // ✅ If already a valid number
    if (typeof value === 'number' && !isNaN(value) && isFinite(value)) {
      const result = Math.max(0, value);
      console.log(`🔍 Valid number price: ${result}`);
      return result;
    }
    
    // ✅ If string, clean and convert
    if (typeof value === 'string') {
      const cleanValue = value.trim().replace(/[$,\s€£¥]/g, '');
      if (cleanValue === '') {
        console.log(`🔍 Empty string after cleaning: returning 0`);
        return 0;
      }
      
      const parsed = parseFloat(cleanValue);
      const result = isNaN(parsed) ? 0 : Math.max(0, parsed);
      console.log(`🔍 String to number: "${value}" -> "${cleanValue}" -> ${result}`);
      return result;
    }
    
    console.log(`🔍 Fallback to 0 for value:`, value);
    return 0;
  }

  // ✅ MEJORAR: parseQuantity para validación
  private parseQuantity(value: any): number {
    console.log(`🔍 Parsing quantity:`, value, `(type: ${typeof value})`);
    
    if (typeof value === 'number' && !isNaN(value) && isFinite(value)) {
      return Math.max(1, Math.floor(value));
    }
    
    if (typeof value === 'string') {
      const parsed = parseInt(value, 10);
      const result = isNaN(parsed) ? 1 : Math.max(1, parsed);
      console.log(`🔍 String to quantity: "${value}" -> ${result}`);
      return result;
    }
    
    console.log(`🔍 Fallback to 1 for quantity:`, value);
    return 1;
  }

  // ✅ NUEVO: Calcular total del item de forma segura
  getItemTotal(item: any): number {
    const price = this.getItemPrice(item);
    const quantity = this.getItemQuantity(item);
    const total = price * quantity;
    
    console.log(`🔍 Total calculation for ${item.productName}:`);
    console.log(`   - Price: ${price}`);
    console.log(`   - Quantity: ${quantity}`);
    console.log(`   - Total: ${total}`);
    
    return total;
  }

  // ✅ MEJORAR: getItemPrice con logging
  getItemPrice(item: any): number {
    console.log(`🔍 Getting price for item:`, item);
    
    // ✅ Primer intento: usar pricePerUnit procesado
    if (item.pricePerUnit && item.pricePerUnit > 0) {
      console.log(`🔍 Using pricePerUnit: ${item.pricePerUnit}`);
      return item.pricePerUnit;
    }
    
    // ✅ Segundo intento: buscar en datos originales
    if (item.originalData) {
      const originalPrice = this.findPriceInObject(item.originalData);
      if (originalPrice > 0) {
        console.log(`🔍 Found price in original data: ${originalPrice}`);
        return originalPrice;
      }
    }
    
    // ✅ Tercer intento: precio estimado basado en el total de la order
    const estimatedPrice = this.getEstimatedPrice(item);
    console.log(`🔍 Estimated price for ${item.productName}: ${estimatedPrice}`);
    return estimatedPrice;
  }

  // ✅ NUEVO: Buscar precio en cualquier campo del objeto
  private findPriceInObject(obj: any): number {
    const priceFields = [
      'pricePerUnit', 'price_per_unit', 'unitPrice', 'unit_price',
      'price', 'cost', 'amount', 'value', 'productPrice', 'product_price'
    ];
    
    for (const field of priceFields) {
      if (obj[field] !== null && obj[field] !== undefined) {
        const parsed = this.parsePrice(obj[field]);
        if (parsed > 0) {
          console.log(`🔍 Found price in field '${field}': ${parsed}`);
          return parsed;
        }
      }
    }
    
    return 0;
  }

  // ✅ NUEVO: Obtener precio estimado basado en el order total
  private getEstimatedPrice(item: any): number {
    // ✅ Buscar la order que contiene este item
    const parentOrder = this.orders.find(order => 
      order.items?.some(orderItem => 
        orderItem.id === item.id || orderItem.productId === item.productId
      )
    );
    
    if (parentOrder && parentOrder.totalAmount && parentOrder.items?.length) {
      const estimatedPrice = parentOrder.totalAmount / parentOrder.items.length;
      console.log(`🔍 Estimated price based on order total: ${estimatedPrice}`);
      return estimatedPrice;
    }
    
    // ✅ Fallback: precio por defecto
    console.log(`🔍 Using fallback price: 0`);
    return 0;
  }

  loadProfile(): void {
    this.isLoading = true;
    this.userService.getMyProfile().subscribe({
      next: (profile: UserProfileResponse) => {
        this.userProfile = profile;
        this.profileForm.patchValue({
          name: profile.name,
          email: profile.email,
          shippingAddress: profile.shippingAddress || ''
        });
        this.isLoading = false;
      },
      error: (err: any) => {
        this.errorMessage = 'Error loading profile';
        this.isLoading = false;
        console.error('Error loading profile:', err);
      }
    });
  }

  getStatusColor(status: string): string {
    const statusColors: { [key: string]: string } = {
      'PENDING': 'warning',
      'PROCESSING': 'info',
      'SHIPPED': 'primary',
      'DELIVERED': 'success',
      'CANCELLED': 'danger'
    };
    return statusColors[status] || 'secondary';
  }

  getStatusText(status: string): string {
    const statusTexts: { [key: string]: string } = {
      'PENDING': 'Pending',
      'PROCESSING': 'Processing',
      'SHIPPED': 'Shipped',
      'DELIVERED': 'Delivered',
      'CANCELLED': 'Cancelled'
    };
    return statusTexts[status] || status;
  }

  getShippingStatusText(shippingStatus: string): string {
    if (!shippingStatus) return 'Pending';
    
    const shippingTexts: { [key: string]: string } = {
      'PENDING': 'Pending',
      'PROCESSING': 'Preparing',
      'SHIPPED': 'On the way',
      'DELIVERED': 'Delivered'
    };
    return shippingTexts[shippingStatus] || shippingStatus;
  }

  viewOrderDetails(orderId: number): void {
    this.router.navigate(['/order/details', orderId]);
  }

  reorderItems(order: OrderDTO): void {
    console.log('Reordering items from order:', order.id);
    alert('Reorder functionality will be implemented soon');
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.loadOrders(this.currentPage + 1);
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.loadOrders(this.currentPage - 1);
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.loadOrders(page);
    }
  }

  

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  // ✅ ADD this missing method
  getItemQuantity(item: any): number {
    console.log(`🔍 Getting quantity for item:`, item);
    
    // First try: use processed quantity
    if (item.quantity && item.quantity > 0) {
      console.log(`🔍 Using processed quantity: ${item.quantity}`);
      return item.quantity;
    }
    
    // Second try: search in original data
    if (item.originalData) {
      const originalQuantity = this.findQuantityInObject(item.originalData);
      if (originalQuantity > 0) {
        console.log(`🔍 Found quantity in original data: ${originalQuantity}`);
        return originalQuantity;
      }
    }
    
    // Fallback
    console.log(`🔍 Using fallback quantity: 1`);
    return 1;
  }

  // ✅ ADD helper method to find quantity in any field
  private findQuantityInObject(obj: any): number {
    const quantityFields = [
      'quantity', 'qty', 'count', 'amount', 'units'
    ];
    
    for (const field of quantityFields) {
      if (obj[field] !== null && obj[field] !== undefined) {
        const parsed = this.parseQuantity(obj[field]);
        if (parsed > 0) {
          console.log(`🔍 Found quantity in field '${field}': ${parsed}`);
          return parsed;
        }
      }
    }
    
    return 1;
  }
}
