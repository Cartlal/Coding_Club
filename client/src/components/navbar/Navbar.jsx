import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const location = useLocation();

    // Check if user is authenticated
    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsAuthenticated(!!token);
    }, [location]); // Re-check on route change

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Events', path: '/events' },
        { name: 'About Us', path: '/about' },
        { name: 'Clusters', path: '/clusters' },
        { name: 'Leaderboard', path: '/leaderboard' },
    ];

    // Close mobile menu when the route changes
    useEffect(() => {
        setIsOpen(false);
    }, [location.pathname]);

    return (
        <div className="fixed inset-x-0 top-4 z-50 flex justify-center pointer-events-none">
            <header className="w-full max-w-4xl px-4 pointer-events-auto">
                <nav className="rounded-full px-4 py-2 flex items-center justify-between shadow-lg border border-white/10 bg-slate-900/50 backdrop-blur-md">
                    <div className="flex items-center gap-2">
                        <Link to="/" className="flex items-center gap-2">
                            <div className="h-10 w-10 flex items-center justify-center rounded-full bg-white/10 p-1">
                                <img src="/arcstack_logo.png" alt="Logo" className="w-8 h-8 object-contain" />
                            </div>
                            <span className="text-lg font-bold text-white">ArcStack</span>
                        </Link>
                    </div>

                    <div className="hidden md:flex items-center gap-6">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.path}
                                to={link.path}
                                className={({ isActive }) =>
                                    `text-sm font-medium transition-all duration-200 ${isActive
                                        ? 'bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent font-bold'
                                        : 'text-white/80 hover:text-white'
                                    }`
                                }
                            >
                                {link.name}
                            </NavLink>
                        ))}
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            to={isAuthenticated ? "/user/profile" : "/login"}
                            className="group hidden md:inline-block relative px-6 py-2 bg-gradient-to-br from-slate-800/10 to-slate-900/50 border border-cyan-500/30 rounded-lg font-medium text-slate-100 overflow-hidden transition-all duration-300 hover:border-cyan-400/60 hover:scale-105 hover:shadow-xl hover:shadow-cyan-500/10 text-sm"
                        >
                            {/* Button Glow */}
                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            
                            {/* Button Content */}
                            <span className="relative z-10 flex items-center justify-center">{isAuthenticated ? 'Profile' : 'Login'}</span>
                            
                            {/* Bottom Accent Line */}
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </Link>

                        {/* Mobile menu button */}
                        <button
                            onClick={() => setIsOpen((s) => !s)}
                            className="md:hidden flex items-center justify-center w-11 h-11 rounded-lg bg-white/6"
                            aria-label="Toggle navigation"
                            aria-expanded={isOpen}
                        >
                            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {isOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </nav>

                {/* Mobile menu */}
                <div className={`mt-3 md:hidden ${isOpen ? 'block' : 'hidden'}`}>
                    <div className="rounded-2xl shadow-lg overflow-hidden bg-gradient-to-br from-slate-900/40 to-slate-800/40 backdrop-blur-md border border-cyan-500/20 text-white">
                        <div className="flex flex-col p-4">
                            {navLinks.map((link) => (
                                <NavLink
                                    key={link.path}
                                    to={link.path}
                                    onClick={() => setIsOpen(false)}
                                    className={({ isActive }) =>
                                        `block px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 ${isActive
                                            ? 'bg-white/10 text-cyan-400 font-bold'
                                            : 'text-white/90 hover:bg-white/5'
                                        }`
                                    }
                                >
                                    {link.name}
                                </NavLink>
                            ))}

                            <Link
                                to={isAuthenticated ? "/user/profile" : "/login"}
                                onClick={() => setIsOpen(false)}
                                className="group relative mt-3 px-4 py-3 bg-gradient-to-br from-slate-800/10 to-slate-900/50 border border-cyan-500/30 rounded-xl font-medium text-slate-100 overflow-hidden transition-all duration-300 hover:border-cyan-400/60 hover:shadow-lg hover:shadow-cyan-500/10 text-center block"
                            >
                                {/* Button Glow */}
                                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                
                                {/* Button Content */}
                                <span className="relative z-10">{isAuthenticated ? 'Profile' : 'Login'}</span>
                                
                                {/* Bottom Accent Line */}
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </Link>
                        </div>
                    </div>
                </div>
            </header>
        </div>
    );
}
