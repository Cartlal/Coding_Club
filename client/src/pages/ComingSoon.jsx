import { Link } from 'react-router-dom';

export default function ComingSoon() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-center px-4">
            <div className="text-center max-w-2xl">
                <div className="text-6xl mb-6 animate-bounce">🚧</div>
                <h1 className="text-4xl md:text-6xl font-black mb-6 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                    Coming Soon
                </h1>
                <p className="text-xl text-slate-400 mb-8">
                    We are working hard to bring you this feature. Stay tuned for updates!
                </p>
                <Link
                    to="/"
                    className="inline-block px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-lg shadow-lg hover:shadow-cyan-500/25 transform transition-all duration-300 hover:scale-105"
                >
                    Back to Home
                </Link>
            </div>
        </div>
    );
}
