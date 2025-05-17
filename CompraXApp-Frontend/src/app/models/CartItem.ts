export interface CartItem {
  id?: number; 
  productId: number;
  productName?: string;
  productPrice?: number;
  quantity: number;
  imageUrl?: string;
}