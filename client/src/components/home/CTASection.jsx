import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function CTASection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative py-24 px-4 overflow-hidden">
      {/* Background Tech Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-10" />
      
      {/* Animated Grid Lines */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_49%,#0ea5e9_50%,transparent_51%)] bg-[length:40px_40px] animate-grid-flow-x" />
          <div className="absolute inset-0 bg-[linear-gradient(transparent_49%,#0ea5e9_50%,transparent_51%)] bg-[length:40px_40px] animate-grid-flow-y" />
        </div>
      </div>
      
      {/* Floating Particles */}
      <div className="absolute inset-0">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-[1px] h-[1px] bg-cyan-400/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>
      
      {/* Scan Line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent animate-scan" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Main CTA Container */}
        <div className={`relative transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          {/* Pulsing Outer Glow */}
          <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 rounded-3xl blur-xl animate-glow-slow" />
          
          {/* Outer Tech Frame */}
          <div className="absolute -inset-1 border border-slate-700/20 rounded-2xl" />
          <div className="absolute -inset-2 border border-slate-600/30 rounded-3xl animate-border-pulse" />
          
          {/* Inner Card */}
          <div className="relative backdrop-blur-md bg-gradient-to-br from-slate-900/30 to-slate-800/30 border border-slate-700/50 rounded-2xl p-10 md:p-14 text-center overflow-hidden group">
            
            {/* Animated Corner Brackets */}
            <div className="absolute top-4 left-4 w-3 h-3 border-t border-l border-cyan-400/50 animate-corner-pulse" />
            <div className="absolute top-4 right-4 w-3 h-3 border-t border-r border-cyan-400/50 animate-corner-pulse" style={{ animationDelay: '0.2s' }} />
            <div className="absolute bottom-4 left-4 w-3 h-3 border-b border-l border-cyan-400/50 animate-corner-pulse" style={{ animationDelay: '0.4s' }} />
            <div className="absolute bottom-4 right-4 w-3 h-3 border-b border-r border-cyan-400/50 animate-corner-pulse" style={{ animationDelay: '0.6s' }} />
            
            {/* Animated Grid Overlay */}
            <div className="absolute inset-0 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-500">
              <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_49%,#0ea5e9_50%,transparent_51%)] bg-[length:30px_30px] animate-grid-move" />
              <div className="absolute inset-0 bg-[linear-gradient(transparent_49%,#0ea5e9_50%,transparent_51%)] bg-[length:30px_30px] animate-grid-move" style={{ animationDelay: '1s' }} />
            </div>
            
            {/* Header */}
            <div className="relative mb-8">
              <div className="inline-block relative">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-100 mb-8 tracking-tight animate-text-glow">
                  Ready to Start Your Journey?
                </h2>
              </div>
              
              <p className="text-lg text-slate-400 max-w-2xl mx-auto font-light tracking-wide leading-relaxed transform transition-all duration-700 delay-300 opacity-0 animate-fade-up">
                Join hundreds of students who are already building amazing projects and advancing their careers
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center transform transition-all duration-700 delay-500 opacity-0 animate-fade-up">
              {/* Primary Button - Join Now */}
              <Link
                to="/signup"
                className="group relative px-8 py-4 bg-gradient-to-br from-slate-800/10 to-slate-900/50 border border-cyan-500/30 rounded-lg font-medium text-slate-100 overflow-hidden transition-all duration-300 hover:border-cyan-400/60 hover:scale-[1.02] hover:shadow-xl hover:shadow-cyan-500/10"
              >
                {/* Button Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Animated Background Pattern */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,#0ea5e9_1px,transparent_1px)] bg-[size:20px_20px] animate-dots-move" />
                </div>
                
                {/* Button Content */}
                <div className="relative flex items-center justify-center gap-3">
                  <span className="transform transition-transform duration-300 group-hover:scale-105">Join Now</span>
                  <svg className="w-5 h-5 text-cyan-400 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
                
                {/* Bottom Accent Line */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Tech Indicator Dots */}
                <div className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex gap-1">
                    <div className="w-1 h-1 bg-cyan-400 rounded-full animate-pulse" />
                    <div className="w-1 h-1 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }} />
                    <div className="w-1 h-1 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
                
                {/* Particle Burst on Hover */}
                <div className="absolute inset-0 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-[2px] h-[2px] bg-cyan-400/50 rounded-full animate-particle-burst"
                      style={{
                        left: '50%',
                        top: '50%',
                        animationDelay: `${i * 0.05}s`,
                      }}
                    />
                  ))}
                </div>
              </Link>
              
              {/* Secondary Button - Browse Events */}
              <Link
                to="/events"
                className="group relative px-8 py-4 bg-gradient-to-br from-slate-800/10 to-slate-900/50 border border-slate-600/50 rounded-lg font-medium text-slate-300 overflow-hidden transition-all duration-300 hover:border-slate-500/70 hover:text-slate-100 hover:scale-[1.02] hover:shadow-xl hover:shadow-slate-500/5"
              >
                {/* Hover Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-700/10 to-slate-800/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Button Content */}
                <div className="relative flex items-center justify-center gap-3">
                  <svg className="w-5 h-5 text-slate-400 group-hover:text-slate-300 transition-all duration-300 transform group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="transform transition-transform duration-300 group-hover:scale-105">Browse Events</span>
                </div>
                
                {/* Right Border Accent */}
                <div className="absolute top-1/2 -right-1 w-1 h-6 bg-gradient-to-b from-transparent via-slate-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform -translate-y-1/2 group-hover:translate-x-1" />
              </Link>
            </div>
            
            {/* Footer Note */}
            <div className="mt-10 pt-6 border-t border-slate-700/50 transform transition-all duration-700 delay-700 opacity-0 animate-fade-up">
              <div className="relative">
                <p className="text-sm text-slate-500 font-mono tracking-wide animate-typewriter">
                  <span className="text-cyan-400/60 mr-2">$</span> 
                  <span className="text-slate-400">Be a part of KLE Tech's coding community!</span>
                </p>
                <div className="absolute -right-2 top-0 w-[2px] h-4 bg-cyan-400/60 animate-cursor-blink" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scan {
          0% {
            transform: translateY(-100%);
            opacity: 0;
          }
          10%, 90% {
            opacity: 0.3;
          }
          100% {
            transform: translateY(100vh);
            opacity: 0;
          }
        }
        
        @keyframes grid-flow-x {
          0% {
            background-position-x: 0px;
          }
          100% {
            background-position-x: 40px;
          }
        }
        
        @keyframes grid-flow-y {
          0% {
            background-position-y: 0px;
          }
          100% {
            background-position-y: 40px;
          }
        }
        
        @keyframes grid-move {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: 30px 30px;
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.1;
            transform: translateY(-20px) translateX(10px);
          }
          90% {
            opacity: 0.3;
          }
        }
        
        @keyframes glow-slow {
          0%, 100% {
            opacity: 0.1;
            transform: scale(1);
          }
          50% {
            opacity: 0.2;
            transform: scale(1.02);
          }
        }
        
        @keyframes border-pulse {
          0%, 100% {
            border-color: rgba(30, 41, 59, 0.3);
          }
          50% {
            border-color: rgba(30, 41, 59, 0.5);
          }
        }
        
        @keyframes corner-pulse {
          0%, 100% {
            border-color: rgba(34, 211, 238, 0.5);
          }
          50% {
            border-color: rgba(34, 211, 238, 0.8);
          }
        }
        
        @keyframes text-glow {
          0%, 100% {
            text-shadow: 0 0 10px rgba(34, 211, 238, 0);
          }
          50% {
            text-shadow: 0 0 10px rgba(34, 211, 238, 0.1);
          }
        }
        
        @keyframes underline-expand {
          0% {
            width: 0%;
            left: 50%;
          }
          100% {
            width: 100%;
            left: 0;
          }
        }
        
        @keyframes fade-up {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slide-up {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes dots-move {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: 20px 20px;
          }
        }
        
        @keyframes particle-burst {
          0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 1;
          }
          100% {
            transform: translate(
              calc(-50% + ${Math.random() * 100 - 50}px),
              calc(-50% + ${Math.random() * 100 - 50}px)
            ) scale(1);
            opacity: 0;
          }
        }
        
        @keyframes typewriter {
          0% {
            width: 0;
          }
          100% {
            width: 100%;
          }
        }
        
        @keyframes cursor-blink {
          0%, 50% {
            opacity: 1;
          }
          51%, 100% {
            opacity: 0;
          }
        }
        
        .animate-scan {
          animation: scan 8s linear infinite;
        }
        
        .animate-grid-flow-x {
          animation: grid-flow-x 20s linear infinite;
        }
        
        .animate-grid-flow-y {
          animation: grid-flow-y 30s linear infinite;
        }
        
        .animate-grid-move {
          animation: grid-move 20s linear infinite;
        }
        
        .animate-float {
          animation: float var(--duration) ease-in-out infinite;
        }
        
        .animate-glow-slow {
          animation: glow-slow 4s ease-in-out infinite;
        }
        
        .animate-border-pulse {
          animation: border-pulse 3s ease-in-out infinite;
        }
        
        .animate-corner-pulse {
          animation: corner-pulse 2s ease-in-out infinite;
        }
        
        .animate-text-glow {
          animation: text-glow 3s ease-in-out infinite;
        }
        
        .animate-underline-expand {
          animation: underline-expand 1s ease-out forwards;
        }
        
        .animate-fade-up {
          animation: fade-up 0.8s ease-out forwards;
        }
        
        .animate-slide-up {
          animation: slide-up 0.6s ease-out forwards;
        }
        
        .animate-dots-move {
          animation: dots-move 10s linear infinite;
        }
        
        .animate-particle-burst {
          animation: particle-burst 0.6s ease-out forwards;
        }
        
        .animate-typewriter {
          width: 100%;
          overflow: hidden;
          white-space: nowrap;
          animation: typewriter 2s steps(40, end) forwards;
        }
        
        .animate-cursor-blink {
          animation: cursor-blink 1s step-end infinite;
        }
      `}</style>
    </section>
  );
}