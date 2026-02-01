#!/usr/bin/env python3
"""
Seed Country and BusinessType data to DynamoDB
"""

import boto3
import json
from datetime import datetime
import uuid

dynamodb = boto3.resource('dynamodb', region_name='us-east-1')

# Table names
country_table_name = 'CountryList'
business_type_table_name = 'BusinessType'
print(f"Using tables: {country_table_name}, {business_type_table_name}")

countries_table = dynamodb.Table(country_table_name)
business_types_table = dynamodb.Table(business_type_table_name)

# Countries to seed - including Gulf countries
countries = [
    {'code': 'IN', 'name': 'India', 'dialCode': '+91'},
    {'code': 'PK', 'name': 'Pakistan', 'dialCode': '+92'},
    {'code': 'CN', 'name': 'China', 'dialCode': '+86'},
    {'code': 'LK', 'name': 'Sri Lanka', 'dialCode': '+94'},
    {'code': 'GB', 'name': 'United Kingdom', 'dialCode': '+44'},
    {'code': 'EU', 'name': 'European Union', 'dialCode': '+33'},
    # Gulf countries
    {'code': 'SA', 'name': 'Saudi Arabia', 'dialCode': '+966'},
    {'code': 'AE', 'name': 'United Arab Emirates', 'dialCode': '+971'},
    {'code': 'QA', 'name': 'Qatar', 'dialCode': '+974'},
    {'code': 'KW', 'name': 'Kuwait', 'dialCode': '+965'},
    {'code': 'OM', 'name': 'Oman', 'dialCode': '+968'},
    {'code': 'BH', 'name': 'Bahrain', 'dialCode': '+973'},
]

# Global business types
business_types = [
    {'name': 'Manufacturing', 'description': 'Manufacturing and production of goods', 'order': 1},
    {'name': 'Retail', 'description': 'Retail sales and commerce', 'order': 2},
    {'name': 'Wholesale', 'description': 'Wholesale distribution', 'order': 3},
    {'name': 'E-Commerce', 'description': 'Online sales and digital commerce', 'order': 4},
    {'name': 'Services', 'description': 'Professional and consulting services', 'order': 5},
    {'name': 'Technology', 'description': 'Technology and software services', 'order': 6},
    {'name': 'Food & Beverage', 'description': 'Food and beverage business', 'order': 7},
    {'name': 'Fashion & Apparel', 'description': 'Fashion, clothing and apparel', 'order': 8},
    {'name': 'Health & Wellness', 'description': 'Health, wellness and medical products', 'order': 9},
    {'name': 'Home & Garden', 'description': 'Home, garden and furniture', 'order': 10},
    {'name': 'Electronics', 'description': 'Electronics and gadgets', 'order': 11},
    {'name': 'Beauty & Cosmetics', 'description': 'Beauty and cosmetics products', 'order': 12},
    {'name': 'Sports & Outdoors', 'description': 'Sports and outdoor products', 'order': 13},
    {'name': 'Books & Media', 'description': 'Books, media and educational content', 'order': 14},
    {'name': 'Automotive', 'description': 'Automotive products and parts', 'order': 15},
]

timestamp = datetime.now().isoformat() + 'Z'

print(f"\n🌍 Seeding {len(countries)} countries...\n")

for country in countries:
    try:
        item = {
            'short_code': country['code'],
            'country_name': country['name'],
            'dial_code': country['dialCode'],
            'is_active': True,
        }
        
        countries_table.put_item(Item=item)
        print(f"✅ Seeded: {country['name']} ({country['code']})")
    except Exception as e:
        print(f"❌ Error seeding {country['name']}: {str(e)}")

print(f"\n📊 Seeding {len(business_types)} business types...\n")

for biz_type in business_types:
    try:
        item = {
            'id': str(uuid.uuid4()),
            'name': biz_type['name'],
            'description': biz_type['description'],
            'is_active': True,
            'displayOrder': biz_type['order'],
            'createdAt': timestamp,
            'updatedAt': timestamp,
        }
        
        business_types_table.put_item(Item=item)
        print(f"✅ Seeded: {biz_type['name']}")
    except Exception as e:
        print(f"❌ Error seeding {biz_type['name']}: {str(e)}")

print(f"\n✅ Done seeding countries and business types!\n")
