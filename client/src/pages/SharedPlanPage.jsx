import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getSharedPlan } from '../services/api';

const SharedPlanPage = () => {
  const { token } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getSharedPlan(token);
        setData(res.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Shared plan not found');
      }
      setLoading(false);
    };
    fetch();
  }, [token]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div className="spinner" />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 24px' }}>
        <div style={{ fontSize: '4rem', marginBottom: '16px' }}>😕</div>
        <h2 style={{ fontWeight: 700, marginBottom: '12px' }}>Plan Not Found</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>{error}</p>
        <Link to="/register"><button className="btn-primary" style={{ padding: '12px 28px' }}>Create Your Own Plan</button></Link>
      </div>
    );
  }

  const plan = data.plan || [];

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 24px 80px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '36px' }}>
        <img src="/Syllabus2Success.png" alt="Syllabus2Success" style={{ height: '80px', objectFit: 'contain', marginBottom: '16px' }} />
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '999px', padding: '5px 14px', fontSize: '0.8rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '12px' }}>
          🔗 Shared Study Plan
        </div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '8px' }}>
          <span className="gradient-text">Study Plan</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          {plan.length} days · {data.difficulty} difficulty · {data.hoursPerDay}h/day · Exam: {data.examDate}
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        {[
          { icon: '📅', label: 'Total Days', value: plan.length },
          { icon: '📚', label: 'Study Days', value: plan.filter((d) => !d.revision).length },
          { icon: '🔄', label: 'Revision Days', value: plan.filter((d) => d.revision).length },
        ].map((s) => (
          <div key={s.label} className="glass-card" style={{ padding: '18px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.4rem', marginBottom: '4px' }}>{s.icon}</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>{s.value}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Day Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
        {plan.map((day, idx) => (
          <div key={idx} className={`day-card ${day.revision ? 'revision-day' : ''}`} style={{ opacity: 0, animation: `fadeInUp 0.4s ease ${idx * 0.04}s forwards` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: day.revision ? 'rgba(245,158,11,0.2)' : 'linear-gradient(135deg, var(--primary), var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: day.revision ? 'var(--accent)' : '#fff', fontWeight: 800, fontSize: '0.8rem' }}>
                {day.day}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Day {day.day}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{day.duration}</div>
              </div>
              <span className={`badge ${day.revision ? 'badge-revision' : 'badge-study'}`} style={{ marginLeft: 'auto' }}>
                {day.revision ? '🔄 Revision' : '📖 Study'}
              </span>
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {(day.topics || []).map((t, i) => (
                <li key={i} style={{ fontSize: '0.85rem', color: 'var(--text-primary)', display: 'flex', gap: '6px' }}>
                  <span style={{ color: day.revision ? 'var(--accent)' : 'var(--primary)' }}>{day.revision ? '↻' : '•'}</span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div style={{ textAlign: 'center', marginTop: '48px', padding: '36px', borderRadius: '16px', background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(6,182,212,0.08))', border: '1px solid var(--border)' }}>
        <p style={{ color: 'var(--text-muted)', marginBottom: '16px', fontSize: '1rem' }}>
          Want to create your own personalized study plan?
        </p>
        <Link to="/register"><button className="btn-primary" style={{ padding: '14px 32px', fontSize: '1rem' }}>🚀 Create Your Own Plan</button></Link>
      </div>
    </div>
  );
};

export default SharedPlanPage;
