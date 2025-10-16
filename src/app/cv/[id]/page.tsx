// app/cv/[id]/page.tsx
"use client";

import { Suspense } from "react";
import { CVPreviewPage } from "@/components/CVPreviewPage";

function CVPreview() {
  return <CVPreviewPage />;
}

export default function CVPreviewRoute() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CVPreview />
    </Suspense>
  );
}
