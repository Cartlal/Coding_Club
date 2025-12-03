import HeroSection from '@/components/home/HeroSection';
import StatsCards from '@/components/home/StatsCards';
import FeaturesSection from '@/components/home/FeaturesSection';
import CTASection from '@/components/home/CTASection';
import BackgroundParticles from '@/components/home/BackgroundParticles';

export default function Home() {
  return (
    <div className="min-h-screen bg-pitch-dark text-white overflow-hidden">
      <BackgroundParticles />

      <HeroSection />
      <StatsCards />
      <FeaturesSection />
      <CTASection />

      <style jsx>{`
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
