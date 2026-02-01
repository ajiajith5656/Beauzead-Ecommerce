import { DynamoDBClient, BatchWriteItemCommand } from '@aws-sdk/client-dynamodb';

const client = new DynamoDBClient({ region: 'us-east-1' });

const seedData = {
  measurement_types: [
    { type_id: 'COUNT' },
    { type_id: 'WEIGHT' },
    { type_id: 'VOLUME' },
    { type_id: 'DIMENSION' },
    { type_id: 'AREA' },
    { type_id: 'APPAREL' },
    { type_id: 'DIGITAL' },
    { type_id: 'POWER' },
    { type_id: 'FREE_SIZE' },
  ],

  measurement_units: [
    // COUNT units
    { type_id: 'COUNT', unit_id: 'piece' },
    { type_id: 'COUNT', unit_id: 'pack' },
    { type_id: 'COUNT', unit_id: 'set' },
    { type_id: 'COUNT', unit_id: 'box' },
    
    // WEIGHT units
    { type_id: 'WEIGHT', unit_id: 'g' },
    { type_id: 'WEIGHT', unit_id: 'kg' },
    { type_id: 'WEIGHT', unit_id: 'lb' },
    
    // VOLUME units
    { type_id: 'VOLUME', unit_id: 'ml' },
    { type_id: 'VOLUME', unit_id: 'L' },
    
    // DIMENSION units
    { type_id: 'DIMENSION', unit_id: 'cm' },
    { type_id: 'DIMENSION', unit_id: 'inch' },
    
    // DIGITAL units
    { type_id: 'DIGITAL', unit_id: 'GB' },
    { type_id: 'DIGITAL', unit_id: 'TB' },
    
    // POWER units
    { type_id: 'POWER', unit_id: 'W' },
    { type_id: 'POWER', unit_id: 'mAh' },
    
    // FREE_SIZE units
    { type_id: 'FREE_SIZE', unit_id: 'free_size' },
  ],

  apparel_size_systems: [
    { system_id: 'INTL_ALPHA' },
    { system_id: 'EU_NUMERIC' },
    { system_id: 'US_NUMERIC' },
    { system_id: 'SHOE_US' },
    { system_id: 'SHOE_EU' },
    { system_id: 'FREE_SIZE' },
  ],

  apparel_size_values: [
    // INTL_ALPHA sizes
    { system_id: 'INTL_ALPHA', size_value: 'S', displayOrder: 1 },
    { system_id: 'INTL_ALPHA', size_value: 'M', displayOrder: 2 },
    { system_id: 'INTL_ALPHA', size_value: 'L', displayOrder: 3 },
    { system_id: 'INTL_ALPHA', size_value: 'XL', displayOrder: 4 },
    
    // EU_NUMERIC sizes
    { system_id: 'EU_NUMERIC', size_value: '38', displayOrder: 1 },
    { system_id: 'EU_NUMERIC', size_value: '40', displayOrder: 2 },
    { system_id: 'EU_NUMERIC', size_value: '42', displayOrder: 3 },
    
    // SHOE_US sizes
    { system_id: 'SHOE_US', size_value: '8', displayOrder: 1 },
    { system_id: 'SHOE_US', size_value: '9', displayOrder: 2 },
    { system_id: 'SHOE_US', size_value: '10', displayOrder: 3 },
    
    // FREE_SIZE
    { system_id: 'FREE_SIZE', size_value: 'FREE', displayOrder: 1 },
  ],
};

// Helper function to generate UUID
function generateId() {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

async function seedTable(tableName, items, keyAttribute) {
  console.log(`\n📥 Seeding ${tableName}...`);
  
  const requests = items.map((item) => {
    const dynamoItem = {};
    
    Object.keys(item).forEach((key) => {
      if (typeof item[key] === 'string') {
        dynamoItem[key] = { S: item[key] };
      } else if (typeof item[key] === 'number') {
        dynamoItem[key] = { N: item[key].toString() };
      } else if (typeof item[key] === 'boolean') {
        dynamoItem[key] = { BOOL: item[key] };
      }
    });

    // Add ID if not present
    if (!dynamoItem.id && keyAttribute !== 'type_id' && keyAttribute !== 'system_id') {
      dynamoItem.id = { S: generateId() };
    }

    return {
      PutRequest: {
        Item: dynamoItem,
      },
    };
  });

  // Batch write items (max 25 per batch)
  for (let i = 0; i < requests.length; i += 25) {
    const batch = requests.slice(i, i + 25);
    const params = {
      RequestItems: {
        [tableName]: batch,
      },
    };

    try {
      const command = new BatchWriteItemCommand(params);
      await client.send(command);
      console.log(`✓ Inserted ${Math.min(25, requests.length - i)} items into ${tableName}`);
    } catch (error) {
      console.error(`❌ Error seeding ${tableName}:`, error.message);
    }
  }
}

async function seed() {
  try {
    console.log('🌱 Starting measurement data seed...\n');

    // Get table names from GraphQL models
    const tables = {
      MeasurementType: {
        items: seedData.measurement_types,
        keyAttribute: 'type_id',
      },
      MeasurementUnit: {
        items: seedData.measurement_units,
        keyAttribute: 'id',
      },
      ApparelSizeSystem: {
        items: seedData.apparel_size_systems,
        keyAttribute: 'system_id',
      },
      ApparelSizeValue: {
        items: seedData.apparel_size_values,
        keyAttribute: 'id',
      },
    };

    for (const [tableName, config] of Object.entries(tables)) {
      await seedTable(tableName, config.items, config.keyAttribute);
    }

    console.log('\n✅ Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seed();
