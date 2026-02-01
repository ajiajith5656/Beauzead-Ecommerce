#!/usr/bin/env python3
"""
Create BusinessType table in DynamoDB
"""

import boto3

dynamodb = boto3.client('dynamodb', region_name='us-east-1')

table_name = 'BusinessType'

try:
    # Check if table already exists
    response = dynamodb.describe_table(TableName=table_name)
    print(f"✅ Table {table_name} already exists")
except dynamodb.exceptions.ResourceNotFoundException:
    print(f"📊 Creating {table_name} table...")
    
    dynamodb.create_table(
        TableName=table_name,
        KeySchema=[
            {'AttributeName': 'id', 'KeyType': 'HASH'}  # Partition key
        ],
        AttributeDefinitions=[
            {'AttributeName': 'id', 'AttributeType': 'S'},
            {'AttributeName': 'name', 'AttributeType': 'S'}
        ],
        GlobalSecondaryIndexes=[
            {
                'IndexName': 'nameIndex',
                'KeySchema': [
                    {'AttributeName': 'name', 'KeyType': 'HASH'}
                ],
                'Projection': {'ProjectionType': 'ALL'}
            }
        ],
        BillingMode='PAY_PER_REQUEST'
    )
    
    # Wait for table to be created
    waiter = dynamodb.get_waiter('table_exists')
    waiter.wait(TableName=table_name)
    
    print(f"✅ {table_name} table created successfully!")

