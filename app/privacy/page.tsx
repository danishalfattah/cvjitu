"use client";

import { useRouter } from "next/navigation";
import { PrivacyPolicyPage } from "@/components/PrivacyPolicyPage";

export default function PrivacyPage() {
  const router = useRouter();
  return <PrivacyPolicyPage onBack={() => router.push("/register")} />;
}
