import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import AdminService from '@/services/AdminService';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { auth, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('events');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Events state
  const [events, setEvents] = useState([]);
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    maxParticipants: '',
    category: '',
  });

  // Notices state
  const [notices, setNotices] = useState([]);
  const [showNoticeForm, setShowNoticeForm] = useState(false);
  const [editingNotice, setEditingNotice] = useState(null);
  const [noticeForm, setNoticeForm] = useState({
    title: '',
    content: '',
    priority: 'normal',
  });

  // Stats state
  const [stats, setStats] = useState(null);

  // Selected event for participants view
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventParticipants, setEventParticipants] = useState([]);
  const [declareWinnersForm, setDeclareWinnersForm] = useState({
    eventId: '',
    winners: Array(10).fill(''),
  });

  useEffect(() => {
    if (!auth.isAuthenticated || auth.role !== 'admin') {
      navigate('/admin/login');
      return;
    }
    fetchDashboardData();
  }, [auth, navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [eventsRes, noticesRes, statsRes] = await Promise.all([
        AdminService.getEvents(),
        AdminService.getNotices(),
        AdminService.getStats(),
      ]);

      setEvents(eventsRes.data.data || []);
      setNotices(noticesRes.data.data || []);
      setStats(statsRes.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Event Management
  const handleEventFormChange = (e) => {
    const { name, value } = e.target;
    setEventForm({ ...eventForm, [name]: value });
  };

  const handleCreateEvent = async () => {
    try {
      if (!eventForm.title || !eventForm.date || !eventForm.time) {
        setError('Please fill in required fields');
        return;
      }
      setLoading(true);
      await AdminService.createEvent(eventForm);
      setSuccess('Event created successfully!');
      setEventForm({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        maxParticipants: '',
        category: '',
      });
      setShowEventForm(false);
      fetchDashboardData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEvent = async () => {
    try {
      setLoading(true);
      await AdminService.updateEvent(editingEvent._id, eventForm);
      setSuccess('Event updated successfully!');
      setEventForm({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        maxParticipants: '',
        category: '',
      });
      setEditingEvent(null);
      fetchDashboardData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update event');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      setLoading(true);
      await AdminService.deleteEvent(eventId);
      setSuccess('Event deleted successfully!');
      fetchDashboardData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete event');
    } finally {
      setLoading(false);
    }
  };

  const handleViewParticipants = async (eventId) => {
    try {
      setSelectedEvent(eventId);
      const res = await AdminService.getEventParticipants(eventId);
      setEventParticipants(res.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch participants');
    }
  };

  const handleRemoveParticipant = async (eventId, userId) => {
    if (!window.confirm('Remove this participant from event?')) return;
    try {
      setLoading(true);
      await AdminService.removeParticipant(eventId, userId);
      setSuccess('Participant removed successfully!');
      handleViewParticipants(eventId);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to remove participant');
    } finally {
      setLoading(false);
    }
  };

  // Notice Management
  const handleNoticeFormChange = (e) => {
    const { name, value } = e.target;
    setNoticeForm({ ...noticeForm, [name]: value });
  };

  const handleCreateNotice = async () => {
    try {
      if (!noticeForm.title || !noticeForm.content) {
        setError('Please fill in required fields');
        return;
      }
      setLoading(true);
      await AdminService.createNotice(noticeForm);
      setSuccess('Notice created successfully!');
      setNoticeForm({ title: '', content: '', priority: 'normal' });
      setShowNoticeForm(false);
      fetchDashboardData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create notice');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateNotice = async () => {
    try {
      setLoading(true);
      await AdminService.updateNotice(editingNotice._id, noticeForm);
      setSuccess('Notice updated successfully!');
      setNoticeForm({ title: '', content: '', priority: 'normal' });
      setEditingNotice(null);
      fetchDashboardData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update notice');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNotice = async (noticeId) => {
    if (!window.confirm('Delete this notice?')) return;
    try {
      setLoading(true);
      await AdminService.deleteNotice(noticeId);
      setSuccess('Notice deleted successfully!');
      fetchDashboardData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete notice');
    } finally {
      setLoading(false);
    }
  };

  // Winners Management
  const handleDeclareWinners = async () => {
    try {
      if (!declareWinnersForm.eventId || declareWinnersForm.winners.filter(w => w.trim()).length === 0) {
        setError('Select event and add at least one winner');
        return;
      }
      setLoading(true);
      await AdminService.declareWinners(
        declareWinnersForm.eventId,
        declareWinnersForm.winners.filter(w => w.trim())
      );
      setSuccess('Winners declared successfully!');
      setDeclareWinnersForm({ eventId: '', winners: Array(10).fill('') });
      fetchDashboardData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to declare winners');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-pitch-dark text-white pt-6 pb-10">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-slate-400">Manage events, notices, and participants</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-6 py-2 rounded-lg bg-red-600 hover:bg-red-500 font-semibold transition-colors"
          >
            Logout
          </button>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 bg-red-900/20 border border-red-700/50 text-red-400 p-4 rounded-lg">
            {error}
            <button
              onClick={() => setError('')}
              className="ml-4 text-red-300 hover:text-red-200 text-sm"
            >
              Dismiss
            </button>
          </div>
        )}
        {success && (
          <div className="mb-6 bg-green-900/20 border border-green-700/50 text-green-400 p-4 rounded-lg">
            {success}
            <button
              onClick={() => setSuccess('')}
              className="ml-4 text-green-300 hover:text-green-200 text-sm"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-8 border-b border-slate-700 overflow-x-auto">
          {['events', 'participants', 'winners', 'notices', 'stats'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-medium capitalize transition-colors whitespace-nowrap ${
                activeTab === tab
                  ? 'border-b-2 border-purple-500 text-purple-400'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-slate-400">Loading...</p>
          </div>
        )}

        {!loading && (
          <>
            {/* Events Tab */}
            {activeTab === 'events' && (
              <div className="space-y-6">
                <button
                  onClick={() => {
                    setShowEventForm(!showEventForm);
                    setEditingEvent(null);
                    setEventForm({
                      title: '',
                      description: '',
                      date: '',
                      time: '',
                      location: '',
                      maxParticipants: '',
                      category: '',
                    });
                  }}
                  className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold"
                >
                  {showEventForm ? 'Cancel' : '+ Create New Event'}
                </button>

                {/* Event Form */}
                {(showEventForm || editingEvent) && (
                  <div className="bg-slate-900/50 border border-white/5 rounded-xl p-8">
                    <h3 className="text-xl font-bold mb-6">
                      {editingEvent ? 'Edit Event' : 'Create New Event'}
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-slate-400 text-sm mb-2 block">Event Title *</label>
                        <input
                          type="text"
                          name="title"
                          value={eventForm.title}
                          onChange={handleEventFormChange}
                          disabled={loading}
                          placeholder="Event name"
                          className="w-full px-4 py-3 rounded-lg bg-slate-950/50 border border-slate-700/50 text-white placeholder-slate-600 focus:border-purple-500/50 outline-none transition-all disabled:opacity-50"
                        />
                      </div>
                      <div>
                        <label className="text-slate-400 text-sm mb-2 block">Category</label>
                        <input
                          type="text"
                          name="category"
                          value={eventForm.category}
                          onChange={handleEventFormChange}
                          disabled={loading}
                          placeholder="e.g., Coding, Design"
                          className="w-full px-4 py-3 rounded-lg bg-slate-950/50 border border-slate-700/50 text-white placeholder-slate-600 focus:border-purple-500/50 outline-none transition-all disabled:opacity-50"
                        />
                      </div>
                      <div>
                        <label className="text-slate-400 text-sm mb-2 block">Date *</label>
                        <input
                          type="date"
                          name="date"
                          value={eventForm.date}
                          onChange={handleEventFormChange}
                          disabled={loading}
                          className="w-full px-4 py-3 rounded-lg bg-slate-950/50 border border-slate-700/50 text-white focus:border-purple-500/50 outline-none transition-all disabled:opacity-50"
                        />
                      </div>
                      <div>
                        <label className="text-slate-400 text-sm mb-2 block">Time *</label>
                        <input
                          type="time"
                          name="time"
                          value={eventForm.time}
                          onChange={handleEventFormChange}
                          disabled={loading}
                          className="w-full px-4 py-3 rounded-lg bg-slate-950/50 border border-slate-700/50 text-white focus:border-purple-500/50 outline-none transition-all disabled:opacity-50"
                        />
                      </div>
                      <div>
                        <label className="text-slate-400 text-sm mb-2 block">Location</label>
                        <input
                          type="text"
                          name="location"
                          value={eventForm.location}
                          onChange={handleEventFormChange}
                          disabled={loading}
                          placeholder="Event venue"
                          className="w-full px-4 py-3 rounded-lg bg-slate-950/50 border border-slate-700/50 text-white placeholder-slate-600 focus:border-purple-500/50 outline-none transition-all disabled:opacity-50"
                        />
                      </div>
                      <div>
                        <label className="text-slate-400 text-sm mb-2 block">Max Participants</label>
                        <input
                          type="number"
                          name="maxParticipants"
                          value={eventForm.maxParticipants}
                          onChange={handleEventFormChange}
                          disabled={loading}
                          placeholder="Leave empty for unlimited"
                          className="w-full px-4 py-3 rounded-lg bg-slate-950/50 border border-slate-700/50 text-white placeholder-slate-600 focus:border-purple-500/50 outline-none transition-all disabled:opacity-50"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-slate-400 text-sm mb-2 block">Description</label>
                        <textarea
                          name="description"
                          value={eventForm.description}
                          onChange={handleEventFormChange}
                          disabled={loading}
                          placeholder="Event description"
                          rows="4"
                          className="w-full px-4 py-3 rounded-lg bg-slate-950/50 border border-slate-700/50 text-white placeholder-slate-600 focus:border-purple-500/50 outline-none transition-all disabled:opacity-50"
                        ></textarea>
                      </div>
                    </div>
                    <div className="flex gap-4 mt-6">
                      <button
                        onClick={editingEvent ? handleUpdateEvent : handleCreateEvent}
                        disabled={loading}
                        className="px-6 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold disabled:opacity-50"
                      >
                        {editingEvent ? 'Update Event' : 'Create Event'}
                      </button>
                      <button
                        onClick={() => {
                          setEditingEvent(null);
                          setShowEventForm(false);
                        }}
                        className="px-6 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-semibold"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Events List */}
                <div className="grid gap-4">
                  {events.length > 0 ? (
                    events.map((event) => (
                      <div key={event._id} className="bg-slate-900/50 border border-white/5 rounded-xl p-6 hover:border-purple-500/30 transition-colors">
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-bold mb-2">{event.title}</h3>
                            <p className="text-slate-400 text-sm mb-3">{event.description}</p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-slate-400">
                              <div>📅 {new Date(event.date).toLocaleDateString()}</div>
                              <div>⏰ {event.time}</div>
                              <div>📍 {event.location}</div>
                              <div>👥 {event.participants?.length || 0} registered</div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setEditingEvent(event);
                                setEventForm({
                                  title: event.title,
                                  description: event.description,
                                  date: event.date?.split('T')[0],
                                  time: event.time,
                                  location: event.location,
                                  maxParticipants: event.maxParticipants || '',
                                  category: event.category,
                                });
                              }}
                              className="px-3 py-1 rounded bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 text-sm"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleViewParticipants(event._id)}
                              className="px-3 py-1 rounded bg-cyan-600/20 hover:bg-cyan-600/40 text-cyan-400 text-sm"
                            >
                              View Participants
                            </button>
                            <button
                              onClick={() => handleDeleteEvent(event._id)}
                              className="px-3 py-1 rounded bg-red-600/20 hover:bg-red-600/40 text-red-400 text-sm"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-slate-400 py-12">
                      No events created yet.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Participants Tab */}
            {activeTab === 'participants' && (
              <div className="space-y-6">
                {selectedEvent ? (
                  <>
                    <button
                      onClick={() => {
                        setSelectedEvent(null);
                        setEventParticipants([]);
                      }}
                      className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-sm"
                    >
                      ← Back to Events
                    </button>

                    <div className="bg-slate-900/50 border border-white/5 rounded-xl p-6">
                      <h3 className="text-xl font-bold mb-4">Event Participants</h3>
                      {eventParticipants.length > 0 ? (
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead className="border-b border-slate-700">
                              <tr>
                                <th className="text-left py-3 px-4 text-slate-400">Name</th>
                                <th className="text-left py-3 px-4 text-slate-400">Email</th>
                                <th className="text-left py-3 px-4 text-slate-400">SRN</th>
                                <th className="text-center py-3 px-4 text-slate-400">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {eventParticipants.map((participant) => (
                                <tr key={participant._id} className="border-b border-slate-800 hover:bg-slate-800/30">
                                  <td className="py-3 px-4">{participant.fullName}</td>
                                  <td className="py-3 px-4 text-slate-400">{participant.email}</td>
                                  <td className="py-3 px-4 text-slate-400">{participant.srn}</td>
                                  <td className="py-3 px-4 text-center">
                                    <button
                                      onClick={() => handleRemoveParticipant(selectedEvent, participant._id)}
                                      disabled={loading}
                                      className="px-3 py-1 rounded bg-red-600/20 hover:bg-red-600/40 text-red-400 text-xs disabled:opacity-50"
                                    >
                                      Remove
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <p className="text-slate-400">No participants yet.</p>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="text-center text-slate-400 py-12">
                    <p>Select an event to view participants</p>
                    <button
                      onClick={() => setActiveTab('events')}
                      className="mt-4 px-6 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white"
                    >
                      Go to Events
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Winners Tab */}
            {activeTab === 'winners' && (
              <div className="space-y-6">
                <div className="bg-slate-900/50 border border-white/5 rounded-xl p-8">
                  <h3 className="text-xl font-bold mb-6">Declare Winners</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-slate-400 text-sm mb-2 block">Select Event *</label>
                      <select
                        value={declareWinnersForm.eventId}
                        onChange={(e) => setDeclareWinnersForm({ ...declareWinnersForm, eventId: e.target.value })}
                        disabled={loading}
                        className="w-full px-4 py-3 rounded-lg bg-slate-950/50 border border-slate-700/50 text-white focus:border-purple-500/50 outline-none transition-all disabled:opacity-50"
                      >
                        <option value="">Choose an event...</option>
                        {events.map((event) => (
                          <option key={event._id} value={event._id}>
                            {event.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-slate-400 text-sm mb-2 block">Winners (up to 10)</label>
                      <div className="grid md:grid-cols-2 gap-4">
                        {Array(10).fill(0).map((_, idx) => (
                          <div key={idx}>
                            <label className="text-slate-500 text-xs mb-1 block">
                              Position {idx + 1} {idx < 3 ? ['🥇', '🥈', '🥉'][idx] : ''}
                            </label>
                            <input
                              type="text"
                              placeholder="User ID / Email"
                              value={declareWinnersForm.winners[idx] || ''}
                              onChange={(e) => {
                                const newWinners = [...declareWinnersForm.winners];
                                newWinners[idx] = e.target.value;
                                setDeclareWinnersForm({ ...declareWinnersForm, winners: newWinners });
                              }}
                              disabled={loading}
                              className="w-full px-3 py-2 rounded-lg bg-slate-950/50 border border-slate-700/50 text-white placeholder-slate-600 focus:border-purple-500/50 outline-none transition-all disabled:opacity-50 text-sm"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={handleDeclareWinners}
                      disabled={loading}
                      className="px-6 py-3 rounded-lg bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white font-semibold disabled:opacity-50"
                    >
                      Declare Winners
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Notices Tab */}
            {activeTab === 'notices' && (
              <div className="space-y-6">
                <button
                  onClick={() => {
                    setShowNoticeForm(!showNoticeForm);
                    setEditingNotice(null);
                    setNoticeForm({ title: '', content: '', priority: 'normal' });
                  }}
                  className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold"
                >
                  {showNoticeForm ? 'Cancel' : '+ Create New Notice'}
                </button>

                {/* Notice Form */}
                {(showNoticeForm || editingNotice) && (
                  <div className="bg-slate-900/50 border border-white/5 rounded-xl p-8">
                    <h3 className="text-xl font-bold mb-6">
                      {editingNotice ? 'Edit Notice' : 'Create New Notice'}
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-slate-400 text-sm mb-2 block">Title *</label>
                        <input
                          type="text"
                          name="title"
                          value={noticeForm.title}
                          onChange={handleNoticeFormChange}
                          disabled={loading}
                          placeholder="Notice title"
                          className="w-full px-4 py-3 rounded-lg bg-slate-950/50 border border-slate-700/50 text-white placeholder-slate-600 focus:border-purple-500/50 outline-none transition-all disabled:opacity-50"
                        />
                      </div>
                      <div>
                        <label className="text-slate-400 text-sm mb-2 block">Priority</label>
                        <select
                          name="priority"
                          value={noticeForm.priority}
                          onChange={handleNoticeFormChange}
                          disabled={loading}
                          className="w-full px-4 py-3 rounded-lg bg-slate-950/50 border border-slate-700/50 text-white focus:border-purple-500/50 outline-none transition-all disabled:opacity-50"
                        >
                          <option value="normal">Normal</option>
                          <option value="high">High</option>
                          <option value="urgent">Urgent</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-slate-400 text-sm mb-2 block">Content *</label>
                        <textarea
                          name="content"
                          value={noticeForm.content}
                          onChange={handleNoticeFormChange}
                          disabled={loading}
                          placeholder="Notice content"
                          rows="6"
                          className="w-full px-4 py-3 rounded-lg bg-slate-950/50 border border-slate-700/50 text-white placeholder-slate-600 focus:border-purple-500/50 outline-none transition-all disabled:opacity-50"
                        ></textarea>
                      </div>
                    </div>
                    <div className="flex gap-4 mt-6">
                      <button
                        onClick={editingNotice ? handleUpdateNotice : handleCreateNotice}
                        disabled={loading}
                        className="px-6 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold disabled:opacity-50"
                      >
                        {editingNotice ? 'Update Notice' : 'Create Notice'}
                      </button>
                      <button
                        onClick={() => {
                          setEditingNotice(null);
                          setShowNoticeForm(false);
                        }}
                        className="px-6 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-semibold"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Notices List */}
                <div className="space-y-4">
                  {notices.length > 0 ? (
                    notices.map((notice) => (
                      <div key={notice._id} className="bg-slate-900/50 border border-white/5 rounded-xl p-6 hover:border-purple-500/30 transition-colors">
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-bold">{notice.title}</h3>
                              <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                notice.priority === 'urgent' ? 'bg-red-900/30 text-red-400' :
                                notice.priority === 'high' ? 'bg-yellow-900/30 text-yellow-400' :
                                'bg-blue-900/30 text-blue-400'
                              }`}>
                                {notice.priority}
                              </span>
                            </div>
                            <p className="text-slate-400 whitespace-pre-wrap">{notice.content}</p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setEditingNotice(notice);
                                setNoticeForm({
                                  title: notice.title,
                                  content: notice.content,
                                  priority: notice.priority,
                                });
                              }}
                              className="px-3 py-1 rounded bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 text-sm"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteNotice(notice._id)}
                              className="px-3 py-1 rounded bg-red-600/20 hover:bg-red-600/40 text-red-400 text-sm"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-slate-400 py-12">
                      No notices yet.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Stats Tab */}
            {activeTab === 'stats' && (
              <div className="grid md:grid-cols-3 gap-6">
                {stats && [
                  { label: 'Total Events', value: stats.totalEvents || 0 },
                  { label: 'Active Events', value: stats.activeEvents || 0 },
                  { label: 'Total Participants', value: stats.totalParticipants || 0 },
                  { label: 'Completed Events', value: stats.completedEvents || 0 },
                  { label: 'Total Notices', value: stats.totalNotices || 0 },
                  { label: 'Avg Participation', value: (stats.avgParticipation || 0).toFixed(1) },
                ].map((stat, idx) => (
                  <div key={idx} className="bg-slate-900/50 border border-white/5 rounded-xl p-6">
                    <p className="text-slate-400 text-sm mb-2">{stat.label}</p>
                    <p className="text-3xl font-bold text-purple-400">{stat.value}</p>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
