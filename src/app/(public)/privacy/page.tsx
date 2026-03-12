import type { Metadata } from "next";
import { PrivacyPolicyPage } from "@/components/PrivacyPolicyPage";

export const metadata: Metadata = {
  title: "Kebijakan Privasi",
};

export default function PrivacyPage() {
  return <PrivacyPolicyPage />;
}
