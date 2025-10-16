"use client";

import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "@/components/ui/sonner";
import type { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      forcedTheme="light"
    >
      <AuthProvider>
        {children}
        <Toaster position="bottom-right" richColors />
      </AuthProvider>
    </ThemeProvider>
  );
}
