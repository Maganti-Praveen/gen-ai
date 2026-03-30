import React, { useState, useRef } from 'react';
import useVoiceInput from '../hooks/useVoiceInput';
import { extractTextFromImage } from '../utils/ocrParser';
import { extractTopicsApi } from '../services/api';
import { useToast } from '../context/ToastContext';

const DIFFICULTIES = [
  { value: 'easy', label: '😊 Easy', desc: 'More topics/day' },
  { value: 'medium', label: '🎯 Medium', desc: 'Balanced load' },
  { value: 'hard', label: '🔥 Hard', desc: 'Fewer topics/day' },
];

const SyllabusForm = ({ onSubmit, loading }) => {
  const { showToast } = useToast();
  const [step, setStep] = useState(1);
  const [inputMode, setInputMode] = useState('text');
  const [syllabusText, setSyllabusText] = useState('');
  const [file, setFile] = useState(null);
  const [examDate, setExamDate] = useState('');
  const [hoursPerDay, setHoursPerDay] = useState(3);
  const [difficulty, setDifficulty] = useState('medium');
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef();
  const imageRef = useRef();

  // Voice input
  const { isListening, transcript, startListening, stopListening, setTranscript, supported: voiceSupported } = useVoiceInput();
  React.useEffect(() => {
    if (transcript) setSyllabusText((prev) => prev + transcript);
  }, [transcript]);

  // OCR state
  const [ocrProgress, setOcrProgress] = useState(0);
  const [ocrProcessing, setOcrProcessing] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  // Two-step: extracted topics
  const [extractedTopics, setExtractedTopics] = useState(null);
  const [extracting, setExtracting] = useState(false);
  const [selectedTopics, setSelectedTopics] = useState({});

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  const handleFileChange = (f) => {
    if (f && (f.type === 'application/pdf' || f.type === 'text/plain')) {
      setFile(f);
    } else {
      showToast('Only PDF or TXT files are supported.', 'warning');
    }
  };

  const handleImageUpload = async (f) => {
    if (!f) return;
    setImagePreview(URL.createObjectURL(f));
    setOcrProcessing(true);
    setOcrProgress(0);
    try {
      const text = await extractTextFromImage(f, (pct) => setOcrProgress(pct));
      setSyllabusText((prev) => (prev ? prev + '\n' + text : text));
      setInputMode('text');
      showToast('Text extracted from image successfully!', 'success');
    } catch (err) {
      showToast('OCR failed: ' + err.message, 'error');
    }
    setOcrProcessing(false);
  };

  // Step 1: Analyze syllabus
  const handleAnalyze = async () => {
    const text = syllabusText.trim();
    if (!text) { showToast('Please enter your syllabus first.', 'warning'); return; }
    setExtracting(true);
    try {
      const res = await extractTopicsApi(text);
      setExtractedTopics(res.data);
      // Select all by default
      const sel = {};
      (res.data.units || []).forEach((u, ui) => {
        (u.topics || []).forEach((_, ti) => { sel[`${ui}-${ti}`] = true; });
      });
      setSelectedTopics(sel);
      setStep(2);
      showToast('Topics extracted! Review and proceed.', 'success');
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to analyze syllabus', 'error');
    }
    setExtracting(false);
  };

  // Step 2: Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (step === 1) { handleAnalyze(); return; }

    if (!examDate) { showToast('Please select your exam date.', 'warning'); return; }
    const hours = Number(hoursPerDay);
    if (isNaN(hours) || hours < 1 || hours > 16) { showToast('Hours must be between 1 and 16.', 'warning'); return; }

    // Build final syllabus from selected topics
    let finalSyllabus = syllabusText.trim();
    if (extractedTopics) {
      const selected = [];
      (extractedTopics.units || []).forEach((u, ui) => {
        const topics = (u.topics || []).filter((_, ti) => selectedTopics[`${ui}-${ti}`]);
        if (topics.length > 0) selected.push(`${u.unitName}: ${topics.join(', ')}`);
      });
      if (selected.length > 0) finalSyllabus = selected.join('\n');
    }

    if (inputMode === 'file' && file && step === 1) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('examDate', examDate);
      formData.append('hoursPerDay', hours);
      formData.append('difficulty', difficulty);
      if (extractedTopics) formData.append('extractedTopics', JSON.stringify(extractedTopics));
      onSubmit(formData, true);
    } else {
      onSubmit({ syllabus: finalSyllabus, examDate, hoursPerDay: hours, difficulty, extractedTopics: extractedTopics || undefined }, false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Step Indicator */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', alignItems: 'center' }}>
        <StepDot num={1} active={step === 1} done={step > 1} label="Input Syllabus" />
        <div style={{ width: '40px', height: '2px', background: step > 1 ? 'var(--primary)' : 'var(--border)', transition: 'background 0.3s' }} />
        <StepDot num={2} active={step === 2} done={false} label="Review & Generate" />
      </div>

      {step === 1 && (
        <>
          {/* Input Mode Toggle */}
          <div>
            <label className="form-label">Syllabus Input Mode</label>
            <div style={{ display: 'flex', gap: '10px', marginTop: '4px', flexWrap: 'wrap' }}>
              {[
                { id: 'text', icon: '📝', label: 'Type' },
                { id: 'file', icon: '📁', label: 'File' },
                { id: 'image', icon: '📸', label: 'Photo' },
              ].map((m) => (
                <button key={m.id} type="button" onClick={() => setInputMode(m.id)}
                  style={{ flex: 1, minWidth: '80px', padding: '12px', borderRadius: '12px', border: inputMode === m.id ? '2px solid var(--primary)' : '1px solid var(--border)', background: inputMode === m.id ? 'rgba(99,102,241,0.1)' : 'rgba(255,255,255,0.03)', color: inputMode === m.id ? 'var(--primary)' : 'var(--text-muted)', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                  {m.icon} {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Text Input */}
          {inputMode === 'text' && (
            <div>
              <label className="form-label">Syllabus Content</label>
              <div style={{ position: 'relative' }}>
                <textarea className="input-field" rows={8} placeholder="Paste your syllabus here..." value={syllabusText} onChange={(e) => setSyllabusText(e.target.value)} style={{ resize: 'vertical', minHeight: '160px', paddingRight: '50px' }} />
                {/* Voice Button */}
                {voiceSupported && (
                  <button type="button" onClick={isListening ? stopListening : startListening} aria-label={isListening ? 'Stop listening' : 'Start voice input'}
                    style={{ position: 'absolute', right: '12px', top: '12px', width: '36px', height: '36px', borderRadius: '50%', border: 'none', background: isListening ? '#ef4444' : 'rgba(99,102,241,0.15)', color: isListening ? '#fff' : 'var(--primary)', cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: isListening ? 'pulse-glow 1s infinite' : 'none', transition: 'all 0.2s' }}>
                    🎤
                  </button>
                )}
              </div>
              {isListening && <p style={{ fontSize: '0.78rem', color: '#ef4444', fontWeight: 600, marginTop: '6px', animation: 'pulse-glow 1.5s infinite' }}>🎤 Listening... Speak your syllabus</p>}
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '6px' }}>List units or topics — one per line for best results.</p>
            </div>
          )}

          {/* File Upload */}
          {inputMode === 'file' && (
            <div>
              <label className="form-label">Upload Syllabus File</label>
              <div onDragOver={(e) => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)} onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFileChange(e.dataTransfer.files[0]); }} onClick={() => fileRef.current.click()}
                style={{ border: `2px dashed ${dragOver ? 'var(--primary)' : file ? 'var(--success)' : 'var(--border)'}`, borderRadius: '14px', padding: '40px 20px', textAlign: 'center', cursor: 'pointer', background: dragOver ? 'rgba(99,102,241,0.07)' : file ? 'rgba(16,185,129,0.05)' : 'rgba(255,255,255,0.02)', transition: 'all 0.2s' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>{file ? '✅' : '📄'}</div>
                {file ? (
                  <>
                    <p style={{ fontWeight: 600, color: 'var(--success)' }}>{file.name}</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>{(file.size / 1024).toFixed(1)} KB — Click to change</p>
                  </>
                ) : (
                  <>
                    <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Drop your file here</p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>or click to browse · PDF or TXT</p>
                  </>
                )}
              </div>
              <input ref={fileRef} type="file" accept=".pdf,.txt" hidden onChange={(e) => handleFileChange(e.target.files[0])} />
            </div>
          )}

          {/* Image Upload / OCR */}
          {inputMode === 'image' && (
            <div>
              <label className="form-label">Upload Syllabus Photo</label>
              <div onClick={() => imageRef.current?.click()}
                style={{ border: '2px dashed var(--border)', borderRadius: '14px', padding: '40px 20px', textAlign: 'center', cursor: 'pointer', background: 'rgba(255,255,255,0.02)', transition: 'all 0.2s' }}>
                {imagePreview ? (
                  <img src={imagePreview} alt="Syllabus preview" style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px', objectFit: 'contain', marginBottom: '12px' }} />
                ) : (
                  <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>📸</div>
                )}
                {ocrProcessing ? (
                  <div>
                    <p style={{ fontWeight: 600, color: 'var(--primary)', marginBottom: '8px' }}>Extracting text... {ocrProgress}%</p>
                    <div className="progress-bar-bg" style={{ maxWidth: '300px', margin: '0 auto' }}>
                      <div className="progress-bar-fill" style={{ width: `${ocrProgress}%` }} />
                    </div>
                  </div>
                ) : (
                  <>
                    <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Drop an image or click to upload</p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>JPG, PNG, or use camera</p>
                  </>
                )}
              </div>
              <input ref={imageRef} type="file" accept="image/*" capture="environment" hidden onChange={(e) => handleImageUpload(e.target.files[0])} />
            </div>
          )}

          {/* Analyze Button */}
          <button type="submit" className="btn-primary" disabled={extracting || loading || ocrProcessing}
            style={{ width: '100%', padding: '16px', fontSize: '1.05rem', borderRadius: '14px' }}>
            {extracting ? '🔍 Analyzing Syllabus...' : '🔍 Analyze Syllabus → Step 2'}
          </button>
        </>
      )}

      {/* STEP 2 */}
      {step === 2 && extractedTopics && (
        <>
          {/* Extracted Topics Preview */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <label className="form-label" style={{ margin: 0 }}>Extracted Topics</label>
              <button type="button" onClick={() => setStep(1)} style={{ padding: '6px 14px', borderRadius: '8px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>← Back to Step 1</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {(extractedTopics.units || []).map((unit, ui) => (
                <div key={ui} className="glass-card" style={{ padding: '16px' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '10px', color: 'var(--primary)' }}>📘 {unit.unitName}</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {(unit.topics || []).map((topic, ti) => (
                      <label key={ti} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '20px', border: `1px solid ${selectedTopics[`${ui}-${ti}`] ? 'var(--primary)' : 'var(--border)'}`, background: selectedTopics[`${ui}-${ti}`] ? 'rgba(99,102,241,0.1)' : 'transparent', cursor: 'pointer', fontSize: '0.82rem', transition: 'all 0.2s', color: selectedTopics[`${ui}-${ti}`] ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                        <input type="checkbox" checked={!!selectedTopics[`${ui}-${ti}`]} onChange={() => setSelectedTopics((prev) => ({ ...prev, [`${ui}-${ti}`]: !prev[`${ui}-${ti}`] }))} style={{ accentColor: 'var(--primary)' }} />
                        {topic}
                      </label>
                    ))}
                  </div>
                  {unit.estimatedHours && <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '8px' }}>⏱️ Est. {unit.estimatedHours}h · {unit.difficulty}</p>}
                </div>
              ))}
            </div>

            {extractedTopics.suggestedDays && (
              <div style={{ marginTop: '12px', padding: '10px 14px', borderRadius: '10px', background: 'rgba(6,182,212,0.07)', border: '1px solid rgba(6,182,212,0.2)', fontSize: '0.82rem', color: 'var(--secondary)' }}>
                💡 AI suggests {extractedTopics.suggestedDays} days at {extractedTopics.suggestedHoursPerDay}h/day
              </div>
            )}
          </div>

          {/* Exam Date + Hours */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label className="form-label">Exam Date</label>
              <input type="date" className="input-field" min={minDate} value={examDate} onChange={(e) => setExamDate(e.target.value)} required style={{ colorScheme: 'dark' }} />
            </div>
            <div>
              <label className="form-label">Daily Study Hours</label>
              <input type="number" className="input-field" min={1} max={16} value={hoursPerDay} onChange={(e) => setHoursPerDay(e.target.value)} required />
            </div>
          </div>

          {/* Difficulty */}
          <div>
            <label className="form-label">Difficulty Level</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginTop: '4px' }}>
              {DIFFICULTIES.map((d) => (
                <button key={d.value} type="button" onClick={() => setDifficulty(d.value)}
                  style={{ padding: '14px 10px', borderRadius: '12px', border: difficulty === d.value ? '2px solid var(--primary)' : '1px solid var(--border)', background: difficulty === d.value ? 'rgba(99,102,241,0.12)' : 'rgba(255,255,255,0.03)', color: difficulty === d.value ? 'var(--text-primary)' : 'var(--text-muted)', cursor: 'pointer', transition: 'all 0.2s', textAlign: 'center' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '4px' }}>{d.label}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{d.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Generate */}
          <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', padding: '16px', fontSize: '1.05rem', borderRadius: '14px' }}>
            {loading ? '⏳ Generating...' : '✨ Generate My Study Plan'}
          </button>
        </>
      )}
    </form>
  );
};

const StepDot = ({ num, active, done, label }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: done ? 'var(--success)' : active ? 'linear-gradient(135deg, var(--primary), var(--secondary))' : 'rgba(255,255,255,0.06)', border: active ? 'none' : '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.8rem', color: done || active ? '#fff' : 'var(--text-muted)', transition: 'all 0.3s' }}>
      {done ? '✓' : num}
    </div>
    <span style={{ fontSize: '0.68rem', color: active ? 'var(--primary)' : 'var(--text-muted)', fontWeight: 600 }}>{label}</span>
  </div>
);

export default SyllabusForm;
