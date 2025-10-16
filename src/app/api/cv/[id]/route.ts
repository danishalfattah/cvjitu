import { NextResponse, type NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { adminAuth, adminDb } from '@/lib/firebase-admin';

async function getUserId() {
  const cookieStore = await cookies(); // Await cookies() to get the cookie store
  const sessionCookie = cookieStore.get('session')?.value;
  if (!sessionCookie) return null;
  try {
    const decodedToken = await adminAuth.verifySessionCookie(sessionCookie, true);
    return decodedToken.uid;
  } catch (error) { 
    return null;
  }
}

// --- PERBAIKAN 1: TAMBAHKAN HANDLER GET ---
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = await getUserId();
  const id = params.id;

  try {
    // Coba ambil dari koleksi 'cvs' (builder) terlebih dahulu
    let docRef = adminDb.collection('cvs').doc(id);
    let doc = await docRef.get();

    // Jika tidak ditemukan, coba dari koleksi 'scored_cvs'
    if (!doc.exists) {
      docRef = adminDb.collection('scored_cvs').doc(id);
      doc = await docRef.get();
    }

    if (!doc.exists) {
      return NextResponse.json({ error: 'CV not found' }, { status: 404 });
    }

    const cvData = doc.data();

    // Untuk link publik, kita tidak perlu verifikasi user
    // Tapi untuk edit, user harus terverifikasi
    const isPublicLink = cvData?.visibility === 'public';
    const isOwner = cvData?.userId === userId;

    // Jika ini bukan link publik dan user bukan pemilik, tolak akses
    if (!isPublicLink && !isOwner) {
       return NextResponse.json({ error: 'CV tidak ditemukan atau Anda tidak memiliki akses.' }, { status: 403 });
    }
    
    // Jika link publik atau user adalah pemilik, kirim data
    return NextResponse.json({ id: doc.id, ...cvData }, { status: 200 });

  } catch (error: any) {
    console.error("Error fetching CV by ID:", error.message);
    return NextResponse.json({ error: 'Failed to fetch CV' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = await getUserId();
  const id = params.id;
  const cvData = await request.json();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!id) {
    return NextResponse.json({ error: "CV ID is required" }, { status: 400 });
  }

  try {
    // Tentukan nama koleksi berdasarkan 'type' dari data yang dikirim
    const collectionName = cvData.type === 'uploaded' ? 'scored_cvs' : 'cvs';
    const docRef = adminDb.collection(collectionName).doc(id);
    
    const doc = await docRef.get();

    // Jika dokumen tidak ada, kirim error
    if (!doc.exists) {
      return NextResponse.json({ error: "CV not found" }, { status: 404 });
    }

    // Verifikasi bahwa pengguna yang mencoba mengedit adalah pemilik dokumen
    const existingData = doc.data();
    if (existingData?.userId !== userId) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Lakukan pembaruan pada dokumen
    const dataToUpdate = {
      ...cvData,
      updatedAt: new Date().toISOString(),
    };

    // Jika 'jobTitle' diperbarui, salin nilainya ke 'name' untuk konsistensi tampilan
    if (cvData.jobTitle) {
      dataToUpdate.name = cvData.jobTitle;
    }
    // --- AKHIR PERBAIKAN ---

    // Lakukan pembaruan pada dokumen menggunakan objek yang sudah disiapkan
    await docRef.update(dataToUpdate);

    return NextResponse.json({
      message: "CV updated successfully",
      cvId: id,
    });
  } catch (error) {
    console.error("Error updating CV:", error);
    return NextResponse.json(
      { error: "Failed to update CV" },
      { status: 500 }
    );
  }
}

// HANDLER DELETE (Tetap sama)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = await getUserId();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const id = params.id;
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    
    const collectionName = type === 'uploaded' ? 'scored_cvs' : 'cvs';

    const docRef = adminDb.collection(collectionName).doc(id);
    const doc = await docRef.get();

    if (!doc.exists || doc.data()?.userId !== userId) {
      return NextResponse.json({ error: 'CV not found or access denied' }, { status: 404 });
    }
    
    await docRef.delete();

    return NextResponse.json({ message: 'CV deleted successfully' }, { status: 200 });
  } catch (error: any) {
    console.error("Error deleting CV:", error.message);
    return NextResponse.json({ error: 'Failed to delete CV' }, { status: 500 });
  }
}