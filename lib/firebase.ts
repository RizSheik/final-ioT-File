import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase with error handling
let app;
try {
  console.log('Firebase: Initializing with config', {
    apiKey: firebaseConfig.apiKey ? '***' : 'missing',
    authDomain: firebaseConfig.authDomain,
    projectId: firebaseConfig.projectId
  });
  app = initializeApp(firebaseConfig);
  console.log('Firebase: Successfully initialized');
} catch (error) {
  console.error('Firebase initialization error:', error);
  // Initialize with minimal config if env vars are missing
  try {
    app = initializeApp({
      apiKey: "demo-key",
      authDomain: "demo.firebaseapp.com",
      projectId: "demo-project",
      storageBucket: "demo.appspot.com",
      messagingSenderId: "123456789",
      appId: "demo-app-id",
      measurementId: "demo-measurement-id"
    });
    console.log('Firebase: Initialized with fallback config');
  } catch (fallbackError) {
    console.error('Firebase: Failed to initialize with fallback config', fallbackError);
    // If all else fails, create a minimal app
    app = initializeApp({
      apiKey: "minimal-key",
      projectId: "minimal-project"
    }, 'minimal-app');
  }
}

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Analytics (only on client side)
let analytics;
if (typeof window !== 'undefined') {
  try {
    analytics = getAnalytics(app);
  } catch (error) {
    console.error('Analytics initialization error:', error);
    analytics = null;
  }
}

export { analytics };
