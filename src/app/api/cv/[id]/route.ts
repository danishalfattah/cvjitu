import { NextResponse, type NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import { CVBuilderData } from "@/components/cvbuilder/types";

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
  let cvId: string | undefined;

  try {
    const url = new URL(request.url);
    const pathSegments = url.pathname.split('/');
    cvId = pathSegments[pathSegments.length - 1];

    if (!cvId) {
      console.error("[GET /api/cv/[id]] CV ID not found in URL path:", url.pathname);
      return NextResponse.json({ error: "CV ID not found in URL path" }, { status: 400 });
    }
    console.log(`[GET /api/cv/[id]] Extracted cvId from URL: ${cvId}`); // Logging untuk debug
  } catch (urlError) {
     console.error("[GET /api/cv/[id]] Error parsing URL or extracting ID:", urlError);
     // Fallback ke params jika URL parsing gagal (meskipun ini yang error sebelumnya)
     if (params && params.id) {
       cvId = params.id;
       console.log(`[GET /api/cv/[id]] Falling back to params.id: ${cvId}`);
     } else {
       return NextResponse.json({ error: "Could not determine CV ID" }, { status: 400 });
     }
  }


  // Ambil session cookie dan verifikasi pengguna (jika ada)
  const sessionCookie = (await cookies()).get("session")?.value;
  let decodedToken = null;
  if (sessionCookie) {
    try {
      decodedToken = await adminAuth.verifySessionCookie(sessionCookie, true);
    } catch (error) {
      // Tidak masalah jika cookie tidak valid, anggap sebagai pengguna anonim
      console.warn("Session cookie verification failed (might be expired or invalid):", error);
      decodedToken = null;
    }
  }

  // Coba ambil data CV dari Firestore
  try {
    const cvDocRef = adminDb.collection("cvs").doc(cvId);
    const cvDoc = await cvDocRef.get();

    if (!cvDoc.exists) {
      console.log(`[GET /api/cv/${cvId}] CV not found in Firestore.`);
      return NextResponse.json({ error: "CV not found" }, { status: 404 });
    }

    // Lakukan type assertion dengan hati-hati
    const cvData = cvDoc.data() as CVBuilderData & {
      userId?: string; // Jadikan userId opsional untuk keamanan
      visibility?: "public" | "private"; // Jadikan visibility opsional
    };

    // Pastikan properti yang diperlukan ada
    const ownerId = cvData.userId;
    const visibility = cvData.visibility || "private"; // Default ke private jika tidak ada

    // Logika Otorisasi:
    // 1. Jika pengguna terautentikasi DAN merupakan pemilik CV
    if (decodedToken && ownerId && decodedToken.uid === ownerId) {
      console.log(`[GET /api/cv/${cvId}] Access granted: User is owner.`);
      return NextResponse.json(cvData);
    }

    // 2. Jika CV bersifat publik (tidak perlu login)
    if (visibility === "public") {
      console.log(`[GET /api/cv/${cvId}] Access granted: CV is public.`);
      return NextResponse.json(cvData);
    }

    // 3. Jika tidak memenuhi kondisi di atas, akses ditolak
    console.log(`[GET /api/cv/${cvId}] Access denied: User (UID: ${decodedToken?.uid || 'none'}) is not owner and CV is private.`);
    return NextResponse.json(
      { error: "Forbidden: You do not have access to this CV" },
      { status: 403 }
    );

  } catch (error) {
    console.error(`[GET /api/cv/${cvId}] Failed to fetch CV:`, error);
    // Hindari membocorkan detail error internal
    return NextResponse.json(
      { error: "Internal Server Error while fetching CV data" },
      { status: 500 }
    );
  }
}

// **PERBAIKAN DIMULAI DI SINI (PUT Handler)**
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = await getUserId();
  const id = params.id; // Tidak perlu 'await'

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const cvRef = adminDb.collection("cvs").doc(id);
    const cvDoc = await cvRef.get();

    if (!cvDoc.exists) {
      return NextResponse.json({ error: "CV not found" }, { status: 404 });
    }

    const currentCvData = cvDoc.data();
    if (currentCvData?.userId !== userId) {
      return NextResponse.json(
        { error: "Forbidden. You do not own this CV." },
        { status: 403 }
      );
    }

    const cvData = await request.json();
    const updatedCvData = {
      ...cvData,
      updatedAt: new Date().toISOString(),
    };

    await cvRef.update(updatedCvData);
    return NextResponse.json(
      { id: cvRef.id, ...updatedCvData },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to update CV:", error);
    return NextResponse.json(
      { error: "Failed to update CV" },
      { status: 500 }
    );
  }
}

// DELETE Handler - Supports both builder CVs (cvs collection) and uploaded CVs (scored_cvs collection)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = await getUserId();
  const id = params.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Extract type from query params to determine the correct collection
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    // Determine collection based on type
    const collectionName = type === 'uploaded' ? 'scored_cvs' : 'cvs';

    // Delete from the correct collection
    const docRef = adminDb.collection(collectionName).doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return NextResponse.json({ error: "CV not found" }, { status: 404 });
    }

    if (doc.data()?.userId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await docRef.delete();
    return NextResponse.json({ message: "CV deleted" }, { status: 200 });
  } catch (error) {
    console.error("Failed to delete CV:", error);
    return NextResponse.json(
      { error: "Failed to delete CV" },
      { status: 500 }
    );
  }
}