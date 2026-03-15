import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent } from "./ui/card";
import { Separator } from "./ui/separator";
import { Checkbox } from "./ui/checkbox";
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft, Zap, Sparkles, Target } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface RegisterPageProps {
  onRegister: (data: RegisterData) => void;
  onGoogleRegister: () => void;
  onNavigateToLogin: () => void;
  onBack: () => void;
  isLoading?: boolean;
  onNavigateToTerms?: () => void;
  onNavigateToPrivacy?: () => void;
}

interface RegisterData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean | string;
}

export function RegisterPage({
  onRegister,
  onGoogleRegister,
  onNavigateToLogin,
  onBack,
  isLoading = false,
  onNavigateToTerms,
  onNavigateToPrivacy,
}: RegisterPageProps) {
  const [formData, setFormData] = useState<RegisterData>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Partial<RegisterData>>({});

  const validateForm = () => {
    const newErrors: Partial<RegisterData> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Nama lengkap wajib diisi";
    }

    if (!formData.email) {
      newErrors.email = "Email wajib diisi";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Format email tidak valid";
    }

    if (!formData.password) {
      newErrors.password = "Password wajib diisi";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password minimal 8 karakter";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password =
        "Password harus mengandung huruf besar, kecil, dan angka";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Konfirmasi password wajib diisi";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Password tidak sama";
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "Anda harus menyetujui syarat dan ketentuan";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    field: keyof RegisterData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onRegister(formData);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--surface)] flex items-center justify-center p-4 sm:p-6 lg:p-12 overflow-hidden relative">
      {/* Decorative background shapes */}
      <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-[var(--red-light)] rounded-full blur-[120px] opacity-40 animate-gentle-pulse" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-[var(--red-light)] rounded-full blur-[120px] opacity-40 animate-gentle-pulse delay-500" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-6xl z-10"
      >
        <Card className="border-none shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] overflow-hidden rounded-[2rem] p-0">
          <div className="grid lg:grid-cols-2 min-h-[700px]">
             {/* Left Panel - Branding */}
             <div className="relative hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-[var(--red-normal)] to-[var(--red-dark)] text-white overflow-hidden">
               {/* Floating Abstract Shapes */}
               <motion.div 
                animate={{ y: [0, -30, 0], x: [0, 20, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/4 right-1/4 w-32 h-32 bg-white/10 rounded-3xl blur-xl"
              />
              <motion.div 
                animate={{ y: [0, 40, 0], x: [0, -30, 0] }}
                transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-white/5 rounded-full blur-3xl"
              />

              <div className="relative z-10">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onBack}
                  className="text-white/80 hover:text-white hover:bg-white/10 mb-8 rounded-full"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Kembali
                </Button>
                
                <div className="mt-4">
                  <Image
                    src="/logo.svg"
                    width={110}
                    height={35}
                    alt="CVJitu Logo"
                    className="brightness-0 invert mb-8"
                  />
                  <h2 className="text-4xl font-poppins font-bold leading-tight">
                    Mulai Perjalanan <br /> Karirmu Sekarang.
                  </h2>
                  <p className="mt-6 text-white/70 text-lg max-w-sm">
                    Bergabung dengan ribuan profesional yang sudah meningkatkan karir mereka dengan CVJitu.
                  </p>
                </div>
              </div>

              <div className="relative z-10 space-y-4 mt-auto">
                <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex items-center gap-4">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <Sparkles className="w-5 h-5 text-yellow-300" />
                  </div>
                  <p className="text-sm font-medium">Bimbingan AI Real-time</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex items-center gap-4">
                   <div className="bg-white/20 p-2 rounded-lg">
                    <Target className="w-5 h-5 text-green-300" />
                  </div>
                  <p className="text-sm font-medium">Lolos ATS dengan Mudah</p>
                </div>
              </div>
            </div>

            {/* Right Panel - Form Area */}
            <div className="bg-white p-8 sm:p-12 flex flex-col justify-center">
              <div className="max-w-md mx-auto w-full">
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-2">
                    <h1 className="text-3xl font-poppins font-bold text-[var(--neutral-ink)] tracking-tight">
                      Buat Akun Baru
                    </h1>
                    <Zap className="lg:hidden w-8 h-8 text-[var(--red-normal)]" />
                  </div>
                  <p className="text-gray-500">
                    Mulai perjalanan karir Anda bersama CVJitu hari ini.
                  </p>
                </div>

                {/* Google Register */}
                <Button
                  onClick={onGoogleRegister}
                  variant="outline"
                  className="w-full h-12 border-gray-200 hover:bg-gray-50 rounded-xl transition-all duration-300 group"
                  disabled={isLoading}
                >
                  <svg className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span className="font-semibold text-gray-700">Daftar dengan Google</span>
                </Button>

                <div className="relative my-8">
                  <Separator className="bg-gray-100" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="bg-white px-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                      Atau
                    </span>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="fullName" className="text-sm font-semibold text-gray-700 ml-1">Nama Lengkap</Label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[var(--red-normal)]" />
                      <Input
                        id="fullName"
                        type="text"
                        placeholder="John Doe"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange("fullName", e.target.value)}
                        className={`h-11 pl-12 rounded-xl border-gray-200 focus:ring-2 focus:ring-[var(--red-light)] transition-all ${
                          errors.fullName ? "border-red-500 bg-red-50/30" : "focus:border-[var(--red-normal)]"
                        }`}
                        disabled={isLoading}
                      />
                    </div>
                    {errors.fullName && <p className="text-xs font-medium text-red-500 ml-1">{errors.fullName}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-sm font-semibold text-gray-700 ml-1">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="nama@email.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className={`h-11 pl-12 rounded-xl border-gray-200 focus:ring-2 focus:ring-[var(--red-light)] transition-all ${
                          errors.email ? "border-red-500 bg-red-50/30" : "focus:border-[var(--red-normal)]"
                        }`}
                        disabled={isLoading}
                      />
                    </div>
                    {errors.email && <p className="text-xs font-medium text-red-500 ml-1">{errors.email}</p>}
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="password" className="text-sm font-semibold text-gray-700 ml-1">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={formData.password}
                          onChange={(e) => handleInputChange("password", e.target.value)}
                          className={`h-11 pl-12 pr-10 rounded-xl border-gray-200 focus:ring-2 focus:ring-[var(--red-light)] transition-all ${
                            errors.password ? "border-red-500 bg-red-50/30" : "focus:border-[var(--red-normal)]"
                          }`}
                          disabled={isLoading}
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={isLoading}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-700 ml-1">Konfirmasi</Label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={formData.confirmPassword}
                          onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                          className={`h-11 pl-12 pr-10 rounded-xl border-gray-200 focus:ring-2 focus:ring-[var(--red-light)] transition-all ${
                            errors.confirmPassword ? "border-red-500 bg-red-50/30" : "focus:border-[var(--red-normal)]"
                          }`}
                          disabled={isLoading}
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          disabled={isLoading}
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                  {(errors.password || errors.confirmPassword) && (
                    <p className="text-xs font-medium text-red-500 ml-1">
                      {errors.password || errors.confirmPassword}
                    </p>
                  )}

                  <div className="py-2">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="agreeToTerms"
                        checked={!!formData.agreeToTerms}
                        onCheckedChange={(checked) => handleInputChange("agreeToTerms", checked as boolean)}
                        className="rounded-md border-gray-300 text-[var(--red-normal)] focus:ring-[var(--red-normal)] mt-1"
                        disabled={isLoading}
                      />
                      <Label htmlFor="agreeToTerms" className="text-xs text-gray-500 leading-relaxed cursor-pointer">
                        Saya menyetujui <button type="button" onClick={onNavigateToTerms} className="text-[var(--red-normal)] font-bold hover:underline">Syarat & Ketentuan</button> serta <button type="button" onClick={onNavigateToPrivacy} className="text-[var(--red-normal)] font-bold hover:underline">Kebijakan Privasi</button>
                      </Label>
                    </div>
                    {errors.agreeToTerms && <p className="text-xs font-medium text-red-500 mt-1">{errors.agreeToTerms}</p>}
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-[var(--red-normal)] hover:bg-[var(--red-dark)] text-white font-bold rounded-xl shadow-lg shadow-[var(--red-normal)]/20 transition-all duration-300 active:scale-[0.98] mt-2"
                    disabled={isLoading}
                  >
                    {isLoading ? "Memproses..." : "Daftar Sekarang"}
                  </Button>
                </form>

                <div className="mt-8 text-center">
                  <p className="text-sm text-gray-500">
                    Sudah punya akun?{" "}
                    <button
                      type="button"
                      className="text-[var(--red-normal)] font-bold hover:underline ml-1"
                      onClick={onNavigateToLogin}
                      disabled={isLoading}
                    >
                      Login
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
