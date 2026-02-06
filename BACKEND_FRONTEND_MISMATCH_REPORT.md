# Backend-Frontend Integration Mismatch Report

**Date:** February 5, 2026  
**Status:** ⚠️ CRITICAL ISSUES FOUND

## Summary

The frontend SellerProductListing component is attempting to send **11 fields** to the GraphQL backend that either:
- Don't exist in the schema (9 fields)
- Have incorrect field names (2 fields)

This will cause GraphQL mutation errors or data loss.

---

## ❌ Fields NOT Supported by Backend Schema

### 1. **`product_type`**
- **Location:** Line ~260 in productInput
- **Status:** Field exists in UI (line ~884-900) but NOT in schema
- **Action:** Remove from UI and productInput

### 2. **`seller_notes`**  
- **Location:** Line ~280 in productInput
- **Status:** Field exists in UI (line ~1417-1450) but NOT in schema
- **Action:** Remove entire "Seller Notes" section from UI

### 3. **`size_applicable`**
- **Location:** Line ~285 in productInput  
- **Status:** Sent to backend but NOT in schema
- **Action:** Remove from productInput (keep in local state for UI logic only)

### 4. **`color_applicable`**
- **Location:** Line ~286 in productInput
- **Status:** Sent to backend but NOT in schema
- **Action:** Remove from productInput (keep in local state for UI logic only)

### 5. **`courier_partner`**
- **Location:** Line ~302 in productInput
- **Status:** Field exists in UI (line ~1702-1722) but NOT in schema
- **Action:** Remove entire "Courier Partner" conditional section

### 6. **`manufacturer_address`**
- **Location:** Line ~304 in productInput
- **Status:** Field exists in UI (line ~1739-1744) but NOT in schema
- **Action:** Remove manufacturer_address textarea from Manufacturer Details

### 7. **`packing_details`**
- **Location:** Line ~305 in productInput
- **Status:** Field exists in UI (line ~1749-1764) but NOT in schema
- **Action:** Remove entire "Packing Details" section

### 8. **`country_of_origin`**
- **Location:** Line ~308 in productInput
- **Status:** Field exists in UI (line ~1456-1497) as part of "Country & Currency"
- **Action:** Remove country selection dropdown

### 9. **`country_code`**
- **Location:** Line ~312 in productInput
- **Status:** Sent to backend but NOT in schema
- **Action:** Remove from productInput

---

## ⚠️ Fields With Wrong Names

### 10. **`cancellation_days`** → Should be `cancellation_policy_days`
- **Location:** Line ~306 in productInput
- **Current:** `cancellation_days: newProduct.cancellationDays`
- **Should be:** `cancellation_policy_days: newProduct.cancellationPolicyDays`
- **Status:** ✅  ALREADY FIXED

### 11. **`return_days`** → Should be `return_policy_days`
- **Location:** Line ~307 in productInput
- **Current:** `return_days: newProduct.returnDays`
- **Should be:** `return_policy_days: newProduct.returnPolicyDays`
- **Status:** ✅ ALREADY FIXED

---

## ✅ Correctly Mapped Fields (42 total)

**Basic Info (6):**
- seller_id, name, category_id, sub_category_id, brand_name, model_number

**Descriptions (3):**
- description, short_description, highlights

**Media (3):**
- image_url, images, videos

**Pricing (8):**
- price, mrp, currency, stock, gst_rate, platform_fee, commission, delivery_countries

**Specifications (1):**
- specifications

**Variants (2):**
- size_variants, color_variants

**Shipping (4):**
- package_weight, package_dimensions, shipping_type, manufacturer_name

**Policies (3):**  
- cancellation_policy_days ✅, return_policy_days ✅, offer_rules

**Status (3):**
- approval_status, is_active, rating, review_count

**Timestamps (2):**
- created_at, updated_at

---

## 🔧 Required Actions

### HIGH PRIORITY (Breaking Issues):
1. ✅ Fix field names: `cancellation_days` → `cancellation_policy_days`
2. ✅ Fix field names: `return_days` → `return_policy_days`  
3. ✅ Remove: `countryCode` and `countryOfOrigin` from state
4. ❌ Remove: `product_type` from productInput
5. ❌ Remove: `seller_notes` array from productInput
6. ❌ Remove: `size_applicable`, `color_applicable` from productInput
7. ❌ Remove: `courier_partner`, `manufacturer_address`, `packing_details` from productInput
8. ❌ Remove: `country_of_origin`, `country_code` from productInput

### MEDIUM PRIORITY (UI Cleanup):
9. ❌ Remove "Product Type" input field (lines ~884-900)
10. ❌ Remove "Seller Notes" section entirely (lines ~1417-1450)
11. ❌ Remove "Country & Currency" section (lines ~1456-1514)
12. ❌ Remove "Courier Partner" conditional section (lines ~1702-1722)
13. ❌ Remove manufacturer_address field from Manufacturer Details
14. ❌ Remove "Packing Details" section entirely (lines ~1749-1764)

### LOW PRIORITY (State Cleanup):
15. ❌ Remove unused state variables: `newSellerNote`, related helper functions
16. ❌ Remove productType, courierPartner, manufacturerAddress, packingDetails from state
17. ❌ Update validation to remove checks for unsupported fields

---

## 📊 Impact Assessment

### Data Loss Risk: **HIGH**
- Products created will be missing fields that sellers fill out
- 9 fields of data will be silently dropped

### Error Risk: **MEDIUM**  
- GraphQL may reject mutations with unknown fields
- Type mismatches could cause runtime errors

### User Experience: **POOR**
- Sellers fill out extensive forms only to have data ignored
- No feedback that certain fields aren't saved

---

## 🎯 Recommendations

### Option 1: Update Backend Schema (RECOMMENDED)
**Pros:**
- Preserves all seller input data
- No loss of functionality
- Better for future scalability

**Cons:**
- Requires schema migration
- Backend deployment needed

**Fields to Add to Schema:**
```graphql
type Product {
  # ... existing fields ...
  product_type: String
  seller_notes: [String]
  size_applicable: Boolean
  color_applicable: Boolean
  courier_partner: String
  manufacturer_address: String
  packing_details: String
  country_of_origin: String
  country_code: String
}
```

### Option 2: Remove Unsupported Fields from Frontend (FASTER)
**Pros:**
- No backend changes needed
- Immediate fix
- Guaranteed compatibility

**Cons:**
- Feature reduction
- Less detailed product information
- May disappoint sellers expecting these fields

---

## 🚀 Immediate Fix Checklist

- [x] Change `cancellation_days` → `cancellation_policy_days`
- [x] Change `return_days` → `return_policy_days`
- [x] Remove `countryCode`, `countryOfOrigin` from pricing state
- [ ] Remove 9 unsupported fields from productInput
- [ ] Remove/hide 6 UI sections for unsupported fields  
- [ ] Update validation logic
- [ ] Test GraphQL mutation with cleaned payload
- [ ] Document changes for team

---

## 📝 Notes

**Total Fields in Form:** ~50
**Supported by Backend:** 42  
**Unsupported:** 9  
**Name Mismatches:** 2 (FIXED)

**Compliance Rate:** 84% (42/50)
