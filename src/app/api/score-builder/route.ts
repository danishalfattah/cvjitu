import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { CVBuilderData } from "@/components/cvbuilder/types";

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error("GEMINI_API_KEY environment variable is not set.");
}

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash", // Menggunakan model yang lebih baru jika tersedia
  generationConfig: {
    responseMimeType: "application/json",
  },
});

// Fungsi untuk mengubah data CV dari builder menjadi teks
function formatCvDataToText(data: CVBuilderData): string {
  let cvText = `CV for ${data.jobTitle || 'Not Specified'}\n\n`;
  cvText += `Name: ${data.firstName} ${data.lastName}\n`;
  cvText += `Email: ${data.email}\n`;
  if (data.phone) cvText += `Phone: ${data.phone}\n`;
  if (data.location) cvText += `Location: ${data.location}\n`;
  if (data.linkedin) cvText += `LinkedIn: ${data.linkedin}\n`;
  if (data.website) cvText += `Website: ${data.website}\n\n`;

  cvText += "SUMMARY\n" + "-".repeat(20) + "\n";
  cvText += `${data.summary}\n\n`;

  if (data.workExperiences && data.workExperiences.length > 0) {
    cvText += "WORK EXPERIENCE\n" + "-".repeat(20) + "\n";
    data.workExperiences.forEach(exp => {
      cvText += `${exp.jobTitle} at ${exp.company}\n`;
      cvText += `${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}\n`;
      cvText += `${exp.description}\n`;
      if (exp.achievements && exp.achievements.length > 0) {
        exp.achievements.forEach(ach => cvText += `- ${ach}\n`);
      }
      cvText += "\n";
    });
  }

  if (data.educations && data.educations.length > 0) {
    cvText += "EDUCATION\n" + "-".repeat(20) + "\n";
    data.educations.forEach(edu => {
      cvText += `${edu.degree} from ${edu.institution}\n`;
      cvText += `${edu.startDate} - ${edu.current ? 'Present' : edu.endDate}\n\n`;
    });
  }

  if (data.skills && data.skills.length > 0) {
    cvText += "SKILLS\n" + "-".repeat(20) + "\n";
    cvText += data.skills.join(', ') + "\n";
  }

  return cvText;
}


export async function POST(request: Request) {
  try {
    const cvData: CVBuilderData = await request.json();
    const cvText = formatCvDataToText(cvData);

    const prompt = `
      Anda adalah seorang ahli rekrutmen profesional. Tugas Anda adalah menganalisis konten CV berikut yang diberikan dalam format teks.

      Berikan output HANYA dalam format JSON yang valid, tanpa teks tambahan. Strukturnya harus sama persis dengan penilaian file upload.

      Format output JSON yang harus Anda berikan:
        {
          "isCv": true,
          "overallScore": <skor keseluruhan 1-100>,
          "atsCompatibility": <skor ATS 1-100>,
          "keywordMatch": <skor kata kunci 1-100>,
          "readabilityScore": <skor keterbacaan 1-100>,
          "sections": [
            { "name": "Konten & Substansi", "score": <skor bagian>, "feedback": "<Umpan balik detail mengenai kekuatan dan kelemahan konten CV>", "status": "<'excellent' atau 'good' atau 'average' atau 'needs_improvement'>" },
            { "name": "Kesesuaian Kata Kunci", "score": <skor bagian>, "feedback": "<Umpan balik mengenai penggunaan kata kunci yang relevan dengan posisi yang dituju>", "status": "<'excellent' atau 'good' atau 'average' atau 'needs_improvement'>" },
            { "name": "Struktur & Keterbacaan", "score": <skor bagian>, "feedback": "<Umpan balik mengenai format, layout, dan kemudahan membaca CV>", "status": "<'excellent' atau 'good' atau 'average' atau 'needs_improvement'>" },
            { "name": "Kelengkapan Informasi", "score": <skor bagian>, "feedback": "<Umpan balik mengenai kelengkapan informasi penting seperti kontak, pengalaman, dan pendidikan>", "status": "<'excellent' atau 'good' atau 'average' atau 'needs_improvement'>" }
          ],
          "suggestions": ["<Saran perbaikan konkret 1>", "<Saran perbaikan konkret 2>", "<Saran perbaikan konkret 3>"]
        }
    `;

    const result = await model.generateContent([prompt, cvText]);
    const responseText = result.response.text();
    const analysisResult = JSON.parse(responseText.trim());

    return NextResponse.json(analysisResult, { status: 200 });
  } catch (error) {
    console.error("Error calling Gemini API for builder:", error);
    return NextResponse.json(
      { error: "Gagal menganalisis data CV dengan AI." },
      { status: 500 }
    );
  }
}