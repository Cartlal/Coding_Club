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
        <div className="group relative h-96 perspective-1000">
            {/* Flip Container */}
            <div className="relative w-full h-full transition-transform duration-700 transform-style-3d group-hover:rotate-y-180">

                {/* FRONT SIDE - Avatar and Basic Info */}
                <div className="absolute inset-0 backface-hidden rounded-2xl overflow-hidden backdrop-blur-xl bg-gradient-to-br from-slate-800/95 to-slate-900/95 border border-cyan-500/30 shadow-2xl">
                    {/* Avatar Section */}
                    <div className="h-48 flex items-center justify-center relative bg-gradient-to-br from-slate-800/50 to-slate-900/50">
                        <div className={`relative w-28 h-28 rounded-full bg-gradient-to-br ${getRoleColor(role)} p-1 shadow-2xl`}>
                            {image ? (
                                <img src={image} alt={name} className="w-full h-full object-cover rounded-full" />
                            ) : (
                                <div className="w-full h-full rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
                                    <span className="text-5xl">👤</span>
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

                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r ${getRoleColor(role)} text-white font-semibold text-sm shadow-lg mb-3`}>
                            <span>💻</span>
                            {role}
                        </div>

                        <div className="text-cyan-300 text-sm font-medium">
                            {branch}
                        </div>

                        {/* Hover Hint */}
                        <div className="mt-auto pt-4 text-cyan-400/60 text-xs flex items-center gap-2">
                            <span>🔄</span>
                            <span>Hover to see more</span>
                        </div>
                    </div>
                </div>

                {/* BACK SIDE - Full Information */}
                <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-2xl overflow-hidden backdrop-blur-xl bg-gradient-to-br from-slate-800/95 to-slate-900/95 border border-cyan-500/30 shadow-2xl">
                    <div className="h-full flex flex-col p-5 overflow-y-auto custom-scrollbar">
                        {/* Name */}
                        <h3 className="text-lg font-black text-white mb-2">
                            {name}
                        </h3>

                        {/* Role Badge */}
                        <div className={`inline-flex items-center gap-1.5 w-fit mb-3 px-3 py-1.5 rounded-lg bg-gradient-to-r ${getRoleColor(role)} text-white font-semibold text-xs shadow-lg`}>
                            <span className="text-sm">💻</span>
                            {role}
                        </div>

                        {/* Branch Info - Shaped Box */}
                        <div className="relative mb-3 p-2.5 bg-gradient-to-br from-slate-700/40 to-slate-800/40 border border-cyan-500/20 shadow-lg overflow-hidden" style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)' }}>
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
                            <p className="text-cyan-100/70 text-xs mb-3 leading-relaxed">
                                {bio}
                            </p>
                        )}

                        {/* Skills */}
                        {skills.length > 0 && (
                            <div className="mb-3">
                                <p className="text-xs font-bold text-cyan-300 mb-2 uppercase tracking-wider flex items-center gap-2">
                                    <span>⚡</span> Skills
                                </p>
                                <div className="flex flex-wrap gap-1.5">
                                    {skills.slice(0, 4).map((skill, index) => (
                                        <span
                                            key={index}
                                            className="px-2 py-1 bg-slate-700/50 border border-cyan-500/30 text-cyan-200 rounded-lg text-xs font-medium"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                    {skills.length > 4 && (
                                        <span className="px-2 py-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 text-cyan-300 rounded-lg text-xs font-bold">
                                            +{skills.length - 4}
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Email */}
                        <a
                            href={`mailto:${email}`}
                            className="group/email flex items-center gap-2 text-cyan-400 text-xs font-medium hover:text-cyan-300 mt-auto transition-all duration-300 p-2 rounded-lg hover:bg-cyan-500/10 border border-transparent hover:border-cyan-500/30"
                        >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <span className="group-hover/email:underline truncate">{email}</span>
                        </a>
                    </div>
                </div>
            </div>

            {/* Glow effect on hover */}
            <div className={`absolute -inset-0.5 bg-gradient-to-r ${getRoleColor(role)} rounded-2xl opacity-0 group-hover:opacity-50 blur transition-all duration-500 -z-10`} />
        </div>
    );
}
