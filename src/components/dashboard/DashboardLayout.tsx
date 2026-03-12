// src/components/dashboard/DashboardLayout.tsx

"use client";

import { useState, useEffect, type ReactNode } from "react";
import { DashboardSidebar } from "./DashboardSidebar";
import { Button } from "../ui/button";
import { Menu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { User } from "@/context/AuthContext";
import Link from "next/link";

interface DashboardLayoutProps {
  onLogout?: () => void;
  user?: User | null;
  children: ReactNode;
}

export function DashboardLayout({
  onLogout,
  user,
  children,
}: DashboardLayoutProps) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    const checkScreenSize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsMobile(window.innerWidth < 1024);
        if (window.innerWidth >= 1024) {
          setIsMobileSidebarOpen(false);
        }
      }, 150);
    };

    // Run immediately on mount without debounce
    setIsMobile(window.innerWidth < 1024);

    window.addEventListener("resize", checkScreenSize);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobile && isMobileSidebarOpen) {
        const sidebar = document.getElementById("mobile-sidebar");
        const target = event.target as Node;
        if (sidebar && !sidebar.contains(target)) {
          setIsMobileSidebarOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobile, isMobileSidebarOpen]);

  const renderContent = () => {
    return children;
  };

  return (
    <div className="flex min-h-screen bg-[var(--surface)]">
      <div className="hidden lg:block">
        <DashboardSidebar onLogout={onLogout} user={user} isMobile={false} />
      </div>

      <AnimatePresence>
        {isMobile && isMobileSidebarOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsMobileSidebarOpen(false)}
            />
            <motion.div
              id="mobile-sidebar"
              className="fixed left-0 top-0 z-50 lg:hidden"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            >
              <DashboardSidebar
                onLogout={onLogout}
                user={user}
                isMobile={true}
                onClose={() => setIsMobileSidebarOpen(false)}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 lg:ml-64 min-w-0">
        <div className="lg:hidden bg-white/95 backdrop-blur-md border-b border-[var(--border-color)] px-4 py-3 sticky top-0 z-30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileSidebarOpen(true)}
                className="p-2"
              >
                <Menu className="w-5 h-5" />
              </Button>
              <div className="">
                <Link href="/">
                  <Image
                    src="/logo.svg"
                    width={80}
                    height={80}
                    quality={100}
                    alt="CVJitu Logo"
                    className=""
                  />
                </Link>
              </div>
            </div>
            {user && (
              <div className="flex items-center space-x-2">
                <div className="text-right">
                  <p className="text-sm font-medium text-[var(--neutral-ink)] truncate max-w-32">
                    {user.fullName}
                  </p>
                </div>
                <div className="w-8 h-8 bg-[var(--red-normal)] rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-xs">
                    {user.fullName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="w-full">{renderContent()}</div>
      </div>
    </div>
  );
}
