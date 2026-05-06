import React, { useState } from 'react';
import { useUser } from '../../context/UserContext';
import './onboarding.css';

export default function BMISetup({ onNext, onBack }) {
  const { profile, updateProfile } = useUser();
  const [form, setForm] = useState({
    name: profile.name || '',
    age: profile.age || '',
    gender: profile.gender || '',
    height: profile.height || '',
    weight: profile.weight || '',
    unit: profile.unit || 'metric',
  });

  const set = (k, v) => {
    const next = { ...form, [k]: v };
    setForm(next);
    updateProfile(next);
  };

  const bmi = profile.bmi;
  const cat = profile.bmiCategory;
  const bmiColor = cat === 'Normal' ? 'var(--green-primary)' : cat === 'Underweight' ? 'var(--blue)' : cat === 'Overweight' ? 'var(--orange)' : 'var(--red)';

  const valid = form.name && form.age && form.gender && form.height && form.weight;

  return (
    <div className="ob-page">
      <div className="ob-header animate-up">
        <span className="ob-step-label">Step 1 of 4 · Body Profile</span>
        <h2>Let's start with<br />your basics 📏</h2>
        <p>We'll calculate your BMI and personalize your nutrition plan.</p>
      </div>

      <div className="ob-body">
        {/* Unit toggle */}
        <div className="unit-toggle animate-up delay-1">
          <button className={`unit-btn${form.unit === 'metric' ? ' active' : ''}`} onClick={() => set('unit','metric')}>Metric (kg/cm)</button>
          <button className={`unit-btn${form.unit === 'imperial' ? ' active' : ''}`} onClick={() => set('unit','imperial')}>Imperial (lbs/in)</button>
        </div>

        {/* Name */}
        <div className="input-group animate-up delay-1">
          <label className="input-label">Your Name</label>
          <input id="input-name" className="input-field" placeholder="e.g. Priya Sharma" value={form.name} onChange={e => set('name', e.target.value)} />
        </div>

        {/* Age + Gender */}
        <div className="input-row animate-up delay-2">
          <div className="input-group">
            <label className="input-label">Age</label>
            <input id="input-age" className="input-field" type="number" min="10" max="100" placeholder="25" value={form.age} onChange={e => set('age', e.target.value)} />
          </div>
          <div className="input-group">
            <label className="input-label">Gender</label>
            <select id="input-gender" className="input-field" value={form.gender} onChange={e => set('gender', e.target.value)}>
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* Height + Weight */}
        <div className="input-row animate-up delay-2">
          <div className="input-group">
            <label className="input-label">Height ({form.unit === 'metric' ? 'cm' : 'inches'})</label>
            <input id="input-height" className="input-field" type="number" placeholder={form.unit === 'metric' ? '170' : '67'} value={form.height} onChange={e => set('height', e.target.value)} />
          </div>
          <div className="input-group">
            <label className="input-label">Weight ({form.unit === 'metric' ? 'kg' : 'lbs'})</label>
            <input id="input-weight" className="input-field" type="number" placeholder={form.unit === 'metric' ? '70' : '154'} value={form.weight} onChange={e => set('weight', e.target.value)} />
          </div>
        </div>

        {/* BMI Display */}
        {bmi && (
          <div className="glass-card bmi-gauge-container animate-up">
            <div className="bmi-value-display">
              <span className="bmi-number" style={{ color: bmiColor }}>{bmi}</span>
              <span className="bmi-category" style={{ color: bmiColor }}>{cat}</span>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              {[['< 18.5','Underweight','var(--blue)'],['18.5–25','Normal','var(--green-primary)'],['25–30','Overweight','var(--orange)'],['> 30','Obese','var(--red)']].map(([r, l, c]) => (
                <div key={l} style={{ textAlign:'center', flex:1 }}>
                  <div style={{ height:3, borderRadius:2, background: c, marginBottom:4 }} />
                  <div style={{ fontSize:'0.6rem', color: l === cat ? c : 'var(--text-muted)' }}>{l}</div>
                  <div style={{ fontSize:'0.55rem', color: 'var(--text-muted)' }}>{r}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="ob-footer">
        <button className="btn-primary" onClick={() => onNext('goal')} disabled={!valid} id="btn-bmi-next">
          Continue →
        </button>
      </div>
    </div>
  );
}
