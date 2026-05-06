import React, { useEffect } from 'react';
import { useUser } from '../../context/UserContext';
import './onboarding.css';

export default function Welcome({ onNext }) {
  const { profile } = useUser();

  useEffect(() => {
    if (profile.onboardingComplete) onNext('home');
  }, []);

  return (
    <div className="welcome-page">
      <div className="welcome-bg">
        <div className="welcome-blob blob1" />
        <div className="welcome-blob blob2" />
      </div>

      <div className="welcome-content">
        <div className="welcome-logo animate-up">
          <div className="logo-ring">
            <span className="logo-emoji">🥦</span>
          </div>
        </div>

        <div className="animate-up delay-1">
          <h1 className="welcome-title">
            Your Smart<br /><span className="gradient-text">Nutrition</span><br />Companion
          </h1>
        </div>

        <p className="welcome-desc animate-up delay-2">
          Personalized food recommendations powered by your unique health profile, goals, and real-time wellness data.
        </p>

        <div className="welcome-features animate-up delay-3">
          {[
            { icon: '🎯', text: 'Goal-based nutrition plans' },
            { icon: '🩺', text: 'Medical condition aware' },
            { icon: '📊', text: 'Real-time health tracking' },
          ].map((f, i) => (
            <div key={i} className="feature-pill">
              <span>{f.icon}</span>
              <span>{f.text}</span>
            </div>
          ))}
        </div>

        <div className="welcome-actions animate-up delay-4">
          <button className="btn-primary" onClick={() => onNext('bmi')} id="btn-get-started">
            Get Started →
          </button>
          <p className="welcome-note">Free • No account required • Data stays on device</p>
        </div>
      </div>
    </div>
  );
}
