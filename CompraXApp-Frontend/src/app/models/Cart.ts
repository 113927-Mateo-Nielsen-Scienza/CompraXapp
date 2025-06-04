export interface CartItem {
  id?: number;
  productId: number;
  productName: string;
  pricePerUnit: number;  
  quantity: number;
  imageUrl?: string;
  subtotal?: number;     
}

export interface Cart {
  id?: number;
  userId?: number;
  items: CartItem[];
  totalAmount: number;
  createdAt?: Date;
  updatedAt?: Date;
}