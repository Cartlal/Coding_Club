import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

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
                            <span className="hidden sm:inline text-lg font-bold text-white">ArcStack</span>
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
                            to="/login"
                            className="hidden md:inline-block px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 text-sm shadow-md"
                        >
                            Login
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
                    <div className="rounded-2xl shadow-md overflow-hidden bg-gradient-to-r from-primary/25 to-secondary/25 backdrop-blur-md border border-white/10 text-white">
                        <div className="flex flex-col p-3">
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
                                to="/login"
                                onClick={() => setIsOpen(false)}
                                className="mt-2 px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl text-center shadow-lg"
                            >
                                Login
                            </Link>
                        </div>
                    </div>
                </div>
            </header>
        </div>
    );
}
