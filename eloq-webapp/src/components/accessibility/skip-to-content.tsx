"use client";

import { useEffect, useState } from "react";

export function SkipToContent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        setIsVisible(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <a
      href="#main-content"
      className={`fixed top-4 left-4 z-50 bg-background border border-primary rounded-md px-4 py-2 text-primary font-medium transition-all duration-200 ${
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 -translate-y-4 pointer-events-none"
      }`}
    >
      Skip to content
    </a>
  );
}
