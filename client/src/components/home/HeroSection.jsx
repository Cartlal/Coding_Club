import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function HeroSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 20 - 10,
        y: (e.clientY / window.innerHeight) * 20 - 10,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 pt-32 pb-20">
      {/* 3D Floating Geometric Shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-br from-cyan-500/10 to-blue-600/10 rounded-full blur-3xl animate-pulse"
          style={{
            transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
          }}
        />
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-purple-500/10 to-pink-600/10 rounded-full blur-3xl animate-pulse"
          style={{
            transform: `translate(${-mousePosition.x}px, ${-mousePosition.y}px)`,
            animationDelay: '1s',
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto text-center z-10">
        {/* Main Heading with 3D Effect */}
        <h1 className="text-6xl md:text-8xl font-black mb-8 leading-tight animate-slide-up">
          <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent drop-shadow-2xl">
            Build, Learn &
          </span>
          <br />
          <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-400 bg-clip-text text-transparent drop-shadow-2xl">
            Grow Together
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-cyan-100/70 mb-12 max-w-3xl mx-auto leading-relaxed animate-slide-up-delayed">
          Join a vibrant community of developers and innovators at KLE. Master new skills, compete in challenges, and create amazing projects.
        </p>

        {/* CTA Buttons with 3D Effect */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16 animate-slide-up-delayed-2">
          <Link
            to="/events"
            className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-bold text-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/50"
          >
            <span className="relative z-10">Explore Events</span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>
          <Link
            to="/about"
            className="group px-8 py-4 border-2 border-cyan-500/50 rounded-xl font-bold text-lg backdrop-blur-xl bg-slate-800/30 hover:bg-slate-800/50 hover:border-cyan-400 transition-all duration-300 transform hover:scale-105"
          >
            Learn More
          </Link>
        </div>
      </div>
    </section>
  );
}
