import React from 'react';
import './home.css';

export default function FoodDetail({ food, onClose, profile, onFindAlternative, onLogFood }) {
  const isAllergic = (profile.allergies||[]).some(a => food.allergens?.includes(a));
  const isContraindicated = (profile.conditions||[]).some(c => food.avoidFor?.includes(c));
  const isGoodForGoal = food.goodFor?.includes(profile.goal);
  const total = (food.protein || 0) + (food.carbs || 0) + (food.fat || 0) || 1;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card glass-card" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} id="food-detail-close">✕</button>

        <div className="modal-header">
          <div className="modal-emoji">{food.emoji}</div>
          <div>
            <h2 style={{ fontSize:'1.4rem' }}>{food.name}</h2>
            <p style={{ fontSize:'0.8rem', color:'var(--text-muted)', marginTop:2 }}>{food.servingSize}</p>
          </div>
        </div>

        {/* Status badges */}
        <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginTop:4 }}>
          {isAllergic && <span className="badge badge-red">⚠️ Allergen</span>}
          {isContraindicated && <span className="badge badge-red">🚫 Contraindicated</span>}
          {isGoodForGoal && <span className="badge badge-green">✓ Matches Your Goal</span>}
          {food.isVegan && <span className="badge badge-green">🌱 Vegan</span>}
          {food.isVeg && !food.isVegan && <span className="badge badge-green">🥦 Vegetarian</span>}
          {food.allergens?.length === 0 && <span className="badge badge-blue">✓ Allergen Free</span>}
        </div>

        <p style={{ fontSize:'0.875rem', color:'var(--text-secondary)', lineHeight:1.7, marginTop:12 }}>{food.description}</p>

        {/* Calorie big display */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', margin:'16px 0', padding:'16px 20px', background:'var(--bg-input)', borderRadius:'var(--radius-md)', border:'1px solid var(--border)' }}>
          <div>
            <div style={{ fontSize:'0.7rem', color:'var(--text-muted)', textTransform:'uppercase', fontWeight:600 }}>Total Calories</div>
            <div style={{ fontSize:'2.4rem', fontWeight:800, fontFamily:'Outfit', color:'var(--green-primary)' }}>{food.calories}</div>
            <div style={{ fontSize:'0.8rem', color:'var(--text-secondary)' }}>kcal per serving</div>
          </div>
          <div style={{ fontSize:'3rem' }}>⚡</div>
        </div>

        {/* Macro breakdown */}
        <div className="detail-macros">
          {[
            { label:'Protein', val: food.protein, color:'var(--blue)', emoji:'💪' },
            { label:'Carbs',   val: food.carbs,   color:'var(--orange)', emoji:'⚡' },
            { label:'Fat',     val: food.fat,      color:'#ce93d8', emoji:'🫀' },
            { label:'Fiber',   val: food.fiber,    color:'var(--green-primary)', emoji:'🌿' },
          ].map(m => (
            <div key={m.label} className="detail-macro-item">
              <div className="detail-macro-bar-wrap">
                <div className="detail-macro-bar" style={{ width:`${(m.val/total)*100}%`, background: m.color }} />
              </div>
              <div className="detail-macro-val" style={{ color: m.color }}>{m.val}g</div>
              <div className="detail-macro-lbl">{m.label}</div>
            </div>
          ))}
        </div>

        {/* Tags */}
        <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginTop:12 }}>
          {(food.tags || []).map(t => <span key={t} className="chip" style={{ fontSize:'0.72rem', padding:'4px 10px' }}>{t}</span>)}
        </div>

        {/* Meal type */}
        {food.mealType && food.mealType.length > 0 && (
          <div style={{ marginTop:12, fontSize:'0.78rem', color:'var(--text-muted)' }}>
            Best for: {food.mealType.map(m => m.charAt(0).toUpperCase()+m.slice(1)).join(', ')}
          </div>
        )}

        {/* Action buttons */}
        <div style={{ display:'flex', gap:10, marginTop:16 }}>
          {onLogFood && (
            <button className="btn-primary" style={{ flex:1 }} onClick={() => { onLogFood(food); onClose(); }} id="btn-log-food">
              ✅ Log This Meal
            </button>
          )}
          {onFindAlternative && (
            <button className="btn-secondary" style={{ flex:1 }} onClick={() => onFindAlternative(food)} id="btn-find-alternative">
              🌿 Find Healthier
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
