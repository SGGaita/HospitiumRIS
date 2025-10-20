import fs from 'fs/promises';
import path from 'path';

const LOG_DIR = path.join(process.cwd(), 'logs');
const LOG_FILE = path.join(LOG_DIR, 'activity.log');

// Ensure logs directory exists
const ensureLogDir = async () => {
  try {
    await fs.access(LOG_DIR);
  } catch {
    await fs.mkdir(LOG_DIR, { recursive: true });
  }
};

// Log levels
export const LOG_LEVELS = {
  INFO: 'INFO',
  SUCCESS: 'SUCCESS', 
  ERROR: 'ERROR',
  WARNING: 'WARNING',
  API_CALL: 'API_CALL',
  DB_OPERATION: 'DB_OPERATION'
};

// Activity logger function
export const logActivity = async (level, message, metadata = {}) => {
  try {
    await ensureLogDir();
    
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      metadata: {
        ...metadata,
        userAgent: metadata.userAgent || 'Unknown',
        ip: metadata.ip || 'Unknown',
        userId: metadata.userId || null,
        sessionId: metadata.sessionId || null
      }
    };

    const logLine = JSON.stringify(logEntry) + '\n';
    
    // Append to log file
    await fs.appendFile(LOG_FILE, logLine);
    
    // Also log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[${timestamp}] ${level}: ${message}`, metadata);
    }
  } catch (error) {
    console.error('Failed to write to activity log:', error);
  }
};

// Convenience functions for different log levels
export const logInfo = (message, metadata) => logActivity(LOG_LEVELS.INFO, message, metadata);
export const logSuccess = (message, metadata) => logActivity(LOG_LEVELS.SUCCESS, message, metadata);
export const logError = (message, metadata) => logActivity(LOG_LEVELS.ERROR, message, metadata);
export const logWarning = (message, metadata) => logActivity(LOG_LEVELS.WARNING, message, metadata);
export const logApiCall = (message, metadata) => logActivity(LOG_LEVELS.API_CALL, message, metadata);
export const logDbOperation = (message, metadata) => logActivity(LOG_LEVELS.DB_OPERATION, message, metadata);

// Database activity logger
export const logDatabaseActivity = async (operation, table, result, metadata = {}) => {
  const message = `Database ${operation} on ${table}`;
  const logMetadata = {
    ...metadata,
    operation,
    table,
    success: result.success !== false,
    recordCount: result.count || (Array.isArray(result) ? result.length : 1),
    duration: metadata.duration || null
  };
  
  if (result.success === false || result.error) {
    await logError(`${message} - FAILED: ${result.error || 'Unknown error'}`, logMetadata);
  } else {
    await logDbOperation(`${message} - SUCCESS`, logMetadata);
  }
};

// API call logger
export const logApiActivity = async (method, endpoint, statusCode, metadata = {}) => {
  const message = `${method} ${endpoint} - ${statusCode}`;
  const logMetadata = {
    ...metadata,
    method,
    endpoint,
    statusCode,
    success: statusCode >= 200 && statusCode < 400
  };
  
  if (statusCode >= 400) {
    await logError(`API Call Failed: ${message}`, logMetadata);
  } else {
    await logApiCall(`API Call: ${message}`, logMetadata);
  }
};

// Get request metadata helper
export const getRequestMetadata = (req) => {
  return {
    ip: req.headers['x-forwarded-for'] || req.connection?.remoteAddress || 'Unknown',
    userAgent: req.headers['user-agent'] || 'Unknown',
    method: req.method,
    url: req.url,
    timestamp: new Date().toISOString()
  };
};
