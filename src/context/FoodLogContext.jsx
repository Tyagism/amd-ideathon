import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { logFoodInteraction, getUserFoodLog, getUserId } from '../services/firebase';

const FoodLogContext = createContext(null);

export function FoodLogProvider({ children }) {
  const [foodLog, setFoodLog] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load log on mount
  useEffect(() => {
    (async () => {
      try {
        const log = await getUserFoodLog();
        setFoodLog(log);
      } catch (e) {
        const uid = getUserId();
        const local = JSON.parse(localStorage.getItem(`nutri_foodlog_${uid}`) || '[]');
        setFoodLog(local);
      }
      setLoading(false);
    })();
  }, []);

  const logFood = useCallback(async (food, action = 'viewed') => {
    const entry = await logFoodInteraction(food, action);
    setFoodLog(prev => [entry, ...prev]);
    return entry;
  }, []);

  // ── Computed Analytics ──────────────────────────────────────────────────────
  const getStats = useCallback(() => {
    const today = new Date().toLocaleDateString('en-CA');
    const todayEntries = foodLog.filter(e => e.date === today);
    const loggedEntries = foodLog.filter(e => e.action === 'logged' || e.action === 'viewed');

    // Last 7 days
    const last7 = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString('en-CA');
      const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short' });
      const dayEntries = loggedEntries.filter(e => e.date === dateStr);
      const cal = dayEntries.reduce((s, e) => s + (e.calories || 0), 0);
      const prot = dayEntries.reduce((s, e) => s + (e.protein || 0), 0);
      const carb = dayEntries.reduce((s, e) => s + (e.carbs || 0), 0);
      const fat = dayEntries.reduce((s, e) => s + (e.fat || 0), 0);
      last7.push({ date: dateStr, day: dayLabel, calories: cal, protein: prot, carbs: carb, fat, count: dayEntries.length });
    }

    // Healthy vs unhealthy
    const healthyKeywords = ['high-fiber', 'heart-healthy', 'low-calorie', 'plant-protein', 'antioxidant', 'probiotic', 'omega-3', 'high-protein', 'superfood', 'low-gi', 'detox', 'hydrating'];
    let healthyCount = 0;
    let unhealthyCount = 0;
    loggedEntries.forEach(e => {
      const tags = e.tags || [];
      const isHealthy = tags.some(t => healthyKeywords.some(h => t.includes(h)));
      if (isHealthy) healthyCount++; else unhealthyCount++;
    });

    // Category breakdown
    const categoryMap = {};
    loggedEntries.forEach(e => {
      categoryMap[e.category] = (categoryMap[e.category] || 0) + 1;
    });
    const categories = Object.entries(categoryMap).map(([name, count]) => ({ name, count }));

    // Top searched foods
    const foodFreq = {};
    foodLog.forEach(e => {
      foodFreq[e.foodName] = (foodFreq[e.foodName] || 0) + 1;
    });
    const topFoods = Object.entries(foodFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([name, count]) => ({ name, count }));

    // Today's macros
    const todayMacros = {
      calories: todayEntries.reduce((s, e) => s + (e.calories || 0), 0),
      protein:  todayEntries.reduce((s, e) => s + (e.protein || 0), 0),
      carbs:    todayEntries.reduce((s, e) => s + (e.carbs || 0), 0),
      fat:      todayEntries.reduce((s, e) => s + (e.fat || 0), 0),
      fiber:    todayEntries.reduce((s, e) => s + (e.fiber || 0), 0),
    };

    const totalLogged = loggedEntries.length;
    const healthyPercent = totalLogged > 0 ? Math.round((healthyCount / totalLogged) * 100) : 0;
    const avgCalories = last7.length > 0
      ? Math.round(last7.reduce((s, d) => s + d.calories, 0) / Math.max(1, last7.filter(d => d.count > 0).length))
      : 0;

    // Calorie trend
    const recentCals = last7.filter(d => d.count > 0).map(d => d.calories);
    let calorieTrend = 'stable';
    if (recentCals.length >= 3) {
      const first = recentCals.slice(0, Math.floor(recentCals.length / 2));
      const second = recentCals.slice(Math.floor(recentCals.length / 2));
      const avg1 = first.reduce((s, v) => s + v, 0) / first.length;
      const avg2 = second.reduce((s, v) => s + v, 0) / second.length;
      if (avg2 > avg1 * 1.1) calorieTrend = 'increasing';
      else if (avg2 < avg1 * 0.9) calorieTrend = 'decreasing';
    }

    const topCategory = categories.sort((a, b) => b.count - a.count)[0]?.name || '';

    return {
      todayMacros,
      last7,
      healthyCount,
      unhealthyCount,
      healthyPercent,
      categories,
      topFoods,
      totalLogged,
      avgCalories,
      calorieTrend,
      topCategory,
      recentSearches: foodLog.filter(e => e.action === 'searched').slice(0, 5),
    };
  }, [foodLog]);

  return (
    <FoodLogContext.Provider value={{ foodLog, logFood, getStats, loading }}>
      {children}
    </FoodLogContext.Provider>
  );
}

export function useFoodLog() {
  const ctx = useContext(FoodLogContext);
  if (!ctx) throw new Error('useFoodLog must be used inside FoodLogProvider');
  return ctx;
}
