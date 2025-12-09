import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import AuthService from '@/services/AuthService';

export default function MasterLogin() {
  const navigate = useNavigate();
  const { login, auth } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if already authenticated as master
  useEffect(() => {
    if (auth?.token && auth?.role === 'master') {
      navigate('/master/dashboard');
    }
  }, [auth, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await AuthService.loginMaster(formData.username, formData.password);
      const { token, master } = response.data.data;

      login(token, 'master', master._id, master);
      navigate('/master/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-pitch-dark text-white flex items-center justify-center px-4 relative overflow-hidden">
      {/* Subtle Background Ambience */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-pitch-dark to-slate-900" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-900/40 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-900/40 to-transparent" />

      {/* Auth Card */}
      <div className="relative w-full max-w-md bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-2xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-Poppines font-bold text-white mb-2 tracking-wide">
            Master Control
          </h1>
          <p className="text-slate-400 text-sm">Master system administrator access</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest ml-1">Username</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-slate-950/50 border border-slate-700/50 text-white placeholder-slate-600 focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 outline-none transition-all duration-200"
              placeholder="master_username"
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Password</label>
            </div>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-slate-950/50 border border-slate-700/50 text-white placeholder-slate-600 focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 outline-none transition-all duration-200"
              placeholder="••••••••"
              required
              disabled={loading}
            />
          </div>

          {error && (
            <div className="p-4 rounded-lg bg-red-900/20 border border-red-700/50 text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-lg bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-semibold shadow-lg shadow-red-900/20 transform transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing In...' : 'Master Login'}
          </button>
        </form>

        <div className="mt-8 text-center pt-6 border-t border-white/5">
          <p className="text-slate-500 text-sm">
            Not master?{' '}
            <Link to="/login" className="text-red-500 hover:text-red-400 font-medium transition-colors">
              User login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
