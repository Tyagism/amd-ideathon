import React, { useState } from 'react';
import { useUser } from '../../context/UserContext';
import './onboarding.css';

const ALLERGIES = [
  { id: 'gluten',   label: '🌾 Gluten' },
  { id: 'dairy',    label: '🥛 Dairy' },
  { id: 'nuts',     label: '🥜 Tree Nuts' },
  { id: 'peanuts',  label: '🥜 Peanuts' },
  { id: 'eggs',     label: '🥚 Eggs' },
  { id: 'fish',     label: '🐟 Fish' },
  { id: 'shellfish',label: '🦐 Shellfish' },
  { id: 'soy',      label: '🫘 Soy' },
  { id: 'sesame',   label: '🌰 Sesame' },
  { id: 'lactose',  label: '🥛 Lactose' },
];

const CONDITIONS = [
  { id: 'diabetes',       label: '🩸 Diabetes' },
  { id: 'hypertension',   label: '❤️ Hypertension' },
  { id: 'celiac',         label: '🌾 Celiac Disease' },
  { id: 'pcos',           label: '♀️ PCOS' },
  { id: 'thyroid',        label: '🦋 Thyroid' },
  { id: 'ibs',            label: '🫃 IBS' },
  { id: 'cholesterol',    label: '💔 High Cholesterol' },
  { id: 'heart',          label: '🫀 Heart Disease' },
  { id: 'kidney',         label: '🫘 Kidney Disease' },
  { id: 'anemia',         label: '🩸 Anemia' },
  { id: 'gout',           label: '🦶 Gout' },
  { id: 'arthritis',      label: '🦴 Arthritis' },
];

export default function MedicalInfo({ onNext, onBack }) {
  const { profile, updateProfile } = useUser();
  const [allergies, setAllergies] = useState(profile.allergies || []);
  const [conditions, setConditions] = useState(profile.conditions || []);
  const [medications, setMedications] = useState(profile.medications || '');

  const toggle = (arr, setArr, id) => {
    setArr(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const saveAndNext = () => {
    updateProfile({ allergies, conditions, medications });
    onNext('permissions');
  };

  return (
    <div className="ob-page">
      <div className="ob-header animate-up">
        <span className="ob-step-label">Step 3 of 4 · Medical Info</span>
        <h2>Health &amp;<br />Medical Profile 🩺</h2>
        <p>This helps us exclude harmful foods and highlight beneficial ones.</p>
      </div>

      <div className="ob-body">
        {/* Allergies */}
        <div className="input-group animate-up delay-1">
          <label className="input-label">Food Allergies {allergies.length > 0 && <span style={{ color:'var(--green-primary)' }}>({allergies.length} selected)</span>}</label>
          <div className="allergy-grid">
            {ALLERGIES.map(a => (
              <button
                key={a.id}
                id={`allergy-${a.id}`}
                className={`chip${allergies.includes(a.id) ? ' active' : ''}`}
                style={{ justifyContent: 'flex-start', width: '100%' }}
                onClick={() => toggle(allergies, setAllergies, a.id)}
              >
                {a.label}
              </button>
            ))}
          </div>
          {allergies.length === 0 && (
            <p style={{ fontSize:'0.78rem', color:'var(--text-muted)', marginTop:4 }}>Select all that apply, or skip if none</p>
          )}
        </div>

        {/* Medical Conditions */}
        <div className="input-group animate-up delay-2">
          <label className="input-label">Medical Conditions {conditions.length > 0 && <span style={{ color:'var(--green-primary)' }}>({conditions.length} selected)</span>}</label>
          <div className="allergy-grid">
            {CONDITIONS.map(c => (
              <button
                key={c.id}
                id={`condition-${c.id}`}
                className={`chip${conditions.includes(c.id) ? ' active' : ''}`}
                style={{ justifyContent: 'flex-start', width: '100%' }}
                onClick={() => toggle(conditions, setConditions, c.id)}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Medications */}
        <div className="input-group animate-up delay-3">
          <label className="input-label">Current Medications <span style={{ color:'var(--text-muted)', fontWeight:400, textTransform:'none' }}>(optional)</span></label>
          <textarea
            id="input-medications"
            className="input-field"
            rows={3}
            placeholder="e.g. Metformin, Thyronorm... or leave blank"
            value={medications}
            onChange={e => setMedications(e.target.value)}
            style={{ resize: 'none' }}
          />
        </div>

        {/* Summary */}
        {(allergies.length > 0 || conditions.length > 0) && (
          <div className="glass-card animate-up" style={{ padding:'14px 18px', display:'flex', flexDirection:'column', gap:8 }}>
            <div style={{ fontSize:'0.75rem', color:'var(--text-muted)', fontWeight:600, textTransform:'uppercase' }}>Profile Summary</div>
            {allergies.length > 0 && (
              <div style={{ fontSize:'0.82rem', color:'var(--text-secondary)' }}>
                🚫 <strong>Avoiding:</strong> {allergies.map(a => ALLERGIES.find(x=>x.id===a)?.label.split(' ').slice(1).join(' ')).join(', ')}
              </div>
            )}
            {conditions.length > 0 && (
              <div style={{ fontSize:'0.82rem', color:'var(--text-secondary)' }}>
                🩺 <strong>Managing:</strong> {conditions.map(c => CONDITIONS.find(x=>x.id===c)?.label.split(' ').slice(1).join(' ')).join(', ')}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="ob-footer">
        <button className="btn-primary" onClick={saveAndNext} id="btn-medical-next">Continue →</button>
        <button className="btn-secondary" onClick={() => onBack('goal')} id="btn-medical-back">← Back</button>
      </div>
    </div>
  );
}
