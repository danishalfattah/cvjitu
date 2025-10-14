import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error("GEMINI_API_KEY environment variable is not set.");
}

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
  generationConfig: {
    responseMimeType: "application/json",
  },
});

// Fungsi untuk mengubah file menjadi format yang bisa dibaca Gemini
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
    const allowedMimeTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!allowedMimeTypes.includes(file.type)) {
        return NextResponse.json({ error: "Tipe file tidak didukung. Harap unggah PDF atau DOCX." }, { status: 400 });
    }

    const filePart = await fileToGenerativePart(file);

    // Prompt cerdas sesuai alur yang kamu minta
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
            { "name": "<Nama Bagian>", "score": <skor bagian>, "feedback": "<Umpan balik>", "status": "<'excellent' atau 'good' atau 'average' atau 'needs_improvement'>" }
          ],
          "suggestions": ["<Saran perbaikan 1>", "<Saran perbaikan 2>"]
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

    return NextResponse.json(analysisResult, { status: 200 });
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return NextResponse.json(
      { error: "Gagal menganalisis file dengan AI." },
      { status: 500 }
    );
  }
}