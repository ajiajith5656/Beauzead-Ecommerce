#!/usr/bin/env python3
"""
Populate CountryList and BusinessType tables with sample data
"""
import boto3
import json

dynamodb = boto3.resource('dynamodb', region_name='us-east-1')

def add_countries():
    table = dynamodb.Table('CountryListBzdcore')
    countries = [
        {'id': 'country-us', 'countryName': 'United States', 'shortCode': 'US', 'currency': 'USD', 'dialCode': '+1'},
        {'id': 'country-ca', 'countryName': 'Canada', 'shortCode': 'CA', 'currency': 'CAD', 'dialCode': '+1'},
        {'id': 'country-gb', 'countryName': 'United Kingdom', 'shortCode': 'GB', 'currency': 'GBP', 'dialCode': '+44'},
        {'id': 'country-au', 'countryName': 'Australia', 'shortCode': 'AU', 'currency': 'AUD', 'dialCode': '+61'},
        {'id': 'country-in', 'countryName': 'India', 'shortCode': 'IN', 'currency': 'INR', 'dialCode': '+91'},
    ]
    for country in countries:
        try:
            table.put_item(Item=country)
            print(f"✅ Added {country['countryName']}")
        except Exception as e:
            print(f"❌ Failed {country['countryName']}: {e}")

def add_business_types():
    table = dynamodb.Table('BusinessTypeBzdcore')
    types = [
        {'id': 'btype-retail', 'typeName': 'Retail Store', 'description': 'Physical retail storefront'},
        {'id': 'btype-wholesale', 'typeName': 'Wholesale', 'description': 'Wholesale distributor'},
        {'id': 'btype-online', 'typeName': 'Online Store', 'description': 'E-commerce seller'},
        {'id': 'btype-manufacturing', 'typeName': 'Manufacturing', 'description': 'Product manufacturer'},
        {'id': 'btype-service', 'typeName': 'Service Provider', 'description': 'Service-based business'},
    ]
    for btype in types:
        try:
            table.put_item(Item=btype)
            print(f"✅ Added {btype['typeName']}")
        except Exception as e:
            print(f"❌ Failed {btype['typeName']}: {e}")

if __name__ == '__main__':
    print("📝 Adding countries...")
    add_countries()
    print("\n📝 Adding business types...")
    add_business_types()
    print("\n✅ Done!")
