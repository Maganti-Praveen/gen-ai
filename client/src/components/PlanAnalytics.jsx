import React from 'react';

const PlanAnalytics = ({ plan, quizScores = [] }) => {
  if (!plan || plan.length === 0) return null;

  const totalDays = plan.length;
  const studyDays = plan.filter((d) => !d.revision).length;
  const revisionDays = plan.filter((d) => d.revision).length;
  const completedDays = plan.filter((d) => d.completed).length;
  const completionPct = totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0;
  const allTopics = plan.flatMap((d) => d.topics || []);
  const uniqueTopics = [...new Set(allTopics)];
  const totalHours = plan.reduce((sum, d) => {
    const h = parseFloat(d.duration) || 0;
    return sum + h;
  }, 0);

  // Weekly breakdown
  const weeks = [];
  for (let i = 0; i < totalDays; i += 7) {
    const weekDays = plan.slice(i, i + 7);
    weeks.push({
      label: `Week ${weeks.length + 1}`,
      study: weekDays.filter((d) => !d.revision).length,
      revision: weekDays.filter((d) => d.revision).length,
      completed: weekDays.filter((d) => d.completed).length,
    });
  }

  // Quiz stats
  const hasQuiz = quizScores && quizScores.length > 0;
  const avgScore = hasQuiz ? Math.round(quizScores.reduce((s, q) => s + (q.score / q.total) * 100, 0) / quizScores.length) : 0;
  const bestScore = hasQuiz ? Math.round(Math.max(...quizScores.map((q) => (q.score / q.total) * 100))) : 0;

  return (
    <div className="glass-card" style={{ padding: '28px', marginTop: '32px' }}>
      <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '24px' }}>
        📊 Plan <span className="gradient-text">Analytics</span>
      </h2>

      {/* Motivation */}
      <div style={{ padding: '14px 18px', borderRadius: '12px', background: `rgba(${completionPct >= 70 ? '16,185,129' : completionPct >= 30 ? '99,102,241' : '245,158,11'},0.1)`, border: `1px solid rgba(${completionPct >= 70 ? '16,185,129' : completionPct >= 30 ? '99,102,241' : '245,158,11'},0.3)`, marginBottom: '24px', textAlign: 'center' }}>
        <span style={{ fontSize: '1.1rem', fontWeight: 700 }}>
          {completionPct >= 100 ? '🎉 You completed the entire plan!' :
           completionPct >= 70 ? `🔥 You're ${completionPct}% done! Almost there!` :
           completionPct >= 30 ? `💪 You're ${completionPct}% done — keep going!` :
           `📖 You're ${completionPct}% done — let's get started!`}
        </span>
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '12px', marginBottom: '28px' }}>
        {[
          { label: 'Total Days', value: totalDays, icon: '📅' },
          { label: 'Study Days', value: studyDays, icon: '📚' },
          { label: 'Revision Days', value: revisionDays, icon: '🔄' },
          { label: 'Total Topics', value: uniqueTopics.length, icon: '📝' },
          { label: 'Total Hours', value: `${totalHours.toFixed(1)}h`, icon: '⏱️' },
          { label: 'Completion', value: `${completionPct}%`, icon: '✅' },
        ].map((s) => (
          <div key={s.label} style={{ textAlign: 'center', padding: '14px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '1.4rem', marginBottom: '4px' }}>{s.icon}</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>{s.value}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 500 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Weekly Breakdown */}
      <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '14px', color: 'var(--text-primary)' }}>📊 Weekly Breakdown</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px' }}>
        {weeks.map((w) => (
          <div key={w.label} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', minWidth: '56px', fontWeight: 600 }}>{w.label}</span>
            <div style={{ flex: 1, display: 'flex', height: '22px', borderRadius: '6px', overflow: 'hidden', background: 'rgba(255,255,255,0.03)' }}>
              <div style={{ width: `${(w.study / 7) * 100}%`, background: 'var(--primary)', minWidth: w.study > 0 ? '2px' : 0, transition: 'width 0.6s ease' }} />
              <div style={{ width: `${(w.revision / 7) * 100}%`, background: 'var(--accent)', minWidth: w.revision > 0 ? '2px' : 0, transition: 'width 0.6s ease' }} />
            </div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', minWidth: '40px' }}>{w.completed}/{w.study + w.revision}</span>
          </div>
        ))}
        <div style={{ display: 'flex', gap: '16px', marginTop: '4px' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: 'var(--primary)', display: 'inline-block' }} /> Study
          </span>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: 'var(--accent)', display: 'inline-block' }} /> Revision
          </span>
        </div>
      </div>

      {/* Quiz Performance */}
      {hasQuiz && (
        <>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '14px', color: 'var(--text-primary)' }}>🧠 Quiz Performance</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '12px', marginBottom: '16px' }}>
            <div style={{ textAlign: 'center', padding: '14px', borderRadius: '12px', background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)' }}>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary)' }}>{avgScore}%</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Avg Score</div>
            </div>
            <div style={{ textAlign: 'center', padding: '14px', borderRadius: '12px', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--success)' }}>{bestScore}%</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Best Score</div>
            </div>
            <div style={{ textAlign: 'center', padding: '14px', borderRadius: '12px', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--accent)' }}>{quizScores.length}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Quizzes Taken</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PlanAnalytics;
