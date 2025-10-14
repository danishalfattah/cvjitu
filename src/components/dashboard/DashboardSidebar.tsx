import { LayoutDashboard, BarChart3, LogOut, X, Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Label } from "../ui/label";
import Image from "next/image";
import { User } from "@/src/context/AuthContext";

interface DashboardSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout?: () => void;
  user?: User | null;
  isMobile?: boolean;
  onClose?: () => void;
}

export function DashboardSidebar({
  activeTab,
  onTabChange,
  onLogout,
  user,
  isMobile = false,
  onClose,
}: DashboardSidebarProps) {
  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      id: "scoring",
      label: "Scoring CV",
      icon: BarChart3,
    },
  ];

  const sidebarClasses = isMobile
    ? "w-80 max-w-[85vw] bg-white border-r border-[var(--border-color)] h-screen flex flex-col shadow-2xl"
    : "fixed left-0 top-0 w-64 bg-white border-r border-[var(--border-color)] h-screen flex flex-col z-40";

  return (
    <div className={sidebarClasses}>
      <div className="flex flex-col flex-1">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-[var(--border-color)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Image
                src="/logo.svg"
                width={100}
                height={100}
                quality={100}
                alt="logo"
              />
            </div>
            {isMobile && onClose && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="p-2 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </Button>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 flex-grow overflow-y-auto">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                    activeTab === item.id
                      ? "bg-[var(--red-light)] text-[var(--red-normal)] font-medium transform scale-[1.02]"
                      : "text-gray-600 hover:bg-gray-50 hover:text-[var(--neutral-ink)] hover:transform hover:scale-[1.01]"
                  }`}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="flex-shrink-0">
        {/* Account Status & Credits */}
        {user && (
          <div className="p-4 border-t border-[var(--border-color)] space-y-4">
            <div className="p-3 bg-gray-50 rounded-lg border border-[var(--border-color)]">
              <div className="flex flex-col items-start gap-2">
                <Label className="text-xs text-gray-500 flex items-center">
                  <Star className="w-3 h-3 mr-1.5" />
                  Paket Anda
                </Label>
                <Badge
                  variant={user.plan === "Basic" ? "outline" : "default"}
                  className={
                    user.plan !== "Basic"
                      ? "bg-[var(--red-normal)] text-white text-xs"
                      : "text-xs"
                  }
                >
                  {user.plan}
                </Badge>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <Label className="text-xs text-gray-500">
                    Kredit Buat CV
                  </Label>
                  <span className="text-xs font-medium text-gray-600">
                    {user.cvCreditsUsed} / {user.cvCreditsTotal}
                  </span>
                </div>
                <Progress
                  value={(user.cvCreditsUsed / user.cvCreditsTotal) * 100}
                  className="h-1.5"
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <Label className="text-xs text-gray-500">
                    Kredit Scoring AI
                  </Label>
                  <span className="text-xs font-medium text-gray-600">
                    {user.scoringCreditsUsed} / {user.scoringCreditsTotal}
                  </span>
                </div>
                <Progress
                  value={
                    (user.scoringCreditsUsed / user.scoringCreditsTotal) * 100
                  }
                  className="h-1.5"
                />
              </div>
            </div>
          </div>
        )}

        {/* User Profile & Logout */}
        {user && (
          <div className="p-4 border-t border-[var(--border-color)] bg-gray-50/50">
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-[var(--border-color)] shadow-sm">
                <Avatar
                  className={`${
                    isMobile ? "h-10 w-10" : "h-8 w-8"
                  } ring-2 ring-[var(--red-normal)]/10`}
                >
                  <AvatarImage src={user.avatar} alt={user.fullName} />
                  <AvatarFallback className="bg-[var(--red-normal)] text-white text-xs font-semibold">
                    {user.fullName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p
                    className={`${
                      isMobile ? "text-sm" : "text-sm"
                    } font-semibold text-[var(--neutral-ink)] truncate`}
                  >
                    {user.fullName}
                  </p>
                  <p
                    className={`${
                      isMobile ? "text-xs" : "text-xs"
                    } text-gray-500 truncate`}
                  >
                    {user.email}
                  </p>
                </div>
              </div>
              <Button
                onClick={onLogout}
                variant="ghost"
                size="sm"
                className="w-full justify-start text-gray-600 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
              >
                <LogOut className="w-4 h-4 mr-2" />
                <span>Keluar</span>
              </Button>
            </div>
          </div>
        )}

        {/* Copyright */}
        <div className="p-4 border-t border-[var(--border-color)]">
          <p className="text-xs text-gray-400 text-center">
            © {new Date().getFullYear()} CVJitu. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
