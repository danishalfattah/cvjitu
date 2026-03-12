import type { Metadata } from "next";
import { TermsOfServicePage } from "@/components/TermsOfServicePage";

export const metadata: Metadata = {
  title: "Syarat & Ketentuan",
};

export default function TermsPage() {
  return <TermsOfServicePage />;
}
