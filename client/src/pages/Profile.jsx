import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import UserService from '@/services/UserService';
import { QRCodeSVG as QRCode } from 'qrcode.react';

export default function Profile() {
  const navigate = useNavigate();
  const { auth, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedBadge, setExpandedBadge] = useState(null);

  useEffect(() => {
    if (!auth.isAuthenticated || auth.role !== 'user') {
      navigate('/login');
      return;
    }
    fetchProfileData();
  }, [auth, navigate]);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const [profileRes, statsRes, badgesRes] = await Promise.all([
        UserService.getProfile(),
        UserService.getStats(),
        UserService.getBadges(),
      ]);

      setProfile(profileRes.data.data);
      setStats(statsRes.data.data);
      setBadges(badgesRes.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-pitch-dark flex items-center justify-center pt-16">
        <div className="text-center">
          <div className="inline-block">
            <div className="animate-spin rounded-full h-16 w-16 border-2 border-slate-700 border-t-cyan-500"></div>
          </div>
          <p className="text-white mt-4 text-lg">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-pitch-dark flex items-center justify-center pt-16">
        <div className="bg-red-950/30 border border-red-900/50 rounded-lg p-8 max-w-md w-full mx-4">
          <div className="flex items-start gap-4">
            <div className="text-red-500 text-2xl">⚠️</div>
            <div>
              <h3 className="text-red-300 font-semibold mb-2">Error</h3>
              <p className="text-red-200 text-sm mb-4">{error}</p>
              <button
                onClick={() => navigate('/login')}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium transition-colors"
              >
                Back to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pitch-dark text-white">
      {/* Header Background */}
      <div className="relative h-32 bg-gradient-to-b from-slate-900 via-slate-900/50 to-transparent border-b border-slate-800">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 pb-16">
        {/* Main Profile Section */}
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <div className="flex flex-col md:flex-row gap-8 mb-12 -mt-16 relative z-10">
            {/* Avatar */}
            <div className="flex-shrink-0">
              {profile?.profilePic ? (
                <img
                  src={profile.profilePic}
                  alt={profile.fullName}
                  className="w-32 h-32 rounded-full border-4 border-slate-800 object-cover shadow-lg bg-slate-900"
                />
              ) : (
                <div className="w-32 h-32 rounded-full border-4 border-slate-800 bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-4xl font-bold text-slate-400">
                  {profile?.fullName?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-grow pt-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold mb-1">{profile?.fullName}</h1>
                  <p className="text-slate-400 text-lg mb-4">{profile?.email}</p>
                  <div className="flex flex-wrap gap-3 items-center">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-800/50 border border-slate-700 text-slate-300">
                      📚 {profile?.year} Year
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-800/50 border border-slate-700 text-slate-300">
                      🏢 {profile?.branch}
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-800/50 border border-slate-700 text-slate-300">
                      📋 {profile?.division}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="group relative inline-flex items-center px-6 py-2.5 bg-red-950/40 border border-red-900/50 rounded-lg font-medium text-red-300 hover:text-red-200 transition-all duration-200 hover:bg-red-950/60 hover:border-red-800/50"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-12">
            {stats && (
              <>
                <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 hover:border-slate-700 transition-colors">
                  <p className="text-slate-400 text-sm font-medium mb-1">Participations</p>
                  <p className="text-3xl font-bold text-cyan-400">{stats.participation || 0}</p>
                </div>
                <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 hover:border-slate-700 transition-colors">
                  <p className="text-slate-400 text-sm font-medium mb-1">Wins</p>
                  <p className="text-3xl font-bold text-yellow-400">🏆 {stats.wins || 0}</p>
                </div>
                <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 hover:border-slate-700 transition-colors">
                  <p className="text-slate-400 text-sm font-medium mb-1">Badges</p>
                  <p className="text-3xl font-bold text-purple-400">{badges?.length || 0}</p>
                </div>
                <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 hover:border-slate-700 transition-colors">
                  <p className="text-slate-400 text-sm font-medium mb-1">Rank</p>
                  <p className="text-3xl font-bold text-blue-400">#{stats.rank || 'N/A'}</p>
                </div>
              </>
            )}
          </div>

          {/* QR Code Section */}
          {profile?._id && (
            <div className="bg-slate-900/30 border border-slate-800 rounded-lg p-8 mb-12 overflow-hidden">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-1">
                  <h2 className="text-xl font-bold mb-2">Your Identity QR Code</h2>
                  <p className="text-slate-400 text-sm mb-4">Share this QR code for quick event registration and verification</p>
                  <p className="text-xs text-slate-500 font-mono">ID: {profile._id}</p>
                </div>
                <div className="flex-shrink-0 bg-white p-4 rounded-lg shadow-lg">
                  <QRCode value={profile._id} size={160} level="H" />
                </div>
              </div>
            </div>
          )}

          {/* Badges Section */}
          <div className="mb-12">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Achievements</h2>
              <p className="text-slate-400 text-sm">Badges earned through participation and excellence</p>
            </div>

            {badges && badges.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {badges.map((badge, idx) => (
                  <div
                    key={idx}
                    onMouseEnter={() => setExpandedBadge(idx)}
                    onMouseLeave={() => setExpandedBadge(null)}
                    className={`group relative rounded-lg border transition-all duration-200 cursor-pointer overflow-hidden ${
                      badge.earned
                        ? 'bg-gradient-to-br from-cyan-950/40 to-slate-900/40 border-cyan-900/30 hover:border-cyan-700/50 hover:shadow-lg hover:shadow-cyan-500/10'
                        : 'bg-slate-900/20 border-slate-800/30 opacity-50'
                    }`}
                  >
                    <div className="p-4 text-center">
                      <div className={`text-4xl mb-2 transition-transform duration-200 ${badge.earned ? 'group-hover:scale-110' : ''}`}>
                        {badge.icon || '🏆'}
                      </div>
                      <p className="font-semibold text-xs leading-tight">{badge.name}</p>
                      {badge.earned && (
                        <div className="absolute top-1 right-1 w-3 h-3 bg-cyan-500 rounded-full ring-2 ring-cyan-500/50"></div>
                      )}
                    </div>

                    {/* Tooltip */}
                    {expandedBadge === idx && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-200 whitespace-nowrap z-20 pointer-events-none">
                        {badge.description || badge.name}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-slate-900/20 border border-slate-800/30 rounded-lg p-12 text-center">
                <p className="text-slate-400">No badges yet. Participate in events to earn achievements! 🚀</p>
              </div>
            )}
          </div>

          {/* Events Section */}
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Event Participation</h2>
              <p className="text-slate-400 text-sm">History of all events you've participated in</p>
            </div>

            {profile?.eventsParticipated && profile.eventsParticipated.length > 0 ? (
              <div className="space-y-3">
                {profile.eventsParticipated.map((event, idx) => (
                  <div
                    key={idx}
                    className="group bg-slate-900/30 border border-slate-800 rounded-lg p-4 hover:border-slate-700 hover:bg-slate-900/50 transition-all duration-200"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-grow">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-base font-semibold text-white group-hover:text-cyan-400 transition-colors">{event.title}</h3>
                          {event.won && (
                            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-yellow-950/50 border border-yellow-900/50 text-yellow-300">
                              🏆 Winner
                            </span>
                          )}
                        </div>
                        <p className="text-slate-400 text-sm line-clamp-2">{event.description}</p>
                        {event.date && (
                          <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                            📅 {new Date(event.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </p>
                        )}
                      </div>
                      <div className="text-slate-600 group-hover:text-slate-400 transition-colors">
                        →
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-slate-900/20 border border-slate-800/30 rounded-lg p-12 text-center">
                <p className="text-slate-400">No events participated yet. Start exploring events! 🎯</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
