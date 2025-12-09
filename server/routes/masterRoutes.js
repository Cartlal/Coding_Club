import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { roleMiddleware } from '../middleware/roleMiddleware.js';
import {
  // Admin Management
  getAdmins,
  createAdmin,
  removeAdmin,
  reactivateAdmin,

  // User Management
  getAllUsers,
  removeUser,

  // Past Event Management
  addPastEvent,
  editPastEvent,
  deletePastEvent,

  // Statistics
  getSystemStats,
  exportSystemData,
} from '../controllers/masterController.js';

const router = express.Router();

// All routes require authentication and master role only
router.use(authenticate);
router.use(roleMiddleware(['master']));

/**
 * ADMIN MANAGEMENT ROUTES
 */

// Get all admins
router.get('/admins', getAdmins);

// Create new admin
router.post('/create-admin', createAdmin);

// Remove admin (soft delete)
router.delete('/remove-admin/:id', removeAdmin);

// Reactivate deactivated admin
router.put('/reactivate-admin/:id', reactivateAdmin);

/**
 * USER MANAGEMENT ROUTES
 */

// Get all users with pagination and filters
router.get('/users', getAllUsers);

// Remove user (3-step confirmation)
router.delete('/remove-user/:id', removeUser);

/**
 * PAST EVENT MANAGEMENT ROUTES
 */

// Add past event
router.post('/event/past/add', addPastEvent);

// Edit past event
router.put('/event/past/edit/:id', editPastEvent);

// Delete past event (requires password confirmation)
router.delete('/event/past/delete/:id', deletePastEvent);

/**
 * STATISTICS ROUTES
 */

// Get complete system statistics
router.get('/stats', getSystemStats);

// Export system data
router.get('/stats/export', exportSystemData);

export default router;
