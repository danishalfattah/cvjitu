// src/app/login/page.tsx (UPDATED)

"use client";

import { useAuth } from "@/src/context/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LoginPage } from "@/src/components/LoginPage";
import { useEffect } from "react";
import { Toaster } from "@/src/components/ui/sonner"; // Pastikan Toaster diimpor jika belum ada
import { Loader2Icon } from "lucide-react";

export default function Login() {
  const router = useRouter();
  // Ambil semua state yang relevan dari AuthContext
  const { login, loginWithGoogle, isLoading, isAuthenticated } = useAuth();

  // --- PERBAIKAN 1: useEffect untuk redirect otomatis ---
  // useEffect ini akan memantau status login. Jika pengguna sudah login,
  // ia akan otomatis diarahkan ke dashboard.
  useEffect(() => {
    // Hanya redirect jika loading selesai dan pengguna sudah diautentikasi
    if (!isLoading && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, isLoading, router]);

  // useEffect untuk mengatur judul halaman (ini bisa dipertahankan)
  useEffect(() => {
    document.title = "Masuk - CVJitu";
  }, []);

  const handleLogin = async (email: string, password: string) => {
    try {
      await login(email, password);
      toast.success("Berhasil masuk! Selamat datang kembali.");
      // --- PERBAIKAN 2: Hapus router.replace() dari sini ---
      // Redirection akan ditangani oleh useEffect di atas.
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Gagal masuk. Silakan coba lagi."
      );
    }
  };

  const handleGoogle = async () => {
    try {
      await loginWithGoogle();
      toast.success("Berhasil masuk dengan Google!");
      // --- PERBAIKAN 3: Hapus router.replace() dari sini ---
      // Redirection akan ditangani oleh useEffect di atas.
    } catch {
      toast.error("Gagal masuk dengan Google. Silakan coba lagi.");
    }
  };

  // --- PERBAIKAN 4: Tampilkan loading state ---
  // Ini mencegah halaman login "berkedip" sebelum redirect terjadi.

  return (
    <>
      <LoginPage
        onLogin={handleLogin}
        onGoogleLogin={handleGoogle}
        onNavigateToRegister={() => router.push("/register")}
        onBack={() => router.push("/")}
        isLoading={isLoading}
      />
      {/* Pastikan komponen Toaster ada di layout atau di sini */}
      <Toaster position="top-center" richColors />
    </>
  );
}
