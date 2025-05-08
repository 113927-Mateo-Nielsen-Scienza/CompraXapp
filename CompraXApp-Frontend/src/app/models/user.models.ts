import { Order } from "./order,models";

export interface User {
    id?: number;
    name: string;
    email: string;
    shippingAddress?: string;
    roles?: string[];
  }
  
  export interface UserProfileResponse {
    id: number;
    name: string;
    email: string;
    shippingAddress?: string;
    roles: string[];
    purchaseHistory?: Order[];
  }
  
  export interface UserUpdateRequest {
    name?: string;
    email?: string;
    shippingAddress?: string;
  }