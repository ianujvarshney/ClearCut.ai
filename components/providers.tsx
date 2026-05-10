"use client";

import { ThemeProvider } from "next-themes";
import { ReactNode } from "react";
import { ToastProvider } from "@/components/ui/toast";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <ToastProvider>{children}</ToastProvider>
    </ThemeProvider>
  );
}
