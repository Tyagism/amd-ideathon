import React, { useState, useEffect } from 'react';
import { getMockHealth } from '../../data/mockHealth';
import Branding from '../../components/Branding';
import '../Home/home.css';
import './health.css';

export default function HealthDashboard() {
  const [health, setHealth] = useState(getMockHealth());
  const [refreshing, setRefreshing] = useState(false);

  const refresh = async () => {
    setRefreshing(true);
    await new Promise(r => setTimeout(r, 800));
    setHealth(getMockHealth());
    setRefreshing(false);
  };

  useEffect(() => {
    const t = setInterval(() => setHealth(getMockHealth()), 30000);
    return () => clearInterval(t);
  }, []);

  const stepsPercent = Math.min(100, Math.round((health.steps / health.stepsGoal) * 100));
  const waterPercent = Math.round((health.water / health.waterGoal) * 100);

  return (
    <div className="home-screen">
      <div className="home-header">
        <div>
          <p className="home-greeting">Live data</p>
          <h2 className="home-name">Health Dashboard 📊</h2>
        </div>
        <button className={`btn-ghost refresh-btn${refreshing ? ' spinning' : ''}`} onClick={refresh} id="refresh-health">
          ↻
        </button>
      </div>

      <div className="home-scroll">
        {/* Big stats */}
        <div className="big-stat-grid">
          <BigStat icon="👣" value={health.steps.toLocaleString()} label="Steps Today" sub={`Goal: ${health.stepsGoal.toLocaleString()}`} color="var(--green-primary)" percent={stepsPercent} />
          <BigStat icon="❤️" value={`${health.spo2}%`} label="Blood Oxygen" sub="Normal: 95-100%" color="var(--blue)" percent={health.spo2} />
        </div>

        <div className="big-stat-grid">
          <BigStat icon="🩸" value={health.bp} label="Blood Pressure" sub="mmHg" color="var(--orange)" />
          <BigStat icon="💓" value={`${health.heartRate} bpm`} label="Heart Rate" sub="Resting" color="var(--red)" />
        </div>

        {/* Sleep card */}
        <div className="glass-card health-detail-card">
          <div className="health-detail-header">
            <span style={{ fontSize:'1.5rem' }}>😴</span>
            <div>
              <div className="health-detail-title">Sleep Duration</div>
              <div className="health-detail-sub">Last night</div>
            </div>
            <div className="health-detail-value" style={{ color:'var(--purple)' }}>{health.sleep}h</div>
          </div>
          <div className="progress-bar" style={{ marginTop:12 }}>
            <div className="progress-fill" style={{ width:`${(health.sleep/8)*100}%`, background:'var(--purple)' }} />
          </div>
          <div style={{ fontSize:'0.7rem', color:'var(--text-muted)', marginTop:6 }}>
            {health.sleep >= 7 ? '✓ Good sleep' : '⚠ Below recommended 7-8 hours'}
          </div>
        </div>

        {/* Calories burned */}
        <div className="glass-card health-detail-card">
          <div className="health-detail-header">
            <span style={{ fontSize:'1.5rem' }}>🔥</span>
            <div>
              <div className="health-detail-title">Calories Burned</div>
              <div className="health-detail-sub">Active calories</div>
            </div>
            <div className="health-detail-value" style={{ color:'var(--orange)' }}>{health.caloriesBurned}</div>
          </div>
          <div className="progress-bar" style={{ marginTop:12 }}>
            <div className="progress-fill" style={{ width:`${Math.min(100,(health.caloriesBurned/500)*100)}%`, background:'var(--orange)' }} />
          </div>
        </div>

        {/* Water intake */}
        <div className="glass-card health-detail-card">
          <div className="health-detail-header">
            <span style={{ fontSize:'1.5rem' }}>💧</span>
            <div>
              <div className="health-detail-title">Water Intake</div>
              <div className="health-detail-sub">Goal: {health.waterGoal} glasses</div>
            </div>
            <div className="health-detail-value" style={{ color:'var(--blue)' }}>{health.water}/{health.waterGoal}</div>
          </div>
          <div style={{ display:'flex', gap:6, marginTop:12 }}>
            {Array.from({ length: health.waterGoal }, (_, i) => (
              <div key={i} style={{
                flex:1, height:8, borderRadius:4,
                background: i < health.water ? 'var(--blue)' : 'var(--border)',
                transition: 'background 0.3s ease',
              }} />
            ))}
          </div>
          <div style={{ fontSize:'0.7rem', color:'var(--text-muted)', marginTop:6 }}>
            {waterPercent >= 100 ? '✓ Hydration goal met!' : `${waterPercent}% of daily goal`}
          </div>
        </div>

        <p style={{ fontSize:'0.72rem', color:'var(--text-muted)', textAlign:'center', padding:'8px 0 20px' }}>
          📱 Simulated from Apple Health / Google Fit · Updates every 30s
        </p>
        <Branding />
      </div>
    </div>
  );
}

function BigStat({ icon, value, label, sub, color, percent }) {
  return (
    <div className="glass-card big-stat-card">
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
        <span style={{ fontSize:'1.5rem' }}>{icon}</span>
        <div>
          <div style={{ fontSize:'0.72rem', color:'var(--text-muted)', fontWeight:600, textTransform:'uppercase' }}>{label}</div>
          <div style={{ fontSize:'0.65rem', color:'var(--text-muted)' }}>{sub}</div>
        </div>
      </div>
      <div style={{ fontFamily:'Outfit', fontSize:'1.8rem', fontWeight:800, color }}>{value}</div>
      {percent !== undefined && (
        <div className="progress-bar" style={{ marginTop:10 }}>
          <div className="progress-fill" style={{ width:`${percent}%`, background: color }} />
        </div>
      )}
    </div>
  );
}
