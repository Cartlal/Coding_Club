import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    'Quick Links': [
      { name: 'Home', path: '/' },
      { name: 'Events', path: '/events' },
      { name: 'Members', path: '/members' },
      { name: 'Leaderboard', path: '/leaderboard' },
    ],
    Resources: [
      { name: 'Documentation', path: '/coming-soon' },
      { name: 'Blog', path: '/coming-soon' },
      { name: 'FAQ', path: '/coming-soon' },
    ],
    Connect: [
      { name: 'GitHub', path: '/coming-soon' },
      { name: 'Discord', path: '/coming-soon' },
      { name: 'Email', path: '/coming-soon' },
    ],
  };

  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 flex items-center justify-center rounded-full bg-white/10 p-1">
                <img src="/arcstack_logo.png" alt="Logo" className="w-8 h-8 object-contain" />
              </div>
              <span className="text-xl font-bold text-white">
                ArcStack
              </span>
            </div>
            <p className="text-sm text-gray-400">
              A community of developers and coding enthusiasts at KLE.
            </p>
          </div>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-white font-semibold mb-4">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-gray-400 hover:text-primary transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-8">
          {/* Bottom Footer */}
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400">
              &copy; {currentYear} Coding Club at KLE. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link
                to="/coming-soon"
                className="text-gray-400 hover:text-primary transition-colors duration-200"
              >
                Privacy Policy
              </Link>
              <Link
                to="/coming-soon"
                className="text-gray-400 hover:text-primary transition-colors duration-200"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
