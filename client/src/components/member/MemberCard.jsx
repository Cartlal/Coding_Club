import { Card, Badge } from '@/components/ui';

/**
 * MemberCard Component
 * Displays member information in a card format with social media links
 * 
 * @component
 * @example
 * <MemberCard
 *   id={1}
 *   name="Alice Chen"
 *   role="Full Stack Developer"
 *   branch="Computer Science"
 *   year={4}
 *   email="alice@kle.edu"
 *   skills={['React', 'Node.js']}
 *   bio="Passionate about building scalable web applications"
 *   image="/images/members/alice.jpg"
 *   linkedin="https://linkedin.com/in/alice"
 *   github="https://github.com/alice"
 *   instagram="https://instagram.com/alice"
 * />
 * 
 * @param {number} id - Member ID
 * @param {string} name - Member name
 * @param {string} role - Job role/position
 * @param {string} branch - Academic branch
 * @param {number} year - Year of study (1-4)
 * @param {string} email - Email address
 * @param {Array} skills - Array of skill names
 * @param {string} bio - Short biography
 * @param {string} image - Profile image URL (optional)
 * @param {string} linkedin - LinkedIn profile URL (optional)
 * @param {string} github - GitHub profile URL (optional)
 * @param {string} instagram - Instagram profile URL (optional)
 * @returns {JSX.Element}
 */
export default function MemberCard({
  id,
  name,
  role,
  branch,
  year,
  email,
  skills = [],
  bio = '',
  image = null,
  linkedin = null,
  github = null,
  instagram = null,
}) {
  const yearLabel = `Year ${year}`;
  const branchShort = branch
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase();

  const getRoleColor = (role) => {
    if (role.includes('Frontend')) return 'from-cyan-500 to-blue-600';
    if (role.includes('Backend')) return 'from-purple-500 to-pink-600';
    if (role.includes('Full Stack')) return 'from-green-500 to-teal-600';
    if (role.includes('Mobile')) return 'from-orange-500 to-red-600';
    if (role.includes('DevOps')) return 'from-yellow-500 to-orange-600';
    if (role.includes('Data')) return 'from-indigo-500 to-purple-600';
    if (role.includes('Lead') || role.includes('Chair') || role.includes('Secretary')) return 'from-red-500 to-pink-600';
    if (role.includes('AI') || role.includes('Machine') || role.includes('ML')) return 'from-violet-500 to-purple-600';
    return 'from-cyan-500 to-blue-600';
  };

  const hasSocialLinks = linkedin || github || instagram;

  return (
    <div className="group relative h-full">
      {/* Glow effect on hover */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl opacity-0 group-hover:opacity-75 blur transition-all duration-500" />

      {/* Card */}
      <div className="relative h-full backdrop-blur-xl bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-cyan-500/20 rounded-2xl overflow-hidden transition-all duration-500 group-hover:border-cyan-400/50 group-hover:shadow-2xl group-hover:shadow-cyan-500/20 group-hover:-translate-y-2 flex flex-col">

        {/* Avatar Section with Circular Profile */}
        <div className="h-32 flex items-center justify-center relative bg-gradient-to-br from-slate-800/50 to-slate-900/50">
          {/* Circular Avatar Container */}
          <div className={`relative w-20 h-20 rounded-full bg-gradient-to-br ${getRoleColor(role)} p-1 shadow-2xl transform group-hover:scale-110 transition-all duration-500`}>
            {/* Animated gradient overlay */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {image ? (
              <img 
                src={image} 
                alt={name} 
                className="w-full h-full object-cover object-top rounded-full"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextElementSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div 
              className="w-full h-full rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center"
              style={{display: image ? 'none' : 'flex'}}
            >
              <span className="text-3xl relative z-10 transform group-hover:scale-110 transition-transform duration-500">👤</span>
            </div>
          </div>

          {/* Year Badge */}
          <div className="absolute top-2 right-2 backdrop-blur-md bg-white/20 border border-white/30 text-white font-bold px-3 py-1 rounded-full text-xs shadow-lg">
            {yearLabel}
          </div>
        </div>

        {/* Content Section */}
        <div className="p-5 flex flex-col flex-grow">
          {/* Name with gradient on hover */}
          <h3 className="text-xl font-black text-white mb-2 group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-blue-500 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
            {name}
          </h3>

          {/* Role Badge */}
          <div className={`inline-flex items-center gap-1.5 w-fit mb-3 px-3 py-1.5 rounded-lg bg-gradient-to-r ${getRoleColor(role)} text-white font-semibold text-xs shadow-lg`}>
            <span className="text-sm">💻</span>
            {role}
          </div>

          {/* Branch Info - Shaped Box */}
          <div className="relative mb-3 p-2.5 bg-gradient-to-br from-slate-700/40 to-slate-800/40 border border-cyan-500/20 shadow-lg overflow-hidden" style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)' }}>
            {/* Decorative corner accent */}
            <div className="absolute bottom-0 right-0 w-8 h-8 bg-gradient-to-tl from-cyan-500/20 to-transparent" style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 100%)' }} />

            <div className="flex items-center gap-2 relative z-10">
              <div className={`flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br ${getRoleColor(role)} text-white font-bold text-xs shadow-lg`}>
                {branchShort}
              </div>
              <div>
                <p className="text-xs font-bold text-cyan-300 uppercase tracking-wide">
                  {branch}
                </p>
              </div>
            </div>
          </div>

          {/* Bio */}
          {bio && (
            <p className="text-cyan-100/70 text-sm mb-3 line-clamp-2 flex-grow leading-relaxed">
              {bio}
            </p>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <div className="mb-3">
              <p className="text-xs font-bold text-cyan-300 mb-2 uppercase tracking-wider flex items-center gap-2">
                <span>⚡</span> Skills
              </p>
              <div className="flex flex-wrap gap-2">
                {skills.slice(0, 3).map((skill, index) => (
                  <span
                    key={index}
                    className="px-2.5 py-1 bg-slate-700/50 border border-cyan-500/30 text-cyan-200 rounded-lg text-xs font-medium hover:bg-cyan-500/20 hover:border-cyan-400/50 transition-all duration-300"
                  >
                    {skill}
                  </span>
                ))}
                {skills.length > 3 && (
                  <span className="px-2.5 py-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 text-cyan-300 rounded-lg text-xs font-bold">
                    +{skills.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Social Links */}
          {hasSocialLinks && (
            <div className="flex gap-2 mb-3 justify-center">
              {linkedin && (
                <a
                  href={linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 hover:border-cyan-400/50 transition-all duration-300"
                  title="LinkedIn"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.475-2.236-1.986-2.236-1.081 0-1.722.722-2.004 1.418-.103.249-.129.597-.129.946v5.441h-3.554s.05-8.736 0-9.646h3.554v1.364c.429-.662 1.196-1.608 2.906-1.608 2.108 0 3.689 1.379 3.689 4.338v5.552z"/>
                  </svg>
                </a>
              )}
              {github && (
                <a
                  href={github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 hover:border-cyan-400/50 transition-all duration-300"
                  title="GitHub"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
              )}
              {instagram && (
                <a
                  href={instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 hover:border-cyan-400/50 transition-all duration-300"
                  title="Instagram"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.69.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.015-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.322a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z"/>
                  </svg>
                </a>
              )}
            </div>
          )}

          {/* Email with icon */}
          <a
            href={`mailto:${email}`}
            className="group/email flex items-center gap-2 text-cyan-400 text-xs font-medium hover:text-cyan-300 mt-auto transition-all duration-300 p-2 rounded-lg hover:bg-cyan-500/10 border border-transparent hover:border-cyan-500/30"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="group-hover/email:underline truncate">{email}</span>
          </a>
        </div>

        {/* Bottom accent line */}
        <div className={`h-1 bg-gradient-to-r ${getRoleColor(role)} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />
      </div>
    </div>
  );
}
