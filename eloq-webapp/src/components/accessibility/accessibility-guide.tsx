"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, Contrast, Sun, Moon } from "lucide-react";

interface AccessibilityTip {
  id: string;
  title: string;
  description: string;
  content: string;
}

const accessibilityTips: AccessibilityTip[] = [
  {
    id: "keyboard-nav",
    title: "Keyboard Navigation",
    description: "Navigate using Tab and Shift+Tab",
    content:
      "All interactive elements should be accessible via keyboard. Use Tab to move forward and Shift+Tab to move backward through focusable elements.",
  },
  {
    id: "screen-reader",
    title: "Screen Reader Support",
    description: "Semantic HTML and ARIA labels",
    content:
      "Use semantic HTML elements and appropriate ARIA attributes to ensure screen readers can interpret content correctly.",
  },
  {
    id: "contrast",
    title: "Color Contrast",
    description: "Sufficient contrast for readability",
    content:
      "Text and background colors should have sufficient contrast ratio (at least 4.5:1 for normal text) to ensure readability for users with visual impairments.",
  },
  {
    id: "focus-indicators",
    title: "Focus Indicators",
    description: "Visible focus for keyboard users",
    content:
      "All interactive elements should have visible focus indicators to help keyboard users track their position on the page.",
  },
];

export function AccessibilityGuide() {
  const [openTipId, setOpenTipId] = useState<string | null>(null);
  const [highContrast, setHighContrast] = useState(false);
  const [prefersDarkMode, setPrefersDarkMode] = useState(false);

  useEffect(() => {
    // Check user's preference for dark mode
    const darkModeMediaQuery = window.matchMedia(
      "(prefers-color-scheme: dark)"
    );
    setPrefersDarkMode(darkModeMediaQuery.matches);

    const handleDarkModeChange = (e: MediaQueryListEvent) => {
      setPrefersDarkMode(e.matches);
    };

    darkModeMediaQuery.addEventListener("change", handleDarkModeChange);
    return () =>
      darkModeMediaQuery.removeEventListener("change", handleDarkModeChange);
  }, []);

  const toggleTip = (id: string) => {
    setOpenTipId(openTipId === id ? null : id);
  };

  const toggleHighContrast = () => {
    setHighContrast(!highContrast);
    document.documentElement.classList.toggle("high-contrast", !highContrast);
  };

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4">
        <Button
          variant="outline"
          onClick={toggleHighContrast}
          aria-pressed={highContrast}
        >
          <Contrast className="mr-2 h-4 w-4" />
          {highContrast ? "Disable" : "Enable"} High Contrast
        </Button>

        <Button
          variant="outline"
          onClick={toggleDarkMode}
          aria-label={
            prefersDarkMode ? "Switch to light mode" : "Switch to dark mode"
          }
        >
          {prefersDarkMode ? (
            <>
              <Sun className="mr-2 h-4 w-4" />
              Light Mode
            </>
          ) : (
            <>
              <Moon className="mr-2 h-4 w-4" />
              Dark Mode
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {accessibilityTips.map((tip) => (
          <Card key={tip.id} className="overflow-hidden">
            <CardHeader
              className="cursor-pointer hover:bg-muted transition-colors"
              onClick={() => toggleTip(tip.id)}
              aria-expanded={openTipId === tip.id}
              aria-controls={`tip-content-${tip.id}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{tip.title}</CardTitle>
                  <CardDescription>{tip.description}</CardDescription>
                </div>
                {openTipId === tip.id ? (
                  <ChevronDown className="h-5 w-5" />
                ) : (
                  <ChevronRight className="h-5 w-5" />
                )}
              </div>
            </CardHeader>

            {openTipId === tip.id && (
              <CardContent
                id={`tip-content-${tip.id}`}
                className="animate-in slide-in-from-top-2 duration-200"
              >
                <p className="text-muted-foreground">{tip.content}</p>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
