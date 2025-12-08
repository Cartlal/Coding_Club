import { sendError } from '../utils/response.js';

/**
 * Master Credential Validation Middleware
 * Validates hardcoded master credentials from environment variables
 * 
 * This middleware is specifically for master account operations
 * It validates credentials against MASTER_USERNAME and MASTER_PASSWORD in .env
 * 
 * Usage:
 *   - router.post('/master/login', validateMasterCredentials, masterLoginController);
 */

/**
 * Validate master credentials from request body
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const validateMasterCredentials = (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Check if credentials are provided
    if (!username || !password) {
      return sendError(
        res,
        'Username and password are required for master login',
        400
      );
    }

    // Validate against environment credentials
    if (
      username !== process.env.MASTER_USERNAME ||
      password !== process.env.MASTER_PASSWORD
    ) {
      return sendError(
        res,
        'Invalid master credentials',
        401
      );
    }

    // Attach validated master info to request
    req.master = {
      username: process.env.MASTER_USERNAME,
      role: 'master',
      validatedAt: new Date(),
    };

    next();
  } catch (error) {
    return sendError(res, 'Error validating master credentials', 500);
  }
};

/**
 * Middleware to ensure only master-authenticated requests proceed
 * Use this after verifying JWT token contains master role
 * 
 * Usage:
 *   - router.delete('/system-config', authenticate, requireMasterRole, controller);
 */
export const requireMasterRole = (req, res, next) => {
  try {
    const userRole = req.user?.role;
    const masterUsername = req.user?.masterUsername;

    // Verify master role and username
    if (userRole !== 'master' || !masterUsername) {
      return sendError(
        res,
        'Master authentication required for this operation',
        401
      );
    }

    // Verify master username matches environment
    if (masterUsername !== process.env.MASTER_USERNAME) {
      return sendError(
        res,
        'Invalid master account',
        401
      );
    }

    // Attach master info to request for downstream use
    req.master = {
      username: masterUsername,
      role: 'master',
      authenticatedAt: new Date(),
    };

    next();
  } catch (error) {
    return sendError(res, 'Error verifying master role', 500);
  }
};

/**
 * Optional Master Verification
 * Checks if request is from master, but doesn't require it
 * Useful for endpoints that behave differently for master users
 * 
 * Usage:
 *   - router.get('/reports', authenticate, optionalMasterCheck, controller);
 */
export const optionalMasterCheck = (req, res, next) => {
  try {
    const userRole = req.user?.role;

    if (userRole === 'master') {
      req.isMaster = true;
      req.master = {
        username: req.user?.masterUsername,
        role: 'master',
      };
    } else {
      req.isMaster = false;
    }

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Log master access attempts
 * Logs all master-related access for security audit trail
 * Should be used in combination with other master validation middleware
 * 
 * Usage:
 *   - router.post('/master/action', validateMasterCredentials, logMasterAccess, controller);
 */
export const logMasterAccess = (req, res, next) => {
  try {
    const { username } = req.body;
    const timestamp = new Date().toISOString();
    const ip = req.ip || req.connection.remoteAddress;

    // Log master access attempt
    console.log(`[MASTER_ACCESS] Username: ${username} | Time: ${timestamp} | IP: ${ip} | Path: ${req.path}`);

    // In production, you might want to save this to a database
    // await MasterAuditLog.create({ username, timestamp, ip, path: req.path });

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Rate limit master login attempts
 * Prevents brute force attacks on master account
 * 
 * Usage: See rate limiting implementation
 * Note: Consider using express-rate-limit package for production
 * Example:
 *   - import rateLimit from 'express-rate-limit';
 *   - const masterLimiter = rateLimit({ windowMs: 15*60*1000, max: 5 });
 *   - router.post('/master/login', masterLimiter, masterLoginController);
 */

/**
 * Validate master credentials with timing (constant-time comparison)
 * More secure version preventing timing attacks
 */
export const validateMasterCredentialsSecure = (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Check if credentials are provided
    if (!username || !password) {
      return sendError(
        res,
        'Username and password are required',
        400
      );
    }

    const expectedUsername = process.env.MASTER_USERNAME || '';
    const expectedPassword = process.env.MASTER_PASSWORD || '';

    // Use constant-time comparison to prevent timing attacks
    const usernameMatch = timingSafeCompare(username, expectedUsername);
    const passwordMatch = timingSafeCompare(password, expectedPassword);

    if (!usernameMatch || !passwordMatch) {
      return sendError(
        res,
        'Invalid credentials',
        401
      );
    }

    req.master = {
      username: expectedUsername,
      role: 'master',
      validatedAt: new Date(),
    };

    next();
  } catch (error) {
    return sendError(res, 'Error validating credentials', 500);
  }
};

/**
 * Constant-time string comparison to prevent timing attacks
 * @param {string} a - First string to compare
 * @param {string} b - Second string to compare
 * @returns {boolean} True if strings match, false otherwise
 */
function timingSafeCompare(a, b) {
  const aLen = a.length;
  const bLen = b.length;

  // Use constant-time comparison
  if (aLen !== bLen) {
    // Still compare to maintain constant time
    timingSafeEq(a, b);
    return false;
  }

  return timingSafeEq(a, b);
}

/**
 * Helper for timing-safe equality check
 */
function timingSafeEq(a, b) {
  let result = 0;
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    result |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  }
  return result === 0;
}

export default validateMasterCredentials;
