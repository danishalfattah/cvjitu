"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/context/AuthContext";
import { CVBuilderPage } from "@/components/CVBuilderPage";
import { toast } from "sonner";

export default function CVBuilderRoute() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) router.replace("/login");
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return (
    <CVBuilderPage
      onBack={() => router.push("/dashboard")}
      onSave={(cvData) => {
        console.log("[v0] Saving CV:", cvData);
        toast.success("CV berhasil disimpan!");
        router.push("/dashboard");
      }}
    />
  );
}
