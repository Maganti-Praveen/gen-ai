import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { getDashboardStats } from '../services/api';

const DashboardPage = () => {
  const { user, updateProfile } = useAuth();
  const { showToast } = useToast();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [saving, setSaving] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getDashboardStats();
        setStats(res.data);
        setEditName(res.data.user.name);
        setEditEmail(res.data.user.email);
      } catch (_) {
        showToast('Failed to load dashboard', 'error');
      }
      setLoading(false);
    };
    fetch();
  }, []);

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await updateProfile({ name: editName, email: editEmail });
      showToast('Profile updated!', 'success');
      setShowEdit(false);
    } catch (err) {
      showToast(err.response?.data?.error || 'Update failed', 'error');
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div className="spinner" />
      </div>
    );
  }

  const u = stats?.user || user;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px 80px' }}>
      {/* Welcome */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '36px', flexWrap: 'wrap' }}>
        <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.5rem', color: '#fff', flexShrink: 0 }}>
          {u?.avatar || 'U'}
        </div>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '4px' }}>Welcome, <span className="gradient-text">{u?.name?.split(' ')[0]}</span>!</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{u?.email} · Joined {new Date(u?.createdAt).toLocaleDateString()}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: '36px' }}>
        {[
          { icon: '📚', label: 'Plans Generated', value: u?.plansGenerated || stats?.totalPlans || 0 },
          { icon: '🧠', label: 'Quizzes Taken', value: u?.quizzesTaken || 0 },
          { icon: '⏱️', label: 'Study Hours', value: u?.totalStudyHours || 0 },
          { icon: '📅', label: 'Days Active', value: u?.daysActive || 1 },
        ].map((s) => (
          <div key={s.label} className="glass-card" style={{ padding: '24px', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{s.icon}</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>{s.value}</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 500 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '36px', flexWrap: 'wrap' }}>
        <Link to="/generate"><button className="btn-primary" style={{ padding: '12px 24px' }}>✨ Generate New Plan</button></Link>
        <Link to="/history" style={{ textDecoration: 'none' }}>
          <button style={{ padding: '12px 24px', borderRadius: '12px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' }}>📚 View All Plans</button>
        </Link>
      </div>

      {/* Recent Plans */}
      {stats?.recentPlans && stats.recentPlans.length > 0 && (
        <div style={{ marginBottom: '36px' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '16px' }}>📋 Recent Plans</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {stats.recentPlans.map((p) => (
              <Link key={p._id} to={`/result/${p._id}`} style={{ textDecoration: 'none' }}>
                <div className="glass-card" style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = ''; }}>
                  <div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '4px' }}>
                      <span className={`badge badge-${p.difficulty === 'easy' ? 'study' : p.difficulty === 'hard' ? 'revision' : 'study'}`}>{p.difficulty}</span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(p.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-primary)', fontWeight: 600 }}>{p.daysCount} days · {p.topicCount} topics</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary)' }}>
                      {p.daysCount > 0 ? Math.round((p.completedDays / p.daysCount) * 100) : 0}%
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>completed</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Account Settings */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>⚙️ Account Settings</h2>
          <button onClick={() => setShowEdit(!showEdit)} style={{ padding: '6px 14px', borderRadius: '8px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600 }}>
            {showEdit ? 'Cancel' : 'Edit'}
          </button>
        </div>
        {showEdit ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label className="form-label">Name</label>
              <input type="text" className="input-field" value={editName} onChange={(e) => setEditName(e.target.value)} />
            </div>
            <div>
              <label className="form-label">Email</label>
              <input type="email" className="input-field" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} />
            </div>
            <button className="btn-primary" onClick={handleSaveProfile} disabled={saving} style={{ padding: '10px 20px', alignSelf: 'flex-start' }}>
              {saving ? '⏳ Saving...' : '💾 Save Changes'}
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            <p><strong>Name:</strong> {u?.name}</p>
            <p><strong>Email:</strong> {u?.email}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
