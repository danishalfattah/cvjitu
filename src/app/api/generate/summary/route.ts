// src/app/api/generate/summary/route.ts
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error("GEMINI_API_KEY environment variable is not set.");
}

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

export async function POST(request: Request) {
  try {
    const { jobTitle, workExperiences, skills, lang } = await request.json();

    const experienceText = workExperiences
      .map(
        (exp: any) =>
          `- ${exp.jobTitle} di ${exp.company}: ${exp.description}`
      )
      .join("\n");

   const prompt =
      lang === "id"
        ? `Tulis sebuah ringkasan CV dari sudut pandang orang pertama (menggunakan "saya"). Buatlah menjadi satu paragraf profesional dan menarik antara 50 hingga 100 kata. Saya adalah seorang profesional yang melamar sebagai ${jobTitle} dengan pengalaman kerja berikut:\n${experienceText}\n\nBeberapa keahlian utama saya adalah: ${skills.join(
            ", "
          )}. Tolong tuliskan ringkasan yang seolah-olah saya sendiri yang menulisnya. Pastikan outputnya hanya teks ringkasan dalam satu paragraf, tanpa judul atau format markdown.`
        : `Write a CV summary from a first-person point of view (using "I"). Make it a single, compelling professional paragraph between 50 and 100 words. I am a professional applying for the role of ${jobTitle} with the following work experience:\n${experienceText}\n\nMy key skills include: ${skills.join(
            ", "
          )}. Please write a summary as if I am writing it myself. Ensure the output is only the summary text in a single paragraph, without any titles or markdown formatting.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const summary = response.text();

    return NextResponse.json({ summary });
  } catch (error) {
    console.error("Error generating summary:", error);
    return NextResponse.json(
      { error: "Gagal membuat ringkasan." },
      { status: 500 }
    );
  }
}