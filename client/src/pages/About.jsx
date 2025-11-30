import { useState } from 'react';
import { mockMembers } from '@/utils/mockMemberData';
import MemberCardFlip from '@/components/member/MemberCardFlip';

export default function About() {
    const [activeTab, setActiveTab] = useState('club'); // 'college', 'club', 'members'

    // Group members by cluster
    const clusters = {
        'Core Committee': [],
        'Development': [],
        'AI': [],
        'Emerging Tech': [],
        'Competition Management': [],
        'PR': [],
        'Programming': [],
        'Media & Design': [],
    };

    mockMembers.forEach(member => {
        const role = member.role;
        if (role.includes('Development')) clusters['Development'].push(member);
        else if (role.includes('AI')) clusters['AI'].push(member);
        else if (role.includes('Emerging Tech')) clusters['Emerging Tech'].push(member);
        else if (role.includes('Competition')) clusters['Competition Management'].push(member);
        else if (role.includes('PR')) clusters['PR'].push(member);
        else if (role.includes('Programming')) clusters['Programming'].push(member);
        else if (role.includes('Media')) clusters['Media & Design'].push(member);
        else clusters['Core Committee'].push(member);
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden">
            {/* Background Particles */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

            {/* Hero Section */}
            <section className="relative py-20 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                        About Us
                    </h1>
                    <p className="text-xl text-cyan-100/70 max-w-3xl mx-auto mb-12">
                        Building the future of technology, one line of code at a time.
                    </p>

                    {/* Navigation Tabs */}
                    <div className="flex flex-wrap justify-center gap-4 mb-16">
                        {[
                            { id: 'college', label: 'Our College' },
                            { id: 'club', label: 'The Club' },
                            { id: 'members', label: 'Our Team' },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-8 py-3 rounded-xl font-bold text-lg transition-all duration-300 ${activeTab === tab.id
                                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg scale-105'
                                    : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50 hover:text-white'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 pb-20">

                {/* College Section */}
                {activeTab === 'college' && (
                    <div className="animate-fade-in space-y-16">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                            <div className="space-y-6">
                                <h2 className="text-4xl font-bold text-white">KLE Technological University</h2>
                                <p className="text-lg text-slate-300 leading-relaxed">
                                    KLE Technological University (KLE Tech) has a rich heritage of building a culture of innovation and entrepreneurship. The university is known for its unique pedagogical approach and strong industry ties.
                                </p>
                                <p className="text-lg text-slate-300 leading-relaxed">
                                    Located in Belagavi, the campus provides a vibrant ecosystem for students to explore, experiment, and excel in various domains of technology and engineering.
                                </p>
                                <div className="grid grid-cols-2 gap-6 pt-6">
                                    <div className="p-6 rounded-2xl bg-slate-800/50 border border-cyan-500/20">
                                        <div className="text-3xl font-bold text-cyan-400 mb-2">75+</div>
                                        <div className="text-sm text-slate-400">Years of Excellence</div>
                                    </div>
                                    <div className="p-6 rounded-2xl bg-slate-800/50 border border-purple-500/20">
                                        <div className="text-3xl font-bold text-purple-400 mb-2">A+</div>
                                        <div className="text-sm text-slate-400">NAAC Accreditation</div>
                                    </div>
                                </div>
                            </div>
                            <div className="relative h-[400px] rounded-3xl overflow-hidden shadow-2xl border border-white/10 group">
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent z-10" />
                                <img
                                    src="https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                                    alt="KLE Tech Campus"
                                    className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute bottom-0 left-0 p-8 z-20">
                                    <h3 className="text-2xl font-bold text-white mb-2">Belagavi Campus</h3>
                                    <p className="text-slate-300">A hub of innovation and learning</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Club Section */}
                {activeTab === 'club' && (
                    <div className="animate-fade-in space-y-20">
                        {/* Mission & Vision */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="p-10 rounded-3xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-cyan-500/20 relative overflow-hidden group hover:border-cyan-500/40 transition-all duration-300">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                                <div className="relative z-10">
                                    <div className="text-5xl mb-6">🚀</div>
                                    <h3 className="text-3xl font-bold text-white mb-4">Our Mission</h3>
                                    <p className="text-lg text-slate-300 leading-relaxed">
                                        To empower students with technical skills, foster a culture of innovation, and build a community of developers who solve real-world problems.
                                    </p>
                                </div>
                            </div>
                            <div className="p-10 rounded-3xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-purple-500/20 relative overflow-hidden group hover:border-purple-500/40 transition-all duration-300">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                                <div className="relative z-10">
                                    <div className="text-5xl mb-6">👁️</div>
                                    <h3 className="text-3xl font-bold text-white mb-4">Our Vision</h3>
                                    <p className="text-lg text-slate-300 leading-relaxed">
                                        To be the leading student technical community that nurtures future tech leaders and innovators who make a positive impact on society.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* What We Do */}
                        <div className="text-center">
                            <h2 className="text-4xl font-bold text-white mb-12">What We Do</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {[
                                    { title: 'Workshops', icon: '🛠️', desc: 'Hands-on sessions on latest tech' },
                                    { title: 'Hackathons', icon: '🏆', desc: '24-hour coding marathons' },
                                    { title: 'Projects', icon: '💻', desc: 'Real-world application development' },
                                ].map((item, idx) => (
                                    <div key={idx} className="p-8 rounded-2xl bg-slate-800/30 border border-white/5 hover:bg-slate-800/50 transition-all duration-300">
                                        <div className="text-4xl mb-4">{item.icon}</div>
                                        <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                                        <p className="text-slate-400">{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Members Section */}
                {activeTab === 'members' && (
                    <div className="animate-fade-in space-y-24">
                        {Object.entries(clusters).map(([clusterName, members]) => (
                            members.length > 0 && (
                                <div key={clusterName} className="relative">
                                    {/* Cluster Header */}
                                    <div className="flex items-center gap-4 mb-12">
                                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
                                        <h2 className="text-3xl md:text-4xl font-black text-center bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent uppercase tracking-wider">
                                            {clusterName}
                                        </h2>
                                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
                                    </div>

                                    {/* Members Grid */}
                                    <div className="flex flex-wrap justify-center gap-8">
                                        {members.map((member) => (
                                            <div key={member.id} className="w-full max-w-sm sm:w-72 lg:w-80">
                                                <MemberCardFlip {...member} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )
                        ))}
                    </div>
                )}
            </div>

            <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </div>
    );
}
