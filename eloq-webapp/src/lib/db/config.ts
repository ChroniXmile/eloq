import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

// Create a PostgreSQL connection pool
export const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432", 10),
  database: process.env.DB_NAME || "eloq_test",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "",
  // Connection pool settings
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 5000, // Return an error after 5 seconds if connection could not be established
});

// Test the database connection
export const testConnection = async (): Promise<boolean> => {
  try {
    console.log('Attempting to connect to database...');
    const client = await pool.connect();
    console.log('Connected to database, running test query...');
    await client.query("SELECT NOW()");
    client.release();
    console.log('Database connection test successful');
    return true;
  } catch (error) {
    console.error("Database connection error:", error);
    return false;
  }
};

export default pool;
