import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext(null);

const DEFAULT_PROFILE = {
  // BMI
  name: '', age: '', gender: '', height: '', weight: '', unit: 'metric',
  bmi: null, bmiCategory: '',
  // Goals
  goal: '', dietType: '', targetWeight: '', timeline: '3',
  activityLevel: 'moderate', dailyCalories: 2000,
  // Medical
  allergies: [], conditions: [], medications: '',
  // Permissions
  permissions: { location: false, activity: false, health: false, notifications: false },
  // App state
  onboardingComplete: false,
  onboardingStep: 0,
};

function calcBMI(weight, height, unit) {
  const w = parseFloat(weight), h = parseFloat(height);
  if (!w || !h) return { bmi: null, category: '' };
  let bmi;
  if (unit === 'metric') {
    bmi = w / ((h / 100) ** 2);
  } else {
    // lbs / in²  × 703
    bmi = (w / (h ** 2)) * 703;
  }
  bmi = Math.round(bmi * 10) / 10;
  let category = '';
  if (bmi < 18.5) category = 'Underweight';
  else if (bmi < 25) category = 'Normal';
  else if (bmi < 30) category = 'Overweight';
  else category = 'Obese';
  return { bmi, category };
}

function calcCalories(profile) {
  const w = parseFloat(profile.weight) || 70;
  const h = parseFloat(profile.height) || 170;
  const a = parseInt(profile.age) || 25;
  const isMale = profile.gender === 'male';
  // Harris-Benedict BMR
  let bmr = isMale
    ? 88.362 + 13.397 * w + 4.799 * h - 5.677 * a
    : 447.593 + 9.247 * w + 3.098 * h - 4.330 * a;
  const multipliers = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, very_active: 1.9 };
  let tdee = Math.round(bmr * (multipliers[profile.activityLevel] || 1.55));
  if (profile.goal === 'lose') tdee -= 500;
  else if (profile.goal === 'gain') tdee += 300;
  else if (profile.goal === 'muscle') tdee += 200;
  return Math.max(1200, tdee);
}

export function UserProvider({ children }) {
  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('nutri_profile');
      return saved ? { ...DEFAULT_PROFILE, ...JSON.parse(saved) } : DEFAULT_PROFILE;
    } catch { return DEFAULT_PROFILE; }
  });

  useEffect(() => {
    localStorage.setItem('nutri_profile', JSON.stringify(profile));
  }, [profile]);

  const updateProfile = (updates) => {
    setProfile(prev => {
      const next = { ...prev, ...updates };
      // Recalculate BMI when body metrics change
      if ('weight' in updates || 'height' in updates || 'unit' in updates) {
        const { bmi, category } = calcBMI(next.weight, next.height, next.unit);
        next.bmi = bmi;
        next.bmiCategory = category;
      }
      // Recalculate calories when relevant fields change
      if ('activityLevel' in updates || 'goal' in updates || 'weight' in updates || 'height' in updates || 'age' in updates) {
        next.dailyCalories = calcCalories(next);
      }
      return next;
    });
  };

  const grantPermission = (key, value = true) => {
    setProfile(prev => ({ ...prev, permissions: { ...prev.permissions, [key]: value } }));
  };

  const resetProfile = () => {
    setProfile(DEFAULT_PROFILE);
    localStorage.removeItem('nutri_profile');
  };

  return (
    <UserContext.Provider value={{ profile, updateProfile, grantPermission, resetProfile }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used inside UserProvider');
  return ctx;
}
