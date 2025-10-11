import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import { Checkbox } from "./ui/checkbox";
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import Image from "next/image";

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
    <div className="min-h-screen bg-[var(--surface)] flex items-center justify-center p-6">
      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Register Form */}
        <div className="w-full max-w-md mx-auto lg:mx-0">
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
                <div className="flex items-center space-x-2">
                  <Image
                    src="/logo.svg"
                    width={85}
                    height={85}
                    quality={100}
                    alt="logo"
                    className=""
                  />
                </div>
              </div>
              <div>
                <CardTitle className="text-2xl font-poppins text-[var(--neutral-ink)]">
                  Buat Akun Baru
                </CardTitle>
                <p className="text-gray-600 mt-2">
                  Mulai perjalanan karir Anda bersama CVJitu hari ini.
                </p>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Google Register */}
              <Button
                onClick={onGoogleRegister}
                variant="outline"
                className="w-full border-[var(--border-color)] hover:bg-[var(--red-light)]"
                disabled={isLoading}
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
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
                Daftar dengan Google
              </Button>

              <div className="relative">
                <Separator />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="bg-white px-3 text-sm text-gray-500">
                    atau
                  </span>
                </div>
              </div>

              {/* Registration Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Nama Lengkap</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Masukkan nama lengkap"
                      value={formData.fullName}
                      onChange={(e) =>
                        handleInputChange("fullName", e.target.value)
                      }
                      className={`pl-10 border-2 ${
                        errors.fullName
                          ? "border-red-500"
                          : "border-gray-300 focus:border-[var(--red-normal)]"
                      }`}
                      disabled={isLoading}
                    />
                  </div>
                  {errors.fullName && (
                    <p className="text-sm text-red-600">{errors.fullName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="nama@example.com"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      className={`pl-10 border-2 ${
                        errors.email
                          ? "border-red-500"
                          : "border-gray-300 focus:border-[var(--red-normal)]"
                      }`}
                      disabled={isLoading}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Minimal 8 karakter"
                      value={formData.password}
                      onChange={(e) =>
                        handleInputChange("password", e.target.value)
                      }
                      className={`pl-10 pr-10 border-2 ${
                        errors.password
                          ? "border-red-500"
                          : "border-gray-300 focus:border-[var(--red-normal)]"
                      }`}
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-auto p-1 text-gray-400 hover:text-gray-600"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-600">{errors.password}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Ulangi password"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        handleInputChange("confirmPassword", e.target.value)
                      }
                      className={`pl-10 pr-10 border-2 ${
                        errors.confirmPassword
                          ? "border-red-500"
                          : "border-gray-300 focus:border-[var(--red-normal)]"
                      }`}
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-auto p-1 text-gray-400 hover:text-gray-600"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-600">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="agreeToTerms"
                      checked={!!formData.agreeToTerms}
                      onCheckedChange={(checked) =>
                        handleInputChange("agreeToTerms", checked as boolean)
                      }
                      className="border-2 border-gray-300 mt-0.5"
                      disabled={isLoading}
                    />
                    <Label
                      htmlFor="agreeToTerms"
                      className="text-sm text-gray-600 leading-relaxed flex-1"
                    >
                      <span className="inline">Saya menyetujui </span>
                      <Button
                        variant="link"
                        className="text-[var(--red-normal)] hover:text-[var(--red-normal-hover)] p-0 h-auto text-sm inline"
                        onClick={onNavigateToTerms}
                        type="button"
                      >
                        Syarat & Ketentuan
                      </Button>
                      <span className="inline"> dan </span>
                      <Button
                        variant="link"
                        className="text-[var(--red-normal)] hover:text-[var(--red-normal-hover)] p-0 h-auto text-sm inline"
                        onClick={onNavigateToPrivacy}
                        type="button"
                      >
                        Kebijakan Privasi
                      </Button>
                    </Label>
                  </div>
                  {errors.agreeToTerms && (
                    <p className="text-sm text-red-600">
                      {errors.agreeToTerms}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[var(--red-normal)] hover:bg-[var(--red-normal-hover)] text-white"
                  disabled={isLoading}
                >
                  {isLoading ? "Membuat Akun..." : "Buat Akun"}
                </Button>
              </form>

              <div className="text-center text-sm text-gray-600">
                Sudah punya akun?{" "}
                <Button
                  variant="link"
                  className="text-[var(--red-normal)] hover:text-[var(--red-normal-hover)] p-0 h-auto font-medium"
                  onClick={onNavigateToLogin}
                  disabled={isLoading}
                >
                  Masuk sekarang
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Side - Illustration */}
        <div className="hidden lg:flex flex-col items-center justify-center space-y-6">
          <div className="relative">
            <div className="bg-gradient-to-br from-[var(--red-light)] to-white rounded-2xl shadow-xl p-8">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFtJTIwc3VjY2VzcyUyMGNvbGxhYm9yYXRpb258ZW58MXx8fHwxNzU5NjYxNzA3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Team Success"
                className="w-80 h-64 object-cover rounded-xl"
              />
            </div>
            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 bg-[var(--success)] text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
              Gratis Selamanya
            </div>
            <div className="absolute -bottom-4 -left-4 bg-white px-4 py-2 rounded-full text-sm font-medium shadow-lg border border-[var(--border-color)]">
              🚀 Mulai Sekarang
            </div>
          </div>
          <div className="text-center max-w-md">
            <h2 className="text-2xl font-poppins font-bold text-[var(--neutral-ink)] mb-2">
              Mulai Perjalanan Karir Anda
            </h2>
            <p className="text-gray-600">
              Bergabung dengan ribuan profesional yang sudah meningkatkan karir
              mereka dengan CVJitu
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
