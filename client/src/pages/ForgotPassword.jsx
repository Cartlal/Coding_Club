import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa6';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Email, 2: OTP Verification, 3: New Password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);

  // Generate OTP
  const generateOtp = () => {
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(newOtp);
    return newOtp;
  };

  // Handle email submission
  const handleEmailSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    // Generate and "send" OTP
    const newOtp = generateOtp();
    setOtpSent(true);
    setSuccess(`OTP sent to ${email}. Check your email!`);
    setTimeLeft(300); // 5 minutes
    setStep(2);

    // Simulate timer
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setOtpSent(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Handle OTP verification
  const handleOtpSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!otp) {
      setError('Please enter the OTP');
      return;
    }

    if (otp === generatedOtp) {
      setSuccess('OTP verified successfully!');
      setTimeout(() => {
        setStep(3);
        setSuccess('');
      }, 1000);
    } else {
      setError('Invalid OTP. Please try again.');
    }
  };

  // Handle new password submission
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!newPassword || !confirmPassword) {
      setError('Please fill in all password fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setSuccess('Password reset successfully! Redirecting to login...');
    setTimeout(() => {
      navigate('/login');
    }, 2000);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-pitch-dark text-white flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-pitch-dark to-slate-900" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-900/40 to-transparent" />

      {/* Auth Card */}
      <div className="relative w-full max-w-md bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-2xl p-8 shadow-2xl">
        {/* Back Button */}
        <button
          onClick={() => navigate('/login')}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6 text-sm"
        >
          <FaArrowLeft size={14} />
          Back to Login
        </button>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-rajdhani font-bold text-white mb-2 tracking-wide">
            {step === 1 ? 'Reset Password' : step === 2 ? 'Verify OTP' : 'New Password'}
          </h1>
          <p className="text-slate-400 text-sm">
            {step === 1 && 'Enter your email to receive an OTP'}
            {step === 2 && 'Enter the 6-digit code sent to your email'}
            {step === 3 && 'Create a strong new password'}
          </p>
        </div>

        {/* Error and Success Messages */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-xs">
            {success}
          </div>
        )}

        {/* Step 1: Email */}
        {step === 1 && (
          <form onSubmit={handleEmailSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-slate-950/50 border border-slate-700/50 text-white placeholder-slate-600 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 outline-none transition-all duration-200"
                placeholder="your.email@example.com"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold shadow-lg shadow-purple-900/20 transform transition-all duration-200 active:scale-[0.98]"
            >
              Send OTP
            </button>
          </form>
        )}

        {/* Step 2: OTP Verification */}
        {step === 2 && (
          <form onSubmit={handleOtpSubmit} className="space-y-6">
            <div className="space-y-4">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest ml-1 block">6-Digit OTP</label>
              
              {/* OTP Input Boxes */}
              <div className="flex justify-center gap-2">
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength="1"
                    value={otp[index] || ''}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      if (value) {
                        const newOtp = otp.split('');
                        newOtp[index] = value;
                        setOtp(newOtp.join(''));
                        
                        // Auto-focus next input
                        if (index < 5 && value) {
                          const nextInput = document.getElementById(`otp-${index + 1}`);
                          nextInput?.focus();
                        }
                      }
                    }}
                    onKeyDown={(e) => {
                      // Allow backspace to focus previous input
                      if (e.key === 'Backspace' && !otp[index] && index > 0) {
                        const prevInput = document.getElementById(`otp-${index - 1}`);
                        prevInput?.focus();
                      }
                    }}
                    id={`otp-${index}`}
                    className="w-12 h-14 rounded-lg bg-slate-950/50 border border-slate-700/50 text-white text-center text-xl font-bold focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/50 outline-none transition-all duration-200"
                    placeholder="•"
                  />
                ))}
              </div>
            </div>

            {otpSent && (
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30 border border-slate-700/50">
                <span className="text-xs text-slate-400">OTP expires in:</span>
                <span className={`text-sm font-mono font-bold ${timeLeft < 60 ? 'text-red-400' : 'text-cyan-400'}`}>
                  {formatTime(timeLeft)}
                </span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold shadow-lg shadow-purple-900/20 transform transition-all duration-200 active:scale-[0.98]"
            >
              Verify OTP
            </button>

            {!otpSent && (
              <button
                type="button"
                onClick={() => {
                  const newOtp = generateOtp();
                  setOtp('');
                  setOtpSent(true);
                  setTimeLeft(300);
                  setSuccess('New OTP sent to your email!');
                  const interval = setInterval(() => {
                    setTimeLeft((prev) => {
                      if (prev <= 1) {
                        clearInterval(interval);
                        setOtpSent(false);
                        return 0;
                      }
                      return prev - 1;
                    });
                  }, 1000);
                }}
                className="w-full py-2 text-sm text-purple-400 hover:text-purple-300 transition-colors border border-purple-500/30 rounded-lg hover:bg-purple-500/10"
              >
                Resend OTP
              </button>
            )}
          </form>
        )}

        {/* Step 3: New Password */}
        {step === 3 && (
          <form onSubmit={handlePasswordSubmit} className="space-y-6">
            {/* New Password */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest ml-1">New Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-slate-950/50 border border-slate-700/50 text-white placeholder-slate-600 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 outline-none transition-all duration-200 pr-10"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? '👁️‍🗨️' : '👁️'}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest ml-1">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-slate-950/50 border border-slate-700/50 text-white placeholder-slate-600 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 outline-none transition-all duration-200 pr-10"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showConfirmPassword ? '👁️‍🗨️' : '👁️'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold shadow-lg shadow-purple-900/20 transform transition-all duration-200 active:scale-[0.98]"
            >
              Reset Password
            </button>
          </form>
        )}

        <div className="mt-8 text-center pt-6 border-t border-white/5">
          <p className="text-slate-500 text-sm">
            Remember your password?{' '}
            <Link to="/login" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
