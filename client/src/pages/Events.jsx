import { useState, useMemo } from 'react';
import EventCard from '@/components/event/EventCard';
import EventTimeline from '@/components/event/EventTimeline';
import { mockEvents } from '@/utils/mockEventData';

export default function Events() {
  const [activeTab, setActiveTab] = useState('club-wise'); // 'club-wise' or 'timeline'
  const [selectedClub, setSelectedClub] = useState('All');

  const clubs = ['All', 'Development', 'AI', 'Emerging Tech', 'Competition', 'Programming', 'Media & Design'];

  const filteredEvents = useMemo(() => {
    if (selectedClub === 'All') return mockEvents;
    return mockEvents.filter(event => event.club === selectedClub);
  }, [selectedClub]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden">
      {/* Background Particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
            Events & Workshops
          </h1>
          <p className="text-xl text-cyan-100/70 max-w-2xl mx-auto">
            Discover opportunities to learn, compete, and grow with our community
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex justify-center mb-12">
          <div className="bg-slate-900/50 backdrop-blur-xl border border-cyan-500/30 p-1 rounded-xl flex gap-2">
            <button
              onClick={() => setActiveTab('club-wise')}
              className={`px-6 py-2 rounded-lg font-bold transition-all duration-300 ${activeTab === 'club-wise'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg'
                  : 'text-cyan-100/60 hover:text-white hover:bg-white/5'
                }`}
            >
              Club-wise View
            </button>
            <button
              onClick={() => setActiveTab('timeline')}
              className={`px-6 py-2 rounded-lg font-bold transition-all duration-300 ${activeTab === 'timeline'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg'
                  : 'text-cyan-100/60 hover:text-white hover:bg-white/5'
                }`}
            >
              Timeline View
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="min-h-[600px]">
          {activeTab === 'club-wise' ? (
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
          ) : (
            <div className="animate-fade-in">
              <EventTimeline events={mockEvents} />
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
