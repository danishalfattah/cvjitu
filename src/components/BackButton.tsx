"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export function BackButton() {
  const router = useRouter();

  return (
    <Button
      variant="ghost"
      onClick={() => router.back()}
      className="text-gray-500 hover:text-[var(--red-normal)]"
    >
      <ArrowLeft className="w-4 h-4 mr-2" />
      Kembali
    </Button>
  );
}
