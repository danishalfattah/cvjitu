"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/src/context/AuthContext";
import { CVBuilderPage } from "@/components/dashboard/CVBuilderPage";
import { toast } from "sonner";
import type { Language } from "@/lib/translations";

// Komponen ini berisi semua logic client-side
function CVBuilderClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuth();

  // Baca 'lang' dari URL, dengan default 'id' jika tidak ada
  const lang = (searchParams.get("lang") as Language) || "id";

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null; // Atau tampilkan loading skeleton
  }

  return (
    <CVBuilderPage
      lang={lang}
      onBack={() => router.push("/dashboard")}
      onSave={(cvData) => {
        console.log("[v0] Saving CV:", cvData);
        toast.success("CV berhasil disimpan!");
        router.push("/dashboard");
      }}
    />
  );
}

// Default export adalah wrapper yang aman untuk Server Component
export default function CVBuilderRoute() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CVBuilderClient />
    </Suspense>
  );
}
