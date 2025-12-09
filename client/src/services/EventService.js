import axiosInstance from './axiosInstance';

export const EventService = {
  // Get all events
  getAllEvents: () => {
    return axiosInstance.get('/events');
  },

  // Get event details
  getEventDetails: (eventId) => {
    return axiosInstance.get(`/events/${eventId}`);
  },

  // Get upcoming events
  getUpcomingEvents: () => {
    return axiosInstance.get('/events/upcoming');
  },

  // Get past events
  getPastEvents: () => {
    return axiosInstance.get('/events/past');
  },

  // Get ongoing events
  getOngoingEvents: () => {
    return axiosInstance.get('/events/ongoing');
  },
};

export default EventService;
