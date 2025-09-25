// Error handling and logging utilities
// This file contains utilities for consistent error handling and logging throughout the application

// Error severity levels
export type ErrorSeverity = 'info' | 'warn' | 'error' | 'critical';

// Error context interface
export interface ErrorContext {
  userId?: string;
  sessionId?: string;
  url?: string;
  component?: string;
  action?: string;
  [key: string]: any;
}

// Custom error classes
export class ApplicationError extends Error {
  constructor(
    message: string,
    public code?: string,
    public severity: ErrorSeverity = 'error',
    public context?: ErrorContext
  ) {
    super(message);
    this.name = 'ApplicationError';
  }
}

export class ValidationError extends ApplicationError {
  constructor(
    message: string,
    public field?: string,
    context?: ErrorContext
  ) {
    super(message, 'VALIDATION_ERROR', 'warn', context);
    this.name = 'ValidationError';
  }
}

export class NetworkError extends ApplicationError {
  constructor(
    message: string,
    public statusCode?: number,
    context?: ErrorContext
  ) {
    super(message, 'NETWORK_ERROR', 'error', context);
    this.name = 'NetworkError';
  }
}

export class AuthenticationError extends ApplicationError {
  constructor(
    message: string,
    context?: ErrorContext
  ) {
    super(message, 'AUTHENTICATION_ERROR', 'error', context);
    this.name = 'AuthenticationError';
  }
}

// Logging levels
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

// Logger interface
interface Logger {
  debug(message: string, context?: ErrorContext): void;
  info(message: string, context?: ErrorContext): void;
  warn(message: string, context?: ErrorContext): void;
  error(message: string, context?: ErrorContext): void;
}

// Console logger implementation
class ConsoleLogger implements Logger {
  private formatMessage(level: LogLevel, message: string, context?: ErrorContext): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? ` ${JSON.stringify(context)}` : '';
    return `[${timestamp}] ${level.toUpperCase()}: ${message}${contextStr}`;
  }

  debug(message: string, context?: ErrorContext): void {
    if (process.env.NODE_ENV === 'development') {
      console.debug(this.formatMessage('debug', message, context));
    }
  }

  info(message: string, context?: ErrorContext): void {
    console.info(this.formatMessage('info', message, context));
  }

  warn(message: string, context?: ErrorContext): void {
    console.warn(this.formatMessage('warn', message, context));
  }

  error(message: string, context?: ErrorContext): void {
    console.error(this.formatMessage('error', message, context));
  }
}

// Global logger instance
const logger: Logger = new ConsoleLogger();

/**
 * Log an error with context
 * @param error Error to log
 * @param context Additional context information
 */
export function logError(error: Error, context?: ErrorContext): void {
  // Add error details to context
  const errorContext: ErrorContext = {
    ...context,
    errorMessage: error.message,
    errorStack: error.stack,
    errorName: error.name
  };

  // Log based on error type
  if (error instanceof ApplicationError) {
    switch (error.severity) {
      case 'info':
        logger.info(error.message, errorContext);
        break;
      case 'warn':
        logger.warn(error.message, errorContext);
        break;
      case 'error':
        logger.error(error.message, errorContext);
        break;
      case 'critical':
        logger.error(`CRITICAL: ${error.message}`, errorContext);
        // In a real app, you might want to send critical errors to a monitoring service
        break;
    }
  } else {
    // Standard JavaScript errors
    logger.error(error.message, errorContext);
  }
}

/**
 * Handle an error gracefully
 * @param error Error to handle
 * @param context Additional context information
 * @param userMessage Optional user-friendly message
 */
export function handleError(
  error: Error,
  context?: ErrorContext,
  userMessage?: string
): void {
  // Log the error
  logError(error, context);

  // In a real application, you might want to:
  // 1. Send error to monitoring service
  // 2. Show user-friendly message
  // 3. Redirect to error page for critical errors

  // For now, we'll just log it
  if (userMessage) {
    console.info(`User message: ${userMessage}`);
  }
}

/**
 * Create a standardized error response
 * @param error Error to create response for
 * @param defaultMessage Default message if none provided
 * @returns Standardized error response
 */
export function createErrorResponse(
  error: Error,
  defaultMessage: string = 'An unexpected error occurred'
): { message: string; code?: string; details?: any } {
  let message = defaultMessage;
  let code: string | undefined;
  let details: any;

  if (error instanceof ApplicationError) {
    message = error.message;
    code = error.code;
    
    if (error.context) {
      details = error.context;
    }
  } else {
    message = error.message || defaultMessage;
  }

  return {
    message,
    code,
    details
  };
}

/**
 * Wrap an async function with error handling
 * @param fn Async function to wrap
 * @param context Error context
 * @returns Wrapped function that handles errors
 */
export function withErrorHandling<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  context?: ErrorContext
): (...args: Parameters<T>) => Promise<Awaited<ReturnType<T>> | null> {
  return async (...args: Parameters<T>): Promise<Awaited<ReturnType<T>> | null> => {
    try {
      return await fn(...args);
    } catch (error) {
      if (error instanceof Error) {
        handleError(error, {
          ...context,
          functionName: fn.name
        });
      } else {
        handleError(
          new Error('Unknown error occurred'),
          {
            ...context,
            functionName: fn.name
          }
        );
      }
      return null;
    }
  };
}

/**
 * Validate data and throw ValidationError if invalid
 * @param condition Condition to validate
 * @param message Error message if condition is false
 * @param field Field name (optional)
 * @param context Error context (optional)
 */
export function validate(
  condition: boolean,
  message: string,
  field?: string,
  context?: ErrorContext
): asserts condition {
  if (!condition) {
    throw new ValidationError(message, field, context);
  }
}

/**
 * Retry a function with exponential backoff
 * @param fn Function to retry
 * @param maxRetries Maximum number of retries
 * @param baseDelay Base delay in milliseconds
 * @returns Promise that resolves with the result of the function
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      // If this is the last attempt, throw the error
      if (attempt === maxRetries) {
        throw lastError;
      }
      
      // Calculate delay with exponential backoff
      const delay = baseDelay * Math.pow(2, attempt);
      
      // Add jitter to prevent thundering herd
      const jitter = Math.random() * 0.1 * delay;
      const totalDelay = delay + jitter;
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, totalDelay));
    }
  }
  
  // This should never be reached, but TypeScript requires it
  throw lastError!;
}

/**
 * Initialize error handling
 */
export function initializeErrorHandling(): void {
  // Global error handler for uncaught exceptions
  if (typeof window !== 'undefined') {
    window.addEventListener('error', (event) => {
      logError(new Error(event.error?.message || 'Uncaught error'), {
        url: window.location.href,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      });
    });

    // Global error handler for unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      logError(new Error(event.reason?.message || 'Unhandled promise rejection'), {
        url: window.location.href
      });
    });
  }

  console.log('Error handling initialized');
}

// Export logger for direct use if needed
export { logger };