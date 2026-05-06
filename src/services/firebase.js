import { initializeApp, getApps } from 'firebase/app';
import {
  getFirestore, doc, setDoc, getDoc, collection,
  addDoc, getDocs, query, orderBy, limit, serverTimestamp
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
};

const isConfigured = firebaseConfig.apiKey &&
  firebaseConfig.apiKey !== 'your_firebase_api_key_here' &&
  firebaseConfig.projectId &&
  firebaseConfig.projectId !== 'your-project-id';

let db = null;

if (isConfigured) {
  try {
    const app = getApps().length === 0
      ? initializeApp(firebaseConfig)
      : getApps()[0];
    db = getFirestore(app);
    console.log('🔥 Firebase connected to project:', firebaseConfig.projectId);
  } catch (err) {
    console.warn('Firebase init failed:', err.message);
  }
}

// ── Generate a stable anonymous user ID ─────────────────────────────────────
export function getUserId() {
  let uid = localStorage.getItem('nutri_uid');
  if (!uid) {
    uid = 'user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    localStorage.setItem('nutri_uid', uid);
  }
  return uid;
}

// ── Save / Update User Profile ───────────────────────────────────────────────
export async function saveUserProfile(profile) {
  const uid = getUserId();
  const profileToSave = {
    ...profile,
    updatedAt: new Date().toISOString(),
    platform: 'web',
    appVersion: '1.0.0',
  };

  if (isConfigured && db) {
    try {
      await setDoc(doc(db, 'users', uid), profileToSave, { merge: true });
    } catch (err) {
      console.warn('Firestore saveProfile failed:', err.message);
    }
  }

  // Always save locally too
  localStorage.setItem('nutri_profile', JSON.stringify(profileToSave));
}

// ── Log a Food Interaction ───────────────────────────────────────────────────
// action: 'searched' | 'viewed' | 'logged' | 'alternative_viewed'
export async function logFoodInteraction(food, action = 'viewed') {
  const uid = getUserId();
  const entry = {
    foodId:    food.id,
    foodName:  food.name,
    category:  food.category,
    calories:  food.calories,
    protein:   food.protein,
    carbs:     food.carbs,
    fat:       food.fat,
    fiber:     food.fiber || 0,
    isVeg:     food.isVeg,
    tags:      food.tags || [],
    goodFor:   food.goodFor || [],
    avoidFor:  food.avoidFor || [],
    allergens: food.allergens || [],
    action,
    timestamp: new Date().toISOString(),
    date:      new Date().toLocaleDateString('en-CA'), // YYYY-MM-DD
    hour:      new Date().getHours(),
  };

  // Save to localStorage
  const key = `nutri_foodlog_${uid}`;
  const existing = JSON.parse(localStorage.getItem(key) || '[]');
  existing.push(entry);
  // Keep last 500 entries locally
  if (existing.length > 500) existing.splice(0, existing.length - 500);
  localStorage.setItem(key, JSON.stringify(existing));

  // Save to Firestore
  if (isConfigured && db) {
    try {
      await addDoc(collection(db, 'users', uid, 'foodLog'), {
        ...entry,
        serverTs: serverTimestamp(),
      });
    } catch (err) {
      console.warn('Firestore logFood failed:', err.message);
    }
  }

  return entry;
}

// ── Get Full Food Log (local + optional Firestore) ───────────────────────────
export async function getUserFoodLog() {
  const uid = getUserId();
  const key = `nutri_foodlog_${uid}`;
  const localLog = JSON.parse(localStorage.getItem(key) || '[]');

  if (!isConfigured || !db) return localLog;

  try {
    const q = query(
      collection(db, 'users', uid, 'foodLog'),
      orderBy('timestamp', 'desc'),
      limit(200)
    );
    const snap = await getDocs(q);
    const firestoreLog = snap.docs.map(d => d.data());
    // Merge: use Firestore as source of truth if available
    return firestoreLog.length > 0 ? firestoreLog : localLog;
  } catch (err) {
    console.warn('Firestore getFoodLog failed:', err.message);
    return localLog;
  }
}

// ── Save Daily Food Log Entry ────────────────────────────────────────────────
export async function saveDailyEntry(foods, totalCalories, macros) {
  const uid = getUserId();
  const date = new Date().toLocaleDateString('en-CA');
  const entry = { date, foods, totalCalories, macros, savedAt: new Date().toISOString() };

  const key = `nutri_daily_${uid}`;
  const existing = JSON.parse(localStorage.getItem(key) || '{}');
  existing[date] = entry;
  localStorage.setItem(key, JSON.stringify(existing));

  if (isConfigured && db) {
    try {
      await setDoc(doc(db, 'users', uid, 'dailyLog', date), {
        ...entry,
        serverTs: serverTimestamp(),
      });
    } catch (err) {
      console.warn('Firestore saveDailyEntry failed:', err.message);
    }
  }
}

// ── Get Daily Log (7 days) ───────────────────────────────────────────────────
export function getDailyLog() {
  const uid = getUserId();
  const key = `nutri_daily_${uid}`;
  return JSON.parse(localStorage.getItem(key) || '{}');
}

export { isConfigured as isFirebaseConfigured };
