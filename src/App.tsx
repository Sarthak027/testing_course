import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CoursesPage from './pages/CoursesPage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const adminRoute = import.meta.env.VITE_ADMIN_ROUTE || '34324';

  return (
    <Router>
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route 
            path={`/${adminRoute}`} 
            element={
              isAdminLoggedIn ? (
                <Navigate to={`/${adminRoute}/dashboard`} replace />
              ) : (
                <AdminLogin onLogin={() => setIsAdminLoggedIn(true)} />
              )
            } 
          />
          <Route 
            path={`/${adminRoute}/dashboard`} 
            element={
              isAdminLoggedIn ? (
                <AdminDashboard onLogout={() => setIsAdminLoggedIn(false)} />
              ) : (
                <Navigate to={`/${adminRoute}`} replace />
              )
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
