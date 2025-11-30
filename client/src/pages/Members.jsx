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

  // Generate particles for background animation
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">

      {/* Animated Particle Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full bg-cyan-400/20 blur-sm animate-float"
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

      {/* Matrix-style grid overlay */}
      <div className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(6, 182, 212, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.3) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}
      />

      {/* Hero Header with Glassmorphism */}
      <section className="relative py-24 px-4 overflow-hidden">
        {/* Animated gradient orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center space-y-6 animate-slide-up">
            <div className="inline-block">
              <h1 className="text-6xl md:text-7xl font-black mb-4 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent animate-gradient">
                Our Members
              </h1>
              <div className="h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-full animate-pulse" />
            </div>
            <p className="text-xl text-cyan-100/80 max-w-3xl mx-auto font-light">
              Meet the brilliant minds behind the code. Developers, designers, and innovators shaping the future.
            </p>

            {/* Coding symbols decoration */}
            <div className="flex justify-center gap-8 text-cyan-400/40 text-2xl font-mono pt-4">
              <span className="animate-bounce" style={{ animationDelay: '0s' }}>{'{ }'}</span>
              <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>{'< />'}</span>
              <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>{'[ ]'}</span>
              <span className="animate-bounce" style={{ animationDelay: '0.6s' }}>{'( )'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="py-12 px-4 relative z-10">
        <div className="max-w-7xl mx-auto">

          {/* Search & Filters - Glassmorphism Card */}
          <div className="mb-12 backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl">

            {/* Search Bar and Filter Button - Same Line */}
            <div className="flex flex-col md:flex-row gap-4 items-end mb-6">

              {/* Search Bar */}
              <div className="flex-1 w-full">
                <label className="block text-cyan-300 font-semibold mb-3 text-sm uppercase tracking-wider">
                  🔍 Search Members
                </label>
                <SearchBar
                  placeholder="Search by name, role, or skills..."
                  onSearch={setSearchQuery}
                  suggestions={mockMembers.map(m => m.name).slice(0, 5)}
                  size="lg"
                />
              </div>

              {/* Filters Toggle */}
              <div className="w-full md:w-auto">
                <button
                  onClick={() => setFiltersOpen(!filtersOpen)}
                  className="w-full md:w-auto group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/50"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <svg className={`w-5 h-5 transition-transform duration-300 ${filtersOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                    {filtersOpen ? 'Hide Filters' : 'Show Filters'}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>
              </div>
            </div>

            {/* FILTER PANEL */}
            {filtersOpen && (
              <div className="backdrop-blur-lg bg-slate-800/40 border border-cyan-500/20 p-6 rounded-xl shadow-xl space-y-6 animate-slide-down">

                {/* Role */}
                <div>
                  <h3 className="text-sm font-bold text-cyan-300 mb-4 uppercase tracking-wider flex items-center gap-2">
                    <span className="text-lg">💼</span> Role
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setRoleFilter('')}
                      className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${roleFilter === ''
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/50 scale-105'
                        : 'bg-slate-700/50 hover:bg-slate-600/50 text-cyan-100 border border-slate-600/50'
                        }`}
                    >
                      All Roles
                    </button>

                    {roles.map(role => (
                      <button
                        key={role}
                        onClick={() => setRoleFilter(role)}
                        className={`px-4 py-2 rounded-lg text-sm transition-all duration-300 ${roleFilter === role
                          ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/50 scale-105'
                          : 'bg-slate-700/50 hover:bg-slate-600/50 text-cyan-100 border border-slate-600/50'
                          }`}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Branch */}
                <div>
                  <h3 className="text-sm font-bold text-cyan-300 mb-4 uppercase tracking-wider flex items-center gap-2">
                    <span className="text-lg">🎓</span> Branch
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setBranchFilter('')}
                      className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${branchFilter === ''
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/50 scale-105'
                        : 'bg-slate-700/50 hover:bg-slate-600/50 text-cyan-100 border border-slate-600/50'
                        }`}
                    >
                      All Branches
                    </button>

                    {branches.map(branch => (
                      <button
                        key={branch}
                        onClick={() => setBranchFilter(branch)}
                        className={`px-4 py-2 rounded-lg text-sm transition-all duration-300 ${branchFilter === branch
                          ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/50 scale-105'
                          : 'bg-slate-700/50 hover:bg-slate-600/50 text-cyan-100 border border-slate-600/50'
                          }`}
                      >
                        {branch}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Year */}
                <div>
                  <h3 className="text-sm font-bold text-cyan-300 mb-4 uppercase tracking-wider flex items-center gap-2">
                    <span className="text-lg">📅</span> Year
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setYearFilter('')}
                      className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${yearFilter === ''
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/50 scale-105'
                        : 'bg-slate-700/50 hover:bg-slate-600/50 text-cyan-100 border border-slate-600/50'
                        }`}
                    >
                      All Years
                    </button>

                    {years.map(year => (
                      <button
                        key={year}
                        onClick={() => setYearFilter(String(year))}
                        className={`px-4 py-2 rounded-lg text-sm transition-all duration-300 ${yearFilter === String(year)
                          ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/50 scale-105'
                          : 'bg-slate-700/50 hover:bg-slate-600/50 text-cyan-100 border border-slate-600/50'
                          }`}
                      >
                        Year {year}
                      </button>
                    ))}
                  </div>
                </div>

                {/* View Mode + Clear */}
                <div className="flex justify-between items-center flex-wrap gap-4 pt-4 border-t border-cyan-500/20">

                  {/* View Buttons */}
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-cyan-300">View:</span>

                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-3 rounded-lg transition-all duration-300 ${viewMode === 'grid'
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/50'
                        : 'bg-slate-700/50 hover:bg-slate-600/50 text-cyan-100'
                        }`}
                    >
                      <svg className="w-5 h-5" fill="currentColor">
                        <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z" />
                      </svg>
                    </button>

                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-3 rounded-lg transition-all duration-300 ${viewMode === 'list'
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/50'
                        : 'bg-slate-700/50 hover:bg-slate-600/50 text-cyan-100'
                        }`}
                    >
                      <svg className="w-5 h-5" fill="currentColor">
                        <path d="M3 4h18v2H3V4zm0 7h18v2H3v-2zm0 7h18v2H3v-2z" />
                      </svg>
                    </button>
                  </div>

                  {/* Clear Filters */}
                  {(searchQuery || roleFilter || branchFilter || yearFilter) && (
                    <button
                      onClick={handleClearFilters}
                      className="px-6 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg border border-red-500/30 transition-all duration-300 font-medium"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>

              </div>
            )}
          </div>

          {/* RESULTS SUMMARY */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-3 backdrop-blur-lg bg-white/5 border border-cyan-500/20 px-6 py-3 rounded-full">
              <span className="text-cyan-100/80 font-medium">Showing</span>
              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                {filteredMembers.length}
              </span>
              <span className="text-cyan-100/80 font-medium">
                member{filteredMembers.length !== 1 && 's'}
              </span>
            </div>
          </div>

          {/* MEMBERS HIERARCHICAL DISPLAY */}
          {filteredMembers.length > 0 ? (
            <div className="space-y-12">

              {/* Chairperson - Centered */}
              <div className="flex justify-center">
                {filteredMembers.filter(m => m.role === 'Chairperson').map((member) => (
                  <div key={member.id} className="w-full max-w-sm animate-slide-up" style={{ animationDelay: '0s', opacity: 0, animationFillMode: 'forwards' }}>
                    <MemberCard {...member} />
                  </div>
                ))}
              </div>

              {/* Core Committee */}
              {(() => {
                const coreCommittee = filteredMembers.filter(m =>
                  m.role === 'Vice Chairperson' ||
                  m.role === 'General Secretary' ||
                  m.role === 'Deputy General Secretary' ||
                  m.role === 'Treasurer'
                );

                return coreCommittee.length > 0 ? (
                  <div>
                    <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                      Core Committee
                    </h2>
                    <div className={
                      viewMode === 'grid'
                        ? 'flex flex-wrap justify-center gap-6'
                        : 'space-y-4'
                    }>
                      {coreCommittee.map((member, index) => (
                        <div
                          key={member.id}
                          className="animate-slide-up w-full sm:w-72"
                          style={{ animationDelay: `${(index + 1) * 0.1}s`, opacity: 0, animationFillMode: 'forwards' }}
                        >
                          <MemberCardFlip {...member} />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null;
              })()}

              {/* Team Leads & Co-Leads */}
              {(() => {
                const teamLeads = filteredMembers.filter(
                  m => m.role.includes('Lead') && !m.role.includes('Member')
                );

                return teamLeads.length > 0 ? (
                  <div>
                    <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                      Team Leads & Co-Leads
                    </h2>
                    <div className={
                      viewMode === 'grid'
                        ? 'flex flex-wrap justify-center gap-6'
                        : 'space-y-4'
                    }>
                      {teamLeads.map((member, index) => (
                        <div
                          key={member.id}
                          className="animate-slide-up w-full sm:w-72"
                          style={{ animationDelay: `${(index + 5) * 0.05}s`, opacity: 0, animationFillMode: 'forwards' }}
                        >
                          <MemberCardFlip {...member} />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null;
              })()}

              {/* Development Team Members */}
              {(() => {
                const devTeam = filteredMembers.filter(m => m.role === 'Member (Development Team)');
                return devTeam.length > 0 ? (
                  <div>
                    <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                      Development Team
                    </h2>
                    <div className={viewMode === 'grid' ? 'flex flex-wrap justify-center gap-6' : 'space-y-4'}>
                      {devTeam.map((member, index) => (
                        <div key={member.id} className="animate-slide-up w-full sm:w-72" style={{ animationDelay: `${index * 0.05}s`, opacity: 0, animationFillMode: 'forwards' }}>
                          <MemberCardFlip {...member} />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null;
              })()}

              {/* AI Team Members */}
              {(() => {
                const aiTeam = filteredMembers.filter(m => m.role === 'Member (AI Team)');
                return aiTeam.length > 0 ? (
                  <div>
                    <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                      AI Team
                    </h2>
                    <div className={viewMode === 'grid' ? 'flex flex-wrap justify-center gap-6' : 'space-y-4'}>
                      {aiTeam.map((member, index) => (
                        <div key={member.id} className="animate-slide-up w-full sm:w-72" style={{ animationDelay: `${index * 0.05}s`, opacity: 0, animationFillMode: 'forwards' }}>
                          <MemberCardFlip {...member} />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null;
              })()}

              {/* Emerging Tech Team Members */}
              {(() => {
                const emergingTech = filteredMembers.filter(m => m.role === 'Member (Emerging Tech)');
                return emergingTech.length > 0 ? (
                  <div>
                    <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                      Emerging Tech Team
                    </h2>
                    <div className={viewMode === 'grid' ? 'flex flex-wrap justify-center gap-6' : 'space-y-4'}>
                      {emergingTech.map((member, index) => (
                        <div key={member.id} className="animate-slide-up w-full sm:w-72" style={{ animationDelay: `${index * 0.05}s`, opacity: 0, animationFillMode: 'forwards' }}>
                          <MemberCardFlip {...member} />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null;
              })()}

              {/* Competition Management Team Members */}
              {(() => {
                const compTeam = filteredMembers.filter(m => m.role === 'Member (Competition Management)');
                return compTeam.length > 0 ? (
                  <div>
                    <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                      Competition Management Team
                    </h2>
                    <div className={viewMode === 'grid' ? 'flex flex-wrap justify-center gap-6' : 'space-y-4'}>
                      {compTeam.map((member, index) => (
                        <div key={member.id} className="animate-slide-up w-full sm:w-72" style={{ animationDelay: `${index * 0.05}s`, opacity: 0, animationFillMode: 'forwards' }}>
                          <MemberCardFlip {...member} />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null;
              })()}

              {/* PR Team Members */}
              {(() => {
                const prTeam = filteredMembers.filter(m => m.role === 'Member (PR Team)');
                return prTeam.length > 0 ? (
                  <div>
                    <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                      PR Team
                    </h2>
                    <div className={viewMode === 'grid' ? 'flex flex-wrap justify-center gap-6' : 'space-y-4'}>
                      {prTeam.map((member, index) => (
                        <div key={member.id} className="animate-slide-up w-full sm:w-72" style={{ animationDelay: `${index * 0.05}s`, opacity: 0, animationFillMode: 'forwards' }}>
                          <MemberCardFlip {...member} />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null;
              })()}

              {/* Programming Team Members */}
              {(() => {
                const progTeam = filteredMembers.filter(m => m.role === 'Member (Programming Team)');
                return progTeam.length > 0 ? (
                  <div>
                    <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                      Programming Team
                    </h2>
                    <div className={viewMode === 'grid' ? 'flex flex-wrap justify-center gap-6' : 'space-y-4'}>
                      {progTeam.map((member, index) => (
                        <div key={member.id} className="animate-slide-up w-full sm:w-72" style={{ animationDelay: `${index * 0.05}s`, opacity: 0, animationFillMode: 'forwards' }}>
                          <MemberCardFlip {...member} />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null;
              })()}

              {/* Media & Design Team Members */}
              {(() => {
                const mediaTeam = filteredMembers.filter(m => m.role === 'Member (Media & Design)');
                return mediaTeam.length > 0 ? (
                  <div>
                    <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                      Media & Design Team
                    </h2>
                    <div className={viewMode === 'grid' ? 'flex flex-wrap justify-center gap-6' : 'space-y-4'}>
                      {mediaTeam.map((member, index) => (
                        <div key={member.id} className="animate-slide-up w-full sm:w-72" style={{ animationDelay: `${index * 0.05}s`, opacity: 0, animationFillMode: 'forwards' }}>
                          <MemberCardFlip {...member} />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null;
              })()}



            </div>
          ) : (
            <div className="text-center py-20 backdrop-blur-lg bg-white/5 border border-cyan-500/20 rounded-2xl">
              <div className="text-7xl mb-6 animate-bounce">🔍</div>
              <h3 className="text-3xl font-bold text-cyan-300 mb-4">
                No Members Found
              </h3>
              <p className="text-cyan-100/60 max-w-md mx-auto mb-8 text-lg">
                No members match your filters. Try adjusting them.
              </p>
              <button
                onClick={handleClearFilters}
                className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl hover:scale-105 transition-all duration-300 shadow-lg shadow-cyan-500/50"
              >
                Clear Filters
              </button>
            </div>
          )}

        </div>
      </section>

      {/* STATISTICS - Glassmorphism */}
      {filteredMembers.length > 0 && (
        <section className="py-16 px-4 relative z-10 mt-12">
          <div className="max-w-7xl mx-auto">
            <div className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-8 shadow-2xl">
              <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Club Statistics
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

                <div className="text-center group hover:scale-110 transition-transform duration-300">
                  <div className="text-5xl font-black bg-gradient-to-br from-cyan-400 to-cyan-600 bg-clip-text text-transparent mb-3">
                    {filteredMembers.length}
                  </div>
                  <p className="text-cyan-100/70 font-medium uppercase tracking-wider text-sm">Total Members</p>
                  <div className="h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent mt-3 rounded-full" />
                </div>

                <div className="text-center group hover:scale-110 transition-transform duration-300">
                  <div className="text-5xl font-black bg-gradient-to-br from-blue-400 to-blue-600 bg-clip-text text-transparent mb-3">
                    {new Set(filteredMembers.map(m => m.role)).size}
                  </div>
                  <p className="text-cyan-100/70 font-medium uppercase tracking-wider text-sm">Unique Roles</p>
                  <div className="h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent mt-3 rounded-full" />
                </div>

                <div className="text-center group hover:scale-110 transition-transform duration-300">
                  <div className="text-5xl font-black bg-gradient-to-br from-purple-400 to-purple-600 bg-clip-text text-transparent mb-3">
                    {new Set(filteredMembers.map(m => m.branch)).size}
                  </div>
                  <p className="text-cyan-100/70 font-medium uppercase tracking-wider text-sm">Branches</p>
                  <div className="h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent mt-3 rounded-full" />
                </div>

                <div className="text-center group hover:scale-110 transition-transform duration-300">
                  <div className="text-5xl font-black bg-gradient-to-br from-pink-400 to-pink-600 bg-clip-text text-transparent mb-3">
                    {filteredMembers.reduce((s, m) => s + m.skills.length, 0)}+
                  </div>
                  <p className="text-cyan-100/70 font-medium uppercase tracking-wider text-sm">Total Skills</p>
                  <div className="h-1 bg-gradient-to-r from-transparent via-pink-500 to-transparent mt-3 rounded-full" />
                </div>

              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer decoration */}
      <div className="h-20" />

    </div>
  );
}



