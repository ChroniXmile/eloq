// Debug database connection

import dotenv from "dotenv";
dotenv.config();

console.log('Environment variables:');
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? '*** (set)' : '(not set)');

import { Client } from "pg";

const client = new Client({
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432", 10),
  database: process.env.DB_NAME || "eloq_test",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "",
});

async function testConnection() {
  try {
    console.log('Attempting to connect...');
    await client.connect();
    console.log('Connected successfully!');
    
    const result = await client.query("SELECT NOW()");
    console.log('Query result:', result.rows[0]);
    
    await client.end();
    console.log('Connection closed');
  } catch (error) {
    console.error("Connection error:", error);
  }
}

testConnection();