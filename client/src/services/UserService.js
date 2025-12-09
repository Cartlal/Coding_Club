import axiosInstance from './axiosInstance';

export const UserService = {
  // Get user profile
  getProfile: () => {
    return axiosInstance.get('/users/profile');
  },

  // Get user stats
  getStats: () => {
    return axiosInstance.get('/users/stats');
  },

  // Get user badges
  getBadges: () => {
    return axiosInstance.get('/users/badges');
  },

  // Get user events
  getEvents: () => {
    return axiosInstance.get('/users/events');
  },

  // Register for event
  registerEvent: (eventId) => {
    return axiosInstance.post(`/events/${eventId}/register`);
  },

  // Unregister from event
  unregisterEvent: (eventId) => {
    return axiosInstance.delete(`/events/${eventId}/unregister`);
  },

  // Get leaderboard
  getLeaderboard: () => {
    return axiosInstance.get('/leaderboard');
  },

  // Get class leaderboard
  getClassLeaderboard: (className) => {
    return axiosInstance.get(`/leaderboard/class/${className}`);
  },

  // Update user profile
  updateProfile: (profileData) => {
    return axiosInstance.put('/auth/profile', profileData);
  },
};

export default UserService;
