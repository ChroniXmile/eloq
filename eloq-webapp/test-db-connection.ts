// Simple database test script
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

console.log('Database configuration:');
console.log('Host:', process.env.DB_HOST || 'localhost');
console.log('Port:', process.env.DB_PORT || '5432');
console.log('Database:', process.env.DB_NAME || 'eloq_test');
console.log('User:', process.env.DB_USER || 'postgres');
console.log('Password:', process.env.DB_PASSWORD ? '****' : '(empty)');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  database: process.env.DB_NAME || 'eloq_test',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
});

async function testConnection() {
  try {
    console.log('Attempting to connect to database...');
    const client = await pool.connect();
    console.log('Connected to database, running test query...');
    const result = await client.query('SELECT NOW() as now');
    console.log('Query result:', result.rows[0]);
    client.release();
    console.log('Database connection test successful');
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('Database connection error:', error);
    await pool.end();
    process.exit(1);
  }
}

testConnection();