import { useState, useEffect } from 'react';
import { Card, Badge, SearchBar } from '@/components/ui';
import LeaderboardTable from '@/components/leaderboard/LeaderboardTable';
import {
  getTopStudents,
  getBranchRankings,
  getYearWiseRankings,
  searchStudent,
} from '@/utils/mockLeaderboardData';

export default function Leaderboard() {
  const [activeTab, setActiveTab] = useState('student'); // 'student', 'branch', 'year'
  const [searchQuery, setSearchQuery] = useState('');
  const [particles, setParticles] = useState([]);

  const studentData = searchQuery ? searchStudent(searchQuery) : getTopStudents(10);
  const branchData = getBranchRankings();
  const yearData = getYearWiseRankings();

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

  const tabs = [
    { id: 'student', label: '👤 Student Rankings', icon: '🏅' },
    { id: 'branch', label: '🏢 Branch Rankings', icon: '📊' },
    { id: 'year', label: '📚 Year-wise Rankings', icon: '📈' },
  ];

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
                Leaderboard
              </h1>
              <div className="h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-full animate-pulse" />
            </div>
            <p className="text-xl text-cyan-100/80 max-w-3xl mx-auto font-light">
              Track top performers, achievements, and competitive rankings. Celebrate excellence and inspire others.
            </p>

            {/* Trophy decoration */}
            <div className="flex justify-center gap-8 text-4xl pt-4">
              <span className="animate-bounce" style={{ animationDelay: '0s' }}>🥇</span>
              <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>🥈</span>
              <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>🥉</span>
              <span className="animate-bounce" style={{ animationDelay: '0.6s' }}>🏆</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 px-4 relative z-10">
        <div className="max-w-7xl mx-auto">

          {/* Tab Navigation - Glassmorphism */}
          <div className="mb-10 backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4 shadow-2xl">
            <div className="flex flex-wrap gap-3">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setSearchQuery('');
                  }}
                  className={`flex-1 min-w-[200px] px-6 py-4 font-bold rounded-xl transition-all duration-300 text-sm md:text-base ${activeTab === tab.id
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/50 scale-105'
                      : 'bg-slate-700/50 hover:bg-slate-600/50 text-cyan-100 border border-slate-600/50'
                    }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Search Bar (Only for Student Rankings) */}
          {activeTab === 'student' && (
            <div className="mb-8 backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-2xl">
              <label className="block text-cyan-300 font-semibold mb-3 text-sm uppercase tracking-wider">
                🔍 Search Students
              </label>
              <SearchBar
                placeholder="Search students by name or branch..."
                onSearch={setSearchQuery}
                suggestions={getTopStudents(5).map((s) => s.name)}
                size="lg"
              />
            </div>
          )}

          {/* Top 3 Podium (Only for Student Rankings) */}
          {activeTab === 'student' && (
            <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              {getTopStudents(3).map((student, index) => (
                <div
                  key={student.id}
                  className={`backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-6 shadow-2xl transform transition-all duration-500 hover:scale-105 hover:shadow-cyan-500/20 ${index === 0 ? 'md:scale-110 md:order-2' : index === 1 ? 'md:order-1' : 'md:order-3'
                    }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="text-center">
                    <div className="text-6xl mb-4 animate-bounce" style={{ animationDelay: `${index * 0.2}s` }}>
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                    </div>
                    <h3 className="text-2xl font-black text-white mb-2">
                      {student.name}
                    </h3>
                    <div className="inline-block px-4 py-1 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full text-sm font-semibold mb-4">
                      {student.branch}
                    </div>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between items-center px-4 py-2 bg-slate-700/30 rounded-lg">
                        <span className="text-cyan-300">Points:</span>
                        <span className="font-bold text-2xl bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">{student.points}</span>
                      </div>
                      <div className="flex justify-between items-center px-4 py-2 bg-slate-700/30 rounded-lg">
                        <span className="text-cyan-300">Achievements:</span>
                        <span className="font-bold text-white">🏆 {student.achievements}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Statistics Section - Glassmorphism */}
          <div className="mb-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            {activeTab === 'student' && (
              <>
                <div className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-6 text-center group hover:scale-110 transition-transform duration-300">
                  <div className="text-4xl font-black bg-gradient-to-br from-cyan-400 to-cyan-600 bg-clip-text text-transparent mb-2">
                    {studentData.length}
                  </div>
                  <p className="text-sm text-cyan-100/70 font-medium uppercase tracking-wider">Ranked Students</p>
                  <div className="h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent mt-3 rounded-full" />
                </div>
                <div className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-6 text-center group hover:scale-110 transition-transform duration-300">
                  <div className="text-4xl font-black bg-gradient-to-br from-blue-400 to-blue-600 bg-clip-text text-transparent mb-2">
                    {studentData[0]?.points || 0}
                  </div>
                  <p className="text-sm text-cyan-100/70 font-medium uppercase tracking-wider">Top Points</p>
                  <div className="h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent mt-3 rounded-full" />
                </div>
                <div className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-6 text-center group hover:scale-110 transition-transform duration-300">
                  <div className="text-4xl font-black bg-gradient-to-br from-green-400 to-green-600 bg-clip-text text-transparent mb-2">
                    {studentData.reduce((sum, s) => sum + s.contests, 0)}
                  </div>
                  <p className="text-sm text-cyan-100/70 font-medium uppercase tracking-wider">Total Contests</p>
                  <div className="h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent mt-3 rounded-full" />
                </div>
                <div className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-6 text-center group hover:scale-110 transition-transform duration-300">
                  <div className="text-4xl font-black bg-gradient-to-br from-purple-400 to-purple-600 bg-clip-text text-transparent mb-2">
                    {studentData.reduce((sum, s) => sum + s.achievements, 0)}
                  </div>
                  <p className="text-sm text-cyan-100/70 font-medium uppercase tracking-wider">Total Badges</p>
                  <div className="h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent mt-3 rounded-full" />
                </div>
              </>
            )}

            {activeTab === 'branch' && (
              <>
                <div className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-6 text-center group hover:scale-110 transition-transform duration-300">
                  <div className="text-4xl font-black bg-gradient-to-br from-cyan-400 to-cyan-600 bg-clip-text text-transparent mb-2">
                    {branchData.length}
                  </div>
                  <p className="text-sm text-cyan-100/70 font-medium uppercase tracking-wider">Branches</p>
                  <div className="h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent mt-3 rounded-full" />
                </div>
                <div className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-6 text-center group hover:scale-110 transition-transform duration-300">
                  <div className="text-4xl font-black bg-gradient-to-br from-blue-400 to-blue-600 bg-clip-text text-transparent mb-2">
                    {branchData.reduce((sum, b) => sum + b.totalMembers, 0)}
                  </div>
                  <p className="text-sm text-cyan-100/70 font-medium uppercase tracking-wider">Total Members</p>
                  <div className="h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent mt-3 rounded-full" />
                </div>
                <div className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-6 text-center group hover:scale-110 transition-transform duration-300">
                  <div className="text-4xl font-black bg-gradient-to-br from-green-400 to-green-600 bg-clip-text text-transparent mb-2">
                    {branchData.reduce((sum, b) => sum + b.totalPoints, 0)}
                  </div>
                  <p className="text-sm text-cyan-100/70 font-medium uppercase tracking-wider">Total Points</p>
                  <div className="h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent mt-3 rounded-full" />
                </div>
                <div className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-6 text-center group hover:scale-110 transition-transform duration-300">
                  <div className="text-4xl font-black bg-gradient-to-br from-purple-400 to-purple-600 bg-clip-text text-transparent mb-2">
                    {Math.round(branchData.reduce((sum, b) => sum + b.totalPoints, 0) / branchData.length)}
                  </div>
                  <p className="text-sm text-cyan-100/70 font-medium uppercase tracking-wider">Avg Points</p>
                  <div className="h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent mt-3 rounded-full" />
                </div>
              </>
            )}

            {activeTab === 'year' && (
              <>
                <div className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-6 text-center group hover:scale-110 transition-transform duration-300">
                  <div className="text-4xl font-black bg-gradient-to-br from-cyan-400 to-cyan-600 bg-clip-text text-transparent mb-2">
                    {yearData.length}
                  </div>
                  <p className="text-sm text-cyan-100/70 font-medium uppercase tracking-wider">Year Groups</p>
                  <div className="h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent mt-3 rounded-full" />
                </div>
                <div className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-6 text-center group hover:scale-110 transition-transform duration-300">
                  <div className="text-4xl font-black bg-gradient-to-br from-blue-400 to-blue-600 bg-clip-text text-transparent mb-2">
                    {yearData.reduce((sum, y) => sum + y.totalMembers, 0)}
                  </div>
                  <p className="text-sm text-cyan-100/70 font-medium uppercase tracking-wider">Total Members</p>
                  <div className="h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent mt-3 rounded-full" />
                </div>
                <div className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-6 text-center group hover:scale-110 transition-transform duration-300">
                  <div className="text-4xl font-black bg-gradient-to-br from-green-400 to-green-600 bg-clip-text text-transparent mb-2">
                    {yearData.reduce((sum, y) => sum + y.totalPoints, 0)}
                  </div>
                  <p className="text-sm text-cyan-100/70 font-medium uppercase tracking-wider">Total Points</p>
                  <div className="h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent mt-3 rounded-full" />
                </div>
                <div className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-6 text-center group hover:scale-110 transition-transform duration-300">
                  <div className="text-4xl font-black bg-gradient-to-br from-purple-400 to-purple-600 bg-clip-text text-transparent mb-2">
                    {Math.round(yearData.reduce((sum, y) => sum + y.totalPoints, 0) / yearData.length)}
                  </div>
                  <p className="text-sm text-cyan-100/70 font-medium uppercase tracking-wider">Avg Points</p>
                  <div className="h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent mt-3 rounded-full" />
                </div>
              </>
            )}
          </div>

          {/* Leaderboard Table - Glassmorphism */}
          <div className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-8 shadow-2xl mb-8">
            <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              {activeTab === 'student' && 'Top Student Rankings'}
              {activeTab === 'branch' && 'Branch Competition Rankings'}
              {activeTab === 'year' && 'Year-wise Leaderboard'}
            </h2>

            {studentData.length === 0 && activeTab === 'student' ? (
              <div className="text-center py-16">
                <div className="text-7xl mb-6 animate-bounce">🔍</div>
                <h3 className="text-2xl font-bold text-cyan-300 mb-4">No Students Found</h3>
                <p className="text-cyan-100/60 text-lg">
                  No students found matching your search.
                </p>
              </div>
            ) : (
              <LeaderboardTable
                type={activeTab}
                data={
                  activeTab === 'student'
                    ? studentData
                    : activeTab === 'branch'
                      ? branchData
                      : yearData
                }
              />
            )}
          </div>

          {/* Legend Section - Glassmorphism */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-8 shadow-2xl">
              <h3 className="text-xl font-bold text-cyan-300 mb-6 flex items-center gap-2">
                <span className="text-2xl">📊</span> Level Definitions
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg">
                  <div className="px-3 py-1 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-lg text-sm font-bold">Expert</div>
                  <span className="text-sm text-cyan-100/80">2000+ points, highly experienced</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg">
                  <div className="px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-600 text-white rounded-lg text-sm font-bold">Advanced</div>
                  <span className="text-sm text-cyan-100/80">1200-2000 points, proven skills</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg">
                  <div className="px-3 py-1 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg text-sm font-bold">Intermediate</div>
                  <span className="text-sm text-cyan-100/80">600-1200 points, developing skills</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg">
                  <div className="px-3 py-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg text-sm font-bold">Beginner</div>
                  <span className="text-sm text-cyan-100/80">Less than 600 points, new to coding</span>
                </div>
              </div>
            </div>

            <div className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-8 shadow-2xl">
              <h3 className="text-xl font-bold text-cyan-300 mb-6 flex items-center gap-2">
                <span className="text-2xl">🎯</span> How Points Are Earned
              </h3>
              <div className="space-y-3 text-sm text-cyan-100/80">
                <p className="flex items-center gap-2 p-3 bg-slate-700/30 rounded-lg">
                  <span className="text-xl">🏆</span> <strong className="text-cyan-300">Contests:</strong> 50-500 points per contest
                </p>
                <p className="flex items-center gap-2 p-3 bg-slate-700/30 rounded-lg">
                  <span className="text-xl">🎖️</span> <strong className="text-cyan-300">Achievements:</strong> 100-300 points per achievement
                </p>
                <p className="flex items-center gap-2 p-3 bg-slate-700/30 rounded-lg">
                  <span className="text-xl">📝</span> <strong className="text-cyan-300">Projects:</strong> 50-200 points per completed project
                </p>
                <p className="flex items-center gap-2 p-3 bg-slate-700/30 rounded-lg">
                  <span className="text-xl">👥</span> <strong className="text-cyan-300">Mentoring:</strong> 25-75 points per mentee helped
                </p>
                <p className="flex items-center gap-2 p-3 bg-slate-700/30 rounded-lg">
                  <span className="text-xl">📚</span> <strong className="text-cyan-300">Workshops:</strong> 50-150 points per workshop attended
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer decoration */}
      <div className="h-20" />

    </div>
  );
}
