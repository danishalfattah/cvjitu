// src/app/cv-builder/page.tsx (UPDATED)

"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { CVBuilderPage } from "@/src/components/dashboard/CVBuilderPage";
import { type CVBuilderData } from "@/src/components/cvbuilder/types";
import { type Language } from "@/src/lib/translations";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const lang = (searchParams.get("lang") as Language) || "id";
  const cvId = searchParams.get("id");

  const [initialData, setInitialData] = useState<CVBuilderData | null>(null);
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
          setInitialData(data);
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

  // --- PERBAIKAN UTAMA DI SINI ---
  // Buat fungsi generik untuk menyimpan dengan status yang berbeda
  const executeSave = async (
    data: CVBuilderData,
    status: "Completed" | "Draft"
  ) => {
    try {
      const url = cvId ? `/api/cv/${cvId}` : "/api/cv";
      const method = cvId ? "PUT" : "POST";

      // Tambahkan `status` ke data yang akan dikirim
      const dataToSave = { ...data, type: "builder", status: status };

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
        status === "Completed"
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

  // Panggil executeSave dengan status 'Completed'
  const handleSave = (data: CVBuilderData) => {
    executeSave(data, "Completed");
  };

  // Panggil executeSave dengan status 'Draft'
  const handleSaveDraft = (data: CVBuilderData) => {
    executeSave(data, "Draft");
  };
  // --- AKHIR PERBAIKAN ---

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--red-normal)]" />
      </div>
    );
  }

  return (
    <CVBuilderPage
      initialData={initialData}
      cvId={cvId}
      onBack={handleBack}
      onSave={handleSave}
      onSaveDraft={handleSaveDraft}
      lang={lang}
    />
  );
}
