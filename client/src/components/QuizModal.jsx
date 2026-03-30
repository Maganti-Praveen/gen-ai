import React, { useState, useEffect } from 'react';
import { generateQuiz, saveQuizScore } from '../services/api';

const QuizModal = ({ topics, difficulty, planId, onClose }) => {
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await generateQuiz(topics, difficulty);
        setQuiz(res.data.quiz || res.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to generate quiz');
      }
      setLoading(false);
    };
    fetch();
  }, [topics, difficulty]);

  const handleSelect = (idx) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    if (idx === quiz[currentQ].correctAnswer) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (currentQ + 1 >= quiz.length) {
      setFinished(true);
      // Save score
      if (planId) {
        saveQuizScore(planId, score + (selected === quiz[currentQ]?.correctAnswer ? 0 : 0), quiz.length, topics).catch(() => {});
      }
    } else {
      setCurrentQ((c) => c + 1);
      setSelected(null);
      setAnswered(false);
    }
  };

  const handleFinish = async () => {
    if (planId) {
      try {
        await saveQuizScore(planId, score, quiz.length, topics);
      } catch (_) {}
    }
    onClose();
  };

  const getEmoji = () => {
    const pct = (score / (quiz?.length || 1)) * 100;
    if (pct >= 80) return '🏆';
    if (pct >= 50) return '👏';
    return '📖';
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-label="Quiz modal">
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '560px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0 }}>🧠 Quick Quiz</h2>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close quiz">×</button>
        </div>

        {loading && (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <div className="spinner" />
            <p style={{ color: 'var(--text-muted)', marginTop: '12px' }}>AI is generating your quiz...</p>
          </div>
        )}

        {error && <div className="error-banner">{error}</div>}

        {quiz && !finished && !loading && (
          <div>
            {/* Progress */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                <span>Question {currentQ + 1} of {quiz.length}</span>
                <span>Score: {score}/{quiz.length}</span>
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: `${((currentQ + 1) / quiz.length) * 100}%` }} />
              </div>
            </div>

            {/* Question */}
            <div className="glass-card" style={{ padding: '20px', marginBottom: '16px' }}>
              <p style={{ fontSize: '1rem', fontWeight: 600, lineHeight: 1.6 }}>{quiz[currentQ].question}</p>
            </div>

            {/* Options */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
              {quiz[currentQ].options.map((opt, idx) => {
                let bg = 'rgba(255,255,255,0.03)';
                let border = 'var(--border)';
                let color = 'var(--text-primary)';

                if (answered) {
                  if (idx === quiz[currentQ].correctAnswer) {
                    bg = 'rgba(16,185,129,0.15)';
                    border = 'var(--success)';
                    color = 'var(--success)';
                  } else if (idx === selected && idx !== quiz[currentQ].correctAnswer) {
                    bg = 'rgba(239,68,68,0.15)';
                    border = '#ef4444';
                    color = '#ef4444';
                  }
                } else if (idx === selected) {
                  bg = 'rgba(99,102,241,0.15)';
                  border = 'var(--primary)';
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelect(idx)}
                    disabled={answered}
                    aria-label={`Option ${String.fromCharCode(65 + idx)}`}
                    style={{
                      padding: '14px 16px',
                      borderRadius: '12px',
                      border: `1px solid ${border}`,
                      background: bg,
                      color,
                      cursor: answered ? 'default' : 'pointer',
                      fontWeight: 500,
                      fontSize: '0.9rem',
                      textAlign: 'left',
                      transition: 'all 0.2s',
                      display: 'flex',
                      gap: '10px',
                    }}
                  >
                    <span style={{ fontWeight: 700, minWidth: '20px' }}>{String.fromCharCode(65 + idx)}.</span>
                    {opt}
                  </button>
                );
              })}
            </div>

            {/* Explanation */}
            {answered && quiz[currentQ].explanation && (
              <div style={{ padding: '14px', borderRadius: '10px', background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.2)', marginBottom: '16px', fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                💡 {quiz[currentQ].explanation}
              </div>
            )}

            {/* Next */}
            {answered && (
              <button className="btn-primary" onClick={handleNext} style={{ width: '100%', padding: '12px' }}>
                {currentQ + 1 >= quiz.length ? '🏁 See Results' : 'Next Question →'}
              </button>
            )}
          </div>
        )}

        {/* Results */}
        {finished && quiz && (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: '4rem', marginBottom: '16px' }}>{getEmoji()}</div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '8px' }}>
              {score}/{quiz.length} Correct!
            </h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
              {score === quiz.length ? 'Perfect score! You nailed it!' :
               score >= quiz.length * 0.6 ? 'Great job! Keep studying to ace it!' :
               'Keep practicing — you\'ll get there! 💪'}
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button className="btn-primary" onClick={handleFinish} style={{ padding: '12px 28px' }}>
                ✅ Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizModal;
