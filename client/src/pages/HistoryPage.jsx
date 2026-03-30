import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPlans, deletePlan } from '../services/api';
import { useToast } from '../context/ToastContext';

const HistoryPage = () => {
  const { showToast } = useToast();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getPlans();
        setPlans(res.data);
      } catch (_) {
        showToast('Failed to load plans', 'error');
      }
      setLoading(false);
    };
    fetch();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this plan?')) return;
    try {
      await deletePlan(id);
      setPlans((prev) => prev.filter((p) => p._id !== id));
      showToast('Plan deleted', 'success');
    } catch (_) {
      showToast('Failed to delete plan', 'error');
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 24px 80px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '6px' }}>
            📚 My <span className="gradient-text">Study Plans</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{plans.length} plan{plans.length !== 1 ? 's' : ''} generated</p>
        </div>
        <Link to="/generate">
          <button className="btn-primary" style={{ padding: '10px 24px' }}>✨ New Plan</button>
        </Link>
      </div>

      {plans.length === 0 ? (
        <div className="glass-card" style={{ padding: '60px 24px', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📭</div>
          <h2 style={{ fontWeight: 700, marginBottom: '8px' }}>No plans yet</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Generate your first AI-powered study plan!</p>
          <Link to="/generate"><button className="btn-primary" style={{ padding: '12px 28px' }}>Get Started</button></Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
          {plans.map((p) => {
            const completedDays = (p.plan || []).filter((d) => d.completed).length;
            const totalDays = (p.plan || []).length;
            const pct = totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0;
            const topicCount = (p.plan || []).reduce((s, d) => s + (d.topics?.length || 0), 0);

            return (
              <div key={p._id} className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', transition: 'all 0.2s' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <span className={`badge ${p.difficulty === 'hard' ? 'badge-revision' : 'badge-study'}`} style={{ fontSize: '0.72rem' }}>
                      {p.difficulty === 'easy' ? '😊' : p.difficulty === 'hard' ? '🔥' : '🎯'} {p.difficulty}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{new Date(p.createdAt).toLocaleDateString()}</span>
                  </div>
                  <button onClick={() => handleDelete(p._id)} aria-label="Delete plan"
                    style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '6px', color: '#ef4444', cursor: 'pointer', padding: '4px 8px', fontSize: '0.75rem' }}>
                    🗑️
                  </button>
                </div>

                {/* Info */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  <span>📅 {totalDays} days</span>
                  <span>📝 {topicCount} topics</span>
                  <span>⏱️ {p.hoursPerDay}h/day</span>
                  <span>🎯 Exam: {p.examDate}</span>
                </div>

                {/* Progress */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Progress</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)' }}>{pct}%</span>
                  </div>
                  <div className="progress-bar-bg" style={{ height: '6px' }}>
                    <div className="progress-bar-fill" style={{ width: `${pct}%`, height: '100%' }} />
                  </div>
                </div>

                {/* View Button */}
                <Link to={`/result/${p._id}`} style={{ textDecoration: 'none', marginTop: 'auto' }}>
                  <button style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid var(--primary)', background: 'rgba(99,102,241,0.06)', color: 'var(--primary)', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', transition: 'all 0.2s' }}>
                    View Plan →
                  </button>
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
