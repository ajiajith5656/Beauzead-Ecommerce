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

export interface Seller {
  id: string;
  name: string;
  email: string;
  cancellation_policy: SellerCancellationPolicy;
}

export interface SellerCancellationPolicy {
  allow_pending: boolean;
  allow_processing: boolean;
  allow_shipped: boolean;
  policy_text?: string;
}

export interface Order {
  id: string;
  user_id: string;
  total: number;
  currency: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  created_at: string;
}

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
  seller_id?: string;
  seller_name?: string;
  cancellation_policy?: SellerCancellationPolicy;
}

export type CancellationStatus = 'pending' | 'approved' | 'rejected';
export type RefundStatus = 'pending' | 'processing' | 'completed';

export interface OrderCancellation {
  id: string;
  order_id: string;
  user_id: string;
  reason: string;
  other_reason?: string;
  status: CancellationStatus;
  seller_response?: string;
  refund_status?: RefundStatus;
  refund_completed_date?: string;
  created_at: string;
  updated_at: string;
}
