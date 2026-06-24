import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";

// Dedicated Firebase project for the Buy Products page.
// Used ONLY for product listings, seller submissions, product images and
// product search/filtering. Do not reuse this app for community or bookings.
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

const APP_NAME = "products";

export const isProductsFirebaseConfigured = true;

let _app: FirebaseApp | null = null;
let _fs: Firestore | null = null;
let _storage: FirebaseStorage | null = null;

function ensureApp(): FirebaseApp {
  if (_app) return _app;
  const existing = getApps().find((a) => a.name === APP_NAME);
  _app = existing ?? initializeApp(cfg, APP_NAME);
  return _app;
}

export function getProductsFirestore(): Firestore {
  const app = ensureApp();
  if (!_fs) _fs = getFirestore(app);
  return _fs;
}

export function getProductsStorage(): FirebaseStorage {
  const app = ensureApp();
  if (!_storage) _storage = getStorage(app);
  return _storage;
}