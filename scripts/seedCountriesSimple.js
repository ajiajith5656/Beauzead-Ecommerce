#!/usr/bin/env node

/**
 * Simple script to seed Country data
 * Run: node scripts/seedCountriesSimple.js
 */

const countries = [
  { code: 'IN', name: 'India', dialCode: '+91', currency: 'INR' },
  { code: 'PK', name: 'Pakistan', dialCode: '+92', currency: 'PKR' },
  { code: 'CN', name: 'China', dialCode: '+86', currency: 'CNY' },
  { code: 'LK', name: 'Sri Lanka', dialCode: '+94', currency: 'LKR' },
  { code: 'GB', name: 'United Kingdom', dialCode: '+44', currency: 'GBP' },
  { code: 'EU', name: 'European Union', dialCode: '+33', currency: 'EUR' },
];

const businessTypes = [
  { name: 'Electronics', description: 'Electronic devices and gadgets' },
  { name: 'Clothing', description: 'Apparel and fashion items' },
  { name: 'Books', description: 'Physical and digital books' },
  { name: 'Food & Beverage', description: 'Food, beverages, and groceries' },
  { name: 'Home & Garden', description: 'Home furnishings and garden items' },
  { name: 'Sports', description: 'Sports equipment and gear' },
  { name: 'Beauty', description: 'Beauty and personal care products' },
  { name: 'Toys', description: 'Toys and games' },
];

console.log('\n📦 COUNTRIES DATA:\n');
console.table(countries);

console.log('\n📦 BUSINESS TYPES DATA:\n');
console.table(businessTypes);

console.log('\n✅ Data ready to insert into your database\n');

// Export for use in other files
export { countries, businessTypes };
