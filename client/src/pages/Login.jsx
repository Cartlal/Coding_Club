import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import AuthService from '@/services/AuthService';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [rememberPassword, setRememberPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Load saved credentials on component mount
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    const savedPassword = localStorage.getItem('rememberedPassword');
    const isRemembered = localStorage.getItem('rememberPassword') === 'true';

    if (isRemembered && savedEmail && savedPassword) {
      setFormData({
        email: savedEmail,
        password: savedPassword,
      });
      setRememberPassword(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Call login API
      const response = await AuthService.loginUser(formData.email, formData.password);
      const { token, user } = response.data.data;

      // Save credentials if "Remember Password" is checked
      if (rememberPassword) {
        localStorage.setItem('rememberedEmail', formData.email);
        localStorage.setItem('rememberedPassword', formData.password);
        localStorage.setItem('rememberPassword', 'true');
      } else {
        // Clear saved credentials if unchecked
        localStorage.removeItem('rememberedEmail');
        localStorage.removeItem('rememberedPassword');
        localStorage.removeItem('rememberPassword');
      }

      // Update auth context
      login(token, 'user', user._id, user);

      // Redirect to profile
      navigate('/user/profile');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRememberChange = (e) => {
    setRememberPassword(e.target.checked);
  };

  return (
    <div className="min-h-screen bg-pitch-dark text-white flex items-center justify-center px-4 relative overflow-hidden">
      {/* Subtle Background Ambience - Professional & Static */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-pitch-dark to-slate-900" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-900/40 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-900/40 to-transparent" />

      {/* Auth Card - Clean Glassmorphism */}
      <div className="relative w-full max-w-md bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-2xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-Poppines font-bold text-white mb-2 tracking-wide">
            Welcome Back
          </h1>
          <p className="text-slate-400 text-sm">Sign in to access your dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-slate-950/50 border border-slate-700/50 text-white placeholder-slate-600 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 outline-none transition-all duration-200"
              placeholder="name@example.com"
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Password</label>
              <Link to="/forgot-password" className="text-xs text-cyan-500 hover:text-cyan-400 transition-colors">
                Forgot Password?
              </Link>
            </div>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-slate-950/50 border border-slate-700/50 text-white placeholder-slate-600 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 outline-none transition-all duration-200"
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

          <div className="flex items-center gap-3 ml-1">
            {/* Creative Animated Checkbox */}
            <label className="relative inline-flex items-center cursor-pointer group">
              <input
                type="checkbox"
                checked={rememberPassword}
                onChange={handleRememberChange}
                className="sr-only peer"
              />
              {/* Custom checkbox styling */}
              <div className="w-6 h-6 rounded-lg bg-slate-950/50 border border-slate-700/50 peer-checked:bg-gradient-to-br peer-checked:from-cyan-500 peer-checked:to-blue-500 peer-checked:border-cyan-400/50 transition-all duration-300 flex items-center justify-center group-hover:border-cyan-400/30">
                {rememberPassword && (
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              {/* Glow effect on hover */}
              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 opacity-0 group-hover:opacity-20 blur transition-opacity duration-300 -z-10" />
            </label>
            <label htmlFor="remember" className="text-xs text-slate-400 cursor-pointer select-none group hover:text-slate-300 transition-colors">
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text group-hover:text-transparent transition-all duration-300">
                Remember my password
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold shadow-lg shadow-cyan-900/20 transform transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 text-center pt-6 border-t border-white/5">
          <p className="text-slate-500 text-sm">
            Don't have an account?{' '}
            <Link to="/signup" className="text-cyan-500 hover:text-cyan-400 font-medium transition-colors">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
