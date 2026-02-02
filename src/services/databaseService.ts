/**
 * Database Service for Aurora PostgreSQL
 * Provides methods to fetch countries and business types from the database
 */

import { generateClient } from 'aws-amplify/api';

const client = generateClient();

// ============================================================
// Types matching Aurora PostgreSQL schema
// ============================================================

export interface Country {
  id: string;
  country_name: string;
  country_code: string;
  currency_code: string;
  currency_name: string;
  dialing_code: string;
  region: string;
  is_active: boolean;
}

export interface BusinessType {
  id: string;
  business_type_name: string;
  description: string;
  icon_name: string;
  is_active: boolean;
}

// ============================================================
// GraphQL Queries for Aurora PostgreSQL Data
// These will be used when AppSync is connected to Aurora
// ============================================================

const LIST_COUNTRIES = /* GraphQL */ `
  query ListCountries($limit: Int, $isActive: Boolean) {
    listCountries(limit: $limit, isActive: $isActive) {
      items {
        id
        country_name
        country_code
        currency_code
        currency_name
        dialing_code
        region
        is_active
      }
    }
  }
`;

const LIST_BUSINESS_TYPES = /* GraphQL */ `
  query ListBusinessTypes($limit: Int, $isActive: Boolean) {
    listBusinessTypes(limit: $limit, isActive: $isActive) {
      items {
        id
        business_type_name
        description
        icon_name
        is_active
      }
    }
  }
`;

// DynamoDB GraphQL queries (existing)
const LIST_COUNTRY_LIST_BZDCORES = /* GraphQL */ `
  query ListCountryListBzdcores($limit: Int) {
    listCountryListBzdcores(limit: $limit) {
      items {
        id
        countryName
        shortCode
        currency
        dialCode
      }
    }
  }
`;

const LIST_BUSINESS_TYPE_BZDCORES = /* GraphQL */ `
  query ListBusinessTypeBzdcores($limit: Int) {
    listBusinessTypeBzdcores(limit: $limit) {
      items {
        id
        typeName
        description
      }
    }
  }
`;

// ============================================================
// Fallback Data (matches Aurora PostgreSQL data)
// ============================================================

const FALLBACK_COUNTRIES: Country[] = [
  { id: '1', country_name: 'India', country_code: 'IND', currency_code: 'INR', currency_name: 'Indian Rupee', dialing_code: '+91', region: 'Asia', is_active: true },
  { id: '2', country_name: 'United States', country_code: 'USA', currency_code: 'USD', currency_name: 'US Dollar', dialing_code: '+1', region: 'Americas', is_active: true },
  { id: '3', country_name: 'United Kingdom', country_code: 'GBR', currency_code: 'GBP', currency_name: 'British Pound', dialing_code: '+44', region: 'Europe', is_active: true },
  { id: '4', country_name: 'Canada', country_code: 'CAN', currency_code: 'CAD', currency_name: 'Canadian Dollar', dialing_code: '+1', region: 'Americas', is_active: true },
  { id: '5', country_name: 'Australia', country_code: 'AUS', currency_code: 'AUD', currency_name: 'Australian Dollar', dialing_code: '+61', region: 'Oceania', is_active: true },
  { id: '6', country_name: 'Germany', country_code: 'DEU', currency_code: 'EUR', currency_name: 'Euro', dialing_code: '+49', region: 'Europe', is_active: true },
  { id: '7', country_name: 'France', country_code: 'FRA', currency_code: 'EUR', currency_name: 'Euro', dialing_code: '+33', region: 'Europe', is_active: true },
  { id: '8', country_name: 'Japan', country_code: 'JPN', currency_code: 'JPY', currency_name: 'Japanese Yen', dialing_code: '+81', region: 'Asia', is_active: true },
  { id: '9', country_name: 'Singapore', country_code: 'SGP', currency_code: 'SGD', currency_name: 'Singapore Dollar', dialing_code: '+65', region: 'Asia', is_active: true },
  { id: '10', country_name: 'United Arab Emirates', country_code: 'ARE', currency_code: 'AED', currency_name: 'UAE Dirham', dialing_code: '+971', region: 'Asia', is_active: true },
  { id: '11', country_name: 'Saudi Arabia', country_code: 'SAU', currency_code: 'SAR', currency_name: 'Saudi Riyal', dialing_code: '+966', region: 'Asia', is_active: true },
  { id: '12', country_name: 'Qatar', country_code: 'QAT', currency_code: 'QAR', currency_name: 'Qatari Riyal', dialing_code: '+974', region: 'Asia', is_active: true },
  { id: '13', country_name: 'Kuwait', country_code: 'KWT', currency_code: 'KWD', currency_name: 'Kuwaiti Dinar', dialing_code: '+965', region: 'Asia', is_active: true },
  { id: '14', country_name: 'Bahrain', country_code: 'BHR', currency_code: 'BHD', currency_name: 'Bahraini Dinar', dialing_code: '+973', region: 'Asia', is_active: true },
  { id: '15', country_name: 'Oman', country_code: 'OMN', currency_code: 'OMR', currency_name: 'Omani Rial', dialing_code: '+968', region: 'Asia', is_active: true },
  { id: '16', country_name: 'Malaysia', country_code: 'MYS', currency_code: 'MYR', currency_name: 'Malaysian Ringgit', dialing_code: '+60', region: 'Asia', is_active: true },
  { id: '17', country_name: 'Thailand', country_code: 'THA', currency_code: 'THB', currency_name: 'Thai Baht', dialing_code: '+66', region: 'Asia', is_active: true },
  { id: '18', country_name: 'Indonesia', country_code: 'IDN', currency_code: 'IDR', currency_name: 'Indonesian Rupiah', dialing_code: '+62', region: 'Asia', is_active: true },
  { id: '19', country_name: 'Philippines', country_code: 'PHL', currency_code: 'PHP', currency_name: 'Philippine Peso', dialing_code: '+63', region: 'Asia', is_active: true },
  { id: '20', country_name: 'Vietnam', country_code: 'VNM', currency_code: 'VND', currency_name: 'Vietnamese Dong', dialing_code: '+84', region: 'Asia', is_active: true },
  { id: '21', country_name: 'Bangladesh', country_code: 'BGD', currency_code: 'BDT', currency_name: 'Bangladeshi Taka', dialing_code: '+880', region: 'Asia', is_active: true },
  { id: '22', country_name: 'Pakistan', country_code: 'PAK', currency_code: 'PKR', currency_name: 'Pakistani Rupee', dialing_code: '+92', region: 'Asia', is_active: true },
  { id: '23', country_name: 'Sri Lanka', country_code: 'LKA', currency_code: 'LKR', currency_name: 'Sri Lankan Rupee', dialing_code: '+94', region: 'Asia', is_active: true },
  { id: '24', country_name: 'Nepal', country_code: 'NPL', currency_code: 'NPR', currency_name: 'Nepalese Rupee', dialing_code: '+977', region: 'Asia', is_active: true },
  { id: '25', country_name: 'China', country_code: 'CHN', currency_code: 'CNY', currency_name: 'Chinese Yuan', dialing_code: '+86', region: 'Asia', is_active: true },
  { id: '26', country_name: 'South Korea', country_code: 'KOR', currency_code: 'KRW', currency_name: 'South Korean Won', dialing_code: '+82', region: 'Asia', is_active: true },
  { id: '27', country_name: 'Hong Kong', country_code: 'HKG', currency_code: 'HKD', currency_name: 'Hong Kong Dollar', dialing_code: '+852', region: 'Asia', is_active: true },
  { id: '28', country_name: 'Taiwan', country_code: 'TWN', currency_code: 'TWD', currency_name: 'Taiwan Dollar', dialing_code: '+886', region: 'Asia', is_active: true },
  { id: '29', country_name: 'Italy', country_code: 'ITA', currency_code: 'EUR', currency_name: 'Euro', dialing_code: '+39', region: 'Europe', is_active: true },
  { id: '30', country_name: 'Spain', country_code: 'ESP', currency_code: 'EUR', currency_name: 'Euro', dialing_code: '+34', region: 'Europe', is_active: true },
  { id: '31', country_name: 'Netherlands', country_code: 'NLD', currency_code: 'EUR', currency_name: 'Euro', dialing_code: '+31', region: 'Europe', is_active: true },
  { id: '32', country_name: 'Belgium', country_code: 'BEL', currency_code: 'EUR', currency_name: 'Euro', dialing_code: '+32', region: 'Europe', is_active: true },
  { id: '33', country_name: 'Sweden', country_code: 'SWE', currency_code: 'SEK', currency_name: 'Swedish Krona', dialing_code: '+46', region: 'Europe', is_active: true },
  { id: '34', country_name: 'Norway', country_code: 'NOR', currency_code: 'NOK', currency_name: 'Norwegian Krone', dialing_code: '+47', region: 'Europe', is_active: true },
  { id: '35', country_name: 'Denmark', country_code: 'DNK', currency_code: 'DKK', currency_name: 'Danish Krone', dialing_code: '+45', region: 'Europe', is_active: true },
  { id: '36', country_name: 'Finland', country_code: 'FIN', currency_code: 'EUR', currency_name: 'Euro', dialing_code: '+358', region: 'Europe', is_active: true },
  { id: '37', country_name: 'Ireland', country_code: 'IRL', currency_code: 'EUR', currency_name: 'Euro', dialing_code: '+353', region: 'Europe', is_active: true },
  { id: '38', country_name: 'Austria', country_code: 'AUT', currency_code: 'EUR', currency_name: 'Euro', dialing_code: '+43', region: 'Europe', is_active: true },
  { id: '39', country_name: 'Switzerland', country_code: 'CHE', currency_code: 'CHF', currency_name: 'Swiss Franc', dialing_code: '+41', region: 'Europe', is_active: true },
  { id: '40', country_name: 'Brazil', country_code: 'BRA', currency_code: 'BRL', currency_name: 'Brazilian Real', dialing_code: '+55', region: 'Americas', is_active: true },
  { id: '41', country_name: 'Mexico', country_code: 'MEX', currency_code: 'MXN', currency_name: 'Mexican Peso', dialing_code: '+52', region: 'Americas', is_active: true },
  { id: '42', country_name: 'Argentina', country_code: 'ARG', currency_code: 'ARS', currency_name: 'Argentine Peso', dialing_code: '+54', region: 'Americas', is_active: true },
];

const FALLBACK_BUSINESS_TYPES: BusinessType[] = [
  { id: '1', business_type_name: 'Electronics', description: 'Electronics and gadgets', icon_name: 'laptop', is_active: true },
  { id: '2', business_type_name: 'Fashion & Apparel', description: 'Clothing, shoes, and accessories', icon_name: 'shirt', is_active: true },
  { id: '3', business_type_name: 'Home & Garden', description: 'Furniture, home decor, and gardening', icon_name: 'home', is_active: true },
  { id: '4', business_type_name: 'Sports & Outdoors', description: 'Sports equipment and outdoor gear', icon_name: 'dumbbell', is_active: true },
  { id: '5', business_type_name: 'Books & Media', description: 'Books, movies, music, and media', icon_name: 'book', is_active: true },
  { id: '6', business_type_name: 'Beauty & Personal Care', description: 'Cosmetics, skincare, and personal care', icon_name: 'sparkles', is_active: true },
  { id: '7', business_type_name: 'Toys & Games', description: 'Toys, board games, and gaming', icon_name: 'gamepad-2', is_active: true },
  { id: '8', business_type_name: 'Food & Beverages', description: 'Food products and beverages', icon_name: 'utensils', is_active: true },
  { id: '9', business_type_name: 'Health & Wellness', description: 'Health products and supplements', icon_name: 'heart-pulse', is_active: true },
  { id: '10', business_type_name: 'Automotive', description: 'Car parts and automotive accessories', icon_name: 'car', is_active: true },
  { id: '11', business_type_name: 'Handmade & Crafts', description: 'Handmade and craft items', icon_name: 'scissors', is_active: true },
  { id: '12', business_type_name: 'Jewelry & Watches', description: 'Jewelry and watches', icon_name: 'gem', is_active: true },
  { id: '13', business_type_name: 'Pet Supplies', description: 'Pet food, toys, and accessories', icon_name: 'paw-print', is_active: true },
  { id: '14', business_type_name: 'Office Supplies', description: 'Office equipment and stationery', icon_name: 'briefcase', is_active: true },
  { id: '15', business_type_name: 'Digital Products', description: 'Software, apps, and digital goods', icon_name: 'cloud', is_active: true },
];

// ============================================================
// Service Functions
// ============================================================

/**
 * Fetch all active countries from the database
 * Falls back to mock data if API fails
 */
export async function fetchCountries(): Promise<Country[]> {
  try {
    // Try Aurora PostgreSQL query first (when connected)
    try {
      const response: any = await client.graphql({
        query: LIST_COUNTRIES,
        variables: { limit: 100, isActive: true }
      });
      
      const items = response?.data?.listCountries?.items;
      if (items && items.length > 0) {
        return items;
      }
    } catch {
      // Aurora not connected yet, try DynamoDB
    }
    
    // Fallback to existing DynamoDB query
    const dynamoResponse: any = await client.graphql({ 
      query: LIST_COUNTRY_LIST_BZDCORES,
      variables: { limit: 100 }
    });
    const dynamoItems = dynamoResponse?.data?.listCountryListBzdcores?.items;
    
    if (dynamoItems && dynamoItems.length > 0) {
      // Map DynamoDB format to Aurora format
      return dynamoItems.map((item: any) => ({
        id: item.id,
        country_name: item.countryName,
        country_code: item.shortCode,
        currency_code: item.currency,
        currency_name: item.currency,
        dialing_code: item.dialCode || '+1',
        region: 'Unknown',
        is_active: true
      }));
    }
    
    return FALLBACK_COUNTRIES;
  } catch (error) {
    console.error('Error fetching countries:', error);
    return FALLBACK_COUNTRIES;
  }
}

/**
 * Fetch all active business types from the database
 * Falls back to mock data if API fails
 */
export async function fetchBusinessTypes(): Promise<BusinessType[]> {
  try {
    // Try Aurora PostgreSQL query first (when connected)
    try {
      const response: any = await client.graphql({
        query: LIST_BUSINESS_TYPES,
        variables: { limit: 50, isActive: true }
      });
      
      const items = response?.data?.listBusinessTypes?.items;
      if (items && items.length > 0) {
        return items;
      }
    } catch {
      // Aurora not connected yet, try DynamoDB
    }
    
    // Fallback to existing DynamoDB query
    const dynamoResponse: any = await client.graphql({ 
      query: LIST_BUSINESS_TYPE_BZDCORES,
      variables: { limit: 50 }
    });
    const dynamoItems = dynamoResponse?.data?.listBusinessTypeBzdcores?.items;
    
    if (dynamoItems && dynamoItems.length > 0) {
      // Map DynamoDB format to Aurora format
      return dynamoItems.map((item: any) => ({
        id: item.id,
        business_type_name: item.typeName,
        description: item.description || '',
        icon_name: '',
        is_active: true
      }));
    }
    
    return FALLBACK_BUSINESS_TYPES;
  } catch (error) {
    console.error('Error fetching business types:', error);
    return FALLBACK_BUSINESS_TYPES;
  }
}

/**
 * Get a country by its ID
 */
export async function getCountryById(id: string): Promise<Country | null> {
  const countries = await fetchCountries();
  return countries.find(c => c.id === id) || null;
}

/**
 * Get a business type by its ID
 */
export async function getBusinessTypeById(id: string): Promise<BusinessType | null> {
  const businessTypes = await fetchBusinessTypes();
  return businessTypes.find(b => b.id === id) || null;
}

/**
 * Get countries by region
 */
export async function getCountriesByRegion(region: string): Promise<Country[]> {
  const countries = await fetchCountries();
  return countries.filter(c => c.region.toLowerCase() === region.toLowerCase());
}

// Export fallback data for direct use
export { FALLBACK_COUNTRIES, FALLBACK_BUSINESS_TYPES };
