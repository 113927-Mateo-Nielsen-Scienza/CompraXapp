import { CartItem } from "./CartItem";

export interface Order {
  id?: number;
  userId?: number; 
  items: CartItem[]; 
  totalAmount: number;
  shippingAddress: string; 
  paymentMethod: 'MERCADOPAGO' | 'WHATSAPP';
  status?: string; 
  orderDate?: Date;
}