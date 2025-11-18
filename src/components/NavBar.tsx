// src/components/NavBar.tsx (UPDATED)
"use client"; // Tambahkan ini jika belum ada

import { useState } from "react";
import { Button } from "./ui/button";
import { LayoutDashboard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useAuth } from "../context/AuthContext"; // --- Impor useAuth ---
import { Skeleton } from "./ui/skeleton"; // --- Impor Skeleton ---
import Link from "next/link";

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

  // Navigation items for staggered animation
  const navItems = [
    { href: "#features", label: "Fitur" },
    { href: "#how-it-works", label: "Cara Kerja" },
    { href: "#why-us", label: "Keunggulan" },
    { href: "#pricing", label: "Harga" },
    { href: "#faq", label: "FAQ" },
  ];

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md border-b border-[var(--border-color)] px-6 py-4 z-50"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.6,
          ease: [0.34, 1.56, 0.64, 1],
          delay: 0.1,
        }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo with bounce animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.5,
              ease: [0.34, 1.56, 0.64, 1],
              delay: 0.2,
            }}
          >
            <Link href="/">
              <Image
                src="/logo.svg"
                width={100}
                height={100}
                quality={100}
                alt="logo"
                className=" "
              />
            </Link>
          </motion.div>

          {/* Desktop Navigation with staggered animation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <motion.a
                key={item.href}
                href={item.href}
                className="text-[var(--neutral-ink)] hover:text-[var(--red-normal)] transition-colors font-medium relative group"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  ease: "easeOut",
                  delay: 0.3 + index * 0.1,
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {item.label}
                {/* Hover underline effect */}
                <motion.span
                  className="absolute -bottom-1 left-0 w-full h-0.5 bg-[var(--red-normal)] origin-left"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.a>
            ))}
          </div>

          {/* Auth buttons with fade-in animation */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.5,
              ease: [0.34, 1.56, 0.64, 1],
              delay: 0.8,
            }}
          >
            {renderAuthButtons()}
          </motion.div>

          {/* Mobile Menu Button with animation */}
          <motion.div
            className="lg:hidden"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.5,
              ease: [0.34, 1.56, 0.64, 1],
              delay: 0.8,
            }}
          >
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
          </motion.div>
        </div>
      </motion.nav>

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
                duration: 0.5,
                ease: [0.34, 1.56, 0.64, 1],
              }}
            >
              <div className="max-w-7xl mx-auto px-6 py-6">
                {/* Navigation Links with staggered animation */}
                <div className="space-y-1 mb-6">
                  {navItems.map((item, index) => (
                    <motion.a
                      key={item.href}
                      href={item.href}
                      onClick={closeMobileMenu}
                      className="block py-3 px-4 text-[var(--neutral-ink)] hover:text-[var(--red-normal)] hover:bg-[var(--red-light)] rounded-lg transition-all font-medium"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{
                        duration: 0.3,
                        ease: "easeOut",
                        delay: index * 0.08,
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {item.label}
                    </motion.a>
                  ))}
                </div>
                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-[var(--border-color)] to-transparent mb-6"></div>

                {/* Auth/Dashboard Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.95 }}
                  transition={{
                    duration: 0.4,
                    ease: [0.34, 1.56, 0.64, 1],
                    delay: 0.4,
                  }}
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
