"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { Language } from "@/lib/translations";

export default function DashboardPage() {
  const router = useRouter();
  const [lang, setLang] = useState<Language>("id");

  useEffect(() => {
    document.title = "Dashboard - CVJitu";
  }, []);

  return (
    <Dashboard
      onCreateCVAction={(lang) => router.push(`/cv-builder?lang=${lang}`)}
      lang={lang}
    />
  );
}
