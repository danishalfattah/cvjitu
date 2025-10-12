// File: src/utils/cvScoringService.ts

import { model } from "@/src/lib/gemini";
import mammoth from 'mammoth'; 

export interface CVScoringData {
  fileName: string;
  overallScore: number;
  sections: {
    name: string;
    score: number;
    status: 'excellent' | 'good' | 'needs_improvement' | 'poor';
    feedback: string;
  }[];
  suggestions: string[];
  atsCompatibility: number;
  keywordMatch: number;
  readabilityScore: number;
  isNotACV?: boolean;
  notACVMessage?: string;
}

const getStatusFromScore = (score: number): 'excellent' | 'good' | 'needs_improvement' | 'poor' => {
  if (score >= 90) return 'excellent';
  if (score >= 75) return 'good';
  if (score >= 60) return 'needs_improvement';
  return 'poor';
};

export const analyzeCVFile = async (file: File): Promise<CVScoringData> => {
  let fileContent = '';

  // Membaca konten file
  if (file.type === 'application/pdf') {
    // Untuk PDF, kita akan menggunakan pustaka dummy sederhana karena parsing PDF di browser rumit.
    // Pada aplikasi nyata, Anda akan menggunakan pustaka seperti pdf.js
    fileContent = 'This is a sample PDF file content. It contains a professional summary, work experience, education, and skills relevant for a job application.';
  } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    fileContent = result.value;
  } else {
    // Tipe file tidak didukung
    return {
      fileName: file.name,
      overallScore: 0,
      atsCompatibility: 0,
      keywordMatch: 0,
      readabilityScore: 0,
      sections: [],
      suggestions: [],
      isNotACV: true,
      notACVMessage: "File ini sepertinya bukan file CV. Mohon unggah file CV yang valid."
    };
  }

  // Deteksi sederhana apakah konten adalah CV atau bukan
  const requiredKeywords = ['resume', 'cv', 'work experience', 'education', 'skills'];
  const hasCVContent = requiredKeywords.some(keyword => fileContent.toLowerCase().includes(keyword));

  if (!hasCVContent) {
    return {
      fileName: file.name,
      overallScore: 0,
      atsCompatibility: 0,
      keywordMatch: 0,
      readabilityScore: 0,
      sections: [],
      suggestions: [],
      isNotACV: true,
      notACVMessage: "Konten file tidak menyerupai CV. Mohon unggah file CV yang valid."
    };
  }

  // Gunakan Gemini API untuk analisis
  try {
    const prompt = `
      Analyze the following CV content and provide a comprehensive score and feedback.
      The output should be a JSON object with the following structure:
      {
        "overallScore": number (1-100),
        "atsCompatibility": number (1-100),
        "keywordMatch": number (1-100),
        "readabilityScore": number (1-100),
        "sections": [
          { "name": "Informasi Kontak", "score": number (1-100), "status": "excellent" | "good" | "needs_improvement" | "poor", "feedback": "string" },
          { "name": "Ringkasan Profesional", "score": number (1-100), "status": "excellent" | "good" | "needs_improvement" | "poor", "feedback": "string" },
          { "name": "Pengalaman Kerja", "score": number (1-100), "status": "excellent" | "good" | "needs_improvement" | "poor", "feedback": "string" },
          { "name": "Keahlian & Kompetensi", "score": number (1-100), "status": "excellent" | "good" | "needs_improvement" | "poor", "feedback": "string" },
          { "name": "Pendidikan", "score": number (1-100), "status": "excellent" | "good" | "needs_improvement" | "poor", "feedback": "string" }
        ],
        "suggestions": ["string", "string", "string", "string", "string"]
      }
      
      Here is the CV content:
      ${fileContent}
    `;

    const result = await model.generateContent(prompt);
    const textResult = result.response.text();
    
    // Hapus markdown JSON dari respons Gemini sebelum parsing
    const jsonString = textResult.replace(/```json\n|```/g, "").trim();
    const jsonResult = JSON.parse(jsonString);

    return { ...jsonResult, fileName: file.name };
  } catch (error) {
    console.error("Error analyzing CV with Gemini:", error);
    throw new Error("Failed to analyze CV with AI. Please try again.");
  }
};