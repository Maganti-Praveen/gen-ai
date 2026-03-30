import React, { useState, useEffect } from 'react';
import { getStudyTips } from '../services/api';

const TopicTipsModal = ({ topic, difficulty, onClose }) => {
  const [tips, setTips] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getStudyTips(topic, difficulty);
        setTips(res.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load tips');
      }
      setLoading(false);
    };
    fetch();
  }, [topic, difficulty]);

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-label="Study tips modal">
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '580px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0 }}>
            💡 Study Tips: <span className="gradient-text">{topic}</span>
          </h2>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">×</button>
        </div>

        {loading && (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <div className="spinner" />
            <p style={{ color: 'var(--text-muted)', marginTop: '12px' }}>AI is generating tips...</p>
          </div>
        )}

        {error && (
          <div className="error-banner">{error}</div>
        )}

        {tips && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Summary */}
            <div className="glass-card" style={{ padding: '16px' }}>
              <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '8px' }}>📝 Key Concepts</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{tips.keyConceptsSummary}</p>
            </div>

            {/* Tips */}
            <div className="glass-card" style={{ padding: '16px' }}>
              <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--secondary)', marginBottom: '8px' }}>🎯 Study Tips</h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {(tips.studyTips || []).map((tip, i) => (
                  <li key={i} style={{ fontSize: '0.85rem', color: 'var(--text-primary)', display: 'flex', gap: '8px' }}>
                    <span style={{ color: 'var(--secondary)' }}>→</span> {tip}
                  </li>
                ))}
              </ul>
            </div>

            {/* Mnemonics */}
            {tips.mnemonics && tips.mnemonics.length > 0 && (
              <div className="glass-card" style={{ padding: '16px' }}>
                <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent)', marginBottom: '8px' }}>🧠 Memory Aids</h3>
                {tips.mnemonics.map((m, i) => (
                  <p key={i} style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>• {m}</p>
                ))}
              </div>
            )}

            {/* Common Mistakes */}
            {tips.commonMistakes && tips.commonMistakes.length > 0 && (
              <div className="glass-card" style={{ padding: '16px' }}>
                <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ef4444', marginBottom: '8px' }}>⚠️ Common Mistakes</h3>
                {tips.commonMistakes.map((m, i) => (
                  <p key={i} style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>• {m}</p>
                ))}
              </div>
            )}

            {/* Practice Questions */}
            {tips.practiceQuestions && tips.practiceQuestions.length > 0 && (
              <div className="glass-card" style={{ padding: '16px' }}>
                <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--success)', marginBottom: '8px' }}>❓ Practice Questions</h3>
                {tips.practiceQuestions.map((q, i) => (
                  <p key={i} style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '6px' }}>{i + 1}. {q}</p>
                ))}
              </div>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {tips.youtubeSearchQuery && (
                <a
                  href={`https://www.youtube.com/results?search_query=${encodeURIComponent(tips.youtubeSearchQuery)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                  style={{ padding: '10px 20px', fontSize: '0.85rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  ▶️ Search YouTube
                </a>
              )}
              {tips.estimatedMasteryTime && (
                <div style={{ padding: '10px 16px', borderRadius: '10px', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)', fontSize: '0.82rem', color: 'var(--primary)', fontWeight: 600 }}>
                  ⏱️ Est. mastery: {tips.estimatedMasteryTime}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopicTipsModal;
