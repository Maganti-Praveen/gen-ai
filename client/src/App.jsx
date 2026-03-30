import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import GeneratePage from './pages/GeneratePage';
import ResultPage from './pages/ResultPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import HistoryPage from './pages/HistoryPage';
import SharedPlanPage from './pages/SharedPlanPage';

const App = () => {
  return (
    <Router>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/shared/:token" element={<SharedPlanPage />} />

          {/* Protected Routes */}
          <Route path="/generate" element={<ProtectedRoute><GeneratePage /></ProtectedRoute>} />
          <Route path="/result" element={<ProtectedRoute><ResultPage /></ProtectedRoute>} />
          <Route path="/result/:id" element={<ProtectedRoute><ResultPage /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute><HistoryPage /></ProtectedRoute>} />

          {/* 404 */}
          <Route
            path="*"
            element={
              <div style={{ textAlign: 'center', padding: '100px 24px' }}>
                <img src="/Syllabus2Success.png" alt="Syllabus2Success" style={{ height: '140px', objectFit: 'contain', marginBottom: '24px', opacity: 0.8 }} />
                <h2 style={{ fontWeight: 700, marginBottom: '12px' }}>Page Not Found</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>The page you're looking for doesn't exist.</p>
                <a href="/"><button className="btn-primary">Go Home</button></a>
              </div>
            }
          />
        </Routes>
      </main>
    </Router>
  );
};

export default App;
