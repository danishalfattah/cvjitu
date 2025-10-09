import { useState, useEffect } from "react";
import { DashboardSidebar } from "./DashboardSidebar";
import { Dashboard } from "./Dashboard";
import { CVScoringPage } from "./CVScoringPage";
import { Button } from "../ui/button";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface User {
  id: string;
  email: string;
  fullName: string;
  avatar?: string;
  provider?: "email" | "google";
}

interface DashboardLayoutProps {
  onLogout?: () => void;
  user?: User | null;
  onCreateCV?: (lang: "id" | "en") => void;
}

export function DashboardLayout({
  onLogout,
  user,
  onCreateCV,
}: DashboardLayoutProps) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect screen size changes
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
      if (window.innerWidth >= 1024) {
        setIsMobileSidebarOpen(false); // Close mobile sidebar on desktop
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Close sidebar when clicking outside on mobile
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
    switch (activeTab) {
      case "dashboard":
        return <Dashboard onCreateCV={onCreateCV} />;
      case "scoring":
        return <CVScoringPage />;
      default:
        return <Dashboard onCreateCV={onCreateCV} />;
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (isMobile) {
      setIsMobileSidebarOpen(false); // Close mobile sidebar after selection
    }
  };

  return (
    <div className="flex min-h-screen bg-[var(--surface)]">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <DashboardSidebar
          activeTab={activeTab}
          onTabChange={handleTabChange}
          onLogout={onLogout}
          user={user}
          isMobile={false}
        />
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobile && isMobileSidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsMobileSidebarOpen(false)}
            />

            {/* Mobile Sidebar */}
            <motion.div
              id="mobile-sidebar"
              className="fixed left-0 top-0 z-50 lg:hidden"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            >
              <DashboardSidebar
                activeTab={activeTab}
                onTabChange={handleTabChange}
                onLogout={onLogout}
                user={user}
                isMobile={true}
                onClose={() => setIsMobileSidebarOpen(false)}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        {/* Mobile Header */}
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
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-[var(--red-normal)] rounded-md flex items-center justify-center">
                  <span className="text-white font-semibold text-xs">CV</span>
                </div>
                <span className="font-poppins font-semibold text-lg text-[var(--neutral-ink)]">
                  CVJitu
                </span>
              </div>
            </div>

            {/* Mobile User Info */}
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

        {/* Page Content */}
        <div className="w-full">{renderContent()}</div>
      </div>
    </div>
  );
}
