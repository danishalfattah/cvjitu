
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("Missing NEXT_PUBLIC_GEMINI_API_KEY environment variable");
}

// Inisialisasi GoogleGenerativeAI
const genAI = new GoogleGenerativeAI(apiKey);

// Model untuk text-only input
export const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });