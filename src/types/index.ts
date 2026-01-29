export interface User {
  id: string;
  email: string;
  role: 'user' | 'seller' | 'admin';
  full_name?: string;
  created_at: string;
  approved?: boolean;
  phone?: string;
  address?: string;
  profile_type?: 'member' | 'prime';
  total_purchases?: number;
  cancellations?: number;
  is_banned?: boolean;
  signup_date?: string;
}

export interface Admin {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  created_at: string;
  last_login?: string;
  permissions: string[];
  is_active: boolean;
  status?: 'active' | 'inactive';
}

export interface Seller {
  id: string;
  user_id: string;
  shop_name: string;
  email: string;
  phone: string;
  total_listings: number;
  badge?: 'silver' | 'gold' | 'platinum';
  kyc_status: 'pending' | 'approved' | 'rejected';
  product_approval_status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  seller_type?: 'individual' | 'brand' | 'freelancing';
  is_active: boolean;
  total_revenue?: number;
  total_orders?: number;
  rating?: number;
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
  approval_status?: 'pending' | 'approved' | 'rejected';
  sub_category?: string;
  sku?: string;
  images?: string[];
  updated_at?: string;
  is_active?: boolean;
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
  status: 'new' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'return_requested' | 'returned';
  created_at: string;
  items?: OrderItem[];
  seller_id?: string;
  address?: string;
  phone?: string;
  updated_at?: string;
  payment_status?: 'pending' | 'completed' | 'failed';
  tracking_number?: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  product?: Product;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  is_active: boolean;
  created_at: string;
  sub_categories?: SubCategory[];
}

export interface SubCategory {
  id: string;
  category_id: string;
  name: string;
  description?: string;
  is_active: boolean;
  created_at: string;
}

export interface Banner {
  id: string;
  title: string;
  image_url: string;
  link?: string;
  is_active: boolean;
  position: number;
  created_at: string;
  updated_at?: string;
}

export interface Promotion {
  id: string;
  title: string;
  description?: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  applicable_to: 'user' | 'seller' | 'common';
  applicable_ids?: string[];
  start_date: string;
  end_date: string;
  is_active: boolean;
  created_at: string;
  max_uses?: number;
  current_uses?: number;
}

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  comment: string;
  created_at: string;
  is_verified?: boolean;
  is_flagged?: boolean;
}

export interface Complaint {
  id: string;
  user_id: string;
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  created_at: string;
  updated_at?: string;
  assigned_to?: string;
  resolution?: string;
}

export interface Withdrawal {
  id: string;
  seller_id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'approved' | 'completed' | 'failed';
  created_at: string;
  processed_at?: string;
}

export interface BusinessMetrics {
  total_sales: number;
  total_expenses: number;
  total_products: number;
  total_users: number;
  total_sellers: number;
  total_bookings: number;
  ongoing_orders: number;
  returns_cancellations: number;
}

export interface DashboardData {
  metrics: BusinessMetrics;
  top_categories: Category[];
  top_sellers: Seller[];
  user_registrations: number;
  prime_members: number;
  seller_registrations: number;
}

export interface AccountSummary {
  total_revenue: number;
  total_expenses: number;
  net_profit: number;
  total_payouts: number;
  total_taxes: number;
  currency: string;
}

export interface DaybookEntry {
  id: string;
  date: string;
  description: string;
  debit: number;
  credit: number;
  balance: number;
  reference?: string;
}

export interface BankBookEntry {
  id: string;
  date: string;
  description: string;
  debit: number;
  credit: number;
  balance: number;
  bank_reference?: string;
}

export interface AccountHead {
  id: string;
  name: string;
  type: 'asset' | 'liability' | 'income' | 'expense';
  is_active: boolean;
  created_at: string;
}

export interface ExpenseEntry {
  id: string;
  date: string;
  amount: number;
  category: string;
  description?: string;
  vendor?: string;
  status?: 'pending' | 'approved' | 'paid';
}

export interface SellerPayout {
  id: string;
  seller_id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'approved' | 'completed' | 'failed';
  scheduled_at?: string;
  processed_at?: string;
}

export interface MembershipPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  duration_days: number;
  is_active: boolean;
}

export interface TaxRule {
  id: string;
  name: string;
  percentage: number;
  country?: string;
  is_active: boolean;
}

export interface PlatformCost {
  id: string;
  name: string;
  amount: number;
  currency: string;
  billing_cycle: 'monthly' | 'quarterly' | 'yearly' | 'one_time';
  is_active: boolean;
}
