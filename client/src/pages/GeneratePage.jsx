import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SyllabusForm from '../components/SyllabusForm';
import Loader from '../components/Loader';
import { generatePlanFromText, generatePlanFromFile } from '../services/api';

const GeneratePage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (payload, isFormData) => {
    setLoading(true);
    setError('');
    try {
      let res;
      if (isFormData) {
        res = await generatePlanFromFile(payload);
      } else {
        res = await generatePlanFromText(payload);
      }
      const { plan, id, daysAvailable } = res.data;
      navigate('/result', { state: { plan, planId: id, daysAvailable } });
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'Failed to generate plan. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '760px', margin: '0 auto', padding: '40px 24px 80px' }}>
      {/* Page Header */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <img
          src="/Syllabus2Success.png"
          alt="Syllabus2Success"
          style={{ height: '110px', width: 'auto', objectFit: 'contain', marginBottom: '24px', filter: 'drop-shadow(0 4px 18px rgba(99,102,241,0.3))' }}
        />
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '10px' }}>
          Generate Your <span className="gradient-text">Study Plan</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.6 }}>
          Fill in the details below and our AI will craft a personalized day-wise study schedule for you.
        </p>
      </div>

      {/* Error Banner */}
      {error && (
        <div
          style={{
            background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.4)',
            borderRadius: '12px',
            padding: '16px 20px',
            marginBottom: '24px',
            color: '#f87171',
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px',
          }}
        >
          <span style={{ flexShrink: 0 }}>⚠️</span>
          <div>
            <strong>Error:</strong> {error}
            {error.includes('API key') && (
              <p style={{ marginTop: '6px', fontSize: '0.82rem', color: '#fca5a5' }}>
                Make sure your NVIDIA_API_KEY is set correctly in server/.env
              </p>
            )}
          </div>
        </div>
      )}

      {/* Loader or Form */}
      {loading ? (
        <div className="glass-card" style={{ padding: '20px' }}>
          <Loader />
        </div>
      ) : (
        <div className="glass-card" style={{ padding: '36px' }}>
          <SyllabusForm onSubmit={handleSubmit} loading={loading} />
        </div>
      )}

      {/* Tips */}
      {!loading && (
        <div
          style={{
            marginTop: '28px',
            padding: '20px 24px',
            background: 'rgba(6,182,212,0.07)',
            border: '1px solid rgba(6,182,212,0.2)',
            borderRadius: '12px',
          }}
        >
          <p style={{ fontWeight: 700, color: 'var(--secondary)', marginBottom: '10px', fontSize: '0.9rem' }}>
            💡 Syllabus2Success Tips
          </p>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {[
              'List topics/chapters one per line for clear separation',
              'Leave at least 7 days before the exam for a full plan',
              'Choose "Hard" if you have a lot of material in fewer days',
              'Upload a PDF syllabus directly from your college portal',
            ].map((tip) => (
              <li key={tip} style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', gap: '8px' }}>
                <span style={{ color: 'var(--secondary)' }}>→</span> {tip}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default GeneratePage;
