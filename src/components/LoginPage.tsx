import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent } from "./ui/card";
import { Separator } from "./ui/separator";
import { Checkbox } from "./ui/checkbox";
import { Eye, EyeOff, Mail, Lock, ArrowLeft, Zap, Sparkles, Target } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface LoginPageProps {
  onLogin: (email: string, password: string) => void;
  onGoogleLogin: () => void;
  onNavigateToRegister: () => void;
  onBack: () => void;
  isLoading?: boolean;
  onNavigateToForgotPassword: () => void;
}

export function LoginPage({
  onLogin,
  onGoogleLogin,
  onNavigateToRegister,
  onBack,
  isLoading = false,
  onNavigateToForgotPassword,
}: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = "Email wajib diisi";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Format email tidak valid";
    }

    if (!password) {
      newErrors.password = "Password wajib diisi";
    } else if (password.length < 6) {
      newErrors.password = "Password minimal 6 karakter";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onLogin(email, password);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--surface)] flex items-center justify-center p-4 sm:p-6 lg:p-12 overflow-hidden relative">
      {/* Decorative background shapes */}
      <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-[var(--red-light)] rounded-full blur-[120px] opacity-40 animate-gentle-pulse" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-[var(--red-light)] rounded-full blur-[120px] opacity-40 animate-gentle-pulse delay-500" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-6xl z-10"
      >
        <Card className="border-none shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] overflow-hidden rounded-[2rem] p-0">
          <div className="grid lg:grid-cols-2 min-h-[650px]">
            
            {/* Left Panel - Branding (Visible on Desktop) */}
            <div className="relative hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-[var(--red-normal)] to-[var(--red-dark)] text-white overflow-hidden">
              {/* Floating Abstract Shapes */}
              <motion.div 
                animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/4 right-1/4 w-32 h-32 bg-white/10 rounded-3xl blur-xl"
              />
              <motion.div 
                animate={{ y: [0, 30, 0], rotate: [0, -10, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-1/4 left-1/4 w-40 h-40 bg-white/5 rounded-full blur-2xl"
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
                
                <div className="mt-8">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                     <Image
                      src="/logo.svg"
                      width={120}
                      height={40}
                      alt="CVJitu Logo"
                      className="brightness-0 invert mb-8"
                    />
                  </motion.div>
                  
                  <motion.h2 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-4xl font-poppins font-bold leading-tight"
                  >
                    Automasi Perjalanan <br /> Karirmu dengan AI
                  </motion.h2>
                  <motion.p 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-6 text-white/70 text-lg max-w-sm"
                  >
                    Dapatkan CV ATS-friendly dan skor profesional dalam hitungan detik.
                  </motion.p>
                </div>
              </div>

              <div className="relative z-10 grid grid-cols-2 gap-4 mt-auto">
                <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                  <Sparkles className="w-6 h-6 mb-2 text-yellow-300" />
                  <p className="text-sm font-medium">99% Akurasi AI</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                  <Target className="w-6 h-6 mb-2 text-green-300" />
                  <p className="text-sm font-medium">ATS-Optimized</p>
                </div>
              </div>
            </div>

            {/* Right Panel - Form Area */}
            <div className="bg-white p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
              <div className="max-w-md mx-auto w-full">
                <div className="mb-10">
                  <div className="flex items-center justify-between mb-2">
                    <h1 className="text-3xl font-poppins font-bold text-[var(--neutral-ink)]">
                      Halo Kembali!
                    </h1>
                    <Zap className="lg:hidden w-8 h-8 text-[var(--red-normal)]" />
                  </div>
                  <p className="text-gray-500">
                    Silakan masuk untuk melanjutkan pengecekan CV Anda.
                  </p>
                </div>

                {/* Google Login */}
                <Button
                  onClick={onGoogleLogin}
                  variant="outline"
                  className="w-full h-12 border-gray-200 hover:bg-gray-50 rounded-xl transition-all duration-300 group"
                  disabled={isLoading}
                >
                  <svg className="w-5 h-5 mr-3 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
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
                  <span className="font-semibold text-gray-700">Masuk dengan Google</span>
                </Button>

                <div className="relative my-8">
                  <Separator className="bg-gray-100" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="bg-white px-4 text-xs font-semibold text-gray-400 uppercase tracking-widest">
                      Atau
                    </span>
                  </div>
                </div>

                {/* Email/Password Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-semibold text-gray-700">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="nama@email.com"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (errors.email) setErrors({ ...errors, email: undefined });
                        }}
                        className={`h-12 pl-12 rounded-xl border-gray-200 transition-all duration-300 focus:ring-2 focus:ring-[var(--red-light)] outline-none ${
                          errors.email ? "border-red-500 bg-red-50/30" : "focus:border-[var(--red-normal)]"
                        }`}
                        disabled={isLoading}
                      />
                    </div>
                    <AnimatePresence>
                      {errors.email && (
                        <motion.p 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="text-xs font-medium text-red-500 mt-1 ml-1"
                        >
                          {errors.email}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-semibold text-gray-700">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Masukkan password"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          if (errors.password) setErrors({ ...errors, password: undefined });
                        }}
                        className={`h-12 pl-12 pr-12 rounded-xl border-gray-200 transition-all duration-300 focus:ring-2 focus:ring-[var(--red-light)] outline-none ${
                          errors.password ? "border-red-500 bg-red-50/30" : "focus:border-[var(--red-normal)]"
                        }`}
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    <AnimatePresence>
                      {errors.password && (
                        <motion.p 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="text-xs font-medium text-red-500 mt-1 ml-1"
                        >
                          {errors.password}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="flex items-center justify-between pb-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="remember"
                        checked={rememberMe}
                        onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                        className="rounded-md border-gray-300 text-[var(--red-normal)] focus:ring-[var(--red-normal)]"
                        disabled={isLoading}
                      />
                      <Label htmlFor="remember" className="text-xs font-medium text-gray-500 cursor-pointer">
                        Ingat saya
                      </Label>
                    </div>
                    <Button
                      variant="link"
                      className="text-xs font-semibold text-[var(--red-normal)] hover:text-[var(--red-dark)] p-0 h-auto"
                      onClick={(e) => {
                        e.preventDefault();
                        onNavigateToForgotPassword();
                      }}
                    >
                      Recovery Password
                    </Button>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-[var(--red-normal)] hover:bg-[var(--red-dark)] text-white font-bold rounded-xl shadow-lg shadow-[var(--red-normal)]/20 transition-all duration-300 active:scale-[0.98]"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                        Memproses...
                      </div>
                    ) : (
                      "Login"
                    )}
                  </Button>
                </form>

                <div className="mt-8 text-center">
                  <p className="text-sm text-gray-500">
                    Belum punya akun?{" "}
                    <button
                      type="button"
                      className="text-[var(--red-normal)] font-bold hover:underline ml-1"
                      onClick={onNavigateToRegister}
                      disabled={isLoading}
                    >
                      Sign Up
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

