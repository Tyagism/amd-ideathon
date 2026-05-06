import React, { useState, useEffect } from 'react';
import { getAIRecommendations, isGeminiConfigured } from '../../services/gemini';
import './home.css';

export default function AIRecommendations({ profile, onFoodClick, onFindAlt, stats }) {
  const [recs, setRecs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRecs = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAIRecommendations(profile, stats?.recentSearches || []);
      setRecs(data);
    } catch (err) {
      setError('Failed to get recommendations');
    }
    setLoading(false);
  };

  useEffect(() => { fetchRecs(); }, []);

  return (
    <section className="home-section animate-up">
      <div className="section-header">
        <h3>✨ AI Food Recommendations</h3>
        <button className="btn-ghost" onClick={fetchRecs} style={{ fontSize: '0.78rem' }} id="refresh-recs">
          {loading ? '⏳' : '↻'} Refresh
        </button>
      </div>

      {!isGeminiConfigured && (
        <div className="ai-badge-strip">
          <span className="badge badge-orange">🔑 Demo Mode — Add Gemini API key in .env.local for live AI</span>
        </div>
      )}

      {loading && (
        <div className="ai-loading">
          <div className="ai-pulse" />
          <p>Analyzing your health profile...</p>
          <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            Considering: {profile.dietType}, {profile.goal} goal, {(profile.allergies || []).length} allergies, {(profile.conditions || []).length} conditions
          </p>
        </div>
      )}

      {error && (
        <div className="empty-state">
          <span style={{ fontSize: '2rem' }}>⚠️</span>
          <p>{error}</p>
          <button className="btn-secondary" style={{ maxWidth: 200 }} onClick={fetchRecs}>Try Again</button>
        </div>
      )}

      {!loading && !error && recs.length > 0 && (
        <div className="rec-grid">
          {recs.map((rec, i) => (
            <div key={i} className="rec-card glass-card" onClick={() => onFoodClick && onFoodClick({
              id: rec.name.toLowerCase().replace(/\s/g, '-'),
              name: rec.name,
              emoji: rec.emoji,
              calories: rec.calories,
              category: rec.category || 'protein',
              tags: [],
              protein: 0, carbs: 0, fat: 0, fiber: 0,
              isVeg: true, allergens: [], avoidFor: [], goodFor: [],
              mealType: [], description: rec.reason,
              servingSize: '1 serving',
            })} id={`rec-${i}`}>
              <div className="rec-top">
                <span className="rec-emoji">{rec.emoji}</span>
                <div className="rec-match-badge">
                  <span className="match-score">{rec.matchScore}%</span>
                  <span className="match-label">match</span>
                </div>
              </div>
              <div className="rec-name">{rec.name}</div>
              <div className="rec-cal">{rec.calories} kcal</div>
              <div className="rec-reason">💬 {rec.reason}</div>
              <div className="rec-benefit">
                <span className="benefit-tag">🏥 {rec.benefit}</span>
              </div>
              <button className="alt-btn-small" onClick={(e) => {
                e.stopPropagation();
                onFindAlt && onFindAlt({
                  id: rec.name.toLowerCase().replace(/\s/g, '-'),
                  name: rec.name, emoji: rec.emoji, calories: rec.calories,
                  protein: 10, carbs: 20, fat: 5,
                  tags: [], allergens: [], category: rec.category || 'protein',
                });
              }}>
                🌿 Find Healthier
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
