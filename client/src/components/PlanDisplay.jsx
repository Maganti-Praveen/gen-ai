import React, { useState } from 'react';
import { updateProgress } from '../services/api';

const PlanDisplay = ({ plan, planId, daysAvailable }) => {
  const [localPlan, setLocalPlan] = useState(plan);

  const completedCount = localPlan.filter((d) => d.completed).length;
  const progressPercent = Math.round((completedCount / localPlan.length) * 100);

  const handleToggle = async (idx) => {
    const updated = localPlan.map((day, i) =>
      i === idx ? { ...day, completed: !day.completed } : day
    );
    setLocalPlan(updated);

    if (planId) {
      try {
        await updateProgress(planId, idx, updated[idx].completed);
      } catch (e) {
        // silently fail — local state still updated
      }
    }
  };

  return (
    <div>
      {/* Summary Stats */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '16px',
          marginBottom: '32px',
        }}
      >
        {[
          { icon: '📅', label: 'Total Days', value: localPlan.length },
          { icon: '📚', label: 'Study Days', value: localPlan.filter((d) => !d.revision).length },
          { icon: '🔄', label: 'Revision Days', value: localPlan.filter((d) => d.revision).length },
          { icon: '✅', label: 'Completed', value: completedCount },
        ].map((stat) => (
          <div
            key={stat.label}
            className="glass-card"
            style={{ padding: '18px', textAlign: 'center' }}
          >
            <div style={{ fontSize: '1.6rem', marginBottom: '6px' }}>{stat.icon}</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {stat.value}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 500, marginTop: '2px' }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Progress Bar */}
      {planId && (
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Overall Progress</span>
            <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{progressPercent}%</span>
          </div>
          <div className="progress-bar-bg">
            <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>
      )}

      {/* Day Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '16px',
        }}
        className="stagger-children"
      >
        {localPlan.map((day, idx) => (
          <DayCard
            key={idx}
            day={day}
            idx={idx}
            onToggle={() => handleToggle(idx)}
            showProgress={!!planId}
          />
        ))}
      </div>
    </div>
  );
};

const DayCard = ({ day, idx, onToggle, showProgress }) => {
  const isRevision = day.revision === true;
  const isCompleted = day.completed;

  return (
    <div
      className={`day-card ${isCompleted ? 'completed' : ''} ${isRevision ? 'revision-day' : ''}`}
      style={{ animationDelay: `${idx * 0.05}s`, opacity: 0, animation: `fadeInUp 0.4s ease ${idx * 0.04}s forwards` }}
    >
      {/* Card Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: isRevision
                ? 'rgba(245,158,11,0.2)'
                : 'linear-gradient(135deg, var(--primary), var(--secondary))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: isRevision ? 'var(--revision)' : '#fff',
              fontWeight: 800,
              fontSize: '0.85rem',
            }}
          >
            {day.day}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Day {day.day}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{day.duration}</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className={`badge ${isRevision ? 'badge-revision' : 'badge-study'}`}>
            {isRevision ? '🔄 Revision' : '📖 Study'}
          </span>
          {isCompleted && <span className="badge badge-done">✓</span>}
        </div>
      </div>

      {/* Topics */}
      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '14px' }}>
        {day.topics.map((topic, i) => (
          <li
            key={i}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '8px',
              fontSize: '0.88rem',
              color: isCompleted ? 'var(--text-muted)' : 'var(--text-primary)',
              textDecoration: isCompleted ? 'line-through' : 'none',
            }}
          >
            <span style={{ color: isRevision ? 'var(--revision)' : 'var(--primary)', marginTop: '2px', flexShrink: 0 }}>
              {isRevision ? '↻' : '•'}
            </span>
            {topic}
          </li>
        ))}
      </ul>

      {/* Progress Toggle */}
      {showProgress && (
        <button
          onClick={onToggle}
          style={{
            width: '100%',
            padding: '8px',
            borderRadius: '8px',
            border: isCompleted ? '1px solid var(--success)' : '1px solid var(--border)',
            background: isCompleted ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.03)',
            color: isCompleted ? 'var(--success)' : 'var(--text-muted)',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '0.82rem',
            transition: 'all 0.2s',
          }}
        >
          {isCompleted ? '✅ Completed' : 'Mark as Complete'}
        </button>
      )}
    </div>
  );
};

export default PlanDisplay;
