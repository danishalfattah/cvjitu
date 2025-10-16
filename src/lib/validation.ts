import { CVBuilderData } from "@/components/cvbuilder/types";
import { translations } from "./translations";

// Definisikan tipe untuk hasil validasi
export type ValidationResult = {
  isValid: boolean;
  errorKey?: keyof typeof translations; // Kunci untuk pesan error spesifik
};

// Fungsi untuk memvalidasi setiap langkah, sekarang mengembalikan ValidationResult
export const validateStep = (
  stepId: string,
  data: CVBuilderData
): ValidationResult => {
  switch (stepId) {
    case "general":
      if (!data.jobTitle || !data.description) {
        return { isValid: false, errorKey: "validationErrorDesc" };
      }
      break;

    case "personal":
      if (!data.firstName || !data.lastName || !data.email) {
        return { isValid: false, errorKey: "validationErrorDesc" };
      }
      // Pengecekan format email yang lebih spesifik
      if (!/^\S+@\S+\.\S+$/.test(data.email)) {
        return { isValid: false, errorKey: "emailInvalid" };
      }
      break;

    case "experience":
      if (
        data.workExperiences.some(
          (exp) =>
            !exp.jobTitle ||
            !exp.company ||
            !exp.startDate ||
            (!exp.current && !exp.endDate)
        )
      ) {
        return { isValid: false, errorKey: "validationErrorDesc" };
      }
      break;

    case "education":
      if (
        data.educations.some(
          (edu) =>
            !edu.degree ||
            !edu.institution ||
            !edu.startDate ||
            (!edu.current && !edu.endDate)
        )
      ) {
        return { isValid: false, errorKey: "validationErrorDesc" };
      }
      break;

    case "skills":
      if (data.skills.length === 0) {
        return { isValid: false, errorKey: "skillsRequired" };
      }
      break;

    case "summary":
      if (!data.summary) {
        return { isValid: false, errorKey: "summaryRequired" };
      }
      break;
  }

  // Jika semua pengecekan untuk step tersebut lolos
  return { isValid: true };
};