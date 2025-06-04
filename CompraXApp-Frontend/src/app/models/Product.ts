export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  imageUrl?: string;
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}