import jwt from 'jsonwebtoken';
import { sendError } from '../utils/response.js';

/**
 * JWT Authentication Middleware
 * Verifies JWT token and extracts user information
 * Supports user, admin, and master roles
 * 
 * Usage:
 *   - router.get('/protected-route', authenticate, controller);
 */
export const authenticate = (req, res, next) => {
  try {
    // Extract token from Authorization header
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return sendError(res, 'Authorization token is required', 401);
    }

    // Verify and decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach decoded user info to request
    req.user = {
      userId: decoded.userId,
      role: decoded.role || 'user',
      masterUsername: decoded.masterUsername,
      iat: decoded.iat,
      exp: decoded.exp,
    };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return sendError(res, 'Token has expired', 401);
    }
    if (error.name === 'JsonWebTokenError') {
      return sendError(res, 'Invalid token', 401);
    }
    return sendError(res, 'Authentication failed', 401);
  }
};

/**
 * Role-Based Authorization Middleware
 * Ensures user has specific role
 * 
 * Usage:
 *   - router.post('/admin-action', authenticate, authorize('admin'), controller);
 *   - router.delete('/system-action', authenticate, authorize('master'), controller);
 */
export const authorize = (requiredRole) => {
  return (req, res, next) => {
    try {
      if (req.user?.role !== requiredRole) {
        return sendError(
          res,
          `Unauthorized: ${requiredRole} access required`,
          403
        );
      }
      next();
    } catch (error) {
      return sendError(res, 'Authorization failed', 403);
    }
  };
};

/**
 * Optional Authentication Middleware
 * Verifies token if present, but doesn't require it
 * Useful for public endpoints with optional user context
 * 
 * Usage:
 *   - router.get('/public-events', optionalAuth, controller);
 */
export const optionalAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = {
        userId: decoded.userId,
        role: decoded.role || 'user',
        masterUsername: decoded.masterUsername,
        iat: decoded.iat,
        exp: decoded.exp,
        authenticated: true,
      };
    } else {
      // Request proceeds without user context
      req.user = { authenticated: false };
    }

    next();
  } catch (error) {
    // Token is invalid, but we allow the request to proceed
    req.user = { authenticated: false };
    next();
  }
};

/**
 * Admin-only Authorization
 * Shorthand for checking admin or master role
 * More permissive than single role check
 */
export const adminOrMaster = (req, res, next) => {
  try {
    const role = req.user?.role;
    
    if (!role || !['admin', 'master'].includes(role)) {
      return sendError(
        res,
        'Unauthorized: Admin or Master access required',
        403
      );
    }
    next();
  } catch (error) {
    return sendError(res, 'Authorization failed', 403);
  }
};

/**
 * User-only Authorization
 * Restricts access to user accounts only
 */
export const userOnly = (req, res, next) => {
  try {
    if (req.user?.role !== 'user') {
      return sendError(
        res,
        'This action is only available to user accounts',
        403
      );
    }
    next();
  } catch (error) {
    return sendError(res, 'Authorization failed', 403);
  }
};

/**
 * Master-only Authorization
 * Restricts access to master account only
 */
export const masterOnly = (req, res, next) => {
  try {
    if (req.user?.role !== 'master') {
      return sendError(
        res,
        'Unauthorized: Master access required',
        403
      );
    }
    next();
  } catch (error) {
    return sendError(res, 'Authorization failed', 403);
  }
};

/**
 * Multi-role Authorization
 * Check if user has one of multiple allowed roles
 */
export const checkRoles = (allowedRoles) => {
  return (req, res, next) => {
    try {
      const userRole = req.user?.role;
      
      if (!userRole || !allowedRoles.includes(userRole)) {
        return sendError(
          res,
          `Unauthorized: Required roles are ${allowedRoles.join(', ')}`,
          403
        );
      }
      next();
    } catch (error) {
      return sendError(res, 'Authorization failed', 403);
    }
  };
};

/**
 * Verify user owns the resource
 * Prevents users from accessing other users' data
 */
export const verifyOwnership = (req, res, next) => {
  try {
    const userId = req.user?.userId;
    const resourceId = req.params.id || req.body.userId;

    if (userId !== resourceId && req.user?.role !== 'master' && req.user?.role !== 'admin') {
      return sendError(
        res,
        'Forbidden: You do not have access to this resource',
        403
      );
    }
    next();
  } catch (error) {
    return sendError(res, 'Verification failed', 403);
  }
};
