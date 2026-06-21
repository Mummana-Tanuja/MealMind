const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyCqi8-GGD8T3pLcC8grNO9ZrtN3AWqjrTM",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "mealmind-def29.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "mealmind-def29",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "mealmind-def29.firebasestorage.app",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "68881144861",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:68881144861:web:e5aabe8b1146354a537af4",
};

export const isFirebaseConfigured = () => {
  if (!firebaseConfig || !firebaseConfig.apiKey || !firebaseConfig.authDomain) return false;
  // basic guard against placeholder values
  if (firebaseConfig.apiKey.includes("<") || firebaseConfig.authDomain.includes("<")) return false;
  return true;
};

export default firebaseConfig;
