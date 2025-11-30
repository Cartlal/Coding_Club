import { useState, useMemo } from 'react';
import { mockLeaderboard } from '@/utils/mockLeaderboardData';
import { mockEvents } from '@/utils/mockEventData';

export default function Leaderboard() {
  const [filters, setFilters] = useState({
    year: 'All',
    department: 'All',
    division: 'All',
    cluster: 'All',
    event: 'All',
  });

  // Extract unique values for filters
  const uniqueYears = ['All', ...new Set(mockLeaderboard.map(p => p.year))].sort();
  const uniqueDepartments = ['All', ...new Set(mockLeaderboard.map(p => p.department))].sort();
  const uniqueDivisions = ['All', ...new Set(mockLeaderboard.map(p => p.division))].sort();
  const uniqueClusters = ['All', ...new Set(mockLeaderboard.map(p => p.cluster))].sort();
  const uniqueEvents = ['All', ...mockEvents.map(e => e.title)];

  const filteredData = useMemo(() => {
    return mockLeaderboard.filter(player => {
      return (
        (filters.year === 'All' || player.year === filters.year) &&
        (filters.department === 'All' || player.department === filters.department) &&
        (filters.division === 'All' || player.division === filters.division) &&
        (filters.cluster === 'All' || player.cluster === filters.cluster) &&
        (filters.event === 'All' || player.events.includes(filters.event))
      );
    }).sort((a, b) => b.points - a.points); // Ensure sorted by points
  }, [filters]);

  // Re-calculate ranks based on filtered data
  const rankedData = filteredData.map((player, index) => ({
    ...player,
    rank: index + 1
  }));

  const top3 = rankedData.slice(0, 3);
  const rest = rankedData.slice(3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden">
      {/* Background Particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 animate-pulse" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 pt-32 pb-20">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600 bg-clip-text text-transparent">
            Leaderboard
          </h1>
          <p className="text-xl text-slate-400">
            Celebrating our top performers and contributors
          </p>
        </div>

        {/* Filters */}
        <div className="mb-12 p-6 rounded-2xl bg-slate-800/50 backdrop-blur-xl border border-white/10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { label: 'Year', key: 'year', options: uniqueYears },
              { label: 'Department', key: 'department', options: uniqueDepartments },
              { label: 'Division', key: 'division', options: uniqueDivisions },
              { label: 'Cluster', key: 'cluster', options: uniqueClusters },
              { label: 'Event', key: 'event', options: uniqueEvents },
            ].map((filter) => (
              <div key={filter.key} className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {filter.label}
                </label>
                <select
                  value={filters[filter.key]}
                  onChange={(e) => setFilters(prev => ({ ...prev, [filter.key]: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg bg-slate-900/80 border border-slate-700 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all"
                >
                  {filter.options.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>

        {/* Podium Section (Only if filters allow showing top 3) */}
        {top3.length > 0 && (
          <div className="flex flex-wrap justify-center items-end gap-8 mb-20 min-h-[300px]">
            {/* 2nd Place */}
            {top3[1] && (
              <div className="relative group w-64 order-1 md:order-none">
                <div className="absolute inset-0 bg-slate-400/20 blur-2xl rounded-full" />
                <div className="relative flex flex-col items-center">
                  <div className="w-24 h-24 rounded-full border-4 border-slate-400 overflow-hidden mb-4 shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                    <img src={top3[1].avatar} alt={top3[1].name} className="w-full h-full object-cover" />
                  </div>
                  <div className="w-full bg-gradient-to-t from-slate-800 to-slate-700 rounded-t-2xl p-6 text-center border-t-4 border-slate-400 h-48 flex flex-col justify-end shadow-2xl">
                    <div className="text-3xl font-bold text-slate-300 mb-1">2nd</div>
                    <div className="text-xl font-bold text-white truncate">{top3[1].name}</div>
                    <div className="text-slate-400 font-mono">{top3[1].points} pts</div>
                  </div>
                </div>
              </div>
            )}

            {/* 1st Place */}
            {top3[0] && (
              <div className="relative group w-72 order-first md:order-none -mt-12 z-10">
                <div className="absolute inset-0 bg-yellow-500/20 blur-3xl rounded-full" />
                <div className="relative flex flex-col items-center">
                  <div className="absolute -top-16 text-6xl animate-bounce">👑</div>
                  <div className="w-32 h-32 rounded-full border-4 border-yellow-400 overflow-hidden mb-4 shadow-xl transform group-hover:scale-110 transition-transform duration-300">
                    <img src={top3[0].avatar} alt={top3[0].name} className="w-full h-full object-cover" />
                  </div>
                  <div className="w-full bg-gradient-to-t from-slate-800 to-slate-700 rounded-t-2xl p-8 text-center border-t-4 border-yellow-400 h-64 flex flex-col justify-end shadow-2xl">
                    <div className="text-4xl font-bold text-yellow-400 mb-1">1st</div>
                    <div className="text-2xl font-bold text-white truncate">{top3[0].name}</div>
                    <div className="text-yellow-200/80 font-mono text-lg">{top3[0].points} pts</div>
                  </div>
                </div>
              </div>
            )}

            {/* 3rd Place */}
            {top3[2] && (
              <div className="relative group w-64 order-2 md:order-none">
                <div className="absolute inset-0 bg-orange-700/20 blur-2xl rounded-full" />
                <div className="relative flex flex-col items-center">
                  <div className="w-24 h-24 rounded-full border-4 border-orange-700 overflow-hidden mb-4 shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                    <img src={top3[2].avatar} alt={top3[2].name} className="w-full h-full object-cover" />
                  </div>
                  <div className="w-full bg-gradient-to-t from-slate-800 to-slate-700 rounded-t-2xl p-6 text-center border-t-4 border-orange-700 h-40 flex flex-col justify-end shadow-2xl">
                    <div className="text-3xl font-bold text-orange-500 mb-1">3rd</div>
                    <div className="text-xl font-bold text-white truncate">{top3[2].name}</div>
                    <div className="text-slate-400 font-mono">{top3[2].points} pts</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Leaderboard Table */}
        <div className="bg-slate-800/30 backdrop-blur-xl rounded-2xl border border-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-900/50 text-slate-400 text-sm uppercase tracking-wider">
                  <th className="p-6 font-bold">Rank</th>
                  <th className="p-6 font-bold">Participant</th>
                  <th className="p-6 font-bold">Points</th>
                  <th className="p-6 font-bold hidden md:table-cell">Details</th>
                  <th className="p-6 font-bold hidden lg:table-cell">Cluster</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {rest.map((player) => (
                  <tr key={player.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-6">
                      <span className="font-mono font-bold text-slate-500">#{player.rank}</span>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <img src={player.avatar} alt={player.name} className="w-10 h-10 rounded-full bg-slate-700" />
                        <div>
                          <div className="font-bold text-white">{player.name}</div>
                          <div className="text-xs text-slate-400 md:hidden">
                            {player.year} Year • {player.department}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="font-mono font-bold text-cyan-400">{player.points}</div>
                    </td>
                    <td className="p-6 hidden md:table-cell">
                      <div className="text-sm text-slate-300">
                        <span className="px-2 py-1 rounded bg-slate-700/50 mr-2">Year {player.year}</span>
                        <span className="px-2 py-1 rounded bg-slate-700/50">{player.department} - {player.division}</span>
                      </div>
                    </td>
                    <td className="p-6 hidden lg:table-cell">
                      <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-sm border border-cyan-500/20">
                        {player.cluster}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {rankedData.length === 0 && (
            <div className="p-12 text-center text-slate-400">
              No participants found matching the selected filters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
