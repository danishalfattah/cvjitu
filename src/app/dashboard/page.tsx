"use client";

import { useEffect, useState } from "react"; // Import useState
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { toast } from "sonner";
import { Language } from "@/lib/translations"; // Import Language

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const [lang, setLang] = useState<Language>("id"); // Tambahkan state untuk bahasa

  useEffect(() => {
    document.title = "Dashboard - CVJitu";
  }, []);

  useEffect(() => {
    if (!isAuthenticated) router.replace("/login");
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return (
    <DashboardLayout
      user={user}
      onLogout={() => {
        logout();
        toast.success("Berhasil keluar.");
        router.replace("/");
      }}
      onCreateCV={(lang) => router.push(`/cv-builder?lang=${lang}`)}
      lang={lang} // Berikan prop lang ke DashboardLayout
      onLangChange={setLang} // Berikan fungsi untuk mengubah bahasa
    />
  );
}
