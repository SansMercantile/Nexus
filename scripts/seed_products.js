const { MongoClient } = require('mongodb');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

async function seed() {
  try {
    const uri = process.env.MONGODB_URI;
    const dbName = process.env.MONGODB_DB || 'nexus';
    
    if (!uri) {
      throw new Error('MONGODB_URI is missing from .env.local');
    }

    const client = new MongoClient(uri);
    await client.connect();
    console.log('Connected to MongoDB...');
    
    const db = client.db(dbName);
    const data = JSON.parse(fs.readFileSync('./seed_products.json', 'utf8'));
    
    await db.collection('products').deleteMany({});
    await db.collection('products').insertMany(data);
    
    console.log('Successfully seeded products collection!');
    await client.close();
  } catch (e) {
    console.error('Seeding error:', e);
    process.exit(1);
  }
}

seed();