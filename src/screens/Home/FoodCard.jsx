import React from 'react';
import './home.css';

export default function FoodCard({ food, onClick, horizontal, danger, showAltButton, onFindAlt }) {
  const macroBar = (
    <div className="macro-bar">
      <span style={{ background:'var(--blue)', width:`${(food.protein/(food.protein+food.carbs+food.fat || 1))*100}%` }} />
      <span style={{ background:'var(--orange)', width:`${(food.carbs/(food.protein+food.carbs+food.fat || 1))*100}%` }} />
      <span style={{ background:'#ce93d8', width:`${(food.fat/(food.protein+food.carbs+food.fat || 1))*100}%` }} />
    </div>
  );

  if (horizontal) {
    return (
      <div className={`food-card-h glass-card${danger ? ' danger-card' : ''}`} onClick={onClick} id={`food-h-${food.id}`}>
        <div className="food-emoji-h">{food.emoji}</div>
        <div className="food-info-h">
          <div className="food-name-h">{food.name}</div>
          <div className="food-cal-h">{food.calories} kcal</div>
          <div className="food-tags-h">
            {(food.tags || []).slice(0,2).map(t => <span key={t} className="food-tag">{t}</span>)}
          </div>
        </div>
        <div className="food-kcal-badge">{food.calories}<br /><span>kcal</span></div>
      </div>
    );
  }

  return (
    <div className={`food-card glass-card${danger ? ' danger-card' : ''}`} onClick={onClick} id={`food-${food.id}`}>
      {danger && <div className="danger-badge">⚠️</div>}
      <div className="food-emoji">{food.emoji}</div>
      <div className="food-name">{food.name}</div>
      <div className="food-serving">{food.servingSize}</div>
      {macroBar}
      <div className="food-macros">
        <span style={{ color:'var(--blue)' }}>P {food.protein}g</span>
        <span style={{ color:'var(--orange)' }}>C {food.carbs}g</span>
        <span style={{ color:'#ce93d8' }}>F {food.fat}g</span>
      </div>
      <div className="food-cal">{food.calories} kcal</div>
      {showAltButton && onFindAlt && (
        <button className="alt-btn-small" onClick={(e) => { e.stopPropagation(); onFindAlt(food); }}>
          🌿 Healthier?
        </button>
      )}
    </div>
  );
}
