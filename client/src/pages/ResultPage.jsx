import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import PlanDisplay from '../components/PlanDisplay';

const ResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { plan, planId, daysAvailable } = location.state || {};

  if (!plan || plan.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 24px' }}>
        <div style={{ fontSize: '4rem', marginBottom: '16px' }}>📭</div>
        <h2 style={{ fontWeight: 700, marginBottom: '12px' }}>No Study Plan Found</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '28px' }}>
          It looks like you haven't generated a plan yet.
        </p>
        <Link to="/generate">
          <button className="btn-primary">Generate a Plan</button>
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 24px 80px' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginBottom: '40px',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(16,185,129,0.1)',
              border: '1px solid rgba(16,185,129,0.3)',
              borderRadius: '999px',
              padding: '5px 14px',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: '#10b981',
              marginBottom: '12px',
            }}
          >
            ✅ Plan Generated Successfully
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '6px' }}>
            Your <span className="gradient-text">Study Plan</span> is Ready!
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            {daysAvailable} days until your exam · {plan.length} day plan generated
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/generate')}
            style={{
              padding: '10px 20px',
              borderRadius: '10px',
              border: '1px solid var(--border)',
              background: 'transparent',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.9rem',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => { e.target.style.borderColor = 'var(--primary)'; e.target.style.color = 'var(--text-primary)'; }}
            onMouseLeave={(e) => { e.target.style.borderColor = 'var(--border)'; e.target.style.color = 'var(--text-muted)'; }}
          >
            🔄 Regenerate
          </button>

          <button
            onClick={() => window.print()}
            style={{
              padding: '10px 20px',
              borderRadius: '10px',
              border: '1px solid rgba(99,102,241,0.4)',
              background: 'rgba(99,102,241,0.1)',
              color: 'var(--primary)',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.9rem',
            }}
          >
            🖨️ Print Plan
          </button>
        </div>
      </div>

      {/* Legend */}
      <div
        style={{
          display: 'flex',
          gap: '16px',
          marginBottom: '28px',
          flexWrap: 'wrap',
        }}
      >
        {[
          { color: 'var(--primary)', label: 'Study Day', icon: '📖' },
          { color: 'var(--revision)', label: 'Revision Day', icon: '🔄' },
          { color: 'var(--success)', label: 'Completed', icon: '✅' },
        ].map((item) => (
          <div
            key={item.label}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid var(--border)',
              borderRadius: '999px',
              fontSize: '0.82rem',
              color: 'var(--text-muted)',
            }}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </div>
        ))}
      </div>

      {/* Plan Display */}
      <PlanDisplay plan={plan} planId={planId} daysAvailable={daysAvailable} />

      {/* Bottom CTA */}
      <div
        style={{
          marginTop: '48px',
          textAlign: 'center',
          padding: '36px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(6,182,212,0.08))',
          border: '1px solid var(--border)',
        }}
      >
        <p style={{ color: 'var(--text-muted)', marginBottom: '16px', fontSize: '0.95rem' }}>
          Need a different plan? Adjust your inputs and regenerate.
        </p>
        <button
          onClick={() => navigate('/generate')}
          className="btn-primary"
          style={{ padding: '12px 28px' }}
        >
          ✨ Generate New Plan
        </button>
      </div>
    </div>
  );
};

export default ResultPage;
