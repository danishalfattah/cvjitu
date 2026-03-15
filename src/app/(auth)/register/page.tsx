"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { RegisterPage } from "@/components/RegisterPage";
import { useEffect, Suspense } from "react";

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register, loginWithGoogle, isLoading } = useAuth();

  useEffect(() => {
    document.title = "Daftar Akun - CVJitu";
  }, []);

  const handleRegister = async (data: any) => {
    try {
      await register(data);
      toast.success("Akun berhasil dibuat! Selamat datang di CVJitu.");

      const redirect = searchParams.get("redirect");
      const plan = searchParams.get("plan");

      if (redirect && plan) {
        router.replace(`/login?redirect=${redirect}&plan=${plan}`);
      } else {
        router.replace("/login");
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Gagal membuat akun. Silakan coba lagi.",
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

  const handleNavigateToLogin = () => {
    const redirect = searchParams.get("redirect");
    const plan = searchParams.get("plan");
    if (redirect && plan) {
      router.push(`/login?redirect=${redirect}&plan=${plan}`);
    } else {
      router.push("/login");
    }
  };

  return (
    <RegisterPage
      onRegister={handleRegister}
      onGoogleRegister={handleGoogle}
      onNavigateToLogin={handleNavigateToLogin}
      onBack={() => router.push("/")}
      isLoading={isLoading}
      onNavigateToTerms={() => router.push("/terms")}
      onNavigateToPrivacy={() => router.push("/privacy")}
    />
  );
}

export default function Register() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[var(--surface)] flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-[var(--red-light)] border-t-[var(--red-normal)] rounded-full animate-spin" />
        </div>
      }
    >
      <RegisterContent />
    </Suspense>
  );
}
