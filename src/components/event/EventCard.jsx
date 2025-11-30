import { Link } from 'react-router-dom';
import { getClubColors } from '@/utils/mockEventData';

export default function EventCard({ event }) {
  const colors = getClubColors(event.club);

  return (
    <div className="group relative perspective-1000 h-full">
      {/* 3D Transform Container */}
      <div className="relative h-full transform transition-all duration-500 group-hover:scale-[1.02] group-hover:-translate-y-2">
        {/* Glow Effect */}
        <div className={`absolute -inset-0.5 bg-gradient-to-r ${colors.gradient} rounded-2xl opacity-0 group-hover:opacity-75 blur-xl transition-all duration-500`} />

        {/* Card Content */}
        <div className={`relative h-full flex flex-col backdrop-blur-xl bg-gradient-to-br from-slate-800/90 to-slate-900/90 border ${colors.border} rounded-2xl overflow-hidden shadow-2xl`}>
          {/* Image Section */}
          <div className="relative h-48 overflow-hidden">
            <div className={`absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent z-10`} />
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
            />

            {/* Club Badge */}
            <div className={`absolute top-4 right-4 z-20 px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${colors.gradient} shadow-lg`}>
              {event.club}
            </div>

            {/* Category Badge */}
            <div className="absolute top-4 left-4 z-20 px-3 py-1 rounded-full text-xs font-bold text-white bg-slate-900/50 backdrop-blur-md border border-white/10">
              {event.category}
            </div>
          </div>

          {/* Content Section */}
          <div className="p-6 flex-1 flex flex-col">
            {/* Date & Time */}
            <div className="flex items-center gap-4 text-xs font-medium text-cyan-100/60 mb-3">
              <div className="flex items-center gap-1.5">
                <span>📅</span>
                <span>{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span>⏰</span>
                <span>{event.time}</span>
              </div>
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
              {event.title}
            </h3>

            {/* Description */}
            <p className="text-slate-400 text-sm mb-4 line-clamp-2 flex-1">
              {event.description}
            </p>

            {/* Footer Info */}
            <div className="mt-auto pt-4 border-t border-slate-700/50 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>📍 {event.location}</span>
              </div>
              <div className={`text-xs font-bold ${colors.text}`}>
                {event.attendees}+ Registered
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
