import { Link } from 'react-router-dom';

export default function Unauthorized() {
  return (
    <div className="min-h-screen bg-pitch-dark text-white flex items-center justify-center pt-16 pb-10 px-4">
      <div className="text-center max-w-md">
        {/* 403 Icon */}
        <div className="mb-8">
          <div className="text-7xl font-bold text-red-500 mb-4">403</div>
          <h1 className="text-3xl font-bold mb-2">Access Denied</h1>
          <p className="text-slate-400">You don't have permission to access this resource.</p>
        </div>

        {/* Message */}
        <div className="bg-slate-900/50 border border-white/5 rounded-xl p-6 mb-8">
          <p className="text-slate-300">
            Make sure you're logged in with the correct account and have the necessary permissions to access this page.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <Link
            to="/"
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold transition-all"
          >
            Go to Home
          </Link>
          <Link
            to="/login"
            className="px-6 py-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-all border border-white/10"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
