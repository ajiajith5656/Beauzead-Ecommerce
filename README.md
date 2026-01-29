# Beauzead Ecommerce

Beauzead is a global marketplace infrastructure like Amazon and Flipkart. It blends an elite dark-themed aesthetic with a robust, multi-tenant architecture that supports global commerce. It includes buyer, seller, and admin roles with a highly secured approval system.

## Features

### 🎨 Design
- **Black & Gold Theme**: Strictly black and gold (yellow-500) color palette for a high-end, sophisticated environment
- **Professional UI**: Modern, responsive design with Tailwind CSS
- **Premium Experience**: Elite aesthetic for a luxurious shopping experience

### 🔐 Authentication & Security
- **Role-Based Authentication**: Separate login/signup for Users, Sellers, and Admins
- **Email OTP Verification**: Strict email verification using Supabase
- **Secure Password Management**: Password reset with OTP verification
- **Admin Approval System**: Amazon-level approval system for sellers and admins

### 👥 User Roles
- **Users**: Browse products, make purchases, manage orders
- **Sellers**: Manage products, view sales, handle orders (requires admin approval)
- **Admins**: Approve sellers/admins, manage platform, oversee all operations

### 💰 E-commerce Features
- **Real-Time Currency Conversion**: Support for multiple currencies with live conversion rates
- **Stripe Payment Gateway**: Secure payment processing
- **Product Management**: Comprehensive product listing and management
- **Shopping Cart**: Full shopping cart functionality
- **Order Tracking**: Complete order management system

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Authentication + Real-time)
- **Payment**: Stripe
- **Routing**: React Router DOM
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Supabase account
- Stripe account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ajiajith5656/Beauzead-Ecommerce.git
cd Beauzead-Ecommerce
```

2. Install dependencies:
```bash
npm install
```

3. Setup environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your credentials:
- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `VITE_STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key

### Supabase Setup

1. Create a new Supabase project
2. Run the following SQL to create the required tables:

```sql
-- Create users table
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'seller', 'admin')),
  full_name TEXT,
  approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create products table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  image_url TEXT,
  seller_id UUID REFERENCES users(id),
  category TEXT,
  stock INTEGER DEFAULT 0,
  approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create cart_items table
CREATE TABLE cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  product_id UUID REFERENCES products(id),
  quantity INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  total DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own data" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can read all users" ON users FOR SELECT USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin' AND approved = true)
);
CREATE POLICY "Admins can update all users" ON users FOR UPDATE USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin' AND approved = true)
);
```

3. Configure email templates for OTP verification in Supabase dashboard

### Running the Application

Development mode:
```bash
npm run dev
```

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── auth/          # Authentication components
│   ├── dashboard/     # Dashboard components
│   ├── products/      # Product components
│   ├── cart/          # Shopping cart components
│   └── layout/        # Layout components
├── pages/
│   ├── user/          # User pages
│   ├── seller/        # Seller pages
│   └── admin/         # Admin pages
├── contexts/          # React contexts
├── lib/               # External library configurations
├── types/             # TypeScript type definitions
├── utils/             # Utility functions
└── hooks/             # Custom React hooks
```

## User Flows

### For Users
1. Sign up with email
2. Verify email with OTP
3. Browse products
4. Add items to cart
5. Checkout with Stripe
6. Track orders

### For Sellers
1. Sign up as seller
2. Wait for admin approval
3. Once approved, access seller dashboard
4. Add and manage products
5. View sales and orders

### For Admins
1. Sign up as admin
2. Wait for super admin approval
3. Access admin dashboard
4. Approve/reject seller and admin requests
5. Manage platform

## Features in Detail

### Authentication
- Supabase handles all authentication
- Email OTP verification required for signup
- Password reset with email OTP
- Role-based access control

### Currency Conversion
- Real-time exchange rates from exchangerate-api.com
- Supports USD, EUR, GBP, JPY, INR, AUD, CAD
- Automatic conversion based on user preference

### Payment Processing
- Stripe integration for secure payments
- Support for multiple currencies
- PCI-compliant payment handling

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Support

For support, email support@beauzead.com or open an issue in the repository.
