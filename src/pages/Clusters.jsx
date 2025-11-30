import { useState } from 'react';
import { mockClusters } from '@/utils/mockClusterData';

export default function Clusters() {
    const [activeCluster, setActiveCluster] = useState(mockClusters[0].id);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden">
            {/* Background Particles */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

            <div className="relative max-w-7xl mx-auto px-4 pt-32 pb-20">
                {/* Header */}
                <div className="text-center mb-20">
                    <h1 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                        Our Clusters
                    </h1>
                    <p className="text-xl text-cyan-100/70 max-w-3xl mx-auto">
                        Specialized domains where innovation happens. Explore our diverse technical and creative clusters.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Sidebar Navigation */}
                    <div className="lg:col-span-4 space-y-4">
                        {mockClusters.map((cluster) => (
                            <button
                                key={cluster.id}
                                onClick={() => setActiveCluster(cluster.id)}
                                className={`w-full text-left p-4 rounded-xl transition-all duration-300 border group ${activeCluster === cluster.id
                                    ? `bg-gradient-to-r ${cluster.gradient} border-transparent shadow-lg transform scale-105`
                                    : `bg-slate-800/30 border-slate-700/50 hover:bg-slate-800/50 hover:border-${cluster.text.split('-')[1]}-500/50`
                                    }`}
                            >
                                <div className="flex items-center gap-4">
                                    <span className="text-2xl">{cluster.icon}</span>
                                    <span className={`font-bold text-lg ${activeCluster === cluster.id ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>
                                        {cluster.name}
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Main Content Area */}
                    <div className="lg:col-span-8">
                        {mockClusters.map((cluster) => (
                            activeCluster === cluster.id && (
                                <div key={cluster.id} className="animate-fade-in">
                                    {/* 3D Card Container */}
                                    <div className="relative perspective-1000">
                                        <div className="relative transform transition-all duration-500 hover:rotate-y-2">
                                            {/* Glow */}
                                            <div className={`absolute -inset-1 bg-gradient-to-r ${cluster.gradient} rounded-3xl blur-xl opacity-30`} />

                                            {/* Card Content */}
                                            <div className={`relative backdrop-blur-xl bg-gradient-to-br from-slate-800/90 to-slate-900/90 border ${cluster.border} rounded-3xl p-8 md:p-12 shadow-2xl`}>

                                                {/* Header */}
                                                <div className="flex items-center gap-6 mb-8">
                                                    <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${cluster.gradient} flex items-center justify-center text-5xl shadow-lg`}>
                                                        {cluster.icon}
                                                    </div>
                                                    <div>
                                                        <h2 className={`text-3xl md:text-4xl font-black bg-gradient-to-r ${cluster.gradient} bg-clip-text text-transparent mb-2`}>
                                                            {cluster.name}
                                                        </h2>
                                                        <div className="flex flex-wrap gap-2">
                                                            {cluster.focusAreas.slice(0, 3).map((area, idx) => (
                                                                <span key={idx} className="px-3 py-1 rounded-full bg-slate-800/50 border border-white/10 text-xs text-slate-300">
                                                                    {area}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Description */}
                                                <div className="mb-10">
                                                    <h3 className={`text-xl font-bold ${cluster.text} mb-4 flex items-center gap-2`}>
                                                        <span>📝</span> About the Cluster
                                                    </h3>
                                                    <p className="text-lg text-slate-300 leading-relaxed">
                                                        {cluster.description}
                                                    </p>
                                                </div>

                                                {/* Foundation Idea */}
                                                <div className="mb-10 p-6 rounded-2xl bg-slate-800/50 border border-white/5">
                                                    <h3 className={`text-xl font-bold ${cluster.text} mb-4 flex items-center gap-2`}>
                                                        <span>💡</span> The Foundation Idea
                                                    </h3>
                                                    <p className="text-slate-300 italic leading-relaxed">
                                                        "{cluster.foundation}"
                                                    </p>
                                                </div>

                                                {/* Technologies */}
                                                <div>
                                                    <h3 className={`text-xl font-bold ${cluster.text} mb-4 flex items-center gap-2`}>
                                                        <span>🛠️</span> Technologies & Tools
                                                    </h3>
                                                    <div className="flex flex-wrap gap-3">
                                                        {cluster.technologies.map((tech, idx) => (
                                                            <span
                                                                key={idx}
                                                                className={`px-4 py-2 rounded-lg bg-slate-800/50 border ${cluster.border} text-slate-200 font-medium hover:bg-slate-700/50 transition-colors`}
                                                            >
                                                                {tech}
                                                            </span>
                                                        ))}
                                                    </div>
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
        .perspective-1000 {
          perspective: 1000px;
        }
        .rotate-y-2 {
          transform: rotateY(2deg);
        }
      `}</style>
        </div>
    );
}
