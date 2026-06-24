import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getDatabase, type Database } from "firebase/database";
import { getStorage, type FirebaseStorage } from "firebase/storage";

// Dedicated Firebase project for the Community / Join Community page.
// Used ONLY for community posts, comments, replies, likes and user-uploaded
// community images. Do not reuse this app for products or bookings.
const cfg = {
  apiKey: "AIzaSyBwn_rwL8Adi22GAkyLX_DCGoJO8PSz23E",
  authDomain: "maayachat-3f7b1.firebaseapp.com",
  databaseURL: "https://maayachat-3f7b1-default-rtdb.firebaseio.com",
  projectId: "maayachat-3f7b1",
  storageBucket: "maayachat-3f7b1.firebasestorage.app",
  messagingSenderId: "622861238277",
  appId: "1:622861238277:web:d09a634c93fe20059d5c6c",
  measurementId: "G-6X60X16DJQ",
};

const APP_NAME = "community";

export const isCommunityFirebaseConfigured = true;

let _app: FirebaseApp | null = null;
let _db: Database | null = null;
let _storage: FirebaseStorage | null = null;

function ensureApp(): FirebaseApp {
  if (_app) return _app;
  const existing = getApps().find((a) => a.name === APP_NAME);
  _app = existing ?? initializeApp(cfg, APP_NAME);
  return _app;
}

export function getCommunityFirebase(): { app: FirebaseApp; db: Database } | null {
  const app = ensureApp();
  if (!_db) _db = getDatabase(app);
  return { app, db: _db };
}

export function getCommunityStorage(): FirebaseStorage | null {
  const app = ensureApp();
  if (!_storage) _storage = getStorage(app);
  return _storage;
}