import React from 'react';
import { Link } from 'react-router-dom';

const FEATURES = [
  {
    icon: '🧠',
    title: 'AI-Powered Planning',
    desc: 'Google Gemini analyzes your syllabus and creates a smart, personalized study schedule.',
  },
  {
    icon: '📅',
    title: 'Day-wise Schedule',
    desc: 'Get a clear daily roadmap with topics, durations, and built-in revision sessions.',
  },
  {
    icon: '🔄',
    title: 'Smart Revisions',
    desc: 'Automatic revision days every 3rd day and a full revision buffer before your exam.',
  },
  {
    icon: '📁',
    title: 'PDF & Text Upload',
    desc: 'Import your syllabus as a PDF or TXT file — or just paste the text directly.',
  },
  {
    icon: '⚡',
    title: 'Adaptive Difficulty',
    desc: 'Adjust your plan for easy, medium, or hard workloads based on your preference.',
  },
  {
    icon: '✅',
    title: 'Progress Tracking',
    desc: 'Mark days as complete and track your study progress with a visual progress bar.',
  },
];

const STEPS = [
  { num: '01', title: 'Input Syllabus', desc: 'Paste text or upload a PDF/TXT file.' },
  { num: '02', title: 'Set Details', desc: 'Pick exam date, study hours, and difficulty.' },
  { num: '03', title: 'AI Generates Plan', desc: 'Gemini creates your personalized schedule.' },
  { num: '04', title: 'Start Studying', desc: 'Follow the plan and mark days complete.' },
];

const HomePage = () => {
  return (
    <div>
      {/* Hero */}
      <section
        className="hero-bg"
        style={{
          minHeight: '88vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '80px 24px',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(99,102,241,0.12)',
            border: '1px solid rgba(99,102,241,0.3)',
            borderRadius: '999px',
            padding: '6px 18px',
            fontSize: '0.82rem',
            fontWeight: 600,
            color: 'var(--primary)',
            marginBottom: '28px',
            letterSpacing: '0.04em',
          }}
        >
          ✨ Powered by Google Gemini AI
        </div>

        <h1
          style={{
            fontSize: 'clamp(2.4rem, 6vw, 4rem)',
            fontWeight: 900,
            lineHeight: 1.15,
            marginBottom: '20px',
            maxWidth: '700px',
          }}
        >
          Generate Your{' '}
          <span className="gradient-text">AI Study Plan</span>{' '}
          in Seconds
        </h1>

        <p
          style={{
            fontSize: 'clamp(1rem, 2vw, 1.2rem)',
            color: 'var(--text-muted)',
            maxWidth: '540px',
            marginBottom: '40px',
            lineHeight: 1.7,
          }}
        >
          Upload your syllabus, set your exam date, and let Gemini AI craft a
          day-wise study schedule with built-in revision sessions tailored to you.
        </p>

        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link to="/generate">
            <button
              className="btn-primary glow"
              style={{ padding: '16px 36px', fontSize: '1.05rem', borderRadius: '14px' }}
            >
              🚀 Generate My Plan
            </button>
          </Link>
          <a href="#how-it-works">
            <button
              style={{
                padding: '16px 36px',
                fontSize: '1.05rem',
                borderRadius: '14px',
                background: 'transparent',
                border: '1px solid var(--border)',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                fontWeight: 600,
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => { e.target.style.borderColor = 'var(--primary)'; e.target.style.color = 'var(--text-primary)'; }}
              onMouseLeave={(e) => { e.target.style.borderColor = 'var(--border)'; e.target.style.color = 'var(--text-muted)'; }}
            >
              Learn More ↓
            </button>
          </a>
        </div>

        {/* Floating stats */}
        <div
          style={{
            display: 'flex',
            gap: '32px',
            marginTop: '64px',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          {[
            { val: 'Gemini AI', label: 'Model' },
            { val: '< 10s', label: 'Generation Time' },
            { val: '∞', label: 'Plans Created' },
          ].map((s) => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--primary)' }}>{s.val}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '80px 24px', maxWidth: '1100px', margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: '2rem', fontWeight: 800, marginBottom: '12px' }}>
          Everything You Need to <span className="gradient-text">Ace Your Exam</span>
        </h2>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '48px', fontSize: '1rem' }}>
          Smart features designed for serious students
        </p>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '24px',
          }}
          className="stagger-children"
        >
          {FEATURES.map((f) => (
            <div key={f.title} className="glass-card" style={{ padding: '28px' }}>
              <div style={{ fontSize: '2rem', marginBottom: '12px' }}>{f.icon}</div>
              <h3 style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '8px' }}>{f.title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" style={{ padding: '80px 24px', background: 'rgba(26,26,46,0.5)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: '2rem', fontWeight: 800, marginBottom: '12px' }}>
            How It <span className="gradient-text">Works</span>
          </h2>
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '48px' }}>
            From syllabus to study plan in 4 simple steps
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '24px' }}>
            {STEPS.map((step, i) => (
              <div key={step.num} style={{ textAlign: 'center', position: 'relative' }}>
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem',
                    fontWeight: 900,
                    color: '#fff',
                    margin: '0 auto 16px',
                  }}
                >
                  {step.num}
                </div>
                <h3 style={{ fontWeight: 700, marginBottom: '8px', fontSize: '1rem' }}>{step.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.5 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 24px', textAlign: 'center' }}>
        <div
          className="glass-card"
          style={{
            maxWidth: '600px',
            margin: '0 auto',
            padding: '60px 40px',
            background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(6,182,212,0.1))',
          }}
        >
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🎓</div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '12px' }}>
            Ready to start studying smarter?
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '28px', lineHeight: 1.6 }}>
            Join thousands of students who use AI to plan their studies efficiently.
          </p>
          <Link to="/generate">
            <button className="btn-primary glow" style={{ padding: '16px 40px', fontSize: '1.05rem' }}>
              ✨ Generate My Study Plan
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          padding: '24px',
          textAlign: 'center',
          color: 'var(--text-muted)',
          fontSize: '0.82rem',
          borderTop: '1px solid var(--border)',
        }}
      >
        Built with ❤️ using Google Gemini AI · MERN Stack Hackathon Project
      </footer>
    </div>
  );
};

export default HomePage;
