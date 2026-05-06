import React, { useState, useEffect } from 'react';
import { getHealthierAlternatives, isGeminiConfigured } from '../../services/gemini';
import './home.css';

export default function AlternativesModal({ food, profile, onClose, onFoodClick }) {
  const [alternatives, setAlternatives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const alts = await getHealthierAlternatives(food, profile);
        setAlternatives(alts);
      } catch (err) {
        setError('Failed to fetch alternatives');
      }
      setLoading(false);
    })();
  }, [food.id || food.name]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card glass-card alt-modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} id="alt-modal-close">✕</button>

        <div className="alt-modal-header">
          <div>
            <h2 style={{ fontSize: '1.2rem', marginBottom: 4 }}>🌿 Healthier Alternatives</h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              Instead of <strong style={{ color: 'var(--text-primary)' }}>{food.emoji} {food.name}</strong> ({food.calories} kcal)
            </p>
          </div>
          {!isGeminiConfigured && <span className="badge badge-orange" style={{ fontSize: '0.6rem' }}>Demo Mode</span>}
        </div>

        <div className="alt-context-strip">
          <span>Your profile: {profile.dietType || 'Any diet'}</span>
          <span>•</span>
          <span>Goal: {profile.goal || 'maintain'}</span>
          {(profile.allergies || []).length > 0 && <>
            <span>•</span>
            <span>Avoiding: {(profile.allergies || []).slice(0, 2).join(', ')}</span>
          </>}
        </div>

        {loading && (
          <div className="ai-loading" style={{ padding: '30px 0' }}>
            <div className="ai-pulse" />
            <p>Finding personalized alternatives...</p>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Consulting nutrition guidelines for your conditions
            </p>
          </div>
        )}

        {error && (
          <div className="empty-state" style={{ padding: 20 }}>
            <span style={{ fontSize: '2rem' }}>⚠️</span>
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && alternatives.map((alt, i) => (
          <div key={i} className="alt-card glass-card" id={`alt-${i}`}>
            <div className="alt-card-top">
              <div className="alt-card-header">
                <span className="alt-emoji">{alt.emoji}</span>
                <div>
                  <div className="alt-name">{alt.name}</div>
                  <div className="alt-cal">{alt.calories} kcal</div>
                </div>
              </div>
              <div className={`cal-change ${alt.calorieChange < 0 ? 'negative' : 'positive'}`}>
                {alt.calorieChange < 0 ? '↓' : '↑'} {Math.abs(alt.calorieChange)} kcal
              </div>
            </div>

            {/* Macro comparison */}
            <div className="alt-macros">
              {[
                { label: 'Protein', val: alt.protein, color: 'var(--blue)' },
                { label: 'Carbs', val: alt.carbs, color: 'var(--orange)' },
                { label: 'Fat', val: alt.fat, color: '#ce93d8' },
              ].map(m => (
                <div key={m.label} className="alt-macro-item">
                  <span className="alt-macro-val" style={{ color: m.color }}>{m.val}g</span>
                  <span className="alt-macro-label">{m.label}</span>
                </div>
              ))}
            </div>

            {/* Why better */}
            <div className="alt-reason">
              <div className="alt-reason-row">
                <span className="alt-reason-icon">💬</span>
                <span className="alt-reason-text">{alt.whyBetter}</span>
              </div>
            </div>

            {/* Medical backing */}
            <div className="alt-medical">
              <div className="alt-medical-row">
                <span className="alt-medical-icon">🏥</span>
                <span className="alt-medical-text">{alt.medicalBacking}</span>
              </div>
            </div>

            {/* Improvement tags */}
            {alt.improvementAreas && (
              <div className="alt-tags">
                {alt.improvementAreas.map(tag => (
                  <span key={tag} className="alt-tag">✓ {tag}</span>
                ))}
              </div>
            )}
          </div>
        ))}

        <div className="alt-footer">
          <p>💡 Recommendations are based on your diet ({profile.dietType}), conditions ({(profile.conditions || []).join(', ') || 'none'}), and goal ({profile.goal}). Always consult a healthcare professional.</p>
        </div>
      </div>
    </div>
  );
}
