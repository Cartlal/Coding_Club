import { getClubColors } from '@/utils/mockEventData';
import { FaCalendarDays, FaClock, FaTag } from 'react-icons/fa6';

export default function EventTimeline({ events }) {
    // Sort events by date
    const sortedEvents = [...events].sort((a, b) => new Date(a.date) - new Date(b.date));

    return (
        <div className="relative py-16 px-4">
            {/* Top decoration */}
            <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-black text-slate-100 tracking-tighter font-mono mb-2">
                    Event Timeline
                </h2>
                <div className="flex items-center justify-center gap-2">
                    <span className="text-cyan-400 font-mono text-sm">&lt;</span>
                    <span className="text-cyan-400 font-mono text-xs">timeline</span>
                    <span className="text-cyan-400 font-mono text-sm">&gt;</span>
                </div>
            </div>

            {/* Timeline Container */}
            <div className="relative max-w-5xl mx-auto">
                {/* Vertical Line */}
                <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-cyan-500/0 via-cyan-500/50 to-cyan-500/0 rounded-full" />

                <div className="space-y-24">
                    {sortedEvents.map((event, index) => {
                        const isLeft = index % 2 === 0;
                        const colors = getClubColors(event.club);

                        return (
                            <div 
                                key={event.id} 
                                className={`relative flex items-center ${isLeft ? 'justify-start' : 'justify-end'}`}
                                style={{
                                    animation: `slide-in 0.6s ease-out forwards`,
                                    animationDelay: `${index * 0.1}s`,
                                    opacity: 0,
                                }}
                            >
                                {/* Left Side Content (only shows when isLeft) */}
                                {isLeft && (
                                    <div className="w-5/12 pr-16">
                                        <div className="group">
                                            <div className={`relative transform transition-all duration-500 hover:scale-105 hover:-translate-x-2`}>
                                                {/* Connection Line */}
                                                <div className={`absolute top-1/2 -right-12 w-12 h-[2px] bg-gradient-to-r ${colors.gradient} opacity-50 group-hover:opacity-100 transition-opacity duration-500`} />

                                                {/* Card */}
                                                <div className={`relative p-6 rounded-xl bg-slate-900/50 border border-slate-700/50 backdrop-blur-sm group-hover:border-slate-600/70 transition-all duration-300 overflow-hidden shadow-lg`}>
                                                    
                                                    {/* Corner Accents */}
                                                    <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-slate-500/30 group-hover:border-slate-500/70 transition-colors" />
                                                    <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-slate-500/30 group-hover:border-slate-500/70 transition-colors" />
                                                    <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-slate-500/30 group-hover:border-slate-500/70 transition-colors" />
                                                    <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-slate-500/30 group-hover:border-slate-500/70 transition-colors" />

                                                    {/* Accent Line */}
                                                    <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${colors.gradient} opacity-30 group-hover:opacity-100 transition-opacity duration-500`} />

                                                    {/* Date Badge */}
                                                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-slate-800/50 border border-slate-700/50 text-cyan-400 mb-3 group-hover:border-slate-600/70 transition-all`}>
                                                        <FaCalendarDays className="w-3 h-3" />
                                                        {new Date(event.date).toLocaleDateString()}
                                                    </div>

                                                    {/* Title */}
                                                    <h3 className="text-lg font-bold text-slate-100 mb-2 group-hover:text-white transition-colors">
                                                        {event.title}
                                                    </h3>

                                                    {/* Description */}
                                                    <p className="text-slate-400 text-sm mb-4 line-clamp-2 font-light">
                                                        {event.description}
                                                    </p>

                                                    {/* Meta Information */}
                                                    <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
                                                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-800/50 border border-slate-700/50 ${colors.text} group-hover:border-slate-600/70 transition-all`}>
                                                            <FaTag className="w-3 h-3" />
                                                            {event.club}
                                                        </span>
                                                        <span className="text-slate-500">•</span>
                                                        <span className="inline-flex items-center gap-1 text-slate-400">
                                                            <FaClock className="w-3 h-3" />
                                                            {event.time}
                                                        </span>
                                                    </div>

                                                    {/* Tech indicator */}
                                                    <div className="mt-3 text-xs font-mono text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        [{String(index + 1).padStart(2, '0')}]
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Center Node */}
                                <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center z-20">
                                    {/* Outer Ring */}
                                    <div className={`absolute w-12 h-12 rounded-full border-2 ${colors.border} opacity-30 animate-pulse`} />
                                    
                                    {/* Main Node */}
                                    <div className={`w-8 h-8 rounded-full bg-slate-900 border-2 ${colors.border} shadow-[0_0_20px_rgba(6,182,212,0.6)] flex items-center justify-center relative group cursor-pointer`}>
                                        <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${colors.gradient} group-hover:scale-125 transition-transform duration-300`} />
                                        
                                        {/* Tooltip on hover */}
                                        <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-30">
                                            <div className="text-xs font-mono text-cyan-400 bg-slate-900 border border-cyan-400/30 px-2 py-1 rounded">
                                                Event {index + 1}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Side Content (only shows when not isLeft) */}
                                {!isLeft && (
                                    <div className="w-5/12 pl-16">
                                        <div className="group">
                                            <div className={`relative transform transition-all duration-500 hover:scale-105 hover:translate-x-2`}>
                                                {/* Connection Line */}
                                                <div className={`absolute top-1/2 -left-12 w-12 h-[2px] bg-gradient-to-r ${colors.gradient} opacity-50 group-hover:opacity-100 transition-opacity duration-500`} />

                                                {/* Card */}
                                                <div className={`relative p-6 rounded-xl bg-slate-900/50 border border-slate-700/50 backdrop-blur-sm group-hover:border-slate-600/70 transition-all duration-300 overflow-hidden shadow-lg`}>
                                                    
                                                    {/* Corner Accents */}
                                                    <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-slate-500/30 group-hover:border-slate-500/70 transition-colors" />
                                                    <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-slate-500/30 group-hover:border-slate-500/70 transition-colors" />
                                                    <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-slate-500/30 group-hover:border-slate-500/70 transition-colors" />
                                                    <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-slate-500/30 group-hover:border-slate-500/70 transition-colors" />

                                                    {/* Accent Line */}
                                                    <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${colors.gradient} opacity-30 group-hover:opacity-100 transition-opacity duration-500`} />

                                                    {/* Date Badge */}
                                                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-slate-800/50 border border-slate-700/50 text-cyan-400 mb-3 group-hover:border-slate-600/70 transition-all`}>
                                                        <FaCalendarDays className="w-3 h-3" />
                                                        {new Date(event.date).toLocaleDateString()}
                                                    </div>

                                                    {/* Title */}
                                                    <h3 className="text-lg font-bold text-slate-100 mb-2 group-hover:text-white transition-colors">
                                                        {event.title}
                                                    </h3>

                                                    {/* Description */}
                                                    <p className="text-slate-400 text-sm mb-4 line-clamp-2 font-light">
                                                        {event.description}
                                                    </p>

                                                    {/* Meta Information */}
                                                    <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
                                                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-800/50 border border-slate-700/50 ${colors.text} group-hover:border-slate-600/70 transition-all`}>
                                                            <FaTag className="w-3 h-3" />
                                                            {event.club}
                                                        </span>
                                                        <span className="text-slate-500">•</span>
                                                        <span className="inline-flex items-center gap-1 text-slate-400">
                                                            <FaClock className="w-3 h-3" />
                                                            {event.time}
                                                        </span>
                                                    </div>

                                                    {/* Tech indicator */}
                                                    <div className="mt-3 text-xs font-mono text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        [{String(index + 1).padStart(2, '0')}]
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Bottom decoration */}
            <div className="text-center mt-16">
                <div className="flex items-center justify-center gap-2">
                    <span className="text-cyan-400 font-mono text-sm">&lt;/</span>
                    <span className="text-cyan-400 font-mono text-xs">timeline</span>
                    <span className="text-cyan-400 font-mono text-sm">&gt;</span>
                </div>
            </div>

            <style jsx>{`
                @keyframes slide-in {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes pulse {
                    0%, 100% {
                        opacity: 0.5;
                    }
                    50% {
                        opacity: 1;
                    }
                }
            `}</style>
        </div>
    );
}
