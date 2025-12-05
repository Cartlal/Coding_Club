import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Signup() {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        srn: '',
        mobile: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Signup attempt:', formData);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="min-h-screen bg-pitch-dark text-white flex items-center justify-center p-4 relative overflow-hidden">
            {/* Subtle Background Ambience */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-pitch-dark to-slate-900" />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-900/40 to-transparent" />

            {/* Auth Card */}
            <div className="relative w-full max-w-2xl bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-2xl p-8 md:p-10 shadow-2xl">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-rajdhani font-bold text-white mb-2 tracking-wide">
                        Create Account
                    </h1>
                    <p className="text-slate-400 text-sm">Join the community of innovators</p>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg bg-slate-950/50 border border-slate-700/50 text-white placeholder-slate-600 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 outline-none transition-all duration-200"
                            placeholder="John Doe"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest ml-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg bg-slate-950/50 border border-slate-700/50 text-white placeholder-slate-600 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 outline-none transition-all duration-200"
                            placeholder="john@example.com"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest ml-1">SRN</label>
                        <input
                            type="text"
                            name="srn"
                            value={formData.srn}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg bg-slate-950/50 border border-slate-700/50 text-white placeholder-slate-600 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 outline-none transition-all duration-200"
                            placeholder="01FE23BC456"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest ml-1">Mobile Number</label>
                        <input
                            type="tel"
                            name="mobile"
                            value={formData.mobile}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg bg-slate-950/50 border border-slate-700/50 text-white placeholder-slate-600 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 outline-none transition-all duration-200"
                            placeholder="+91 98765 43210"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest ml-1">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg bg-slate-950/50 border border-slate-700/50 text-white placeholder-slate-600 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 outline-none transition-all duration-200"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest ml-1">Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg bg-slate-950/50 border border-slate-700/50 text-white placeholder-slate-600 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 outline-none transition-all duration-200"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <div className="md:col-span-2 pt-6">
                        <button
                            type="submit"
                            className="w-full py-3.5 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold shadow-lg shadow-purple-900/20 transform transition-all duration-200 active:scale-[0.98]"
                        >
                            Create Account
                        </button>
                    </div>
                </form>

                <div className="mt-8 text-center pt-6 border-t border-white/5">
                    <p className="text-slate-500 text-sm">
                        Already have an account?{' '}
                        <Link to="/login" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
