import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import { Checkbox } from "./ui/checkbox";
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface LoginPageProps {
  onLogin: (email: string, password: string) => void;
  onGoogleLogin: () => void;
  onNavigateToRegister: () => void;
  onBack: () => void;
  isLoading?: boolean;
}

export function LoginPage({ 
  onLogin, 
  onGoogleLogin, 
  onNavigateToRegister, 
  onBack,
  isLoading = false 
}: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<{email?: string; password?: string}>({});

  const validateForm = () => {
    const newErrors: {email?: string; password?: string} = {};
    
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
    <div className="min-h-screen bg-[var(--surface)] flex items-center justify-center p-6">
      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-8 items-center">
        
        {/* Left Side - Login Form */}
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
                  <div className="w-8 h-8 bg-[var(--red-normal)] rounded-lg flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">CV</span>
                  </div>
                  <span className="font-poppins font-semibold text-xl text-[var(--neutral-ink)]">CVJitu</span>
                </div>
              </div>
              <div>
                <CardTitle className="text-2xl font-poppins text-[var(--neutral-ink)]">
                  Masuk ke Akun Anda
                </CardTitle>
                <p className="text-gray-600 mt-2">
                  Selamat datang kembali! Silakan masuk ke akun Anda.
                </p>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Google Login */}
              <Button 
                onClick={onGoogleLogin}
                variant="outline" 
                className="w-full border-[var(--border-color)] hover:bg-[var(--red-light)]"
                disabled={isLoading}
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Masuk dengan Google
              </Button>

              <div className="relative">
                <Separator />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="bg-white px-3 text-sm text-gray-500">atau</span>
                </div>
              </div>

              {/* Email/Password Form */}
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
                        if (errors.email) setErrors({...errors, email: undefined});
                      }}
                      className={`pl-10 border-2 ${errors.email ? 'border-red-500' : 'border-gray-300 focus:border-[var(--red-normal)]'}`}
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
                      placeholder="Masukkan password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errors.password) setErrors({...errors, password: undefined});
                      }}
                      className={`pl-10 pr-10 border-2 ${errors.password ? 'border-red-500' : 'border-gray-300 focus:border-[var(--red-normal)]'}`}
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
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-600">{errors.password}</p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                      className="border-2 border-gray-300"
                      disabled={isLoading}
                    />
                    <Label htmlFor="remember" className="text-sm text-gray-600">Ingat saya</Label>
                  </div>
                  <Button variant="link" className="text-[var(--red-normal)] hover:text-[var(--red-normal-hover)] p-0 h-auto">
                    Lupa password?
                  </Button>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-[var(--red-normal)] hover:bg-[var(--red-normal-hover)] text-white"
                  disabled={isLoading}
                >
                  {isLoading ? "Memproses..." : "Masuk"}
                </Button>
              </form>

              <div className="text-center text-sm text-gray-600">
                Belum punya akun?{" "}
                <Button 
                  variant="link" 
                  className="text-[var(--red-normal)] hover:text-[var(--red-normal-hover)] p-0 h-auto font-medium"
                  onClick={onNavigateToRegister}
                  disabled={isLoading}
                >
                  Daftar sekarang
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
                src="https://images.unsplash.com/photo-1551836022-deb4988cc6c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b3JrJTIwc3VjY2Vzc3xlbnwxfHx8fDE3NTk2NjE3MDd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Professional Success"
                className="w-80 h-64 object-cover rounded-xl"
              />
            </div>
            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 bg-[var(--red-normal)] text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
              Tingkatkan Karir
            </div>
            <div className="absolute -bottom-4 -left-4 bg-white px-4 py-2 rounded-full text-sm font-medium shadow-lg border border-[var(--border-color)]">
              ✨ AI Powered
            </div>
          </div>
          <div className="text-center max-w-md">
            <h2 className="text-2xl font-poppins font-bold text-[var(--neutral-ink)] mb-2">
              Bergabunglah dengan CVJitu
            </h2>
            <p className="text-gray-600">
              Buat CV profesional yang ATS-friendly dan tingkatkan peluang karir Anda dengan bantuan AI
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
