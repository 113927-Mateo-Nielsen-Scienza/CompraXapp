import { CartItem } from "./CartItem";

export interface Cart {
  id?: number; 
  userId?: number;
  items: CartItem[];
  totalPrice?: number;
}