# Important Input Fields - Beauzead E-commerce Platform

> **Note:** This platform uses **Email OTP verification only** (no mobile OTP).

## Table of Contents
1. [User Authentication](#1-user-authentication)
2. [Seller Authentication](#2-seller-authentication)
3. [User Profile & Address](#3-user-profile--address)
4. [Seller Profile & KYC](#4-seller-profile--kyc)
5. [Product Listing](#5-product-listing)
6. [Cognito Attribute Mapping](#6-cognito-attribute-mapping)
7. [Database Schema Requirements](#7-database-schema-requirements)

---

## 1. User Authentication

### 1.1 User Signup (`/signup`)
**File:** `src/components/auth/Signup.tsx`

| Field | Type | Required | Validation | Cognito Attribute |
|-------|------|----------|------------|-------------------|
| `fullName` | text | ✅ | Min 2 characters | `name` |
| `email` | email | ✅ | Valid email format | `email` |
| `password` | password | ✅ | 8-16 chars, uppercase, lowercase, number, special char | N/A (auth) |
| `countryId` | select | ✅ | Valid country from database | `custom:country` |

**Password Validation Rules:**
- Minimum 8 characters, maximum 16 characters
- At least 1 uppercase letter (A-Z)
- At least 1 lowercase letter (a-z)
- At least 1 number (0-9)
- At least 1 special character (!@#$%^&*)

---

### 1.2 User Login (`/login`)
**File:** `src/components/auth/Login.tsx`

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `email` | email | ✅ | Valid email format |
| `password` | password | ✅ | Non-empty |

---

### 1.3 OTP Verification (`/otp-verification`)
**File:** `src/pages/OTPVerification.tsx`

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `otp` | 6-digit code | ✅ | Exactly 6 numeric digits |

**Purposes:**
- `signup` - Confirm user registration
- `seller-signup` - Confirm seller registration
- `password-reset` - Verify password reset request
- `seller-password-reset` - Verify seller password reset

**State Passed:**
```typescript
{
  email: string;
  purpose: 'signup' | 'seller-signup' | 'password-reset' | 'seller-password-reset';
  role: 'user' | 'seller';
}
```

---

### 1.4 User Forgot Password (`/forgot-password`)
**File:** `src/pages/user/ForgotPassword.tsx`

| Step | Field | Type | Required | Validation |
|------|-------|------|----------|------------|
| 1 | `email` | email | ✅ | Valid email format |
| 2 | `otp` | 6-digit | ✅ | 6 numeric digits |
| 3 | `newPassword` | password | ✅ | Same rules as signup |
| 3 | `confirmPassword` | password | ✅ | Must match newPassword |

---

## 2. Seller Authentication

### 2.1 Seller Signup (`/seller/signup`)
**File:** `src/pages/seller/SellerSignup.tsx`

| Field | Type | Required | Validation | Cognito Attribute |
|-------|------|----------|------------|-------------------|
| `fullName` | text | ✅ | Min 2 characters | `name` |
| `email` | email | ✅ | Valid email format | `email` |
| `countryId` | select | ✅ | Valid country from database | `custom:country` |
| `businessTypeId` | select | ✅ | Valid business type from database | `profile` |
| `mobile` | tel | ✅ | Valid phone format | `phone_number` |
| `password` | password | ✅ | Same validation as user signup | N/A (auth) |

**Dropdown Data Sources:**
- `countries` - Fetched from Aurora PostgreSQL `countries` table
- `businessTypes` - Fetched from Aurora PostgreSQL `business_types` table

---

### 2.2 Seller Login (`/seller/login`)
**File:** `src/pages/seller/SellerLogin.tsx`

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `email` | email | ✅ | Valid email format |
| `password` | password | ✅ | Non-empty |

---

### 2.3 Seller Forgot Password (`/seller/forgot-password`)
**File:** `src/pages/seller/SellerForgotPassword.tsx`

| Step | Field | Type | Required | Validation |
|------|-------|------|----------|------------|
| 1 | `email` | email | ✅ | Valid registered email |
| 2 | `otp` | 6-digit | ✅ | 6 numeric digits (via email) |
| 3 | `newPassword` | password | ✅ | Same rules as signup |
| 3 | `confirmPassword` | password | ✅ | Must match newPassword |

---

## 3. User Profile & Address

### 3.1 User Profile (`/account/profile`)
**File:** `src/pages/user/Profile.tsx`

| Tab | Field | Type | Required | Validation |
|-----|-------|------|----------|------------|
| **Profile** | `firstName` | text | ✅ | Non-empty |
| | `lastName` | text | ✅ | Non-empty |
| | `email` | email | ✅ | Valid email (read-only) |
| | `phone` | tel | ❌ | Valid phone format |
| | `address` | text | ❌ | Free text |
| | `city` | text | ❌ | Free text |
| | `state` | text | ❌ | Free text |
| | `zipCode` | text | ❌ | Valid postal code |
| **Security** | `currentPassword` | password | ✅ | Current password |
| | `newPassword` | password | ✅ | Same validation rules |
| | `confirmPassword` | password | ✅ | Must match |

---

### 3.2 Address Form Component
**File:** `src/components/AddressForm.tsx`

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `fullName` | text | ✅ | Non-empty |
| `phoneNumber` | tel | ✅ | Valid phone format |
| `email` | email | ✅ | Valid email format |
| `country` | select | ✅ | Valid country |
| `streetAddress1` | text | ✅ | Non-empty |
| `streetAddress2` | text | ❌ | Optional |
| `city` | text | ✅ | Non-empty |
| `state` | text | ✅ | Non-empty |
| `postalCode` | text | ✅ | Valid postal code |
| `addressType` | select | ✅ | `home` \| `work` \| `other` |
| `deliveryNotes` | textarea | ❌ | Free text |
| `isDefault` | checkbox | ❌ | Boolean |

---

### 3.3 Address Management (`/account/addresses`)
**File:** `src/pages/user/AddressManagement.tsx`

**CRUD Operations:**
- Add new address (uses AddressForm)
- Edit existing address
- Delete address
- Set default address

---

## 4. Seller Profile & KYC

### 4.1 Seller Profile (`/seller/profile`)
**File:** `src/pages/seller/SellerProfile.tsx`

| Section | Field | Type | Required | Validation |
|---------|-------|------|----------|------------|
| **Shop Info** | `shopLogo` | file | ❌ | Image file |
| | `shopName` | text | ✅ | Non-empty |
| | `description` | textarea | ❌ | Free text |
| | `website` | url | ❌ | Valid URL |
| **Contact** | `email` | email | ✅ | Valid email |
| | `phone` | tel | ✅ | Valid phone |
| **Address** | `address` | text | ✅ | Non-empty |
| | `city` | text | ✅ | Non-empty |
| | `state` | text | ✅ | Non-empty |
| | `zipCode` | text | ✅ | Valid postal code |
| **Bank** | `bankName` | text | ✅ | Non-empty |
| | `accountNumber` | text | ✅ | Valid account number |
| | `ifscCode` | text | ✅ | Valid IFSC format |

---

### 4.2 Seller KYC Verification (`/seller/kyc`)
**File:** `src/pages/seller/SellerKYCVerification.tsx`

**5-Step KYC Process:**

#### Step 1: Tax & Business Information
| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `pan` | text | ✅ | Valid PAN format (XXXXX0000X) |
| `gstin` | text | ❌ | Valid GSTIN format (15 chars) |

#### Step 2: Identity Verification
| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `id_type` | select | ✅ | `aadhar` \| `passport` \| `voter` \| `driver_license` |
| `id_number` | text | ✅ | Valid ID number based on type |
| `id_document_file` | file | ✅ | PDF/Image, max 5MB |

**ID Number Validation:**
- Aadhar: 12 digits
- Passport: 8 alphanumeric chars
- Voter ID: 10 alphanumeric chars
- Driver's License: Varies by state

#### Step 3: Address Information
| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `business_address.street_address_1` | text | ✅ | Non-empty |
| `business_address.street_address_2` | text | ❌ | Optional |
| `business_address.city` | text | ✅ | Non-empty |
| `business_address.state` | text | ✅ | Non-empty |
| `business_address.postal_code` | text | ✅ | Valid postal code |
| `business_address.country` | text | ✅ | Valid country |
| `address_proof_file` | file | ✅ | PDF/Image, max 5MB |

#### Step 4: Bank Details
| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `bank_holder_name` | text | ✅ | Non-empty |
| `account_number` | text | ✅ | Valid account number |
| `account_type` | select | ✅ | `checking` \| `savings` \| `current` |
| `ifsc_code` | text | ✅ | Valid IFSC format (11 chars) |
| `bank_statement_file` | file | ✅ | PDF, max 5MB |

#### Step 5: Compliance & Legal
| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `pep_declaration` | checkbox | ✅ | Must be checked |
| `sanctions_check` | checkbox | ✅ | Must be checked |
| `aml_compliance` | checkbox | ✅ | Must be checked |
| `tax_compliance` | checkbox | ✅ | Must be checked |
| `terms_accepted` | checkbox | ✅ | Must be checked |

**Compliance Declarations:**
- **PEP Declaration:** "I am not a Politically Exposed Person"
- **Sanctions Check:** "I am not on any sanctions list"
- **AML Compliance:** "I agree to anti-money laundering policies"
- **Tax Compliance:** "I agree to report all taxes"
- **Terms Accepted:** "I accept the seller terms and conditions"

---

## 5. Product Listing

### 5.1 Admin Product Listing Wizard
**Files:** `src/pages/admin/modules/AdminListings1-6.tsx`

#### Step 1: Basic Details
| Field | Type | Required |
|-------|------|----------|
| `productName` | text | ✅ |
| `brand` | text | ✅ |
| `category` | select | ✅ |
| `subCategory` | select | ✅ |
| `description` | textarea | ✅ |

#### Step 2: Media Upload
| Field | Type | Required |
|-------|------|----------|
| `mainImage` | file | ✅ |
| `additionalImages` | file[] | ❌ (max 8) |
| `video` | file | ❌ |

#### Step 3: Pricing & Inventory
| Field | Type | Required |
|-------|------|----------|
| `mrp` | number | ✅ |
| `sellingPrice` | number | ✅ |
| `currency` | select | ✅ |
| `stock` | number | ✅ |
| `sku` | text | ✅ |
| `hasVariants` | checkbox | ❌ |
| `variants` | array | Conditional |

#### Step 4: Specifications
| Field | Type | Required |
|-------|------|----------|
| `specifications` | key-value pairs | ❌ |
| `highlights` | text[] | ❌ |
| `warranty` | text | ❌ |

#### Step 5: Shipping & SEO
| Field | Type | Required |
|-------|------|----------|
| `weight` | number | ✅ |
| `dimensions.length` | number | ✅ |
| `dimensions.width` | number | ✅ |
| `dimensions.height` | number | ✅ |
| `shippingClass` | select | ✅ |
| `metaTitle` | text | ❌ |
| `metaDescription` | textarea | ❌ |
| `tags` | text[] | ❌ |

#### Step 6: Review & Submit
- Review all entered data
- Preview product listing
- Submit for approval

---

## 6. Cognito Attribute Mapping

### Standard Attributes (Currently Configured)
| Cognito Attribute | Write | Read | Usage |
|-------------------|-------|------|-------|
| `email` | ✅ | ✅ | User email address |
| `name` | ✅ | ✅ | Full name |
| `given_name` | ✅ | ✅ | First name |
| `family_name` | ✅ | ✅ | Last name |
| `phone_number` | ✅ | ✅ | Phone number with country code |
| `address` | ✅ | ✅ | JSON-encoded address |
| `profile` | ✅ | ✅ | User role/business type |
| `email_verified` | ❌ | ✅ | Email verification status |
| `phone_number_verified` | ❌ | ✅ | Phone verification status |

### Custom Attributes (Future)
| Attribute | Purpose |
|-----------|---------|
| `custom:country` | User's country ID |
| `custom:user_type` | `user` \| `seller` |
| `custom:kyc_status` | KYC verification status |

---

## 7. Database Schema Requirements

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  cognito_sub VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  country_id UUID REFERENCES countries(id),
  role VARCHAR(20) DEFAULT 'user',
  profile_type VARCHAR(20) DEFAULT 'member',
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  zip_code VARCHAR(20),
  is_banned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Sellers Table
```sql
CREATE TABLE sellers (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  shop_name VARCHAR(255) NOT NULL,
  description TEXT,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  website VARCHAR(255),
  country_id UUID REFERENCES countries(id),
  business_type_id UUID REFERENCES business_types(id),
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  zip_code VARCHAR(20),
  bank_name VARCHAR(255),
  account_number VARCHAR(50),
  ifsc_code VARCHAR(20),
  badge VARCHAR(20) DEFAULT 'silver',
  kyc_status VARCHAR(20) DEFAULT 'pending',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Seller KYC Table
```sql
CREATE TABLE seller_kyc (
  id UUID PRIMARY KEY,
  seller_id UUID REFERENCES sellers(id),
  pan VARCHAR(10) NOT NULL,
  gstin VARCHAR(15),
  id_type VARCHAR(20) NOT NULL,
  id_number VARCHAR(50) NOT NULL,
  id_document_url TEXT NOT NULL,
  business_address JSONB NOT NULL,
  address_proof_url TEXT NOT NULL,
  bank_holder_name VARCHAR(255) NOT NULL,
  account_number VARCHAR(50) NOT NULL,
  account_type VARCHAR(20) NOT NULL,
  ifsc_code VARCHAR(11) NOT NULL,
  bank_statement_url TEXT NOT NULL,
  pep_declaration BOOLEAN NOT NULL DEFAULT FALSE,
  sanctions_check BOOLEAN NOT NULL DEFAULT FALSE,
  aml_compliance BOOLEAN NOT NULL DEFAULT FALSE,
  tax_compliance BOOLEAN NOT NULL DEFAULT FALSE,
  terms_accepted BOOLEAN NOT NULL DEFAULT FALSE,
  kyc_status VARCHAR(20) DEFAULT 'draft',
  kyc_tier INTEGER DEFAULT 1,
  rejection_reason TEXT,
  verified_by_admin UUID,
  verified_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  submitted_at TIMESTAMP
);
```

### User Addresses Table
```sql
CREATE TABLE user_addresses (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  full_name VARCHAR(255) NOT NULL,
  phone_number VARCHAR(20) NOT NULL,
  email VARCHAR(255) NOT NULL,
  country VARCHAR(100) NOT NULL,
  street_address_1 TEXT NOT NULL,
  street_address_2 TEXT,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  postal_code VARCHAR(20) NOT NULL,
  address_type VARCHAR(20) NOT NULL,
  delivery_notes TEXT,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Countries Table
```sql
CREATE TABLE countries (
  id UUID PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  code VARCHAR(3) NOT NULL UNIQUE,
  phone_code VARCHAR(10),
  currency VARCHAR(10),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Business Types Table
```sql
CREATE TABLE business_types (
  id UUID PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## Summary

### Authentication Method
✅ **Email OTP Verification** - Used for all signup and password reset flows
❌ **Mobile OTP** - NOT used in this platform

### Key Input Categories

| Category | Total Fields | Required Fields |
|----------|--------------|-----------------|
| User Signup | 4 | 4 |
| User Login | 2 | 2 |
| Seller Signup | 6 | 6 |
| Seller Login | 2 | 2 |
| User Profile | 8 | 3 |
| Address Form | 12 | 9 |
| Seller Profile | 13 | 10 |
| Seller KYC | 20+ | 18 |
| Product Listing | 30+ | 15 |

### File Upload Requirements
| Upload Type | Formats | Max Size |
|-------------|---------|----------|
| ID Document | PDF, JPG, PNG | 5MB |
| Address Proof | PDF, JPG, PNG | 5MB |
| Bank Statement | PDF | 5MB |
| Shop Logo | JPG, PNG | 2MB |
| Product Images | JPG, PNG, WebP | 5MB each |
| Product Video | MP4, WebM | 50MB |

---

*Last Updated: Generated from codebase analysis*
