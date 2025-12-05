import { useState, useMemo, useEffect } from 'react';
import { SearchBar, Button } from '@/components/ui';
import MemberCard from '@/components/member/MemberCard';
import MemberCardFlip from '@/components/member/MemberCardFlip';
import {
  mockMembers,
  getAllRoles,
  getAllBranches,
  getAllYears,
  filterMembers,
} from '@/utils/mockMemberData';
import { mockFacultyMembers } from '@/utils/mockFacultyData';

export default function Members() {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [branchFilter, setBranchFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [particles, setParticles] = useState([]);

  const roles = getAllRoles();
  const branches = getAllBranches();
  const years = getAllYears();

  useEffect(() => {
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 5,
    }));
    setParticles(newParticles);
  }, []);

  const filteredMembers = useMemo(() => {
    return filterMembers({
      search: searchQuery,
      role: roleFilter || undefined,
      branch: branchFilter || undefined,
      year: yearFilter || undefined,
    });
  }, [searchQuery, roleFilter, branchFilter, yearFilter]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setRoleFilter('');
    setBranchFilter('');
    setYearFilter('');
  };

  return (
    <div className="min-h-screen bg-pitch-dark relative overflow-hidden">

      {/* Animated Particle Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full blur-sm animate-float"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              animation: `float ${particle.duration}s ease-in-out ${particle.delay}s infinite`,
            }}
          />
        ))}
      </div>

      {/* Hero Header */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <div className="mb-6 flex items-center justify-center gap-3">
            <span className="font-mono text-cyan-400">&lt;</span>
            <h1 className="text-6xl md:text-7xl font-black bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent animate-gradient font-mono">
              members
            </h1>
            <span className="font-mono text-cyan-400">&gt;</span>
          </div>
          <p className="text-xl text-cyan-100/80 max-w-3xl mx-auto font-light">
            Meet the brilliant minds behind the code. Developers, designers, and innovators shaping the future.
          </p>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="py-12 px-4 relative z-10">
        <div className="max-w-7xl mx-auto">

          {/* Search & Filters */}
          <div className="mb-12 backdrop-blur-xl bg-slate-900/40 border border-slate-800/60 rounded-2xl p-8">
            <div className="flex flex-col md:flex-row gap-4 items-end mb-6">
              <div className="flex-1 w-full">
                <label className="flex text-cyan-300 font-semibold mb-3 text-sm uppercase tracking-wider gap-2"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>Search Members</label>
                <SearchBar
                  placeholder="Search by name, role, or skills..."
                  onSearch={setSearchQuery}
                  suggestions={mockMembers.map(m => m.name).slice(0, 5)}
                  size="lg"
                />
              </div>

              <div className="w-full md:w-auto">
                <button
                  onClick={() => setFiltersOpen(!filtersOpen)}
                  className="w-full md:w-auto group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">{filtersOpen ? 'Hide Filters' : 'Show Filters'}</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>
              </div>
            </div>

            {filtersOpen && (
              <div className="backdrop-blur-lg bg-slate-900/60 border border-slate-800/60 p-6 rounded-xl shadow-xl space-y-6 animate-slide-down">
                <div>
                  <h3 className="text-sm font-bold text-cyan-300 mb-4 uppercase tracking-wider flex items-center gap-2"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>Role</h3>
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => setRoleFilter('')} className={`px-4 py-2 rounded-lg ${roleFilter === '' ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white' : 'bg-slate-800/60 text-cyan-100 border border-slate-700/50 hover:border-slate-600/80'}`}>
                      All Roles
                    </button>
                    {roles.map(role => (
                      <button key={role} onClick={() => setRoleFilter(role)} className={`px-4 py-2 rounded-lg text-sm transition-all ${roleFilter === role ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg' : 'bg-slate-800/60 text-cyan-100 border border-slate-700/50 hover:border-slate-600/80'}`}>
                        {role}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-cyan-300 mb-4 uppercase tracking-wider flex items-center gap-2"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C6.5 6.253 2 10.998 2 17s4.5 10.747 10 10.747c5.5 0 10-4.998 10-10.747S17.5 6.253 12 6.253z" /></svg>Branch</h3>
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => setBranchFilter('')} className={`px-4 py-2 rounded-lg ${branchFilter === '' ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white' : 'bg-slate-800/60 text-cyan-100 border border-slate-700/50 hover:border-slate-600/80'}`}>
                      All Branches
                    </button>
                    {branches.map(branch => (
                      <button key={branch} onClick={() => setBranchFilter(branch)} className={`px-4 py-2 rounded-lg text-sm transition-all ${branchFilter === branch ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg' : 'bg-slate-800/60 text-cyan-100 border border-slate-700/50 hover:border-slate-600/80'}`}>
                        {branch}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-cyan-300 mb-4 uppercase tracking-wider flex items-center gap-2"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>Year</h3>
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => setYearFilter('')} className={`px-4 py-2 rounded-lg ${yearFilter === '' ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white' : 'bg-slate-800/60 text-cyan-100 border border-slate-700/50 hover:border-slate-600/80'}`}>
                      All Years
                    </button>
                    {years.map(year => (
                      <button key={year} onClick={() => setYearFilter(String(year))} className={`px-4 py-2 rounded-lg text-sm transition-all ${yearFilter === String(year) ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg' : 'bg-slate-800/60 text-cyan-100 border border-slate-700/50 hover:border-slate-600/80'}`}>
                        Year {year}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center flex-wrap gap-4 pt-4 border-t border-slate-800/60">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-cyan-300">View:</span>
                    <button onClick={() => setViewMode('grid')} className={`p-3 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg' : 'bg-slate-800/60 text-cyan-100 border border-slate-700/50 hover:border-slate-600/80'}`}>
                      Grid
                    </button>
                    <button onClick={() => setViewMode('list')} className={`p-3 rounded-lg transition-all ${viewMode === 'list' ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg' : 'bg-slate-800/60 text-cyan-100 border border-slate-700/50 hover:border-slate-600/80'}`}>
                      List
                    </button>
                  </div>

                  {(searchQuery || roleFilter || branchFilter || yearFilter) && (
                    <button onClick={handleClearFilters} className="px-6 py-2 bg-red-500/20 text-red-300 rounded-lg border border-red-500/30">Clear Filters</button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* RESULTS */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-3 backdrop-blur-lg bg-slate-900/40 border border-slate-800/60 px-6 py-3 rounded-full">
              <span className="text-cyan-100/80 font-medium">Showing</span>
              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">{filteredMembers.length + mockFacultyMembers.length}</span>
              <span className="text-cyan-100/80 font-medium">member{filteredMembers.length + mockFacultyMembers.length !== 1 && 's'}</span>
            </div>
          </div>

          {/* Faculty Members Section - Always Display */}
          <div className="mb-16">
            <div className="mb-8">
              <h2 className="text-4xl font-bold font-rajdhani bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">
                Faculty Advisors
              </h2>
              <p className="text-cyan-100/60">Meet our dedicated mentors and advisors</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockFacultyMembers.map((member) => (
                <div key={member.id} className="animate-slide-up">
                  <MemberCardFlip {...member} />
                </div>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 py-8">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
            <span className="text-cyan-400 font-mono text-sm">Team Members</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
          </div>

          {filteredMembers.length > 0 ? (
            <div className="space-y-16">
              {/* Core & Other Members Section */}
              <div>
                <div className="mb-8">
                  <h2 className="text-4xl font-bold font-rajdhani bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">
                    Team Members
                  </h2>
                  <p className="text-cyan-100/60">Talented developers and contributors</p>
                </div>

              <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4' : 'space-y-4'}>
                {filteredMembers.map((member, index) => (
                  <div key={member.id} className="animate-slide-up">
                    <MemberCardFlip {...member} />
                  </div>
                ))}
              </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-20 backdrop-blur-lg bg-slate-900/40 border border-slate-800/60 rounded-2xl">
              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-full bg-slate-800/60">
                <svg className="w-8 h-8 text-cyan-400 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
              <h3 className="text-3xl font-bold text-cyan-300 mb-4">No Members Found</h3>
              <p className="text-cyan-100/60 max-w-md mx-auto mb-8 text-lg">No members match your filters. Try adjusting them.</p>
              <button onClick={handleClearFilters} className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl">Clear Filters</button>
            </div>
          )}
        </div>
      </section>

      <div className="h-20" />

    </div>
  );
}
