import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav
      style={{
        background: 'rgba(15,15,26,0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '64px',
        }}
      >
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
            }}
          >
            🧠
          </div>
          <span
            style={{
              fontWeight: 800,
              fontSize: '1.1rem',
              background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            StudyPlanAI
          </span>
        </Link>

        {/* Nav Links */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <NavLink to="/" label="Home" active={isActive('/')} />
          <NavLink to="/generate" label="Generate Plan" active={isActive('/generate')} highlight />
        </div>
      </div>
    </nav>
  );
};

const NavLink = ({ to, label, active, highlight }) => (
  <Link
    to={to}
    style={{
      textDecoration: 'none',
      padding: '8px 16px',
      borderRadius: '10px',
      fontWeight: 600,
      fontSize: '0.9rem',
      transition: 'all 0.2s',
      background: highlight
        ? 'linear-gradient(135deg, var(--primary), var(--secondary))'
        : active
        ? 'rgba(99,102,241,0.15)'
        : 'transparent',
      color: highlight ? '#fff' : active ? 'var(--primary)' : 'var(--text-muted)',
      border: highlight ? 'none' : '1px solid transparent',
    }}
    onMouseEnter={(e) => {
      if (!highlight) e.target.style.color = 'var(--text-primary)';
    }}
    onMouseLeave={(e) => {
      if (!highlight) e.target.style.color = active ? 'var(--primary)' : 'var(--text-muted)';
    }}
  >
    {label}
  </Link>
);

export default Navbar;
