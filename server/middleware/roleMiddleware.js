import { sendError } from '../utils/response.js';

/**
 * Role-Based Access Control Middleware
 * Checks if the authenticated user has the required role(s)
 * 
 * Usage:
 *   - router.post('/admin-action', authenticate, roleMiddleware(['admin', 'master']), controller);
 *   - router.delete('/user-delete', authenticate, roleMiddleware('user'), controller);
 */

/**
 * Check if user has required role(s)
 * @param {string|string[]} allowedRoles - Single role string or array of role strings
 * @returns {Function} Express middleware function
 */
export const roleMiddleware = (allowedRoles) => {
  // Normalize allowedRoles to array
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  return (req, res, next) => {
    try {
      const userRole = req.user?.role;

      if (!userRole) {
        return sendError(
          res,
          'User role not found in token',
          401
        );
      }

      // Check if user's role is in the allowed roles
      if (!roles.includes(userRole)) {
        return sendError(
          res,
          `Access denied. Required roles: ${roles.join(', ')}. Your role: ${userRole}`,
          403
        );
      }

      next();
    } catch (error) {
      return sendError(res, 'Error checking user role', 500);
    }
  };
};

/**
 * Middleware to restrict access to master role only
 * More restrictive version of roleMiddleware for critical operations
 * 
 * Usage:
 *   - router.delete('/system-reset', authenticate, masterOnly, controller);
 */
export const masterOnly = (req, res, next) => {
  try {
    const userRole = req.user?.role;

    if (userRole !== 'master') {
      return sendError(
        res,
        'Access denied. Master role required for this operation.',
        403
      );
    }

    next();
  } catch (error) {
    return sendError(res, 'Error verifying master access', 500);
  }
};

/**
 * Middleware to restrict access to admin or master roles
 * Common pattern for administrative actions
 * 
 * Usage:
 *   - router.post('/create-event', authenticate, adminOrMaster, controller);
 */
export const adminOrMaster = (req, res, next) => {
  try {
    const userRole = req.user?.role;

    if (!userRole || !['admin', 'master'].includes(userRole)) {
      return sendError(
        res,
        'Access denied. Admin or Master role required.',
        403
      );
    }

    next();
  } catch (error) {
    return sendError(res, 'Error verifying admin access', 500);
  }
};

/**
 * Middleware to restrict access to user role only
 * For endpoints that should only be accessible to regular users
 * 
 * Usage:
 *   - router.post('/register-event', authenticate, userOnly, controller);
 */
export const userOnly = (req, res, next) => {
  try {
    const userRole = req.user?.role;

    if (userRole !== 'user') {
      return sendError(
        res,
        'This action is only available to user accounts.',
        403
      );
    }

    next();
  } catch (error) {
    return sendError(res, 'Error verifying user access', 500);
  }
};

/**
 * Attach role information to request for logging/auditing
 * Use before other role checks for enhanced logging
 */
export const captureRole = (req, res, next) => {
  try {
    req.userRole = req.user?.role || 'unknown';
    req.userId = req.user?.userId || req.user?.masterUsername || 'unknown';
    next();
  } catch (error) {
    next(error);
  }
};

export default roleMiddleware;
