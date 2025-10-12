// src/app/api/cv/analyze/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

export async function POST(req: NextRequest) {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY environment variable is not set");
    return NextResponse.json(
      {
        error: "Configuration Error",
        message: "Kunci API untuk layanan AI belum diatur di server.",
      },
      { status: 500 }
    );
  }

  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file found" }, { status: 400 });
  }

  const allowedTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/msword",
  ];
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json(
      {
        error: "Invalid file type",
        message: "Silakan unggah file dengan format PDF atau Word.",
      },
      { status: 400 }
    );
  }

  try {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

    const generationConfig = {
      temperature: 0.5, // Sedikit menurunkan temperatur untuk hasil yang lebih konsisten
      topK: 1,
      topP: 1,
      maxOutputTokens: 2048,
      responseMimeType: "application/json",
    };
    
    const safetySettings = [
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    ];

    const fileBuffer = await file.arrayBuffer();
    const fileBase64 = Buffer.from(fileBuffer).toString("base64");

    // --- PROMPT YANG DIPERBARUI ---
    const parts = [
      { inlineData: { mimeType: file.type, data: fileBase64 } },
      {
        text: `
          You are an expert CV analyzer for an Indonesian platform called CVJitu.
          Your task is to analyze the provided file and return a JSON object.

          Follow these rules strictly:
          1.  First, determine if the document is a Curriculum Vitae (CV) or Resume.
          2.  If the document is NOT a CV/Resume, you MUST return this exact JSON structure:
              {
                "isCv": false,
                "message": "File yang diunggah tampaknya bukan sebuah CV atau resume."
              }
          3.  If the document IS a CV/Resume, you MUST analyze it and return a JSON object with the following structure. Provide all fields. All feedback and suggestions must be in Bahasa Indonesia.
              {
                "isCv": true,
                "fileName": "${file.name}",
                "overallScore": <integer score between 40 and 98>,
                "sections": [
                  { "name": "Informasi Kontak", "score": <integer>, "status": "<'excellent'|'good'|'needs_improvement'|'poor'>", "feedback": "<Indonesian feedback>" },
                  { "name": "Pengalaman Kerja", "score": <integer>, "status": "<'excellent'|'good'|'needs_improvement'|'poor'>", "feedback": "<Indonesian feedback>" },
                  { "name": "Pendidikan", "score": <integer>, "status": "<'excellent'|'good'|'needs_improvement'|'poor'>", "feedback": "<Indonesian feedback>" },
                  { "name": "Keahlian", "score": <integer>, "status": "<'excellent'|'good'|'needs_improvement'|'poor'>", "feedback": "<Indonesian feedback>" }
                ],
                "suggestions": ["<suggestion 1 in Indonesian>", "<suggestion 2 in Indonesian>"],
                "atsCompatibility": <integer score between 50 and 98>,
                "keywordMatch": <integer score between 40 and 95>,
                "readabilityScore": <integer score between 60 and 99>
              }
        `,
      },
    ];

    const result = await model.generateContent({
      contents: [{ role: "user", parts }],
      generationConfig,
      safetySettings,
    });
    
    const responseText = result.response.text();
    if (!responseText) {
      throw new Error("AI returned an empty response.");
    }

    const jsonResponse = JSON.parse(responseText);
    return NextResponse.json(jsonResponse);

  } catch (error: any) {
    console.error("🔴 Error in /api/cv/analyze:", error);
    
    if (error.message && error.message.includes("API key not valid")) {
         return NextResponse.json(
          { error: "Invalid API Key", message: "Kunci API untuk layanan AI tidak valid. Silakan periksa kembali." },
          { status: 500 }
        );
    }

    // Menambahkan log untuk error dari Gemini
    if (error.message && error.message.toLowerCase().includes("gemini")) {
        return NextResponse.json(
          { error: "Gemini API Error", message: "Terjadi masalah saat berkomunikasi dengan layanan AI. Coba lagi nanti." },
          { status: 500 }
        );
    }

    return NextResponse.json(
      { error: "Failed to analyze CV", message: "Layanan AI sedang mengalami gangguan. Silakan coba beberapa saat lagi." },
      { status: 500 }
    );
  }
}