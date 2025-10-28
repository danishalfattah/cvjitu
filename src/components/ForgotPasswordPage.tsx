import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Mail, ArrowLeft, Send } from "lucide-react";
import Image from "next/image";
import router from "next/router";

interface ForgotPasswordPageProps {
  onSendResetEmail: (email: string) => Promise<void>; // Menjadi async
  onNavigateToLogin: () => void;
  onBack: () => void;
  isLoading?: boolean;
}

export function ForgotPasswordPage({
  onSendResetEmail,
  onNavigateToLogin,
  onBack,
  isLoading = false,
}: ForgotPasswordPageProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false); // State untuk menandai email terkirim

  const validateEmail = () => {
    if (!email) {
      setError("Email wajib diisi");
      return false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Format email tidak valid");
      return false;
    }
    setError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateEmail()) {
      try {
        await onSendResetEmail(email);
        setEmailSent(true); // Tandai email berhasil dikirim
      } catch (err) {
        // Error handling sudah ada di page.tsx, di sini cukup fokus UI
        console.error("Error from component:", err);
        // Anda bisa menambahkan state error spesifik jika perlu
      }
    }
  };

  return (
    <div className="min-h-screen bg-[var(--surface)] flex items-center justify-center p-6">
      <div className="w-full max-w-md mx-auto">
        <Card className="border border-[var(--border-color)] shadow-xl">
          <CardHeader className="space-y-4">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="text-gray-500 hover:text-[var(--red-normal)]"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <Image
                src="/logo.svg"
                width={85}
                height={85}
                quality={100}
                alt="logo"
                className=""
              />
            </div>
            <div>
              <CardTitle className="text-2xl font-poppins text-[var(--neutral-ink)]">
                Lupa Password?
              </CardTitle>
              <p className="text-gray-600 mt-2">
                Masukkan email Anda untuk menerima link reset password.
              </p>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {emailSent ? (
              <div className="text-center p-4 bg-secondary border border-primary rounded-md">
                <p className="text-sm ">
                  Email reset password telah dikirim ke <strong>{email}</strong>
                  . Silakan periksa kotak masuk (dan folder spam) Anda.
                </p>
                <Button
                  variant="link"
                  className="text-[var(--red-normal)] hover:text-[var(--red-normal-hover)] p-0 h-auto font-medium mt-4"
                  onClick={onNavigateToLogin}
                >
                  Kembali ke Login
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="nama@example.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (error) setError(null);
                      }}
                      className={`pl-10 border-2 ${
                        error
                          ? "border-red-500"
                          : "border-gray-300 focus:border-[var(--red-normal)]"
                      }`}
                      disabled={isLoading}
                    />
                  </div>
                  {error && <p className="text-sm text-red-600">{error}</p>}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[var(--red-normal)] hover:bg-[var(--red-normal-hover)] text-white"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    "Mengirim..."
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Kirim Email Reset
                    </>
                  )}
                </Button>
              </form>
            )}

            {!emailSent && ( // Hanya tampilkan jika email belum terkirim
              <div className="text-center text-sm text-gray-600">
                Ingat password Anda?{" "}
                <Button
                  variant="link"
                  className="text-[var(--red-normal)] hover:text-[var(--red-normal-hover)] p-0 h-auto font-medium"
                  onClick={onNavigateToLogin}
                  disabled={isLoading}
                >
                  Masuk di sini
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
