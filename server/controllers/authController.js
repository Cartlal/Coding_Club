import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Admin from '../models/Admin.js';
import { sendSuccess, sendError } from '../utils/response.js';

/**
 * Generate JWT Token with role support
 * @param {string} userId - The user ID
 * @param {string} role - The user role (user, admin, master)
 * @returns {string} JWT token
 */
const generateToken = (userId, role = 'user') => {
  return jwt.sign({ userId, role }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

/**
 * Generate Master Token
 * @param {string} masterUsername - The master username
 * @returns {string} JWT token
 */
const generateMasterToken = (masterUsername) => {
  return jwt.sign(
    { masterUsername, role: 'master' },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

/**
 * User Registration
 * Creates a new user account with student information
 * @route POST /auth/user/register
 */
export const register = async (req, res, next) => {
  try {
    const { fullName, email, srn, year, branch, division, password, profilePic } = req.body;

    // Validate required fields
    if (!fullName || !email || !srn || !year || !branch || !division || !password) {
      return sendError(res, 'All fields are required', 400);
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { srn }],
    });

    if (existingUser) {
      return sendError(res, 'Email or SRN already exists', 409);
    }

    // Create new user with student role
    const user = new User({
      fullName,
      email,
      srn,
      class: {
        year,
        branch,
        division,
      },
      password,
      profilePic: profilePic || null,
      role: 'user', // Always 'user' for regular registration
    });

    await user.save();

    // Generate token with user role
    const token = generateToken(user._id, 'user');

    // Return user data (excluding password)
    const userResponse = user.toObject();
    delete userResponse.password;

    return sendSuccess(
      res,
      {
        user: userResponse,
        token,
      },
      'User registered successfully',
      201
    );
  } catch (error) {
    next(error);
  }
};

/**
 * User Login
 * Authenticates a user with email and password
 * @route POST /auth/user/login
 */
export const userLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return sendError(res, 'Email and password are required', 400);
    }

    // Find user and select password
    const user = await User.findOne({ email }).select('+password');

    if (!user || user.role !== 'user') {
      return sendError(res, 'Invalid email or password', 401);
    }

    // Check password
    const isPasswordValid = await user.matchPassword(password);

    if (!isPasswordValid) {
      return sendError(res, 'Invalid email or password', 401);
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token with user role
    const token = generateToken(user._id, 'user');

    // Return user data (excluding password)
    const userResponse = user.toObject();
    delete userResponse.password;

    return sendSuccess(
      res,
      {
        user: userResponse,
        token,
      },
      'Login successful'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get Current User Profile
 * Returns the authenticated user's profile based on their role
 * @route GET /auth/me
 */
export const getCurrentUser = async (req, res, next) => {
  try {
    const { userId, role, masterUsername } = req.user;

    // Handle master role
    if (role === 'master') {
      return sendSuccess(res, {
        master: {
          username: masterUsername,
          role: 'master',
          accessLevel: 'full_system_access',
        },
      }, 'Master profile retrieved successfully');
    }

    // Handle admin role
    if (role === 'admin') {
      const admin = await Admin.findById(userId);
      if (!admin) {
        return sendError(res, 'Admin not found', 404);
      }
      return sendSuccess(res, { admin }, 'Admin profile retrieved successfully');
    }

    // Handle user role
    const user = await User.findById(userId);
    if (!user) {
      return sendError(res, 'User not found', 404);
    }

    const userResponse = user.toObject();
    delete userResponse.password;

    return sendSuccess(res, { user: userResponse }, 'User profile retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Update User Profile
 * Updates profile information for authenticated user
 * @route PUT /auth/profile
 */
export const updateProfile = async (req, res, next) => {
  try {
    const { fullName, bio, profilePic } = req.body;
    const { userId, role } = req.user;

    // Only users can update profile (not admins or master)
    if (role !== 'user') {
      return sendError(res, 'Only users can update their profile', 403);
    }

    const updateData = {};
    if (fullName) updateData.fullName = fullName;
    if (bio) updateData.bio = bio;
    if (profilePic) updateData.profilePic = profilePic;

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!user) {
      return sendError(res, 'User not found', 404);
    }

    const userResponse = user.toObject();
    delete userResponse.password;

    return sendSuccess(res, { user: userResponse }, 'Profile updated successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Admin Login
 * Authenticates an admin with email and password
 * @route POST /auth/admin/login
 */
export const adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return sendError(res, 'Email and password are required', 400);
    }

    // Find admin and select password
    const admin = await Admin.findOne({ email }).select('+password');

    if (!admin) {
      return sendError(res, 'Invalid email or password', 401);
    }

    // Check password
    const isPasswordValid = await admin.matchPassword(password);

    if (!isPasswordValid) {
      return sendError(res, 'Invalid email or password', 401);
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    // Generate token with admin role
    const token = generateToken(admin._id, admin.role);

    // Return admin data (excluding password)
    const adminResponse = admin.toObject();
    delete adminResponse.password;

    return sendSuccess(
      res,
      {
        admin: adminResponse,
        token,
      },
      'Admin login successful'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Master Login
 * Authenticates using hardcoded master credentials from .env
 * Only one master account with full system access
 * @route POST /auth/master/login
 */
export const masterLogin = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return sendError(res, 'Username and password are required', 400);
    }

    // Verify against hardcoded master credentials
    if (
      username !== process.env.MASTER_USERNAME ||
      password !== process.env.MASTER_PASSWORD
    ) {
      return sendError(res, 'Invalid master credentials', 401);
    }

    // Generate master token
    const token = generateMasterToken(username);

    return sendSuccess(
      res,
      {
        master: {
          username: process.env.MASTER_USERNAME,
          role: 'master',
          accessLevel: 'full_system_access',
          createdAt: new Date().toISOString(),
        },
        token,
      },
      'Master login successful'
    );
  } catch (error) {
    next(error);
  }
};
