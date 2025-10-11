"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/context/AuthContext";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { toast } from "sonner";

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    document.title = "Dashboard - CVJitu";
  }, []);

  useEffect(() => {
    if (!isAuthenticated) router.replace("/login");
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return (
    <DashboardLayout
      user={user}
      onLogout={() => {
        logout();
        toast.success("Berhasil keluar.");
        router.replace("/");
      }}
      onCreateCV={(lang) => router.push(`/cv-builder?lang=${lang}`)}
    />
  );
}
