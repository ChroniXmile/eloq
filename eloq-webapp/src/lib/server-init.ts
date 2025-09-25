// Server initialization
// This file initializes server-side resources like database connections

import { initializeDataConnection } from './data-connection';
import { createTables, populateMockData } from './db/init';

let isInitialized = false;

/**
 * Initialize server resources
 * This function should be called once when the server starts
 */
export async function initializeServer(): Promise<void> {
  if (isInitialized) {
    console.log('Server already initialized');
    return;
  }

  try {
    console.log('Initializing server resources...');
    
    // Initialize database connection
    await initializeDataConnection();
    
    // Create database tables
    await createTables();
    
    // Populate with mock data (in a real app, you might want to check if data exists first)
    await populateMockData();
    
    isInitialized = true;
    console.log('Server initialization completed successfully');
  } catch (error) {
    console.error('Error initializing server:', error);
    throw new Error('Failed to initialize server');
  }
}

/**
 * Cleanup server resources
 * This function should be called when the server shuts down
 */
export async function cleanupServer(): Promise<void> {
  try {
    console.log('Cleaning up server resources...');
    // Add any cleanup logic here if needed
    console.log('Server cleanup completed');
  } catch (error) {
    console.error('Error cleaning up server:', error);
    throw new Error('Failed to cleanup server');
  }
}