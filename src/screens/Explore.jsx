import React, { useState, useMemo } from 'react';
import { useUser } from '../context/UserContext';
import foods from '../data/foods.json';
import FoodCard from './Home/FoodCard';
import FoodDetail from './Home/FoodDetail';
import './Home/home.css';

const CATEGORIES = [
  { id: 'all',       label: '🍽 All' },
  { id: 'grains',    label: '🌾 Grains' },
  { id: 'protein',   label: '💪 Protein' },
  { id: 'fruits',    label: '🍎 Fruits' },
  { id: 'vegetables',label: '🥦 Veggies' },
  { id: 'legumes',   label: '🫘 Legumes' },
  { id: 'dairy',     label: '🥛 Dairy' },
  { id: 'snacks',    label: '🍿 Snacks' },
  { id: 'beverages', label: '🥤 Drinks' },
];

export default function Explore() {
  const { profile } = useUser();
  const [category, setCategory] = useState('all');
  const [query, setQuery] = useState('');
  const [selectedFood, setSelectedFood] = useState(null);

  const filtered = useMemo(() => {
    let list = category === 'all' ? foods : foods.filter(f => f.category === category);
    if (query) {
      const q = query.toLowerCase();
      list = list.filter(f => f.name.toLowerCase().includes(q) || f.tags.some(t => t.includes(q)));
    }
    return list;
  }, [category, query]);

  return (
    <div className="home-screen">
      <div className="home-header">
        <div>
          <p className="home-greeting">Browse everything</p>
          <h2 className="home-name">Explore Foods 🔍</h2>
        </div>
        <div style={{ fontSize:'0.75rem', color:'var(--text-muted)', textAlign:'right' }}>
          <span style={{ color:'var(--green-primary)', fontWeight:700 }}>{filtered.length}</span> foods
        </div>
      </div>

      <div className="search-bar-wrap">
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input id="explore-search" className="search-input" placeholder="Search all foods..." value={query} onChange={e => setQuery(e.target.value)} />
          {query && <button className="search-clear" onClick={() => setQuery('')}>✕</button>}
        </div>
      </div>

      <div className="home-scroll">
        {/* Category scroll */}
        <div className="meal-tabs" style={{ marginBottom:20 }}>
          {CATEGORIES.map(c => (
            <button key={c.id} className={`meal-tab${category === c.id ? ' active' : ''}`} onClick={() => setCategory(c.id)} id={`cat-${c.id}`}>
              {c.label}
            </button>
          ))}
        </div>

        <div className="food-grid">
          {filtered.map(f => <FoodCard key={f.id} food={f} onClick={() => setSelectedFood(f)} />)}
        </div>

        {filtered.length === 0 && (
          <div className="empty-state">
            <span style={{ fontSize:'2rem' }}>🍽</span>
            <p>No foods found in this category.</p>
          </div>
        )}
        <div style={{ height: 20 }} />
      </div>

      {selectedFood && <FoodDetail food={selectedFood} onClose={() => setSelectedFood(null)} profile={profile} />}
    </div>
  );
}
