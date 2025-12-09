import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/footer/Footer';
import ProtectedRoute from '@/components/ProtectedRoute';

// Public Pages
import Home from '@/pages/Home';
import Events from '@/pages/Events';
import About from '@/pages/About';
import Clusters from '@/pages/Clusters';
import Leaderboard from '@/pages/Leaderboard';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import ForgotPassword from '@/pages/ForgotPassword';
import Members from '@/pages/Members';
import NotFound from '@/pages/NotFound';
import ComingSoon from '@/pages/ComingSoon';
import ScrollToTop from '@/pages/ScrollToTop';

// Auth Pages
import AdminLogin from '@/pages/AdminLogin';
import MasterLogin from '@/pages/MasterLogin';

// Protected Pages
import UserProfilePage from '@/pages/user/Profile';
import Unauthorized from '@/pages/Unauthorized';
import AdminDashboard from '@/pages/admin/Dashboard';
import MasterDashboard from '@/pages/master/Dashboard';

function Layout() {
  const location = useLocation();
  const hideHeaderFooter = [
    '/login',
    '/signup',
    '/forgot-password',
    '/admin',
    '/master',
    '/admin/dashboard',
    '/master/dashboard',
    '/unauthorized'
  ].includes(location.pathname);

  // Auto scroll to top when route changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className={`flex flex-col min-h-screen transition-colors duration-300 bg-pitch-dark ${!hideHeaderFooter ? 'pt-16' : ''}`}>
      <ScrollToTop />
      {!hideHeaderFooter && <Navbar />}

      {/* Main Content */}
      <main className="flex-grow bg-pitch-dark">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/event-timeline" element={<Events />} />
          <Route path="/about" element={<About />} />
          <Route path="/members" element={<Members />} />
          <Route path="/clusters" element={<Clusters />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/coming-soon" element={<ComingSoon />} />

          {/* Auth Routes */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/master" element={<MasterLogin />} />

          {/* Protected Routes - User Profile (inside main website) */}
          <Route
            path="/user/profile"
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <UserProfilePage />
              </ProtectedRoute>
            }
          />

          {/* Protected Routes - Admin Dashboard */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Protected Routes - Master Dashboard */}
          <Route
            path="/master/dashboard"
            element={
              <ProtectedRoute allowedRoles={['master']}>
                <MasterDashboard />
              </ProtectedRoute>
            }
          />

          {/* Error Routes */}
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {!hideHeaderFooter && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout />
      </Router>
    </AuthProvider>
  );
}
