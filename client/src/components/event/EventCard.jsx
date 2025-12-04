import { Link } from 'react-router-dom';
import { getClubColors } from '@/utils/mockEventData';

export default function EventCard({ event }) {
  const colors = getClubColors(event.club);

  const colorMap = {
    'Coding Club': { accent: 'cyan' },
    'Web Dev': { accent: 'blue' },
    'AI/ML': { accent: 'purple' },
    'Cybersecurity': { accent: 'green' },
    'Game Dev': { accent: 'orange' },
    'Hardware': { accent: 'red' },
  };

  const accent = colorMap[event.club]?.accent || 'cyan';

  return (
    <div className="group relative h-full">
      {/* Outer Glow Ring */}
      <div className={`absolute -inset-0.5 bg-gradient-to-br from-${accent}-500/10 to-${accent}-600/10 rounded-xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-500`} />
      
      {/* Hover Scan Line */}
      <div className="absolute -top-1 left-4 right-4 h-[1px] bg-gradient-to-r from-transparent via-slate-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Card */}
      <div className="relative h-full flex flex-col bg-gradient-to-br from-slate-900/20 to-slate-800/20 border border-slate-700/50 rounded-xl overflow-hidden group-hover:border-slate-600/70 transition-all duration-300">
        
        {/* Corner Brackets */}
        <div className="absolute top-3 left-3 w-2 h-2 border-t border-l border-slate-500/50 z-20" />
        <div className="absolute top-3 right-3 w-2 h-2 border-t border-r border-slate-500/50 z-20" />
        <div className="absolute bottom-3 left-3 w-2 h-2 border-b border-l border-slate-500/50 z-20" />
        <div className="absolute bottom-3 right-3 w-2 h-2 border-b border-r border-slate-500/50 z-20" />
        
        {/* Image Section */}
        <div className="relative h-48 overflow-hidden">
          {/* Tech Grid Overlay */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_49%,#0ea5e9_50%,transparent_51%)] bg-[length:20px_20px]" />
            <div className="absolute inset-0 bg-[linear-gradient(transparent_49%,#0ea5e9_50%,transparent_51%)] bg-[length:20px_20px]" />
          </div>
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/40 to-transparent z-10" />
          
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover transform transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
          />

          {/* Club Badge */}
          <div className="absolute top-4 right-4 z-20">
            <div className={`relative px-3 py-1 rounded-lg text-xs font-medium text-white bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-sm border border-${accent}-400/30 group-hover:border-${accent}-400/50 transition-all duration-300`}>
              {event.club}
              <div className={`absolute -bottom-0.5 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-${accent}-400 to-${accent}-500/50`} />
            </div>
          </div>

          {/* Category Badge */}
          <div className="absolute top-4 left-4 z-20">
            <div className="relative px-3 py-1 rounded-lg text-xs font-medium text-slate-300 bg-slate-900/70 backdrop-blur-sm border border-slate-600/50">
              <span className="text-slate-400 mr-1">#</span>
              {event.category}
            </div>
          </div>
          
          {/* Tech Pattern */}
          <div className="absolute bottom-4 right-4 z-20 opacity-20">
            <div className="text-xs font-mono text-slate-300">{`[${event.date.split('-')[0].slice(-2)}]`}</div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-5 flex-1 flex flex-col">
          {/* Date & Time */}
          <div className="flex items-center gap-4 text-xs font-mono text-slate-400 mb-3">
            <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-800/50">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-800/50">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{event.time}</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold text-slate-100 mb-3 group-hover:text-slate-50 transition-colors tracking-tight">
            {event.title}
          </h3>

          {/* Description */}
          <p className="text-slate-400 text-sm mb-4 line-clamp-2 flex-1 leading-relaxed font-light">
            {event.description}
          </p>

          {/* Metadata */}
          <div className="mt-auto pt-4 border-t border-slate-700/50">
            <div className="flex items-center justify-between">
              {/* Location */}
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{event.location}</span>
              </div>
              
              {/* Attendees with Status */}
              <div className="flex items-center gap-2">
                <div className="flex items-center -space-x-1">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className={`w-4 h-4 rounded-full border border-slate-800 bg-gradient-to-br from-${accent}-500/30 to-${accent}-600/30`}
                    />
                  ))}
                </div>
                <div className={`text-xs font-medium text-${accent}-400`}>
                  <span className="font-mono">{event.attendees}</span>
                  <span className="text-slate-400">+</span>
                </div>
              </div>
            </div>
            
          </div>
        </div>
        
        {/* Hover Indicator */}
        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex items-center gap-1">
            {[1, 2, 3].map((dot) => (
              <div
                key={dot}
                className={`w-1 h-1 bg-${accent}-400/70 rounded-full animate-pulse`}
                style={{ animationDelay: `${dot * 0.1}s` }}
              />
            ))}
          </div>
        </div>
        
        {/* Bottom Accent Line */}
        <div 
          className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-${accent}-400/0 via-${accent}-400/30 to-${accent}-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
        />
      </div>
    </div>
  );
}