import React, { useState, useRef } from 'react';

const DIFFICULTIES = [
  { value: 'easy', label: '😊 Easy', desc: 'More topics/day' },
  { value: 'medium', label: '🎯 Medium', desc: 'Balanced load' },
  { value: 'hard', label: '🔥 Hard', desc: 'Fewer topics/day' },
];

const SyllabusForm = ({ onSubmit, loading }) => {
  const [inputMode, setInputMode] = useState('text'); // 'text' | 'file'
  const [syllabusText, setSyllabusText] = useState('');
  const [file, setFile] = useState(null);
  const [examDate, setExamDate] = useState('');
  const [hoursPerDay, setHoursPerDay] = useState(3);
  const [difficulty, setDifficulty] = useState('medium');
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef();

  // Get tomorrow as min date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  const handleFileChange = (f) => {
    if (f && (f.type === 'application/pdf' || f.type === 'text/plain')) {
      setFile(f);
    } else {
      alert('Only PDF or TXT files are supported.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputMode === 'text' && !syllabusText.trim()) {
      alert('Please enter your syllabus.');
      return;
    }
    if (inputMode === 'file' && !file) {
      alert('Please upload a file.');
      return;
    }
    if (!examDate) { alert('Please select your exam date.'); return; }
    const hours = Number(hoursPerDay);
    if (isNaN(hours) || hours < 1 || hours > 16) { alert('Hours per day must be between 1 and 16.'); return; }

    if (inputMode === 'file') {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('examDate', examDate);
      formData.append('hoursPerDay', hoursPerDay);
      formData.append('difficulty', difficulty);
      onSubmit(formData, true); // true = isFormData
    } else {
      onSubmit({ syllabus: syllabusText.trim(), examDate, hoursPerDay: Number(hoursPerDay), difficulty }, false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Input Mode Toggle */}
      <div>
        <label className="form-label">Syllabus Input Mode</label>
        <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
          {[
            { id: 'text', icon: '📝', label: 'Type Syllabus' },
            { id: 'file', icon: '📁', label: 'Upload File' },
          ].map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setInputMode(m.id)}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: '12px',
                border: inputMode === m.id ? '2px solid var(--primary)' : '1px solid var(--border)',
                background: inputMode === m.id ? 'rgba(99,102,241,0.1)' : 'rgba(255,255,255,0.03)',
                color: inputMode === m.id ? 'var(--primary)' : 'var(--text-muted)',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.9rem',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              {m.icon} {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Syllabus Text Input */}
      {inputMode === 'text' && (
        <div>
          <label className="form-label">Syllabus Content</label>
          <textarea
            className="input-field"
            rows={8}
            placeholder="Paste your syllabus here...&#10;&#10;Example:&#10;Unit 1: Introduction to Data Structures&#10;Unit 2: Arrays and Linked Lists&#10;Unit 3: Stacks and Queues&#10;Unit 4: Trees and Graphs&#10;Unit 5: Sorting and Searching"
            value={syllabusText}
            onChange={(e) => setSyllabusText(e.target.value)}
            style={{ resize: 'vertical', minHeight: '160px' }}
          />
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            List units, chapters, or topics — one per line for best results.
          </p>
        </div>
      )}

      {/* File Upload */}
      {inputMode === 'file' && (
        <div>
          <label className="form-label">Upload Syllabus File</label>
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFileChange(e.dataTransfer.files[0]); }}
            onClick={() => fileRef.current.click()}
            style={{
              border: `2px dashed ${dragOver ? 'var(--primary)' : file ? 'var(--success)' : 'var(--border)'}`,
              borderRadius: '14px',
              padding: '40px 20px',
              textAlign: 'center',
              cursor: 'pointer',
              background: dragOver ? 'rgba(99,102,241,0.07)' : file ? 'rgba(16,185,129,0.05)' : 'rgba(255,255,255,0.02)',
              transition: 'all 0.2s',
            }}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>{file ? '✅' : '📄'}</div>
            {file ? (
              <>
                <p style={{ fontWeight: 600, color: 'var(--success)' }}>{file.name}</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  {(file.size / 1024).toFixed(1)} KB — Click to change
                </p>
              </>
            ) : (
              <>
                <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Drop your file here</p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  or click to browse · PDF or TXT supported
                </p>
              </>
            )}
          </div>
          <input ref={fileRef} type="file" accept=".pdf,.txt" hidden onChange={(e) => handleFileChange(e.target.files[0])} />
        </div>
      )}

      {/* Grid: Exam Date + Hours */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div>
          <label className="form-label">Exam Date</label>
          <input
            type="date"
            className="input-field"
            min={minDate}
            value={examDate}
            onChange={(e) => setExamDate(e.target.value)}
            required
            style={{ colorScheme: 'dark' }}
          />
        </div>
        <div>
          <label className="form-label">Daily Study Hours</label>
          <input
            type="number"
            className="input-field"
            min={1}
            max={16}
            value={hoursPerDay}
            onChange={(e) => setHoursPerDay(e.target.value)}
            required
          />
        </div>
      </div>

      {/* Difficulty */}
      <div>
        <label className="form-label">Difficulty Level</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginTop: '4px' }}>
          {DIFFICULTIES.map((d) => (
            <button
              key={d.value}
              type="button"
              onClick={() => setDifficulty(d.value)}
              style={{
                padding: '14px 10px',
                borderRadius: '12px',
                border: difficulty === d.value ? '2px solid var(--primary)' : '1px solid var(--border)',
                background: difficulty === d.value ? 'rgba(99,102,241,0.12)' : 'rgba(255,255,255,0.03)',
                color: difficulty === d.value ? 'var(--text-primary)' : 'var(--text-muted)',
                cursor: 'pointer',
                transition: 'all 0.2s',
                textAlign: 'center',
              }}
            >
              <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '4px' }}>{d.label}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{d.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="btn-primary"
        disabled={loading}
        style={{ width: '100%', padding: '16px', fontSize: '1.05rem', borderRadius: '14px' }}
      >
        {loading ? '⏳ Generating...' : '✨ Generate My Study Plan'}
      </button>
    </form>
  );
};

export default SyllabusForm;
