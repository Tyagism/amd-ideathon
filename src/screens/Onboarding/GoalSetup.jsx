import React, { useState } from 'react';
import { useUser } from '../../context/UserContext';
import './onboarding.css';

const GOALS = [
  { id: 'lose',     icon: '🔥', label: 'Lose Weight',    desc: 'Calorie deficit' },
  { id: 'maintain', icon: '⚖️', label: 'Maintain',       desc: 'Stay balanced' },
  { id: 'gain',     icon: '📈', label: 'Gain Weight',    desc: 'Calorie surplus' },
  { id: 'muscle',   icon: '💪', label: 'Build Muscle',   desc: 'Protein focus' },
];

const DIETS = ['Vegetarian', 'Non-Vegetarian', 'Vegan', 'Keto', 'Diabetic-Friendly', 'Jain'];
const ACTIVITY = [
  { id: 'sedentary',   label: 'Sedentary',    desc: 'Desk job, no exercise' },
  { id: 'light',       label: 'Light',        desc: '1–2 days/week' },
  { id: 'moderate',    label: 'Moderate',     desc: '3–5 days/week' },
  { id: 'active',      label: 'Active',       desc: '6–7 days/week' },
  { id: 'very_active', label: 'Very Active',  desc: 'Athlete level' },
];

export default function GoalSetup({ onNext, onBack }) {
  const { profile, updateProfile } = useUser();
  const [goal, setGoal] = useState(profile.goal || '');
  const [dietType, setDietType] = useState(profile.dietType || '');
  const [targetWeight, setTargetWeight] = useState(profile.targetWeight || '');
  const [timeline, setTimeline] = useState(profile.timeline || '3');
  const [activityLevel, setActivityLevel] = useState(profile.activityLevel || 'moderate');

  const saveAndNext = () => {
    updateProfile({ goal, dietType, targetWeight, timeline, activityLevel });
    onNext('medical');
  };

  const valid = goal && dietType;

  return (
    <div className="ob-page">
      <div className="ob-header animate-up">
        <span className="ob-step-label">Step 2 of 4 · Goals & Diet</span>
        <h2>What's your<br />main goal? 🎯</h2>
        <p>We'll tailor your daily calorie target and food suggestions.</p>
      </div>

      <div className="ob-body">
        {/* Goal cards */}
        <div className="goal-grid animate-up delay-1">
          {GOALS.map(g => (
            <div key={g.id} className={`goal-card${goal === g.id ? ' selected' : ''}`} onClick={() => setGoal(g.id)} id={`goal-${g.id}`}>
              <span className="goal-icon">{g.icon}</span>
              <span className="goal-label">{g.label}</span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{g.desc}</span>
            </div>
          ))}
        </div>

        {/* Diet preference */}
        <div className="input-group animate-up delay-2">
          <label className="input-label">Diet Preference</label>
          <div className="chips-wrap">
            {DIETS.map(d => (
              <button key={d} className={`chip${dietType === d ? ' active' : ''}`} onClick={() => setDietType(d)} id={`diet-${d.replace(/\s/g,'-').toLowerCase()}`}>
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Target weight */}
        <div className="input-row animate-up delay-2">
          <div className="input-group">
            <label className="input-label">Target Weight ({profile.unit === 'metric' ? 'kg' : 'lbs'})</label>
            <input id="input-target-weight" className="input-field" type="number" placeholder={profile.unit === 'metric' ? '65' : '143'} value={targetWeight} onChange={e => setTargetWeight(e.target.value)} />
          </div>
          <div className="input-group">
            <label className="input-label">Timeline</label>
            <select id="input-timeline" className="input-field" value={timeline} onChange={e => setTimeline(e.target.value)}>
              <option value="1">1 month</option>
              <option value="3">3 months</option>
              <option value="6">6 months</option>
              <option value="12">1 year</option>
            </select>
          </div>
        </div>

        {/* Activity level */}
        <div className="input-group animate-up delay-3">
          <label className="input-label">Activity Level</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {ACTIVITY.map(a => (
              <div key={a.id} className={`perm-card${activityLevel === a.id ? ' granted' : ''}`} style={{ cursor:'pointer', padding:'12px 16px' }} onClick={() => setActivityLevel(a.id)} id={`activity-${a.id}`}>
                <div className="perm-info">
                  <div className="perm-title">{a.label}</div>
                  <div className="perm-desc">{a.desc}</div>
                </div>
                {activityLevel === a.id && <span style={{ color: 'var(--green-primary)', fontSize: '1.2rem' }}>✓</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Calorie target preview */}
        {goal && (
          <div className="glass-card animate-up" style={{ padding: '16px 20px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform:'uppercase', fontWeight:600, letterSpacing:'0.5px' }}>Daily Target</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily:'Outfit', color:'var(--green-primary)' }}>{profile.dailyCalories || 2000}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>kcal / day</div>
            </div>
            <div style={{ fontSize:'2.5rem' }}>⚡</div>
          </div>
        )}
      </div>

      <div className="ob-footer">
        <button className="btn-primary" onClick={saveAndNext} disabled={!valid} id="btn-goal-next">Continue →</button>
        <button className="btn-secondary" onClick={() => onBack('bmi')} id="btn-goal-back">← Back</button>
      </div>
    </div>
  );
}
