export interface Order {
    id: number;
    orderDate: Date;
    status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED';
    totalAmount: number;
    shippingAddress: string;
    items: OrderItem[];
  }
  
  export interface OrderItem {
    id: number;
    productId: number;
    productName: string;
    price: number;
    quantity: number;
    subtotal: number;
  }