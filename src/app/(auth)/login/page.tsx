"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { LoginPage } from "@/components/LoginPage";
import { useEffect, Suspense, useState } from "react";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, loginWithGoogle, isLoading, isAuthenticated } = useAuth();
  const [isEmailSubmitting, setIsEmailSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  const isUiLoading = isEmailSubmitting || isGoogleSubmitting;

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
    if (isUiLoading) return;
    setIsEmailSubmitting(true);
    try {
      await login(email, password);
      toast.success("Berhasil masuk! Selamat datang.");

      const redirect = searchParams.get("redirect");
      const plan = searchParams.get("plan");
      if (redirect && plan) {
        router.replace(`/${redirect}?plan=${plan}`);
      } else {
        router.replace("/dashboard");
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Gagal masuk. Silakan coba lagi.",
      );
    } finally {
      setIsEmailSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    if (isUiLoading) return;
    setIsGoogleSubmitting(true);
    try {
      await loginWithGoogle();
      // Toast moved after redirect — shown when already navigating
      toast.success("Berhasil masuk dengan Google!");

      const redirect = searchParams.get("redirect");
      const plan = searchParams.get("plan");
      if (redirect && plan) {
        router.replace(`/${redirect}?plan=${plan}`);
      } else {
        router.replace("/dashboard");
      }
    } catch (error) {
      const errorCode =
        error && typeof error === "object" && "code" in error
          ? String((error as { code?: string }).code)
          : "";

      if (
        errorCode === "auth/popup-closed-by-user" ||
        errorCode === "auth/cancelled-popup-request"
      ) {
        toast.message("Login Google dibatalkan.");
      } else {
        toast.error("Gagal masuk dengan Google. Silakan coba lagi.");
      }
    } finally {
      setIsGoogleSubmitting(false);
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
      isLoading={isUiLoading}
      onNavigateToForgotPassword={() => router.push("/forgot-password")}
    />
  );
}

export default function Login() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[var(--surface)] flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-[var(--red-light)] border-t-[var(--red-normal)] rounded-full animate-spin" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
