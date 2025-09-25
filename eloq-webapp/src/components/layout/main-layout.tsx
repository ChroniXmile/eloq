"use client";

import { ReactNode } from "react";
import { Navigation } from "@/components/layout/navigation";
import { Footer } from "@/components/layout/footer";
import { SkipToContent } from "@/components/accessibility/skip-to-content";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <SkipToContent />
      <Navigation />
      <main
        id="main-content"
        className="flex-1 container py-6 sm:py-8 focus:outline-none"
        tabIndex={-1}
      >
        {children}
      </main>
      <Footer />
    </div>
  );
}
