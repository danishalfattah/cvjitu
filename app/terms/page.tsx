"use client";

import { useRouter } from "next/navigation";
import { TermsOfServicePage } from "@/components/TermsOfServicePage";

export default function TermsPage() {
  const router = useRouter();
  return <TermsOfServicePage onBack={() => router.back()} />;
}
