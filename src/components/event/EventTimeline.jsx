import { getClubColors } from '@/utils/mockEventData';

export default function EventTimeline({ events }) {
    // Sort events by date
    const sortedEvents = [...events].sort((a, b) => new Date(a.date) - new Date(b.date));

    return (
        <div className="relative py-10">
            {/* Vertical Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-cyan-500/0 via-cyan-500/50 to-cyan-500/0 rounded-full" />

            <div className="space-y-20">
                {sortedEvents.map((event, index) => {
                    const isLeft = index % 2 === 0;
                    const colors = getClubColors(event.club);

                    return (
                        <div key={event.id} className={`relative flex items-center justify-between ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}>
                            {/* Empty Space for alignment */}
                            <div className="w-5/12" />

                            {/* Center Node */}
                            <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center">
                                <div className={`w-8 h-8 rounded-full bg-slate-900 border-2 ${colors.border} shadow-[0_0_15px_rgba(6,182,212,0.5)] z-10 flex items-center justify-center`}>
                                    <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${colors.gradient}`} />
                                </div>
                            </div>

                            {/* Content Card */}
                            <div className="w-5/12 group perspective-1000">
                                <div className={`relative transform transition-all duration-500 hover:scale-105 ${isLeft ? 'hover:-translate-x-2' : 'hover:translate-x-2'}`}>
                                    {/* Connection Line */}
                                    <div className={`absolute top-1/2 ${isLeft ? '-right-12' : '-left-12'} w-12 h-[2px] bg-gradient-to-r ${colors.gradient} opacity-50`} />

                                    {/* Card */}
                                    <div className={`relative p-6 rounded-2xl backdrop-blur-xl bg-gradient-to-br from-slate-800/90 to-slate-900/90 border ${colors.border} shadow-xl`}>
                                        {/* Date Badge */}
                                        <div className={`absolute -top-3 ${isLeft ? 'right-4' : 'left-4'} px-3 py-1 rounded-full text-xs font-bold bg-slate-900 border ${colors.border} text-white`}>
                                            {new Date(event.date).toLocaleDateString()}
                                        </div>

                                        <h3 className="text-lg font-bold text-white mb-2">{event.title}</h3>
                                        <p className="text-slate-400 text-sm mb-3 line-clamp-2">{event.description}</p>

                                        <div className="flex items-center gap-2 text-xs">
                                            <span className={`px-2 py-1 rounded-md bg-slate-800 ${colors.text}`}>
                                                {event.club}
                                            </span>
                                            <span className="text-slate-500">•</span>
                                            <span className="text-slate-400">{event.time}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
