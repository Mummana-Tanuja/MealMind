import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import firebaseConfig, { isFirebaseConfigured } from "./firebaseConfig";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

function friendlyPopupError(err) {
  // Map common Firebase popup errors to clearer messages
  const code = err && err.code ? err.code : null;
  if (code === "auth/popup-closed-by-user") return "Popup closed before completing sign-in.";
  if (code === "auth/cancelled-popup-request") return "Popup request was cancelled (already a pending one).";
  if (code === "auth/popup-blocked") return "Popup was blocked by the browser. Allow popups for this site.";
  if (err && typeof err.message === "string" && err.message.includes("Pending promise")) {
    return "Internal Firebase popup error: possible multiple popup requests or blocked cookies.";
  }
  return err.message || String(err);
}

export async function signInWithGoogle() {
  if (!isFirebaseConfigured()) {
    throw new Error("Firebase is not configured. Add your credentials to .env and restart the dev server.");
  }

  try {
    return await signInWithPopup(auth, googleProvider);
  } catch (err) {
    throw new Error(friendlyPopupError(err));
  }
}
