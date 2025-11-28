import { Card, Badge } from '@/components/ui';

/**
 * MemberCard Component
 * Displays member information in a card format
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
    return 'from-cyan-500 to-blue-600';
  };

  return (
    <div className="group relative h-full">
      {/* Glow effect on hover */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl opacity-0 group-hover:opacity-75 blur transition-all duration-500" />

      {/* Card */}
      <div className="relative h-full backdrop-blur-xl bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-cyan-500/20 rounded-2xl overflow-hidden transition-all duration-500 group-hover:border-cyan-400/50 group-hover:shadow-2xl group-hover:shadow-cyan-500/20 group-hover:-translate-y-2">

        {/* Avatar Section with Circular Profile */}
        <div className="h-32 flex items-center justify-center relative bg-gradient-to-br from-slate-800/50 to-slate-900/50">
          {/* Circular Avatar Container */}
          <div className={`relative w-20 h-20 rounded-full bg-gradient-to-br ${getRoleColor(role)} p-1 shadow-2xl transform group-hover:scale-110 transition-all duration-500`}>
            {/* Animated gradient overlay */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {image ? (
              <img src={image} alt={name} className="w-full h-full object-cover rounded-full" />
            ) : (
              <div className="w-full h-full rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
                <span className="text-3xl relative z-10 transform group-hover:scale-110 transition-transform duration-500">👤</span>
              </div>
            )}
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

          {/* Email with icon */}
          <a
            href={`mailto:${email}`}
            className="group/email flex items-center gap-2 text-cyan-400 text-xs font-medium hover:text-cyan-300 mt-auto transition-all duration-300 p-2 rounded-lg hover:bg-cyan-500/10 border border-transparent hover:border-cyan-500/30"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="group-hover/email:underline">{email}</span>
          </a>
        </div>

        {/* Bottom accent line */}
        <div className={`h-1 bg-gradient-to-r ${getRoleColor(role)} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />
      </div>
    </div>
  );
}
