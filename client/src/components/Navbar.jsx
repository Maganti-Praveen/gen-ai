import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{ background: 'rgba(15,15,26,0.90)', backdropFilter: 'blur(14px)', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 100 }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '80px' }}>
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
          <img src="/Syllabus2Success.png" alt="Syllabus2Success" style={{ height: '60px', width: 'auto', objectFit: 'contain', filter: 'drop-shadow(0 0 8px rgba(99,102,241,0.25))', transition: 'all 0.3s ease' }} />
        </Link>

        {/* Desktop Nav */}
        <div className="nav-desktop" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <NavLink to="/" label="Home" active={isActive('/')} />
          {isAuthenticated && <NavLink to="/dashboard" label="Dashboard" active={isActive('/dashboard')} />}
          {isAuthenticated && <NavLink to="/history" label="My Plans" active={isActive('/history')} />}
          <NavLink to="/generate" label="Generate Plan" active={isActive('/generate')} highlight />

          {isAuthenticated ? (
            <div style={{ position: 'relative', marginLeft: '8px' }}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', border: '1px solid var(--border)', borderRadius: '12px', padding: '6px 14px 6px 6px', cursor: 'pointer', color: 'var(--text-primary)' }}
                aria-label="User menu"
              >
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.75rem', color: '#fff' }}>
                  {user?.avatar || 'U'}
                </div>
                <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{user?.name?.split(' ')[0]}</span>
                <span style={{ fontSize: '0.7rem', transform: menuOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}>▼</span>
              </button>
              {menuOpen && (
                <div className="dropdown-menu" onMouseLeave={() => setMenuOpen(false)}>
                  <Link to="/dashboard" className="dropdown-item" onClick={() => setMenuOpen(false)}>📊 Dashboard</Link>
                  <Link to="/history" className="dropdown-item" onClick={() => setMenuOpen(false)}>📚 My Plans</Link>
                  <div style={{ height: '1px', background: 'var(--border)', margin: '4px 0' }} />
                  <button className="dropdown-item" onClick={() => { logout(); setMenuOpen(false); }} style={{ width: '100%', textAlign: 'left', color: '#ef4444' }}>🚪 Logout</button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '8px', marginLeft: '8px' }}>
              <Link to="/login" style={{ textDecoration: 'none', padding: '8px 18px', borderRadius: '10px', border: '1px solid var(--border)', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem', transition: 'all 0.2s' }}>Login</Link>
              <Link to="/register" style={{ textDecoration: 'none' }}>
                <button className="btn-primary" style={{ padding: '8px 18px', fontSize: '0.9rem' }}>Sign Up</button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button className="nav-mobile-btn" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu" style={{ display: 'none', background: 'transparent', border: 'none', color: 'var(--text-primary)', fontSize: '1.5rem', cursor: 'pointer' }}>
          {mobileOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="nav-mobile-menu" style={{ padding: '16px 24px', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <MobileLink to="/" label="Home" onClick={() => setMobileOpen(false)} />
          {isAuthenticated && <MobileLink to="/dashboard" label="Dashboard" onClick={() => setMobileOpen(false)} />}
          {isAuthenticated && <MobileLink to="/history" label="My Plans" onClick={() => setMobileOpen(false)} />}
          <MobileLink to="/generate" label="Generate Plan" onClick={() => setMobileOpen(false)} />
          {isAuthenticated ? (
            <button onClick={() => { logout(); setMobileOpen(false); }} style={{ padding: '10px 16px', borderRadius: '10px', border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.08)', color: '#ef4444', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', textAlign: 'left' }}>🚪 Logout</button>
          ) : (
            <>
              <MobileLink to="/login" label="Login" onClick={() => setMobileOpen(false)} />
              <MobileLink to="/register" label="Sign Up" onClick={() => setMobileOpen(false)} />
            </>
          )}
        </div>
      )}
    </nav>
  );
};

const NavLink = ({ to, label, active, highlight }) => (
  <Link to={to} style={{ textDecoration: 'none', padding: '8px 18px', borderRadius: '10px', fontWeight: 600, fontSize: '0.9rem', transition: 'all 0.2s', background: highlight ? 'linear-gradient(135deg, var(--primary), var(--secondary))' : active ? 'rgba(99,102,241,0.15)' : 'transparent', color: highlight ? '#fff' : active ? 'var(--primary)' : 'var(--text-muted)' }}>
    {label}
  </Link>
);

const MobileLink = ({ to, label, onClick }) => (
  <Link to={to} onClick={onClick} style={{ textDecoration: 'none', padding: '10px 16px', borderRadius: '10px', fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-primary)', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', display: 'block' }}>
    {label}
  </Link>
);

export default Navbar;
