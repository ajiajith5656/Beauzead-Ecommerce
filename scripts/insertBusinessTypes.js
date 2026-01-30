// Script to insert business types into BusinessTypeBzdcore via GraphQL API
// Run: node scripts/insertBusinessTypes.js

import fetch from 'node-fetch';

const API_URL = 'https://woqi3tosm5a2jnj4w6zit2mfye.appsync-api.us-east-1.amazonaws.com/graphql';
const API_KEY = 'da2-hgvpvqv72jcj3o2sglactpt3gq';

const businessTypes = [
  { typeName: 'Electronics & Technology', description: 'Mobile phones, Laptops, Gadgets, Accessories' },
  { typeName: 'Fashion & Apparel', description: 'Clothing, Shoes, Bags, Accessories, Footwear' },
  { typeName: 'Home & Garden', description: 'Furniture, Decor, Kitchen, Garden Tools, Home Improvement' },
  { typeName: 'Beauty & Personal Care', description: 'Cosmetics, Skincare, Haircare, Wellness, Grooming' },
  { typeName: 'Sports & Outdoors', description: 'Sports Equipment, Fitness, Camping, Outdoor Gear' },
  { typeName: 'Books & Media', description: 'eBooks, Physical Books, Magazines, Learning Materials' },
  { typeName: 'Food & Beverage', description: 'Groceries, Specialty Foods, Spices, Beverages, Snacks' },
  { typeName: 'Jewelry & Watches', description: 'Jewelry, Watches, Accessories, Luxury Items' },
  { typeName: 'Toys & Games', description: 'Toys, Board Games, Puzzles, Educational Toys, Hobbies' },
  { typeName: 'Automotive', description: 'Car Parts, Accessories, Tools, Maintenance Products' },
  { typeName: 'Office & Stationery', description: 'Office Supplies, Stationery, Furniture, Equipment' },
  { typeName: 'Pet Supplies', description: 'Pet Food, Toys, Accessories, Health Products, Grooming' },
  { typeName: 'Arts & Crafts', description: 'Art Supplies, Handmade Items, DIY, Craft Materials' },
  { typeName: 'Health & Medical', description: 'Supplements, Medical Devices, Health Products, Wellness' },
  { typeName: 'Services', description: 'Consulting, Freelance Services, Professional Services' },
  { typeName: 'Software & Digital', description: 'Software, Apps, Digital Products, Online Courses' },
  { typeName: 'Real Estate', description: 'Property, Land, Commercial Space, Virtual Tours' },
  { typeName: 'Music & Audio', description: 'Musical Instruments, Audio Equipment, Speakers, Headphones' },
  { typeName: 'Photography & Video', description: 'Cameras, Lenses, Photography Equipment, Video Gear' },
  { typeName: 'Collectibles & Antiques', description: 'Vintage Items, Collectibles, Antiques, Memorabilia' },
  { typeName: 'Industrial & B2B', description: 'Industrial Equipment, Bulk Supplies, Business Products' },
  { typeName: 'Travel & Tourism', description: 'Travel Packages, Accommodations, Tours, Experiences' },
  { typeName: 'Education & Training', description: 'Courses, Certifications, Training Materials, Tutoring' },
  { typeName: 'Entertainment & Events', description: 'Event Tickets, Entertainment, Shows, Experiences' },
  { typeName: 'Renewable Energy', description: 'Solar Products, Energy Solutions, Green Technology' },
];

const mutation = `mutation CreateBusinessTypeBzdcore($input: CreateBusinessTypeBzdcoreInput!) {
  createBusinessTypeBzdcore(input: $input) {
    id
    typeName
    description
  }
}`;

async function insertBusinessType(businessType) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
    },
    body: JSON.stringify({
      query: mutation,
      variables: { input: businessType },
    }),
  });
  const json = await res.json();
  if (json.errors) {
    console.error('Error:', json.errors);
  } else {
    console.log('Inserted:', json.data.createBusinessTypeBzdcore.typeName);
  }
}

(async () => {
  console.log('Starting business type insertion...');
  for (const businessType of businessTypes) {
    await insertBusinessType(businessType);
  }
  console.log('All business types inserted successfully!');
})();
