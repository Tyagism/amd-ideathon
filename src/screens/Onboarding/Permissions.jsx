import React, { useState } from 'react';
import { useUser } from '../../context/UserContext';
import './onboarding.css';

const PERMS = [
  { id: 'location',      icon: '📍', title: 'Location Access', desc: 'Personalize food availability near you', benefit: 'Better local recommendations' },
  { id: 'activity',      icon: '🏃', title: 'Activity & Steps', desc: 'Google Fit / Apple Health bridge', benefit: 'Track daily movement goals' },
  { id: 'health',        icon: '❤️', title: 'Health Data (SPO2, BP)', desc: 'Wellbeing & wearable integration', benefit: 'Monitor vital health signs' },
  { id: 'notifications', icon: '🔔', title: 'Notifications', desc: 'Meal reminders & hydration alerts', benefit: 'Stay on track with goals' },
];

export default function Permissions({ onNext, onBack }) {
  const { profile, grantPermission, updateProfile } = useUser();
  const [granted, setGranted] = useState(profile.permissions || {});
  const [loading, setLoading] = useState({});

  const toggle = async (id) => {
    setLoading(l => ({ ...l, [id]: true }));
    await new Promise(r => setTimeout(r, 600)); // Simulate permission dialog
    const newVal = !granted[id];
    setGranted(g => ({ ...g, [id]: newVal }));
    grantPermission(id, newVal);
    setLoading(l => ({ ...l, [id]: false }));
  };

  const handleFinish = () => {
    updateProfile({ onboardingComplete: true });
    onNext('home');
  };

  return (
    <div className="ob-page">
      <div className="ob-header animate-up">
        <span className="ob-step-label">Step 4 of 4 · Permissions</span>
        <h2>Connect your<br />wellness data 🔗</h2>
        <p>Optional integrations to make your experience smarter. You can change these anytime.</p>
      </div>

      <div className="ob-body">
        {PERMS.map((p, i) => (
          <div key={p.id} className={`perm-card animate-up delay-${i+1}${granted[p.id] ? ' granted' : ''}`}>
            <span className="perm-icon">{p.icon}</span>
            <div className="perm-info">
              <div className="perm-title">{p.title}</div>
              <div className="perm-desc">{p.desc}</div>
              {granted[p.id] && (
                <div style={{ fontSize:'0.72rem', color:'var(--green-primary)', marginTop:4, fontWeight:600 }}>
                  ✓ {p.benefit}
                </div>
              )}
            </div>
            <button
              id={`perm-toggle-${p.id}`}
              className={`perm-toggle${granted[p.id] ? ' on' : ''}`}
              onClick={() => toggle(p.id)}
              style={{ opacity: loading[p.id] ? 0.6 : 1 }}
            />
          </div>
        ))}

        {/* Health App integration info */}
        <div className="glass-card animate-up delay-4" style={{ padding:'16px 18px' }}>
          <div style={{ fontSize:'0.8rem', fontWeight:700, color:'var(--text-primary)', marginBottom:8 }}>📱 Supported Integrations</div>
          <div style={{ display:'flex', gap:12 }}>
            {[['🍏','Apple Health'],['🏃','Google Fit'],['⌚','Samsung Health'],['💍','Oura Ring']].map(([e,n]) => (
              <div key={n} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4, flex:1 }}>
                <span style={{ fontSize:'1.4rem' }}>{e}</span>
                <span style={{ fontSize:'0.6rem', color:'var(--text-muted)', textAlign:'center' }}>{n}</span>
              </div>
            ))}
          </div>
        </div>

        <p style={{ fontSize:'0.75rem', color:'var(--text-muted)', textAlign:'center', lineHeight:1.6 }}>
          🔒 All data stays on your device. We never sell or share your health information.
        </p>
      </div>

      <div className="ob-footer">
        <button className="btn-primary" onClick={handleFinish} id="btn-permissions-finish">
          🚀 Let's Go!
        </button>
        <button className="btn-secondary" onClick={() => onBack('medical')} id="btn-permissions-back">← Back</button>
      </div>
    </div>
  );
}
