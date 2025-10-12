// src/app/dashboard/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/context/AuthContext";
import { DashboardLayout } from "@/src/components/dashboard/DashboardLayout";
import { toast } from "sonner";

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth(); // Ambil isLoading

  useEffect(() => {
    document.title = "Dashboard - CVJitu";
  }, []);

  // **PERBAIKAN DIMULAI DI SINI**
  useEffect(() => {
    // Hanya redirect jika proses loading selesai DAN user tidak terautentikasi
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  // Tampilkan state loading selagi Firebase memeriksa sesi
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[var(--surface)]">
        <p className="text-[var(--neutral-ink)]">Memuat sesi Anda...</p>
      </div>
    );
  }

  // Jika sudah tidak loading dan user ada, tampilkan dashboard
  if (isAuthenticated && user) {
    return (
      <DashboardLayout
        user={user}
        onLogout={() => {
          logout();
          toast.success("Berhasil keluar.");
          router.replace("/");
        }}
        onCreateCV={(lang) => router.push(`/cv-builder?lang=${lang}`)}
      />
    );
  }

  // Fallback jika terjadi kondisi yang tidak terduga (seperti saat redirect)
  return null;
}
