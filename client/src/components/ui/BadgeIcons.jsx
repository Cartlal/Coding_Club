import React from 'react';

// Base Badge Container
const BadgeContainer = ({ children, gradientFrom, gradientTo, borderColor }) => (
  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
    <defs>
      <linearGradient id={`grad-${gradientFrom}-${gradientTo}`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={gradientFrom} />
        <stop offset="100%" stopColor={gradientTo} />
      </linearGradient>
      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="2" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    <rect x="5" y="5" width="90" height="90" rx="20" fill={`url(#grad-${gradientFrom}-${gradientTo})`} stroke={borderColor} strokeWidth="2" />
    {children}
  </svg>
);

// 1. ArcStack Newbie
export const ArcStackNewbie = () => (
  <BadgeContainer gradientFrom="#238636" gradientTo="#2ea043" borderColor="#3fb950">
    <circle cx="50" cy="50" r="25" fill="none" stroke="white" strokeWidth="4" strokeDasharray="10 5" />
    <path d="M50 35 L50 65 M35 50 L65 50" stroke="white" strokeWidth="6" strokeLinecap="round" />
  </BadgeContainer>
);

// 2. Workshop Wanderer
export const WorkshopWanderer = () => (
  <BadgeContainer gradientFrom="#1f6feb" gradientTo="#58a6ff" borderColor="#79b8ff">
    <path d="M35 35 L65 65 M65 35 L35 65" stroke="white" strokeWidth="6" strokeLinecap="round" />
    <circle cx="50" cy="50" r="15" fill="none" stroke="white" strokeWidth="4" />
    <rect x="45" y="20" width="10" height="15" fill="white" rx="2" />
    <rect x="45" y="65" width="10" height="15" fill="white" rx="2" />
    <rect x="20" y="45" width="15" height="10" fill="white" rx="2" />
    <rect x="65" y="45" width="15" height="10" fill="white" rx="2" />
  </BadgeContainer>
);

// 3. Event Explorer
export const EventExplorer = () => (
  <BadgeContainer gradientFrom="#8957e5" gradientTo="#a371f7" borderColor="#bc8cff">
    <circle cx="50" cy="50" r="30" fill="none" stroke="white" strokeWidth="4" />
    <path d="M50 25 L55 45 L75 50 L55 55 L50 75 L45 55 L25 50 L45 45 Z" fill="white" />
  </BadgeContainer>
);

// --- CLUSTER BADGES ---

// 4. Development Challenger (Cluster 1)
export const DevelopmentChallenger = () => (
  <BadgeContainer gradientFrom="#da3633" gradientTo="#f85149" borderColor="#ff7b72">
    <path d="M30 50 L45 35 M30 50 L45 65" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <path d="M70 50 L55 35 M70 50 L55 65" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <line x1="45" y1="75" x2="55" y2="25" stroke="white" strokeWidth="4" strokeLinecap="round" />
  </BadgeContainer>
);

// 5. AI/ML Challenger (Cluster 2)
export const AIMLChallenger = () => (
  <BadgeContainer gradientFrom="#9e6a03" gradientTo="#d29922" borderColor="#e3b341">
    <circle cx="50" cy="50" r="8" fill="white" />
    <circle cx="30" cy="35" r="6" fill="white" opacity="0.8" />
    <circle cx="70" cy="35" r="6" fill="white" opacity="0.8" />
    <circle cx="30" cy="65" r="6" fill="white" opacity="0.8" />
    <circle cx="70" cy="65" r="6" fill="white" opacity="0.8" />
    <path d="M50 50 L30 35 M50 50 L70 35 M50 50 L30 65 M50 50 L70 65" stroke="white" strokeWidth="2" />
  </BadgeContainer>
);

// 6. Emerging Tech Explorer (Cluster 3)
export const EmergingTechExplorer = () => (
  <BadgeContainer gradientFrom="#1b1f24" gradientTo="#30363d" borderColor="#8b949e">
    <path d="M50 20 L70 40 L70 70 L30 70 L30 40 Z" fill="none" stroke="white" strokeWidth="4" />
    <circle cx="50" cy="55" r="10" fill="white" />
    <path d="M50 20 L50 35" stroke="white" strokeWidth="4" />
    <path d="M30 70 L20 80 M70 70 L80 80" stroke="white" strokeWidth="4" />
  </BadgeContainer>
);

// 7. Compete Commander (Cluster 4)
export const CompeteCommander = () => (
  <BadgeContainer gradientFrom="#bf3989" gradientTo="#db61a2" borderColor="#f778ba">
    <rect x="30" y="25" width="40" height="50" rx="4" fill="none" stroke="white" strokeWidth="4" />
    <line x1="40" y1="40" x2="60" y2="40" stroke="white" strokeWidth="4" strokeLinecap="round" />
    <line x1="40" y1="55" x2="60" y2="55" stroke="white" strokeWidth="4" strokeLinecap="round" />
    <path d="M45 25 L45 20 L55 20 L55 25" stroke="white" strokeWidth="4" fill="none" />
  </BadgeContainer>
);

// 8. Programming Prodigy (Cluster 5)
export const ProgrammingProdigy = () => (
  <BadgeContainer gradientFrom="#0969da" gradientTo="#218bff" borderColor="#54aeff">
    <rect x="20" y="25" width="60" height="50" rx="4" fill="#0d1117" stroke="white" strokeWidth="3" />
    <path d="M30 40 L40 50 L30 60" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none" />
    <line x1="45" y1="60" x2="60" y2="60" stroke="white" strokeWidth="3" strokeLinecap="round" />
  </BadgeContainer>
);

// 9. Creative Visionary (Cluster 6)
export const CreativeVisionary = () => (
  <BadgeContainer gradientFrom="#cf222e" gradientTo="#ff7b72" borderColor="#ffa198">
    <path d="M30 70 Q 20 20 70 30 Q 80 80 30 70" fill="none" stroke="white" strokeWidth="4" />
    <circle cx="45" cy="45" r="5" fill="white" />
    <path d="M60 60 L75 75" stroke="white" strokeWidth="6" strokeLinecap="round" />
  </BadgeContainer>
);

// 10. PR Ambassador (Cluster 7)
export const PRAmbassador = () => (
  <BadgeContainer gradientFrom="#6e7681" gradientTo="#8b949e" borderColor="#c9d1d9">
    <path d="M30 35 L60 25 L60 55 L30 45 Z" fill="none" stroke="white" strokeWidth="4" strokeLinejoin="round" />
    <path d="M60 35 L75 25 M60 40 L80 40 M60 45 L75 55" stroke="white" strokeWidth="3" strokeLinecap="round" />
    <path d="M30 40 L30 70" stroke="white" strokeWidth="6" strokeLinecap="round" />
  </BadgeContainer>
);

// --- PERFORMANCE BADGES ---

// 11. Game Master
export const GameMaster = () => (
  <BadgeContainer gradientFrom="#6639ba" gradientTo="#8a63d2" borderColor="#a475f9">
    <rect x="25" y="35" width="50" height="30" rx="10" fill="none" stroke="white" strokeWidth="4" />
    <circle cx="60" cy="50" r="4" fill="white" />
    <circle cx="40" cy="50" r="4" fill="white" />
    <path d="M35 45 L35 55 M30 50 L40 50" stroke="white" strokeWidth="3" strokeLinecap="round" />
  </BadgeContainer>
);

// 12. Top 10 Performer
export const Top10Performer = () => (
  <BadgeContainer gradientFrom="#57606a" gradientTo="#8c959f" borderColor="#b1bac4">
    <circle cx="50" cy="50" r="30" fill="none" stroke="white" strokeWidth="4" strokeDasharray="5 5" />
    <text x="50" y="60" textAnchor="middle" fill="white" fontSize="24" fontWeight="bold" fontFamily="sans-serif">#10</text>
  </BadgeContainer>
);

// 13. Top 3 Elite
export const Top3Elite = () => (
  <BadgeContainer gradientFrom="#9e6a03" gradientTo="#f0883e" borderColor="#ffdf5d">
    <path d="M25 45 L35 65 L50 55 L65 65 L75 45 L50 25 Z" fill="none" stroke="white" strokeWidth="4" strokeLinejoin="round" />
    <circle cx="50" cy="40" r="3" fill="white" />
    <circle cx="35" cy="50" r="3" fill="white" />
    <circle cx="65" cy="50" r="3" fill="white" />
  </BadgeContainer>
);

// --- DEDICATION & CONSISTENCY BADGES ---

// 14. Consistency Champion
export const ConsistencyChampion = () => (
  <BadgeContainer gradientFrom="#0969da" gradientTo="#54aeff" borderColor="#80ccff">
    <path d="M50 25 L60 45 L80 45 L65 60 L70 80 L50 65 L30 80 L35 60 L20 45 L40 45 Z" fill="none" stroke="white" strokeWidth="4" strokeLinejoin="round" />
    <path d="M50 35 L50 55" stroke="white" strokeWidth="2" />
  </BadgeContainer>
);

// 15. ArcStack Legendary
export const ArcStackLegendary = () => (
  <BadgeContainer gradientFrom="#bd561d" gradientTo="#f0883e" borderColor="#ffb77c">
    <defs>
      <linearGradient id="legendary-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffd700" />
        <stop offset="100%" stopColor="#ffaa00" />
      </linearGradient>
    </defs>
    <path d="M50 15 L60 40 L85 40 L65 55 L75 80 L50 65 L25 80 L35 55 L15 40 L40 40 Z" fill="url(#legendary-grad)" stroke="white" strokeWidth="2" />
    <circle cx="50" cy="50" r="10" fill="white" opacity="0.8" />
  </BadgeContainer>
);

export const BadgeMap = {
  'ArcStack Newbie': ArcStackNewbie,
  'Workshop Wanderer': WorkshopWanderer,
  'Event Explorer': EventExplorer,
  'Development Challenger': DevelopmentChallenger,
  'AI/ML Challenger': AIMLChallenger,
  'Emerging Tech Explorer': EmergingTechExplorer,
  'Compete Commander': CompeteCommander,
  'Programming Prodigy': ProgrammingProdigy,
  'Creative Visionary': CreativeVisionary,
  'PR Ambassador': PRAmbassador,
  'Game Master': GameMaster,
  'Top 10 Performer': Top10Performer,
  'Top 3 Elite': Top3Elite,
  'Consistency Champion': ConsistencyChampion,
  'ArcStack Legendary': ArcStackLegendary,
};

export default BadgeMap;
