// db.js
const { MongoClient } = require('mongodb');
const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

let db;

async function connectDB() {
  await client.connect();
  db = client.db('nombre_de_tu_base_de_datos');
  console.log('✅ Conectado a MongoDB');
}

function getDB() {
  return db;
}

module.exports = { connectDB, getDB };
