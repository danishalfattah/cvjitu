// src/app/api/cv/route.ts (UPDATED)

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { adminAuth, adminDb } from '@/src/lib/firebase-admin'; // Gunakan adminDb

async function getUserId() {
  const sessionCookie = (await cookies()).get('session')?.value;
  if (!sessionCookie) return null;

  try {
    const decodedToken = await adminAuth.verifySessionCookie(sessionCookie, true);
    return decodedToken.uid;
  } catch (error) {
    console.error("Session verification failed:", error);
    return null;
  }
}

// HANDLER GET (Mengambil semua CV)
export async function GET() {
  const userId = await getUserId();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // --- PERUBAHAN DI SINI ---
    // Gunakan adminDb untuk query
    const snapshot = await adminDb.collection('cvs').where('userId', '==', userId).get();
    
    if (snapshot.empty) {
      return NextResponse.json([], { status: 200 });
    }
    
    const cvs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    // --- AKHIR PERUBAHAN ---

    return NextResponse.json(cvs, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching CVs:", error.message);
    return NextResponse.json({ error: 'Failed to fetch CVs' }, { status: 500 });
  }
}

// HANDLER POST (Membuat CV baru)
export async function POST(request: Request) {
  const userId = await getUserId();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // --- PERUBAHAN DI SINI ---
    // Ambil detail pengguna dari Firebase Auth
    const userRecord = await adminAuth.getUser(userId);
    const ownerName = userRecord.displayName || userRecord.email || "Pengguna Anonim";
    // --- AKHIR PERUBAHAN ---

    const cvData = await request.json();
    
    const newCvData = {
      ...cvData,
      name: cvData.jobTitle || "CV Tanpa Judul",
      status: "Draft",
      score: Math.floor(Math.random() * (75 - 50 + 1)) + 50,
      year: new Date().getFullYear(),
      userId,
      owner: ownerName, // Simpan nama pemilik
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const docRef = await adminDb.collection('cvs').add(newCvData);

    return NextResponse.json({ id: docRef.id, ...newCvData }, { status: 201 });
  } catch (error) {
    console.error("Error creating CV:", error);
    return NextResponse.json({ error: 'Failed to create CV' }, { status: 500 });
  }
}