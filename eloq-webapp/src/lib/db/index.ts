import { pool, testConnection } from "./config";
import { QueryResult, QueryResultRow } from "pg";
import { createTables, populateMockData } from "./init";

// Generic query function
export const query = async <T extends QueryResultRow>(
  text: string,
  params?: any[]
): Promise<QueryResult<T>> => {
  const start = Date.now();
  const client = await pool.connect();

  try {
    const res = await client.query<T>(text, params);
    const duration = Date.now() - start;
    console.log("Executed query", { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error("Database query error:", error);
    throw error;
  } finally {
    client.release();
  }
};

// Initialize database connection
export const initDatabase = async (): Promise<void> => {
  console.log("Initializing database connection...");

  const isConnected = await testConnection();
  if (isConnected) {
    console.log("Database connected successfully");
  } else {
    console.error("Failed to connect to database");
  }
};

export default {
  query,
  initDatabase,
  testConnection,
  createTables,
  populateMockData
};
