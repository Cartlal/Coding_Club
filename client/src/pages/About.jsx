import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { mockMembers } from '@/utils/mockMemberData';
import { mockFacultyMembers } from '@/utils/mockFacultyData';
import MemberCardFlip from '@/components/member/MemberCardFlip';
import { FaCode, FaRocket, FaUsers, FaLightbulb, FaTrophy, FaHandshake } from 'react-icons/fa6';

export default function About() {
    const location = useLocation();
    const [activeTab, setActiveTab] = useState('club'); // 'college', 'club', 'members'

    // Handle URL hash navigation
    useEffect(() => {
        if (location.hash === '#members') {
            setActiveTab('members');
        }
    }, [location]);

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
        <div className="min-h-screen bg-pitch-dark text-white overflow-hidden">
            {/* Animated Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                
                {/* Grid Background */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-10" />
            </div>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-4">
                <div className="max-w-7xl mx-auto">
                    {/* Tech Header */}
                    <div className="text-center mb-12">
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <span className="text-cyan-400 font-mono text-sm">&lt;</span>
                            <span className="text-cyan-400 font-mono text-xs">about</span>
                            <span className="text-cyan-400 font-mono text-sm">&gt;</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight font-mono">
                            <span className="text-white">
                                About Our Club
                            </span>
                        </h1>
                        <p className="text-lg text-slate-400 max-w-3xl mx-auto font-light tracking-wide">
                            Building the future of technology, one line of code at a time. A community of passionate developers, innovators, and problem-solvers.
                        </p>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="flex flex-wrap justify-center gap-3 mb-16">
                        {[
                            { id: 'college', label: 'Our College' },
                            { id: 'club', label: 'The Club' },
                            { id: 'members', label: 'Our Team' },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`group relative px-6 py-3 rounded-xl font-mono font-bold transition-all duration-300 border ${activeTab === tab.id
                                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border-cyan-400/50 text-white shadow-lg shadow-cyan-500/20'
                                    : 'border-slate-700/50 text-slate-400 hover:text-white hover:border-slate-600/70 hover:bg-slate-800/30'
                                    }`}
                            >
                                {tab.label}
                                {activeTab === tab.id && (
                                    <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full" />
                                )}
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
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30">
                                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                                    <span className="text-xs font-mono text-cyan-400">INSTITUTION</span>
                                </div>
                                <h2 className="text-5xl font-bold text-white font-mono">KLE Technological University</h2>
                                <div className="space-y-4">
                                    <p className="text-lg text-slate-300 leading-relaxed font-light">
                                        KLE Technological University (KLE Tech) has a rich heritage of building a culture of innovation and entrepreneurship. The university is known for its unique pedagogical approach and strong industry ties.
                                    </p>
                                    <p className="text-lg text-slate-300 leading-relaxed font-light">
                                        Located in Belagavi, the campus provides a vibrant ecosystem for students to explore, experiment, and excel in various domains of technology and engineering.
                                    </p>
                                </div>
                                
                                {/* Stats Grid */}
                                <div className="grid grid-cols-2 gap-4 pt-6">
                                    <div className="p-5 rounded-xl bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 border border-cyan-500/30 hover:border-cyan-500/50 transition-all">
                                        <div className="text-3xl font-black text-cyan-400 mb-2 font-mono">75+</div>
                                        <div className="text-xs text-slate-400 font-mono">Years of Excellence</div>
                                    </div>
                                    <div className="p-5 rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/30 hover:border-purple-500/50 transition-all">
                                        <div className="text-3xl font-black text-purple-400 mb-2 font-mono">A+</div>
                                        <div className="text-xs text-slate-400 font-mono">NAAC Rating</div>
                                    </div>
                                    <div className="p-5 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/30 hover:border-blue-500/50 transition-all">
                                        <div className="text-3xl font-black text-blue-400 mb-2 font-mono">10k+</div>
                                        <div className="text-xs text-slate-400 font-mono">Students</div>
                                    </div>
                                    <div className="p-5 rounded-xl bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/30 hover:border-green-500/50 transition-all">
                                        <div className="text-3xl font-black text-green-400 mb-2 font-mono">500+</div>
                                        <div className="text-xs text-slate-400 font-mono">Faculty</div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Image Section */}
                            <div className="relative group">
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-3xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300" />
                                <div className="relative h-[400px] rounded-3xl overflow-hidden shadow-2xl border border-slate-700/50">
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent z-10" />
                                    <img
                                        src="kle-building.jpg"
                                        alt="KLE Tech Campus"
                                        className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute bottom-0 left-0 p-6 z-20">
                                        <h3 className="text-2xl font-bold text-white mb-1">Belagavi Campus</h3>
                                        <p className="text-slate-300 text-sm font-mono">A hub of innovation and learning</p>
                                    </div>
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
                            <div className="group relative p-8 rounded-2xl bg-gradient-to-br from-slate-900/50 to-slate-800/50 border border-cyan-500/30 hover:border-cyan-500/60 transition-all duration-300 overflow-hidden">
                                <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:opacity-100 opacity-50 transition-opacity" />
                                <div className="relative z-10">
                                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-cyan-500/10 border border-cyan-500/30 mb-6">
                                        <FaRocket className="w-8 h-8 text-cyan-400" />
                                    </div>
                                    <h3 className="text-3xl font-black text-white mb-4 font-mono">Our Mission</h3>
                                    <p className="text-lg text-slate-300 leading-relaxed font-light">
                                        To empower students with cutting-edge technical skills, foster a culture of innovation, and build a thriving community of developers who solve real-world problems through technology.
                                    </p>
                                </div>
                                
                                {/* Corner Accents */}
                                <div className="absolute top-3 left-3 w-2 h-2 border-t border-l border-cyan-500/50" />
                                <div className="absolute bottom-3 right-3 w-2 h-2 border-b border-r border-cyan-500/50" />
                            </div>
                            
                            <div className="group relative p-8 rounded-2xl bg-gradient-to-br from-slate-900/50 to-slate-800/50 border border-purple-500/30 hover:border-purple-500/60 transition-all duration-300 overflow-hidden">
                                <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:opacity-100 opacity-50 transition-opacity" />
                                <div className="relative z-10">
                                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-purple-500/10 border border-purple-500/30 mb-6">
                                        <FaLightbulb className="w-8 h-8 text-purple-400" />
                                    </div>
                                    <h3 className="text-3xl font-black text-white mb-4 font-mono">Our Vision</h3>
                                    <p className="text-lg text-slate-300 leading-relaxed font-light">
                                        To be the leading student technical community that nurtures future tech leaders and innovators who make a lasting positive impact on society and the tech industry.
                                    </p>
                                </div>
                                
                                {/* Corner Accents */}
                                <div className="absolute top-3 left-3 w-2 h-2 border-t border-l border-purple-500/50" />
                                <div className="absolute bottom-3 right-3 w-2 h-2 border-b border-r border-purple-500/50" />
                            </div>
                        </div>

                        {/* What We Do */}
                        <div className="text-center">
                            <div className="mb-12">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 mb-4">
                                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                                    <span className="text-xs font-mono text-cyan-400">OUR ACTIVITIES</span>
                                </div>
                                <h2 className="text-4xl md:text-5xl font-black text-white font-mono">What We Do</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {[
                                    { 
                                        title: 'Workshops', 
                                        icon: FaCode, 
                                        desc: 'Hands-on technical sessions on the latest technologies and industry best practices',
                                        color: 'cyan'
                                    },
                                    { 
                                        title: 'Hackathons', 
                                        icon: FaTrophy, 
                                        desc: '24-hour coding marathons fostering creativity and competitive spirit',
                                        color: 'blue'
                                    },
                                    { 
                                        title: 'Projects', 
                                        icon: FaCode, 
                                        desc: 'Real-world application development with mentorship from industry experts',
                                        color: 'purple'
                                    },
                                ].map((item, idx) => {
                                    const Icon = item.icon;
                                    const colorMap = {
                                        cyan: { bg: 'from-cyan-500/10 to-cyan-500/5', border: 'border-cyan-500/30', text: 'text-cyan-400' },
                                        blue: { bg: 'from-blue-500/10 to-blue-500/5', border: 'border-blue-500/30', text: 'text-blue-400' },
                                        purple: { bg: 'from-purple-500/10 to-purple-500/5', border: 'border-purple-500/30', text: 'text-purple-400' }
                                    };
                                    const colors = colorMap[item.color];
                                    
                                    return (
                                        <div key={idx} className={`group relative p-8 rounded-2xl bg-gradient-to-br ${colors.bg} border ${colors.border} hover:border-opacity-100 transition-all duration-300 overflow-hidden`}>
                                            <div className={`absolute inset-0 bg-gradient-to-br ${colors.bg} opacity-0 group-hover:opacity-50 transition-opacity`} />
                                            
                                            <div className="relative z-10">
                                                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${colors.bg} border ${colors.border} mb-6 group-hover:scale-110 transition-transform`}>
                                                    <Icon className={`w-7 h-7 ${colors.text}`} />
                                                </div>
                                                <h3 className="text-2xl font-bold text-white mb-3 font-mono">{item.title}</h3>
                                                <p className="text-slate-400 font-light leading-relaxed">{item.desc}</p>
                                            </div>
                                            
                                            {/* Corner Accent */}
                                            <div className={`absolute top-3 right-3 w-2 h-2 border-t border-r ${colors.border}`} />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}

                {/* Members Section */}
                {activeTab === 'members' && (
                    <div className="animate-fade-in space-y-24">
                        {/* Members Intro */}
                        <div className="text-center mb-12">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 mb-4">
                                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                                <span className="text-xs font-mono text-cyan-400">LEADERSHIP</span>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black text-white font-mono mb-4">Meet Our Team</h2>
                            <p className="text-slate-400 max-w-2xl mx-auto font-light">
                                A diverse group of passionate developers, leaders, and innovators working together to make an impact
                            </p>
                        </div>

                        {/* Faculty Advisors Section */}
                        <div className="relative">
                            {/* Faculty Header */}
                            <div className="flex items-center gap-4 mb-12">
                                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
                                <div className="text-center">
                                    <h2 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent uppercase tracking-wider font-mono">
                                        Faculty Advisors
                                    </h2>
                                    <p className="text-xs text-slate-500 font-mono mt-2">{mockFacultyMembers.length} member{mockFacultyMembers.length > 1 ? 's' : ''}</p>
                                </div>
                                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
                            </div>

                            {/* Faculty Members Grid */}
                            <div className="flex flex-wrap justify-center gap-8 mb-16">
                                {mockFacultyMembers.map((member, idx) => (
                                    <div 
                                        key={member.id} 
                                        className="w-full max-w-sm sm:w-72 lg:w-80"
                                        style={{
                                            animation: `slide-up 0.6s ease-out forwards`,
                                            animationDelay: `${idx * 0.1}s`,
                                            opacity: 0
                                        }}
                                    >
                                        <MemberCardFlip {...member} contactNumber={member.contactNumber} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Cluster Members Section */}
                        {Object.entries(clusters).map(([clusterName, members]) => (
                            members.length > 0 && (
                                <div key={clusterName} className="relative">
                                    {/* Cluster Header */}
                                    <div className="flex items-center gap-4 mb-12">
                                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
                                        <div className="text-center">
                                            <h2 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent uppercase tracking-wider font-mono">
                                                {clusterName}
                                            </h2>
                                            <p className="text-xs text-slate-500 font-mono mt-2">{members.length} member{members.length > 1 ? 's' : ''}</p>
                                        </div>
                                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
                                    </div>

                                    {/* Members Grid */}
                                    <div className="flex flex-wrap justify-center gap-8">
                                        {members.map((member, idx) => (
                                            <div 
                                                key={member.id} 
                                                className="w-full max-w-sm sm:w-72 lg:w-80"
                                                style={{
                                                    animation: `slide-up 0.6s ease-out forwards`,
                                                    animationDelay: `${idx * 0.1}s`,
                                                    opacity: 0
                                                }}
                                            >
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
