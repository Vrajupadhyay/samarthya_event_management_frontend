import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Home from './pages/Home';
import Register from './pages/Register';
import SportsAcademyRegister from './pages/SportsAcademyRegister';
import Success from './pages/Success';
import Pass from './pages/Pass';
import Verify from './pages/Verify';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import Scanner from './pages/Scanner';
import ScrollToTop from './components/ScrollToTop';
import { authAPI } from './services/api';
import './App.css';

// Protected Route Component for Admin/Staff
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const user = authAPI.getUser();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Protected Route for Organizer Portal
const OrganizerRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('organizerAuth');
  
  if (!isAuthenticated) {
    return <Navigate to="/organizer-login" replace />;
  }
  
  return children;
};

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Any initial setup can go here
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loader"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/success/:registrationId" element={<Success />} />
        <Route path="/pass/:registrationId" element={<Pass />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/login" element={<Login />} />
        
        {/* Organizer Portal Routes */}
        <Route path="/7sports-academy-register" element={<SportsAcademyRegister />} />
        
        {/* Admin Routes */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Staff Routes */}
        <Route 
          path="/scanner" 
          element={
            <ProtectedRoute allowedRoles={['admin', 'staff']}>
              <Scanner />
            </ProtectedRoute>
          } 
        />
        
        {/* 404 Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
