// src/lib/firebase-admin.ts (UPDATED)

import admin from 'firebase-admin';
import { getApps } from 'firebase-admin/app';
import fs from 'fs';
import path from 'path';

if (!getApps().length) {
  try {
    // Path ke service account key sekarang relatif terhadap direktori kerja
    const serviceAccountPath = path.join(process.cwd(), 'src', 'serviceAccountKey.json');
    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log("Firebase Admin SDK initialized successfully.");
  } catch (error: any) {
    console.error("Firebase Admin SDK initialization error:", error.message);
    // Jika inisialisasi gagal, kita bisa melempar error agar masalahnya jelas
    throw new Error("Could not initialize Firebase Admin SDK. Is serviceAccountKey.json present in the /src directory?");
  }
}

const adminAuth = admin.auth();
const adminDb = admin.firestore();

export { adminAuth, adminDb };