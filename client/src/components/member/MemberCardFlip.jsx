/**
 * MemberCardFlip Component
 * Tech-enhanced card that flips on hover to reveal member information
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
    github = '#',
    contactNumber = null,
}) {
    console.log('MemberCardFlip image:', image);
    const yearLabel = `Year ${year}`;
    const branchShort = branch
        .split(' ')
        .map((word) => word[0])
        .join('')
        .toUpperCase();

    // Team-based color schemes with tech aesthetics
    const getTeamColors = (role) => {
        // Development Team - Cyan/Blue (primary theme)
        if (role.includes('Development')) return {
            accent: 'cyan',
            gradient: 'from-cyan-400 to-blue-500',
            border: 'border-cyan-400/30',
            glow: 'from-cyan-400 to-blue-500',
            text: 'text-cyan-300',
            bg: 'from-cyan-500/5 to-blue-500/5',
            scroll: 'rgba(83, 234, 253, .5)',
            scrollHover: 'rgba(83, 234, 253, .7)'
        };

        // AI Team - Purple/Indigo
        if (role.includes('AI')) return {
            accent: 'purple',
            gradient: 'from-purple-400 to-indigo-500',
            border: 'border-purple-400/30',
            glow: 'from-purple-400 to-indigo-500',
            text: 'text-purple-300',
            bg: 'from-purple-500/5 to-indigo-500/5',
            scroll: 'rgba(218, 178, 255, .5)',
            scrollHover: 'rgba(218, 178, 255, .7)'
        };

        // Emerging Tech - Emerald/Teal
        if (role.includes('Emerging Tech')) return {
            accent: 'emerald',
            gradient: 'from-emerald-400 to-teal-500',
            border: 'border-emerald-400/30',
            glow: 'from-emerald-400 to-teal-500',
            text: 'text-emerald-300',
            bg: 'from-emerald-500/5 to-teal-500/5',
            scroll: 'rgba(94, 233, 181, .5)',
            scrollHover: 'rgba(94, 233, 181, .7)'
        };

        // Competition Management - Amber/Orange
        if (role.includes('Competition')) return {
            accent: 'amber',
            gradient: 'from-amber-400 to-orange-500',
            border: 'border-amber-400/30',
            glow: 'from-amber-400 to-orange-500',
            text: 'text-amber-300',
            bg: 'from-amber-500/5 to-orange-500/5',
            scroll: 'rgba(255, 210, 48, .5)',
            scrollHover: 'rgba(255, 210, 48, .7)'
        };

        // PR Team - Yellow/Amber
        if (role.includes('PR')) return {
            accent: 'yellow',
            gradient: 'from-yellow-400 to-amber-500',
            border: 'border-yellow-400/30',
            glow: 'from-yellow-400 to-amber-500',
            text: 'text-yellow-300',
            bg: 'from-yellow-500/5 to-amber-500/5',
            scroll: 'rgba(255, 222, 32, 0.5)',
            scrollHover: 'rgba(255, 222, 32, 0.7)'
        };

        // Programming Team - Indigo/Violet
        if (role.includes('Programming')) return {
            accent: 'indigo',
            gradient: 'from-indigo-400 to-violet-500',
            border: 'border-indigo-400/30',
            glow: 'from-indigo-400 to-violet-500',
            text: 'text-indigo-300',
            bg: 'from-indigo-500/5 to-violet-500/5',
            scroll: 'rgba(163, 178, 255, 0.5)',
            scrollHover: 'rgba(163, 178, 255, 0.7)'
        };

        // Media & Design - Rose/Pink
        if (role.includes('Media')) return {
            accent: 'rose',
            gradient: 'from-rose-400 to-pink-500',
            border: 'border-rose-400/30',
            glow: 'from-rose-400 to-pink-500',
            text: 'text-rose-300',
            bg: 'from-rose-500/5 to-pink-500/5',
            scroll: 'rgba(255, 161, 173, 0.5)',
            scrollHover: 'rgba(255, 161, 173, 0.7)'
        };

        // Core Committee & Leads - Cyan/Blue (default)
        return {
            accent: 'cyan',
            gradient: 'from-cyan-400 to-blue-500',
            border: 'border-cyan-400/30',
            glow: 'from-cyan-400 to-blue-500',
            text: 'text-cyan-300',
            bg: 'from-cyan-500/5 to-blue-500/5',
            scroll: 'rgb(83, 234, 253, .5)',
            scrollHover: 'rgb(83, 234, 253, .7)'
        };
    };

    const colors = getTeamColors(role);
    const accent = colors.accent;

    // Extract clean role title
    const getCleanRole = (role) => {
        return role.replace(/\s*\([^)]*\)/g, '').trim();
    };

    const cleanRole = getCleanRole(role);

    // Generate tech ID for member
    const techId = `M${String(id).padStart(3, '0')}`;

    return (
        <div className="group relative h-96 perspective-1000">
            {/* Outer Glow Ring */}
            <div className={`absolute -inset-0.5 bg-gradient-to-br ${colors.gradient} rounded-xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-500 -z-10`} />
            
            {/* Hover Scan Line */}
            <div className="absolute -top-1 left-4 right-4 h-[1px] bg-gradient-to-r from-transparent via-slate-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Flip Container */}
            <div className="relative w-full h-full transition-transform duration-700 transform-style-3d group-hover:rotate-y-180">

                {/* FRONT SIDE - Avatar and Basic Info */}
                <div className={`absolute inset-0 backface-hidden rounded-xl overflow-hidden bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800/60 backdrop-blur-sm group-hover:border-${accent}-400/50 transition-all duration-300`}>
                    {/* Tech Corner Brackets */}
                    <div className="absolute top-3 left-3 w-2 h-2 border-t border-l border-slate-600/50" />
                    <div className="absolute top-3 right-3 w-2 h-2 border-t border-r border-slate-600/50" />
                    <div className="absolute bottom-3 left-3 w-2 h-2 border-b border-l border-slate-600/50" />
                    <div className="absolute bottom-3 right-3 w-2 h-2 border-b border-r border-slate-600/50" />
                    
                    {/* Year Badge */}
                    <div className="absolute top-3 right-3 z-20 backdrop-blur-sm bg-slate-900/80 border border-slate-700/50 text-slate-300 font-medium px-3 py-1 rounded-lg text-xs flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        Year {year}
                    </div>
                    
                    {/* Avatar Section */}
                    <div className="h-48 flex items-center justify-center relative">
                        {/* Tech Pattern Overlay */}
                        <div className="absolute inset-0 opacity-5">
                            <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_49%,#0ea5e9_50%,transparent_51%)] bg-[length:30px_30px]" />
                            <div className="absolute inset-0 bg-[linear-gradient(transparent_49%,#0ea5e9_50%,transparent_51%)] bg-[length:30px_30px]" />
                        </div>
                        
                        {/* Avatar Container */}
                        <div className="relative">
                            {/* Outer Glow Ring */}
                            <div className={`absolute -inset-2 bg-gradient-to-br ${colors.gradient} rounded-full blur opacity-0 group-hover:opacity-60 transition-opacity duration-500`} />
                            
                            {/* Avatar Image with Thick Border */}
                            <div className={`relative w-40 h-40 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 p-2 border-2 border-slate-700/80 overflow-hidden shadow-xl`}>
                                {image ? (
                                    <img 
                                        src={image} 
                                        alt={name} 
                                        className="w-full h-full object-cover object-top rounded-full transform transition-all duration-700 group-hover:scale-110" 
                                    />
                                ) : (
                                    <div className="w-full h-full rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
                                        <svg className="w-12 h-12 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                                        </svg>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Front Content */}
                    <div className="p-6 flex flex-col items-center text-center">
                        {/* Name with Tech Styling */}
                        <div className="relative mb-4">
                            <h3 className="text-2xl font-bold text-white tracking-tight">
                                {name}
                            </h3>
                            <div className="absolute -bottom-2 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
                        </div>

                        {/* Role Badge */}
                        <div className={`relative inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-slate-700/60 group-hover:border-${accent}-400/50 transition-all duration-300 mb-4 mt-2`}>
                            <span className={`text-sm font-semibold text-${accent}-300`}>
                                {cleanRole}
                            </span>
                        </div>

                        {/* Division & Branch Info */}
                        <div className="space-y-2 w-full">
                            <div className="flex items-center justify-center gap-2 text-l font-mono text-slate-400">
                                <span className="text-slate-300 font-semibold">{branch}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* BACK SIDE - Full Information */}
                <div className={`absolute inset-0 backface-hidden rotate-y-180 rounded-xl overflow-hidden bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800/60 backdrop-blur-sm`}>
                    <div className="h-full flex flex-col p-5 overflow-y-auto custom-scrollbar" style={{"--scroll": colors.scroll, "--scrollHover": colors.scrollHover}}>
                        {/* Tech Header */}
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h3 className="text-lg font-bold text-white tracking-tight">
                                    {name}
                                </h3>
                            </div>
                            <div className="px-3 py-1 text-xs font-semibold bg-slate-800/60 text-slate-300 rounded-lg border border-slate-700/60 flex items-center gap-1">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                Year {year}
                            </div>
                        </div>

                        {/* Role Badge */}
                        <div className={`inline-flex items-center gap-2 w-fit mb-4 px-4 py-2 rounded-lg bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-slate-700/60`}>
                            <span className={`text-sm font-semibold text-${accent}-300`}>
                                {cleanRole}
                            </span>
                        </div>

                        {/* Division & Department Info */}
                        <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-2 text-xs text-slate-400">
                                <span className="text-slate-300 font-medium">Branch:</span>
                                <span className="text-slate-300 font-semibold">{branch}</span>
                            </div>        
                        </div>

                        {/* Bio */}
                        {bio && (
                            <div className="mb-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <svg className="w-3 h-3 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">About</span>
                                </div>
                                <p className="text-slate-300/80 text-sm leading-relaxed font-light">
                                    {bio}
                                </p>
                            </div>
                        )}

                        {/* Technologies or Contact Number */}
                        {contactNumber ? (
                            <div className="mb-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <svg className="w-3 h-3 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                    <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">Contact</span>
                                </div>
                                <div className="px-3 py-2 rounded-lg bg-slate-800/60 border border-cyan-400/30 text-cyan-300 font-medium text-sm">
                                    {contactNumber}
                                </div>
                            </div>
                        ) : skills.length > 0 && (
                            <div className="mb-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <svg className="w-3 h-3 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4m-4-4l-4 4m4-4l4-4" /></svg>
                                    <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">Technologies</span>
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                    {skills.map((skill, index) => (
                                        <span
                                            key={index}
                                            className={`px-2 py-1 text-xs font-medium bg-slate-800/60 border border-slate-700/60 text-slate-300 rounded hover:bg-${accent}-500/10 hover:border-${accent}-400/30 hover:text-${accent}-300 transition-all duration-300 cursor-default`}
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Contact & Social Links */}
                        <div className="mt-auto pt-4 border-t border-slate-700/50">
                            {/* Email */}
                            <a
                                href={`mailto:${email}`}
                                className="flex items-center justify-between p-2 text-sm font-mono text-slate-400 hover:text-slate-200 transition-colors duration-300 rounded-lg hover:bg-slate-800/40 mb-2 group/email"
                            >
                                <div className="flex items-center gap-2">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <span className="truncate">{email}</span>
                                </div>
                                <span className="opacity-0 group-hover/email:opacity-100 text-xs text-slate-500">↗</span>
                            </a>

                            {/* Social Media Links */}
                            <div className="flex items-center gap-2">
                                {/* LinkedIn */}
                                {linkedin && linkedin !== '#' && (
                                    <a
                                        href={linkedin}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg bg-slate-800/50 border border-slate-700/60 text-slate-400 hover:text-blue-300 hover:border-blue-400/30 hover:bg-blue-500/10 transition-all duration-300 text-xs font-medium group/linkedin"
                                    >
                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                        </svg>
                                        <span>LinkedIn</span>
                                    </a>
                                )}

                                {/* GitHub */}
                                {github && github !== '#' && (
                                    <a
                                        href={github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg bg-slate-800/50 border border-slate-700/60 text-slate-400 hover:text-slate-100 hover:border-slate-400/30 hover:bg-slate-700/10 transition-all duration-300 text-xs font-medium group/github"
                                    >
                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                        </svg>
                                        <span>GitHub</span>
                                    </a>
                                )}

                                {/* Instagram */}
                                {instagram && instagram !== '#' && (
                                    <a
                                        href={instagram}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg bg-slate-800/50 border border-slate-700/60 text-slate-400 hover:text-pink-300 hover:border-pink-400/30 hover:bg-pink-500/10 transition-all duration-300 text-xs font-medium group/insta"
                                    >
                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
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
        </div>
    );
}