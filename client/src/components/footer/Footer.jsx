import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    'Quick Links': [
      { name: 'Home', path: '/' },
      { name: 'Events', path: '/events' },
      { name: 'About Us', path: '/about' },
      { name: 'Our Team', path: '/about#members' },
      { name: 'Clusters', path: '/clusters' },
      { name: 'Leaderboard', path: '/leaderboard' },
    ],
  };

  const socialLinks = [
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/company/arcstack-kle-tech/',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
      color: 'hover:text-blue-500 hover:border-blue-500/50 hover:shadow-blue-500/20'
    },
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/arcstack_kletech?igsh=Y2Zyd3hyN3hwMjJh',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      ),
      color: 'hover:text-pink-500 hover:border-pink-500/50 hover:shadow-pink-500/20'
    },
    {
      name: 'GitHub',
      url: '/coming-soon',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
        </svg>
      ),
      color: 'hover:text-purple-500 hover:border-purple-500/50 hover:shadow-purple-500/20'
    },
  ];

  return (
    <div className="relative mt-24">
      {/* Background Ambience - Enhanced for visibility */}
      <div className="absolute -top-24 inset-x-0 h-24 bg-gradient-to-t from-slate-900/40 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/30 via-cyan-900/30 to-blue-900/30 blur-[100px] -z-10" />

      {/* Premium Glass Footer */}
      <footer className="relative bg-slate-950/60 backdrop-blur-2xl border-t border-white/5 overflow-hidden">
        {/* Animated Top Border Line */}
        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent w-full animate-pulse" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

            {/* Brand Section */}
            <div className="md:col-span-1 space-y-6">
              <div className="flex items-center gap-3 group">
                <div className="relative h-14 w-14 flex items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-white/5 p-2 group-hover:border-cyan-500/30 group-hover:bg-cyan-500/20 transition-all duration-500 ease-out shadow-[0_0_15px_rgba(6,182,212,0.1)] group-hover:shadow-[0_0_25px_rgba(6,182,212,0.3)]">
                  <img src="/arcstack_logo.png" alt="ArcStack Logo" className="w-full h-full object-contain filter drop-shadow-lg" />
                  <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10 group-hover:ring-cyan-400/20" />
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold font-rajdhani bg-gradient-to-r from-white via-cyan-200 to-blue-400 bg-clip-text text-transparent group-hover:to-cyan-400 transition-all duration-300">
                    ArcStack
                  </span>
                  <span className="text-xs font-medium text-blue-400/80 tracking-widest uppercase">Coding Club</span>
                </div>
              </div>
              <p className="text-gray-400/80 leading-relaxed text-sm font-light">
                A community of developers and coding enthusiasts at KLE Technological University, building the future one line of code at a time.
              </p>

              {/* Social Links - Glass Cards */}
              <div className="flex gap-4 pt-2">
                {socialLinks.map((social) => {
                  const LinkComponent = social.url.startsWith('http') ? 'a' : Link;
                  const props = social.url.startsWith('http') ? { href: social.url, target: '_blank', rel: 'noopener noreferrer' } : { to: social.url };

                  return (
                    <LinkComponent
                      key={social.name}
                      {...props}
                      className={`group relative p-3 rounded-xl bg-white/5 border border-white/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${social.color}`}
                      aria-label={social.name}
                    >
                      <div className="relative z-10 text-gray-400 transition-colors duration-300 group-hover:text-inherit">
                        {social.icon}
                      </div>
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </LinkComponent>
                  );
                })}
              </div>
            </div>

            {/* Quick Links with Hover Animation */}
            <div className="md:col-span-1">
              <h3 className="text-white font-rajdhani font-bold text-lg mb-6 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-cyan-500 rounded-full" />
                Quick Links
              </h3>
              <ul className="space-y-3">
                {footerLinks['Quick Links'].map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="group flex items-center text-gray-400 hover:text-white transition-colors duration-300"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-600 mr-3 group-hover:bg-cyan-400 group-hover:scale-125 transition-all duration-300" />
                      <span className="relative overflow-hidden">
                        {link.name}
                        <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-cyan-400 group-hover:w-full transition-all duration-500 ease-out" />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Campus Logo Section - Refined */}
            <div className="md:col-span-2 flex items-center justify-end relative">
              {/* Decorative Glow behind layout */}
              <div className="absolute right-10 top-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none" />

              <div className="relative transition-transform hover:scale-105 duration-700 ease-out">
                <img
                  src="/SHESHAGIRI%20CAMPUS%20LOGO%20PDF%20white.png"
                  alt="Sheshagiri Campus Logo"
                  className="h-full w-full object-contain opacity-60 hover:opacity-100 transition-opacity duration-500 drop-shadow-2xl"
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          {/* Divider & Bottom Footer */}
          <div className="border-t border-white/5 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-sm text-gray-500 font-light text-center md:text-left">
              &copy; {currentYear} <span className="text-cyan-400 font-medium font-rajdhani tracking-wide">ARCSTACK</span>. All rights reserved.
            </p>
            <div className="flex gap-8">
              {['Privacy Policy', 'Terms of Service'].map((item) => (
                <Link
                  key={item}
                  to="/coming-soon"
                  className="text-sm text-gray-500 hover:text-cyan-400 transition-colors duration-300 relative group"
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-cyan-400/50 group-hover:w-full transition-all duration-300" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
