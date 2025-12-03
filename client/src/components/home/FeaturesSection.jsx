import { FaBook, FaBullseye, FaHandshake, FaLaptopCode, FaChalkboardUser, FaHeart } from 'react-icons/fa6';

export default function FeaturesSection() {
  const features = [
    {
      title: 'Skill Development',
      description: 'Learn from industry experts through workshops, bootcamps, and mentoring sessions',
      icon: <FaBook className="w-10 h-10" />,
      accentColor: 'cyan',
    },
    {
      title: 'Competitions',
      description: 'Participate in coding contests and hackathons to challenge yourself',
      icon: <FaBullseye className="w-10 h-10" />,
      accentColor: 'purple',
    },
    {
      title: 'Networking',
      description: 'Connect with like-minded developers and build lasting professional relationships',
      icon: <FaHandshake className="w-10 h-10" />,
      accentColor: 'green',
    },
    {
      title: 'Projects',
      description: 'Collaborate on real-world projects and build your portfolio',
      icon: <FaLaptopCode className="w-10 h-10" />,
      accentColor: 'orange',
    },
    {
      title: 'Mentorship',
      description: 'Get guidance from experienced members and senior developers',
      icon: <FaChalkboardUser className="w-10 h-10" />,
      accentColor: 'yellow',
    },
    {
      title: 'Community',
      description: 'Be part of a supportive community that celebrates your growth',
      icon: <FaHeart className="w-10 h-10" />,
      accentColor: 'rose',
    },
  ];

  const colorClasses = {
    cyan: {
      gradient: 'from-cyan-400 to-blue-500',
      light: 'cyan-400/20',
      medium: 'cyan-500/40',
      dark: 'cyan-600',
    },
    purple: {
      gradient: 'from-purple-400 to-indigo-500',
      light: 'purple-400/20',
      medium: 'purple-500/40',
      dark: 'purple-600',
    },
    green: {
      gradient: 'from-emerald-400 to-teal-500',
      light: 'emerald-400/20',
      medium: 'emerald-500/40',
      dark: 'emerald-600',
    },
    orange: {
      gradient: 'from-amber-400 to-orange-500',
      light: 'amber-400/20',
      medium: 'amber-500/40',
      dark: 'amber-600',
    },
    yellow: {
      gradient: 'from-yellow-400 to-amber-500',
      light: 'yellow-400/20',
      medium: 'yellow-500/40',
      dark: 'yellow-600',
    },
    rose: {
      gradient: 'from-rose-400 to-pink-500',
      light: 'rose-400/20',
      medium: 'rose-500/40',
      dark: 'rose-600',
    },
  };

  return (
    <section className="relative py-24 px-4 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />
      <div className="absolute inset-0 bg-gradient-radial from-slate-800/30 via-transparent to-transparent" />
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-cyan-400 font-mono text-sm">&lt;</span>
            <span className="text-cyan-400 font-mono text-xs">section</span>
            <span className="text-cyan-400 font-mono text-sm">&gt;</span>
          </div>
          <div className="inline-block relative mb-6">
            <h2 className="text-5xl md:text-6xl font-bold text-slate-100 tracking-tight relative z-10">
              Why Join Us?
            </h2>
            <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400/50 to-blue-500/50 blur-sm" />
            <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 to-blue-500" />
          </div>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto font-light tracking-wide">
            Discover the opportunities and benefits of being part of our thriving developer community
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <span className="text-cyan-400 font-mono text-sm">&lt;/</span>
            <span className="text-cyan-400 font-mono text-xs">section</span>
            <span className="text-cyan-400 font-mono text-sm">&gt;</span>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const colors = colorClasses[feature.accentColor];
            
            return (
              <div
                key={index}
                className="group relative"
                style={{
                  animation: `slide-up 0.6s ease-out forwards`,
                  animationDelay: `${index * 0.1}s`,
                  opacity: 0,
                }}
              >
                {/* Outer Glow Ring */}
                <div className={`absolute -inset-0.5 bg-gradient-to-br ${colors.gradient} rounded-xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-500`} />
                
                {/* Hover Scan Line */}
                <div className="absolute -top-1 left-4 right-4 h-[1px] bg-gradient-to-r from-transparent via-slate-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Card */}
                <div className="relative h-full bg-gradient-to-br from-slate-900/25 to-slate-800/25 border border-slate-700/50 rounded-xl p-8 backdrop-blur-sm group-hover:border-slate-600/70 transition-all duration-300 overflow-hidden">
                  
                  {/* Corner Brackets */}
                  <div className="absolute top-3 left-3 w-2 h-2 border-t border-l border-slate-500/50" />
                  <div className="absolute top-3 right-3 w-2 h-2 border-t border-r border-slate-500/50" />
                  <div className="absolute bottom-3 left-3 w-2 h-2 border-b border-l border-slate-500/50" />
                  <div className="absolute bottom-3 right-3 w-2 h-2 border-b border-r border-slate-500/50" />
                  
                  {/* Animated Accent Line */}
                  <div 
                    className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${colors.gradient} opacity-50 group-hover:opacity-80 transition-opacity duration-500`}
                  />
                  
                  {/* Icon Container */}
                  <div className="relative mb-6">

                    <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-lg bg-slate-800/50 border border-slate-700/50 group-hover:border-slate-600/70 transition-colors duration-300">
                      <div className={`text-${colors.dark} group-hover:text-${colors.dark}/90 transition-colors duration-300`}>
                        {feature.icon}
                      </div>
                    </div>
                    
                    {/* Hover Dot Indicator */}
                    <div className="absolute -top-1 -right-1 w-3 h-3">
                      <div className={`absolute inset-0 bg-${colors.dark} rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                      <div className={`absolute inset-0 bg-${colors.dark} rounded-full animate-ping opacity-0 group-hover:opacity-30 transition-opacity duration-300`} />
                    </div>
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-xl font-semibold text-slate-100 mb-3 tracking-tight">
                    {feature.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-slate-400 text-sm leading-relaxed font-light tracking-wide">
                    {feature.description}
                  </p>
                  
                  {/* Tech Pattern Overlay */}
                  <div className="absolute bottom-2 right-4 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
                    <div className="text-xs font-mono text-slate-400">
                      {`[0${index + 1}]`.padEnd(8, '_')}
                    </div>
                  </div>
                  
                  {/* Hover State Indicator */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3].map((dot) => (
                        <div
                          key={dot}
                          className={`w-1 h-1 bg-${colors.dark}/70 rounded-full animate-pulse`}
                          style={{ animationDelay: `${dot * 0.1}s` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 0.7;
          }
          50% {
            opacity: 0.3;
          }
        }
      `}</style>
    </section>
  );
}