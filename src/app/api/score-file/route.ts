import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { cookies } from "next/headers";
import { adminAuth, adminDb } from "@/lib/firebase-admin";

async function getUserId() {
  const sessionCookie = (await cookies()).get("session")?.value;
  if (!sessionCookie) return null;
  try {
    const decodedToken = await adminAuth.verifySessionCookie(sessionCookie, true);
    return decodedToken.uid;
  } catch (error) {
    return null;
  }
}

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error("GEMINI_API_KEY environment variable is not set.");
}

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-3.1-flash-lite-preview",
  generationConfig: {
    responseMimeType: "application/json",
  },
});

async function fileToGenerativePart(file: File) {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return {
    inlineData: {
      data: buffer.toString("base64"),
      mimeType: file.type,
    },
  };
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "File tidak ditemukan." }, { status: 400 });
    }

    // Hanya izinkan tipe file tertentu untuk keamanan
    const allowedMimeTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowedMimeTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Tipe file tidak didukung. Harap unggah PDF atau DOCX." },
        { status: 400 },
      );
    }

    const filePart = await fileToGenerativePart(file);
    const cookieStore = await cookies();
    const today = new Date().toISOString().slice(0, 10);
    const guestDate = cookieStore.get("guest_scoring_date")?.value;
    const guestUsedRaw = cookieStore.get("guest_scoring_used")?.value;
    const guestUsed = Number.parseInt(guestUsedRaw || "0", 10);
    const guestUsedToday = guestDate === today ? guestUsed : 0;
    const GUEST_SCORING_LIMIT_PER_DAY = 1;

    const userId = await getUserId();
    let userDocRef: any = null;
    let userData: any | null = null;

    if (userId) {
      userDocRef = adminDb.collection("users").doc(userId);
      const userDoc = await userDocRef.get();
      if (!userDoc.exists) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
      userData = userDoc.data() as any;

      if (userData.scoringCreditsUsed >= userData.scoringCreditsTotal) {
        return NextResponse.json(
          {
            error: "Limit Reached",
            message: "Batas scoring CV Anda telah habis. Silakan upgrade paket berlangganan Anda.",
          },
          { status: 403 },
        );
      }
    } else if (guestUsedToday >= GUEST_SCORING_LIMIT_PER_DAY) {
      return NextResponse.json(
        {
          error: "Guest Limit Reached",
          message: "Akun tamu hanya bisa scoring 1x per hari. Login gratis untuk akses lebih banyak.",
        },
        { status: 403 },
      );
    }

    const feedbackDetailLevelId = !userData
      ? "saran perbaikan umum"
      : userData.plan === "Basic"
        ? "saran perbaikan umum"
        : userData.plan === "Fresh Graduate"
          ? "saran perbaikan detail"
          : "saran perbaikan sangat detail";

    const prompt = `
      Anda adalah seorang ahli rekrutmen profesional. Tugas Anda adalah melakukan dua hal pada file yang diberikan:
      1. Identifikasi apakah file tersebut adalah sebuah Curriculum Vitae (CV) atau bukan.
      2. Jika file tersebut ADALAH sebuah CV, ekstrak teksnya dan lakukan analisis mendalam. Jika BUKAN, berikan output standar.

      Berikan output HANYA dalam format JSON yang valid, tanpa teks tambahan.

      - JIKA INI ADALAH CV, berikan output seperti ini:
        {
          "isCv": true,
          "overallScore": <skor keseluruhan 1-100>,
          "atsCompatibility": <skor ATS 1-100>,
          "keywordMatch": <skor kata kunci 1-100>,
          "readabilityScore": <skor keterbacaan 1-100>,
          "sections": [
            { "name": "<Nama Bagian>", "score": <skor bagian>, "feedback": "<Umpan balik ${feedbackDetailLevelId}>", "status": "<'excellent' atau 'good' atau 'average' atau 'needs_improvement'>" }
          ],
          "suggestions": ["<Saran perbaikan 1 (${feedbackDetailLevelId})>", "<Saran perbaikan 2>"]
        }

      - JIKA INI BUKAN CV, berikan output persis seperti ini:
        {
          "isCv": false,
          "overallScore": 0,
          "atsCompatibility": 0,
          "keywordMatch": 0,
          "readabilityScore": 0,
          "sections": [],
          "suggestions": ["File yang Anda unggah sepertinya bukan dokumen CV. Harap coba lagi dengan file yang benar."]
        }
    `;

    const result = await model.generateContent([prompt, filePart]);
    const responseText = result.response.text();
    const analysisResult = JSON.parse(responseText.trim());

    if (analysisResult.isCv && userDocRef && userData) {
      await userDocRef.update({
        scoringCreditsUsed: (userData.scoringCreditsUsed || 0) + 1,
      });
    }

    const response = NextResponse.json(analysisResult, { status: 200 });

    if (analysisResult.isCv && !userId) {
      response.cookies.set("guest_scoring_date", today, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24,
        path: "/",
      });
      response.cookies.set("guest_scoring_used", String(guestUsedToday + 1), {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24,
        path: "/",
      });
    }

    return response;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return NextResponse.json(
      { error: "Gagal menganalisis file dengan AI." },
      { status: 500 }
    );
  }
}
