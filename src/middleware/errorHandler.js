import { config } from '../config/env.js';

export function errorHandler(err, req, res, next) {
  console.error('❌ Unhandled Error:', err);

  // Default error response
  let statusCode = err.statusCode || err.status || 500;
  let message = err.message || 'Internal Server Error';
  
  // Handle specific error types
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Error';
  } else if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID format';
  } else if (err.code === 11000) {
    statusCode = 409;
    message = 'Duplicate entry';
  }

  const errorResponse = {
    error: message,
    status: statusCode,
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
    method: req.method
  };

  // Include stack trace in development
  if (config.NODE_ENV === 'development') {
    errorResponse.stack = err.stack;
    errorResponse.details = err;
  }

  res.status(statusCode).json(errorResponse);
}

export function notFoundHandler(req, res) {
  res.status(404).json({
    error: 'Route not found',
    status: 404,
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
    method: req.method,
    availableRoutes: [
      'GET /',
      'GET /health',
      'GET /auth/:provider',
      'GET /callback/:provider',
      'GET /users',
      'GET /users/stats',
      'GET /users/:id'
    ]
  });
}

export function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
