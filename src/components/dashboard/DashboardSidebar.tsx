"use client";

import { useState } from "react";
import {
  LayoutDashboard,
  BarChart3,
  LogOut,
  X,
  Star,
  CreditCard,
  ChevronDown,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Label } from "../ui/label";
import Image from "next/image";
import { User } from "@/context/AuthContext";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface DashboardSidebarProps {
  onLogout?: () => void;
  user?: User | null;
  isMobile?: boolean;
  onClose?: () => void;
}

export function DashboardSidebar({
  onLogout,
  user,
  isMobile = false,
  onClose,
}: DashboardSidebarProps) {
  const pathname = usePathname();

  const menuItems = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      isActive: pathname === "/dashboard",
    },
    {
      href: "/dashboard/scoring",
      label: "Scoring CV",
      icon: BarChart3,
      isActive: pathname === "/dashboard/scoring",
    },
    {
      label: "Subscription",
      icon: CreditCard,
      isActive: pathname.includes("/dashboard/subscription"),
      subItems: [
        {
          href: "/dashboard/subscription",
          label: "Manajemen",
          isActive: pathname === "/dashboard/subscription",
        },
        {
          href: "/dashboard/subscription/payment",
          label: "Pilih Paket",
          isActive: pathname === "/dashboard/subscription/payment",
        },
        {
          href: "/dashboard/subscription/history",
          label: "Riwayat",
          isActive: pathname === "/dashboard/subscription/history",
        },
      ],
    },
  ];

  const [isSubscriptionOpen, setIsSubscriptionOpen] = useState(
    pathname.includes("/dashboard/subscription"),
  );

  const sidebarClasses = isMobile
    ? "w-80 max-w-[85vw] bg-white border-r border-[var(--border-color)] h-screen flex flex-col shadow-2xl"
    : "fixed left-0 top-0 w-64 bg-white border-r border-[var(--border-color)] h-screen flex flex-col z-40";

  const getProgressColor = (percentage: number) => {
    if (percentage > 50) return "[&>div]:bg-green-500";
    if (percentage >= 20) return "[&>div]:bg-yellow-500";
    return "[&>div]:bg-red-500";
  };

  const getExpirationDate = (premiumSince?: string) => {
    if (!premiumSince) return null;
    try {
      const date = new Date(premiumSince);
      // validity is 6 months
      date.setMonth(date.getMonth() + 6);
      return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch (e) {
      return null;
    }
  };

  return (
    <div className={sidebarClasses}>
      <div className="flex flex-col flex-1">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-[var(--border-color)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Link href="/">
                <Image
                  src="/logo.svg"
                  width={100}
                  height={100}
                  quality={100}
                  alt="logo"
                />
              </Link>
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
            {menuItems.map((item, index) => (
              <li key={index}>
                {item.subItems ? (
                  <div className="space-y-1">
                    <button
                      onClick={() => setIsSubscriptionOpen(!isSubscriptionOpen)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-all duration-200 border-2 ${
                        item.isActive
                          ? "border-[var(--red-light)] font-medium text-[var(--red-normal)]"
                          : "border-transparent text-gray-600 hover:bg-gray-50 hover:text-[var(--neutral-ink)]"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <item.icon className="w-5 h-5 flex-shrink-0" />
                        <span className="truncate">{item.label}</span>
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${
                          isSubscriptionOpen ? "transform rotate-180" : ""
                        }`}
                      />
                    </button>
                    {isSubscriptionOpen && (
                      <ul className="pl-12 pr-4 space-y-1 mt-1">
                        {item.subItems.map((subItem, subIndex) => (
                          <li key={subIndex}>
                            <Link
                               href={subItem.href}
                               onClick={isMobile ? onClose : undefined}
                               className={`block w-full px-3 py-2 rounded-md text-sm transition-colors ${
                                 subItem.isActive
                                   ? "text-[var(--red-normal)] font-medium bg-[var(--red-light)]/50"
                                   : "text-gray-500 hover:text-[var(--neutral-ink)] hover:bg-gray-50"
                               }`}
                            >
                              {subItem.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href!}
                    onClick={isMobile ? onClose : undefined}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 border-2 ${
                      item.isActive
                        ? "bg-[var(--red-light)] border-[var(--red-light)] text-[var(--red-normal)] font-medium transform scale-[1.02]"
                        : "border-transparent text-gray-600 hover:bg-gray-50 hover:text-[var(--neutral-ink)] hover:transform hover:scale-[1.01]"
                    }`}
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </Link>
                )}
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
              <div className="flex flex-col items-start gap-1">
                <Label className="text-xs text-gray-500 flex items-center">
                  <Star className="w-3 h-3 mr-1.5" />
                  Paket Anda
                </Label>
                <Badge
                  variant={user.plan === "Basic" ? "outline" : "default"}
                  className={
                    user.plan !== "Basic"
                      ? "bg-[var(--red-normal)] hover:bg-[var(--red-normal)] text-white text-xs mt-1"
                      : "text-xs mt-1"
                  }
                >
                  {user.plan === "Basic"
                    ? "📦 Paket Basic"
                    : `👑 Paket ${user.plan}`}
                </Badge>
                {user.plan !== "Basic" && user.premiumSince && (
                  <p className="text-[10px] text-gray-500 mt-1 font-medium">
                    Aktif s.d {getExpirationDate(user.premiumSince)}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <Label className="text-xs font-semibold text-gray-700">
                    Kredit Buat CV
                  </Label>
                  <span className="text-xs font-bold text-gray-900">
                    {user.cvCreditsTotal >= 999999
                      ? "∞"
                      : `${user.cvCreditsUsed || 0} / ${user.cvCreditsTotal}`}
                  </span>
                </div>
                {(() => {
                  const percentage =
                    user.cvCreditsTotal >= 999999
                      ? 100
                      : ((user.cvCreditsUsed || 0) /
                          (user.cvCreditsTotal || 1)) *
                        100;
                  return (
                    <Progress
                      value={percentage}
                      className={`h-1.5 ${getProgressColor(100 - percentage)}`}
                    />
                  );
                })()}
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <Label className="text-xs font-semibold text-gray-700">
                    Kredit Scoring AI
                  </Label>
                  <span className="text-xs font-bold text-gray-900">
                    {user.scoringCreditsTotal >= 999999
                      ? "∞"
                      : `${user.scoringCreditsUsed || 0} / ${user.scoringCreditsTotal}`}
                  </span>
                </div>
                {(() => {
                  const percentage =
                    user.scoringCreditsTotal >= 999999
                      ? 100
                      : ((user.scoringCreditsUsed || 0) /
                          (user.scoringCreditsTotal || 1)) *
                        100;
                  return (
                    <Progress
                      value={percentage}
                      className={`h-1.5 ${getProgressColor(100 - percentage)}`}
                    />
                  );
                })()}
              </div>

              {user.plan === "Basic" && (
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <Label className="text-xs font-semibold text-gray-700">
                      Sisa Export PDF Tanpa Watermark
                    </Label>
                    <span className="text-xs font-bold text-gray-900">
                      {user.exportCount || 0} / 2
                    </span>
                  </div>
                  {(() => {
                    const percentage = ((user.exportCount || 0) / 2) * 100;
                    return (
                      <Progress
                        value={percentage}
                        className={`h-1.5 ${getProgressColor(100 - percentage)}`}
                      />
                    );
                  })()}
                  {user.exportCount >= 2 && (
                    <p className="text-[10px] text-red-500 mt-1">
                      Batas tercapai. Export selanjutnya memiliki watermark.
                    </p>
                  )}
                </div>
              )}
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
