// src/app/api/cv/route.ts

import { NextResponse, type NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { adminAuth, adminDb } from '@/src/lib/firebase-admin';

async function getUserId() {
  const sessionCookie = (await cookies()).get('session')?.value;
  if (!sessionCookie) return null;
  try {
    const decodedToken = await adminAuth.verifySessionCookie(sessionCookie, true);
    return decodedToken.uid;
  } catch (error) {
    return null;
  }
}

// HANDLER GET (Mengambil CV berdasarkan tipe)
export async function GET(request: NextRequest) {
  const userId = await getUserId();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    if (!type || (type !== 'builder' && type !== 'uploaded')) {
        return NextResponse.json({ error: "Tipe CV harus 'builder' atau 'uploaded'" }, { status: 400 });
    }

    const cvsCollection = adminDb.collection('cvs');
    const q = cvsCollection.where('userId', '==', userId).where('type', '==', type);
    const snapshot = await q.get();
    
    const cvs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json(cvs, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching CVs:", error.message);
    return NextResponse.json({ error: 'Failed to fetch CVs' }, { status: 500 });
  }
}

// HANDLER POST (Menyimpan CV dengan tipe)
export async function POST(request: NextRequest) {
  const userId = await getUserId();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const userRecord = await adminAuth.getUser(userId);
    const ownerName = userRecord.displayName || userRecord.email || "Pengguna Anonim";
    const cvData = await request.json();
    
    const newCvData = {
      ...cvData,
      name: cvData.jobTitle || cvData.name || "CV Tanpa Judul",
      status: cvData.status || "Draft",
      score: cvData.score || Math.floor(Math.random() * (75 - 50 + 1)) + 50,
      year: cvData.year || new Date().getFullYear(),
      userId,
      owner: ownerName,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const docRef = await adminDb.collection('cvs').add(newCvData);
    return NextResponse.json({ id: docRef.id, ...newCvData }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create CV' }, { status: 500 });
  }
}