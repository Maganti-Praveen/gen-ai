import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <nav
      style={{
        background: 'rgba(15,15,26,0.90)',
        backdropFilter: 'blur(14px)',
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
          height: '68px',
        }}
      >
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
          <img
            src="/Syllabus2Success.png"
            alt="Syllabus2Success"
            style={{
              height: '48px',
              width: 'auto',
              objectFit: 'contain',
              filter: 'drop-shadow(0 0 8px rgba(99,102,241,0.25))',
              transition: 'filter 0.3s ease, transform 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.target.style.filter = 'drop-shadow(0 0 14px rgba(99,102,241,0.5))';
              e.target.style.transform = 'scale(1.04)';
            }}
            onMouseLeave={(e) => {
              e.target.style.filter = 'drop-shadow(0 0 8px rgba(99,102,241,0.25))';
              e.target.style.transform = 'scale(1)';
            }}
          />
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
      padding: '8px 18px',
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
    }}
    onMouseEnter={(e) => {
      if (!highlight) e.currentTarget.style.color = 'var(--text-primary)';
    }}
    onMouseLeave={(e) => {
      if (!highlight) e.currentTarget.style.color = active ? 'var(--primary)' : 'var(--text-muted)';
    }}
  >
    {label}
  </Link>
);

export default Navbar;
