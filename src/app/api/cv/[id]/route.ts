import { NextResponse, type NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { adminAuth, adminDb } from '@/src/lib/firebase-admin';

async function getUserId() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session')?.value;
  if (!sessionCookie) return null;
  try {
    const decodedToken = await adminAuth.verifySessionCookie(sessionCookie, true);
    return decodedToken.uid;
  } catch (error) {
    return null;
  }
}

// HANDLER DELETE (Diperbarui)
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

    // Tentukan nama koleksi berdasarkan parameter 'type'
    // Default ke 'cvs' jika type tidak disediakan untuk kompatibilitas
    const collectionName = type === 'uploaded' ? 'scored_cvs' : 'cvs';

    const docRef = adminDb.collection(collectionName).doc(id);
    const doc = await docRef.get();

    // Verifikasi bahwa dokumen ada dan dimiliki oleh pengguna yang benar
    if (!doc.exists || doc.data()?.userId !== userId) {
      return NextResponse.json({ error: 'CV not found or access denied' }, { status: 404 });
    }
    
    // Hapus dokumen dari koleksi yang benar
    await docRef.delete();

    return NextResponse.json({ message: 'CV deleted successfully' }, { status: 200 });
  } catch (error: any) {
    console.error("Error deleting CV:", error.message);
    return NextResponse.json({ error: 'Failed to delete CV' }, { status: 500 });
  }
}