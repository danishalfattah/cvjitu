"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { CVBuilderPage } from "@/components/dashboard/CVBuilderPage";
import { type CVBuilderData } from "@/components/cvbuilder/types";
import { type Language } from "@/lib/translations";

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const lang = (searchParams.get("lang") as Language) || "id";

  const handleBack = () => {
    router.push("/dashboard");
  };

  const handleSave = (data: CVBuilderData) => {
    console.log("Saving final CV:", data);
    toast.success("CV Anda berhasil disimpan!");
    router.push("/dashboard");
  };

  const handleSaveDraft = (data: CVBuilderData) => {
    console.log("Saving CV as draft:", data);
    toast.info("CV Anda disimpan sebagai draft.");
    router.push("/dashboard");
  };

  return (
    <CVBuilderPage
      onBack={handleBack}
      onSave={handleSave}
      onSaveDraft={handleSaveDraft}
      lang={lang}
    />
  );
}
