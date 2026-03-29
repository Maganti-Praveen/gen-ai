import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import GeneratePage from './pages/GeneratePage';
import ResultPage from './pages/ResultPage';

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/generate" element={<GeneratePage />} />
        <Route path="/result" element={<ResultPage />} />
        {/* 404 fallback */}
        <Route
          path="*"
          element={
            <div style={{ textAlign: 'center', padding: '80px 24px' }}>
              <img src="/Syllabus2Success.png" alt="Syllabus2Success" style={{ height: '80px', objectFit: 'contain', marginBottom: '24px', opacity: 0.7 }} />
              <h2 style={{ fontWeight: 700, marginBottom: '12px' }}>Page Not Found</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
                The page you're looking for doesn't exist.
              </p>
              <a href="/">
                <button className="btn-primary">Go Home</button>
              </a>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
