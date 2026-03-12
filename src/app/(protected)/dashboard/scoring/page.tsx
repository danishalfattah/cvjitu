"use client";

import { useEffect } from "react";
import { CVScoringPage } from "@/components/dashboard/CVScoringPage";

export default function ScoringPage() {
  useEffect(() => {
    document.title = "Scoring CV - CVJitu";
  }, []);

  return <CVScoringPage lang="id" />;
}
