import { sendError } from '../utils/response.js';

/**
 * Validate email format
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 */
export const validatePassword = (password) => {
  return password && password.length >= 6;
};

/**
 * Validate SRN format
 */
export const validateSRN = (srn) => {
  return srn && srn.length >= 5;
};

/**
 * Registration validation middleware
 */
export const validateRegister = (req, res, next) => {
  const { fullName, email, srn, year, branch, division, password, confirmPassword } = req.body;

  // Check all fields are present
  if (!fullName || !email || !srn || !year || !branch || !division || !password || !confirmPassword) {
    return sendError(res, 'All fields are required', 400);
  }

  // Validate email
  if (!validateEmail(email)) {
    return sendError(res, 'Invalid email format', 400);
  }

  // Validate password strength
  if (!validatePassword(password)) {
    return sendError(res, 'Password must be at least 6 characters long', 400);
  }

  // Check passwords match
  if (password !== confirmPassword) {
    return sendError(res, 'Passwords do not match', 400);
  }

  // Validate SRN
  if (!validateSRN(srn)) {
    return sendError(res, 'Invalid SRN format', 400);
  }

  // Validate branch
  const validBranches = ['CSE', 'ECE', 'Mechanical', 'Civil', 'EEE', 'BME', 'Chemical', 'BCA'];
  if (!validBranches.includes(branch)) {
    return sendError(res, 'Invalid branch selected', 400);
  }

  // Validate year
  const validYears = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
  if (!validYears.includes(year)) {
    return sendError(res, 'Invalid year selected', 400);
  }

  // Validate division (should be uppercase letter)
  if (!division || !/^[A-Z]$/.test(division)) {
    return sendError(res, 'Invalid division format', 400);
  }

  next();
};

/**
 * Login validation middleware
 */
export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return sendError(res, 'Email and password are required', 400);
  }

  if (!validateEmail(email)) {
    return sendError(res, 'Invalid email format', 400);
  }

  next();
};

/**
 * Admin login validation middleware
 */
export const validateAdminLogin = (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return sendError(res, 'Username and password are required', 400);
  }

  next();
};

/**
 * Profile update validation middleware
 */
export const validateProfileUpdate = (req, res, next) => {
  const { fullName, bio } = req.body;

  if (fullName && fullName.trim().length === 0) {
    return sendError(res, 'Full name cannot be empty', 400);
  }

  if (bio && bio.trim().length > 500) {
    return sendError(res, 'Bio cannot exceed 500 characters', 400);
  }

  next();
};

/**
 * Query validation middleware
 */
export const validateQueryParams = (req, res, next) => {
  const { page, limit } = req.query;

  if (page && isNaN(parseInt(page))) {
    return sendError(res, 'Invalid page number', 400);
  }

  if (limit && isNaN(parseInt(limit))) {
    return sendError(res, 'Invalid limit', 400);
  }

  if (page && parseInt(page) < 1) {
    return sendError(res, 'Page must be greater than 0', 400);
  }

  if (limit && (parseInt(limit) < 1 || parseInt(limit) > 100)) {
    return sendError(res, 'Limit must be between 1 and 100', 400);
  }

  next();
};
