"use client";

import { useRouter } from "next/navigation";
import { TermsOfServicePage } from "@/src/components/TermsOfServicePage";
import { useEffect } from "react";

export default function TermsPage() {
  const router = useRouter();

  useEffect(() => {
    document.title = "Syarat & Ketentuan - CVJitu";
  }, []);

  return <TermsOfServicePage onBack={() => router.back()} />;
}
