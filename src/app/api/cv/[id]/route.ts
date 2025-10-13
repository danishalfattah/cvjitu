// src/app/api/cv/[id]/route.ts (UPDATED)

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

// HANDLER UNTUK GET (MENGAMBIL SATU CV)
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const cvDocRef = adminDb.collection('cvs').doc(params.id);
    const cvDoc = await cvDocRef.get();

    if (!cvDoc.exists) {
      return NextResponse.json({ error: 'CV not found' }, { status: 404 });
    }

    const cvData = cvDoc.data();

    // Jika CV bersifat publik, langsung kembalikan datanya
    if (cvData?.visibility === 'public') {
      return NextResponse.json({ id: cvDoc.id, ...cvData }, { status: 200 });
    }

    // Jika privat, verifikasi apakah yang mengakses adalah pemiliknya
    const userId = await getUserId();
    if (userId && cvData?.userId === userId) {
      return NextResponse.json({ id: cvDoc.id, ...cvData }, { status: 200 });
    }

    // Jika privat dan bukan pemilik, tolak akses
    return NextResponse.json({ error: 'Access denied' }, { status: 403 });

  } catch (error) {
    console.error("Error fetching CV:", error);
    return NextResponse.json({ error: 'Failed to fetch CV' }, { status: 500 });
  }
}

// HANDLER UNTUK PUT (MEMPERBARUI CV)
export async function PUT(request: Request, { params }: { params: { id: string } }) {
    const userId = await getUserId();
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const cvDocRef = adminDb.collection('cvs').doc(params.id);
        const cvDoc = await cvDocRef.get();

        if (!cvDoc.exists || cvDoc.data()?.userId !== userId) {
            return NextResponse.json({ error: 'CV not found or access denied' }, { status: 404 });
        }
        
        const updatedDataFromClient = await request.json();
        
        // --- PERUBAHAN DI SINI ---
        // Buat objek data baru untuk memastikan field penting tidak terhapus
        const finalUpdatedData = {
            ...updatedDataFromClient, // Ambil semua data baru dari form
            name: updatedDataFromClient.jobTitle || cvDoc.data()?.name || "CV Tanpa Judul", // Perbarui 'name' jika 'jobTitle' berubah
            updatedAt: new Date().toISOString(),
        };
        
        // Gunakan set dengan opsi merge untuk memperbarui, bukan menimpa total
        await cvDocRef.set(finalUpdatedData, { merge: true });
        // --- AKHIR PERUBAHAN ---

        return NextResponse.json({ message: 'CV updated successfully' }, { status: 200 });
    } catch (error) {
        console.error("Error updating CV:", error);
        return NextResponse.json({ error: 'Failed to update CV' }, { status: 500 });
    }
}

// HANDLER UNTUK DELETE (MENGHAPUS CV)
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    const userId = await getUserId();
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // --- PERUBAHAN DI SINI ---
        const cvDocRef = adminDb.collection('cvs').doc(params.id);
        const cvDoc = await cvDocRef.get();
        // --- AKHIR PERUBAHAN ---
        
        if (!cvDoc.exists || cvDoc.data()?.userId !== userId) {
            return NextResponse.json({ error: 'CV not found or access denied' }, { status: 404 });
        }
        
        await cvDocRef.delete();
        return NextResponse.json({ message: 'CV deleted successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete CV' }, { status: 500 });
    }
}