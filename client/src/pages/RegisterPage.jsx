import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const RegisterPage = () => {
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getStrength = () => {
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 10) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    if (score <= 1) return { label: 'Weak', color: '#ef4444', pct: 20 };
    if (score <= 3) return { label: 'Medium', color: '#f59e0b', pct: 60 };
    return { label: 'Strong', color: '#10b981', pct: 100 };
  };

  const strength = getStrength();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPw) { setError('All fields are required'); return; }
    if (password !== confirmPw) { setError('Passwords do not match'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    if (!agree) { setError('You must agree to the terms'); return; }

    setLoading(true);
    setError('');
    try {
      await register(name, email, password);
      showToast('Account created! Welcome! 🎉', 'success');
      navigate('/generate');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-card glass-card">
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <img src="/Syllabus2Success.png" alt="Syllabus2Success" style={{ height: '80px', objectFit: 'contain', marginBottom: '16px' }} />
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '6px' }}>Create Account</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Join Syllabus2Success and start planning smarter</p>
        </div>

        {error && <div className="error-banner">{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label className="form-label">👤 Full Name</label>
            <input type="text" className="input-field" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name" />
          </div>

          <div>
            <label className="form-label">📧 Email</label>
            <input type="email" className="input-field" placeholder="you@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
          </div>

          <div>
            <label className="form-label">🔒 Password</label>
            <div style={{ position: 'relative' }}>
              <input type={showPw ? 'text' : 'password'} className="input-field" placeholder="Min 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="new-password" style={{ paddingRight: '44px' }} />
              <button type="button" onClick={() => setShowPw(!showPw)} aria-label="Toggle password" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1rem' }}>
                {showPw ? '🙈' : '👁️'}
              </button>
            </div>
            {password.length > 0 && (
              <div style={{ marginTop: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Password strength</span>
                  <span style={{ fontSize: '0.72rem', color: strength.color, fontWeight: 700 }}>{strength.label}</span>
                </div>
                <div style={{ height: '4px', borderRadius: '2px', background: 'rgba(255,255,255,0.06)' }}>
                  <div style={{ height: '100%', width: `${strength.pct}%`, background: strength.color, borderRadius: '2px', transition: 'all 0.3s' }} />
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="form-label">🔒 Confirm Password</label>
            <input type={showPw ? 'text' : 'password'} className="input-field" placeholder="Re-enter password" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} required autoComplete="new-password" />
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} style={{ accentColor: 'var(--primary)' }} />
            I agree to the Terms of Service
          </label>

          <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', padding: '14px', fontSize: '1rem', borderRadius: '12px' }}>
            {loading ? '⏳ Creating account...' : '🚀 Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
