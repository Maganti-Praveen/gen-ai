import React, { useState } from 'react';

const PlanEditor = ({ plan, onSave, saving }) => {
  const [editPlan, setEditPlan] = useState(plan.map((d, i) => ({ ...d, topics: [...(d.topics || [])] })));
  const [dragIdx, setDragIdx] = useState(null);
  const [dragOverIdx, setDragOverIdx] = useState(null);

  const handleTopicChange = (dayIdx, topicIdx, value) => {
    const updated = [...editPlan];
    updated[dayIdx] = { ...updated[dayIdx], topics: [...updated[dayIdx].topics] };
    updated[dayIdx].topics[topicIdx] = value;
    setEditPlan(updated);
  };

  const addTopic = (dayIdx) => {
    const updated = [...editPlan];
    updated[dayIdx] = { ...updated[dayIdx], topics: [...updated[dayIdx].topics, ''] };
    setEditPlan(updated);
  };

  const removeTopic = (dayIdx, topicIdx) => {
    const updated = [...editPlan];
    updated[dayIdx] = { ...updated[dayIdx], topics: updated[dayIdx].topics.filter((_, i) => i !== topicIdx) };
    setEditPlan(updated);
  };

  const addDay = () => {
    setEditPlan([...editPlan, { day: editPlan.length + 1, topics: [''], duration: '2 hours', revision: false, completed: false }]);
  };

  const deleteDay = (idx) => {
    if (!confirm('Delete this day?')) return;
    const updated = editPlan.filter((_, i) => i !== idx).map((d, i) => ({ ...d, day: i + 1 }));
    setEditPlan(updated);
  };

  const toggleRevision = (idx) => {
    const updated = [...editPlan];
    updated[idx] = { ...updated[idx], revision: !updated[idx].revision };
    setEditPlan(updated);
  };

  const handleDurationChange = (idx, val) => {
    const updated = [...editPlan];
    updated[idx] = { ...updated[idx], duration: val };
    setEditPlan(updated);
  };

  // Drag & Drop
  const handleDragStart = (idx) => setDragIdx(idx);
  const handleDragOver = (e, idx) => { e.preventDefault(); setDragOverIdx(idx); };
  const handleDrop = (idx) => {
    if (dragIdx === null || dragIdx === idx) { setDragIdx(null); setDragOverIdx(null); return; }
    const updated = [...editPlan];
    const [moved] = updated.splice(dragIdx, 1);
    updated.splice(idx, 0, moved);
    setEditPlan(updated.map((d, i) => ({ ...d, day: i + 1 })));
    setDragIdx(null);
    setDragOverIdx(null);
  };
  const handleDragEnd = () => { setDragIdx(null); setDragOverIdx(null); };

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {editPlan.map((day, idx) => (
          <div
            key={idx}
            draggable
            onDragStart={() => handleDragStart(idx)}
            onDragOver={(e) => handleDragOver(e, idx)}
            onDrop={() => handleDrop(idx)}
            onDragEnd={handleDragEnd}
            className="glass-card"
            style={{
              padding: '20px',
              opacity: dragIdx === idx ? 0.5 : 1,
              transform: dragOverIdx === idx ? 'scale(1.02)' : 'scale(1)',
              transition: 'all 0.2s',
              borderColor: dragOverIdx === idx ? 'var(--primary)' : undefined,
            }}
          >
            {/* Day header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ cursor: 'grab', fontSize: '1.2rem', color: 'var(--text-muted)' }} title="Drag to reorder">☰</span>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: day.revision ? 'rgba(245,158,11,0.2)' : 'linear-gradient(135deg, var(--primary), var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: day.revision ? 'var(--accent)' : '#fff', fontWeight: 800, fontSize: '0.8rem' }}>
                  {day.day}
                </div>
                <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Day {day.day}</span>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={() => toggleRevision(idx)}
                  style={{ padding: '4px 10px', borderRadius: '6px', border: '1px solid var(--border)', background: day.revision ? 'rgba(245,158,11,0.15)' : 'transparent', color: day.revision ? 'var(--accent)' : 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
                  aria-label="Toggle revision"
                >
                  {day.revision ? '🔄 Revision' : '📖 Study'}
                </button>
                <button
                  type="button"
                  onClick={() => deleteDay(idx)}
                  style={{ padding: '4px 10px', borderRadius: '6px', border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.08)', color: '#ef4444', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
                  aria-label="Delete day"
                >
                  🗑️
                </button>
              </div>
            </div>

            {/* Duration */}
            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Duration</label>
              <input
                type="text"
                value={day.duration || ''}
                onChange={(e) => handleDurationChange(idx, e.target.value)}
                className="input-field"
                style={{ marginTop: '4px', padding: '8px 12px', fontSize: '0.85rem' }}
                placeholder="e.g. 3 hours"
              />
            </div>

            {/* Topics */}
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Topics</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' }}>
                {day.topics.map((topic, ti) => (
                  <div key={ti} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input
                      type="text"
                      value={topic}
                      onChange={(e) => handleTopicChange(idx, ti, e.target.value)}
                      className="input-field"
                      style={{ flex: 1, padding: '8px 12px', fontSize: '0.85rem' }}
                      placeholder="Topic name"
                    />
                    <button
                      type="button"
                      onClick={() => removeTopic(idx, ti)}
                      style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.8rem' }}
                      aria-label="Remove topic"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addTopic(idx)}
                  style={{ padding: '6px 12px', borderRadius: '8px', border: '1px dashed var(--border)', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
                  aria-label="Add topic"
                >
                  + Add Topic
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '12px', marginTop: '20px', flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={addDay}
          style={{ padding: '10px 20px', borderRadius: '10px', border: '1px dashed var(--primary)', background: 'rgba(99,102,241,0.06)', color: 'var(--primary)', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' }}
          aria-label="Add custom day"
        >
          ➕ Add Custom Day
        </button>
        <button
          className="btn-primary"
          onClick={() => onSave(editPlan)}
          disabled={saving}
          style={{ padding: '10px 28px' }}
          aria-label="Save changes"
        >
          {saving ? '⏳ Saving...' : '💾 Save Changes'}
        </button>
      </div>
    </div>
  );
};

export default PlanEditor;
