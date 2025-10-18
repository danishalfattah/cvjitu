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
  await request.text();
  const cvId = params.id;
  const sessionCookie = (await cookies()).get("session")?.value;
  let decodedToken = null;
  if (sessionCookie) {
    try {
      decodedToken = await adminAuth.verifySessionCookie(sessionCookie, true);
    } catch (error) {
      decodedToken = null;
    }
  }

  try {
    const cvDocRef = adminDb.collection("cvs").doc(cvId);
    const cvDoc = await cvDocRef.get();

    if (!cvDoc.exists) {
      return NextResponse.json({ error: "CV not found" }, { status: 404 });
    }

    const cvData = cvDoc.data() as CVBuilderData & {
      userId: string;
      visibility: "public" | "private";
    };

    // --- PERBAIKAN UTAMA DI SINI ---
    // Jika ada pengguna yang login dan dia adalah pemilik CV, izinkan akses
    if (decodedToken && decodedToken.uid === cvData.userId) {
      return NextResponse.json(cvData);
    }

    // Jika tidak ada pengguna yang login ATAU bukan pemilik,
    // periksa apakah CV bersifat publik
    if (cvData.visibility === "public") {
      return NextResponse.json(cvData);
    }
    // --- AKHIR PERBAIKAN ---

    // Jika semua kondisi di atas tidak terpenuhi, berarti akses ditolak
    return NextResponse.json(
      { error: "Forbidden: You do not have access to this CV" },
      { status: 403 }
    );
  } catch (error) {
    console.error("Failed to fetch CV:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
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

// **PERBAIKAN DIMULAI DI SINI (DELETE Handler)**
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = await getUserId();
  const id = params.id; // Tidak perlu 'await'

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const docRef = adminDb.collection("cvs").doc(id);
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