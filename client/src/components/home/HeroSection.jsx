import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Threads from './Threads';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 py-10 overflow-hidden pt-0">
      {/* Threads Background - Simulating data flow */}
      <div className="absolute inset-0 z-0 -top-64">
        <Threads
          color={[0.2, 0.6, 1]}
          amplitude={1.2}
          distance={0}
          enableMouseInteraction={true}
        />
      </div>

      {/* Floating code snippets */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 8 }).map((_, i) => (
          <div 
            key={i}
            className="absolute text-xs sm:text-sm font-mono text-cyan-400/30 opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float${i % 3} ${10 + i * 2}s infinite ease-in-out`
            }}
          >
            {[
              'const innovator = new Developer();',
              'async function solveChallenge()',
              '<DevCommunity />',
              'git push origin innovation',
              'npm run build-future',
              'while(!success) { tryAgain(); }',
              'export default function Hack()',
              'docker-compose up growth'
            ][i]}
          </div>
        ))}
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 py-20 text-center -translate-y-20">
        {/* Terminal-style heading */}
        <div className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-black/40 backdrop-blur-sm border border-cyan-900/50">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <span className="font-mono text-cyan-400 text-sm">KLE Technological University</span>
        </div>

        {/* Main Heading with typewriter effect */}
        <h1 className="text-7xl sm:text-7xl md:text-7xl lg:text-9xl font-bold mb-6 leading-tight font-mono">
          ArcStack
        </h1>

        {/* Subheading */}
        <p className="text-lg md:text-2xl text-slate-300 mb-12 max-w-3xl mx-auto font-light tracking-wide">
          First to Begin, Never to give up
        </p>


        {/* CTA Buttons with tech styling */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full sm:w-auto">
          <Link
            to="/events"
            className="group relative w-full sm:w-auto px-8 py-4 bg-gradient-to-br from-slate-800/10 to-slate-900/50 border border-cyan-500/30 rounded-lg font-medium text-slate-100 overflow-hidden transition-all duration-300 hover:border-cyan-400/60 hover:scale-[1.02] hover:shadow-xl hover:shadow-cyan-500/10"
          >
            {/* Button Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Button Content */}
            <div className="relative flex items-center justify-center gap-3">
              <svg className="w-5 h-5 text-cyan-400 transition-all duration-300 transform group-hover:-translate-x-1 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="transform transition-transform duration-300 group-hover:scale-105">Explore Events</span>
            </div>
            
            {/* Bottom Accent Line */}
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>

          <Link
            to="/about"
            className="group relative w-full sm:w-auto px-8 py-4 bg-gradient-to-br from-slate-800/10 to-slate-900/50 border border-blue-500/30 rounded-lg font-medium text-slate-100 overflow-hidden transition-all duration-300 hover:border-blue-400/60 hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/10"
          >
            {/* Button Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Button Content */}
            <div className="relative flex items-center justify-center gap-3">
              <svg className="w-5 h-5 text-blue-400 transition-all duration-300 transform group-hover:translate-x-1 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
              <span className="transform transition-transform duration-300 group-hover:scale-105">Learn More</span>
            </div>
            
            {/* Bottom Accent Line */}
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>
        </div>
      </div>

      {/* Add CSS for floating animation */}
      <style jsx>{`
        @keyframes float0 {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-20px) translateX(10px); }
        }
        @keyframes float1 {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(15px) translateX(-15px); }
        }
        @keyframes float2 {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-10px) translateX(20px); }
        }
      `}</style>
    </section>
  );
}