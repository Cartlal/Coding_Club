import { Link, useLocation } from 'react-router-dom';
import EventsList from '@/components/event/EventsList';
import EventTimeline from '@/components/event/EventTimeline';
import { mockEvents } from '@/utils/mockEventData';

export default function Events() {
  const location = useLocation();
  const isTimeline = location.pathname === '/event-timeline';
  const activeTab = isTimeline ? 'timeline' : 'club-wise';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden">
      {/* Background Particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 pt-32 pb-20">
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
              <Link
                to="/events"
                className={`px-6 py-2 rounded-lg font-bold transition-all duration-300 ${activeTab === 'club-wise'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg'
                  : 'text-cyan-100/60 hover:text-white hover:bg-white/5'
                  }`}
              >
                Club-wise View
              </Link>

              <Link
                to="/event-timeline"
                className={`px-6 py-2 rounded-lg font-bold transition-all duration-300 ${activeTab === 'timeline'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg'
                  : 'text-cyan-100/60 hover:text-white hover:bg-white/5'
                  }`}
              >
                Timeline View
              </Link>
            </div>
          </div>

        {/* Content */}
        <div className="min-h-[600px]">
          {activeTab === 'club-wise' ? (
            <EventsList />
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
