import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Events', path: '/events' },
    { name: 'About Us', path: '/about' },
    { name: 'Clusters', path: '/clusters' },
    { name: 'Leaderboard', path: '/leaderboard' },
  ];

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-primary">CC</div>
            <span className="hidden sm:inline text-lg font-semibold text-gray-900 dark:text-white transition-colors duration-300">
              Coding Club
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary font-medium transition-colors duration-200"
              >
                {link.name}
              </Link>
            ))}

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary"
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4.293 2.293a1 1 0 011.414 0l.707.707a1 1 0 11-1.414 1.414l-.707-.707a1 1 0 010-1.414zm2.828 4.828a1 1 0 011.414-1.414l.707.707a1 1 0 11-1.414 1.414l-.707-.707zm0 2.828a1 1 0 011.414 1.414l-.707.707a1 1 0 11-1.414-1.414l.707-.707zm2.828 2.829a1 1 0 011.414-1.415l.707.707a1 1 0 11-1.414 1.414l-.707-.707zm-8.486 2.828a1 1 0 011.414 1.414l-.707.707a1 1 0 11-1.414-1.414l.707-.707zM5.707 5.707a1 1 0 010 1.414L5 7.121a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zm-2.828 4.828a1 1 0 011.414-1.414l.707.707a1 1 0 11-1.414 1.414l-.707-.707zm0 2.828a1 1 0 011.414 1.414l-.707.707a1 1 0 01-1.414-1.414l.707-.707zM3 10a1 1 0 011-1h1a1 1 0 110 2H4a1 1 0 01-1-1zm16 0a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1zm-5-5a1 1 0 100-2 1 1 0 000 2zM10 17a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
              )}
            </button>

            <Link
              to="/login"
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Login
            </Link>
          </div>

          {/* Mobile Menu Button and Theme Toggle */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary"
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4.293 2.293a1 1 0 011.414 0l.707.707a1 1 0 11-1.414 1.414l-.707-.707a1 1 0 010-1.414zm2.828 4.828a1 1 0 011.414-1.414l.707.707a1 1 0 11-1.414 1.414l-.707-.707zm0 2.828a1 1 0 011.414 1.414l-.707.707a1 1 0 11-1.414-1.414l.707-.707zm2.828 2.829a1 1 0 011.414-1.415l.707.707a1 1 0 11-1.414 1.414l-.707-.707zm-8.486 2.828a1 1 0 011.414 1.414l-.707.707a1 1 0 11-1.414-1.414l.707-.707zM5.707 5.707a1 1 0 010 1.414L5 7.121a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zm-2.828 4.828a1 1 0 011.414-1.414l.707.707a1 1 0 11-1.414 1.414l-.707-.707zm0 2.828a1 1 0 011.414 1.414l-.707.707a1 1 0 01-1.414-1.414l.707-.707zM3 10a1 1 0 011-1h1a1 1 0 110 2H4a1 1 0 01-1-1zm16 0a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1zm-5-5a1 1 0 100-2 1 1 0 000 2zM10 17a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
              )}
            </button>

            <button
              onClick={toggleMenu}
              className="flex flex-col space-y-1.5 focus:outline-none"
              aria-label="Toggle menu"
            >
              <span
                className={`w-6 h-0.5 bg-gray-900 dark:bg-white transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-2.5' : ''
                  }`}
              ></span>
              <span
                className={`w-6 h-0.5 bg-gray-900 dark:bg-white transition-all duration-300 ${isOpen ? 'opacity-0' : ''
                  }`}
              ></span>
              <span
                className={`w-6 h-0.5 bg-gray-900 dark:bg-white transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-2.5' : ''
                  }`}
              ></span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2 animate-slideDown">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-primary rounded-lg transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/login"
              className="block px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-center"
              onClick={() => setIsOpen(false)}
            >
              Login
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

