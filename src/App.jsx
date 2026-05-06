import React, { useState, useEffect } from 'react';
import { UserProvider, useUser } from './context/UserContext';
import { FoodLogProvider } from './context/FoodLogContext';
import { saveUserProfile } from './services/firebase';
import NavBar from './components/NavBar';
import Welcome from './screens/Onboarding/Welcome';
import BMISetup from './screens/Onboarding/BMISetup';
import GoalSetup from './screens/Onboarding/GoalSetup';
import MedicalInfo from './screens/Onboarding/MedicalInfo';
import Permissions from './screens/Onboarding/Permissions';
import HomeScreen from './screens/Home/HomeScreen';
import Explore from './screens/Explore';
import HealthDashboard from './screens/Profile/HealthDashboard';
import Settings from './screens/Profile/Settings';

function AppInner() {
  const { profile } = useUser();
  const [screen, setScreen] = useState(() => {
    if (profile.onboardingComplete) return 'home';
    return 'welcome';
  });

  // Sync profile to GCP/Firebase whenever it changes
  useEffect(() => {
    if (profile.onboardingComplete) {
      saveUserProfile(profile);
    }
  }, [profile]);

  const navigate = (s) => setScreen(s);

  const renderScreen = () => {
    switch (screen) {
      case 'welcome':     return <Welcome     onNext={navigate} />;
      case 'bmi':         return <BMISetup    onNext={navigate} onBack={navigate} />;
      case 'goal':        return <GoalSetup   onNext={navigate} onBack={navigate} />;
      case 'medical':     return <MedicalInfo onNext={navigate} onBack={navigate} />;
      case 'permissions': return <Permissions onNext={navigate} onBack={navigate} />;
      case 'home':        return <HomeScreen />;
      case 'explore':     return <Explore />;
      case 'health':      return <HealthDashboard />;
      case 'settings':    return <Settings />;
      default:            return <HomeScreen />;
    }
  };

  return (
    <div className="app-shell">
      {renderScreen()}
      <NavBar screen={screen} setScreen={navigate} />
    </div>
  );
}

export default function App() {
  return (
    <UserProvider>
      <FoodLogProvider>
        <AppInner />
      </FoodLogProvider>
    </UserProvider>
  );
}
