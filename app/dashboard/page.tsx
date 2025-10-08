"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/context/AuthContext";
import { DashboardLayout } from "@/components/DashboardLayout";
import { toast } from "sonner";

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();

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
      onCreateCV={() => router.push("/cvbuilder")}
    />
  );
}
