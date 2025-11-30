import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
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

  const features = [
    {
      title: 'Skill Development',
      description: 'Learn from industry experts through workshops, bootcamps, and mentoring sessions',
      icon: '📚',
      gradient: 'from-cyan-500 to-blue-600',
    },
    {
      title: 'Competitions',
      description: 'Participate in coding contests and hackathons to challenge yourself',
      icon: '🎯',
      gradient: 'from-purple-500 to-pink-600',
    },
    {
      title: 'Networking',
      description: 'Connect with like-minded developers and build lasting professional relationships',
      icon: '🤝',
      gradient: 'from-green-500 to-teal-600',
    },
    {
      title: 'Projects',
      description: 'Collaborate on real-world projects and build your portfolio',
      icon: '💻',
      gradient: 'from-orange-500 to-red-600',
    },
    {
      title: 'Mentorship',
      description: 'Get guidance from experienced members and senior developers',
      icon: '👨‍🏫',
      gradient: 'from-yellow-500 to-amber-600',
    },
    {
      title: 'Community',
      description: 'Be part of a supportive community that celebrates your growth',
      icon: '❤️',
      gradient: 'from-rose-500 to-fuchsia-600',
    },
  ];

  const stats = [
    { number: '500+', label: 'Active Members', icon: '👥' },
    { number: '50+', label: 'Events Annually', icon: '📅' },
    { number: '15+', label: 'Years Strong', icon: '🏆' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden">
      {/* Animated Background Particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-cyan-400/30 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${5 + Math.random() * 10}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Hero Section */}
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
          {/* Badge removed per request */}

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

          {/* Stats Cards with 3D Floating Effect */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="group relative perspective-1000 animate-slide-up-delayed-3"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative transform transition-all duration-500 group-hover:rotate-y-12 group-hover:-translate-y-2">
                  {/* 3D Shadow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Card */}
                  <div className="relative backdrop-blur-xl bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-cyan-500/30 rounded-2xl p-6 shadow-2xl">
                    <div className="text-5xl mb-3">{stat.icon}</div>
                    <div className="text-4xl font-black bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">
                      {stat.number}
                    </div>
                    <div className="text-cyan-100/70 font-medium">{stat.label}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-cyan-500/50 rounded-full flex justify-center pt-2">
            <div className="w-1 h-3 bg-cyan-400 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* Features Section with 3D Cards */}
      <section className="relative py-32 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Why Join Us?
            </h2>
            <p className="text-xl text-cyan-100/70 max-w-2xl mx-auto">
              Discover the opportunities and benefits of being part of our thriving developer community
            </p>
          </div>

          {/* 3D Feature Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative perspective-1000"
                style={{
                  animation: 'slide-up 0.6s ease-out forwards',
                  animationDelay: `${index * 0.1}s`,
                  opacity: 0,
                }}
              >
                {/* 3D Transform Container */}
                <div className="relative transform transition-all duration-500 group-hover:scale-105 group-hover:-translate-y-3">
                  {/* Glow Effect */}
                  <div className={`absolute -inset-0.5 bg-gradient-to-r ${feature.gradient} rounded-2xl opacity-0 group-hover:opacity-75 blur-xl transition-all duration-500`} />

                  {/* Card */}
                  <div className="relative h-full backdrop-blur-xl bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-cyan-500/30 rounded-2xl p-8 shadow-2xl group-hover:border-cyan-400/50 transition-all duration-500">
                    {/* Icon with 3D Effect */}
                    <div className="text-6xl mb-6 transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12">
                      {feature.icon}
                    </div>

                    {/* Title */}
                    <h3 className={`text-2xl font-black mb-4 bg-gradient-to-r ${feature.gradient} bg-clip-text text-transparent`}>
                      {feature.title}
                    </h3>

                    {/* Description */}
                    <p className="text-cyan-100/70 leading-relaxed">
                      {feature.description}
                    </p>

                    {/* Decorative Corner */}
                    <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${feature.gradient} opacity-10 rounded-bl-full`} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section with 3D Effect */}
      <section className="relative py-32 px-4">
        <div className="max-w-5xl mx-auto">
          {/* 3D Card Container */}
          <div className="relative perspective-1000">
            {/* Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 rounded-3xl blur-2xl opacity-50 animate-pulse" />

            {/* Card */}
            <div className="relative backdrop-blur-xl bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-cyan-500/30 rounded-3xl p-12 md:p-16 text-center shadow-2xl">
              <h2 className="text-4xl md:text-5xl font-black mb-6 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                Ready to Start Your Journey?
              </h2>
              <p className="text-xl text-cyan-100/70 mb-10 max-w-2xl mx-auto">
                Join hundreds of students who are already building amazing projects and advancing their careers
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link
                  to="/signup"
                  className="group relative px-10 py-5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-bold text-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/50"
                >
                  <span className="relative z-10">Join Now</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
                <Link
                  to="/events"
                  className="px-10 py-5 border-2 border-cyan-500/50 rounded-xl font-bold text-lg backdrop-blur-xl bg-slate-800/30 hover:bg-slate-800/50 hover:border-cyan-400 transition-all duration-300 transform hover:scale-105"
                >
                  Browse Events
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(-20px) translateX(10px);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-float {
          animation: float linear infinite;
        }

        .animate-slide-up {
          animation: slide-up 0.8s ease-out forwards;
        }

        .animate-slide-up-delayed {
          animation: slide-up 0.8s ease-out 0.2s forwards;
          opacity: 0;
        }

        .animate-slide-up-delayed-2 {
          animation: slide-up 0.8s ease-out 0.4s forwards;
          opacity: 0;
        }

        .animate-slide-up-delayed-3 {
          animation: slide-up 0.8s ease-out 0.6s forwards;
          opacity: 0;
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .perspective-1000 {
          perspective: 1000px;
        }

        .rotate-y-12 {
          transform: rotateY(12deg);
        }
      `}</style>
    </div>
  );
}
