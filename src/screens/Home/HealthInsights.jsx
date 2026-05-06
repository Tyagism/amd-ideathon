import React, { useState, useEffect, useMemo } from 'react';
import { getHealthInsightSummary, isGeminiConfigured } from '../../services/gemini';
import {
  AreaChart, Area, PieChart, Pie, Cell,
  BarChart, Bar, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  Legend
} from 'recharts';
import './home.css';

const COLORS = ['#00e676', '#40c4ff', '#ff9800', '#ce93d8', '#ff5252', '#ffeb3b', '#26c6da', '#ef5350'];
const CATEGORY_EMOJI = { grains:'🌾', protein:'💪', fruits:'🍎', vegetables:'🥦', legumes:'🫘', dairy:'🥛', snacks:'🍿', beverages:'🥤' };

export default function HealthInsights({ profile, stats, health }) {
  const [aiSummary, setAiSummary] = useState('');
  const [summaryLoading, setSummaryLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setSummaryLoading(true);
      const summary = await getHealthInsightSummary(profile, stats);
      setAiSummary(summary);
      setSummaryLoading(false);
    })();
  }, [stats.totalLogged]);

  const hasData = stats.totalLogged > 0;

  const macroData = useMemo(() => {
    if (stats.todayMacros.protein === 0 && stats.todayMacros.carbs === 0 && stats.todayMacros.fat === 0) return [];
    return [
      { name: 'Protein', value: stats.todayMacros.protein, color: '#40c4ff' },
      { name: 'Carbs',   value: stats.todayMacros.carbs,   color: '#ff9800' },
      { name: 'Fat',     value: stats.todayMacros.fat,     color: '#ce93d8' },
      { name: 'Fiber',   value: stats.todayMacros.fiber,   color: '#00e676' },
    ].filter(d => d.value > 0);
  }, [stats.todayMacros]);

  const healthRatioData = useMemo(() => [
    { name: 'Healthy',   count: stats.healthyCount,   fill: '#00e676' },
    { name: 'Other',     count: stats.unhealthyCount, fill: '#ff5252' },
  ], [stats.healthyCount, stats.unhealthyCount]);

  const radarData = useMemo(() => {
    return stats.categories.map(c => ({
      category: (CATEGORY_EMOJI[c.name] || '') + ' ' + (c.name || '').charAt(0).toUpperCase() + (c.name || '').slice(1),
      count: c.count,
    }));
  }, [stats.categories]);

  if (!hasData) {
    return (
      <section className="home-section animate-up">
        <div className="section-header"><h3>📊 Health Insights</h3></div>
        <div className="insights-empty glass-card">
          <div className="insights-empty-icon">📊</div>
          <h3>No Data Yet</h3>
          <p>Start searching and viewing foods to build your personalized health insights. Every interaction creates real data points!</p>
          <div className="insights-empty-steps">
            <div className="step-item"><span className="step-num">1</span><span>Search for foods above</span></div>
            <div className="step-item"><span className="step-num">2</span><span>View food details & log meals</span></div>
            <div className="step-item"><span className="step-num">3</span><span>Watch your charts come alive</span></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="home-section animate-up">
      <div className="section-header"><h3>📊 Health Insights</h3></div>

      {/* AI Summary */}
      <div className="glass-card insight-ai-card">
        <div className="insight-ai-header">
          <span>🧠</span>
          <span className="insight-ai-label">AI Health Analysis</span>
          {!isGeminiConfigured && <span className="badge badge-orange" style={{ fontSize:'0.6rem', padding:'2px 6px' }}>Demo</span>}
        </div>
        {summaryLoading ? (
          <div className="ai-summary-loading"><div className="skeleton-line" /><div className="skeleton-line short" /></div>
        ) : (
          <p className="insight-ai-text">{aiSummary}</p>
        )}
      </div>

      {/* Stats strip */}
      <div className="stat-strip">
        <StatTile value={stats.totalLogged} label="Foods Logged" color="var(--green-primary)" />
        <StatTile value={`${stats.healthyPercent}%`} label="Healthy Choices" color={stats.healthyPercent >= 60 ? 'var(--green-primary)' : 'var(--orange)'} />
        <StatTile value={stats.avgCalories || '—'} label="Avg Cal/Day" color="var(--blue)" />
        <StatTile value={stats.calorieTrend === 'decreasing' ? '↘' : stats.calorieTrend === 'increasing' ? '↗' : '→'} label="Cal Trend" color={stats.calorieTrend === 'decreasing' ? 'var(--green-primary)' : stats.calorieTrend === 'increasing' ? 'var(--red)' : 'var(--text-secondary)'} />
      </div>

      {/* Chart 1: 7-Day Calorie Trend */}
      <div className="glass-card chart-card">
        <div className="chart-header">
          <h4>🔥 7-Day Calorie Intake</h4>
          <span className="chart-sub">Real data from your food views</span>
        </div>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={stats.last7} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="calGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00e676" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00e676" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="day" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: 'rgba(5,15,10,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 12 }}
                labelStyle={{ color: '#00e676' }}
              />
              <Area type="monotone" dataKey="calories" stroke="#00e676" fill="url(#calGrad)" strokeWidth={2} dot={{ fill: '#00e676', r: 3 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        {profile.dailyCalories && (
          <div className="chart-footer">
            <span>Target: {profile.dailyCalories} kcal/day</span>
          </div>
        )}
      </div>

      {/* Chart 2: Today's Macro Breakdown */}
      {macroData.length > 0 && (
        <div className="glass-card chart-card">
          <div className="chart-header">
            <h4>🥗 Today's Macro Breakdown</h4>
            <span className="chart-sub">{stats.todayMacros.calories} kcal consumed</span>
          </div>
          <div className="chart-container" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <ResponsiveContainer width="50%" height={160}>
              <PieChart>
                <Pie data={macroData} cx="50%" cy="50%" innerRadius={38} outerRadius={60} paddingAngle={4} dataKey="value">
                  {macroData.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: 'rgba(5,15,10,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="macro-legend">
              {macroData.map(d => (
                <div key={d.name} className="macro-legend-item">
                  <span className="macro-dot" style={{ background: d.color }} />
                  <span className="macro-legend-name">{d.name}</span>
                  <span className="macro-legend-val">{d.value}g</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Chart 3: Healthy vs Unhealthy Ratio */}
      <div className="glass-card chart-card">
        <div className="chart-header">
          <h4>💚 Healthy Choice Ratio</h4>
          <span className="chart-sub">Based on your actual food interactions</span>
        </div>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={healthRatioData} layout="vertical" margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <XAxis type="number" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }} axisLine={false} tickLine={false} width={65} />
              <Tooltip contentStyle={{ background: 'rgba(5,15,10,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 12 }} />
              <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={20}>
                {healthRatioData.map((d, i) => <Cell key={i} fill={d.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-footer">
          <span>{stats.healthyPercent}% of your food choices are healthy</span>
        </div>
      </div>

      {/* Chart 4: Food Category Distribution */}
      {radarData.length >= 3 && (
        <div className="glass-card chart-card">
          <div className="chart-header">
            <h4>📡 Food Category Diversity</h4>
            <span className="chart-sub">Variety is key to balanced nutrition</span>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis dataKey="category" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }} />
                <PolarRadiusAxis tick={false} axisLine={false} />
                <Radar dataKey="count" stroke="#00e676" fill="#00e676" fillOpacity={0.2} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Chart 5: Top Searched Foods */}
      {stats.topFoods.length > 0 && (
        <div className="glass-card chart-card">
          <div className="chart-header">
            <h4>🔥 Most Explored Foods</h4>
            <span className="chart-sub">Your real search & view history</span>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={Math.max(120, stats.topFoods.length * 30)}>
              <BarChart data={stats.topFoods.slice(0, 6)} layout="vertical" margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <XAxis type="number" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 11 }} axisLine={false} tickLine={false} width={100} />
                <Tooltip contentStyle={{ background: 'rgba(5,15,10,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 12 }} />
                <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={16}>
                  {stats.topFoods.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* 7-Day Macro Trend */}
      {stats.last7.some(d => d.protein > 0) && (
        <div className="glass-card chart-card">
          <div className="chart-header">
            <h4>📈 7-Day Macro Trend</h4>
            <span className="chart-sub">Protein / Carbs / Fat over time</span>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={stats.last7} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'rgba(5,15,10,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 12 }} />
                <Area type="monotone" dataKey="protein" stroke="#40c4ff" fill="rgba(64,196,255,0.1)" strokeWidth={2} />
                <Area type="monotone" dataKey="carbs" stroke="#ff9800" fill="rgba(255,152,0,0.1)" strokeWidth={2} />
                <Area type="monotone" dataKey="fat" stroke="#ce93d8" fill="rgba(206,147,216,0.1)" strokeWidth={2} />
                <Legend iconType="line" wrapperStyle={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </section>
  );
}

function StatTile({ value, label, color }) {
  return (
    <div className="stat-tile">
      <span className="stat-value" style={{ color }}>{value}</span>
      <span className="stat-label">{label}</span>
    </div>
  );
}
