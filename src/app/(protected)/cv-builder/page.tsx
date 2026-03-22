"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { CVBuilderPage } from "@/components/dashboard/CVBuilderPage";
import { type CVBuilderData, type CVGrade } from "@/components/cvbuilder/types"; // Import CVGrade
import { type Language, t } from "@/lib/translations";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState, Suspense } from "react";
import { Loader2 } from "lucide-react";

  function CVBuilderContent() {
    const router = useRouter();
    const { refreshUser } = useAuth();
    const searchParams = useSearchParams();
  const lang = (searchParams.get("lang") as Language) || "id";
  const cvId = searchParams.get("id");

  const [initialBuilderData, setInitialBuilderData] =
    useState<CVBuilderData | null>(null);
  const [cvStatus, setCvStatus] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  // **PERBAIKAN 1: State untuk menyimpan hasil analisis**
  const [analysisResult, setAnalysisResult] = useState<CVGrade | null>(null);
  const [initialAnalysis, setInitialAnalysis] = useState<CVGrade | null>(null);

  useEffect(() => {
    document.title = cvId ? "Edit CV - CVJitu" : "CV Builder - CVJitu";
    if (cvId) {
      const fetchCvData = async () => {
        setIsLoading(true);
        try {
          const response = await fetch(`/api/cv/${cvId}`);
          if (!response.ok)
            throw new Error(
              "CV tidak ditemukan atau Anda tidak memiliki akses.",
            );
          const data = await response.json();
          setInitialBuilderData({
            jobTitle: data.jobTitle || "",
            description: data.description || "",
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            email: data.email || "",
            phone: data.phone || "",
            location: data.location || "",
            linkedin: data.linkedin || "",
            website: data.website || "",
            workExperiences: data.workExperiences || [],
            educations: data.educations || [],
            skills: data.skills || [],
            summary: data.summary || "",
          });
          setCvStatus(data.status);
          // **PERBAIKAN 2: Simpan data analisis awal jika ada**
          if (data.analysis) {
            setInitialAnalysis(data.analysis);
            setAnalysisResult(data.analysis);
          }
        } catch (error: any) {
          toast.error(error.message);
          router.replace("/dashboard");
        } finally {
          setIsLoading(false);
        }
      };
      fetchCvData();
    } else {
      setIsLoading(false);
    }
  }, [cvId, router]);

  const handleBack = () => {
    router.push("/dashboard");
  };

  const executeSave = async (
    data: CVBuilderData,
    status: "Completed" | "Draft",
  ) => {
    setIsSaving(true);
    try {
      const url = cvId ? `/api/cv/${cvId}` : "/api/cv";
      const method = cvId ? "PUT" : "POST";
      const dataToSave = {
        ...data,
        type: "builder",
        status: cvStatus === "Completed" ? "Completed" : status,
        lang: lang,
        // **PERBAIKAN 3: Sertakan hasil analisis saat menyimpan**
        analysis: analysisResult,
        // Sertakan skor keseluruhan dari analisis jika ada
        score: analysisResult ? analysisResult.overallScore : 0,
      };

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSave),
      });

      if (!response.ok) {
        let errorMessage = t("saveFailedDefault", lang);
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (e) {}

        if (response.status === 403) {
          toast.error(t("limitReachedTitle", lang), {
            description: errorMessage,
            action: {
              label: "Upgrade",
              onClick: () => (window.location.href = "/#pricing"),
            },
          });
          throw new Error(t("limitReachedError", lang));
        }
        throw new Error(errorMessage);
      }

      toast.success(
        status === "Completed" || cvStatus === "Completed"
          ? cvId
            ? t("cvUpdatedSuccess", lang)
            : t("cvSavedSuccess", lang)
          : t("cvDraftSaved", lang),
      );
      router.push("/dashboard");
      router.refresh();
      refreshUser();
    } catch (error) {
      console.error(error);
      toast.error(t("saveFailedRetry", lang));
    } finally {
      setIsSaving(false);
    }
  };

  const handleSave = (data: CVBuilderData) => executeSave(data, "Completed");
  const handleSaveDraft = (data: CVBuilderData) => executeSave(data, "Draft");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--red-normal)]" />
      </div>
    );
  }

  return (
    <CVBuilderPage
      initialData={initialBuilderData}
      cvId={cvId}
      initialCvStatus={cvStatus}
      onBack={handleBack}
      onSave={handleSave}
      onSaveDraft={handleSaveDraft}
      lang={lang}
      isSaving={isSaving}
      // **PERBAIKAN 4: Kirim data analisis dan handler ke CVBuilderPage**
      initialAnalysisData={initialAnalysis}
      onAnalysisComplete={setAnalysisResult}
    />
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <CVBuilderContent />
    </Suspense>
  );
}
