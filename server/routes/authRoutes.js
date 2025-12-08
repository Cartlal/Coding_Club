import express from 'express';
import { 
  register, 
  userLogin, 
  adminLogin,
  masterLogin,
  getCurrentUser, 
  updateProfile 
} from '../controllers/authController.js';
import { authenticate, optionalAuth, adminOrMaster } from '../middleware/auth.js';
import { roleMiddleware, masterOnly } from '../middleware/roleMiddleware.js';
import { validateMasterCredentials } from '../middleware/validateMaster.js';

const router = express.Router();

/**
 * ============================================
 * PUBLIC ROUTES - No Authentication Required
 * ============================================
 */

/**
 * User Registration
 * @route POST /auth/user/register
 * @body { fullName, email, srn, year, branch, division, password, profilePic? }
 * @returns { user, token }
 */
router.post('/user/register', register);

/**
 * User Login
 * @route POST /auth/user/login
 * @body { email, password }
 * @returns { user, token }
 */
router.post('/user/login', userLogin);

/**
 * Admin Login
 * @route POST /auth/admin/login
 * @body { email, password }
 * @returns { admin, token }
 */
router.post('/admin/login', adminLogin);

/**
 * Master Login
 * Validates hardcoded master credentials from .env
 * @route POST /auth/master/login
 * @body { username, password }
 * @returns { master, token }
 */
router.post('/master/login', validateMasterCredentials, masterLogin);

/**
 * ============================================
 * PROTECTED ROUTES - Authentication Required
 * ============================================
 */

/**
 * Get Current User Profile
 * Returns authenticated user's profile based on role
 * @route GET /auth/me
 * @headers { Authorization: "Bearer <token>" }
 * @returns { user | admin | master }
 */
router.get('/me', authenticate, getCurrentUser);

/**
 * Update User Profile
 * Only users can update their own profile
 * @route PUT /auth/profile
 * @headers { Authorization: "Bearer <token>" }
 * @body { fullName?, bio?, profilePic? }
 * @returns { user }
 */
router.put('/profile', authenticate, roleMiddleware('user'), updateProfile);

/**
 * ============================================
 * ROLE-SPECIFIC PROTECTED ROUTES
 * ============================================
 */

/**
 * Verify Admin Status
 * Check if current token is valid admin token
 * @route GET /auth/admin/verify
 * @headers { Authorization: "Bearer <token>" }
 * @returns { admin, isValid: boolean }
 */
router.get('/admin/verify', authenticate, roleMiddleware('admin'), (req, res) => {
  res.json({
    success: true,
    message: 'Admin token is valid',
    data: {
      isValid: true,
      role: req.user.role,
    },
  });
});

/**
 * Verify Master Status
 * Check if current token is valid master token
 * @route GET /auth/master/verify
 * @headers { Authorization: "Bearer <token>" }
 * @returns { master, isValid: boolean }
 */
router.get('/master/verify', authenticate, masterOnly, (req, res) => {
  res.json({
    success: true,
    message: 'Master token is valid',
    data: {
      isValid: true,
      role: req.user.role,
      masterUsername: req.user.masterUsername,
    },
  });
});

/**
 * Verify Token
 * Generic endpoint to verify any valid token
 * @route GET /auth/verify
 * @headers { Authorization: "Bearer <token>" }
 * @returns { isValid: boolean, role: string }
 */
router.get('/verify', optionalAuth, (req, res) => {
  const isValid = req.user?.authenticated !== false;
  res.json({
    success: isValid,
    message: isValid ? 'Token is valid' : 'No valid token provided',
    data: {
      isValid,
      role: req.user?.role,
      authenticated: req.user?.authenticated ?? false,
    },
  });
});

export default router;
