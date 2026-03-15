"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { LoginPage } from "@/components/LoginPage";
import { useEffect } from "react";

export default function Login() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, loginWithGoogle, isLoading, isAuthenticated } = useAuth();

  // Prefetch dashboard page so it's ready when redirect happens
  useEffect(() => {
    router.prefetch("/dashboard");
  }, [router]);

  // Auto-redirect when authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      const redirect = searchParams.get("redirect");
      const plan = searchParams.get("plan");
      if (redirect && plan) {
         router.replace(`/${redirect}?plan=${plan}`);
      } else {
         router.replace("/dashboard");
      }
    }
  }, [isAuthenticated, isLoading, router, searchParams]);

  useEffect(() => {
    document.title = "Masuk - CVJitu";
  }, []);

  const handleLogin = async (email: string, password: string) => {
    try {
      await login(email, password);
      toast.success("Berhasil masuk! Selamat datang.");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Gagal masuk. Silakan coba lagi.",
      );
    }
  };

  const handleGoogle = async () => {
    try {
      await loginWithGoogle();
      // Toast moved after redirect — shown when already navigating
      toast.success("Berhasil masuk dengan Google!");
    } catch {
      toast.error("Gagal masuk dengan Google. Silakan coba lagi.");
    }
  };

  const handleNavigateToRegister = () => {
    const redirect = searchParams.get("redirect");
    const plan = searchParams.get("plan");
    if (redirect && plan) {
      router.push(`/register?redirect=${redirect}&plan=${plan}`);
    } else {
      router.push("/register");
    }
  };

  return (
    <LoginPage
      onLogin={handleLogin}
      onGoogleLogin={handleGoogle}
      onNavigateToRegister={handleNavigateToRegister}
      onBack={() => router.push("/")}
      isLoading={isLoading}
      onNavigateToForgotPassword={() => router.push("/forgot-password")}
    />
  );
}
