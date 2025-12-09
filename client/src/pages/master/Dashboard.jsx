import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import MasterService from '@/services/MasterService';

export default function MasterDashboard() {
  const navigate = useNavigate();
  const { auth, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('admins');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Admins state
  const [admins, setAdmins] = useState([]);
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [adminForm, setAdminForm] = useState({
    username: '',
    email: '',
    password: '',
  });

  // Users state
  const [users, setUsers] = useState([]);
  const [deleteStep, setDeleteStep] = useState({});

  // Past Events state
  const [pastEvents, setPastEvents] = useState([]);
  const [showPastEventForm, setShowPastEventForm] = useState(false);
  const [editingPastEvent, setEditingPastEvent] = useState(null);
  const [pastEventForm, setPastEventForm] = useState({
    title: '',
    description: '',
    date: '',
    winner: '',
    category: '',
  });

  // Stats state
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (!auth.isAuthenticated || auth.role !== 'master') {
      navigate('/master/login');
      return;
    }
    fetchDashboardData();
  }, [auth, navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [adminsRes, usersRes, pastEventsRes, statsRes] = await Promise.all([
        MasterService.getAdmins(),
        MasterService.getAllUsers(),
        MasterService.getPastEvents?.() || Promise.resolve({ data: { data: [] } }),
        MasterService.getSystemStats(),
      ]);

      setAdmins(adminsRes.data.data || []);
      // Handle users response - it returns { users: [...], pagination: {...} }
      const usersData = usersRes.data.data;
      setUsers(usersData.users || usersData || []);
      setPastEvents(pastEventsRes.data.data || []);
      setStats(statsRes.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Admin Management
  const handleAdminFormChange = (e) => {
    const { name, value } = e.target;
    setAdminForm({ ...adminForm, [name]: value });
  };

  const handleCreateAdmin = async () => {
    try {
      if (!adminForm.username || !adminForm.email || !adminForm.password) {
        setError('Please fill in all required fields');
        return;
      }
      setLoading(true);
      await MasterService.createAdmin(adminForm);
      setSuccess('Admin created successfully!');
      setAdminForm({ username: '', email: '', password: '' });
      setShowAdminForm(false);
      fetchDashboardData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create admin');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveAdmin = async (adminId) => {
    if (!window.confirm('Are you sure you want to remove this admin?')) return;
    try {
      setLoading(true);
      await MasterService.removeAdmin(adminId);
      setSuccess('Admin removed successfully!');
      fetchDashboardData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to remove admin');
    } finally {
      setLoading(false);
    }
  };

  const handleReactivateAdmin = async (adminId) => {
    try {
      setLoading(true);
      await MasterService.reactivateAdmin(adminId);
      setSuccess('Admin reactivated successfully!');
      fetchDashboardData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reactivate admin');
    } finally {
      setLoading(false);
    }
  };

  // User Management - 3-step deletion
  const handleRemoveUserStep1 = async (userId) => {
    try {
      setLoading(true);
      await MasterService.removeUserStep1(userId);
      setSuccess('Step 1 completed. Confirm in step 2.');
      setDeleteStep({ ...deleteStep, [userId]: 1 });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to initiate user removal');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveUserStep2 = async (userId) => {
    try {
      setLoading(true);
      await MasterService.removeUserStep2(userId);
      setSuccess('Step 2 completed. Final confirmation required.');
      setDeleteStep({ ...deleteStep, [userId]: 2 });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to confirm user removal step 2');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveUserStep3 = async (userId) => {
    if (!window.confirm('This action is permanent and cannot be undone. Are you sure?')) return;
    try {
      setLoading(true);
      await MasterService.removeUserStep3(userId);
      setSuccess('User removed permanently!');
      setDeleteStep({ ...deleteStep, [userId]: 0 });
      fetchDashboardData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to complete user removal');
    } finally {
      setLoading(false);
    }
  };

  // Past Events Management
  const handlePastEventFormChange = (e) => {
    const { name, value } = e.target;
    setPastEventForm({ ...pastEventForm, [name]: value });
  };

  const handleCreatePastEvent = async () => {
    try {
      if (!pastEventForm.title || !pastEventForm.date) {
        setError('Please fill in required fields');
        return;
      }
      setLoading(true);
      await MasterService.addPastEvent(pastEventForm);
      setSuccess('Past event added successfully!');
      setPastEventForm({ title: '', description: '', date: '', winner: '', category: '' });
      setShowPastEventForm(false);
      fetchDashboardData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add past event');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePastEvent = async () => {
    try {
      setLoading(true);
      await MasterService.editPastEvent(editingPastEvent._id, pastEventForm);
      setSuccess('Past event updated successfully!');
      setPastEventForm({ title: '', description: '', date: '', winner: '', category: '' });
      setEditingPastEvent(null);
      fetchDashboardData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update past event');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePastEvent = async (eventId) => {
    if (!window.confirm('Delete this past event?')) return;
    try {
      setLoading(true);
      await MasterService.deletePastEvent(eventId);
      setSuccess('Past event deleted successfully!');
      fetchDashboardData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete past event');
    } finally {
      setLoading(false);
    }
  };

  const handleExportStats = async () => {
    try {
      setLoading(true);
      const response = await MasterService.exportSystemData();
      // Create a blob from the response data
      const blob = new Blob([JSON.stringify(response.data.data, null, 2)], {
        type: 'application/json',
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `system-stats-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      setSuccess('Data exported successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to export data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/master/login');
  };

  return (
    <div className="min-h-screen bg-pitch-dark text-white pt-6 pb-10">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Master Control Panel</h1>
            <p className="text-slate-400">System administration and management</p>
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
          {['admins', 'users', 'pastEvents', 'stats'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-medium capitalize transition-colors whitespace-nowrap ${
                activeTab === tab
                  ? 'border-b-2 border-red-500 text-red-400'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab === 'pastEvents' ? 'Past Events' : tab}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500 mx-auto mb-4"></div>
            <p className="text-slate-400">Loading...</p>
          </div>
        )}

        {!loading && (
          <>
            {/* Admins Tab */}
            {activeTab === 'admins' && (
              <div className="space-y-6">
                <button
                  onClick={() => {
                    setShowAdminForm(!showAdminForm);
                    setAdminForm({ username: '', email: '', password: '' });
                  }}
                  className="px-6 py-3 rounded-lg bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-semibold"
                >
                  {showAdminForm ? 'Cancel' : '+ Add New Admin'}
                </button>

                {/* Admin Form */}
                {showAdminForm && (
                  <div className="bg-slate-900/50 border border-white/5 rounded-xl p-8">
                    <h3 className="text-xl font-bold mb-6">Create New Admin</h3>
                    <div className="grid md:grid-cols-3 gap-6">
                      <div>
                        <label className="text-slate-400 text-sm mb-2 block">Username *</label>
                        <input
                          type="text"
                          name="username"
                          value={adminForm.username}
                          onChange={handleAdminFormChange}
                          disabled={loading}
                          placeholder="Admin username"
                          className="w-full px-4 py-3 rounded-lg bg-slate-950/50 border border-slate-700/50 text-white placeholder-slate-600 focus:border-red-500/50 outline-none transition-all disabled:opacity-50"
                        />
                      </div>
                      <div>
                        <label className="text-slate-400 text-sm mb-2 block">Email *</label>
                        <input
                          type="email"
                          name="email"
                          value={adminForm.email}
                          onChange={handleAdminFormChange}
                          disabled={loading}
                          placeholder="admin@example.com"
                          className="w-full px-4 py-3 rounded-lg bg-slate-950/50 border border-slate-700/50 text-white placeholder-slate-600 focus:border-red-500/50 outline-none transition-all disabled:opacity-50"
                        />
                      </div>
                      <div>
                        <label className="text-slate-400 text-sm mb-2 block">Password *</label>
                        <input
                          type="password"
                          name="password"
                          value={adminForm.password}
                          onChange={handleAdminFormChange}
                          disabled={loading}
                          placeholder="••••••••"
                          className="w-full px-4 py-3 rounded-lg bg-slate-950/50 border border-slate-700/50 text-white placeholder-slate-600 focus:border-red-500/50 outline-none transition-all disabled:opacity-50"
                        />
                      </div>
                    </div>
                    <div className="flex gap-4 mt-6">
                      <button
                        onClick={handleCreateAdmin}
                        disabled={loading}
                        className="px-6 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold disabled:opacity-50"
                      >
                        Create Admin
                      </button>
                      <button
                        onClick={() => setShowAdminForm(false)}
                        className="px-6 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-semibold"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Admins List */}
                <div className="grid gap-4">
                  {admins.length > 0 ? (
                    admins.map((admin) => (
                      <div key={admin._id} className="bg-slate-900/50 border border-white/5 rounded-xl p-6 hover:border-red-500/30 transition-colors">
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <h3 className="text-lg font-bold mb-1">{admin.username}</h3>
                            <p className="text-slate-400 text-sm">{admin.email}</p>
                            <span className={`inline-block mt-2 px-3 py-1 rounded text-xs font-semibold ${
                              admin.isActive ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'
                            }`}>
                              {admin.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            {!admin.isActive && (
                              <button
                                onClick={() => handleReactivateAdmin(admin._id)}
                                disabled={loading}
                                className="px-4 py-2 rounded bg-green-600/20 hover:bg-green-600/40 text-green-400 text-sm disabled:opacity-50"
                              >
                                Reactivate
                              </button>
                            )}
                            <button
                              onClick={() => handleRemoveAdmin(admin._id)}
                              disabled={loading}
                              className="px-4 py-2 rounded bg-red-600/20 hover:bg-red-600/40 text-red-400 text-sm disabled:opacity-50"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-slate-400 py-12">
                      No admins yet.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div className="space-y-6">
                <div className="bg-slate-900/50 border border-white/5 rounded-xl p-6">
                  <h3 className="text-xl font-bold mb-4">Manage Users</h3>
                  {users.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="border-b border-slate-700">
                          <tr>
                            <th className="text-left py-3 px-4 text-slate-400">Name</th>
                            <th className="text-left py-3 px-4 text-slate-400">Email</th>
                            <th className="text-left py-3 px-4 text-slate-400">SRN</th>
                            <th className="text-left py-3 px-4 text-slate-400">Year / Branch</th>
                            <th className="text-center py-3 px-4 text-slate-400">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {users.map((user) => {
                            const step = deleteStep[user._id] || 0;
                            return (
                              <tr key={user._id} className="border-b border-slate-800 hover:bg-slate-800/30">
                                <td className="py-3 px-4">{user.fullName}</td>
                                <td className="py-3 px-4 text-slate-400">{user.email}</td>
                                <td className="py-3 px-4 text-slate-400">{user.srn || 'N/A'}</td>
                                <td className="py-3 px-4 text-slate-400">{user.class?.year || 'N/A'} / {user.class?.branch || 'N/A'}</td>
                                <td className="py-3 px-4 text-center">
                                  {step === 0 && (
                                    <button
                                      onClick={() => handleRemoveUserStep1(user._id)}
                                      disabled={loading}
                                      className="px-3 py-1 rounded bg-red-600/20 hover:bg-red-600/40 text-red-400 text-xs disabled:opacity-50"
                                    >
                                      Remove
                                    </button>
                                  )}
                                  {step === 1 && (
                                    <button
                                      onClick={() => handleRemoveUserStep2(user._id)}
                                      disabled={loading}
                                      className="px-3 py-1 rounded bg-yellow-600/20 hover:bg-yellow-600/40 text-yellow-400 text-xs disabled:opacity-50"
                                    >
                                      Confirm
                                    </button>
                                  )}
                                  {step === 2 && (
                                    <button
                                      onClick={() => handleRemoveUserStep3(user._id)}
                                      disabled={loading}
                                      className="px-3 py-1 rounded bg-red-600/20 hover:bg-red-600/40 text-red-400 text-xs disabled:opacity-50"
                                    >
                                      Final Delete
                                    </button>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-slate-400">No users found.</p>
                  )}
                </div>
              </div>
            )}

            {/* Past Events Tab */}
            {activeTab === 'pastEvents' && (
              <div className="space-y-6">
                <button
                  onClick={() => {
                    setShowPastEventForm(!showPastEventForm);
                    setEditingPastEvent(null);
                    setPastEventForm({ title: '', description: '', date: '', winner: '', category: '' });
                  }}
                  className="px-6 py-3 rounded-lg bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-semibold"
                >
                  {showPastEventForm ? 'Cancel' : '+ Add Past Event'}
                </button>

                {/* Past Event Form */}
                {(showPastEventForm || editingPastEvent) && (
                  <div className="bg-slate-900/50 border border-white/5 rounded-xl p-8">
                    <h3 className="text-xl font-bold mb-6">
                      {editingPastEvent ? 'Edit Past Event' : 'Add Past Event'}
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-slate-400 text-sm mb-2 block">Event Title *</label>
                        <input
                          type="text"
                          name="title"
                          value={pastEventForm.title}
                          onChange={handlePastEventFormChange}
                          disabled={loading}
                          placeholder="Event name"
                          className="w-full px-4 py-3 rounded-lg bg-slate-950/50 border border-slate-700/50 text-white placeholder-slate-600 focus:border-red-500/50 outline-none transition-all disabled:opacity-50"
                        />
                      </div>
                      <div>
                        <label className="text-slate-400 text-sm mb-2 block">Category</label>
                        <input
                          type="text"
                          name="category"
                          value={pastEventForm.category}
                          onChange={handlePastEventFormChange}
                          disabled={loading}
                          placeholder="e.g., Hackathon"
                          className="w-full px-4 py-3 rounded-lg bg-slate-950/50 border border-slate-700/50 text-white placeholder-slate-600 focus:border-red-500/50 outline-none transition-all disabled:opacity-50"
                        />
                      </div>
                      <div>
                        <label className="text-slate-400 text-sm mb-2 block">Date *</label>
                        <input
                          type="date"
                          name="date"
                          value={pastEventForm.date}
                          onChange={handlePastEventFormChange}
                          disabled={loading}
                          className="w-full px-4 py-3 rounded-lg bg-slate-950/50 border border-slate-700/50 text-white focus:border-red-500/50 outline-none transition-all disabled:opacity-50"
                        />
                      </div>
                      <div>
                        <label className="text-slate-400 text-sm mb-2 block">Winner</label>
                        <input
                          type="text"
                          name="winner"
                          value={pastEventForm.winner}
                          onChange={handlePastEventFormChange}
                          disabled={loading}
                          placeholder="Winner name or ID"
                          className="w-full px-4 py-3 rounded-lg bg-slate-950/50 border border-slate-700/50 text-white placeholder-slate-600 focus:border-red-500/50 outline-none transition-all disabled:opacity-50"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-slate-400 text-sm mb-2 block">Description</label>
                        <textarea
                          name="description"
                          value={pastEventForm.description}
                          onChange={handlePastEventFormChange}
                          disabled={loading}
                          placeholder="Event description"
                          rows="3"
                          className="w-full px-4 py-3 rounded-lg bg-slate-950/50 border border-slate-700/50 text-white placeholder-slate-600 focus:border-red-500/50 outline-none transition-all disabled:opacity-50"
                        ></textarea>
                      </div>
                    </div>
                    <div className="flex gap-4 mt-6">
                      <button
                        onClick={editingPastEvent ? handleUpdatePastEvent : handleCreatePastEvent}
                        disabled={loading}
                        className="px-6 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold disabled:opacity-50"
                      >
                        {editingPastEvent ? 'Update Event' : 'Add Event'}
                      </button>
                      <button
                        onClick={() => {
                          setEditingPastEvent(null);
                          setShowPastEventForm(false);
                        }}
                        className="px-6 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-semibold"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Past Events List */}
                <div className="grid gap-4">
                  {pastEvents.length > 0 ? (
                    pastEvents.map((event) => (
                      <div key={event._id} className="bg-slate-900/50 border border-white/5 rounded-xl p-6 hover:border-red-500/30 transition-colors">
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-bold mb-2">{event.title}</h3>
                            <p className="text-slate-400 text-sm mb-3">{event.description}</p>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs text-slate-400">
                              <div>📅 {new Date(event.date).toLocaleDateString()}</div>
                              <div>🏆 {event.winner || 'No winner yet'}</div>
                              <div>🏷️ {event.category || 'N/A'}</div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setEditingPastEvent(event);
                                setPastEventForm({
                                  title: event.title,
                                  description: event.description,
                                  date: event.date?.split('T')[0],
                                  winner: event.winner,
                                  category: event.category,
                                });
                              }}
                              className="px-3 py-1 rounded bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 text-sm"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeletePastEvent(event._id)}
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
                      No past events recorded yet.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Stats Tab */}
            {activeTab === 'stats' && (
              <div className="space-y-6">
                <button
                  onClick={handleExportStats}
                  disabled={loading}
                  className="px-6 py-3 rounded-lg bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-semibold disabled:opacity-50"
                >
                  📥 Export System Data
                </button>

                <div className="grid md:grid-cols-3 gap-6">
                  {stats && [
                    { label: 'Total Users', value: stats.totalUsers || 0 },
                    { label: 'Total Admins', value: stats.totalAdmins || 0 },
                    { label: 'Active Admins', value: stats.activeAdmins || 0 },
                    { label: 'Total Events', value: stats.totalEvents || 0 },
                    { label: 'Total Participants', value: stats.totalParticipants || 0 },
                    { label: 'Past Events', value: stats.pastEvents || 0 },
                    { label: 'Avg Event Participation', value: (stats.avgParticipation || 0).toFixed(1) },
                    { label: 'System Health', value: `${(stats.systemHealth || 0).toFixed(1)}%` },
                    { label: 'Last Updated', value: stats.lastUpdated ? new Date(stats.lastUpdated).toLocaleDateString() : 'N/A' },
                  ].map((stat, idx) => (
                    <div key={idx} className="bg-slate-900/50 border border-white/5 rounded-xl p-6">
                      <p className="text-slate-400 text-sm mb-2">{stat.label}</p>
                      <p className="text-3xl font-bold text-red-400">{stat.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
