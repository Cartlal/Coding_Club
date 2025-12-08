import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { roleMiddleware } from '../middleware/roleMiddleware.js';
import {
  // Event Management
  addEvent,
  editEvent,
  deleteEvent,
  getEventParticipants,
  addParticipants,
  declareWinners,

  // Notice Board
  addNotice,
  getAllNotices,
  editNotice,
  deleteNotice,

  // Statistics
  getAdminStats,
  getClusterStats,
} from '../controllers/adminController.js';

const router = express.Router();

// All routes require authentication and admin/master role
router.use(authenticate);
router.use(roleMiddleware(['admin', 'master']));

/**
 * EVENT MANAGEMENT ROUTES
 */

// Add event (upcoming only)
router.post('/event/add', addEvent);

// Edit event (upcoming only)
router.put('/event/edit/:id', editEvent);

// Delete event (upcoming only)
router.delete('/event/delete/:id', deleteEvent);

// Get all participants of an event
router.get('/event/:id/participants', getEventParticipants);

// Manually add participants to event
router.post('/event/:id/participants/add', addParticipants);

// Declare winners with rankings (max 10)
router.post('/event/:id/winners', declareWinners);

/**
 * NOTICE BOARD ROUTES
 */

// Add notice
router.post('/notice/add', addNotice);

// Get all notices (with filters)
router.get('/notice/all', getAllNotices);

// Edit notice
router.put('/notice/edit/:id', editNotice);

// Delete notice
router.delete('/notice/delete/:id', deleteNotice);

/**
 * STATISTICS ROUTES
 */

// Get overall admin statistics (cluster-wise and total)
router.get('/stats', getAdminStats);

// Get detailed cluster statistics
router.get('/stats/cluster/:clusterId', getClusterStats);

export default router;
