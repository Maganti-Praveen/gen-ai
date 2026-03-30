import React, { useState } from 'react';
import { updateProgress } from '../services/api';
import TopicTipsModal from './TopicTipsModal';
import QuizModal from './QuizModal';
import { useToast } from '../context/ToastContext';

const PlanDisplay = ({ plan, planId, daysAvailable, difficulty, onShareClick, onExportClick }) => {
  const { showToast } = useToast();
  const [localPlan, setLocalPlan] = useState(plan);
  const [tipsModal, setTipsModal] = useState(null);
  const [quizModal, setQuizModal] = useState(null);

  const completedCount = localPlan.filter((d) => d.completed).length;
  const progressPercent = localPlan.length > 0 ? Math.round((completedCount / localPlan.length) * 100) : 0;

  const handleToggle = async (idx) => {
    const updated = localPlan.map((day, i) => i === idx ? { ...day, completed: !day.completed } : day);
    setLocalPlan(updated);
    if (planId) {
      try {
        await updateProgress(planId, idx, updated[idx].completed);
      } catch (_) {}
    }
  };

  return (
    <div>
      {/* Summary Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        {[
          { icon: '📅', label: 'Total Days', value: localPlan.length },
          { icon: '📚', label: 'Study Days', value: localPlan.filter((d) => !d.revision).length },
          { icon: '🔄', label: 'Revision Days', value: localPlan.filter((d) => d.revision).length },
          { icon: '✅', label: 'Completed', value: completedCount },
        ].map((stat) => (
          <div key={stat.label} className="glass-card" style={{ padding: '18px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.6rem', marginBottom: '6px' }}>{stat.icon}</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)' }}>{stat.value}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 500, marginTop: '2px' }}>{stat.label}</div>
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

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {onShareClick && (
          <button onClick={onShareClick} style={{ padding: '8px 16px', borderRadius: '10px', border: '1px solid var(--border)', background: 'rgba(99,102,241,0.06)', color: 'var(--primary)', cursor: 'pointer', fontWeight: 600, fontSize: '0.82rem', transition: 'all 0.2s' }} aria-label="Share plan">
            🔗 Share Plan
          </button>
        )}
        {onExportClick && (
          <button onClick={onExportClick} style={{ padding: '8px 16px', borderRadius: '10px', border: '1px solid var(--border)', background: 'rgba(6,182,212,0.06)', color: 'var(--secondary)', cursor: 'pointer', fontWeight: 600, fontSize: '0.82rem', transition: 'all 0.2s' }} aria-label="Export PDF">
            📄 Export PDF
          </button>
        )}
      </div>

      {/* Day Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }} className="stagger-children">
        {localPlan.map((day, idx) => (
          <DayCard
            key={idx}
            day={day}
            idx={idx}
            difficulty={difficulty}
            onToggle={() => handleToggle(idx)}
            showProgress={!!planId}
            onTipsClick={(topic) => setTipsModal({ topic, difficulty })}
            onQuizClick={(topics) => setQuizModal({ topics, difficulty })}
          />
        ))}
      </div>

      {/* Modals */}
      {tipsModal && (
        <TopicTipsModal topic={tipsModal.topic} difficulty={tipsModal.difficulty} onClose={() => setTipsModal(null)} />
      )}
      {quizModal && (
        <QuizModal topics={quizModal.topics} difficulty={quizModal.difficulty} planId={planId} onClose={() => setQuizModal(null)} />
      )}
    </div>
  );
};

const DayCard = ({ day, idx, difficulty, onToggle, showProgress, onTipsClick, onQuizClick }) => {
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
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: isRevision ? 'rgba(245,158,11,0.2)' : 'linear-gradient(135deg, var(--primary), var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isRevision ? 'var(--revision)' : '#fff', fontWeight: 800, fontSize: '0.85rem' }}>
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

      {/* Topics — clickable for tips */}
      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '14px' }}>
        {(day.topics || []).map((topic, i) => (
          <li
            key={i}
            onClick={() => onTipsClick(topic)}
            style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.88rem', color: isCompleted ? 'var(--text-muted)' : 'var(--text-primary)', textDecoration: isCompleted ? 'line-through' : 'none', cursor: 'pointer', transition: 'color 0.2s', borderRadius: '6px', padding: '2px 4px' }}
            onMouseEnter={(e) => { if (!isCompleted) e.currentTarget.style.color = 'var(--primary)'; }}
            onMouseLeave={(e) => { if (!isCompleted) e.currentTarget.style.color = 'var(--text-primary)'; }}
            title="Click for study tips"
          >
            <span style={{ color: isRevision ? 'var(--revision)' : 'var(--primary)', marginTop: '2px', flexShrink: 0 }}>
              {isRevision ? '↻' : '•'}
            </span>
            {topic}
          </li>
        ))}
      </ul>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {showProgress && (
          <button onClick={onToggle} aria-label={isCompleted ? 'Mark incomplete' : 'Mark complete'}
            style={{ flex: 1, padding: '8px', borderRadius: '8px', border: isCompleted ? '1px solid var(--success)' : '1px solid var(--border)', background: isCompleted ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.03)', color: isCompleted ? 'var(--success)' : 'var(--text-muted)', cursor: 'pointer', fontWeight: 600, fontSize: '0.82rem', transition: 'all 0.2s' }}>
            {isCompleted ? '✅ Completed' : 'Mark Complete'}
          </button>
        )}
        {day.topics && day.topics.length > 0 && (
          <button onClick={() => onQuizClick(day.topics)} aria-label="Take quiz"
            style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(99,102,241,0.3)', background: 'rgba(99,102,241,0.06)', color: 'var(--primary)', cursor: 'pointer', fontWeight: 600, fontSize: '0.82rem', transition: 'all 0.2s' }}>
            🧠 Quiz
          </button>
        )}
      </div>
    </div>
  );
};

export default PlanDisplay;
