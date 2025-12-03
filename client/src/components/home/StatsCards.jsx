import { FaUsers, FaCalendarDays, FaTrophy } from 'react-icons/fa6';
import { useState, useEffect, useRef } from 'react';

export default function StatsCards() {
  const [counts, setCounts] = useState([0, 0, 0]);
  const [hasStarted, setHasStarted] = useState(false);
  const sectionRef = useRef(null);

  const stats = [
    { number: 500, label: 'Active Members', icon: <FaUsers className="w-8 h-8" /> },
    { number: 50, label: 'Events Annually', icon: <FaCalendarDays className="w-8 h-8" /> },
    { number: 15, label: 'Years Strong', icon: <FaTrophy className="w-8 h-8" /> },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    const duration = 2000; // 2 seconds animation
    const startTime = Date.now();

    const animateCounters = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const newCounts = stats.map((stat) => {
        return Math.floor(stat.number * progress);
      });

      setCounts(newCounts);

      if (progress < 1) {
        requestAnimationFrame(animateCounters);
      }
    };

    requestAnimationFrame(animateCounters);
  }, [hasStarted]);

  return (
    <section className="relative py-20 px-4" ref={sectionRef}>
      {/* Grid background effect */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />
      
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-radial from-cyan-500/5 via-transparent to-transparent" />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto relative z-10">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="group relative"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {/* Outer glow ring */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Hover scan line */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Card */}
            <div className="relative bg-gradient-to-br from-slate-950/5 to-slate-900/95 border border-slate-700/50 rounded-xl p-8 backdrop-blur-sm group-hover:border-cyan-500/30 transition-all duration-300">
              
              {/* Corner accents */}
              <div className="absolute top-3 left-3 w-2 h-2 border-t border-l border-cyan-400/50" />
              <div className="absolute top-3 right-3 w-2 h-2 border-t border-r border-cyan-400/50" />
              <div className="absolute bottom-3 left-3 w-2 h-2 border-b border-l border-cyan-400/50" />
              <div className="absolute bottom-3 right-3 w-2 h-2 border-b border-r border-cyan-400/50" />
              
              {/* Icon with subtle glow */}
              <div className="relative inline-block mb-4">
                <div className="absolute inset-0 bg-cyan-400/10 blur-md rounded-full" />
                <div className="relative text-cyan-300/80 group-hover:text-cyan-300 transition-colors duration-300">
                  {stat.icon}
                </div>
              </div>
              
              {/* Number with data display effect */}
              <div className="relative">
                <div className="text-5xl font-bold text-slate-100 tracking-tight mb-2">
                  {counts[index]}+
                </div>
                <div className="absolute inset-0 text-5xl font-bold text-cyan-400/10 tracking-tight blur-sm">
                  {counts[index]}+
                </div>
              </div>
              
              {/* Label with subtle underline */}
              <div className="text-cyan-100/60 font-medium tracking-wide relative inline-block">
                {stat.label}
                <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-gradient-to-r from-cyan-400/50 to-blue-400/50 group-hover:w-full transition-all duration-500" />
              </div>
              
              {/* Binary code background effect */}
              <div className="absolute bottom-2 right-4 text-[8px] text-cyan-400/10 font-mono select-none">
                0101 0010
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}