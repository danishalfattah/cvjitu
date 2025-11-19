// src/app/api/generate/work-experience/route.ts
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error("GEMINI_API_KEY environment variable is not set.");
}

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-pro",
  generationConfig: {
    responseMimeType: "application/json",
  },
});

export async function POST(request: Request) {
  try {
    const { jobTitle, company, description, lang } = await request.json();

    const prompt =
      lang === "id"
        ? `Saya bekerja sebagai ${jobTitle} di ${company}. Deskripsi pekerjaan saya adalah: "${description}". Berikan 3-5 poin pencapaian utama (key achievements) dalam format JSON array of strings, misalnya: ["Meningkatkan efisiensi...", "Memimpin tim..."].`
        : `I worked as a ${jobTitle} at ${company}. My job description was: "${description}". Provide 3-5 key achievement bullet points in a JSON array of strings format, for example: ["Increased efficiency...", "Led a team..."].`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const achievements = JSON.parse(response.text());

    return NextResponse.json({ achievements });
  } catch (error) {
    console.error("Error generating work experience points:", error);
    return NextResponse.json(
      { error: "Gagal membuat poin pengalaman kerja." },
      { status: 500 }
    );
  }
}