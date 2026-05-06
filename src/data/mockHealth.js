export function getMockHealth() {
  const steps = Math.floor(Math.random() * 4000) + 5000;
  const spo2 = Math.floor(Math.random() * 4) + 95;
  const bpSys = Math.floor(Math.random() * 20) + 110;
  const bpDia = Math.floor(Math.random() * 10) + 70;
  const heartRate = Math.floor(Math.random() * 20) + 65;
  const sleep = (Math.random() * 2 + 6).toFixed(1);
  const calories = Math.floor(Math.random() * 200) + 250;
  const water = Math.floor(Math.random() * 4) + 4;

  return {
    steps,
    stepsGoal: 10000,
    spo2,
    bp: `${bpSys}/${bpDia}`,
    heartRate,
    sleep: parseFloat(sleep),
    caloriesBurned: calories,
    water,
    waterGoal: 8,
    lastUpdated: new Date().toLocaleTimeString(),
  };
}
