// File: src/app/cv-builder/page.tsx

"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { CVBuilderPage } from "@/src/components/dashboard/CVBuilderPage";
import { type CVBuilderData } from "@/src/components/cvbuilder/types";
import { type Language } from "@/src/lib/translations";
import { useEffect, useState } from "react";
import { useAuth } from "@/src/context/AuthContext";

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const lang = (searchParams.get("lang") as Language) || "id";
  const cvId = searchParams.get("id");
  const { saveCV, fetchCVById } = useAuth();

  const [initialData, setInitialData] = useState<CVBuilderData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "CV Builder - CVJitu";
    const loadCVData = async () => {
      if (cvId) {
        const cv = await fetchCVById(cvId);
        if (cv && cv.cvBuilderData) {
          setInitialData(cv.cvBuilderData);
        } else {
          toast.error("Gagal memuat CV. Membuat CV baru.");
        }
      }
      setLoading(false);
    };
    loadCVData();
  }, [cvId, fetchCVById]);

  const handleBack = () => {
    router.push("/dashboard");
  };

  const handleSave = async (data: CVBuilderData) => {
    try {
      const id = await saveCV(data, cvId || undefined);
      toast.success("CV Anda berhasil disimpan!");
      router.replace(`/dashboard`);
    } catch (error) {
      console.error("Failed to save CV:", error);
      toast.error("Gagal menyimpan CV. Silakan coba lagi.");
    }
  };

  const handleSaveDraft = async (data: CVBuilderData) => {
    try {
      const id = await saveCV(data, cvId || undefined);
      toast.info("CV Anda disimpan sebagai draft.");
      router.replace(`/dashboard`);
    } catch (error) {
      console.error("Failed to save draft:", error);
      toast.error("Gagal menyimpan draft. Silakan coba lagi.");
    }
  };

  if (loading) {
    return <p>Memuat CV...</p>;
  }

  return (
    <CVBuilderPage
      onBack={handleBack}
      onSave={handleSave}
      onSaveDraft={handleSaveDraft}
      lang={lang}
      initialData={initialData || undefined}
    />
  );
}
