import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getDatabase, type Database } from "firebase/database";

// SEPARATE Firebase project used ONLY to store booking form submissions.
const cfg = {
  apiKey: "AIzaSyCLZQDt0iFbR-IxpfDKJ_NvtryWKB2TfB4",
  authDomain: "maaya-1da6b.firebaseapp.com",
  databaseURL: "https://maaya-1da6b-default-rtdb.firebaseio.com",
  projectId: "maaya-1da6b",
  storageBucket: "maaya-1da6b.firebasestorage.app",
  messagingSenderId: "582569042243",
  appId: "1:582569042243:web:b5f6b31be7d0a0b4138ff6",
  measurementId: "G-ZTMJK0LK3X",
};

const APP_NAME = "bookings";

export const isBookingsFirebaseConfigured = true;

let _app: FirebaseApp | null = null;
let _db: Database | null = null;

export function getBookingsFirebase(): { app: FirebaseApp; db: Database } | null {
  if (!_app) {
    const existing = getApps().find((a) => a.name === APP_NAME);
    _app = existing ?? initializeApp(cfg, APP_NAME);
    _db = getDatabase(_app);
  }
  return { app: _app!, db: _db! };
}
