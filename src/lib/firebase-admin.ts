import * as admin from "firebase-admin";

// Cek apakah environment variable ada
if (!process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
  throw new Error(
    "FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set."
  );
}

// --- PERBAIKAN UTAMA DI SINI ---
// Ambil string JSON dari environment variable
const serviceAccountString = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

// Ganti karakter '\\n' (yang salah) menjadi '\n' (yang benar) di seluruh string
const correctedServiceAccountString = serviceAccountString.replace(/\\n/g, "\n");

// Parsing string JSON yang sudah diperbaiki
const serviceAccount = JSON.parse(correctedServiceAccountString);
// --- AKHIR PERBAIKAN ---

// Inisialisasi Firebase Admin SDK hanya jika belum ada
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } catch (error: any) {
    console.error("Firebase admin initialization error", error.stack);
  }
}

export const adminDb = admin.firestore();
export const adminAuth = admin.auth();