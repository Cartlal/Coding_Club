export const mockEvents = [
    {
        id: 1,
        title: 'Chai और Code - 1',
        description: 'Chai और Code is a bi-weekly workshop by Programming Cluster, designed to teach what truly matters in programming — through fun, caffeine-filled, hands-on coding. No pressure, just pure learning.\n\n🎁 Benefits:\n✔ Prepares you for Algo-Rush\n✔ Peer-to-peer debugging\n✔ Tech interview prep\n✔ Networking & collaboration\n✔ Energetic environment with your choice of caffeine ☕\n\n💻 Topics:\n✔ Basics of C++ & Java\n✔ STL & Utility Libraries\n✔ Arrays (Basics)\n✔ LeetCode-style problems\n\n🛠 Bring: Laptop + Charger\n(Optional: Bring a friend who may get a back in DS/DAA 😉)\n\n👨‍🏫 Instructors:\n✔ Adarsh Kakatkar (Lead)\n✔ Vaibhav Deopa (Co-Lead)\n\n📞 For any queries contact:\nLomesh Jangde (Core Member): +91 7723839235\n\n📢 Important: Attendance will be given to only the people who attend the workshop!',
        date: '2025-11-29',
        time: '1:00 PM - 5:00 PM',
        location: 'Step Hall',
        category: 'Workshop',
        club: 'Programming',
        status: 'completed',
        attendees: 0,
        image: '/images/chai-aur-code.jpg',
        tags: ['C++', 'Java', 'STL', 'DSA', 'LeetCode'],
    },
    {
        id: 2,
        title: 'Chai aur Arrays',
        description: 'Chai aur Arrays is an extension of the Chai aur Code series by Programming Cluster, designed to dive deeper into intermediate-level concepts, pattern-based problems and placement-oriented practice.\n\n🎯 What You\'ll Learn:\n✔ Intermediate array patterns\n✔ Implementation-focused learning\n✔ Placement-level interview questions\n✔ Logic, dry-run & problem-solving drills\n\n📘 Prerequisites:\n• C++ / Java\n• STL / Util\n• Basic understanding of Arrays\n\n⚡ Why Attend?\n✔ Perfect for fast-paced placement prep\n✔ Hands-on coding\n✔ Peer-to-peer learning\n\n⚠ Attention:\n• Only 60 slots! (First come first served)\n• Seats filling FAST\n• Students across any branch can join\n\n📞 For queries contact:\nLomesh Jangde (Core Member): +91 7723839235\n\n📝 Registration: https://docs.google.com/forms/d/e/1FAIpQLScPU-INKE19MFbHSJtfrI2buSP6ttguZuz5MeV2gfGM4nXH1w/viewform?usp=dialog',
        date: '2025-12-03',
        time: '5:00 PM - 7:00 PM',
        location: 'Language Lab',
        category: 'Workshop',
        club: 'Programming',
        status: 'completed',
        attendees: 60,
        image: '/images/chai-aur-arrays.jpg',
        tags: ['Arrays', 'C++', 'Java', 'DSA', 'Placement Prep'],
    },
    {
        id: 3,
        title: 'Chai और Code - 2',
        description: 'Chai और Code is a bi-weekly workshop by Programming Cluster, designed to teach what truly matters in programming — through fun, caffeine-filled, hands-on coding. No pressure, just pure learning.\n\n🎁 Benefits:\n✔ Prepares you for Algo-Rush\n✔ Peer-to-peer debugging\n✔ Tech interview prep\n✔ Networking & collaboration\n✔ Energetic environment with your choice of caffeine ☕\n\n💻 Topics:\n✔ Basics of C++ & Java\n✔ STL & Utility Libraries\n✔ Arrays (Basics)\n✔ LeetCode-style problems\n\n⚠ Attention:\n• Separate class for C++ and Java\n• Seats filling FAST, register now!!!\n• Students across any branch can join\n\n👨‍🏫 Instructors:\n• Adarsh Kakatkar (Lead)\n• Vaibhav Deopa (Co-Lead)\n\n📞 For any queries contact:\nLomesh Jangde (Core Member) at +91 7723839235',
        date: '2025-12-06',
        time: '2:00 PM - 5:00 PM',
        location: 'Step Hall & MB 208',
        category: 'Workshop',
        club: 'Programming',
        status: 'upcoming',
        attendees: 0,
        image: '/images/chai-aur-code-3.jpg',
        tags: ['C++', 'Java', 'STL', 'DSA', 'LeetCode'],
    },
];

export const getClubColors = (club) => {
    switch (club) {
        case 'Development': return { gradient: 'from-cyan-500 to-blue-600', text: 'text-cyan-400', border: 'border-cyan-500/30' };
        case 'AI': return { gradient: 'from-purple-500 to-pink-600', text: 'text-purple-400', border: 'border-purple-500/30' };
        case 'Emerging Tech': return { gradient: 'from-green-500 to-teal-600', text: 'text-green-400', border: 'border-green-500/30' };
        case 'Competition': return { gradient: 'from-orange-500 to-red-600', text: 'text-orange-400', border: 'border-orange-500/30' };
        case 'Programming': return { gradient: 'from-indigo-500 to-violet-600', text: 'text-indigo-400', border: 'border-indigo-500/30' };
        case 'Media & Design': return { gradient: 'from-rose-500 to-fuchsia-600', text: 'text-rose-400', border: 'border-rose-500/30' };
        default: return { gradient: 'from-slate-500 to-slate-600', text: 'text-slate-400', border: 'border-slate-500/30' };
    }
};
