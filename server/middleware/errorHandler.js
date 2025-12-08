import { sendError } from '../utils/response.js';

/**
 * Global Error Handling Middleware
 */
export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  const errors = err.errors || null;

  console.error(`[ERROR] ${statusCode}: ${message}`, err);

  return sendError(res, message, statusCode, errors);
};

/**
 * 404 Not Found Middleware
 */
export const notFoundHandler = (req, res) => {
  return sendError(res, `Route ${req.originalUrl} not found`, 404);
};

/**
 * Request Logger Middleware
 */
export const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
};
