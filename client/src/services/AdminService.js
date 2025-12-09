import axiosInstance from './axiosInstance';

export const AdminService = {
  // Event Management
  getEvents: () => {
    return axiosInstance.get('/admin/events');
  },

  createEvent: (eventData) => {
    return axiosInstance.post('/admin/event/create', eventData);
  },

  updateEvent: (eventId, eventData) => {
    return axiosInstance.put(`/admin/event/${eventId}/edit`, eventData);
  },

  deleteEvent: (eventId) => {
    return axiosInstance.delete(`/admin/event/${eventId}/delete`);
  },

  // Participant Management
  getEventParticipants: (eventId) => {
    return axiosInstance.get(`/admin/event/${eventId}/participants`);
  },

  addParticipant: (eventId, participantId) => {
    return axiosInstance.post(`/admin/event/${eventId}/participant/add`, { participantId });
  },

  removeParticipant: (eventId, participantId) => {
    return axiosInstance.delete(`/admin/event/${eventId}/participant/${participantId}/remove`);
  },

  // Winner Management
  declareWinners: (eventId, winnersData) => {
    return axiosInstance.post(`/admin/event/${eventId}/winners`, winnersData);
  },

  // Notice Management
  getNotices: () => {
    return axiosInstance.get('/admin/notices');
  },

  createNotice: (noticeData) => {
    return axiosInstance.post('/admin/notice/add', noticeData);
  },

  updateNotice: (noticeId, noticeData) => {
    return axiosInstance.put(`/admin/notice/${noticeId}/edit`, noticeData);
  },

  deleteNotice: (noticeId) => {
    return axiosInstance.delete(`/admin/notice/${noticeId}/delete`);
  },

  // Statistics
  getStats: () => {
    return axiosInstance.get('/admin/stats');
  },
};

export default AdminService;
