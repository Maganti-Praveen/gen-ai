import React from 'react';

const Loader = ({ message = 'AI is generating your study plan...' }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 20px',
        gap: '24px',
      }}
    >
      {/* Animated brain icon */}
      <div style={{ position: 'relative', width: '80px', height: '80px' }}>
        <div
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '32px',
            animation: 'pulse-glow 1.5s ease-in-out infinite',
          }}
        >
          🧠
        </div>
        {/* Spinning ring */}
        <div
          style={{
            position: 'absolute',
            inset: '-4px',
            borderRadius: '50%',
            border: '3px solid transparent',
            borderTopColor: 'var(--primary)',
            borderRightColor: 'var(--secondary)',
            animation: 'spin 1s linear infinite',
          }}
        />
      </div>

      {/* Spinning keyframe */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
          {message}
        </p>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Analyzing syllabus and crafting your personalized plan...
        </p>
      </div>

      {/* Animated dots */}
      <div style={{ display: 'flex', gap: '8px' }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: 'var(--primary)',
              animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>
      <style>{`@keyframes bounce { 0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; } 40% { transform: scale(1); opacity: 1; } }`}</style>
    </div>
  );
};

export default Loader;
