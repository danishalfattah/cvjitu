"use client";

import { useRouter } from "next/navigation";
import { PrivacyPolicyPage } from "@/components/PrivacyPolicyPage";
import { useEffect } from "react";

export default function PrivacyPage() {
  const router = useRouter();

  useEffect(() => {
    document.title = "Kebijakan Privasi - CVJitu";
  }, []);

  return <PrivacyPolicyPage onBack={() => router.back()} />;
}
