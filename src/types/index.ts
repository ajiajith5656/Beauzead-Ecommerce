export interface User {
  id: string;
  email: string;
  role: 'user' | 'seller' | 'admin';
  full_name?: string;
  created_at: string;
  approved?: boolean;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  image_url: string;
  seller_id: string;
  category: string;
  stock: number;
  approved: boolean;
  created_at: string;
  brand?: string;
  rating?: number;
  discount?: number;
  isNew?: boolean;
}

export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  product?: Product;
}

export interface Order {
  id: string;
  user_id: string;
  total: number;
  currency: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  created_at: string;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  product_image: string;
  quantity: number;
  price: number;
  currency: string;
}

export interface OrderSummary extends Order {
  items: OrderItem[];
  shipping_address?: string;
  payment_method?: string;
}
