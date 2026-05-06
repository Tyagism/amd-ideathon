import React, { useState, useEffect, useMemo } from 'react';
import { useUser } from '../../context/UserContext';
import { useFoodLog } from '../../context/FoodLogContext';
import { getMockHealth } from '../../data/mockHealth';
import foods from '../../data/foods.json';
import FoodCard from './FoodCard';
import FoodDetail from './FoodDetail';
import AlternativesModal from './AlternativesModal';
import AIRecommendations from './AIRecommendations';
import HealthInsights from './HealthInsights';
import './home.css';

function filterFoods(foods, profile, query) {
  const isVeg = profile.dietType === 'Vegetarian' || profile.dietType === 'Vegan' || profile.dietType === 'Jain';
  const isVegan = profile.dietType === 'Vegan';
  const isKeto = profile.dietType === 'Keto';
  const isDiabetic = profile.dietType === 'Diabetic-Friendly' || profile.conditions?.includes('diabetes');
  const allergies = profile.allergies || [];
  const conditions = profile.conditions || [];

  return foods.filter(f => {
    if (isVegan && !f.isVegan) return false;
    if (isVeg && !f.isVeg) return false;
    if (isKeto && f.carbs > 20) return false;
    if (isDiabetic && f.avoidFor?.includes('diabetes')) return false;
    if (allergies.some(a => f.allergens?.includes(a))) return false;
    if (conditions.some(c => f.avoidFor?.includes(c))) return false;
    if (query) {
      const q = query.toLowerCase();
      return f.name.toLowerCase().includes(q) || f.category.toLowerCase().includes(q) || f.tags.some(t => t.includes(q));
    }
    return true;
  });
}

export default function HomeScreen() {
  const { profile } = useUser();
  const { logFood, getStats } = useFoodLog();
  const [query, setQuery] = useState('');
  const [selectedFood, setSelectedFood] = useState(null);
  const [altFood, setAltFood] = useState(null);
  const [health] = useState(() => getMockHealth());
  const [activeSection, setActiveSection] = useState('recommendations');

  const filtered = useMemo(() => filterFoods(foods, profile, query), [profile, query]);
  const stats = useMemo(() => getStats(), [getStats]);

  const handleFoodClick = (food) => {
    logFood(food, 'viewed');
    setSelectedFood(food);
  };

  const handleSearch = (e) => {
    const val = e.target.value;
    setQuery(val);
    if (val.length >= 3) {
      // Log search intent after 3 chars
      const match = foods.find(f => f.name.toLowerCase().includes(val.toLowerCase()));
      if (match) logFood(match, 'searched');
    }
  };

  const handleFindAlternative = (food) => {
    setSelectedFood(null);
    setAltFood(food);
  };

  const stepsPercent = Math.min(100, Math.round((health.steps / health.stepsGoal) * 100));

  return (
    <div className="home-screen">
      {/* Header */}
      <div className="home-header">
        <div>
          <p className="home-greeting">Welcome back 👋</p>
          <h2 className="home-name">{profile.name || 'There'}</h2>
        </div>
        <div className="home-avatar">{profile.name?.[0]?.toUpperCase() || '👤'}</div>
      </div>

      {/* Search bar — always at top */}
      <div className="search-bar-wrap">
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input
            id="food-search"
            className="search-input"
            placeholder={`Search foods… ${profile.dietType ? `(${profile.dietType} mode)` : ''}`}
            value={query}
            onChange={handleSearch}
          />
          {query && <button className="search-clear" onClick={() => setQuery('')}>✕</button>}
        </div>
        <div className="filter-pills">
          {profile.dietType && <span className="filter-pill green">✓ {profile.dietType}</span>}
          {(profile.allergies || []).slice(0, 2).map(a => <span key={a} className="filter-pill red">🚫 {a}</span>)}
          {(profile.conditions || []).slice(0, 1).map(c => <span key={c} className="filter-pill orange">⚕ {c}</span>)}
        </div>
      </div>

      <div className="home-scroll">
        {/* Search results */}
        {query ? (
          <section className="home-section">
            <div className="section-header">
              <h3>🔍 Search Results</h3>
              <span className="section-count">{filtered.length} found</span>
            </div>
            {filtered.length === 0 ? (
              <div className="empty-state">
                <span style={{ fontSize: '2rem' }}>🔍</span>
                <p>No foods match your search &amp; filters.</p>
              </div>
            ) : (
              <div className="food-grid">
                {filtered.map(f => (
                  <FoodCard key={f.id} food={f} onClick={() => handleFoodClick(f)} onFindAlt={() => handleFindAlternative(f)} showAltButton />
                ))}
              </div>
            )}
          </section>
        ) : (
          <>
            {/* Section toggle */}
            <div className="section-toggle">
              <button className={`toggle-btn${activeSection === 'recommendations' ? ' active' : ''}`} onClick={() => setActiveSection('recommendations')} id="toggle-recommendations">
                ✨ Food Recommendations
              </button>
              <button className={`toggle-btn${activeSection === 'insights' ? ' active' : ''}`} onClick={() => setActiveSection('insights')} id="toggle-insights">
                📊 Health Insights
              </button>
            </div>

            {/* Section 1: AI Food Recommendations */}
            {activeSection === 'recommendations' && (
              <AIRecommendations
                profile={profile}
                onFoodClick={handleFoodClick}
                onFindAlt={handleFindAlternative}
                stats={stats}
              />
            )}

            {/* Section 2: Health Insights */}
            {activeSection === 'insights' && (
              <HealthInsights profile={profile} stats={stats} health={health} />
            )}
          </>
        )}

        <div style={{ height: 20 }} />
      </div>

      {/* Modals */}
      {selectedFood && (
        <FoodDetail
          food={selectedFood}
          onClose={() => setSelectedFood(null)}
          profile={profile}
          onFindAlternative={handleFindAlternative}
          onLogFood={(food) => logFood(food, 'logged')}
        />
      )}
      {altFood && (
        <AlternativesModal
          food={altFood}
          profile={profile}
          onClose={() => setAltFood(null)}
          onFoodClick={handleFoodClick}
        />
      )}
    </div>
  );
}
