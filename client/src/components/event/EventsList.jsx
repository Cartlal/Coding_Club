import { useState, useMemo } from 'react';
import EventCard from '@/components/event/EventCard';
import { mockEvents } from '@/utils/mockEventData';

export default function EventsList() {
    const [selectedClub, setSelectedClub] = useState('All');
    const clubs = ['All', 'Development', 'AI', 'Emerging Tech', 'Competition', 'Programming', 'Media & Design'];

    const filteredEvents = useMemo(() => {
        if (selectedClub === 'All') return mockEvents;
        return mockEvents.filter(event => event.club === selectedClub);
    }, [selectedClub]);

    return (
        <div className="animate-fade-in">
            {/* Club Filter */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
                {clubs.map((club) => (
                    <button
                        key={club}
                        onClick={() => setSelectedClub(club)}
                        className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-300 ${selectedClub === club
                            ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                            : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-cyan-500/50 hover:text-cyan-200'
                            }`}
                    >
                        {club}
                    </button>
                ))}
            </div>

            {/* Events Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                ))}
            </div>

            {filteredEvents.length === 0 && (
                <div className="text-center py-20">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-2xl font-bold text-white mb-2">No Events Found</h3>
                    <p className="text-slate-400">Try selecting a different club or category</p>
                </div>
            )}
        </div>
    );
}
