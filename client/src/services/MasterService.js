import axiosInstance from './axiosInstance';

export const MasterService = {
  // Admin Management
  getAdmins: () => {
    return axiosInstance.get('/master/admins');
  },

  createAdmin: (adminData) => {
    return axiosInstance.post('/master/create-admin', adminData);
  },

  removeAdmin: (adminId) => {
    return axiosInstance.delete(`/master/remove-admin/${adminId}`);
  },

  reactivateAdmin: (adminId) => {
    return axiosInstance.put(`/master/reactivate-admin/${adminId}`);
  },

  // User Management
  getAllUsers: (params) => {
    return axiosInstance.get('/master/users', { params });
  },

  removeUserStep1: (userId) => {
    return axiosInstance.delete(`/master/remove-user/${userId}`, {
      data: { step: '1' },
    });
  },

  removeUserStep2: (userId, password, token) => {
    return axiosInstance.delete(`/master/remove-user/${userId}`, {
      data: { step: '2', password, confirmationToken: token },
    });
  },

  removeUserStep3: (userId, password) => {
    return axiosInstance.delete(`/master/remove-user/${userId}`, {
      data: { step: '3', password },
    });
  },

  // Past Event Management
  addPastEvent: (eventData) => {
    return axiosInstance.post('/master/event/past/add', eventData);
  },

  editPastEvent: (eventId, eventData) => {
    return axiosInstance.put(`/master/event/past/edit/${eventId}`, eventData);
  },

  deletePastEvent: (eventId, password) => {
    return axiosInstance.delete(`/master/event/past/delete/${eventId}`, {
      data: { password },
    });
  },

  // Statistics
  getSystemStats: () => {
    return axiosInstance.get('/master/stats');
  },

  exportSystemData: (format = 'json') => {
    return axiosInstance.get('/master/stats/export', { params: { format } });
  },
};

export default MasterService;
