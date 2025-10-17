// src/components/NavBar.tsx (UPDATED)
"use client"; // Tambahkan ini jika belum ada

import { useState } from "react";
import { Button } from "./ui/button";
import { LayoutDashboard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useAuth } from "../context/AuthContext"; // --- Impor useAuth ---
import { Skeleton } from "./ui/skeleton"; // --- Impor Skeleton ---

// ... (interface User dan NavBarProps tetap sama) ...
export interface User {
  id: string;
  email: string;
  fullName: string;
  avatar?: string;
  provider?: "email" | "google";
}

interface NavBarProps {
  user?: User | null;
  onLogin?: () => void;
  onRegister?: () => void;
  onLogout?: () => void;
  onDashboard?: () => void;
}

export function NavBar({
  user,
  onLogin,
  onRegister,
  onLogout,
  onDashboard,
}: NavBarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isLoading } = useAuth(); // --- PERBAIKAN: Ambil isLoading dari context ---

  const toggleMobileMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const renderAuthButtons = () => {
    // --- PERBAIKAN: Tampilkan skeleton saat loading ---
    if (isLoading) {
      return (
        <div className="hidden lg:flex items-center space-x-4">
          <Skeleton className="h-9 w-20 rounded-md" />
          <Skeleton className="h-9 w-20 rounded-md" />
        </div>
      );
    }

    if (user) {
      return (
        <div className="hidden lg:flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={onDashboard}
            className="text-[var(--neutral-ink)] hover:text-[var(--red-normal)]"
          >
            <LayoutDashboard className="w-4 h-4 mr-2" />
            Dashboard
          </Button>
        </div>
      );
    }

    return (
      <div className="hidden lg:flex items-center space-x-4">
        <Button
          variant="ghost"
          onClick={onLogin}
          className="text-[var(--neutral-ink)] hover:text-[var(--red-normal)]"
        >
          Sign In
        </Button>
        <Button
          onClick={onRegister}
          className="bg-[var(--red-normal)] hover:bg-[var(--red-normal-hover)] text-white"
        >
          Sign Up
        </Button>
      </div>
    );
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md border-b border-[var(--border-color)] px-6 py-4 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="">
            <Image
              src="/logo.svg"
              width={100}
              height={100}
              quality={100}
              alt="logo"
              className=" "
            />
          </div>

          <div className="hidden lg:flex items-center space-x-8">
            <a
              href="#features"
              className="text-[var(--neutral-ink)] hover:text-[var(--red-normal)] transition-colors font-medium"
            >
              Fitur
            </a>
            <a
              href="#how-it-works"
              className="text-[var(--neutral-ink)] hover:text-[var(--red-normal)] transition-colors font-medium"
            >
              Cara Kerja
            </a>
            <a
              href="#why-us"
              className="text-[var(--neutral-ink)] hover:text-[var(--red-normal)] transition-colors font-medium"
            >
              Keunggulan
            </a>
            <a
              href="#pricing"
              className="text-[var(--neutral-ink)] hover:text-[var(--red-normal)] transition-colors font-medium"
            >
              Harga
            </a>
            <a
              href="#faq"
              className="text-[var(--neutral-ink)] hover:text-[var(--red-normal)] transition-colors font-medium"
            >
              FAQ
            </a>
          </div>

          {/* --- PERBAIKAN: Panggil fungsi render --- */}
          {renderAuthButtons()}

          {/* ... (sisa kode untuk mobile menu tetap sama) ... */}
          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <motion.button
              onClick={toggleMobileMenu}
              className="relative w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-6 h-6 relative flex items-center justify-center">
                {/* Hamburger Lines */}
                <motion.span
                  className="absolute block w-6 h-0.5 bg-[var(--neutral-ink)] rounded-full"
                  animate={{
                    rotate: isMobileMenuOpen ? 45 : 0,
                    y: isMobileMenuOpen ? 0 : -6,
                  }}
                  transition={{
                    duration: 0.3,
                    ease: "easeInOut",
                  }}
                />
                <motion.span
                  className="absolute block w-6 h-0.5 bg-[var(--neutral-ink)] rounded-full"
                  animate={{
                    opacity: isMobileMenuOpen ? 0 : 1,
                    scale: isMobileMenuOpen ? 0.8 : 1,
                  }}
                  transition={{
                    duration: 0.3,
                    ease: "easeInOut",
                  }}
                />
                <motion.span
                  className="absolute block w-6 h-0.5 bg-[var(--neutral-ink)] rounded-full"
                  animate={{
                    rotate: isMobileMenuOpen ? -45 : 0,
                    y: isMobileMenuOpen ? 0 : 6,
                  }}
                  transition={{
                    duration: 0.3,
                    ease: "easeInOut",
                  }}
                />
              </div>
            </motion.button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={closeMobileMenu}
            />

            {/* Mobile Menu Dropdown Panel */}
            <motion.div
              className="fixed top-[75px] left-0 right-0 bg-white/95 backdrop-blur-md z-50 lg:hidden shadow-2xl border-b border-[var(--border-color)]"
              initial={{ y: "-100%", opacity: 0, pointerEvents: "none" }}
              animate={{ y: 0, opacity: 1, pointerEvents: "auto" }}
              exit={{ y: "-100%", opacity: 0, pointerEvents: "none" }}
              transition={{
                duration: 0.4,
                ease: [0.23, 1, 0.32, 1],
              }}
            >
              <div className="max-w-7xl mx-auto px-6 py-6">
                {/* Navigation Links */}
                <div className="space-y-1 mb-6">
                  <a
                    href="#features"
                    onClick={closeMobileMenu}
                    className="block py-3 px-4 text-[var(--neutral-ink)] hover:text-[var(--red-normal)] hover:bg-[var(--red-light)] rounded-lg transition-all font-medium"
                  >
                    Fitur
                  </a>
                  <a
                    href="#how-it-works"
                    onClick={closeMobileMenu}
                    className="block py-3 px-4 text-[var(--neutral-ink)] hover:text-[var(--red-normal)] hover:bg-[var(--red-light)] rounded-lg transition-all font-medium"
                  >
                    Cara Kerja
                  </a>
                  <a
                    href="#why-us"
                    onClick={closeMobileMenu}
                    className="block py-3 px-4 text-[var(--neutral-ink)] hover:text-[var(--red-normal)] hover:bg-[var(--red-light)] rounded-lg transition-all font-medium"
                  >
                    Keunggulan
                  </a>
                  <a
                    href="#pricing"
                    onClick={closeMobileMenu}
                    className="block py-3 px-4 text-[var(--neutral-ink)] hover:text-[var(--red-normal)] hover:bg-[var(--red-light)] rounded-lg transition-all font-medium"
                  >
                    Harga
                  </a>
                  <a
                    href="#faq"
                    onClick={closeMobileMenu}
                    className="block py-3 px-4 text-[var(--neutral-ink)] hover:text-[var(--red-normal)] hover:bg-[var(--red-light)] rounded-lg transition-all font-medium"
                  >
                    FAQ
                  </a>
                </div>
                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-[var(--border-color)] to-transparent mb-6"></div>

                {/* Auth/Dashboard Section */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: 0.35 }}
                >
                  {user ? (
                    <motion.button
                      onClick={() => {
                        onDashboard?.();
                        closeMobileMenu();
                      }}
                      className="w-full py-3 px-4 text-[var(--neutral-ink)] hover:text-[var(--red-normal)] bg-white/80 hover:bg-[var(--red-light)] border border-[var(--border-color)] rounded-lg transition-all font-medium flex items-center justify-center gap-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <LayoutDashboard className="w-5 h-5" />
                      <span>Dashboard</span>
                    </motion.button>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      <motion.button
                        onClick={() => {
                          onLogin?.();
                          closeMobileMenu();
                        }}
                        className="py-3 px-4 text-[var(--neutral-ink)] hover:text-[var(--red-normal)] bg-white/80 hover:bg-[var(--red-light)] border border-[var(--border-color)] rounded-lg transition-all font-medium"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Sign In
                      </motion.button>
                      <motion.button
                        onClick={() => {
                          onRegister?.();
                          closeMobileMenu();
                        }}
                        className="py-3 px-4 bg-[var(--red-normal)] hover:bg-[var(--red-normal-hover)] text-white rounded-lg transition-all font-medium"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Sign Up
                      </motion.button>
                    </div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
