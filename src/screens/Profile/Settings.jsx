import React, { useState } from 'react';
import { useUser } from '../../context/UserContext';
import Branding from '../../components/Branding';
import '../Home/home.css';
import './settings.css';

const ALLERGIES = ['gluten','dairy','nuts','peanuts','eggs','fish','shellfish','soy','sesame','lactose'];
const CONDITIONS = ['diabetes','hypertension','celiac','pcos','thyroid','ibs','cholesterol','heart','kidney','anemia'];
const GOALS = [
  { id: 'lose', label: '🔥 Lose Weight' },
  { id: 'maintain', label: '⚖️ Maintain' },
  { id: 'gain', label: '📈 Gain Weight' },
  { id: 'muscle', label: '💪 Build Muscle' },
];
const DIETS = ['Vegetarian','Non-Vegetarian','Vegan','Keto','Diabetic-Friendly','Jain'];
const ACTIVITY = ['sedentary','light','moderate','active','very_active'];

export default function Settings() {
  const { profile, updateProfile, grantPermission, resetProfile } = useUser();
  const [section, setSection] = useState('profile');
  const [showReset, setShowReset] = useState(false);

  const toggle = (field, id) => {
    const arr = profile[field] || [];
    updateProfile({ [field]: arr.includes(id) ? arr.filter(x => x !== id) : [...arr, id] });
  };

  const SECTIONS = [
    { id:'profile',     label:'👤 Profile' },
    { id:'goals',       label:'🎯 Goals' },
    { id:'medical',     label:'🩺 Medical' },
    { id:'permissions', label:'🔗 Integrations' },
    { id:'about',       label:'ℹ️ About' },
  ];

  return (
    <div className="home-screen">
      <div className="home-header">
        <div>
          <p className="home-greeting">Manage your account</p>
          <h2 className="home-name">Settings ⚙️</h2>
        </div>
        <div className="home-avatar">{profile.name?.[0]?.toUpperCase() || '👤'}</div>
      </div>

      <div className="home-scroll">
        {/* Section tabs */}
        <div className="meal-tabs" style={{ marginBottom:20 }}>
          {SECTIONS.map(s => (
            <button key={s.id} className={`meal-tab${section === s.id ? ' active' : ''}`} onClick={() => setSection(s.id)} id={`settings-tab-${s.id}`}>
              {s.label}
            </button>
          ))}
        </div>

        {/* Profile section */}
        {section === 'profile' && (
          <div className="settings-section">
            {/* Name, Age, Gender, Height, Weight */}
            {[
              { label:'Name', field:'name', type:'text', placeholder:'Your name' },
              { label:'Age', field:'age', type:'number', placeholder:'25' },
            ].map(({ label, field, type, placeholder }) => (
              <div key={field} className="input-group" style={{ marginBottom:16 }}>
                <label className="input-label">{label}</label>
                <input id={`settings-${field}`} className="input-field" type={type} placeholder={placeholder} value={profile[field] || ''} onChange={e => updateProfile({ [field]: e.target.value })} />
              </div>
            ))}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:16 }}>
              <div className="input-group">
                <label className="input-label">Gender</label>
                <select id="settings-gender" className="input-field" value={profile.gender || ''} onChange={e => updateProfile({ gender: e.target.value })}>
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="input-group">
                <label className="input-label">Unit</label>
                <select id="settings-unit" className="input-field" value={profile.unit || 'metric'} onChange={e => updateProfile({ unit: e.target.value })}>
                  <option value="metric">Metric</option>
                  <option value="imperial">Imperial</option>
                </select>
              </div>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              <div className="input-group">
                <label className="input-label">Height ({profile.unit === 'metric' ? 'cm' : 'in'})</label>
                <input id="settings-height" className="input-field" type="number" value={profile.height || ''} onChange={e => updateProfile({ height: e.target.value })} />
              </div>
              <div className="input-group">
                <label className="input-label">Weight ({profile.unit === 'metric' ? 'kg' : 'lbs'})</label>
                <input id="settings-weight" className="input-field" type="number" value={profile.weight || ''} onChange={e => updateProfile({ weight: e.target.value })} />
              </div>
            </div>
            {profile.bmi && (
              <div className="glass-card" style={{ padding:'14px 18px', marginTop:16, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span style={{ color:'var(--text-secondary)', fontSize:'0.85rem' }}>Your BMI</span>
                <div style={{ textAlign:'right' }}>
                  <span style={{ fontFamily:'Outfit', fontSize:'1.6rem', fontWeight:800, color:'var(--green-primary)' }}>{profile.bmi}</span>
                  <span style={{ fontSize:'0.75rem', color:'var(--text-muted)', marginLeft:8 }}>{profile.bmiCategory}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Goals section */}
        {section === 'goals' && (
          <div className="settings-section">
            <div className="input-group" style={{ marginBottom:16 }}>
              <label className="input-label">Main Goal</label>
              <div className="chips-wrap">
                {GOALS.map(g => (
                  <button key={g.id} className={`chip${profile.goal === g.id ? ' active' : ''}`} onClick={() => updateProfile({ goal: g.id })} id={`settings-goal-${g.id}`}>{g.label}</button>
                ))}
              </div>
            </div>
            <div className="input-group" style={{ marginBottom:16 }}>
              <label className="input-label">Diet Preference</label>
              <div className="chips-wrap">
                {DIETS.map(d => (
                  <button key={d} className={`chip${profile.dietType === d ? ' active' : ''}`} onClick={() => updateProfile({ dietType: d })} id={`settings-diet-${d.toLowerCase()}`}>{d}</button>
                ))}
              </div>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:16 }}>
              <div className="input-group">
                <label className="input-label">Target Weight ({profile.unit === 'metric' ? 'kg' : 'lbs'})</label>
                <input id="settings-target-weight" className="input-field" type="number" value={profile.targetWeight || ''} onChange={e => updateProfile({ targetWeight: e.target.value })} />
              </div>
              <div className="input-group">
                <label className="input-label">Timeline (months)</label>
                <select id="settings-timeline" className="input-field" value={profile.timeline || '3'} onChange={e => updateProfile({ timeline: e.target.value })}>
                  <option value="1">1 month</option>
                  <option value="3">3 months</option>
                  <option value="6">6 months</option>
                  <option value="12">1 year</option>
                </select>
              </div>
            </div>
            <div className="input-group">
              <label className="input-label">Activity Level</label>
              <select id="settings-activity" className="input-field" value={profile.activityLevel || 'moderate'} onChange={e => updateProfile({ activityLevel: e.target.value })}>
                {ACTIVITY.map(a => <option key={a} value={a}>{a.charAt(0).toUpperCase() + a.slice(1).replace('_',' ')}</option>)}
              </select>
            </div>
            {profile.dailyCalories && (
              <div className="glass-card" style={{ padding:'14px 18px', marginTop:16, textAlign:'center' }}>
                <div style={{ fontSize:'0.72rem', color:'var(--text-muted)', textTransform:'uppercase', fontWeight:600 }}>Daily Calorie Target</div>
                <div style={{ fontFamily:'Outfit', fontSize:'2.4rem', fontWeight:800, color:'var(--green-primary)' }}>{profile.dailyCalories}</div>
                <div style={{ fontSize:'0.78rem', color:'var(--text-secondary)' }}>kcal/day (auto-calculated)</div>
              </div>
            )}
          </div>
        )}

        {/* Medical section */}
        {section === 'medical' && (
          <div className="settings-section">
            <div className="input-group" style={{ marginBottom:16 }}>
              <label className="input-label">Allergies {(profile.allergies||[]).length > 0 && <span style={{color:'var(--green-primary)'}}>({(profile.allergies||[]).length})</span>}</label>
              <div className="allergy-grid" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
                {ALLERGIES.map(a => (
                  <button key={a} className={`chip${(profile.allergies||[]).includes(a) ? ' active' : ''}`} style={{ justifyContent:'flex-start' }} onClick={() => toggle('allergies', a)} id={`settings-allergy-${a}`}>
                    {a.charAt(0).toUpperCase() + a.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div className="input-group" style={{ marginBottom:16 }}>
              <label className="input-label">Conditions {(profile.conditions||[]).length > 0 && <span style={{color:'var(--green-primary)'}}>({(profile.conditions||[]).length})</span>}</label>
              <div className="allergy-grid" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
                {CONDITIONS.map(c => (
                  <button key={c} className={`chip${(profile.conditions||[]).includes(c) ? ' active' : ''}`} style={{ justifyContent:'flex-start' }} onClick={() => toggle('conditions', c)} id={`settings-condition-${c}`}>
                    {c.charAt(0).toUpperCase() + c.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div className="input-group">
              <label className="input-label">Medications (optional)</label>
              <textarea id="settings-medications" className="input-field" rows={3} style={{ resize:'none' }} value={profile.medications || ''} onChange={e => updateProfile({ medications: e.target.value })} placeholder="e.g. Metformin, Thyronorm..." />
            </div>
          </div>
        )}

        {/* Permissions section */}
        {section === 'permissions' && (
          <div className="settings-section">
            {[
              { id:'location', icon:'📍', title:'Location', desc:'Local food recommendations' },
              { id:'activity', icon:'🏃', title:'Activity & Steps', desc:'Google Fit / Apple Health' },
              { id:'health',   icon:'❤️', title:'Health Data', desc:'SPO2, BP, Heart Rate' },
              { id:'notifications', icon:'🔔', title:'Notifications', desc:'Meal reminders & tips' },
            ].map(p => (
              <div key={p.id} className={`perm-card${(profile.permissions||{})[p.id] ? ' granted' : ''}`} style={{ marginBottom:12 }}>
                <span className="perm-icon">{p.icon}</span>
                <div className="perm-info">
                  <div className="perm-title">{p.title}</div>
                  <div className="perm-desc">{p.desc}</div>
                </div>
                <button id={`settings-perm-${p.id}`} className={`perm-toggle${(profile.permissions||{})[p.id] ? ' on' : ''}`} onClick={() => grantPermission(p.id, !(profile.permissions||{})[p.id])} />
              </div>
            ))}
          </div>
        )}

        {/* About section */}
        {section === 'about' && (
          <div className="settings-section">
            <div className="glass-card" style={{ padding:'24px', textAlign:'center', marginBottom:16 }}>
              <div style={{ fontSize:'3rem', marginBottom:12 }}>🥦</div>
              <h3 style={{ fontSize:'1.2rem' }}>NutriSmart</h3>
              <p style={{ fontSize:'0.8rem', color:'var(--text-muted)', marginTop:8 }}>v1.0.0 · AMD Ideathon 2026</p>
              <p style={{ fontSize:'0.82rem', color:'var(--text-secondary)', marginTop:12, lineHeight:1.7 }}>
                Smart food recommendations by <span style={{color:'var(--green-primary)', fontWeight:700}}>VeloLabs</span>. Powered by your unique health profile, goals, and real-time wellness data.
              </p>
              <div style={{ marginTop: 16 }}>
                <Branding />
              </div>
            </div>
            <div className="glass-card" style={{ padding:'16px 20px', marginBottom:16 }}>
              {[
                ['🔒','Privacy First','All data stays on your device'],
                ['🧠','AI-Powered','Smart food filtering by profile'],
                ['📊','Evidence-Based','Harris-Benedict calorie formula'],
                ['🌱','50+ Foods','Curated nutritional database'],
              ].map(([icon,title,desc]) => (
                <div key={title} style={{ display:'flex', gap:14, paddingBottom:14, borderBottom:'1px solid var(--border)', marginBottom:14, lastChild:{border:0} }}>
                  <span style={{ fontSize:'1.3rem' }}>{icon}</span>
                  <div>
                    <div style={{ fontSize:'0.88rem', fontWeight:600 }}>{title}</div>
                    <div style={{ fontSize:'0.75rem', color:'var(--text-muted)' }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <button className="btn-secondary" style={{ borderColor:'rgba(255,82,82,0.3)', color:'var(--red)' }} onClick={() => setShowReset(true)} id="btn-reset-profile">
              🗑 Reset Profile
            </button>
          </div>
        )}

        {/* Reset Confirm Modal */}
        {showReset && (
          <div className="modal-overlay" onClick={() => setShowReset(false)}>
            <div className="modal-card glass-card" style={{ padding:28 }} onClick={e => e.stopPropagation()}>
              <h3 style={{ marginBottom:12 }}>⚠️ Reset Profile?</h3>
              <p style={{ marginBottom:20 }}>This will erase all your health data and preferences. This cannot be undone.</p>
              <div style={{ display:'flex', gap:12 }}>
                <button className="btn-secondary" style={{ flex:1 }} onClick={() => setShowReset(false)}>Cancel</button>
                <button className="btn-primary" style={{ flex:1, background:'linear-gradient(135deg, var(--red), #c62828)' }} onClick={() => { resetProfile(); setShowReset(false); }} id="btn-confirm-reset">Reset</button>
              </div>
            </div>
          </div>
        )}

        <div style={{ height: 20 }} />
      </div>
    </div>
  );
}
