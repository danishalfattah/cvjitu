"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { CVBuilderPage } from "@/components/dashboard/CVBuilderPage";
import { type CVBuilderData } from "@/components/cvbuilder/types";
import { type Language } from "@/lib/translations";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const lang = (searchParams.get("lang") as Language) || "id";
  const cvId = searchParams.get("id");

  // **PERBAIKAN 1: Pisahkan state untuk form data dan metadata**
  const [initialBuilderData, setInitialBuilderData] =
    useState<CVBuilderData | null>(null);
  const [cvStatus, setCvStatus] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    document.title = cvId ? "Edit CV - CVJitu" : "CV Builder - CVJitu";

    if (cvId) {
      const fetchCvData = async () => {
        try {
          const response = await fetch(`/api/cv/${cvId}`);
          if (!response.ok) {
            throw new Error(
              "CV tidak ditemukan atau Anda tidak memiliki akses."
            );
          }
          const data = await response.json();

          // **PERBAIKAN 2: "Sanitize" data ke dalam state yang sesuai**
          // State ini hanya berisi data yang dibutuhkan oleh form (tipe CVBuilderData)
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
          // State ini menyimpan status secara terpisah
          setCvStatus(data.status);
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
    status: "Completed" | "Draft"
  ) => {
    try {
      const url = cvId ? `/api/cv/${cvId}` : "/api/cv";
      const method = cvId ? "PUT" : "POST";

      const dataToSave = {
        ...data,
        type: "builder",
        // **PERBAIKAN 3: Gunakan state status yang sudah dipisah**
        status: cvStatus === "Completed" ? "Completed" : status,
        lang: lang,
      };

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSave),
      });

      if (!response.ok) {
        throw new Error("Gagal menyimpan CV");
      }

      toast.success(
        status === "Completed" || cvStatus === "Completed"
          ? cvId
            ? "CV berhasil diperbarui!"
            : "CV Anda berhasil disimpan!"
          : "CV Anda disimpan sebagai draf."
      );
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Gagal menyimpan CV. Silakan coba lagi.");
    }
  };

  const handleSave = (data: CVBuilderData) => {
    executeSave(data, "Completed");
  };

  const handleSaveDraft = (data: CVBuilderData) => {
    executeSave(data, "Draft");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--red-normal)]" />
      </div>
    );
  }

  return (
    <CVBuilderPage
      // **PERBAIKAN 4: Kirim state yang sudah benar tipenya**
      initialData={initialBuilderData}
      cvId={cvId}
      initialCvStatus={cvStatus}
      onBack={handleBack}
      onSave={handleSave}
      onSaveDraft={handleSaveDraft}
      lang={lang}
    />
  );
}
