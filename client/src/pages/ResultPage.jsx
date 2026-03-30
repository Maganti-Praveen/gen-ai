import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams, Link } from 'react-router-dom';
import PlanDisplay from '../components/PlanDisplay';
import PlanEditor from '../components/PlanEditor';
import PlanAnalytics from '../components/PlanAnalytics';
import { getPlanById, sharePlanApi, editPlanApi } from '../services/api';
import { exportPlanAsPDF } from '../utils/exportPdf';
import { useToast } from '../context/ToastContext';

const ResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id: paramId } = useParams();
  const { showToast } = useToast();

  const [plan, setPlan] = useState(location.state?.plan || null);
  const [planId, setPlanId] = useState(location.state?.planId || paramId || null);
  const [daysAvailable, setDaysAvailable] = useState(location.state?.daysAvailable || 0);
  const [difficulty, setDifficulty] = useState(location.state?.difficulty || 'medium');
  const [hoursPerDay, setHoursPerDay] = useState(location.state?.hoursPerDay || 3);
  const [examDate, setExamDate] = useState(location.state?.examDate || '');
  const [quizScores, setQuizScores] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load from DB if opened via /result/:id
  useEffect(() => {
    if (!plan && paramId) {
      setLoading(true);
      getPlanById(paramId)
        .then((res) => {
          const d = res.data;
          setPlan(d.plan);
          setPlanId(d._id);
          setDaysAvailable(d.plan?.length || 0);
          setDifficulty(d.difficulty);
          setHoursPerDay(d.hoursPerDay);
          setExamDate(d.examDate);
          setQuizScores(d.quizScores || []);
        })
        .catch(() => { showToast('Failed to load plan', 'error'); })
        .finally(() => setLoading(false));
    }
  }, [paramId]);

  const handleShare = async () => {
    try {
      const res = await sharePlanApi(planId);
      const url = `${window.location.origin}/shared/${res.data.shareToken}`;
      await navigator.clipboard.writeText(url);
      showToast('Share link copied to clipboard!', 'success');
    } catch (_) {
      showToast('Failed to create share link', 'error');
    }
  };

  const handleExport = () => {
    exportPlanAsPDF(plan, { difficulty, hoursPerDay, daysAvailable, examDate });
    showToast('PDF exported!', 'success');
  };

  const handleSaveEdit = async (updatedPlan) => {
    setSaving(true);
    try {
      const res = await editPlanApi(planId, updatedPlan);
      setPlan(res.data.plan);
      setEditMode(false);
      showToast('Plan updated!', 'success');
    } catch (_) {
      showToast('Failed to save changes', 'error');
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div className="spinner" />
      </div>
    );
  }

  if (!plan || plan.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 24px' }}>
        <div style={{ fontSize: '4rem', marginBottom: '16px' }}>📭</div>
        <h2 style={{ fontWeight: 700, marginBottom: '12px' }}>No Study Plan Found</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '28px' }}>It looks like you haven't generated a plan yet.</p>
        <Link to="/generate"><button className="btn-primary">Generate a Plan</button></Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 24px 80px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '40px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '999px', padding: '5px 14px', fontSize: '0.8rem', fontWeight: 600, color: '#10b981', marginBottom: '12px' }}>
            ✅ Plan Generated Successfully
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '6px' }}>
            <img src="/Syllabus2Success.png" alt="Syllabus2Success" style={{ height: '70px', width: 'auto', objectFit: 'contain', filter: 'drop-shadow(0 4px 14px rgba(99,102,241,0.3))' }} />
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0 }}>
              Your <span className="gradient-text">Study Plan</span> is Ready!
            </h1>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            {daysAvailable} days until your exam · {plan.length} day plan generated
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button onClick={() => setEditMode(!editMode)}
            style={{ padding: '10px 18px', borderRadius: '10px', border: editMode ? '1px solid var(--accent)' : '1px solid var(--border)', background: editMode ? 'rgba(245,158,11,0.1)' : 'transparent', color: editMode ? 'var(--accent)' : 'var(--text-muted)', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', transition: 'all 0.2s' }}>
            {editMode ? '👁️ View Plan' : '✏️ Edit Plan'}
          </button>
          <button onClick={() => navigate('/generate')}
            style={{ padding: '10px 18px', borderRadius: '10px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', transition: 'all 0.2s' }}>
            🔄 Regenerate
          </button>
          <button onClick={() => window.print()}
            style={{ padding: '10px 18px', borderRadius: '10px', border: '1px solid rgba(99,102,241,0.4)', background: 'rgba(99,102,241,0.1)', color: 'var(--primary)', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' }}>
            🖨️ Print
          </button>
        </div>
      </div>

      {/* Legend */}
      {!editMode && (
        <div style={{ display: 'flex', gap: '16px', marginBottom: '28px', flexWrap: 'wrap' }}>
          {[
            { color: 'var(--primary)', label: 'Study Day', icon: '📖' },
            { color: 'var(--revision)', label: 'Revision Day', icon: '🔄' },
            { color: 'var(--success)', label: 'Completed', icon: '✅' },
          ].map((item) => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 14px', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', borderRadius: '999px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              <span>{item.icon}</span><span>{item.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Content */}
      {editMode ? (
        <PlanEditor plan={plan} onSave={handleSaveEdit} saving={saving} />
      ) : (
        <PlanDisplay plan={plan} planId={planId} daysAvailable={daysAvailable} difficulty={difficulty} onShareClick={handleShare} onExportClick={handleExport} />
      )}

      {/* Analytics */}
      {!editMode && <PlanAnalytics plan={plan} quizScores={quizScores} />}

      {/* Bottom CTA */}
      <div style={{ marginTop: '48px', textAlign: 'center', padding: '36px', borderRadius: '16px', background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(6,182,212,0.08))', border: '1px solid var(--border)' }}>
        <p style={{ color: 'var(--text-muted)', marginBottom: '16px', fontSize: '0.95rem' }}>
          Need a different plan? Head back and let <strong>Syllabus2Success</strong> generate a new one for you.
        </p>
        <button onClick={() => navigate('/generate')} className="btn-primary" style={{ padding: '12px 28px' }}>
          ✨ Generate New Plan
        </button>
      </div>
    </div>
  );
};

export default ResultPage;
