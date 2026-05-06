import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const isConfigured = API_KEY && API_KEY !== 'your_gemini_api_key_here';

let genAI = null;
let model = null;

if (isConfigured) {
  genAI = new GoogleGenerativeAI(API_KEY);
  model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
}

// Build a rich profile summary string for Gemini prompts
function buildProfileContext(profile) {
  return `
User Health Profile:
- Name: ${profile.name}, Age: ${profile.age}, Gender: ${profile.gender}
- BMI: ${profile.bmi} (${profile.bmiCategory}), Height: ${profile.height}${profile.unit === 'metric' ? 'cm' : 'in'}, Weight: ${profile.weight}${profile.unit === 'metric' ? 'kg' : 'lbs'}
- Goal: ${profile.goal} (target weight: ${profile.targetWeight || 'not set'}, timeline: ${profile.timeline} months)
- Diet: ${profile.dietType || 'No preference'}
- Activity Level: ${profile.activityLevel || 'moderate'}
- Daily Calorie Target: ${profile.dailyCalories} kcal
- Food Allergies: ${(profile.allergies || []).join(', ') || 'None'}
- Medical Conditions: ${(profile.conditions || []).join(', ') || 'None'}
- Medications: ${profile.medications || 'None'}
`.trim();
}

// ── Get AI Food Recommendations ──────────────────────────────────────────────
export async function getAIRecommendations(profile, recentSearches = []) {
  if (!isConfigured) return getMockRecommendations(profile);

  const profileContext = buildProfileContext(profile);
  const recentContext = recentSearches.length > 0
    ? `Recent food searches: ${recentSearches.slice(0, 5).map(f => f.name).join(', ')}`
    : '';

  const prompt = `
You are a certified clinical nutritionist. Based on this user's health profile, recommend exactly 6 specific foods.

${profileContext}
${recentContext}

Respond ONLY with a valid JSON array (no markdown, no extra text):
[
  {
    "name": "Food Name",
    "emoji": "🥗",
    "calories": 200,
    "reason": "Short reason why this is perfect for their profile (max 15 words)",
    "benefit": "Key health benefit backed by nutrition science (max 12 words)",
    "matchScore": 95,
    "category": "protein|grains|fruits|vegetables|legumes|dairy|snacks|beverages"
  }
]

Rules:
- Only recommend foods appropriate for their diet type (${profile.dietType || 'any'})
- Strictly avoid foods with their allergens: ${(profile.allergies || []).join(', ') || 'none'}
- Consider their medical conditions: ${(profile.conditions || []).join(', ') || 'none'}
- Match their goal: ${profile.goal}
- matchScore should be 70-100 based on how well it fits
`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    const cleaned = text.replace(/```json|```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (err) {
    console.warn('Gemini recommendation failed, using mock:', err.message);
    return getMockRecommendations(profile);
  }
}

// ── Get Healthier Alternatives ───────────────────────────────────────────────
export async function getHealthierAlternatives(food, profile) {
  if (!isConfigured) return getMockAlternatives(food, profile);

  const profileContext = buildProfileContext(profile);

  const prompt = `
You are a registered dietitian with expertise in clinical nutrition.

A user searched for: "${food.name}" (${food.calories} kcal, ${food.protein}g protein, ${food.carbs}g carbs, ${food.fat}g fat)

${profileContext}

Suggest 3 healthier alternatives to "${food.name}" for this specific user. Each alternative must:
1. Be genuinely healthier than "${food.name}" for this user's specific conditions and goals
2. Have a concrete medical/nutritional reason backed by established guidelines (AHA, WHO, ADA, etc.)
3. Be appropriate for their diet (${profile.dietType || 'any'}) and avoid allergens (${(profile.allergies || []).join(', ') || 'none'})

Respond ONLY with valid JSON (no markdown):
[
  {
    "name": "Alternative Food Name",
    "emoji": "🥦",
    "calories": 150,
    "protein": 8,
    "carbs": 20,
    "fat": 3,
    "whyBetter": "Specific reason this is better than ${food.name} for this user (max 20 words)",
    "medicalBacking": "Evidence-based justification citing guidelines or research (max 20 words)",
    "calorieChange": -50,
    "improvementAreas": ["lower-sugar", "more-fiber", "less-saturated-fat"]
  }
]
`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    const cleaned = text.replace(/```json|```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (err) {
    console.warn('Gemini alternatives failed, using mock:', err.message);
    return getMockAlternatives(food, profile);
  }
}

// ── Get Health Insight Summary ───────────────────────────────────────────────
export async function getHealthInsightSummary(profile, stats) {
  if (!isConfigured) return getMockInsightSummary(profile, stats);

  const profileContext = buildProfileContext(profile);

  const prompt = `
You are a clinical nutritionist reviewing a patient's weekly eating data.

${profileContext}

Weekly eating data:
- Total foods logged: ${stats.totalLogged}
- Healthy choices: ${stats.healthyCount} (${stats.healthyPercent}%)
- Average daily calories: ${stats.avgCalories} kcal (target: ${profile.dailyCalories})
- Most logged category: ${stats.topCategory || 'mixed'}
- Calorie trend: ${stats.calorieTrend}

Write a 2-sentence personalized health insight summary. Be specific, encouraging, and actionable.
Start with their name: "${profile.name || 'You'}"
No JSON, just plain text.
`;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (err) {
    return getMockInsightSummary(profile, stats);
  }
}

// ── Mock Fallbacks ───────────────────────────────────────────────────────────
function getMockRecommendations(profile) {
  const isVeg = profile.dietType === 'Vegetarian' || profile.dietType === 'Vegan';
  const base = [
    { name: 'Moong Dal Chilla', emoji: '🥞', calories: 150, reason: 'High protein, perfect for your muscle goal', benefit: 'Plant protein with all essential amino acids', matchScore: 96, category: 'legumes' },
    { name: 'Greek Yogurt Bowl', emoji: '🫙', calories: 130, reason: 'Probiotic-rich, matches your calorie target', benefit: 'Boosts gut microbiome and satiety', matchScore: 92, category: 'dairy' },
    { name: 'Quinoa Salad', emoji: '🥙', calories: 222, reason: 'Complete protein, gluten-free grain', benefit: 'All 9 essential amino acids in one meal', matchScore: 94, category: 'grains' },
    { name: 'Mixed Sprouts', emoji: '🌱', calories: 90, reason: 'Raw enzymes and micronutrients for your goal', benefit: 'Highest bioavailable nutrients of any food', matchScore: 91, category: 'legumes' },
    { name: 'Chia Pudding', emoji: '🫙', calories: 180, reason: 'Omega-3 and fiber to manage blood sugar', benefit: 'Reduces post-meal glucose spikes by 20%', matchScore: 89, category: 'grains' },
    { name: 'Green Tea', emoji: '🍵', calories: 2, reason: 'Boosts metabolism aligned with your loss goal', benefit: 'Increases fat oxidation by 17% per studies', matchScore: 88, category: 'beverages' },
  ];
  return isVeg ? base : [...base.slice(0, 4), { name: 'Grilled Salmon', emoji: '🐟', calories: 208, reason: 'Omega-3 powerhouse for heart and brain', benefit: 'Reduces cardiovascular risk by 30% per AHA', matchScore: 95, category: 'protein' }, { name: 'Egg White Omelette', emoji: '🍳', calories: 68, reason: 'Highest protein-to-calorie ratio available', benefit: 'Supports lean muscle growth without excess fat', matchScore: 93, category: 'protein' }];
}

function getMockAlternatives(food, profile) {
  return [
    {
      name: 'Grilled Vegetables', emoji: '🥦', calories: Math.max(50, food.calories - 80), protein: 4, carbs: 15, fat: 2,
      whyBetter: `Lower in calories and saturated fat than ${food.name}`,
      medicalBacking: 'WHO recommends 400g+ vegetables daily for chronic disease prevention',
      calorieChange: -80, improvementAreas: ['lower-calorie', 'more-fiber', 'more-vitamins']
    },
    {
      name: 'Lentil Soup', emoji: '🍵', calories: Math.max(80, food.calories - 50), protein: 18, carbs: 40, fat: 1,
      whyBetter: 'Higher plant protein and fiber, lower glycemic impact',
      medicalBacking: 'ADA recommends legumes for blood sugar management and satiety',
      calorieChange: -50, improvementAreas: ['high-protein', 'high-fiber', 'low-gi']
    },
    {
      name: 'Mixed Sprouts Salad', emoji: '🌱', calories: 90, protein: 6, carbs: 16, fat: 0.5,
      whyBetter: 'Raw, enzyme-rich alternative with minimal processing',
      medicalBacking: 'Harvard Health: sprouted foods improve nutrient bioavailability by 30–50%',
      calorieChange: -(food.calories - 90), improvementAreas: ['low-calorie', 'enzyme-rich', 'raw-nutrients']
    }
  ];
}

function getMockInsightSummary(profile, stats) {
  const name = profile.name || 'You';
  const pct = stats.healthyPercent || 0;
  if (pct >= 70) return `${name}, you're making excellent food choices — ${pct}% of your logged foods are healthy options aligned with your ${profile.goal} goal. Keep this momentum and you're on track to reach your target weight in ${profile.timeline || 3} months.`;
  if (pct >= 40) return `${name}, you're building good habits with ${pct}% healthy choices this week. Focus on swapping one processed food per day for a whole-food alternative to accelerate your ${profile.goal} progress.`;
  return `${name}, you're just getting started on your health journey — every logged meal is a step forward. Try exploring the AI recommendations above to discover foods perfectly matched to your ${profile.goal} goal.`;
}

export { isConfigured as isGeminiConfigured };
