"use client";

import { useAuth } from "@/src/context/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LoginPage } from "@/src/components/LoginPage";
import { useEffect } from "react";

export default function Login() {
  const router = useRouter();
  const { login, loginWithGoogle, isLoading } = useAuth();

  useEffect(() => {
    document.title = "Masuk - CVJitu";
  }, []);

  const handleLogin = async (email: string, password: string) => {
    try {
      await login(email, password);
      toast.success("Berhasil masuk! Selamat datang kembali.");
      router.replace("/dashboard");
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
      router.replace("/dashboard");
    } catch {
      toast.error("Gagal masuk dengan Google. Silakan coba lagi.");
    }
  };

  return (
    <LoginPage
      onLogin={handleLogin}
      onGoogleLogin={handleGoogle}
      onNavigateToRegister={() => router.push("/register")}
      onBack={() => router.push("/")}
      isLoading={isLoading}
    />
  );
}
