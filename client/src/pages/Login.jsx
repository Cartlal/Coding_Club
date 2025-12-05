import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login attempt:', formData);
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
          <h1 className="text-3xl font-rajdhani font-bold text-white mb-2 tracking-wide">
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
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Password</label>
              <Link to="/coming-soon" className="text-xs text-cyan-500 hover:text-cyan-400 transition-colors">
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
            />
          </div>

          <div className="flex items-center gap-2 ml-1">
            <input type="checkbox" id="remember" className="rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-offset-0 focus:ring-cyan-500/30 w-4 h-4" />
            <label htmlFor="remember" className="text-xs text-slate-400 cursor-pointer select-none">Remember for 30 days</label>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold shadow-lg shadow-cyan-900/20 transform transition-all duration-200 active:scale-[0.98]"
          >
            Sign In
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
