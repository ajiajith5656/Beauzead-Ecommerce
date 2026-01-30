// Script to insert actual country data into CountryListBzdcore via GraphQL API
// Run: node scripts/insertCountries.js

import fetch from 'node-fetch';

const API_URL = 'https://woqi3tosm5a2jnj4w6zit2mfye.appsync-api.us-east-1.amazonaws.com/graphql';
const API_KEY = 'da2-hgvpvqv72jcj3o2sglactpt3gq';

const countries = [
  // Asia
  { countryName: 'India', shortCode: 'IND', currency: 'INR', dialCode: '+91' },
  { countryName: 'China', shortCode: 'CHN', currency: 'CNY', dialCode: '+86' },
  { countryName: 'Japan', shortCode: 'JPN', currency: 'JPY', dialCode: '+81' },
  { countryName: 'South Korea', shortCode: 'KOR', currency: 'KRW', dialCode: '+82' },
  { countryName: 'Singapore', shortCode: 'SGP', currency: 'SGD', dialCode: '+65' },
  { countryName: 'Malaysia', shortCode: 'MYS', currency: 'MYR', dialCode: '+60' },
  { countryName: 'Indonesia', shortCode: 'IDN', currency: 'IDR', dialCode: '+62' },
  { countryName: 'Thailand', shortCode: 'THA', currency: 'THB', dialCode: '+66' },
  { countryName: 'Vietnam', shortCode: 'VNM', currency: 'VND', dialCode: '+84' },
  { countryName: 'Philippines', shortCode: 'PHL', currency: 'PHP', dialCode: '+63' },
  { countryName: 'Bangladesh', shortCode: 'BGD', currency: 'BDT', dialCode: '+880' },
  { countryName: 'Pakistan', shortCode: 'PAK', currency: 'PKR', dialCode: '+92' },
  { countryName: 'Sri Lanka', shortCode: 'LKA', currency: 'LKR', dialCode: '+94' },
  { countryName: 'Nepal', shortCode: 'NPL', currency: 'NPR', dialCode: '+977' },
  { countryName: 'UAE', shortCode: 'ARE', currency: 'AED', dialCode: '+971' },
  { countryName: 'Saudi Arabia', shortCode: 'SAU', currency: 'SAR', dialCode: '+966' },
  { countryName: 'Qatar', shortCode: 'QAT', currency: 'QAR', dialCode: '+974' },
  { countryName: 'Kuwait', shortCode: 'KWT', currency: 'KWD', dialCode: '+965' },
  { countryName: 'Oman', shortCode: 'OMN', currency: 'OMR', dialCode: '+968' },
  { countryName: 'Bahrain', shortCode: 'BHR', currency: 'BHD', dialCode: '+973' },
  { countryName: 'Yemen', shortCode: 'YEM', currency: 'YER', dialCode: '+967' },
  { countryName: 'Iraq', shortCode: 'IRQ', currency: 'IQD', dialCode: '+964' },
  { countryName: 'Jordan', shortCode: 'JOR', currency: 'JOD', dialCode: '+962' },
  { countryName: 'Lebanon', shortCode: 'LBN', currency: 'LBP', dialCode: '+961' },
  { countryName: 'Syria', shortCode: 'SYR', currency: 'SYP', dialCode: '+963' },
  // UK, USA, Gulf, Africa
  { countryName: 'United Kingdom', shortCode: 'GBR', currency: 'GBP', dialCode: '+44' },
  { countryName: 'United States', shortCode: 'USA', currency: 'USD', dialCode: '+1' },
  { countryName: 'Canada', shortCode: 'CAN', currency: 'CAD', dialCode: '+1' },
  { countryName: 'Australia', shortCode: 'AUS', currency: 'AUD', dialCode: '+61' },
  // Africa
  { countryName: 'Nigeria', shortCode: 'NGA', currency: 'NGN', dialCode: '+234' },
  { countryName: 'South Africa', shortCode: 'ZAF', currency: 'ZAR', dialCode: '+27' },
  { countryName: 'Egypt', shortCode: 'EGY', currency: 'EGP', dialCode: '+20' },
  { countryName: 'Kenya', shortCode: 'KEN', currency: 'KES', dialCode: '+254' },
  { countryName: 'Ghana', shortCode: 'GHA', currency: 'GHS', dialCode: '+233' },
  { countryName: 'Morocco', shortCode: 'MAR', currency: 'MAD', dialCode: '+212' },
  { countryName: 'Ethiopia', shortCode: 'ETH', currency: 'ETB', dialCode: '+251' },
  { countryName: 'Tanzania', shortCode: 'TZA', currency: 'TZS', dialCode: '+255' },
  { countryName: 'Uganda', shortCode: 'UGA', currency: 'UGX', dialCode: '+256' },
  { countryName: 'Algeria', shortCode: 'DZA', currency: 'DZD', dialCode: '+213' },
  { countryName: 'Sudan', shortCode: 'SDN', currency: 'SDG', dialCode: '+249' },
  { countryName: 'Angola', shortCode: 'AGO', currency: 'AOA', dialCode: '+244' },
  { countryName: 'Cameroon', shortCode: 'CMR', currency: 'XAF', dialCode: '+237' },
  { countryName: 'Ivory Coast', shortCode: 'CIV', currency: 'XOF', dialCode: '+225' },
  { countryName: 'Senegal', shortCode: 'SEN', currency: 'XOF', dialCode: '+221' },
  { countryName: 'Zimbabwe', shortCode: 'ZWE', currency: 'ZWL', dialCode: '+263' },
  // Add more as needed
];

const mutation = `mutation CreateCountryListBzdcore($input: CreateCountryListBzdcoreInput!) {
  createCountryListBzdcore(input: $input) {
    id
    countryName
    shortCode
    currency
    dialCode
  }
}`;

async function insertCountry(country) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
    },
    body: JSON.stringify({
      query: mutation,
      variables: { input: country },
    }),
  });
  const json = await res.json();
  if (json.errors) {
    console.error('Error:', json.errors);
  } else {
    console.log('Inserted:', json.data.createCountryListBzdcore);
  }
}

(async () => {
  for (const country of countries) {
    await insertCountry(country);
  }
})();
