/**
 * MemberCardFlip Component
 * Card that flips on hover to reveal member information
 */
export default function MemberCardFlip({
    id,
    name,
    role,
    branch,
    year,
    email,
    skills = [],
    bio = '',
    image = null,
    linkedin = '#',
    instagram = '#',
}) {
    console.log('MemberCardFlip image:', image);
    const yearLabel = `Year ${year}`;
    const branchShort = branch
        .split(' ')
        .map((word) => word[0])
        .join('')
        .toUpperCase();

    // Team-based color schemes
    const getTeamColors = (role) => {
        // Development Team - Cyan/Blue (primary theme)
        if (role.includes('Development')) return {
            gradient: 'from-cyan-500 to-blue-600',
            border: 'border-cyan-500/30',
            glow: 'from-cyan-500 to-blue-600',
            text: 'text-cyan-300'
        };

        // AI Team - Purple/Pink
        if (role.includes('AI')) return {
            gradient: 'from-purple-500 to-pink-600',
            border: 'border-purple-500/30',
            glow: 'from-purple-500 to-pink-600',
            text: 'text-purple-300'
        };

        // Emerging Tech - Green/Teal
        if (role.includes('Emerging Tech')) return {
            gradient: 'from-green-500 to-teal-600',
            border: 'border-green-500/30',
            glow: 'from-green-500 to-teal-600',
            text: 'text-green-300'
        };

        // Competition Management - Orange/Red
        if (role.includes('Competition')) return {
            gradient: 'from-orange-500 to-red-600',
            border: 'border-orange-500/30',
            glow: 'from-orange-500 to-red-600',
            text: 'text-orange-300'
        };

        // PR Team - Yellow/Amber
        if (role.includes('PR')) return {
            gradient: 'from-yellow-500 to-amber-600',
            border: 'border-yellow-500/30',
            glow: 'from-yellow-500 to-amber-600',
            text: 'text-yellow-300'
        };

        // Programming Team - Indigo/Violet
        if (role.includes('Programming')) return {
            gradient: 'from-indigo-500 to-violet-600',
            border: 'border-indigo-500/30',
            glow: 'from-indigo-500 to-violet-600',
            text: 'text-indigo-300'
        };

        // Media & Design - Rose/Fuchsia
        if (role.includes('Media')) return {
            gradient: 'from-rose-500 to-fuchsia-600',
            border: 'border-rose-500/30',
            glow: 'from-rose-500 to-fuchsia-600',
            text: 'text-rose-300'
        };

        // Core Committee & Leads - Cyan/Blue (default)
        return {
            gradient: 'from-cyan-500 to-blue-600',
            border: 'border-cyan-500/30',
            glow: 'from-cyan-500 to-blue-600',
            text: 'text-cyan-300'
        };
    };

    const colors = getTeamColors(role);

    // Extract clean role title (remove team name in parentheses)
    const getCleanRole = (role) => {
        // Remove text in parentheses like "(Development Team)", "(AI Team)", etc.
        return role.replace(/\s*\([^)]*\)/g, '').trim();
    };

    const cleanRole = getCleanRole(role);

    return (
        <div className="group relative h-96 perspective-1000">
            {/* Flip Container */}
            <div className="relative w-full h-full transition-transform duration-700 transform-style-3d group-hover:rotate-y-180">

                {/* FRONT SIDE - Avatar and Basic Info */}
                <div className={`absolute inset-0 backface-hidden rounded-2xl overflow-hidden backdrop-blur-xl bg-gradient-to-br from-slate-800/95 to-slate-900/95 border ${colors.border} shadow-2xl`}>
                    {/* Avatar Section */}
                    <div className="h-48 flex items-center justify-center relative bg-gradient-to-br from-slate-800/50 to-slate-900/50">
                        <div className={`relative w-40 h-40 rounded-full bg-gradient-to-br ${colors.gradient} p-1 shadow-2xl`}>
                            {image ? (
                                <img src={image} alt={name} className="w-full h-full object-cover object-top rounded-full" />
                            ) : (
                                <div className="w-full h-full rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
                                    <span className="text-6xl">👤</span>
                                </div>
                            )}
                        </div>

                        {/* Year Badge */}
                        <div className="absolute top-3 right-3 backdrop-blur-md bg-white/20 border border-white/30 text-white font-bold px-3 py-1.5 rounded-full text-xs shadow-lg">
                            {yearLabel}
                        </div>
                    </div>

                    {/* Front Content */}
                    <div className="p-5 flex flex-col items-center text-center">
                        <h3 className="text-2xl font-black text-white mb-3">
                            {name}
                        </h3>

                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r ${colors.gradient} text-white font-semibold text-sm shadow-lg mb-3`}>
                            <span>💻</span>
                            {cleanRole}
                        </div>

                        <div className="text-cyan-300 text-sm font-medium">
                            {branch}
                        </div>
                    </div>
                </div>

                {/* BACK SIDE - Full Information */}
                <div className={`absolute inset-0 backface-hidden rotate-y-180 rounded-2xl overflow-hidden backdrop-blur-xl bg-gradient-to-br from-slate-800/95 to-slate-900/95 border ${colors.border} shadow-2xl`}>
                    <div className="h-full flex flex-col p-5 overflow-y-auto custom-scrollbar">
                        {/* Name */}
                        <h3 className="text-lg font-black text-white mb-2">
                            {name}
                        </h3>

                        {/* Role Badge */}
                        <div className={`inline-flex items-center gap-1.5 w-fit mb-2 px-3 py-1.5 rounded-lg bg-gradient-to-r ${colors.gradient} text-white font-semibold text-xs shadow-lg`}>
                            <span className="text-sm">💻</span>
                            {cleanRole}
                        </div>

                        {/* Department & Year Info */}
                        <div className="flex items-center justify-center gap-3 mb-3 text-xs">
                            <div className="flex items-center gap-1 text-cyan-200/80">
                                <span>🎓</span>
                                <span>{branch}</span>
                            </div>
                            <div className="w-1 h-1 rounded-full bg-cyan-400/50"></div>
                            <div className="flex items-center gap-1 text-cyan-200/80">
                                <span>📅</span>
                                <span>Year {year}</span>
                            </div>
                        </div>

                        {/* Bio */}
                        {bio && (
                            <p className="text-cyan-100/70 text-xs mb-3 leading-relaxed">
                                {bio}
                            </p>
                        )}

                        {/* Core Technologies */}
                        {skills.length > 0 && (
                            <div className="mb-3">
                                <p className={`text-xs font-bold ${colors.text} mb-2 uppercase tracking-wider flex items-center justify-center gap-2`}>
                                    <span>🚀</span> Core Technologies
                                </p>
                                <div className="flex flex-wrap gap-1.5 justify-center">
                                    {skills.map((skill, index) => (
                                        <span
                                            key={index}
                                            className={`px-2 py-1 bg-slate-700/50 border ${colors.border} text-cyan-200 rounded-md text-xs font-medium hover:bg-slate-600/50 transition-colors`}
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Contact & Social Links */}
                        <div className="mt-auto pt-3 border-t border-slate-700/50">
                            {/* Email */}
                            <a
                                href={`mailto:${email}`}
                                className="flex items-center justify-center gap-2 text-cyan-400 text-xs font-medium hover:text-cyan-300 transition-all duration-300 p-2 rounded-lg hover:bg-cyan-500/10 mb-2"
                            >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <span className="truncate text-xs">{email}</span>
                            </a>

                            {/* Social Media Links */}
                            <div className="flex items-center justify-center gap-3">
                                {/* LinkedIn */}
                                {linkedin && linkedin !== '#' && (
                                    <a
                                        href={linkedin}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-700/40 border ${colors.border} text-cyan-200 hover:bg-blue-600/30 hover:border-blue-400/50 transition-all duration-300 text-xs font-medium`}
                                        title="LinkedIn Profile"
                                    >
                                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                        </svg>
                                        <span>LinkedIn</span>
                                    </a>
                                )}

                                {/* Instagram */}
                                {instagram && instagram !== '#' && (
                                    <a
                                        href={instagram}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-700/40 border ${colors.border} text-cyan-200 hover:bg-pink-600/30 hover:border-pink-400/50 transition-all duration-300 text-xs font-medium`}
                                        title="Instagram Profile"
                                    >
                                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                        </svg>
                                        <span>Instagram</span>
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Glow effect on hover */}
            <div className={`absolute -inset-0.5 bg-gradient-to-r ${colors.glow} rounded-2xl opacity-0 group-hover:opacity-50 blur transition-all duration-500 -z-10`} />
        </div>
    );
}
