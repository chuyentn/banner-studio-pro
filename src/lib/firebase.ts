import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signOut as fbSignOut,
  updateProfile,
  type Auth,
  type User,
} from "firebase/auth";
import { getDatabase, ref, set, get, type Database } from "firebase/database";

/* ── Firebase config (Banner Studio Pro) ─────────────────────────────────── */

const firebaseConfig = {
  apiKey: "AIzaSyA7AJaQOD7y8OhPh8u8MXUoUaqzROfjWxI",
  authDomain: "banner-studio-pro.firebaseapp.com",
  databaseURL:
    "https://banner-studio-pro-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "banner-studio-pro",
  storageBucket: "banner-studio-pro.firebasestorage.app",
  messagingSenderId: "733780770990",
  appId: "1:733780770990:web:fc4f98df59b0c6bc26ed3f",
  measurementId: "G-8N2ZL4M6W6",
};

/* ── Lazy singleton init ─────────────────────────────────────────────────── */

let _app: FirebaseApp | null = null;
let _auth: Auth | null = null;
let _db: Database | null = null;

function ensureApp(): FirebaseApp {
  if (_app) return _app;
  _app = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);
  return _app;
}

export function getFirebaseAuth(): Auth {
  if (_auth) return _auth;
  _auth = getAuth(ensureApp());
  return _auth;
}

export function getFirebaseDB(): Database {
  if (_db) return _db;
  _db = getDatabase(ensureApp());
  return _db;
}

/* ── Auth helpers ────────────────────────────────────────────────────────── */

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

/** Email + password login */
export async function signInEmail(email: string, password: string) {
  return signInWithEmailAndPassword(getFirebaseAuth(), email, password);
}

/** Email + password register */
export async function signUpEmail(
  email: string,
  password: string,
  displayName?: string,
) {
  const cred = await createUserWithEmailAndPassword(
    getFirebaseAuth(),
    email,
    password,
  );
  if (displayName) {
    await updateProfile(cred.user, { displayName });
  }
  return cred;
}

/** Google popup login */
export async function signInGoogle() {
  return signInWithPopup(getFirebaseAuth(), googleProvider);
}

/** Password reset email */
export async function resetPassword(email: string) {
  return sendPasswordResetEmail(getFirebaseAuth(), email);
}

/** Sign out */
export async function signOut() {
  return fbSignOut(getFirebaseAuth());
}

/* ── Realtime Database helpers ───────────────────────────────────────────── */

/** Save user settings to RTDB */
export async function saveUserSettings(
  uid: string,
  settings: Record<string, unknown>,
) {
  const db = getFirebaseDB();
  await set(ref(db, `users/${uid}/settings`), settings);
}

/** Load user settings from RTDB */
export async function loadUserSettings(
  uid: string,
): Promise<Record<string, unknown> | null> {
  const db = getFirebaseDB();
  const snap = await get(ref(db, `users/${uid}/settings`));
  return snap.exists() ? (snap.val() as Record<string, unknown>) : null;
}

/** Save user profile info to RTDB */
export async function saveUserProfile(uid: string, user: User) {
  const db = getFirebaseDB();
  await set(ref(db, `users/${uid}/profile`), {
    displayName: user.displayName || null,
    email: user.email || null,
    photoURL: user.photoURL || null,
    lastLogin: Date.now(),
  });
}

export type { User };
