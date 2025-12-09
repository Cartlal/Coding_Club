import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa6';
import { useAuth } from '@/context/AuthContext';
import AuthService from '@/services/AuthService';

export default function Signup() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        srn: '',
        year: '',
        branch: '',
        division: '',
        password: '',
        confirmPassword: '',
        profilePic: null,
        profilePicPreview: null,
    });

    const [passwordMatch, setPasswordMatch] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const branches = ['CSE', 'ECE', 'Mechanical', 'Civil', 'EEE','BME','Chemical','BCA'];
    const years = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setPasswordMatch(false);
            return;
        }
        setPasswordMatch(true);
        setError('');

        try {
            setLoading(true);
            const signupData = {
                fullName: formData.fullName,
                email: formData.email,
                srn: formData.srn.toUpperCase(),
                year: formData.year,
                branch: formData.branch,
                division: formData.division.toUpperCase(),
                password: formData.password,
                profilePic: formData.profilePicPreview || null,
            };

            const response = await AuthService.registerUser(signupData);
            const { token, userId } = response.data.data;

            // Auto-login after signup
            login(token, 'user', userId, {
                fullName: formData.fullName,
                email: formData.email,
                srn: formData.srn,
                year: formData.year,
                branch: formData.branch,
                division: formData.division,
            });

            navigate('/user/profile');
        } catch (err) {
            setError(err.response?.data?.message || 'Signup failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        // Convert division to uppercase
        if (name === 'division') {
            setFormData({ ...formData, [name]: value.toUpperCase() });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleProfilePicChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({
                    ...formData,
                    profilePic: file,
                    profilePicPreview: reader.result,
                });
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="min-h-screen bg-pitch-dark text-white flex items-center justify-center p-4 relative overflow-hidden">
            {/* Subtle Background Ambience */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-pitch-dark to-slate-900" />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-900/40 to-transparent" />

            {/* Auth Card */}
            <div className="relative w-full max-w-4xl bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-2xl p-8 md:p-10 shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-Poppines font-bold text-white mb-2 tracking-wide">
                        Create Account
                    </h1>
                    <p className="text-slate-400 text-sm">Join the community of innovators</p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="md:col-span-2 bg-red-900/20 border border-red-700/50 text-red-400 p-4 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Full Name */}
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest ml-1">Full Name *</label>
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            disabled={loading}
                            className="w-full px-4 py-3 rounded-lg bg-slate-950/50 border border-slate-700/50 text-white placeholder-slate-600 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 outline-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            placeholder="Name Surname"
                            required
                        />
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest ml-1">Email *</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            disabled={loading}
                            className="w-full px-4 py-3 rounded-lg bg-slate-950/50 border border-slate-700/50 text-white placeholder-slate-600 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 outline-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            placeholder="xyz@example.com"
                            required
                        />
                    </div>

                    {/* SRN */}
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest ml-1">SRN *</label>
                        <input
                            type="text"
                            name="srn"
                            value={formData.srn}
                            onChange={handleChange}
                            disabled={loading}
                            className="w-full px-4 py-3 rounded-lg bg-slate-950/50 border border-slate-700/50 text-white placeholder-slate-600 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 outline-none transition-all duration-200 uppercase disabled:opacity-50 disabled:cursor-not-allowed"
                            placeholder="02FE23BCS112"
                            required
                        />
                    </div>

                    {/* Year */}
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest ml-1">Year *</label>
                        <select
                            name="year"
                            value={formData.year}
                            onChange={handleChange}
                            disabled={loading}
                            className="w-full px-4 py-3 rounded-lg bg-slate-950/50 border border-slate-700/50 text-white focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 outline-none transition-all duration-200 appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{ backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='rgb(100,116,139)' stroke-width='2'%3e%3cpath d='M6 9l6 6 6-6'%3e%3c/path%3e%3c/svg%3e")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem' }}
                            required
                        >
                            <option value="" className="bg-slate-950 text-white">Select Year</option>
                            {years.map((year) => (
                                <option key={year} value={year} className="bg-slate-950 text-white">
                                    {year}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Branch */}
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest ml-1">Branch *</label>
                        <select
                            name="branch"
                            value={formData.branch}
                            onChange={handleChange}
                            disabled={loading}
                            className="w-full px-4 py-3 rounded-lg bg-slate-950/50 border border-slate-700/50 text-white focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 outline-none transition-all duration-200 appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{ backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='rgb(100,116,139)' stroke-width='2'%3e%3cpath d='M6 9l6 6 6-6'%3e%3c/path%3e%3c/svg%3e")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem' }}
                            required
                        >
                            <option value="" className="bg-slate-950 text-white">Select Branch</option>
                            {branches.map((branch) => (
                                <option key={branch} value={branch} className="bg-slate-950 text-white">
                                    {branch}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Division - Text input that converts to uppercase */}
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest ml-1">Division *</label>
                        <input
                            type="text"
                            name="division"
                            value={formData.division}
                            onChange={handleChange}
                            disabled={loading}
                            maxLength="1"
                            className="w-full px-4 py-3 rounded-lg bg-slate-950/50 border border-slate-700/50 text-white placeholder-slate-600 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 outline-none transition-all duration-200 uppercase disabled:opacity-50 disabled:cursor-not-allowed"
                            placeholder="A"
                            required
                        />
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest ml-1">Password *</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                disabled={loading}
                                className="w-full px-4 py-3 rounded-lg bg-slate-950/50 border border-slate-700/50 text-white placeholder-slate-600 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 outline-none transition-all duration-200 pr-10 disabled:opacity-50 disabled:cursor-not-allowed"
                                placeholder="••••••••"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                disabled={loading}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors disabled:opacity-50"
                            >
                                {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest ml-1">Confirm Password *</label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                disabled={loading}
                                className={`w-full px-4 py-3 rounded-lg bg-slate-950/50 border ${!passwordMatch ? 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/50' : 'border-slate-700/50 focus:border-purple-500/50 focus:ring-purple-500/50'} text-white placeholder-slate-600 outline-none transition-all duration-200 focus:ring-1 pr-10 disabled:opacity-50 disabled:cursor-not-allowed`}
                                placeholder="••••••••"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                disabled={loading}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors disabled:opacity-50"
                            >
                                {showConfirmPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                            </button>
                        </div>
                        {!passwordMatch && (
                            <p className="text-red-400 text-xs mt-1">Passwords do not match</p>
                        )}
                    </div>

                    {/* Profile Picture */}
                    <div className="md:col-span-2 space-y-2">
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest ml-1">Profile Picture (Optional)</label>
                        <div className="flex items-center gap-4">
                            {formData.profilePicPreview ? (
                                <div className="relative">
                                    <img
                                        src={formData.profilePicPreview}
                                        alt="Profile Preview"
                                        className="w-20 h-20 rounded-lg object-cover border border-purple-500/50"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, profilePic: null, profilePicPreview: null })}
                                        disabled={loading}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold hover:bg-red-600 disabled:opacity-50"
                                    >
                                        ×
                                    </button>
                                </div>
                            ) : (
                                <div className="w-20 h-20 rounded-lg bg-slate-800/50 border border-dashed border-slate-600 flex items-center justify-center">
                                    <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                </div>
                            )}
                            <div className="flex-1">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleProfilePicChange}
                                    disabled={loading}
                                    className="hidden"
                                    id="profilePicInput"
                                />
                                <label
                                    htmlFor="profilePicInput"
                                    className="block px-4 py-3 rounded-lg bg-slate-950/50 border border-slate-700/50 text-slate-400 hover:text-white hover:border-purple-500/50 cursor-pointer transition-all duration-200 text-center text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {formData.profilePic ? 'Change Photo' : 'Choose Photo'}
                                </label>
                                <p className="text-xs text-slate-500 mt-2">If not provided, a default avatar will be used</p>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="md:col-span-2 pt-6">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold shadow-lg shadow-purple-900/20 transform transition-all duration-200 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
                                    Creating Account...
                                </>
                            ) : (
                                'Create Account'
                            )}
                        </button>
                    </div>
                </form>

                <div className="mt-8 text-center pt-6 border-t border-white/5">
                    <p className="text-slate-500 text-sm mb-4">
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
