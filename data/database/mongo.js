const { MongoClient } = require('mongodb');

const url = 'mongodb://127.0.0.1:27017'; // локальный Mongo
const dbName = 'WatuluvxDB';          // название вашей базы
let db;

async function connectDB() {
  try {
    const client = new MongoClient(url);
    await client.connect();
    console.log('✅ Connected to MongoDB locally');
    db = client.db(dbName);
    return db;
  } catch (err) {
    console.error('❌ DB connection error:', err);
    process.exit(1);
  }
}

function getDB() {
  if (!db) throw new Error('Database not connected');
  return db;
}

module.exports = { connectDB, getDB };
