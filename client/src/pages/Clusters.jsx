import { useState, useEffect } from 'react';
import { mockClusters } from '../utils/mockClusterData';
import { FaLaptopCode, FaBrain, FaRocket, FaTrophy, FaLightbulb, FaPalette, FaNewspaper, FaGraduationCap, FaCodeBranch, FaWrench } from 'react-icons/fa6';

export default function Clusters() {
    const [activeCluster, setActiveCluster] = useState(mockClusters[0].id);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    // Map cluster IDs to proper icons
    const iconMap = {
        'development': <FaLaptopCode className="w-8 h-8" />,
        'ai': <FaBrain className="w-8 h-8" />,
        'emerging-tech': <FaRocket className="w-8 h-8" />,
        'competition': <FaTrophy className="w-8 h-8" />,
        'programming': <FaLightbulb className="w-8 h-8" />,
        'media-design': <FaPalette className="w-8 h-8" />,
        'pr': <FaNewspaper className="w-8 h-8" />,
    };

    const colorMap = {
        'development': { accent: 'cyan', gradient: 'from-cyan-400 to-blue-500', border: 'border-cyan-400/30' },
        'ai': { accent: 'purple', gradient: 'from-purple-400 to-indigo-500', border: 'border-purple-400/30' },
        'emerging-tech': { accent: 'emerald', gradient: 'from-emerald-400 to-teal-500', border: 'border-emerald-400/30' },
        'competition': { accent: 'amber', gradient: 'from-amber-400 to-orange-500', border: 'border-amber-400/30' },
        'programming': { accent: 'indigo', gradient: 'from-indigo-400 to-violet-500', border: 'border-indigo-400/30' },
        'media-design': { accent: 'rose', gradient: 'from-rose-400 to-pink-500', border: 'border-rose-400/30' },
        'pr': { accent: 'yellow', gradient: 'from-yellow-400 to-amber-500', border: 'border-yellow-400/30' },
    };

    const activeColors = colorMap[activeCluster] || colorMap.development;

    return (
        <div className="min-h-screen text-white overflow-hidden">
            {/* Animated Tech Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                {/* Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-5" />
                
                {/* Animated Grid Lines */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_49%,#0ea5e9_50%,transparent_51%)] bg-[length:60px_60px] animate-grid-flow-x" />
                    <div className="absolute inset-0 bg-[linear-gradient(transparent_49%,#0ea5e9_50%,transparent_51%)] bg-[length:60px_60px] animate-grid-flow-y" />
                </div>
                
                {/* Floating Particles */}
                {[...Array(15)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-[2px] h-[2px] bg-cyan-400/20 rounded-full animate-float"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${i * 0.2}s`,
                            animationDuration: `${4 + Math.random() * 3}s`,
                        }}
                    />
                ))}
            </div>

            <div className={`relative max-w-7xl mx-auto px-4 pt-28 pb-20 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                {/* Header with Tech Brackets */}
                <div className="text-center mb-16 relative">
                    {/* Corner Brackets */}
                    <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-cyan-400/30" />
                    <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-cyan-400/30" />
                    
                    <div className="inline-block relative mb-6">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
                            <span className="text-cyan-400 font-mono text-sm tracking-wider uppercase">Specialized Domains</span>
                            <div className="w-8 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
                        </div>
                        
                        <h1 className="text-5xl md:text-6xl font-bold mb-4 tracking-tight">
                            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 bg-[length:200%_auto] bg-clip-text text-transparent animate-gradient">
                                Technical Clusters
                            </span>
                        </h1>
                    </div>
                    
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto font-light tracking-wide leading-relaxed">
                        Explore our specialized domains where innovation happens. Each cluster focuses on cutting-edge technologies and creative disciplines.
                    </p>
                    
                    {/* Stats Bar */}
                    <div className="flex justify-center gap-6 mt-8 text-sm">
                        <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-800/30 border border-slate-700/50">
                            <FaGraduationCap className="w-3 h-3 text-cyan-400" />
                            <span className="text-slate-300 font-mono">{mockClusters.length}</span>
                            <span className="text-slate-500">Clusters</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-800/30 border border-slate-700/50">
                            <FaCodeBranch className="w-3 h-3 text-emerald-400" />
                            <span className="text-slate-300 font-mono">50+</span>
                            <span className="text-slate-500">Technologies</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-800/30 border border-slate-700/50">
                            <FaWrench className="w-3 h-3 text-purple-400" />
                            <span className="text-slate-300 font-mono">100+</span>
                            <span className="text-slate-500">Projects</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Sidebar Navigation */}
                    <div className="lg:col-span-4">
                        <div className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-1 h-6 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full" />
                                <h2 className="text-lg font-semibold text-slate-200">Clusters</h2>
                                <div className="ml-auto text-xs font-mono text-slate-500 px-2 py-1 rounded bg-slate-800/50">
                                    {mockClusters.length}/7
                                </div>
                            </div>
                            
                            <div className="space-y-3">
                                {mockClusters.map((cluster) => {
                                    const colors = colorMap[cluster.id];
                                    const isActive = activeCluster === cluster.id;
                                    
                                    return (
                                        <button
                                            key={cluster.id}
                                            onClick={() => setActiveCluster(cluster.id)}
                                            className={`w-full text-left p-4 rounded-xl transition-all duration-300 border group ${isActive
                                                ? `bg-gradient-to-r from-${colors.accent}-500/20 to-${colors.accent}-600/20 border-${colors.accent}-400/50`
                                                : `bg-slate-800/30 border-slate-700/50 hover:border-slate-600/70 hover:bg-slate-800/50`
                                                }`}
                                        >
                                            <div className="flex items-center gap-4">
                                                {/* Icon Container */}
                                                <div className={`relative w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                                                    isActive
                                                        ? `bg-gradient-to-br from-${colors.accent}-500/30 to-${colors.accent}-600/30`
                                                        : 'bg-slate-800/50 group-hover:bg-slate-700/50'
                                                }`}>
                                                    <div className={`transition-all duration-300 ${
                                                        isActive ? `text-${colors.accent}-400` : 'text-slate-400 group-hover:text-slate-300'
                                                    }`}>
                                                        {iconMap[cluster.id]}
                                                    </div>
                                                    
                                                    {/* Active Indicator */}
                                                    {isActive && (
                                                        <div className="absolute -top-1 -right-1">
                                                            <div className="flex gap-0.5">
                                                                {[1, 2, 3].map(dot => (
                                                                    <div
                                                                        key={dot}
                                                                        className={`w-1.5 h-1.5 bg-${colors.accent}-400 rounded-full animate-pulse`}
                                                                        style={{ animationDelay: `${dot * 0.1}s` }}
                                                                    />
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                                
                                                {/* Cluster Info */}
                                                <div className="flex-1">
                                                    <h3 className={`font-semibold transition-all duration-300 ${
                                                        isActive ? `text-${colors.accent}-300` : 'text-slate-200 group-hover:text-slate-100'
                                                    }`}>
                                                        {cluster.name}
                                                    </h3>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <div className="flex -space-x-1">
                                                            {[1, 2, 3].map((i) => (
                                                                <div
                                                                    key={i}
                                                                    className={`w-4 h-4 rounded-full border border-slate-800 bg-gradient-to-br from-${colors.accent}-500/20 to-${colors.accent}-600/20`}
                                                                />
                                                            ))}
                                                        </div>
                                                        <span className="text-xs font-mono text-slate-500">
                                                            {cluster.focusAreas.length} focus areas
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="lg:col-span-8">
                        {mockClusters.map((cluster) => (
                            activeCluster === cluster.id && (
                                <div key={cluster.id} className="animate-fade-in">
                                    {/* Main Cluster Card */}
                                    <div className="relative">
                                        {/* Outer Glow Ring */}
                                        <div className={`absolute -inset-1 bg-gradient-to-br ${activeColors.gradient} rounded-2xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-500`} />
                                        
                                        {/* Inner Card */}
                                        <div className="relative bg-gradient-to-br from-slate-900/80 to-slate-800/80 border border-slate-700/50 rounded-2xl p-8 backdrop-blur-sm">
                                            {/* Corner Brackets */}
                                            <div className="absolute top-4 left-4 w-3 h-3 border-t border-l border-slate-500/50" />
                                            <div className="absolute top-4 right-4 w-3 h-3 border-t border-r border-slate-500/50" />
                                            <div className="absolute bottom-4 left-4 w-3 h-3 border-b border-l border-slate-500/50" />
                                            <div className="absolute bottom-4 right-4 w-3 h-3 border-b border-r border-slate-500/50" />
                                            
                                            {/* Header */}
                                            <div className="flex items-start gap-6 mb-8">
                                                {/* Icon Container */}
                                                <div className={`relative w-20 h-20 rounded-xl flex items-center justify-center bg-gradient-to-br from-${activeColors.accent}-500/20 to-${activeColors.accent}-600/20 border border-${activeColors.accent}-400/30`}>
                                                    <div className={`text-${activeColors.accent}-400`}>
                                                        {iconMap[cluster.id]}
                                                    </div>
                                                    {/* Status Indicator */}
                                                    <div className="absolute -top-1 -right-1">
                                                        <div className="relative">
                                                            <div className={`absolute inset-0 bg-${activeColors.accent}-400 rounded-full animate-ping opacity-20`} />
                                                            <div className={`relative w-2.5 h-2.5 bg-${activeColors.accent}-400 rounded-full border border-slate-800`} />
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                {/* Title and Tags */}
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-3">
                                                        <h2 className="text-3xl font-bold text-slate-100 tracking-tight">
                                                            {cluster.name}
                                                        </h2>
                                                        <div className="text-xs font-mono text-slate-500 px-2 py-1 rounded bg-slate-800/50">
                                                            ID: {cluster.id.toUpperCase()}
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-wrap gap-2">
                                                        {cluster.focusAreas.slice(0, 4).map((area, idx) => (
                                                            <span
                                                                key={idx}
                                                                className={`px-3 py-1 rounded-lg bg-slate-800/50 border border-${activeColors.accent}-400/20 text-${activeColors.accent}-300 text-xs font-medium`}
                                                            >
                                                                {area}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Description */}
                                            <div className="mb-10">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <div className="w-1 h-6 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full" />
                                                    <h3 className="text-xl font-semibold text-slate-200">
                                                        Cluster Overview
                                                    </h3>
                                                </div>
                                                <p className="text-slate-300 leading-relaxed font-light">
                                                    {cluster.description}
                                                </p>
                                            </div>

                                            {/* Foundation Idea */}
                                            <div className="mb-10 p-6 rounded-xl bg-slate-900/50 border border-slate-700/50">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br from-${activeColors.accent}-500/20 to-${activeColors.accent}-600/20 flex items-center justify-center`}>
                                                        <FaLightbulb className={`w-4 h-4 text-${activeColors.accent}-400`} />
                                                    </div>
                                                    <h3 className="text-lg font-semibold text-slate-200">
                                                        Vision & Mission
                                                    </h3>
                                                </div>
                                                <div className="relative">
                                                    <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-slate-600/50" />
                                                    <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-slate-600/50" />
                                                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-slate-600/50" />
                                                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-slate-600/50" />
                                                    <p className="text-slate-300 italic leading-relaxed font-light p-4">
                                                        "{cluster.foundation}"
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Technologies */}
                                            <div>
                                                <div className="flex items-center gap-3 mb-6">
                                                    <div className="w-1 h-6 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full" />
                                                    <h3 className="text-xl font-semibold text-slate-200">
                                                        Tech Stack & Tools
                                                    </h3>
                                                    <div className="ml-auto text-xs font-mono text-slate-500">
                                                        {cluster.technologies.length} technologies
                                                    </div>
                                                </div>
                                                <div className="flex flex-wrap gap-3">
                                                    {cluster.technologies.map((tech, idx) => (
                                                        <span
                                                            key={idx}
                                                            className={`px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-200 font-medium hover:border-${activeColors.accent}-400/30 hover:bg-${activeColors.accent}-500/10 hover:text-${activeColors.accent}-300 transition-all duration-300 cursor-default group/tech`}
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                <span>{tech}</span>
                                                                <span className="opacity-0 group-hover/tech:opacity-100 text-xs">→</span>
                                                            </div>
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        ))}
                    </div>
                </div>
            </div>

            <style jsx>{`
                .animate-fade-in {
                    animation: fadeIn 0.5s ease-out forwards;
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateX(20px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                
                @keyframes grid-flow-x {
                    0% { background-position-x: 0px; }
                    100% { background-position-x: 60px; }
                }
                
                @keyframes grid-flow-y {
                    0% { background-position-y: 0px; }
                    100% { background-position-y: 60px; }
                }
                
                @keyframes float {
                    0%, 100% {
                        transform: translateY(0) translateX(0);
                        opacity: 0;
                    }
                    10% { opacity: 0.3; }
                    50% {
                        opacity: 0.1;
                        transform: translateY(-15px) translateX(5px);
                    }
                    90% { opacity: 0.3; }
                }
                
                @keyframes gradient {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                
                .animate-grid-flow-x {
                    animation: grid-flow-x 30s linear infinite;
                }
                
                .animate-grid-flow-y {
                    animation: grid-flow-y 40s linear infinite;
                }
                
                .animate-float {
                    animation: float var(--duration) ease-in-out infinite;
                }
                
                .animate-gradient {
                    background-size: 200% auto;
                    animation: gradient 3s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}