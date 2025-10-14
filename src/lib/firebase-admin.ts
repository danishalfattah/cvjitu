import * as admin from "firebase-admin";

if (!process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
  throw new Error("FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set.");
}

const serviceAccountString = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

// 1) PARSE DULU string JSON-nya (biarkan \n tetap escaped saat ini)
const serviceAccount = JSON.parse(serviceAccountString);

// 2) Baru perbaiki newline di NILAI private_key
if (typeof serviceAccount.private_key === "string") {
  serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, "\n");
}

// 3) Init admin
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    });
  } catch (error: any) {
    console.error("Firebase admin initialization error:", error.stack);
  }
}

export const adminDb = admin.firestore();
export const adminAuth = admin.auth();
