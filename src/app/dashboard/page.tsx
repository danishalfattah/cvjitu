// src/app/dashboard/page.tsx (SUDAH DIPERBAIKI)

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

// Komponen untuk tampilan loading
const LoadingScreen = () => (
  <div className="flex h-screen w-full items-center justify-center bg-gray-50">
    <Loader2 className="h-8 w-8 animate-spin text-[var(--red-normal)]" />
  </div>
);

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  useEffect(() => {
    document.title = "Dashboard - CVJitu";
  }, []);

  // Logika utama untuk menangani loading dan redirect
  useEffect(() => {
    // Jika proses loading selesai dan pengguna tidak terotentikasi,
    // arahkan ke halaman login.
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  // 1. Tampilkan layar loading selama status autentikasi belum jelas.
  if (isLoading) {
    return <LoadingScreen />;
  }

  // 2. Jika sudah terotentikasi, tampilkan layout dashboard.
  // Pengecekan `useEffect` di atas akan menangani kasus jika tidak login.
  if (isAuthenticated) {
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

  // 3. Return null untuk sementara saat proses redirect (jika ada) berjalan
  // untuk menghindari konten yang berkedip.
  return null;
}
