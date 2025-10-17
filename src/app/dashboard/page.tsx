"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { toast } from "sonner";
import { Language } from "@/lib/translations";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const [lang, setLang] = useState<Language>("id");

  useEffect(() => {
    document.title = "Dashboard - CVJitu";
  }, []);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen w-full">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--red-normal)]" />
      </div>
    );
  }

  return (
    <DashboardLayout
      user={user}
      onLogout={() => {
        logout();
        toast.success("Berhasil keluar.");
        router.replace("/");
      }}
      onCreateCV={(lang) => router.push(`/cv-builder?lang=${lang}`)}
      lang={lang}
      onLangChange={setLang}
    />
  );
}
