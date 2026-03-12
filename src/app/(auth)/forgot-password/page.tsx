// src/app/forgot-password/page.tsx
"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ForgotPasswordPage } from "@/components/ForgotPasswordPage"; // Pastikan path import benar
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export default function ForgotPassword() {
  const router = useRouter();
  const { sendPasswordReset, isLoading: authLoading } = useAuth(); // Ambil fungsi baru dan state loading
  const [isSending, setIsSending] = useState(false); // State loading khusus untuk halaman ini

  useEffect(() => {
    document.title = "Lupa Password - CVJitu";
  }, []);

  const handleSendResetEmail = async (email: string) => {
    setIsSending(true);
    try {
      await sendPasswordReset(email);
      // Komponen ForgotPasswordPage akan menangani tampilan pesan sukses
      // toast.success(`Email reset password terkirim ke ${email}.`);
      // Tidak perlu redirect otomatis, biarkan user di halaman ini
    } catch (error) {
      console.error("Forgot password error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Gagal mengirim email reset. Periksa kembali email Anda."
      );
      throw error; // Lempar error agar komponen bisa menangani state loading
    } finally {
      setIsSending(false);
    }
  };

  if (authLoading && !isSending) {
    return (
      <div className="flex items-center justify-center h-screen w-full">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--red-normal)]" />
      </div>
    );
  }

  const handleBack = () => {
    router.back();
  };

  return (
    <ForgotPasswordPage
      onSendResetEmail={handleSendResetEmail}
      onNavigateToLogin={() => router.push("/login")}
      onBack={handleBack}
      isLoading={isSending} // Gunakan state loading halaman ini
    />
  );
}
