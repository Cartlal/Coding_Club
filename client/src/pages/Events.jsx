import { Link, useLocation } from 'react-router-dom';
import { useState, useMemo, useEffect } from 'react';
import EventsList from '@/components/event/EventsList';
import EventTimeline from '@/components/event/EventTimeline';
import { mockEvents } from '@/utils/mockEventData';
import { FaCalendarDays, FaClock, FaClockRotateLeft, FaFilter, FaLayerGroup, FaTimeline } from 'react-icons/fa6';

export default function Events() {
  const location = useLocation();
  const isTimeline = location.pathname === '/event-timeline';
  const activeTab = isTimeline ? 'timeline' : 'club-wise';
  const [eventFilter, setEventFilter] = useState('all');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Filter events based on date
  const filteredEvents = useMemo(() => {
    const now = new Date();
    
    switch (eventFilter) {
      case 'upcoming':
        return mockEvents.filter(event => new Date(event.date) >= now);
      case 'past':
        return mockEvents.filter(event => new Date(event.date) < now);
      default:
        return mockEvents;
    }
  }, [eventFilter]);

  const upcomingCount = mockEvents.filter(event => new Date(event.date) >= new Date()).length;
  const pastCount = mockEvents.filter(event => new Date(event.date) < new Date()).length;

  return (
    <div className="min-h-screen  text-white overflow-hidden">
      {/* Animated Tech Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
       
        
        {/* Glow Effects */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
        
        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-[2px] h-[2px] bg-cyan-400/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${5 + Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      <div className={`relative max-w-7xl mx-auto px-4 pt-28 pb-20 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        {/* Header with Tech Brackets */}
        <div className="text-center mb-16 relative">
          {/* Corner Brackets */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-cyan-400/30" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-cyan-400/30" />
          
          <div className="inline-block relative mb-4">
            
            <h1 className="text-5xl md:text-6xl font-bold mb-4 tracking-tight">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 bg-[length:200%_auto] bg-clip-text text-transparent animate-gradient">
                Events & Workshops
              </span>
            </h1>
          </div>
          
          <p className="text-lg text-slate-400 max-w-2xl mx-auto font-light tracking-wide leading-relaxed">
            Discover opportunities to learn, compete, and grow with our developer community
          </p>
          
          {/* Stats Bar with Filter Buttons */}
          <div className="flex justify-center gap-4 mt-8 text-sm flex-wrap">
            {[
              { id: 'all', label: 'Total', color: 'cyan', icon: FaCalendarDays, count: mockEvents.length },
              { id: 'upcoming', label: 'Upcoming', color: 'green', icon: FaClock, count: upcomingCount },
              { id: 'past', label: 'Past', color: 'purple', icon: FaClockRotateLeft, count: pastCount }
            ].map(stat => {
              const IconComponent = stat.icon;
              const isActive = eventFilter === stat.id;
              const colorMap = {
                cyan: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/50', text: 'text-cyan-400', dot: 'bg-cyan-400' },
                green: { bg: 'bg-green-500/10', border: 'border-green-500/50', text: 'text-green-400', dot: 'bg-green-400' },
                purple: { bg: 'bg-purple-500/10', border: 'border-purple-500/50', text: 'text-purple-400', dot: 'bg-purple-400' }
              };
              const colors = colorMap[stat.color];
              
              return (
                <button
                  key={stat.id}
                  onClick={() => setEventFilter(stat.id)}
                  className={`group relative flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-300 ${
                    isActive
                      ? `${colors.bg} ${colors.border} backdrop-blur-sm`
                      : 'bg-slate-800/30 border-slate-700/50 hover:border-slate-600/70'
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full animate-pulse ${isActive ? colors.dot : 'bg-slate-500'}`} />
                  <span className={`font-mono text-xs font-bold transition-all ${isActive ? colors.text : 'text-slate-400'}`}>
                    {stat.count}
                  </span>
                  <span className={`text-xs transition-all ${isActive ? colors.text : 'text-slate-500'}`}>
                    {stat.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Filter & View Toggle Section */}
        <div className="space-y-8 mb-12">
          {/* View Toggle Only */}
          <div className="flex justify-center">
            <div className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 border border-slate-700/50 p-1 rounded-2xl backdrop-blur-sm">
              <div className="flex gap-1">
                <Link
                  to="/events"
                  className={`group relative flex items-center gap-3 px-6 py-3 rounded-xl transition-all duration-500 overflow-hidden ${
                    activeTab === 'club-wise'
                      ? 'bg-gradient-to-r from-cyan-500/30 to-blue-600/30'
                      : 'hover:bg-slate-800/30'
                  }`}
                >
                  {/* Background Glow */}
                  {activeTab === 'club-wise' && (
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-600/10 animate-pulse-slow" />
                  )}
                  
                  <FaLayerGroup className={`w-5 h-5 transition-all duration-300 ${
                    activeTab === 'club-wise' ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-300'
                  }`} />
                  
                  <span className={`font-medium tracking-wide transition-all duration-300 ${
                    activeTab === 'club-wise' ? 'text-cyan-300' : 'text-slate-300 group-hover:text-slate-100'
                  }`}>
                    Club View
                  </span>
                  
                  {activeTab === 'club-wise' && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 border-t border-r border-cyan-400" />
                  )}
                </Link>

                <Link
                  to="/event-timeline"
                  className={`group relative flex items-center gap-3 px-6 py-3 rounded-xl transition-all duration-500 overflow-hidden ${
                    activeTab === 'timeline'
                      ? 'bg-gradient-to-r from-purple-500/30 to-pink-600/30'
                      : 'hover:bg-slate-800/30'
                  }`}
                >
                  {/* Background Glow */}
                  {activeTab === 'timeline' && (
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-600/10 animate-pulse-slow" />
                  )}
                  
                  <FaTimeline className={`w-5 h-5 transition-all duration-300 ${
                    activeTab === 'timeline' ? 'text-purple-400' : 'text-slate-400 group-hover:text-slate-300'
                  }`} />
                  
                  <span className={`font-medium tracking-wide transition-all duration-300 ${
                    activeTab === 'timeline' ? 'text-purple-300' : 'text-slate-300 group-hover:text-slate-100'
                  }`}>
                    Timeline
                  </span>
                  
                  {activeTab === 'timeline' && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 border-t border-r border-purple-400" />
                  )}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Events Count & Status */}
        <div className="flex flex-col items-center mb-8">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-lg bg-slate-900/50 border border-slate-700/50 backdrop-blur-sm mb-3">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                filteredEvents.length > 0 ? 'bg-green-400 animate-pulse' : 'bg-amber-400'
              }`} />
              <span className="text-sm font-mono text-slate-300">
                Showing <span className="text-cyan-400 font-bold">{filteredEvents.length}</span> event{filteredEvents.length !== 1 ? 's' : ''}
              </span>
            </div>
            {eventFilter !== 'all' && (
              <div className="text-xs text-slate-500 font-mono px-2 py-1 rounded bg-slate-800/50">
                Filter: {eventFilter}
              </div>
            )}
          </div>
          
          {/* View Mode Indicator */}
          <div className="text-xs font-mono text-slate-500 flex items-center gap-2">
            <span className="text-cyan-400/60">$</span>
            <span>View Mode:</span>
            <span className={`px-2 py-0.5 rounded ${activeTab === 'club-wise' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-purple-500/20 text-purple-400'}`}>
              {activeTab === 'club-wise' ? 'CLUB_WISE' : 'TIMELINE'}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="min-h-[600px]">
          {activeTab === 'club-wise' ? (
            <EventsList events={filteredEvents} />
          ) : (
            <div className="animate-fade-in">
              {filteredEvents.length > 0 ? (
                <EventTimeline events={filteredEvents} />
              ) : (
                <div className="flex flex-col items-center justify-center h-96 text-center p-8">
                  <h3 className="text-xl font-semibold text-slate-300 mb-2">No Events Found</h3>
                  <p className="text-slate-500 font-mono max-w-md">
                    No {eventFilter !== 'all' ? eventFilter : ''} events match your criteria.
                    <span className="block mt-2 text-slate-400 text-sm">Try changing the filter or check back later.</span>
                  </p>
                </div>
              )}
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
        
        @keyframes grid-flow-x {
          0% { background-position-x: 0px; }
          100% { background-position-x: 80px; }
        }
        
        @keyframes grid-flow-y {
          0% { background-position-y: 0px; }
          100% { background-position-y: 80px; }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          10% { opacity: 0.3; }
          50% {
            opacity: 0.1;
            transform: translateY(-20px) translateX(10px);
          }
          90% { opacity: 0.3; }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.2; }
        }
        
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .animate-grid-flow-x {
          animation: grid-flow-x 30s linear infinite;
        }
        
        .animate-grid-flow-y {
          animation: grid-flow-y 40s linear infinite;
        }
        
        .animate-float {
          animation: float var(--duration) ease-in-out infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        
        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}