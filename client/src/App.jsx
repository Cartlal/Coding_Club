import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/footer/Footer';
import Home from '@/pages/Home';
import Events from '@/pages/Events';
import About from '@/pages/About';
import Clusters from '@/pages/Clusters';
import Leaderboard from '@/pages/Leaderboard';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import Members from '@/pages/Members';
import NotFound from '@/pages/NotFound';
import ComingSoon from '@/pages/ComingSoon';

export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen pt-16 transition-colors duration-300">
        <Navbar />

        {/* Main Content */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/events" element={<Events />} />
            <Route path="/event-timeline" element={<Events />} />
            <Route path="/event-timeline" element={<Events />} />
            <Route path="/about" element={<About />} />
            <Route path="/members" element={<Members />} />
            <Route path="/clusters" element={<Clusters />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/coming-soon" element={<ComingSoon />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}
