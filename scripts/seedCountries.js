// Script to insert country data into Country table via GraphQL API
// Run: node scripts/seedCountries.js

import fetch from 'node-fetch';

// Get API endpoint and key from amplifyconfiguration.json
import fs from 'fs';
const amplifyconfigPath = './src/amplifyconfiguration.json';
let API_URL = '';
let API_KEY = '';

try {
  const config = JSON.parse(fs.readFileSync(amplifyconfigPath, 'utf8'));
  API_URL = config.aws_appsync_graphqlEndpoint;
  API_KEY = config.aws_appsync_apiKey;
} catch (e) {
  // Fallback to environment variables or defaults
  API_URL = process.env.GRAPHQL_ENDPOINT || 'https://woqi3tosm5a2jnj4w6zit2mfye.appsync-api.us-east-1.amazonaws.com/graphql';
  API_KEY = process.env.GRAPHQL_API_KEY || 'da2-hgvpvqv72jcj3o2sglactpt3gq';
}

console.log('API URL:', API_URL);

const countries = [
  // User provided countries
  { code: 'IN', name: 'India', dialCode: '+91', flag: '🇮🇳', isActive: true },
  { code: 'PK', name: 'Pakistan', dialCode: '+92', flag: '🇵🇰', isActive: true },
  { code: 'CN', name: 'China', dialCode: '+86', flag: '🇨🇳', isActive: true },
  { code: 'LK', name: 'Sri Lanka', dialCode: '+94', flag: '🇱🇰', isActive: true },
  { code: 'GB', name: 'United Kingdom', dialCode: '+44', flag: '🇬🇧', isActive: true },
  { code: 'EU', name: 'European Union', dialCode: '+33', flag: '🇪🇺', isActive: true },
];

const mutation = `mutation CreateCountry($input: CreateCountryInput!) {
  createCountry(input: $input) {
    id
    code
    name
    dialCode
    flag
    isActive
    createdAt
    updatedAt
  }
}`;

async function insertCountry(country) {
  try {
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
      console.error(`❌ Error inserting ${country.name}:`, json.errors);
    } else {
      console.log(`✅ Inserted: ${json.data.createCountry.name} (${json.data.createCountry.code})`);
    }
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
  }
}

(async () => {
  console.log(`\n🌍 Seeding ${countries.length} countries...`);
  for (const country of countries) {
    await insertCountry(country);
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  console.log('\n✅ Done seeding countries!\n');
})();
