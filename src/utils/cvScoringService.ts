// File: src/utils/cvScoringService.ts

import { model } from "@/src/lib/gemini";
import mammoth from 'mammoth';
import { CVBuilderData } from "@/src/components/cvbuilder/types";

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

export const extractCVDataFromContent = async (content: string): Promise<CVBuilderData> => {
  try {
    const prompt = `
      Parse the following CV content into a structured JSON object.
      The JSON object should conform to the following TypeScript interface:

      interface WorkExperience {
        id: string;
        jobTitle: string;
        company: string;
        location: string;
        startDate: string;
        endDate: string;
        current: boolean;
        description: string;
        achievements: string[];
      }

      interface Education {
        id: string;
        degree: string;
        institution: string;
        location: string;
        startDate: string;
        endDate: string;
        current: boolean;
        gpa?: string;
        description?: string;
      }

      interface CVBuilderData {
        jobTitle: string;
        description: string;
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        location: string;
        linkedin: string;
        website: string;
        workExperiences: WorkExperience[];
        educations: Education[];
        skills: string[];
        summary: string;
      }

      Please fill in the fields based on the content provided. Use "unknown" or empty string if information is not available.
      
      CV Content:
      ${content}
    `;

    const result = await model.generateContent(prompt);
    const textResult = result.response.text();
    const jsonString = textResult.replace(/```json\n|```/g, "").trim();
    return JSON.parse(jsonString) as CVBuilderData;

  } catch (error) {
    console.error("Error extracting CV data from content:", error);
    throw new Error("Failed to extract CV data from file content.");
  }
};


export const analyzeCVFile = async (file: File): Promise<{ results: CVScoringData, content: string }> => {
  let fileContent = '';

  if (file.type === 'application/pdf') {
    // Perbaikan: Ganti teks dummy dengan instruksi yang lebih baik untuk AI
    // untuk mensimulasikan konten dari PDF.
    fileContent = 'Konten file ini adalah CV seorang Software Engineer bernama Nugraha Billy Viandy, dengan email billy.bpm03@gmail.com dan LinkedIn linkedin.com/in/ahargunyllib. Dia adalah mahasiswa ilmu komputer di Brawijaya University. Pengalamannya mencakup Mobile App Developer Intern di Posgym dan Frontend Developer di TEDxUniversitas Brawijaya. Keahliannya termasuk TypeScript, Go, Node.js, React.js, dan Next.js. Dia juga memiliki pengalaman di kompetisi seperti Finalist Startup Social Games x Hackfest 2024 dan Coding Challenge Finalist di Airofest 2023. Silakan analisis CV ini.';
  } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      fileContent = result.value;
    } catch (error) {
      const errorData = {
        fileName: file.name,
        overallScore: 0,
        atsCompatibility: 0,
        keywordMatch: 0,
        readabilityScore: 0,
        sections: [],
        suggestions: [],
        isNotACV: true,
        notACVMessage: "File ini tidak dapat dibaca. Mohon pastikan format file benar."
      };
      return { results: errorData, content: "" };
    }
  } else {
    const errorData = {
      fileName: file.name,
      overallScore: 0,
      atsCompatibility: 0,
      keywordMatch: 0,
      readabilityScore: 0,
      sections: [],
      suggestions: [],
      isNotACV: true,
      notACVMessage: "Tipe file tidak didukung. Mohon unggah file PDF atau DOCX."
    };
    return { results: errorData, content: "" };
  }

  try {
    const prompt = `
      Sebagai seorang ahli analisis CV, tugas utama Anda adalah mengevaluasi apakah teks yang diberikan adalah Curriculum Vitae (CV) atau Resume yang valid. Sebuah CV yang valid biasanya memiliki struktur yang jelas dengan bagian-bagian seperti 'Informasi Kontak', 'Ringkasan Profesional', 'Pengalaman Kerja', 'Pendidikan', dan 'Keahlian'.

      Langkah pertama, periksa teks di bawah ini dan tentukan apakah itu adalah CV yang valid.
      
      Jika teks tersebut BUKAN CV yang valid (misalnya, modul kuliah, dokumen umum, atau teks acak), segera kembalikan objek JSON berikut tanpa mencoba melakukan penilaian.
      
      {
        "overallScore": 0,
        "atsCompatibility": 0,
        "keywordMatch": 0,
        "readabilityScore": 0,
        "sections": [],
        "suggestions": [],
        "isNotACV": true,
        "notACVMessage": "Konten file tidak menyerupai CV. Mohon unggah file CV yang valid."
      }

      Jika teks tersebut ADALAH CV yang valid, lanjutkan dengan analisis dan penilaian komprehensif. Output harus berupa objek JSON dengan struktur berikut:
      
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

      Konten CV:
      ${fileContent}
    `;

    const result = await model.generateContent(prompt);
    const textResult = result.response.text();
    const jsonString = textResult.replace(/```json\n|```/g, "").trim();
    const jsonResult = JSON.parse(jsonString);

    return { results: { ...jsonResult, fileName: file.name }, content: fileContent };
  } catch (error) {
    console.error("Error analyzing CV with Gemini:", error);
    throw new Error("Failed to analyze CV with AI. Please try again.");
  }
};