import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import AnalyticsPage from './pages/AnalyticsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';
import './App.css';

// This component contains the main layout and logic.
// It's placed inside the Router so it can use navigation hooks.
function AppContent() {
  const { authToken, logout, user, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen font-sans bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-200">
      <nav className="bg-white/70 backdrop-blur-md shadow-lg sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <span className="font-bold text-xl text-pink-500 cursor-pointer">FitTrack</span>
              <div className="hidden md:block ml-10">
                <Link to="/" className="text-gray-800 px-3 py-2 rounded-md text-sm font-medium">Dashboard</Link>
                <Link to="/analytics" className="text-gray-800 px-3 py-2 rounded-md text-sm font-medium">Analytics</Link>
                {authToken && (
                  <Link to="/profile" className="text-gray-800 px-3 py-2 rounded-md text-sm font-medium">Profile</Link>
                )}
              </div>
            </div>
            <div>
              {/* We wait until the loading is finished before showing login/logout buttons */}
              {loading ? null : !authToken ? (
                 <div>
                   <Link to="/login" className="text-gray-800 px-3 py-2 rounded-md text-sm font-medium">Login</Link>
                   <Link to="/register" className="ml-4 bg-pink-500 text-white px-3 py-2 rounded-md text-sm font-medium">Register</Link>
                 </div>
              ) : (
                <div className="flex items-center">
                   <span className="text-gray-800 mr-4">Hi, {user ? user.name : 'User'}</span>
                   <button onClick={handleLogout} className="bg-pink-500 text-white px-3 py-2 rounded-md text-sm font-medium">Logout</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Routes>
          {/* Public Routes that anyone can see */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Routes that only logged-in users can see */}
          <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/analytics" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        </Routes>
      </main>
    </div>
  );
}

// The main App component's only job is to provide the Router context
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;

