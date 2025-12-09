import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import UserService from '@/services/UserService';
import { QRCodeSVG as QRCode } from 'qrcode.react';
import BadgeMap from '@/components/ui/BadgeIcons';
import {
  Trophy,
  Activity,
  Award,
  Calendar,
  LogOut,
  Star,
  TrendingUp,
  Users,
  Target,
  Clock,
  ChevronRight,
  Mail,
  MapPin,
  Link as LinkIcon,
  Edit3,
  Github,
  Zap,
  BarChart3,
  GitBranch,
  X,
  Upload,
  Instagram,
  LayoutGrid,
  MessageCircle,
  Sparkles,
  ExternalLink,
  Lightbulb
} from 'lucide-react';

export default function Profile() {
  const navigate = useNavigate();
  const { auth, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');
  const [editSuccess, setEditSuccess] = useState('');
  const [showImageModal, setShowImageModal] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [showBadgesModal, setShowBadgesModal] = useState(false);
  
  // Form state for edit modal
  const [formData, setFormData] = useState({
    fullName: '',
    bio: '',
    profilePic: '',
    links: {
      github: '',
      portfolio: '',
      linkedin: '',
      instagram: '',
      custom: [],
    },
  });

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
      
      // Ensure badges is always an array
      const badgesData = badgesRes.data.data;
      if (badgesData?.badges?.all && Array.isArray(badgesData.badges.all)) {
        setBadges(badgesData.badges.all);
      } else if (Array.isArray(badgesData)) {
        setBadges(badgesData);
      } else {
        setBadges([]);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load profile');
      setBadges([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleEditModalOpen = () => {
    if (profile) {
      setFormData({
        fullName: profile.fullName || '',
        bio: profile.bio || '',
        profilePic: profile.profilePic || '',
        links: {
          github: profile.links?.github || '',
          portfolio: profile.links?.portfolio || '',
          linkedin: profile.links?.linkedin || '',
          instagram: profile.links?.instagram || '',
          custom: profile.links?.custom || [],
        },
      });
      setEditError('');
      setEditSuccess('');
    }
    setShowEditModal(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('links.')) {
      const linkKey = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        links: {
          ...prev.links,
          [linkKey]: value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleAddCustomLink = () => {
    setFormData(prev => ({
      ...prev,
      links: {
        ...prev.links,
        custom: [...prev.links.custom, { label: '', url: '' }],
      },
    }));
  };

  const handleRemoveCustomLink = (index) => {
    setFormData(prev => ({
      ...prev,
      links: {
        ...prev.links,
        custom: prev.links.custom.filter((_, i) => i !== index),
      },
    }));
  };

  const handleCustomLinkChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      links: {
        ...prev.links,
        custom: prev.links.custom.map((link, i) =>
          i === index ? { ...link, [field]: value } : link
        ),
      },
    }));
  };

  const handleSaveProfile = async () => {
    try {
      setEditLoading(true);
      setEditError('');
      setEditSuccess('');

      await UserService.updateProfile(formData);
      setEditSuccess('Profile updated successfully!');
      
      // Refetch profile data
      setTimeout(() => {
        fetchProfileData();
        setShowEditModal(false);
      }, 1500);
    } catch (err) {
      setEditError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setEditLoading(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64String = event.target?.result;
        setFormData(prev => ({
          ...prev,
          profilePic: base64String,
        }));
        setPreviewImage(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d1117]">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Sidebar Skeleton */}
            <div className="md:col-span-1">
              <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 sticky top-24">
                {/* Profile Picture Skeleton */}
                <div className="mb-6 flex justify-center">
                  <div className="w-40 h-40 rounded-full bg-[#0d1117] border border-[#30363d] animate-pulse"></div>
                </div>

                {/* Name Skeleton */}
                <div className="mb-4">
                  <div className="h-7 bg-[#0d1117] rounded-lg animate-pulse mb-2"></div>
                  <div className="h-4 bg-[#0d1117] rounded-lg animate-pulse w-3/4"></div>
                </div>

                {/* Email Skeleton */}
                <div className="mb-4 pb-4 border-b border-[#30363d]">
                  <div className="h-4 bg-[#0d1117] rounded-lg animate-pulse"></div>
                </div>

                {/* Info Lines Skeleton */}
                <div className="mb-6 pb-6 border-b border-[#30363d] space-y-2">
                  <div className="h-4 bg-[#0d1117] rounded-lg animate-pulse"></div>
                  <div className="h-4 bg-[#0d1117] rounded-lg animate-pulse"></div>
                  <div className="h-4 bg-[#0d1117] rounded-lg animate-pulse"></div>
                </div>

                {/* QR Code Skeleton */}
                <div className="mb-6 pb-6 border-b border-[#30363d]">
                  <div className="h-3 bg-[#0d1117] rounded-lg animate-pulse mb-3"></div>
                  <div className="w-48 h-48 mx-auto bg-[#0d1117] rounded-lg animate-pulse"></div>
                </div>

                {/* Buttons Skeleton */}
                <div className="space-y-2">
                  <div className="h-10 bg-[#0d1117] rounded-lg animate-pulse"></div>
                  <div className="h-10 bg-[#0d1117] rounded-lg animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Right Content Skeleton */}
            <div className="md:col-span-2 space-y-6">
              {/* Stats Grid Skeleton */}
              <div className="grid grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-[#161b22] border border-[#30363d] rounded-lg p-4">
                    <div className="h-5 bg-[#0d1117] rounded animate-pulse mb-2"></div>
                    <div className="h-8 bg-[#0d1117] rounded animate-pulse"></div>
                  </div>
                ))}
              </div>

              {/* Performance Metrics Skeleton */}
              <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6">
                <div className="h-6 bg-[#0d1117] rounded animate-pulse mb-6"></div>
                <div className="grid grid-cols-2 gap-6">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="space-y-2">
                      <div className="h-4 bg-[#0d1117] rounded animate-pulse"></div>
                      <div className="h-6 bg-[#0d1117] rounded animate-pulse w-2/3"></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Achievements Skeleton */}
              <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6">
                <div className="h-6 bg-[#0d1117] rounded animate-pulse mb-6"></div>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <div key={i} className="bg-[#0d1117] rounded-lg p-4 h-24 animate-pulse"></div>
                  ))}
                </div>
              </div>

              {/* Recent Events Skeleton */}
              <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6">
                <div className="h-6 bg-[#0d1117] rounded animate-pulse mb-6"></div>
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-lg border border-[#30363d] bg-[#0d1117]">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-10 h-10 rounded-lg bg-[#0d1117] animate-pulse flex-shrink-0"></div>
                        <div className="flex-1 space-y-1">
                          <div className="h-4 bg-[#0d1117] rounded animate-pulse w-1/2"></div>
                          <div className="h-3 bg-[#0d1117] rounded animate-pulse w-1/3"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center">
        <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6 max-w-md">
          <div className="text-[#f85149] mb-3">{error}</div>
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 bg-[#238636] hover:bg-[#2ea043] rounded text-white text-sm font-medium transition-colors"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-[#c9d1d9]">
      {/* GitHub-style Header */}
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row gap-8 mb-8">
          {/* Left Column - Profile Card */}
          <div className="md:w-1/4">
            <div className=" border border-[#30363d] rounded-2xl p-6 sticky top-24">
              {/* Profile Picture */}
              <div className="mb-6 flex justify-center">
                {profile?.profilePic ? (
                  <img
                    src={profile.profilePic}
                    alt={profile?.fullName}
                    onClick={() => setShowImageModal(true)}
                    className="w-60 h-60 rounded-full border-2 border-[#30363d] object-cover cursor-pointer hover:border-[#58a6ff] transition-colors"
                  />
                ) : (
                  <div 
                    onClick={() => setShowImageModal(true)}
                    className="w-40 h-40 rounded-full border-2 border-[#30363d] bg-gradient-to-br from-[#0d1117] to-[#161b22] flex items-center justify-center text-5xl font-bold text-[#30363d] cursor-pointer hover:border-[#58a6ff] transition-colors"
                  >
                    {profile?.fullName?.charAt(0).toUpperCase() || '?'}
                  </div>
                )}
              </div>

              {/* Name and Title */}
              <h1 className="text-2xl font-bold text-white mb-2">{profile?.fullName}</h1>

              {/* Email */}
              <div className="flex items-center gap-2 text-[#8b949e] text-sm mb-4 pb-4 border-b border-[#30363d]">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{profile?.email}</span>
              </div>

              {/* Year, Branch, SRN */}
              <div className="space-y-2 mb-6 pb-6 border-b border-[#30363d]">
                <div className="flex items-center gap-2 text-[#c9d1d9] text-sm">
                  <Calendar className="w-4 h-4 flex-shrink-0 text-[#8b949e]" />
                  <span>{profile?.class?.year}</span>
                </div>
                
                <div className="text-[#c9d1d9] text-sm">
                  <span className="text-[#8b949e]">Branch:</span> {profile?.class?.branch}
                </div>

                {profile?.srn && (
                  <div className="text-[#c9d1d9] text-sm">
                    <span className="text-[#8b949e]">SRN:</span> <span className="font-mono">{profile?.srn}</span>
                  </div>
                )}
              </div>

              {/* Bio/Description - Only show if exists */}
              {profile?.bio && (
                <p className="text-[#c9d1d9] text-sm mb-6 pb-6 border-b border-[#30363d] leading-relaxed">
                  {profile.bio}
                </p>
              )}

              {/* Social Links - Only show if any exist */}
              {(profile?.links?.github || profile?.links?.portfolio || profile?.links?.linkedin || profile?.links?.instagram || (Array.isArray(profile?.links?.custom) && profile.links.custom.length > 0)) && (
                <div className="mb-6 pb-6 border-b border-[#30363d]">
                  <p className="text-[#8b949e] text-xs font-semibold mb-3 uppercase tracking-widest">Social Links</p>
                  <div className="space-y-2">
                    {profile?.links?.github && (
                      <a
                        href={profile.links.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-[#58a6ff] hover:text-[#79b8ff] text-sm transition-colors"
                      >
                        <Github className="w-4 h-4" />
                        <span className="truncate">GitHub</span>
                      </a>
                    )}
                    {profile?.links?.portfolio && (
                      <a
                        href={profile.links.portfolio}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-[#58a6ff] hover:text-[#79b8ff] text-sm transition-colors"
                      >
                        <LinkIcon className="w-4 h-4" />
                        <span className="truncate">Portfolio</span>
                      </a>
                    )}
                    {profile?.links?.linkedin && (
                      <a
                        href={profile.links.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-[#58a6ff] hover:text-[#79b8ff] text-sm transition-colors"
                      >
                        <LinkIcon className="w-4 h-4" />
                        <span className="truncate">LinkedIn</span>
                      </a>
                    )}
                    {profile?.links?.instagram && (
                      <a
                        href={profile.links.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-[#58a6ff] hover:text-[#79b8ff] text-sm transition-colors"
                      >
                        <Instagram className="w-4 h-4" />
                        <span className="truncate">Instagram</span>
                      </a>
                    )}
                    {Array.isArray(profile?.links?.custom) && profile.links.custom.map((link, idx) => (
                      <a
                        key={idx}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-[#58a6ff] hover:text-[#79b8ff] text-sm transition-colors"
                      >
                        <LinkIcon className="w-4 h-4" />
                        <span className="truncate">{link.label}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* QR Code Section */}
              {profile?._id && (
                <div className="mb-6 pb-6 border-b border-[#30363d]">
                  <p className="text-[#8b949e] text-xs font-semibold mb-4 uppercase tracking-widest">Identity QR</p>
                  <div className="bg-white p-2 rounded-lg w-48 h-48 flex items-center justify-center mx-auto">
                    <QRCode value={profile._id} size={180} level="H" />
                  </div>
                  <p className="text-[#8b949e] text-xs mt-4 text-center">Quick registration at events</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-2">
                <button
                  onClick={handleEditModalOpen}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-[#30363d] bg-[#0d1117] hover:bg-[#161b22] text-[#c9d1d9] text-sm font-medium transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#f85149]/10 border border-[#f85149]/30 hover:bg-[#f85149]/20 text-[#f85149] text-sm font-medium transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Main Content */}
          <div className="md:w-3/4 space-y-8">
            {/* Stats Grid */}
            <div className=" border border-[#30363d] rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-6">Activity Overview</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-4 hover:border-[#2ea043] transition-colors group">
                  <div className="flex items-center justify-between">
                    <Activity className="w-5 h-5 text-[#8b949e] group-hover:text-[#2ea043]" />
                    <span className="text-xs text-[#8b949e]">Participation</span>
                  </div>
                  <div className="text-2xl font-bold text-white mt-2">{stats?.participation || 0}</div>
                </div>

                <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-4 hover:border-[#f0883e] transition-colors group">
                  <div className="flex items-center justify-between">
                    <Trophy className="w-5 h-5 text-[#8b949e] group-hover:text-[#f0883e]" />
                    <span className="text-xs text-[#8b949e]">Wins</span>
                  </div>
                  <div className="text-2xl font-bold text-white mt-2">{stats?.wins || 0}</div>
                </div>

                <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-4 hover:border-[#1f6feb] transition-colors group">
                  <div className="flex items-center justify-between">
                    <TrendingUp className="w-5 h-5 text-[#8b949e] group-hover:text-[#1f6feb]" />
                    <span className="text-xs text-[#8b949e]">Cluster Points</span>
                  </div>
                  <div className="text-2xl font-bold text-white mt-2">{stats?.clusterPoints || 0}</div>
                </div>

                <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-4 hover:border-[#8957e5] transition-colors group">
                  <div className="flex items-center justify-between">
                    <Award className="w-5 h-5 text-[#8b949e] group-hover:text-[#8957e5]" />
                    <span className="text-xs text-[#8b949e]">Rank</span>
                  </div>
                  <div className="text-2xl font-bold text-white mt-2">
                    {stats?.rank ? `#${stats.rank}` : 'N/A'}
                  </div>
                </div>
              </div>
            </div>

            {/* Badges Section */}
            <div className="border border-[#30363d] rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Achievements & Badges</h2>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-[#8b949e]">{Array.isArray(badges) ? badges.filter(b => b.earned).length : 0} earned</span>
                  <button 
                    onClick={() => setShowBadgesModal(true)}
                    className="text-sm text-[#58a6ff] hover:text-[#79b8ff] flex items-center gap-1"
                  >
                    <LayoutGrid className="w-4 h-4" />
                    View All
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {Array.isArray(badges) && badges.filter(b => b.earned).length > 0 ? (
                  badges.filter(b => b.earned).map((badge, idx) => {
                    const BadgeComponent = BadgeMap[badge.name];
                    return (
                      <div
                        key={idx}
                        className="relative group"
                      >
                        <div className="p-4 rounded-lg border transition-all duration-300 h-full flex flex-col items-center bg-gradient-to-br from-[#161b22] to-[#0d1117] border-[#2ea043]/30 hover:border-[#2ea043] hover:scale-[1.02]">
                          <div className="w-20 h-20 mb-4">
                            {BadgeComponent ? (
                              <BadgeComponent />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-4xl">
                                {badge.icon || '🏆'}
                              </div>
                            )}
                          </div>
                          <div className="text-center">
                            <p className="font-semibold text-sm text-white mb-1">{badge.name}</p>
                            <p className="text-xs text-[#8b949e] line-clamp-2">{badge.description}</p>
                          </div>
                          <div className="absolute top-2 right-2">
                            <div className="w-6 h-6 rounded-full bg-[#2ea043] flex items-center justify-center">
                              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="col-span-full text-center py-12">
                    <p className="text-[#8b949e]">No badges earned yet. Start participating in events!</p>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Events */}
            <div className=" border border-[#30363d] rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Recent Participation</h2>
                <button className="text-sm text-[#58a6ff] hover:text-[#79b8ff] flex items-center">
                  View all <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
              
              <div className="space-y-3">
                {profile?.eventsParticipated && profile.eventsParticipated.length > 0 ? (
                  profile.eventsParticipated.slice(0, 5).map((event, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-4 rounded-lg border border-[#30363d] hover:border-[#58a6ff]/50 hover:bg-[#0d1117] transition-all group"
                    >
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#1f6feb] to-[#8957e5] flex items-center justify-center mr-4">
                          <Calendar className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-white group-hover:text-[#58a6ff]">
                            {event.title}
                          </h3>
                          <p className="text-sm text-[#8b949e]">
                            {event.date ? new Date(event.date).toLocaleDateString() : 'Date not set'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        {event.won && (
                          <span className="px-3 py-1 rounded-full bg-yellow-900/20 border border-yellow-500/30 text-yellow-400 text-xs font-medium flex items-center">
                            <Star className="w-3 h-3 mr-1" />
                            Winner
                          </span>
                        )}
                        <ChevronRight className="w-5 h-5 text-[#8b949e] group-hover:text-[#58a6ff]" />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#0d1117] border border-[#30363d] flex items-center justify-center">
                      <Calendar className="w-8 h-8 text-[#8b949e]" />
                    </div>
                    <p className="text-[#8b949e]">No events participated yet</p>
                    <button className="mt-3 text-sm text-[#58a6ff] hover:text-[#79b8ff]">
                      Browse events to get started
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* ArcStack Special */}
            <div className="border border-[#30363d] rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-400" />
                ArcStack Special
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* WhatsApp Community */}
                <a 
                  href="https://chat.whatsapp.com/YOUR_LINK_HERE" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group relative overflow-hidden rounded-xl bg-[#0d1117] border border-[#30363d] p-6 hover:border-[#25D366] transition-all duration-300"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <MessageCircle className="w-24 h-24 text-[#25D366]" />
                  </div>
                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-lg bg-[#25D366]/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <MessageCircle className="w-6 h-6 text-[#25D366]" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#25D366] transition-colors">
                      Join WhatsApp Community
                    </h3>
                    <p className="text-sm text-[#8b949e] mb-4">
                      Connect with other members, get instant updates, and discuss tech!
                    </p>
                    <div className="flex items-center text-xs text-[#25D366] font-medium">
                      Join Now <ExternalLink className="w-3 h-3 ml-1" />
                    </div>
                  </div>
                </a>

                {/* Cool Thing 2: Tech Fact / Daily Tip */}
                <div className="group relative overflow-hidden rounded-xl bg-[#0d1117] border border-[#30363d] p-6 hover:border-[#a371f7] transition-all duration-300">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Lightbulb className="w-24 h-24 text-[#a371f7]" />
                  </div>
                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-lg bg-[#a371f7]/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Lightbulb className="w-6 h-6 text-[#a371f7]" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#a371f7] transition-colors">
                      Did You Know?
                    </h3>
                    <p className="text-sm text-[#8b949e] mb-4">
                      "The first computer bug was an actual moth found in the Harvard Mark II computer in 1947."
                    </p>
                    <div className="flex items-center text-xs text-[#a371f7] font-medium cursor-pointer">
                      See More Facts <ChevronRight className="w-3 h-3 ml-1" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* All Badges Modal */}
      {showBadgesModal && (
        <div 
          className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowBadgesModal(false)}
        >
          <div 
            className="bg-[#161b22] border border-[#30363d] rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-[#161b22] border-b border-[#30363d] p-6 flex items-center justify-between z-10">
              <div>
                <h2 className="text-xl font-bold text-white">Badge Collection</h2>
                <p className="text-sm text-[#8b949e] mt-1">
                  {badges.filter(b => b.earned).length} of {badges.length} badges earned
                </p>
              </div>
              <button
                onClick={() => setShowBadgesModal(false)}
                className="text-[#8b949e] hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {badges.map((badge, idx) => {
                const BadgeComponent = BadgeMap[badge.name];
                return (
                  <div
                    key={idx}
                    className={`relative group p-4 rounded-lg border transition-all duration-300 flex flex-col items-center text-center ${
                      badge.earned 
                        ? 'bg-gradient-to-br from-[#161b22] to-[#0d1117] border-[#2ea043]/30 hover:border-[#2ea043]' 
                        : 'bg-[#0d1117] border-[#30363d] opacity-60 grayscale hover:opacity-100 hover:grayscale-0'
                    }`}
                  >
                    <div className="w-16 h-16 mb-3">
                      {BadgeComponent ? (
                        <BadgeComponent />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-3xl">
                          {badge.icon || '🏆'}
                        </div>
                      )}
                    </div>
                    <p className="font-semibold text-xs text-white mb-1">{badge.name}</p>
                    <p className="text-[10px] text-[#8b949e] line-clamp-2">{badge.description}</p>
                    
                    {badge.earned && (
                      <div className="absolute top-2 right-2">
                        <div className="w-5 h-5 rounded-full bg-[#2ea043] flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-auto [&::-webkit-scrollbar]:w-1">
          <div className="bg-[#161b22] border border-[#30363d] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-[#161b22] border-b border-[#30363d] p-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Edit Profile</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-[#8b949e] hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Success Message */}
              {editSuccess && (
                <div className="bg-[#238636]/10 border border-[#238636]/50 text-[#238636] rounded-lg p-4 text-sm">
                  {editSuccess}
                </div>
              )}

              {/* Error Message */}
              {editError && (
                <div className="bg-[#f85149]/10 border border-[#f85149]/50 text-[#f85149] rounded-lg p-4 text-sm">
                  {editError}
                </div>
              )}

              {/* Profile Picture Upload */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">Profile Picture</label>
                <div className="flex gap-4 items-start">
                  <div className="flex-1">
                    <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-[#30363d] rounded-lg bg-[#0d1117] hover:border-[#58a6ff] hover:bg-[#161b22] cursor-pointer transition-colors">
                      <Upload className="w-4 h-4 text-[#8b949e]" />
                      <span className="text-sm text-[#8b949e]">Click to upload</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                  {(previewImage || formData.profilePic) && (
                    <img
                      src={previewImage || formData.profilePic}
                      alt="Preview"
                      className="w-20 h-20 rounded-lg object-cover border border-[#30363d]"
                    />
                  )}
                </div>
              </div>

              {/* Full Name Section */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleFormChange}
                  placeholder="Your full name"
                  className="w-full px-4 py-3 bg-[#0d1117] border border-[#30363d] text-white rounded-lg focus:border-[#58a6ff] focus:outline-none transition-colors"
                />
              </div>

              {/* Bio Section */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">Bio (Optional)</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleFormChange}
                  placeholder="Write about yourself..."
                  maxLength={500}
                  rows={4}
                  className="w-full px-4 py-3 bg-[#0d1117] border border-[#30363d] text-white rounded-lg focus:border-[#58a6ff] focus:outline-none transition-colors resize-none"
                />
                <p className="text-xs text-[#8b949e] mt-1">{formData.bio.length}/500 characters</p>
              </div>

              {/* Social Links Section */}
              <div>
                <h3 className="text-sm font-semibold text-white mb-4">Social Media Links</h3>
                
                <div className="space-y-4">
                  {/* GitHub */}
                  <div>
                    <label className="flex items-center gap-2 text-xs text-[#8b949e] mb-2">
                      <Github className="w-4 h-4" />
                      GitHub
                    </label>
                    <input
                      type="url"
                      name="links.github"
                      value={formData.links.github}
                      onChange={handleFormChange}
                      placeholder="https://github.com/username"
                      className="w-full px-4 py-2 bg-[#0d1117] border border-[#30363d] text-white text-sm rounded-lg focus:border-[#58a6ff] focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Portfolio */}
                  <div>
                    <label className="flex items-center gap-2 text-xs text-[#8b949e] mb-2">
                      <LinkIcon className="w-4 h-4" />
                      Portfolio
                    </label>
                    <input
                      type="url"
                      name="links.portfolio"
                      value={formData.links.portfolio}
                      onChange={handleFormChange}
                      placeholder="https://yourportfolio.com"
                      className="w-full px-4 py-2 bg-[#0d1117] border border-[#30363d] text-white text-sm rounded-lg focus:border-[#58a6ff] focus:outline-none transition-colors"
                    />
                  </div>

                  {/* LinkedIn */}
                  <div>
                    <label className="flex items-center gap-2 text-xs text-[#8b949e] mb-2">
                      <LinkIcon className="w-4 h-4" />
                      LinkedIn
                    </label>
                    <input
                      type="url"
                      name="links.linkedin"
                      value={formData.links.linkedin}
                      onChange={handleFormChange}
                      placeholder="https://linkedin.com/in/username"
                      className="w-full px-4 py-2 bg-[#0d1117] border border-[#30363d] text-white text-sm rounded-lg focus:border-[#58a6ff] focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Instagram */}
                  <div>
                    <label className="flex items-center gap-2 text-xs text-[#8b949e] mb-2">
                      <Instagram className="w-4 h-4" />
                      Instagram
                    </label>
                    <input
                      type="url"
                      name="links.instagram"
                      value={formData.links.instagram}
                      onChange={handleFormChange}
                      placeholder="https://instagram.com/username"
                      className="w-full px-4 py-2 bg-[#0d1117] border border-[#30363d] text-white text-sm rounded-lg focus:border-[#58a6ff] focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Custom Links */}
                  <div className="pt-4 border-t border-[#30363d]">
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-xs text-[#8b949e] font-semibold">Custom Links</label>
                      <button
                        onClick={handleAddCustomLink}
                        className="text-xs px-2 py-1 bg-[#238636] hover:bg-[#2ea043] text-white rounded transition-colors"
                      >
                        + Add Link
                      </button>
                    </div>

                    <div className="space-y-3">
                      {formData.links.custom.map((link, idx) => (
                        <div key={idx} className="flex gap-2">
                          <input
                            type="text"
                            value={link.label}
                            onChange={(e) => handleCustomLinkChange(idx, 'label', e.target.value)}
                            placeholder="Label (e.g., Blog)"
                            className="flex-1 px-3 py-2 bg-[#0d1117] border border-[#30363d] text-white text-sm rounded-lg focus:border-[#58a6ff] focus:outline-none transition-colors"
                          />
                          <input
                            type="url"
                            value={link.url}
                            onChange={(e) => handleCustomLinkChange(idx, 'url', e.target.value)}
                            placeholder="URL"
                            className="flex-1 px-3 py-2 bg-[#0d1117] border border-[#30363d] text-white text-sm rounded-lg focus:border-[#58a6ff] focus:outline-none transition-colors"
                          />
                          <button
                            onClick={() => handleRemoveCustomLink(idx)}
                            className="px-3 py-2 bg-[#f85149]/10 border border-[#f85149]/30 hover:bg-[#f85149]/20 text-[#f85149] text-sm rounded-lg transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-[#161b22] border-t border-[#30363d] p-6 flex gap-3 justify-end">
              <button
                onClick={() => setShowEditModal(false)}
                disabled={editLoading}
                className="px-4 py-2 rounded-lg border border-[#30363d] bg-[#0d1117] hover:bg-[#161b22] text-[#c9d1d9] text-sm font-medium transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                disabled={editLoading}
                className="px-4 py-2 rounded-lg bg-[#238636] hover:bg-[#2ea043] text-white text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {editLoading ? (
                  <>
                    <div className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Enlargement Modal */}
      {showImageModal && (profile?.profilePic || previewImage) && (
        <div 
          className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowImageModal(false)}
        >
          <div 
            className="relative max-w-2xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <X className="w-8 h-8" />
            </button>
            <img
              src={previewImage || profile?.profilePic}
              alt={profile?.fullName}
              className="w-full rounded-lg shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}