import express from 'express';
import {
  getMembers,
  getMemberById,
  getFaculty,
  getUserProfile,
  getUserStats,
  getUserBadges,
  getLeaderboard,
  getClassLeaderboard,
  registerForEvent,
  getUserEvents,
  unregisterFromEvent,
  updateUser,
  deleteUser,
  getStatistics,
} from '../controllers/userController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { roleMiddleware } from '../middleware/roleMiddleware.js';

const router = express.Router();

/**
 * Public routes
 */
router.get('/members', getMembers);
router.get('/members/:id', getMemberById);
router.get('/faculty', getFaculty);

/**
 * Protected user routes (User-only)
 */
router.get('/profile', authenticate, roleMiddleware(['user']), getUserProfile);
router.get('/stats', authenticate, roleMiddleware(['user']), getUserStats);
router.get('/badges', authenticate, roleMiddleware(['user']), getUserBadges);
router.get('/leaderboard', authenticate, roleMiddleware(['user']), getLeaderboard);
router.get('/class-leaderboard', authenticate, roleMiddleware(['user']), getClassLeaderboard);
router.get('/events', authenticate, roleMiddleware(['user']), getUserEvents);
router.post('/event/:eventId/register', authenticate, roleMiddleware(['user']), registerForEvent);
router.delete('/event/:eventId/register', authenticate, roleMiddleware(['user']), unregisterFromEvent);

/**
 * Admin routes
 */
router.get('/statistics', authenticate, authorize, getStatistics);
router.put('/:id', authenticate, authorize, updateUser);
router.delete('/:id', authenticate, authorize, deleteUser);

export default router;
