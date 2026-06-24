import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getDatabase, type Database } from "firebase/database";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";

// Firebase config — populated from Vite env vars.
// Add these to a .env file at the project root (values provided by you):
//   VITE_FIREBASE_API_KEY=...
//   VITE_FIREBASE_AUTH_DOMAIN=...
//   VITE_FIREBASE_DATABASE_URL=...
//   VITE_FIREBASE_PROJECT_ID=...
//   VITE_FIREBASE_STORAGE_BUCKET=...
//   VITE_FIREBASE_MESSAGING_SENDER_ID=...
//   VITE_FIREBASE_APP_ID=...
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string | undefined,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string | undefined,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL as string | undefined,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string | undefined,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string | undefined,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string | undefined,
  appId: import.meta.env.VITE_FIREBASE_APP_ID as string | undefined,
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.databaseURL,
);

let _app: FirebaseApp | null = null;
let _db: Database | null = null;
let _fs: Firestore | null = null;
let _storage: FirebaseStorage | null = null;

export function getFirebase(): { app: FirebaseApp; db: Database } | null {
  if (!isFirebaseConfigured) return null;
  if (!_app) {
    _app = getApps().length ? getApp() : initializeApp(firebaseConfig as Record<string, string>);
    _db = getDatabase(_app);
  }
  return { app: _app!, db: _db! };
}

export function getFirestoreDb(): Firestore | null {
  if (!isFirebaseConfigured) return null;
  if (!_app) {
    _app = getApps().length ? getApp() : initializeApp(firebaseConfig as Record<string, string>);
  }
  if (!_fs) _fs = getFirestore(_app);
  return _fs;
}

export function getFirebaseStorage(): FirebaseStorage | null {
  if (!isFirebaseConfigured || !firebaseConfig.storageBucket) return null;
  if (!_app) {
    _app = getApps().length ? getApp() : initializeApp(firebaseConfig as Record<string, string>);
  }
  if (!_storage) _storage = getStorage(_app);
  return _storage;
}
