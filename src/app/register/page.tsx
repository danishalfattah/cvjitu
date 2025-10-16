"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { RegisterPage } from "@/components/RegisterPage";
import { useEffect } from "react";

export default function Register() {
  const router = useRouter();
  const { register, loginWithGoogle, isLoading } = useAuth();

  useEffect(() => {
    document.title = "Daftar Akun - CVJitu";
  }, []);

  const handleRegister = async (data: any) => {
    try {
      await register(data);
      toast.success("Akun berhasil dibuat! Selamat datang di CVJitu.");
      router.replace("/dashboard");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Gagal membuat akun. Silakan coba lagi."
      );
    }
  };

  const handleGoogle = async () => {
    try {
      await loginWithGoogle();
      toast.success("Berhasil masuk dengan Google!");
      router.replace("/dashboard");
    } catch {
      toast.error("Gagal masuk dengan Google. Silakan coba lagi.");
    }
  };

  return (
    <RegisterPage
      onRegister={handleRegister}
      onGoogleRegister={handleGoogle}
      onNavigateToLogin={() => router.push("/login")}
      onBack={() => router.push("/")}
      isLoading={isLoading}
      onNavigateToTerms={() => router.push("/terms")}
      onNavigateToPrivacy={() => router.push("/privacy")}
    />
  );
}
