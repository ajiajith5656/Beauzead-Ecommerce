-- ============================================================
-- Aurora PostgreSQL Schema for Beauzead E-commerce
-- Production-Ready Database Design
-- ============================================================

-- ============================================================
-- 1. COUNTRIES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS countries (
    id SERIAL PRIMARY KEY,
    country_name VARCHAR(100) NOT NULL UNIQUE,
    country_code VARCHAR(3) NOT NULL UNIQUE,  -- ISO 3166-1 alpha-3
    currency_code VARCHAR(3) NOT NULL,         -- ISO 4217
    currency_name VARCHAR(50),
    dialing_code VARCHAR(5) NOT NULL,
    region VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================================
-- INSERT COUNTRIES DATA
-- ============================================================

-- INDIA
INSERT INTO countries (country_name, country_code, currency_code, currency_name, dialing_code, region) VALUES
('India', 'IND', 'INR', 'Indian Rupee', '+91', 'Asia');

-- ASIAN COUNTRIES
INSERT INTO countries (country_name, country_code, currency_code, currency_name, dialing_code, region) VALUES
('Afghanistan', 'AFG', 'AFN', 'Afghan Afghani', '+93', 'Asia'),
('Azerbaijan', 'AZE', 'AZN', 'Azerbaijani Manat', '+994', 'Asia'),
('Bahrain', 'BHR', 'BHD', 'Bahraini Dinar', '+973', 'Asia'),
('Bangladesh', 'BGD', 'BDT', 'Bangladeshi Taka', '+880', 'Asia'),
('Bhutan', 'BTN', 'BTN', 'Bhutanese Ngultrum', '+975', 'Asia'),
('Brunei', 'BRN', 'BND', 'Brunei Dollar', '+673', 'Asia'),
('Cambodia', 'KHM', 'KHR', 'Cambodian Riel', '+855', 'Asia'),
('China', 'CHN', 'CNY', 'Chinese Yuan', '+86', 'Asia'),
('Cyprus', 'CYP', 'EUR', 'Euro', '+357', 'Asia'),
('Georgia', 'GEO', 'GEL', 'Georgian Lari', '+995', 'Asia'),
('Hong Kong', 'HKG', 'HKD', 'Hong Kong Dollar', '+852', 'Asia'),
('Indonesia', 'IDN', 'IDR', 'Indonesian Rupiah', '+62', 'Asia'),
('Iran', 'IRN', 'IRR', 'Iranian Rial', '+98', 'Asia'),
('Iraq', 'IRQ', 'IQD', 'Iraqi Dinar', '+964', 'Asia'),
('Israel', 'ISR', 'ILS', 'Israeli Shekel', '+972', 'Asia'),
('Japan', 'JPN', 'JPY', 'Japanese Yen', '+81', 'Asia'),
('Jordan', 'JOR', 'JOD', 'Jordanian Dinar', '+962', 'Asia'),
('Kazakhstan', 'KAZ', 'KZT', 'Kazakhstani Tenge', '+7', 'Asia'),
('Kuwait', 'KWT', 'KWD', 'Kuwaiti Dinar', '+965', 'Asia'),
('Kyrgyzstan', 'KGZ', 'KGS', 'Kyrgyzstani Som', '+996', 'Asia'),
('Laos', 'LAO', 'LAK', 'Laotian Kip', '+856', 'Asia'),
('Lebanon', 'LBN', 'LBP', 'Lebanese Pound', '+961', 'Asia'),
('Macao', 'MAC', 'MOP', 'Macanese Pataca', '+853', 'Asia'),
('Malaysia', 'MYS', 'MYR', 'Malaysian Ringgit', '+60', 'Asia'),
('Maldives', 'MDV', 'MVR', 'Maldivian Rufiyaa', '+960', 'Asia'),
('Mongolia', 'MNG', 'MNT', 'Mongolian Tugrik', '+976', 'Asia'),
('Myanmar', 'MMR', 'MMK', 'Myanmar Kyat', '+95', 'Asia'),
('Nepal', 'NPL', 'NPR', 'Nepalese Rupee', '+977', 'Asia'),
('North Korea', 'PRK', 'KPW', 'North Korean Won', '+850', 'Asia'),
('Oman', 'OMN', 'OMR', 'Omani Rial', '+968', 'Asia'),
('Pakistan', 'PAK', 'PKR', 'Pakistani Rupee', '+92', 'Asia'),
('Palestine', 'PSE', 'ILS', 'Israeli Shekel', '+970', 'Asia'),
('Philippines', 'PHL', 'PHP', 'Philippine Peso', '+63', 'Asia'),
('Qatar', 'QAT', 'QAR', 'Qatari Riyal', '+974', 'Asia'),
('Saudi Arabia', 'SAU', 'SAR', 'Saudi Riyal', '+966', 'Asia'),
('Singapore', 'SGP', 'SGD', 'Singapore Dollar', '+65', 'Asia'),
('South Korea', 'KOR', 'KRW', 'South Korean Won', '+82', 'Asia'),
('Sri Lanka', 'LKA', 'LKR', 'Sri Lankan Rupee', '+94', 'Asia'),
('Syria', 'SYR', 'SYP', 'Syrian Pound', '+963', 'Asia'),
('Taiwan', 'TWN', 'TWD', 'Taiwan Dollar', '+886', 'Asia'),
('Tajikistan', 'TJK', 'TJS', 'Tajikistani Somoni', '+992', 'Asia'),
('Thailand', 'THA', 'THB', 'Thai Baht', '+66', 'Asia'),
('Timor-Leste', 'TLS', 'USD', 'US Dollar', '+670', 'Asia'),
('Turkey', 'TUR', 'TRY', 'Turkish Lira', '+90', 'Asia'),
('Turkmenistan', 'TKM', 'TMT', 'Turkmenistani Manat', '+993', 'Asia'),
('United Arab Emirates', 'ARE', 'AED', 'UAE Dirham', '+971', 'Asia'),
('Uzbekistan', 'UZB', 'UZS', 'Uzbekistani Som', '+998', 'Asia'),
('Vietnam', 'VNM', 'VND', 'Vietnamese Dong', '+84', 'Asia'),
('Yemen', 'YEM', 'YER', 'Yemeni Rial', '+967', 'Asia');

-- GULF COUNTRIES (GCC)
INSERT INTO countries (country_name, country_code, currency_code, currency_name, dialing_code, region) VALUES
('Bahrain', 'BHR', 'BHD', 'Bahraini Dinar', '+973', 'Gulf'),
('Kuwait', 'KWT', 'KWD', 'Kuwaiti Dinar', '+965', 'Gulf'),
('Oman', 'OMN', 'OMR', 'Omani Rial', '+968', 'Gulf'),
('Qatar', 'QAT', 'QAR', 'Qatari Riyal', '+974', 'Gulf'),
('Saudi Arabia', 'SAU', 'SAR', 'Saudi Riyal', '+966', 'Gulf'),
('United Arab Emirates', 'ARE', 'AED', 'UAE Dirham', '+971', 'Gulf')
ON CONFLICT (country_code) DO NOTHING;

-- UNITED KINGDOM
INSERT INTO countries (country_name, country_code, currency_code, currency_name, dialing_code, region) VALUES
('United Kingdom', 'GBR', 'GBP', 'British Pound', '+44', 'Europe');

-- EUROPEAN UNION COUNTRIES
INSERT INTO countries (country_name, country_code, currency_code, currency_name, dialing_code, region) VALUES
('Austria', 'AUT', 'EUR', 'Euro', '+43', 'Europe'),
('Belgium', 'BEL', 'EUR', 'Euro', '+32', 'Europe'),
('Bulgaria', 'BGR', 'BGN', 'Bulgarian Lev', '+359', 'Europe'),
('Croatia', 'HRV', 'HRK', 'Croatian Kuna', '+385', 'Europe'),
('Cyprus', 'CYP', 'EUR', 'Euro', '+357', 'Europe'),
('Czech Republic', 'CZE', 'CZK', 'Czech Koruna', '+420', 'Europe'),
('Denmark', 'DNK', 'DKK', 'Danish Krone', '+45', 'Europe'),
('Estonia', 'EST', 'EUR', 'Euro', '+372', 'Europe'),
('Finland', 'FIN', 'EUR', 'Euro', '+358', 'Europe'),
('France', 'FRA', 'EUR', 'Euro', '+33', 'Europe'),
('Germany', 'DEU', 'EUR', 'Euro', '+49', 'Europe'),
('Greece', 'GRC', 'EUR', 'Euro', '+30', 'Europe'),
('Hungary', 'HUN', 'HUF', 'Hungarian Forint', '+36', 'Europe'),
('Ireland', 'IRL', 'EUR', 'Euro', '+353', 'Europe'),
('Italy', 'ITA', 'EUR', 'Euro', '+39', 'Europe'),
('Latvia', 'LVA', 'EUR', 'Euro', '+371', 'Europe'),
('Lithuania', 'LTU', 'EUR', 'Euro', '+370', 'Europe'),
('Luxembourg', 'LUX', 'EUR', 'Euro', '+352', 'Europe'),
('Malta', 'MLT', 'EUR', 'Euro', '+356', 'Europe'),
('Netherlands', 'NLD', 'EUR', 'Euro', '+31', 'Europe'),
('Poland', 'POL', 'PLN', 'Polish Zloty', '+48', 'Europe'),
('Portugal', 'PRT', 'EUR', 'Euro', '+351', 'Europe'),
('Romania', 'ROU', 'RON', 'Romanian Leu', '+40', 'Europe'),
('Slovakia', 'SVK', 'EUR', 'Euro', '+421', 'Europe'),
('Slovenia', 'SVN', 'EUR', 'Euro', '+386', 'Europe'),
('Spain', 'ESP', 'EUR', 'Euro', '+34', 'Europe'),
('Sweden', 'SWE', 'SEK', 'Swedish Krona', '+46', 'Europe')
ON CONFLICT (country_code) DO NOTHING;

-- USA AND OTHER AMERICAS (Optional)
INSERT INTO countries (country_name, country_code, currency_code, currency_name, dialing_code, region) VALUES
('United States', 'USA', 'USD', 'US Dollar', '+1', 'Americas'),
('Canada', 'CAN', 'CAD', 'Canadian Dollar', '+1', 'Americas'),
('Mexico', 'MEX', 'MXN', 'Mexican Peso', '+52', 'Americas'),
('Brazil', 'BRA', 'BRL', 'Brazilian Real', '+55', 'Americas'),
('Argentina', 'ARG', 'ARS', 'Argentine Peso', '+54', 'Americas')
ON CONFLICT (country_code) DO NOTHING;

-- Create Indexes for faster queries
CREATE INDEX idx_countries_code ON countries(country_code);
CREATE INDEX idx_countries_region ON countries(region);
CREATE INDEX idx_countries_is_active ON countries(is_active);

-- ============================================================
-- 2. BUSINESS TYPES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS business_types (
    id SERIAL PRIMARY KEY,
    business_type_name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon_name VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO business_types (business_type_name, description) VALUES
('Electronics', 'Electronics and gadgets'),
('Fashion & Apparel', 'Clothing, shoes, and accessories'),
('Home & Garden', 'Furniture, home decor, and gardening'),
('Sports & Outdoors', 'Sports equipment and outdoor gear'),
('Books & Media', 'Books, movies, music, and media'),
('Beauty & Personal Care', 'Cosmetics, skincare, and personal care'),
('Toys & Games', 'Toys, board games, and gaming'),
('Food & Beverages', 'Food products and beverages'),
('Health & Wellness', 'Health products and supplements'),
('Automotive', 'Car parts and automotive accessories'),
('Handmade & Crafts', 'Handmade and craft items'),
('Jewelry & Watches', 'Jewelry and watches'),
('Pet Supplies', 'Pet food, toys, and accessories'),
('Office Supplies', 'Office equipment and stationery'),
('Digital Products', 'Software, apps, and digital goods');

CREATE INDEX idx_business_types_active ON business_types(is_active);

-- ============================================================
-- 3. CATEGORIES TABLE (Hierarchical)
-- ============================================================
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL,
    parent_category_id INT REFERENCES categories(id),
    business_type_id INT REFERENCES business_types(id),
    slug VARCHAR(100) UNIQUE,
    description TEXT,
    icon_name VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_categories_parent ON categories(parent_category_id);
CREATE INDEX idx_categories_business_type ON categories(business_type_id);
CREATE INDEX idx_categories_active ON categories(is_active);

-- ============================================================
-- 4. USERS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    cognito_user_id VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20),
    country_id INT REFERENCES countries(id),
    state VARCHAR(100),
    city VARCHAR(100),
    postal_code VARCHAR(20),
    address TEXT,
    profile_image_url VARCHAR(500),
    role VARCHAR(20) DEFAULT 'user',  -- user, seller, admin
    is_email_verified BOOLEAN DEFAULT FALSE,
    is_phone_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_cognito_id ON users(cognito_user_id);
CREATE INDEX idx_users_role ON users(role);

-- ============================================================
-- 5. SELLERS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS sellers (
    id SERIAL PRIMARY KEY,
    user_id INT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    business_name VARCHAR(255) NOT NULL,
    business_type_id INT REFERENCES business_types(id),
    business_registration_number VARCHAR(100),
    business_email VARCHAR(255),
    business_phone VARCHAR(20),
    bank_account_holder VARCHAR(100),
    bank_account_number VARCHAR(50),
    bank_name VARCHAR(100),
    ifsc_code VARCHAR(20),
    upi_id VARCHAR(100),
    kyc_status VARCHAR(20) DEFAULT 'pending',  -- pending, approved, rejected
    kyc_verified_at TIMESTAMP,
    seller_rating DECIMAL(3, 2) DEFAULT 0,
    total_products INT DEFAULT 0,
    total_sales DECIMAL(15, 2) DEFAULT 0,
    commission_rate DECIMAL(5, 2) DEFAULT 10,  -- Percentage
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    suspension_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_sellers_user_id ON sellers(user_id);
CREATE INDEX idx_sellers_business_type ON sellers(business_type_id);
CREATE INDEX idx_sellers_kyc_status ON sellers(kyc_status);
CREATE INDEX idx_sellers_active ON sellers(is_active);

-- ============================================================
-- 6. KYC DOCUMENTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS kyc_documents (
    id SERIAL PRIMARY KEY,
    seller_id INT NOT NULL REFERENCES sellers(id) ON DELETE CASCADE,
    document_type VARCHAR(50),  -- PAN, AADHAR, GST, BANK_STATEMENT, etc.
    document_number VARCHAR(100),
    s3_url VARCHAR(500) NOT NULL,
    document_status VARCHAR(20) DEFAULT 'pending',  -- pending, approved, rejected
    rejection_reason TEXT,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    verified_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_kyc_documents_seller ON kyc_documents(seller_id);
CREATE INDEX idx_kyc_documents_status ON kyc_documents(document_status);

-- ============================================================
-- 7. PRODUCTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    seller_id INT NOT NULL REFERENCES sellers(id),
    category_id INT REFERENCES categories(id),
    product_name VARCHAR(255) NOT NULL,
    product_description TEXT,
    sku VARCHAR(100) UNIQUE,
    price DECIMAL(12, 2) NOT NULL,
    discount_percentage DECIMAL(5, 2) DEFAULT 0,
    discounted_price DECIMAL(12, 2),
    stock_quantity INT DEFAULT 0,
    minimum_stock_level INT DEFAULT 5,
    product_images TEXT,  -- JSON array of image URLs
    main_image_url VARCHAR(500),
    rating DECIMAL(3, 2) DEFAULT 0,
    total_reviews INT DEFAULT 0,
    total_sold INT DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_products_seller ON products(seller_id);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_products_featured ON products(is_featured);

-- ============================================================
-- 8. PRODUCT INVENTORY TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS product_inventory (
    id SERIAL PRIMARY KEY,
    product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    warehouse_location VARCHAR(100),
    available_quantity INT DEFAULT 0,
    reserved_quantity INT DEFAULT 0,
    defective_quantity INT DEFAULT 0,
    last_counted_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_inventory_product ON product_inventory(product_id);

-- ============================================================
-- 9. ORDERS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    user_id INT NOT NULL REFERENCES users(id),
    total_amount DECIMAL(15, 2) NOT NULL,
    subtotal_amount DECIMAL(15, 2) NOT NULL,
    tax_amount DECIMAL(15, 2) DEFAULT 0,
    shipping_cost DECIMAL(15, 2) DEFAULT 0,
    discount_amount DECIMAL(15, 2) DEFAULT 0,
    order_status VARCHAR(50) DEFAULT 'pending',  -- pending, confirmed, shipped, delivered, cancelled
    payment_status VARCHAR(50) DEFAULT 'pending',  -- pending, completed, failed, refunded
    payment_method VARCHAR(50),  -- credit_card, debit_card, upi, wallet, cod
    transaction_id VARCHAR(255),
    shipping_address TEXT NOT NULL,
    billing_address TEXT,
    delivery_date TIMESTAMP,
    notes TEXT,
    is_guest_order BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(order_status);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
CREATE INDEX idx_orders_created_at ON orders(created_at);

-- ============================================================
-- 10. ORDER ITEMS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id INT NOT NULL REFERENCES products(id),
    seller_id INT NOT NULL REFERENCES sellers(id),
    quantity INT NOT NULL,
    unit_price DECIMAL(12, 2) NOT NULL,
    total_price DECIMAL(15, 2) NOT NULL,
    item_status VARCHAR(50) DEFAULT 'pending',  -- pending, confirmed, shipped, delivered, cancelled
    tracking_number VARCHAR(100),
    estimated_delivery_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_product ON order_items(product_id);
CREATE INDEX idx_order_items_seller ON order_items(seller_id);

-- ============================================================
-- 11. PAYMENTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS payments (
    id SERIAL PRIMARY KEY,
    order_id INT NOT NULL REFERENCES orders(id),
    amount DECIMAL(15, 2) NOT NULL,
    payment_method VARCHAR(50),
    payment_gateway VARCHAR(100),  -- Razorpay, PayPal, Stripe, etc.
    transaction_id VARCHAR(255) UNIQUE,
    payment_status VARCHAR(50) DEFAULT 'pending',  -- pending, completed, failed, refunded
    payment_date TIMESTAMP,
    refund_amount DECIMAL(15, 2) DEFAULT 0,
    refund_date TIMESTAMP,
    refund_reason TEXT,
    metadata TEXT,  -- JSON additional data
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_payments_order ON payments(order_id);
CREATE INDEX idx_payments_status ON payments(payment_status);
CREATE INDEX idx_payments_transaction ON payments(transaction_id);

-- ============================================================
-- 12. REVIEWS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    user_id INT NOT NULL REFERENCES users(id),
    order_item_id INT REFERENCES order_items(id),
    rating INT NOT NULL,  -- 1-5
    review_title VARCHAR(255),
    review_text TEXT,
    review_images TEXT,  -- JSON array of image URLs
    helpful_count INT DEFAULT 0,
    unhelpful_count INT DEFAULT 0,
    seller_response TEXT,
    seller_response_date TIMESTAMP,
    is_verified_purchase BOOLEAN DEFAULT FALSE,
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_reviews_product ON reviews(product_id);
CREATE INDEX idx_reviews_user ON reviews(user_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);
CREATE INDEX idx_reviews_verified ON reviews(is_verified_purchase);

-- ============================================================
-- 13. SHOPPING CART TABLE (Aurora - not DynamoDB)
-- ============================================================
CREATE TABLE IF NOT EXISTS shopping_carts (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id INT NOT NULL REFERENCES products(id),
    quantity INT NOT NULL DEFAULT 1,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_cart_user ON shopping_carts(user_id);
CREATE UNIQUE INDEX idx_cart_user_product ON shopping_carts(user_id, product_id);

-- ============================================================
-- 14. WISHLIST TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS wishlists (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id INT NOT NULL REFERENCES products(id),
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_wishlist_user ON wishlists(user_id);
CREATE UNIQUE INDEX idx_wishlist_user_product ON wishlists(user_id, product_id);

-- ============================================================
-- 15. NOTIFICATIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    notification_type VARCHAR(50),  -- order_placed, order_shipped, review_request, etc.
    title VARCHAR(255),
    message TEXT,
    related_order_id INT REFERENCES orders(id),
    is_read BOOLEAN DEFAULT FALSE,
    action_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);

-- ============================================================
-- 16. SELLER COMMISSIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS seller_commissions (
    id SERIAL PRIMARY KEY,
    seller_id INT NOT NULL REFERENCES sellers(id),
    order_item_id INT NOT NULL REFERENCES order_items(id),
    sale_amount DECIMAL(15, 2) NOT NULL,
    commission_percentage DECIMAL(5, 2) NOT NULL,
    commission_amount DECIMAL(15, 2) NOT NULL,
    payment_status VARCHAR(50) DEFAULT 'pending',  -- pending, processed, failed
    payment_date TIMESTAMP,
    period_month INT,  -- 1-12
    period_year INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_commissions_seller ON seller_commissions(seller_id);
CREATE INDEX idx_commissions_payment_status ON seller_commissions(payment_status);

-- ============================================================
-- SUMMARY STATISTICS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS platform_statistics (
    id SERIAL PRIMARY KEY,
    total_users INT DEFAULT 0,
    total_sellers INT DEFAULT 0,
    total_products INT DEFAULT 0,
    total_orders INT DEFAULT 0,
    total_revenue DECIMAL(15, 2) DEFAULT 0,
    active_listings INT DEFAULT 0,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- End of Schema
-- ============================================================
