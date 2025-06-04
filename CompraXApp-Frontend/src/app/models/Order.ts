import { CartItem } from "./Cart";

export interface Order {
  id?: number;
  userId?: number; 
  totalAmount: number;
  shippingAddress: string; 
  paymentMethod: 'MERCADOPAGO' | 'WHATSAPP';
  status?: string; 
  orderDate?: Date;
  items?: OrderItem[];
}

export interface OrderItem {
  id?: number;
  productId: number;
  productName: string;
  productPrice: number;
  quantity: number;
  imageUrl?: string;
}