import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { CVBuilderData } from "@/components/cvbuilder/types";
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
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userDocRef = adminDb.collection("users").doc(userId);
    const userDoc = await userDocRef.get();
    if (!userDoc.exists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const userData = userDoc.data() as any;

    if (userData.scoringCreditsUsed >= userData.scoringCreditsTotal) {
      return NextResponse.json({ 
          error: "Limit Reached",
          message: "Batas scoring CV Anda telah habis. Silakan upgrade paket berlangganan Anda."
      }, { status: 403 });
    }

    const { lang, ...cvData }: CVBuilderData & { lang: "id" | "en" } =  await request.json();
    const cvText = formatCvDataToText(cvData);

    const feedbackDetailLevelId = userData.plan === "Basic" ? "saran perbaikan umum" : userData.plan === "Fresh Graduate" ? "saran perbaikan detail" : "saran perbaikan sangat detail";
    const feedbackDetailLevelEn = userData.plan === "Basic" ? "general improvement suggestions" : userData.plan === "Fresh Graduate" ? "detailed improvement suggestions" : "highly detailed improvement suggestions";


    const indonesianPrompt = `
      Anda adalah seorang ahli rekrutmen profesional berbahasa Indonesia. Tugas Anda adalah menganalisis konten CV berikut yang diberikan dalam format teks. Teks CV ini mungkin tidak lengkap atau bahkan kosong.

      Tugas utama Anda:
      1.  Analisis konten yang ADA. Berikan penilaian yang jujur berdasarkan informasi yang tersedia.
      2.  Jika sebuah bagian penting (seperti Pengalaman Kerja, Pendidikan, atau Ringkasan) kosong atau kurang detail, berikan skor rendah (misalnya antara 0-20) untuk bagian analisis yang relevan ('Kelengkapan Informasi', 'Konten & Substansi') dan berikan feedback yang menjelaskan mengapa bagian tersebut penting dan harus diisi.
      3.  Pastikan output Anda SELALU dalam format JSON yang valid dan lengkap sesuai struktur, bahkan jika input CV sangat minim atau kosong. Jangan pernah memberikan output selain JSON.

      Struktur JSON harus sama persis seperti di bawah. Semua nilai <skor> harus berupa angka. Semua nilai "<feedback>" dan "<suggestions>" harus berupa string teks dalam Bahasa Indonesia.

      Format output JSON yang WAJIB diikuti:
        {
          "isCv": true,
          "overallScore": <skor keseluruhan 1-100, berdasarkan data yang ada>,
          "atsCompatibility": <skor ATS 1-100>,
          "keywordMatch": <skor kecocokan kata kunci 1-100>,
          "readabilityScore": <skor keterbacaan 1-100>,
          "sections": [
            { "name": "Konten & Substansi", "score": <skor bagian>, "feedback": "<Umpan balik ${feedbackDetailLevelId} mengenai kekuatan dan kelemahan konten CV. Jika ada bagian penting yang kosong, sebutkan di sini.>", "status": "<'excellent' atau 'good' atau 'average' atau 'needs_improvement'>" },
            { "name": "Relevansi Kata Kunci", "score": <skor bagian>, "feedback": "<Umpan balik ${feedbackDetailLevelId} mengenai penggunaan kata kunci yang relevan dengan posisi '${cvData.jobTitle || "yang dituju"}'.>", "status": "<'excellent' atau 'good' atau 'average' atau 'needs_improvement'>" },
            { "name": "Struktur & Keterbacaan", "score": <skor bagian>, "feedback": "<Umpan balik ${feedbackDetailLevelId} mengenai format, layout, dan kemudahan membaca CV.>", "status": "<'excellent' atau 'good' atau 'average' atau 'needs_improvement'>" },
            { "name": "Kelengkapan Informasi", "score": <skor bagian>, "feedback": "<Umpan balik ${feedbackDetailLevelId} mengenai kelengkapan informasi penting. Jika ada informasi kontak, pengalaman, atau pendidikan yang hilang, jelaskan pentingnya di sini.>", "status": "<'excellent' atau 'good' atau 'average' atau 'needs_improvement'>" }
          ],
          "suggestions": ["<Saran perbaikan konkret 1 dalam Bahasa Indonesia (${feedbackDetailLevelId})>", "<Saran perbaikan konkret 2>", "<Saran perbaikan konkret 3>"]
        }
    `;

    const englishPrompt = `
      You are a professional recruitment expert. Your task is to analyze the following CV content provided in text format. This CV text may be incomplete or even empty.

      Your primary tasks are:
      1.  Analyze the content that IS present. Provide an honest assessment based on the available information.
      2.  If an important section (like Work Experience, Education, or Summary) is missing or sparse, assign a low score (e.g., between 0-20) for the relevant analysis sections ('Completeness of Information', 'Content & Substance') and provide feedback explaining why that section is crucial.
      3.  Ensure your output is ALWAYS a valid and complete JSON format according to the structure, even if the input CV is very minimal or empty. Never output anything other than JSON.

      The JSON structure must be exactly as specified below. All <score> values must be numbers. All "<feedback>" and "<suggestion>" values must be text strings in English.

      Required JSON output format:
        {
          "isCv": true,
          "overallScore": <overall score 1-100, based on available data>,
          "atsCompatibility": <ATS score 1-100>,
          "keywordMatch": <keyword match score 1-100>,
          "readabilityScore": <readability score 1-100>,
          "sections": [
            { "name": "Content & Substance", "score": <section score>, "feedback": "<${feedbackDetailLevelEn} about the strengths and weaknesses of the CV content. If important sections are missing, mention it here.>", "status": "<'excellent' or 'good' or 'average' or 'needs_improvement'>" },
            { "name": "Keyword Relevance", "score": <section score>, "feedback": "<${feedbackDetailLevelEn} on the use of relevant keywords for the '${cvData.jobTitle || "targeted"} ' position.>", "status": "<'excellent' or 'good' or 'average' or 'needs_improvement'>" },
            { "name": "Structure & Readability", "score": <section score>, "feedback": "<${feedbackDetailLevelEn} on the format, layout, and ease of reading the CV.>", "status": "<'excellent' or 'good' or 'average' atau 'needs_improvement'>" },
            { "name": "Completeness of Information", "score": <section score>, "feedback": "<${feedbackDetailLevelEn} on the completeness of essential information. If contact info, experience, or education is missing, explain its importance here.>", "status": "<'excellent' or 'good' or 'average' or 'needs_improvement'>" }
          ],
          "suggestions": ["<Concrete improvement suggestion 1 in English (${feedbackDetailLevelEn})>", "<Concrete improvement suggestion 2>", "<Concrete improvement suggestion 3>"]
        }
    `;

    const prompt = lang === "en" ? englishPrompt : indonesianPrompt;

    const result = await model.generateContent([prompt, cvText]);
    const responseText = result.response.text();
    const analysisResult = JSON.parse(responseText.trim());

    await userDocRef.update({
        scoringCreditsUsed: (userData.scoringCreditsUsed || 0) + 1
    });

    return NextResponse.json(analysisResult, { status: 200 });
  } catch (error) {
    console.error("Error calling Gemini API for builder:", error);
    return NextResponse.json(
      { error: "Gagal menganalisis data CV dengan AI." },
      { status: 500 }
    );
  }
}